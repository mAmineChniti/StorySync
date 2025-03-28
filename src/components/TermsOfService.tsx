"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export function TermsOfServiceModal({ onAccept }: { onAccept?: () => void }) {
  const [open, setOpen] = useState(false);

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using StorySync, you agree to be bound by these comprehensive Terms of Service. If you do not agree with any part of these terms, please do not use our service.",
      details:
        "These terms constitute a legally binding agreement between you and StorySync.",
    },
    {
      title: "2. User Responsibilities and Account Security",
      content:
        "You are solely responsible for maintaining the confidentiality and security of your account credentials.",
      list: [
        "Protect your login information",
        "Use strong, unique passwords",
        "Enable two-factor authentication",
        "Immediately report any unauthorized access",
      ],
    },
    {
      title: "3. Intellectual Property Rights",
      content: "StorySync respects and protects intellectual property rights.",
      list: [
        "You retain full ownership of your original content",
        "We provide a platform for content creation and sharing",
        "You grant us a limited, non-exclusive license to display and distribute your content within the service",
        "You guarantee that your content does not infringe on third-party rights",
      ],
    },
    {
      title: "4. Prohibited Conduct and Content Guidelines",
      content:
        "To maintain a safe and respectful community, the following conduct is strictly prohibited:",
      list: [
        "Harassment, bullying, or threatening behavior",
        "Hate speech or discriminatory content",
        "Explicit sexual or violent content",
        "Impersonation of other individuals",
        "Spreading misinformation or malicious content",
        "Violating local, national, or international laws",
      ],
    },
    {
      title: "5. Privacy and Data Protection",
      content: "We are committed to protecting your personal information.",
      list: [
        "We collect only necessary data for service operation",
        "Your data is encrypted and securely stored",
        "We do not sell or share personal information with third parties",
        "You can request data deletion at any time",
      ],
    },
    {
      title: "6. Limitation of Liability",
      content:
        "StorySync provides services 'as is' with no explicit or implied warranties.",
      list: [
        "We are not liable for any direct, indirect, or consequential damages",
        "Users are responsible for their content and interactions",
        "Our total liability is limited to the amount paid for services",
        "We reserve the right to suspend or terminate accounts violating terms",
      ],
    },
    {
      title: "7. Dispute Resolution",
      content:
        "Any disputes will be resolved through fair and transparent processes.",
      list: [
        "Disputes will be handled through arbitration",
        "Governed by the laws of the jurisdiction where StorySync is registered",
        "Mediation will be the first step in resolving conflicts",
      ],
    },
    {
      title: "8. Changes to Terms",
      content:
        "We may update these terms periodically to reflect service improvements and legal requirements.",
      list: [
        "Updates will be communicated via email and website notification",
        "Continued use of the service implies acceptance of updated terms",
        "You may review the latest terms at any time",
      ],
    },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          setOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <span
          className="text-primary hover:underline cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          Terms of Service
        </span>
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl max-h-[90vh] flex flex-col"
        onInteractOutside={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl text-primary">
            Terms of Service
          </DialogTitle>
          <DialogDescription>Last Updated: March 27, 2025</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-4 overflow-y-auto">
          {sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-primary">
                {section.title}
              </h2>
              <p className="text-muted-foreground mb-2">{section.content}</p>
              {section.details && (
                <p className="text-sm text-muted-foreground italic mb-2">
                  {section.details}
                </p>
              )}
              {section.list && (
                <ul className="list-disc pl-6 text-muted-foreground">
                  {section.list.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ScrollArea>

        <div className="flex gap-2 justify-end">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-card/50 border-border focus:bg-card focus:ring-2 focus:ring-primary text-primary cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </DialogClose>
          <Button
            className="bg-primary text-primary-foreground cursor-pointer"
            onClick={() => {
              onAccept?.();
              setOpen(false);
            }}
          >
            I Accept
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
