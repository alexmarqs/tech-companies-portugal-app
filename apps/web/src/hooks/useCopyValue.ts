import { useEffect, useState } from "react";

export const useCopyValue = (
  value: string,
  options: {
    onSuccess?: () => void;
    onError?: () => void;
    timeout?: number;
  } = {},
) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), options.timeout ?? 1500);
    return () => clearTimeout(timeout);
  }, [copied, options.timeout]);

  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      options.onSuccess?.();
    } catch {
      options.onError?.();
    }
  };

  return { copied, copy };
};
