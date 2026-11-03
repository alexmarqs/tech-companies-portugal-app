"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateApiKey,
  useDeleteApiKey,
  useGetApiKeys,
  useRevokeApiKey,
} from "@/hooks/api-keys";
import { useCopyValue } from "@/hooks/useCopyValue";
import type { ApiKey, CreatedApiKey } from "@/lib/api/api-keys";
import { cn } from "@/lib/utils";
import { API_KEY_RATE_LIMIT_PER_MINUTE } from "@tech-companies-portugal/core";
import {
  Ban,
  Check,
  Copy,
  KeyRound,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { type ReactNode, type SubmitEvent, useState } from "react";
import { toast } from "sonner";

type Expiration = "never" | "30" | "90" | "365";

const EXPIRATION_LABELS: Record<Expiration, string> = {
  never: "Never",
  "30": "30 days",
  "90": "90 days",
  "365": "1 year",
};

// Browser locale and time zone: the keys load client-side, so no hydration.
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const formatDate = (value: string) => dateFormatter.format(new Date(value));

const getStatus = (apiKey: ApiKey) => {
  if (apiKey.revoked_at) return "Revoked";
  if (apiKey.expires_at && Date.parse(apiKey.expires_at) <= Date.now()) {
    return "Expired";
  }
  return "Active";
};

export const ApiKeySettings = () => {
  const { isPending, data: apiKeys = [] } = useGetApiKeys();

  if (isPending) {
    return <Skeleton className="h-40 w-full" />;
  }

  return (
    <Container variant="static" className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h3 className="text-md">API Keys</h3>
        </div>
        <CreateApiKeyDialogButton />
      </div>

      {apiKeys.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <KeyRound />
            </EmptyMedia>
            <EmptyTitle>No API keys</EmptyTitle>
            <EmptyDescription>
              Create a key to authenticate your first integration.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="flex flex-col divide-y rounded-md border">
          {apiKeys.map((apiKey) => (
            <ApiKeyItem key={apiKey.id} apiKey={apiKey} />
          ))}
        </ul>
      )}
    </Container>
  );
};

const CreateApiKeyDialogButton = () => {
  const [open, setOpen] = useState(false);

  // IMPORTANT: Plain state is enough for a create-only form. Switch to RHF (see
  // AccountName) if it gains custom validation or starts editing keys.
  const [name, setName] = useState("");
  const [expiration, setExpiration] = useState<Expiration>("90");
  const [createdApiKey, setCreatedApiKey] = useState<CreatedApiKey | null>(
    null,
  );

  const { mutate: createApiKey, isPending } = useCreateApiKey({
    onSuccess: setCreatedApiKey,
    onError: (error) => toast.error(error.message),
  });

  const { copied, copy: copyApiKey } = useCopyValue(
    createdApiKey?.plaintext ?? "",
    {
      onError: () =>
        toast.error("Unable to copy the API key. Copy it manually instead."),
    },
  );

  const reset = () => {
    setName("");
    setExpiration("90");
    setCreatedApiKey(null);
  };

  const trimmedName = name.trim();

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedName) return;

    createApiKey({
      name: trimmedName,
      expiresInDays:
        expiration === "never" ? null : (Number(expiration) as 30 | 90 | 365),
    });
  };

  // The plaintext is unrecoverable once closed, and arrives after the request:
  // while either is the case only the Done button closes (Esc, outside click
  // and the X all go through onOpenChange).
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && (isPending || createdApiKey)) return;
    setOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="shrink-0">
          <Plus />
          Create key
        </Button>
      </DialogTrigger>
      <DialogContent onCloseAutoFocus={reset}>
        {createdApiKey ? (
          <>
            <DialogHeader>
              <DialogTitle>Copy your API key</DialogTitle>
              <DialogDescription>
                This key is shown once. Store it in a password manager or secret
                store before closing this dialog.
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-md border bg-muted p-3">
              <code className="break-all text-sm select-all">
                {createdApiKey.plaintext}
              </code>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Done
              </Button>
              <Button type="button" onClick={copyApiKey}>
                {copied ? <Check /> : <Copy />}
                {copied ? "Copied" : "Copy key"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <DialogHeader>
              <DialogTitle>Create API key</DialogTitle>
              <DialogDescription>
                Keys have read-only access to the public API and are limited to{" "}
                {API_KEY_RATE_LIMIT_PER_MINUTE} requests per minute.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="api-key-name">Name</FieldLabel>
                <Input
                  id="api-key-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Production integration"
                  autoComplete="off"
                  maxLength={100}
                  required
                />
                <FieldDescription>
                  A recognizable name for the application using this key.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="api-key-expiration">Expires</FieldLabel>
                <Select
                  value={expiration}
                  onValueChange={(value) => setExpiration(value as Expiration)}
                >
                  <SelectTrigger id="api-key-expiration" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(EXPIRATION_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending || !trimmedName}>
                {isPending ? <Loader2 className="animate-spin" /> : null}
                Create key
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ApiKeyItem = ({ apiKey }: { apiKey: ApiKey }) => {
  const status = getStatus(apiKey);
  const isActive = status === "Active";

  const { mutate: revokeApiKey, isPending: isRevoking } = useRevokeApiKey({
    onSuccess: () => toast.success("API key revoked"),
    onError: (error) => toast.error(error.message),
  });
  const { mutate: deleteApiKey, isPending: isDeleting } = useDeleteApiKey({
    onSuccess: () => toast.success("API key deleted"),
    onError: (error) => toast.error(error.message),
  });

  const details = [
    `Created ${formatDate(apiKey.created_at)}`,
    apiKey.revoked_at
      ? `Revoked ${formatDate(apiKey.revoked_at)}`
      : apiKey.expires_at
        ? `${isActive ? "Expires" : "Expired"} ${formatDate(apiKey.expires_at)}`
        : "No expiry",
    apiKey.last_used_at ? `Last used ${formatDate(apiKey.last_used_at)}` : null,
  ].filter(Boolean);

  return (
    <li className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div
        className={cn("min-w-0 flex flex-col gap-1", !isActive && "opacity-60")}
      >
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium">{apiKey.name}</p>
          <Badge variant={isActive ? "secondary" : "outline"}>{status}</Badge>
        </div>
        <code className="truncate text-xs text-muted-foreground">
          {apiKey.key_prefix}…
        </code>
        <p className="text-xs text-muted-foreground">{details.join(" · ")}</p>
      </div>
      {isActive ? (
        <ConfirmKeyAction
          label="Revoke"
          icon={<Ban />}
          title={`Revoke “${apiKey.name}”?`}
          description="Requests using this key will stop working immediately. This action cannot be undone."
          confirmLabel="Revoke key"
          isPending={isRevoking}
          onConfirm={() => revokeApiKey({ id: apiKey.id })}
        />
      ) : (
        <ConfirmKeyAction
          label="Delete"
          icon={<Trash2 />}
          title={`Delete “${apiKey.name}”?`}
          description="The key will be removed from this list. This action cannot be undone."
          confirmLabel="Delete key"
          isPending={isDeleting}
          onConfirm={() => deleteApiKey({ id: apiKey.id })}
        />
      )}
    </li>
  );
};

const ConfirmKeyAction = ({
  label,
  icon,
  title,
  description,
  confirmLabel,
  isPending,
  onConfirm,
}: {
  label: string;
  icon: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  isPending: boolean;
  onConfirm: () => void;
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className="shrink-0"
        disabled={isPending}
      >
        {isPending ? <Loader2 className="animate-spin" /> : icon}
        {label}
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className={buttonVariants({ variant: "destructive" })}
          onClick={onConfirm}
        >
          {confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
