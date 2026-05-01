import { createAdminClient } from "@/lib/supabase/admin";
import { PromocodesClient } from "@/components/admin/promocodes-client";
import { QuickGenerate } from "@/components/admin/quick-generate";

export const metadata = { title: "Промокоды — Админка VoiceApp" };
export const dynamic = "force-dynamic";

export interface PromocodeRow {
  id: string;
  code: string;
  description: string | null;
  type: "free_minutes" | "discount_percent" | "free_package";
  free_minutes: number | null;
  discount_percent: number | null;
  package_id: string | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  created_at: string;
}

export default async function AdminPromocodesPage() {
  const supa = createAdminClient();
  const { data } = await supa
    .from("promocodes")
    .select("*")
    .order("created_at", { ascending: false });
  const codes = (data ?? []) as PromocodeRow[];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Промокоды</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          После оплаты в Kaspi сгенерируй одноразовый токен под тариф и
          отправь клиенту в Telegram. Также можно создать произвольные коды для
          друзей и тестеров.
        </p>
      </div>
      <QuickGenerate />
      <PromocodesClient initial={codes} />
    </div>
  );
}
