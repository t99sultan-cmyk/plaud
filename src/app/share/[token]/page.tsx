import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ExternalLink,
  FileAudio,
  Sparkles,
  MessagesSquare,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { TranscriptView } from "@/components/recording/transcript-view";
import { SummaryView } from "@/components/recording/summary-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { YandexMetrica } from "@/components/yandex-metrica";
import { cn, formatDuration, formatRelativeTime } from "@/lib/utils";
import type { Recording, Summary, Transcript } from "@/types/domain";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supa = createAdminClient();
  const { data } = await supa
    .from("recordings")
    .select("title, duration_sec")
    .eq("share_token", token)
    .single();

  if (!data) return { title: "VoiceApp · Share" };
  return {
    title: `${data.title} — VoiceApp`,
    description: `Расшифровка и краткое содержание записи (${formatDuration(
      data.duration_sec,
    )}). Сделано с VoiceApp — транскрипция со спикерами от 1 990 ₸/мес.`,
    openGraph: {
      title: `${data.title} — VoiceApp`,
      description: "Транскрипция, краткое содержание и чат с записью",
    },
  };
}

export default async function PublicSharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supa = createAdminClient();

  // Token-gated read: bypass RLS via service role
  const { data: recording } = await supa
    .from("recordings")
    .select("*")
    .eq("share_token", token)
    .single<Recording>();
  if (!recording || recording.status !== "ready") notFound();

  const [{ data: transcript }, { data: summary }] = await Promise.all([
    supa
      .from("transcripts")
      .select("*")
      .eq("recording_id", recording.id)
      .maybeSingle<Transcript>(),
    supa
      .from("summaries")
      .select("*")
      .eq("recording_id", recording.id)
      .maybeSingle<Summary>(),
  ]);

  // Audio URL signed temporarily for player
  const { data: signedAudio } = await supa.storage
    .from("recordings")
    .createSignedUrl(recording.storage_path, 60 * 60);
  const audioUrl = signedAudio?.signedUrl ?? "";

  return (
    <main className="min-h-svh bg-background">
      <YandexMetrica />
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="text-base font-semibold tracking-tight">
            Voice<span className="text-primary">App</span>
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          >
            Создать свой
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 animate-in fade-in slide-in-from-bottom-2 duration-500 md:px-6 md:py-8">
        {/* Public-share badge */}
        <div className="flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1.5 text-xs text-muted-foreground border border-primary/15 w-fit">
          <ExternalLink className="size-3 text-primary" />
          <span>Публичная запись · только для просмотра</span>
        </div>

        {/* Title block */}
        <header className="space-y-2.5">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {recording.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatDuration(recording.duration_sec)} · {formatRelativeTime(recording.created_at)}
          </p>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="summary">
          <div className="sticky top-14 z-10 -mx-4 border-b border-border/40 bg-background/85 px-4 py-2 backdrop-blur-md md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="summary" className="flex-1 gap-1.5 md:flex-initial">
                <Sparkles className="size-3.5" />
                Сводка
              </TabsTrigger>
              <TabsTrigger value="transcript" className="flex-1 gap-1.5 md:flex-initial">
                <FileAudio className="size-3.5" />
                Транскрипт
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="summary" className="mt-5">
            <SummaryView summary={summary ?? null} />
          </TabsContent>
          <TabsContent value="transcript" className="mt-5">
            <TranscriptView
              audioUrl={audioUrl}
              durationSec={recording.duration_sec}
              segments={transcript?.segments ?? []}
            />
          </TabsContent>
        </Tabs>

        {/* CTA card — promo VoiceApp */}
        <PromoCard />
      </div>
    </main>
  );
}

function PromoCard() {
  return (
    <div className="relative mt-10 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/8 via-background to-fuchsia-500/8 p-6 md:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-primary/15 blur-3xl"
      />
      <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary/15 text-primary">
              <MessagesSquare className="size-3.5" />
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-primary">
              Сделано с VoiceApp
            </span>
          </div>
          <h3 className="text-lg font-semibold tracking-tight">
            Расшифровка, сводка и чат — за минуты
          </h3>
          <p className="text-sm text-muted-foreground">
            Подписка от <strong className="text-foreground">1 990 ₸/мес</strong>.
            10 минут бесплатно при регистрации.
          </p>
        </div>
        <Link
          href="/signup"
          className={cn(buttonVariants({ size: "lg" }), "gap-2 px-5 shrink-0")}
        >
          Попробовать бесплатно
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
