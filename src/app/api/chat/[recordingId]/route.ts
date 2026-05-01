import { createClient } from "@/lib/supabase/server";
import { streamChat } from "@/lib/ai/chat";
import { z } from "zod";
import type { ChatRole } from "@/types/domain";

export const runtime = "nodejs"; // Anthropic SDK works best on node runtime
export const maxDuration = 60;

const bodySchema = z.object({ message: z.string().min(1).max(4000) });

export async function POST(
  request: Request,
  ctx: { params: Promise<{ recordingId: string }> },
) {
  const { recordingId } = await ctx.params;
  const { message } = bodySchema.parse(await request.json());

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Load transcript (RLS scopes to user)
  const { data: tr, error: trErr } = await supabase
    .from("transcripts")
    .select("full_text")
    .eq("recording_id", recordingId)
    .single();
  if (trErr || !tr) return new Response("Transcript not found", { status: 404 });

  // Get-or-create the chat row
  let { data: chat } = await supabase
    .from("chats")
    .select("id")
    .eq("recording_id", recordingId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!chat) {
    const { data, error } = await supabase
      .from("chats")
      .insert({ recording_id: recordingId, user_id: user.id })
      .select("id")
      .single();
    if (error || !data)
      return new Response(`Cannot create chat: ${error?.message}`, { status: 500 });
    chat = data;
  }

  // Load history (last 20 messages)
  const { data: history } = await supabase
    .from("messages")
    .select("role, content")
    .eq("chat_id", chat.id)
    .order("created_at", { ascending: true })
    .limit(20);

  // Persist the user message immediately
  await supabase.from("messages").insert({
    chat_id: chat.id,
    user_id: user.id,
    role: "user",
    content: message,
  });

  // Start the Claude stream
  const claudeStream = streamChat({
    transcript: tr.full_text,
    history: (history ?? []) as { role: ChatRole; content: string }[],
    userMessage: message,
  });

  const encoder = new TextEncoder();
  let assembled = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of claudeStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const piece = event.delta.text;
            assembled += piece;
            controller.enqueue(encoder.encode(piece));
          }
        }
        const final = await claudeStream.finalMessage();
        await supabase.from("messages").insert({
          chat_id: chat!.id,
          user_id: user.id,
          role: "assistant",
          content: assembled,
          tokens_in: final.usage?.input_tokens ?? null,
          tokens_out: final.usage?.output_tokens ?? null,
        });
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Accel-Buffering": "no",
    },
  });
}
