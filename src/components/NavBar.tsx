"use client";

import { ModeToggle } from "@/components/ModeToggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { deleteCookie, hasCookie } from "cookies-next/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      <NavigationMenuList className="fixed top-0 left-0 w-full h-16 bg-background text-foreground flex items-center px-2 sm:px-4 shadow-md z-50 border-b border-border">
        <NavigationMenuItem>
          <Link href="/" passHref legacyBehavior>
            <NavigationMenuLink
              aria-label="Home"
              className="px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent/20 focus:outline-none active:bg-accent/30"
            >
              <Image
                src="/favicon.ico"
                alt="Home"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
                priority
              />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {!isUserLoggedIn ? (
            <>
              <NavigationMenuItem>
                <Link href="/login" passHref legacyBehavior>
                  <NavigationMenuLink
                    aria-label="Login"
                    className="px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent/20 focus:outline-none active:bg-accent/30"
                  >
                    Login
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/register" passHref legacyBehavior>
                  <NavigationMenuLink
                    aria-label="Register"
                    className="px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent/20 focus:outline-none active:bg-accent/30"
                  >
                    Register
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </>
          ) : (
            <>
              <NavigationMenuItem>
                <Link href="/browse" passHref legacyBehavior>
                  <NavigationMenuLink
                    aria-label="Browse Stories"
                    className="px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent/20 focus:outline-none active:bg-accent/30"
                  >
                    Browse
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/profile" passHref legacyBehavior>
                  <NavigationMenuLink
                    aria-label="Profile"
                    className="px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent/20 focus:outline-none active:bg-accent/30"
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
                    className="px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent/20 focus:outline-none active:bg-accent/30"
                  >
                    Logout
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </>
          )}
          <ModeToggle />
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
