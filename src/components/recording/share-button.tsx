"use client";

import { useState, useTransition } from "react";
import {
  Share2,
  Check,
  Copy,
  Globe,
  Lock,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toggleShare } from "@/lib/actions/recordings";
import { cn } from "@/lib/utils";

export function ShareButton({
  recordingId,
  initialToken,
}: {
  recordingId: string;
  initialToken: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(initialToken);
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState(false);

  const isPublic = !!token;
  const shareUrl =
    typeof window !== "undefined" && token
      ? `${window.location.origin}/share/${token}`
      : "";

  function handleToggle() {
    start(async () => {
      const res = await toggleShare(recordingId);
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      setToken(res.share_token);
      router.refresh();
      if (res.share_token) {
        toast.success("Запись доступна по ссылке");
      } else {
        toast.success("Доступ закрыт");
      }
    });
  }

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Скопировано");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant={isPublic ? "default" : "outline"}
            size="icon"
            aria-label="Поделиться"
          >
            <Share2 className="size-4" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Поделиться записью</DialogTitle>
          <DialogDescription>
            {isPublic
              ? "Любой человек со ссылкой увидит транскрипт и сводку."
              : "Создай ссылку, по которой запись смогут увидеть другие — без регистрации."}
          </DialogDescription>
        </DialogHeader>

        {isPublic && shareUrl ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-2">
              <Globe className="ml-2 size-4 shrink-0 text-emerald-600" />
              <code className="flex-1 truncate text-xs">{shareUrl}</code>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="gap-1.5"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                Копировать
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[0.8rem] font-medium hover:bg-muted",
                )}
              >
                <ExternalLink className="size-3.5" />
                Открыть как гость
              </a>
              <Button
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={handleToggle}
                className={cn("gap-1.5 text-rose-600 hover:text-rose-700")}
              >
                {pending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Lock className="size-3.5" />
                )}
                Закрыть доступ
              </Button>
            </div>

            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-900 dark:text-amber-200">
              <p className="font-medium">Что увидит гость:</p>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-4">
                <li>Название записи и длительность</li>
                <li>Транскрипт со спикерами</li>
                <li>Краткое содержание (TL;DR + буллеты)</li>
                <li>Аудио-плеер для прослушивания</li>
                <li>
                  <strong>Не увидит</strong>: твой email, чат, другие записи
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-border/60 bg-card p-4 text-sm">
              <p className="font-medium">При создании ссылки:</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">
                <li>Любой со ссылкой увидит транскрипт и сводку</li>
                <li>Аудио-плеер будет доступен для прослушивания</li>
                <li>Твой email и чаты <strong>не увидят</strong></li>
                <li>Можно закрыть доступ в любой момент</li>
              </ul>
            </div>

            <Button
              size="lg"
              className="w-full gap-2"
              disabled={pending}
              onClick={handleToggle}
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Share2 className="size-4" />
              )}
              Создать публичную ссылку
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
