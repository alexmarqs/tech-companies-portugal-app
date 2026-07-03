"use client";

import { submitCompanyAction } from "@/actions/submit-company-action";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  CompanyFormFields,
  type CompanyFormValues,
  submitCompanyFormSchema,
} from "./company-form-fields";

type SubmitCompanyFormProps = {
  availableCategories: string[];
  availableLocations: string[];
};

export const SubmitCompanyForm = ({
  availableCategories,
  availableLocations,
}: SubmitCompanyFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(submitCompanyFormSchema),
    defaultValues: {
      ownershipDetails: { isOwner: false, ownershipReason: "" },
      name: "",
      fileImage: undefined,
      description: "",
      websiteUrl: "",
      careersUrl: "",
      githubUrl: "",
      categories: [],
      locations: [],
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    // submitCompanyFormSchema guarantees the logo is present; the check just
    // narrows the type.
    if (!values.fileImage) {
      return;
    }
    try {
      setIsSubmitting(true);
      await submitCompanyAction({
        name: values.name,
        logoFile: values.fileImage,
        description: values.description,
        websiteUrl: values.websiteUrl,
        careersUrl: values.careersUrl || undefined,
        githubUrl: values.githubUrl || undefined,
        categories: values.categories,
        locations: values.locations,
        isOwner: values.ownershipDetails?.isOwner ?? false,
        ownershipReason: values.ownershipDetails?.isOwner
          ? values.ownershipDetails.ownershipReason || undefined
          : undefined,
      });
      toast.success("Thanks! Company will be reviewed shortly.");
      form.reset();
    } catch (error) {
      console.error("Failed to submit company:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Container variant="static" className="p-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <CompanyFormFields
            form={form}
            availableCategories={availableCategories}
            availableLocations={availableLocations}
            disabled={isSubmitting}
          />

          <div className="flex items-center justify-start gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Submit company
            </Button>
          </div>
        </form>
      </Form>
    </Container>
  );
};
