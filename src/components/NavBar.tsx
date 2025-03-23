"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { deleteCookie, hasCookie } from "cookies-next/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/ModeToggle";

export default function NavBar() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsUserLoggedIn(hasCookie("user"));
  }, [pathname]);

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    deleteCookie("user");
    deleteCookie("access");
    deleteCookie("refresh");
    router.push("/");
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className="fixed top-0 left-0 w-full h-16 bg-background text-foreground flex items-center px-4 sm:px-6 shadow-md z-50 border-b border-border">
        {/* Home Link */}
        <NavigationMenuItem>
          <Link href="/" passHref legacyBehavior>
            <NavigationMenuLink
              aria-label="Home"
              className="px-4 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent/20 focus:outline-none active:bg-accent/30"
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {!isUserLoggedIn ? (
          <>
            {/* Login/Register Links */}
            <NavigationMenuItem className="ml-auto">
              <Link href="/login" passHref legacyBehavior>
                <NavigationMenuLink
                  aria-label="Login"
                  className="px-4 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent/20 focus:outline-none active:bg-accent/30"
                >
                  Login
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/register" passHref legacyBehavior>
                <NavigationMenuLink
                  aria-label="Register"
                  className="px-4 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent/20 focus:outline-none active:bg-accent/30"
                >
                  Register
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        ) : (
          <>
            {/* Authenticated Links */}
            <NavigationMenuItem className="ml-auto">
              <Link href="/browse" passHref legacyBehavior>
                <NavigationMenuLink
                  aria-label="Browse Stories"
                  className="px-4 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent/20 focus:outline-none active:bg-accent/30"
                >
                  Browse Stories
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/profile" passHref legacyBehavior>
                <NavigationMenuLink
                  aria-label="Profile"
                  className="px-4 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent/20 focus:outline-none active:bg-accent/30"
                >
                  Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="#" passHref legacyBehavior>
                <NavigationMenuLink
                  aria-label="Logout"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent/20 focus:outline-none active:bg-accent/30"
                >
                  Logout
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        )}

        {/* Theme Toggle */}
        <NavigationMenuItem className="ml-2">
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
