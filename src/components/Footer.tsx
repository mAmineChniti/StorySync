import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className={cn(
        "w-full fixed bottom-0 left-0 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 p-4 bg-background border-t border-border text-muted-foreground",
      )}
    >
      <span className="text-xs sm:text-sm text-center sm:text-left">
        &copy; {new Date().getFullYear()} StorySync. All rights reserved.
      </span>
      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
        <Link
          className="text-primary hover:underline text-xs sm:text-sm"
          target="_blank"
          href="/terms-of-service"
        >
          Terms of Service
        </Link>
        <Link
          className="text-primary hover:underline text-xs sm:text-sm"
          target="_blank"
          href="/privacy-policy"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
