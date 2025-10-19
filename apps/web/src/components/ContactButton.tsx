"use client";

import { sendContactMessageAction } from "@/actions/send-contact-message-action";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useGetUserProfile } from "@/hooks/users";
import { useSession } from "@/lib/contexts/SessionContext";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { useSelectedLayoutSegment } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Textarea } from "./ui/textarea";

export const ContactButton = () => {
  const { isAuthenticated } = useSession();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathLayout = useSelectedLayoutSegment();
  const isAllowedPage =
    pathLayout === "(companies-list)" || pathLayout === "settings";

  if (!isAllowedPage || !isAuthenticated) {
    return null;
  }

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2" variant="default">
            <span>Talk to us</span>
            <MessageCircle size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Talk to us</DialogTitle>
            <DialogDescription>
              Do you have any questions? We are looking for sponsors and
              advertisers. Feel free to reach out to us.
            </DialogDescription>
          </DialogHeader>
          <ContactForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="sm" className="flex items-center gap-2" variant="default">
          <span>Talk to us</span>
          <MessageCircle size={16} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle>Talk to us</DrawerTitle>
            <DrawerDescription>
              Do you have any questions? We are looking for sponsors and
              advertisers. Feel free to reach out to us.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <ContactForm />
          </div>
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" size="sm">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const ContactForm = () => {
  const [isSubmitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { data: userProfile } = useGetUserProfile();
  const userEmail = userProfile?.email;

  if (!userEmail) {
    return (
      <div className="flex items-center justify-center text-sm py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return isSubmitted ? (
    <div className="flex tems-center gap-2 justify-center text-green-500 text-sm py-4">
      <span>Message sent successfully 🎉</span>
    </div>
  ) : (
    <form
      className="space-y-4"
      action={async (formData) => {
        startTransition(async () => {
          try {
            await sendContactMessageAction(formData);
            setSubmitted(true);
          } catch (error) {
            console.error(error);
            toast.error("Failed to send message. Try again later.");
          } finally {
            setTimeout(() => setSubmitted(false), 2500);
          }
        });
      }}
    >
      <Textarea
        disabled={isPending}
        name="message"
        rows={4}
        placeholder="Your message"
        required
      />
      <Button
        variant="secondary"
        type="submit"
        className="w-full flex items-center gap-2"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send size={14} />
        )}
        Send
      </Button>
    </form>
  );
};
