"use client";

import {
  publishCompanyAction,
  saveCompanyDraftAction,
} from "@/actions/company-draft-action";
import {
  CompanyFormFields,
  type CompanyFormValues,
  MAX_COMPANY_CATEGORIES,
  companyFormSchema,
} from "@/components/submit/company-form-fields";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Form } from "@/components/ui/form";
import type { Company, CompanyDraft } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2, Save, UploadCloud } from "lucide-react";
import { useState } from "react";
import { type DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";

type PendingAction = "save" | "publish" | null;

type EditCompanyDetailsProps = {
  company: Company;
  // The unpublished working copy, if any — comes with the manage page's
  // detail query. When present, the form edits the draft, not the live values.
  draft: CompanyDraft | null;
  availableCategories: string[];
  availableLocations: string[];
  // Only owners can publish changes live. Editors can save drafts for an owner
  // to publish.
  canPublish?: boolean;
};

// DefaultValues (deep partial) because the submit-form schema also carries a
// required logo `fileImage`, which the edit form doesn't touch.
const toFormValues = (
  company: Company,
  draft: CompanyDraft | null,
): DefaultValues<CompanyFormValues> => {
  if (draft) {
    return {
      name: draft.name,
      description: draft.description,
      websiteUrl: draft.websiteUrl,
      careersUrl: draft.careersUrl,
      githubUrl: draft.githubUrl,
      categories: draft.categories.slice(0, MAX_COMPANY_CATEGORIES),
      locations: draft.locations,
    };
  }

  return {
    name: company.name,
    description: company.description,
    websiteUrl: company.websiteUrl,
    careersUrl: company.careersUrl ?? "",
    githubUrl: company.githubUrl ?? "",
    categories: (Array.isArray(company.categories)
      ? company.categories
      : [company.categories].filter(Boolean)
    ).slice(0, MAX_COMPANY_CATEGORIES),
    locations: company.locations,
  };
};

export const EditCompanyDetails = ({
  company,
  draft,
  availableCategories,
  availableLocations,
  canPublish,
}: EditCompanyDetailsProps) => {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const isBusy = pendingAction !== null;

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: toFormValues(company, draft),
  });

  const toInput = (values: CompanyFormValues) => ({
    slug: company.slug,
    name: values.name,
    description: values.description,
    websiteUrl: values.websiteUrl,
    careersUrl: values.careersUrl || undefined,
    githubUrl: values.githubUrl || undefined,
    categories: values.categories,
    locations: values.locations,
  });

  const saveDraft = form.handleSubmit(async (values) => {
    try {
      setPendingAction("save");
      await saveCompanyDraftAction(toInput(values));
      toast.success("Draft saved.");
      form.reset(values);
    } catch (error) {
      console.error("Failed to save draft:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPendingAction(null);
    }
  });

  const publish = form.handleSubmit(async (values) => {
    try {
      setPendingAction("publish");
      await publishCompanyAction(toInput(values));
      toast.success("Changes published — this is coming soon.");
      form.reset(values);
    } catch (error) {
      console.error("Failed to publish changes:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPendingAction(null);
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          {canPublish
            ? "Save a draft to keep working, or publish to make your changes live."
            : "Your changes are saved as a draft for an owner to publish."}
          {draft
            ? " You're editing the unpublished draft for this company."
            : ""}
        </p>
      </div>
      <Container variant="static" className="p-6">
        <Form {...form}>
          <form onSubmit={saveDraft} className="space-y-6">
            <CompanyFormFields
              form={form}
              availableCategories={availableCategories}
              availableLocations={availableLocations}
              disabled={isBusy}
              showOwnershipFields={false}
            />
            <div className="flex flex-wrap items-center justify-start gap-3">
              <Button
                type="submit"
                variant="outline"
                disabled={isBusy || !form.formState.isDirty}
                className="flex items-center gap-2"
              >
                {pendingAction === "save" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save draft
              </Button>
              {canPublish && (
                <Button
                  type="button"
                  onClick={publish}
                  disabled={isBusy}
                  className="flex items-center gap-2"
                >
                  {pendingAction === "publish" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UploadCloud className="h-4 w-4" />
                  )}
                  Publish changes
                </Button>
              )}
            </div>
          </form>
        </Form>
      </Container>
    </div>
  );
};
