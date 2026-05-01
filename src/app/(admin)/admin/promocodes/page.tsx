import { createAdminClient } from "@/lib/supabase/admin";
import { PromocodesClient } from "@/components/admin/promocodes-client";

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
    <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Промокоды</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Создавай коды для друзей, инфлюенсеров и тестеров. Они вводят код в
          разделе «Тарифы» — получают бонусные минуты.
        </p>
      </div>
      <PromocodesClient initial={codes} />
    </div>
  );
}
