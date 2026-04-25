import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  ArrowDownLeft,
  KeyRound,
  Plus,
  X,
} from "lucide-react";
import {
  useCars,
  type Activity,
  type ActivityKind,
} from "../context/CarsContext";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useLocale } from "../hooks/useLocale";

const iconByKind: Record<
  ActivityKind,
  React.ComponentType<{ className?: string }>
> = {
  added: Plus,
  rented: KeyRound,
  returned: ArrowDownLeft,
  alert: AlertTriangle,
};

function ActivityRow({ activity }: { activity: Activity }) {
  const { t } = useTranslation();
  const { dateFnsLocale } = useLocale();
  const Icon = iconByKind[activity.kind];

  const tone =
    activity.severity === "critical"
      ? "text-red-400 bg-red-500/10 border-red-500/20"
      : activity.severity === "warning"
        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
        : "text-foreground bg-muted border-border";

  // Special handling for alert details that embed a maintenance metric reference
  const detailParams = { ...activity.detailParams };
  if (typeof detailParams.detail === "string" && detailParams.detail.startsWith("__metric__:")) {
    const parts = detailParams.detail.split(":");
    const metricKey = parts[1];
    const paramsJson = parts.slice(2).join(":");
    try {
      const metricParams = JSON.parse(paramsJson);
      detailParams.detail = String(t(metricKey, metricParams));
    } catch {
      detailParams.detail = "";
    }
  }

  const title =
    activity.kind === "alert"
      ? `${t(activity.titleKey)} ${t("activity.alertSuffix")}`
      : t(activity.titleKey, activity.titleParams);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3 p-3 border-b last:border-b-0"
    >
      <div
        className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center ${tone}`}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-sm font-medium truncate">{title}</div>
          <div className="text-[10px] text-muted-foreground tabular-nums shrink-0">
            {formatDistanceToNow(new Date(activity.timestamp), {
              addSuffix: false,
              locale: dateFnsLocale,
            })}
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {t(activity.detailKey, detailParams)}
        </div>
      </div>
    </motion.div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ActivityDrawer({ open, onClose }: Props) {
  const { activities } = useCars();
  const { t } = useTranslation();
  const { rtl } = useLocale();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 glass-overlay"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: rtl ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: rtl ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={`fixed top-0 z-50 h-[100dvh] w-full sm:w-[380px] glass-panel shadow-2xl flex flex-col ${
              rtl ? "left-0 border-r" : "right-0 border-l"
            }`}
          >
            <div className="flex items-center justify-between px-5 h-14 border-b shrink-0">
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-medium">
                  {t("activity.title")}
                </div>
                <div className="text-sm font-semibold">
                  {t("activity.subtitle")}
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              {activities.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  {t("activity.empty")}
                </div>
              ) : (
                <div className="divide-y">
                  <AnimatePresence initial={false}>
                    {activities.map((a) => (
                      <ActivityRow key={a.id} activity={a} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </ScrollArea>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
