"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  createPromocode,
  deactivatePromocode,
} from "@/lib/actions/promocodes";
import type { PromocodeRow } from "@/app/(admin)/admin/promocodes/page";

export function PromocodesClient({ initial }: { initial: PromocodeRow[] }) {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Всего {initial.length}{" "}
          {initial.length === 1 ? "код" : initial.length < 5 ? "кода" : "кодов"}
        </p>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-1.5">
                <Plus className="size-3.5" />
                Создать промокод
              </Button>
            }
          />
          <CreateDialog onClose={() => setOpenCreate(false)} />
        </Dialog>
      </div>

      {initial.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card px-6 py-14 text-center">
          <p className="font-medium">Кодов пока нет</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Создай первый — раздай друзьям или партнёрам для тестирования.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
          <table className="w-full">
            <thead className="border-b border-border/60 bg-muted/30 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Код</th>
                <th className="px-4 py-3 font-medium">Тип</th>
                <th className="px-4 py-3 font-medium">Значение</th>
                <th className="px-4 py-3 font-medium">Использовано</th>
                <th className="px-4 py-3 font-medium">Создан</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {initial.map((p) => (
                <PromocodeRowEl key={p.id} row={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function PromocodeRowEl({ row }: { row: PromocodeRow }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState(false);

  const exhausted = row.max_uses !== null && row.used_count >= row.max_uses;
  const expired = !!row.expires_at && new Date(row.expires_at) < new Date();
  const dead = exhausted || expired;

  return (
    <tr className="border-b border-border/60 last:border-b-0">
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(row.code);
            setCopied(true);
            toast.success("Скопировано");
            setTimeout(() => setCopied(false), 2000);
          }}
          className="group inline-flex items-center gap-1.5 rounded-md font-mono text-sm font-medium hover:text-primary"
        >
          {row.code}
          {copied ? (
            <Check className="size-3 text-emerald-500" />
          ) : (
            <Copy className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </button>
        {row.description && (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
            {row.description}
          </p>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {row.type === "free_minutes" && "Бесплатные минуты"}
        {row.type === "discount_percent" && "Скидка"}
        {row.type === "free_package" && "Бесплатный пакет"}
      </td>
      <td className="px-4 py-3 font-medium tabular-nums">
        {row.type === "free_minutes" && `+${row.free_minutes} мин`}
        {row.type === "discount_percent" && `−${row.discount_percent}%`}
        {row.type === "free_package" && row.package_id}
      </td>
      <td className="px-4 py-3 tabular-nums">
        {row.used_count} / {row.max_uses ?? "∞"}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {formatRelativeTime(row.created_at)}
      </td>
      <td className="px-4 py-3 text-right">
        {dead ? (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            {expired ? "Истёк" : "Исчерпан"}
          </span>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={() => {
              if (!confirm(`Деактивировать ${row.code}?`)) return;
              start(async () => {
                const r = await deactivatePromocode(row.id);
                if (r?.error) toast.error(r.error);
                else {
                  toast.success("Деактивирован");
                  router.refresh();
                }
              });
            }}
          >
            Деактивировать
          </Button>
        )}
      </td>
    </tr>
  );
}

function CreateDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [freeMinutes, setFreeMinutes] = useState("100");
  const [maxUses, setMaxUses] = useState("");

  function generateRandom() {
    const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < 8; i++) s += charset[Math.floor(Math.random() * charset.length)];
    setCode(s);
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Новый промокод</DialogTitle>
        <DialogDescription>
          Бесплатные минуты для тестеров, друзей или инфлюенсеров.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="code">Код</Label>
          <div className="flex gap-2">
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="LAUNCH50"
              maxLength={40}
              className={cn("font-mono", "uppercase")}
              required
            />
            <Button type="button" variant="outline" onClick={generateRandom}>
              Сгенерировать
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Только латиница, цифры, _ и -. Регистр не важен.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="freeMinutes">Бесплатные минуты</Label>
          <Input
            id="freeMinutes"
            type="number"
            value={freeMinutes}
            onChange={(e) => setFreeMinutes(e.target.value)}
            min={1}
            max={100000}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="maxUses">
            Макс. использований{" "}
            <span className="text-muted-foreground">(опционально)</span>
          </Label>
          <Input
            id="maxUses"
            type="number"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            placeholder="Безлимит"
            min={1}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">
            Описание <span className="text-muted-foreground">(внутреннее)</span>
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Например: для друзей с ProductHunt"
            rows={2}
            maxLength={200}
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={pending}
        >
          Отмена
        </Button>
        <Button
          disabled={pending || !code || !freeMinutes}
          onClick={() => {
            start(async () => {
              const res = await createPromocode({
                code,
                description: description || undefined,
                type: "free_minutes",
                free_minutes: Number(freeMinutes),
                max_uses: maxUses ? Number(maxUses) : undefined,
              });
              if ("error" in res) {
                toast.error(res.error);
              } else {
                toast.success(`Создан: ${code}`);
                onClose();
                router.refresh();
              }
            });
          }}
        >
          {pending && <Loader2 className="mr-2 size-3.5 animate-spin" />}
          Создать
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
