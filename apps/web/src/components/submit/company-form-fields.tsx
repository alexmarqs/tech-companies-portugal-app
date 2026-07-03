"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/contexts/SessionContext";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  cn,
  revokeBlobUrl,
} from "@/lib/utils";
import { Check, ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Switch } from "../ui/switch";

export const MAX_COMPANY_CATEGORIES = 1;
export const MAX_COMPANY_LOCATIONS = 10;

export const companyFormSchema = z.object({
  ownershipDetails: z
    .object({
      isOwner: z.boolean(),
      ownershipReason: z
        .string()
        .trim()
        .max(500, { message: "Max. 500 characters" })
        .optional(),
    })
    // The reason field is hidden (and empty) unless the user claims
    // ownership, so only require it when isOwner is on.
    .superRefine((details, ctx) => {
      if (!details.isOwner) {
        return;
      }
      if (!details.ownershipReason) {
        ctx.addIssue({
          code: "custom",
          path: ["ownershipReason"],
          message: "Required",
        });
      }
    })
    .optional(),
  name: z
    .string()
    .trim()
    .min(1, { message: "Required" })
    .max(80, { message: "Max. 80 characters" }),
  fileImage: z.file({
    message: "Upload a valid image",
  }),
  description: z
    .string()
    .trim()
    .min(20, { message: "Please write at least 20 characters" })
    .max(500, { message: "Max. 500 characters" }),
  websiteUrl: z.url({ message: "Enter a valid URL" }),
  careersUrl: z
    .url({ message: "Enter a valid URL" })
    .optional()
    .or(z.literal("")),
  githubUrl: z
    .url({ message: "Enter a valid URL" })
    .optional()
    .or(z.literal("")),
  categories: z
    .array(z.string())
    .min(1, {
      message:
        MAX_COMPANY_CATEGORIES === 1
          ? "Select a category"
          : "Select at least one category",
    })
    .max(MAX_COMPANY_CATEGORIES, {
      message:
        MAX_COMPANY_CATEGORIES === 1
          ? "Only one category is allowed"
          : `Select up to ${MAX_COMPANY_CATEGORIES} categories`,
    }),
  locations: z
    .array(z.string())
    .min(1, { message: "Select at least one location" })
    .max(MAX_COMPANY_LOCATIONS, {
      message: `Select up to ${MAX_COMPANY_LOCATIONS} locations`,
    }),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

type CompanyFormFieldsProps = {
  form: UseFormReturn<CompanyFormValues>;
  availableCategories: string[];
  availableLocations: string[];
  disabled?: boolean;
  // The ownership question only makes sense on first submission — hide it
  // when editing a company the user is already a member of.
  showOwnershipFields?: boolean;
};

export const CompanyFormFields = ({
  form,
  availableCategories,
  availableLocations,
  disabled,
  showOwnershipFields = true,
}: CompanyFormFieldsProps) => {
  const { session } = useSession();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company name</FormLabel>
            <FormControl>
              <Input disabled={disabled} placeholder="Acme Inc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                disabled={disabled}
                placeholder="What does the company do?"
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {showOwnershipFields && (
        <>
          <FormField
            control={form.control}
            name="ownershipDetails.isOwner"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>
                    I want to claim ownership of this company
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          {form.watch("ownershipDetails.isOwner") && (
            <>
              <FormField
                control={form.control}
                name="ownershipDetails.ownershipReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provide proof of ownership</FormLabel>
                    <FormDescription>
                      If ownership is confirmed, this company will be added to
                      your profile.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        disabled={disabled}
                        placeholder="Please explain why you are the owner of this company, linkedin profile, etc."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {session?.user?.email && (
                <p className="text-xs text-muted-foreground">
                  This ownership request will be linked to{" "}
                  <span className="font-medium text-foreground">
                    {session.user.email}
                  </span>
                  .
                </p>
              )}
            </>
          )}
        </>
      )}

      <FormField
        control={form.control}
        name="fileImage"
        render={({ field: { name, ref, onBlur, onChange, value } }) => (
          <FormItem>
            <FormLabel>Logo</FormLabel>
            <FormControl>
              {value ? (
                <div className="flex items-center gap-4 rounded-lg border border-border p-3">
                  <ImagePreview file={value} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{value.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(value.size / 1024 / 1024).toFixed(2)}MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    onClick={() => onChange(undefined)}
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="company-logo-input"
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-center transition-colors hover:border-primary/40 hover:bg-muted/40",
                    disabled && "pointer-events-none opacity-50",
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Upload an image</p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPEG, or WEBP. Max 2MB.
                    </p>
                  </div>
                  <Input
                    id="company-logo-input"
                    type="file"
                    className="sr-only"
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    disabled={disabled}
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";

                      if (!file) {
                        return;
                      }

                      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
                        toast.error(
                          "Please select a PNG, JPEG, or WEBP image.",
                        );
                        return;
                      }

                      if (file.size > MAX_IMAGE_SIZE) {
                        toast.error(
                          `File is too large. Max size is ${MAX_IMAGE_SIZE / 1024 / 1024}MB.`,
                        );
                        return;
                      }

                      onChange(file);
                    }}
                  />
                </label>
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="websiteUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website URL</FormLabel>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder="https://example.com"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="careersUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Careers URL</FormLabel>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder="https://example.com/careers"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormDescription>Optional</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="githubUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>GitHub URL</FormLabel>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder="https://github.com/acme"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormDescription>Optional</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categories"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {MAX_COMPANY_CATEGORIES === 1 ? "Category" : "Categories"}
            </FormLabel>
            <FormControl>
              <ChipSelect
                options={availableCategories}
                selected={field.value}
                onChange={field.onChange}
                disabled={disabled}
                max={MAX_COMPANY_CATEGORIES}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="locations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Locations</FormLabel>
            <FormControl>
              <ChipSelect
                options={availableLocations}
                selected={field.value}
                onChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

type ChipSelectProps = {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  // Max selectable. `undefined` = unlimited. When 1, clicking a new option
  // replaces the current selection (radio-like).
  max?: number;
};

const ChipSelect = ({
  options,
  selected,
  onChange,
  disabled,
  max,
}: ChipSelectProps) => {
  const atCapacity = max !== undefined && selected.length >= max;

  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((value) => value !== option));
      return;
    }
    if (max === 1) {
      onChange([option]);
      return;
    }
    if (atCapacity) {
      return;
    }
    onChange([...selected, option]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        const isDisabled = disabled || (atCapacity && !isSelected && max !== 1);
        return (
          <button
            key={option}
            type="button"
            disabled={isDisabled}
            onClick={() => toggle(option)}
            aria-pressed={isSelected}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {isSelected && <Check className="h-3 w-3" />}
            {option}
          </button>
        );
      })}
    </div>
  );
};

const ImagePreview = ({ file }: { file: File }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      revokeBlobUrl(url);
      setPreviewUrl(null);
    };
  }, [file]);

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary/10 to-primary/5">
      {previewUrl ? (
        <img
          className="h-full w-full rounded-lg bg-white object-contain p-0.5"
          src={previewUrl}
          alt="Company logo preview"
          width={36}
          height={36}
        />
      ) : null}
    </div>
  );
};
