import { Check, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { SUPPORTED_LANGUAGES, type Language } from "../i18n";

interface LanguageOption {
  code: Language;
  label: string;
  native: string;
  flag: string;
}

const OPTIONS: LanguageOption[] = [
  { code: "en", label: "English", native: "English", flag: "EN" },
  { code: "fr", label: "French", native: "Français", flag: "FR" },
  { code: "ar", label: "Arabic", native: "العربية", flag: "AR" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage ??
    i18n.language ??
    "en") as Language;
  const currentOpt =
    OPTIONS.find((o) => o.code === current) ?? OPTIONS[0];

  const change = (code: Language) => {
    if (code === current) return;
    void i18n.changeLanguage(code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 gap-1.5 rounded-full text-xs font-medium"
        >
          <Globe className="w-3.5 h-3.5 opacity-70" />
          <span className="font-mono tracking-wider">{currentOpt.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="card-glass min-w-[180px] p-1"
      >
        {SUPPORTED_LANGUAGES.map((code) => {
          const opt = OPTIONS.find((o) => o.code === code)!;
          const active = code === current;
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => change(code)}
              className="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer rounded-md"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono tracking-wider text-muted-foreground w-6">
                  {opt.flag}
                </span>
                <span className="text-sm">{opt.native}</span>
              </div>
              {active && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
