"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import termsOfServiceSections from "@/termsOfServiceSections.json";

export function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
          Terms of Service
        </h1>
        <Badge variant="secondary" className="text-sm">
          Last Updated: March 27, 2025
        </Badge>
      </div>

      <Card className="w-full mb-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl text-primary">
            Overview of Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto px-6 py-4">
            {termsOfServiceSections.map(
              (
                section: {
                  title: string;
                  content: string;
                  details?: string;
                  list?: string[];
                },
                index: number,
              ) => (
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
                    <p className="text-muted-foreground mb-2">
                      {section.content}
                    </p>

                    {section.details && (
                      <p className="text-sm text-muted-foreground italic mb-2 bg-secondary/50 p-2 rounded">
                        {section.details}
                      </p>
                    )}

                    {section.list && (
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        {section.list.map((item: string, itemIndex: number) => (
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
              ),
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          By using StorySync, you acknowledge that you have read, understood,
          and agree to these Terms of Service.
        </p>
      </div>
    </div>
  );
}
