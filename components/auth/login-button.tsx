"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Auth from "@/components/auth/auth-form";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";

export default function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  if (session) return null;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="font-medievalsharp"
      >
        Start Your Adventure
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="lg"
        ariaLabel="Sign in or create an account"
        showCloseButton
      >
        <Auth onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
