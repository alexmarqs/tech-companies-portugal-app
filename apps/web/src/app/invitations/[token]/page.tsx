import { Title } from "@/components/Title";
import { AcceptInvitation } from "@/components/invitations/AcceptInvitation";
import type { NextParams } from "@/lib/types";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Company invitation",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function InvitationPage({
  params,
}: {
  params: NextParams<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="container mx-auto max-w-lg p-6">
      <div className="mb-6">
        <Title
          title="Company invitation"
          description="Review and respond to your invitation."
        />
      </div>
      <AcceptInvitation token={token} />
    </div>
  );
}
