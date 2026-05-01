"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      richColors={false}
      closeButton={false}
      icons={{
        success: <CircleCheckIcon className="size-[18px] text-emerald-500" />,
        info: <InfoIcon className="size-[18px] text-sky-500" />,
        warning: <TriangleAlertIcon className="size-[18px] text-amber-500" />,
        error: <OctagonXIcon className="size-[18px] text-rose-500" />,
        loading: <Loader2Icon className="size-[18px] animate-spin text-primary" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "16px",
        } as React.CSSProperties
      }
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "group toast group-[.toaster]:!bg-card group-[.toaster]:!text-foreground group-[.toaster]:!border-border/60 group-[.toaster]:!shadow-2xl group-[.toaster]:!shadow-primary/5 !rounded-2xl !p-4 !gap-3",
          title: "!font-medium !text-sm",
          description: "!text-xs !text-muted-foreground !leading-relaxed",
          actionButton:
            "!bg-primary !text-primary-foreground !rounded-md !px-3 !py-1.5 !text-xs !font-medium hover:!bg-primary/90",
          cancelButton:
            "!text-muted-foreground !text-xs hover:!text-foreground",
          icon: "!flex !size-7 !items-center !justify-center !rounded-lg !bg-muted/50",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
