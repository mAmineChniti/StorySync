import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full h-10 fixed bottom-0 left-0 flex items-center justify-center bg-background border-t border-border text-muted-foreground">
      &copy; {new Date().getFullYear()} StorySync. All rights reserved.&nbsp;
      <Link
        className="text-primary hover:underline"
        target="_blank"
        href="/terms-of-service"
      >
        Terms of Service&nbsp;
      </Link>
      <Link
        className="text-primary hover:underline"
        target="_blank"
        href="/privacy-policy"
      >
        Privacy Policy
      </Link>
    </footer>
  );
}
