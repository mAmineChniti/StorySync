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
    <Card className="w-full md:w-64 shrink-0 mb-6 md:mb-0 sticky top-24 h-fit">
      <div className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={pathname === item.url ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              pathname === item.url ? "bg-purple-600 hover:bg-purple-700" : "",
            )}
            onClick={() => router.push(item.url)}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}
