import { redirect } from "next/navigation";
import { Mail, KeyRound, Trash2, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ChangeEmailForm } from "@/components/settings/change-email-form";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { DeleteAccountSection } from "@/components/settings/delete-account-section";

export const metadata = { title: "Настройки — VoiceApp" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const isOAuth =
    (user.app_metadata?.provider as string | undefined) !== "email";

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-4 py-6 animate-in fade-in slide-in-from-bottom-2 duration-500 md:px-6 md:py-8">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Настройки
        </h1>
        <p className="text-sm text-muted-foreground">
          Управление аккаунтом · {user.email}
        </p>
      </div>

      <SettingsSection
        icon={<Mail className="size-4" />}
        title="Email"
        description="Email используется для входа и уведомлений."
      >
        {isOAuth ? (
          <p className="rounded-md bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            Ты вошёл через Google. Email привязан к Google-аккаунту и меняется
            там же.
          </p>
        ) : (
          <ChangeEmailForm currentEmail={user.email ?? ""} />
        )}
      </SettingsSection>

      <SettingsSection
        icon={<KeyRound className="size-4" />}
        title="Пароль"
        description={
          isOAuth
            ? "Можно установить пароль, чтобы войти без Google в будущем."
            : "Минимум 8 символов."
        }
      >
        <ChangePasswordForm />
      </SettingsSection>

      <SettingsSection
        icon={<ShieldAlert className="size-4" />}
        title="Безопасность"
        description="Сейчас активен один сеанс. Для выхода со всех устройств — измени пароль."
      >
        <p className="rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Активные сессии и список устройств появятся в следующих версиях.
        </p>
      </SettingsSection>

      <SettingsSection
        icon={<Trash2 className="size-4 text-rose-500" />}
        title="Удалить аккаунт"
        description="Удалит навсегда все аудио, транскрипты, сводки, чаты и баланс минут."
        danger
      >
        <DeleteAccountSection email={user.email ?? ""} />
      </SettingsSection>
    </div>
  );
}

function SettingsSection({
  icon,
  title,
  description,
  children,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <section
      className={
        "overflow-hidden rounded-2xl border bg-card " +
        (danger ? "border-rose-500/30" : "border-border/60")
      }
    >
      <div className="flex items-start gap-3 border-b border-border/60 p-5">
        <div
          className={
            "flex size-8 shrink-0 items-center justify-center rounded-lg " +
            (danger
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              : "bg-primary/10 text-primary")
          }
        >
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
