"use client";

import { ModeToggle } from "@/components/ModeToggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { deleteCookie, hasCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ROUTE_PRIORITY = [
  {
    key: "profile",
    routes: ["/profile", "/user-stories", "/collaborations", "/create-story"],
  },
  { key: "browse", routes: ["/browse"] },
  { key: "login", routes: ["/login"] },
  { key: "register", routes: ["/register"] },
];

export default function NavBar() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const getActiveClass = () => {
    for (const route of ROUTE_PRIORITY) {
      if (route.routes.includes(pathname)) {
        return {
          login: route.key === "login",
          register: route.key === "register",
          browse: route.key === "browse",
          profile: route.key === "profile",
        };
      }
    }
    return {
      login: false,
      register: false,
      browse: false,
      profile: false,
    };
  };

  useEffect(() => {
    const userCookie = hasCookie("user");
    const accessCookie = hasCookie("access");
    const refreshCookie = hasCookie("refresh");
    if (userCookie && accessCookie && refreshCookie) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  }, [pathname]);

  const handleLogout = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();
    await deleteCookie("user");
    await deleteCookie("access");
    await deleteCookie("refresh");
    router.push("/");
    router.refresh();
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className="fixed top-0 left-0 w-full h-16 bg-background text-foreground flex items-center px-2 sm:px-4 shadow-md z-50 border-b border-border">
        <NavigationMenuItem>
          <Link href="/" passHref legacyBehavior>
            <NavigationMenuLink
              aria-label="Home"
              className="px-3 py-1 rounded-md hover:bg-transparent focus:outline-none focus:bg-transparent"
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
          {isUserLoggedIn ? (
            <>
              <NavigationMenuItem>
                <Link href="/browse" passHref legacyBehavior>
                  <NavigationMenuLink
                    aria-label="Browse Stories"
                    className={cn(
                      "px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                      getActiveClass().browse
                        ? "bg-accent text-accent-foreground"
                        : "",
                    )}
                  >
                    Browse
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/profile" passHref legacyBehavior>
                  <NavigationMenuLink
                    aria-label="Profile"
                    className={cn(
                      "px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                      getActiveClass().profile
                        ? "bg-accent text-accent-foreground"
                        : "",
                    )}
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
                    className="px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-transparent focus:outline-none"
                  >
                    Logout
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </>
          ) : (
            <>
              <NavigationMenuItem>
                <Link href="/login" passHref legacyBehavior>
                  <NavigationMenuLink
                    aria-label="Login"
                    className={cn(
                      "px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                      getActiveClass().login
                        ? "bg-accent text-accent-foreground"
                        : "",
                    )}
                  >
                    Login
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/register" passHref legacyBehavior>
                  <NavigationMenuLink
                    aria-label="Register"
                    className={cn(
                      "px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                      getActiveClass().register
                        ? "bg-accent text-accent-foreground"
                        : "",
                    )}
                  >
                    Register
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
