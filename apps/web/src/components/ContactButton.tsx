"use client";

import { sendContactMessageAction } from "@/actions/send-contact-message-action";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useGetUserProfile } from "@/hooks/users";
import { useSession } from "@/lib/contexts/SessionContext";
import { Loader2, Mail, Send } from "lucide-react";
import { useSelectedLayoutSegment } from "next/navigation";
import { useState, useTransition } from "react";
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
          <Button
            size="sm"
            className="flex items-center gap-2"
            variant="default"
          >
            <span>Contact</span>
            <Mail size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogDescription>
              Any questions, feedback, or just saying hi?
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
          <span>Contact</span>
          <Mail size={16} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle>Contact Us</DrawerTitle>
            <DrawerDescription>
              Any questions, feedback, or just saying hi?
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
          } finally {
            setTimeout(() => setSubmitted(false), 3000);
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
