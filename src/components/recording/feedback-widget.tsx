"use client";

import { useState, useTransition } from "react";
import { ThumbsDown, ThumbsUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveFeedback } from "@/lib/actions/feedback";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { FeedbackRating, RecordingFeedback } from "@/types/domain";

export function FeedbackWidget({
  recordingId,
  initial,
}: {
  recordingId: string;
  initial: RecordingFeedback | null;
}) {
  const [rating, setRating] = useState<FeedbackRating | null>(
    initial?.rating ?? null,
  );
  const [comment, setComment] = useState(initial?.comment ?? "");
  const [pending, start] = useTransition();
  const [showComment, setShowComment] = useState(!!initial?.comment);

  function submit(nextRating: FeedbackRating, nextComment?: string) {
    start(async () => {
      const res = await saveFeedback({
        recordingId,
        rating: nextRating,
        comment: nextComment ?? comment ?? null,
      });
      if (res?.error) toast.error(`Не удалось сохранить: ${res.error}`);
      else toast.success("Спасибо за отзыв!");
    });
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium">Насколько корректно?</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Оцени точность транскрипта и сводки. Помогает нам стать лучше.
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <Button
            variant={rating === 1 ? "default" : "outline"}
            size="icon-sm"
            disabled={pending}
            onClick={() => {
              setRating(1);
              submit(1);
              if (!showComment) setShowComment(true);
            }}
            aria-label="Хорошо"
          >
            <ThumbsUp className="size-4" />
          </Button>
          <Button
            variant={rating === -1 ? "destructive" : "outline"}
            size="icon-sm"
            disabled={pending}
            onClick={() => {
              setRating(-1);
              submit(-1);
              if (!showComment) setShowComment(true);
            }}
            aria-label="Плохо"
          >
            <ThumbsDown className="size-4" />
          </Button>
        </div>
      </div>

      {(showComment || rating !== null) && (
        <div className="mt-4 space-y-2">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              rating === -1
                ? "Что было не так? Где ошибки в транскрипте или сводке?"
                : rating === 1
                  ? "Что особенно понравилось? (необязательно)"
                  : "Поделись впечатлением (необязательно)"
            }
            rows={2}
            maxLength={2000}
            className="text-sm"
            disabled={pending}
          />
          <div className="flex items-center justify-end">
            <Button
              size="sm"
              variant="ghost"
              disabled={pending || rating === null}
              onClick={() => rating !== null && submit(rating, comment)}
            >
              {pending && <Loader2 className="size-3.5 animate-spin" />}
              Сохранить комментарий
            </Button>
          </div>
        </div>
      )}

      {initial && (
        <p
          className={cn(
            "mt-3 text-[11px] tabular-nums",
            "text-muted-foreground",
          )}
        >
          Оценено {new Date(initial.updated_at).toLocaleString("ru-RU")}
        </p>
      )}
    </div>
  );
}
