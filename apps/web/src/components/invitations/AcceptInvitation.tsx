"use client";

import { respondToCompanyInvitationAction } from "@/actions/company-membership-action";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetInvitationByToken } from "@/hooks/invitations";
import { useSession } from "@/lib/contexts/SessionContext";
import { MailX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type AcceptInvitationProps = {
  token: string;
};

export const AcceptInvitation = ({ token }: AcceptInvitationProps) => {
  const router = useRouter();
  const { isAuthenticated } = useSession();
  const { data: invitation, isPending } = useGetInvitationByToken(token, {
    enabled: isAuthenticated,
  });
  const [isResponding, setIsResponding] = useState(false);

  const respond = async (accept: boolean) => {
    try {
      setIsResponding(true);
      await respondToCompanyInvitationAction({ token, accept });
      if (accept) {
        toast.success("Invitation accepted — this is coming soon.");
        router.push("/my-companies");
      } else {
        toast.success("Invitation declined — this is coming soon.");
        router.push("/my-companies");
      }
    } catch (error) {
      console.error("Failed to respond to invitation:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsResponding(false);
    }
  };

  if (isPending) {
    return <Skeleton className="h-52 w-full rounded-xl" />;
  }

  if (!invitation) {
    return (
      <Container
        variant="static"
        className="flex flex-col items-center gap-3 p-10 text-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <MailX className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-semibold">Invitation not found</h2>
          <p className="text-sm text-muted-foreground">
            This invitation link is invalid or has expired.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container variant="static" className="space-y-5 p-8 text-center">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">
          You've been invited
        </h1>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {invitation.invitedByEmail ?? "A company owner"}
          </span>{" "}
          invited you to manage{" "}
          <span className="font-medium text-foreground">
            {invitation.companyName}
          </span>{" "}
          as <span className="capitalize">{invitation.role}</span>.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          disabled={isResponding}
          onClick={() => respond(false)}
        >
          Decline
        </Button>
        <Button disabled={isResponding} onClick={() => respond(true)}>
          Accept invitation
        </Button>
      </div>
    </Container>
  );
};
