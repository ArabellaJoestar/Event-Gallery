import React, { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Link2, Check } from "lucide-react";

export default function CopyLinkButton({
  url,
  label = "Copiar link",
  className = "",
  copiedLabel = "Copiado!",
}) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (url) return url;
    if (typeof window !== "undefined" && window.location) return window.location.href;
    return "";
  };

  const handleCopy = async (e) => {
    e.stopPropagation();
    const text = getUrl();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // volta ao estado normal após 2s
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // fallback: criar textarea temporário
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Não foi possível copiar para área de transferência", error);
      }
    }
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={handleCopy}
            className={
              `inline-flex items-center gap-2 px-3 py-1.5 rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 text-white focus:ring-offset-2 focus:ring-primary ${className}`
            }
            aria-label={label}
            title={label}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Link2 className="w-4 h-4" />
            )}
            <span className="text-sm select-none">{copied ? copiedLabel : label}</span>
          </button>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content side="top" align="center" className="z-50 bg-gray-900 text-white text-xs px-2 py-1 rounded-md shadow">
            {copied ? copiedLabel : "Clique para copiar"}
            <Tooltip.Arrow className="fill-current text-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
