"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import termsOfServiceSections from "@/termsOfServiceSections.json";
import { useState } from "react";

export function TermsOfServiceModal({ onAccept }: { onAccept?: () => void }) {
  const [open, setOpen] = useState(false);

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
        onClose={() => {
          setOpen(false);
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
      >
        <div className="text-center mb-4">
          <DialogTitle className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            Terms of Service
          </DialogTitle>
          <Badge variant="secondary" className="text-sm">
            Last Updated: March 27, 2025
          </Badge>
        </div>

        <ScrollArea className="flex-grow pr-4 overflow-y-auto max-h-[calc(100vh-300px)]">
          {termsOfServiceSections.map((section, index) => (
            <div key={index} className="mb-6">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  {index + 1}
                </div>
                <h2 className="text-lg font-semibold text-primary">
                  {section.title}
                </h2>
              </div>

              <div className="pl-12">
                <p className="text-muted-foreground mb-2">{section.content}</p>

                {section.details && (
                  <p className="text-sm text-muted-foreground italic mb-2 bg-secondary/50 p-2 rounded">
                    {section.details}
                  </p>
                )}

                {section.list && (
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    {section.list.map((item, itemIndex) => (
                      <li key={itemIndex} className="pl-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {index < termsOfServiceSections.length - 1 && (
                <Separator className="my-6" />
              )}
            </div>
          ))}
        </ScrollArea>

        <div className="text-center text-sm text-muted-foreground mb-4">
          <p>
            By using StorySync, you acknowledge that you have read, understood,
            and agree to these Terms of Service.
          </p>
        </div>

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
