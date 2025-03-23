"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookOpen, Edit, PenTool, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function ProfileSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      id: "profile",
      label: "Profile Information",
      url: "/profile",
      icon: User,
    },
    {
      id: "my-stories",
      label: "My Stories",
      url: "/user-stories",
      icon: BookOpen,
    },
    {
      id: "collaborations",
      label: "Collaborations",
      url: "/collaborations",
      icon: Edit,
    },
    {
      id: "create-story",
      label: "Create New Story",
      url: "/create-story",
      icon: PenTool,
    },
  ];

  return (
    <Card className="w-full md:w-64 shrink-0 mb-4 md:mb-0 sticky top-24 max-md:static max-md:mb-4 h-fit bg-card text-card-foreground border-border">
      <div className="p-2 sm:p-4 space-y-1 sm:space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={pathname === item.url ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-2 cursor-pointer transition-colors",
              "text-sm sm:text-base h-10 sm:h-11",
              pathname === item.url
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => router.push(item.url)}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1 text-left">{item.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}
