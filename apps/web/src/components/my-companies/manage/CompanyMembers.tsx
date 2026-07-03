"use client";

import {
  removeCompanyMemberAction,
  updateCompanyMemberRoleAction,
} from "@/actions/company-membership-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CompanyMember, CompanyMemberRole } from "@/lib/types";
import { MoreHorizontal, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { InviteMemberModal } from "../InviteMemberModal";

const MemberRow = ({
  member,
  companySlug,
}: {
  member: CompanyMember;
  companySlug: string;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const nextRole: CompanyMemberRole =
    member.role === "owner" ? "editor" : "owner";

  const changeRole = async () => {
    try {
      setIsUpdating(true);
      await updateCompanyMemberRoleAction({
        companySlug,
        memberId: member.id,
        role: nextRole,
      });
      toast.success("Managing member roles is coming soon.");
    } catch (error) {
      console.error("Failed to update member role:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const removeMember = async () => {
    try {
      setIsUpdating(true);
      await removeCompanyMemberAction({ companySlug, memberId: member.id });
      toast.success("Removing members is coming soon.");
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7">
          <AvatarImage
            className="object-cover"
            referrerPolicy="no-referrer"
            src={member.avatarUrl ?? undefined}
            alt={member.fullName ?? member.email}
          />
          <AvatarFallback className="bg-muted text-xs text-muted-foreground">
            {(member.fullName ?? member.email).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-none">
            {member.fullName ?? member.email}
          </span>
          <span className="text-xs text-muted-foreground">{member.email}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {member.isCurrentUser && (
          <span className="text-xs text-muted-foreground">You</span>
        )}
        <Badge variant={member.role === "owner" ? "default" : "secondary"}>
          {member.role}
        </Badge>
        {!member.isCurrentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={isUpdating}
                aria-label={`Manage ${member.fullName ?? member.email}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={changeRole}>
                Make {nextRole}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={removeMember}
              >
                Remove from company
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

type CompanyMembersProps = {
  companySlug: string;
  companyName: string;
  members: CompanyMember[];
};

export const CompanyMembers = ({
  companySlug,
  companyName,
  members,
}: CompanyMembersProps) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <Container variant="static" className="space-y-4 p-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">Members</h3>
          <p className="text-xs text-muted-foreground">
            People who can manage {companyName}.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-1.5"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Invite
        </Button>
      </div>
      <div className="space-y-3">
        {members.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            companySlug={companySlug}
          />
        ))}
      </div>
      <InviteMemberModal
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        companySlug={companySlug}
        companyName={companyName}
      />
    </Container>
  );
};
