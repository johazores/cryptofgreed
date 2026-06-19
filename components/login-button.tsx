"use client";
import { useState } from "react";
import Modal from "@/components/modal";
import Auth from "@/components/auth";
import Button from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} maxWidth="lg">
        <div className="p-6">
          <Auth onSuccess={() => setIsOpen(false)} />
        </div>
      </Modal>
    </>
  );
}
