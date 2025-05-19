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
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    undefined,
  );
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
    const isAuthenticated =
      hasCookie("user") && hasCookie("access") && hasCookie("refresh");
    if (isAuthenticated) {
      setIsUserLoggedIn(true);
      const profilePicture = localStorage.getItem("profile_picture");
      setProfilePicture(profilePicture ?? undefined);
    } else {
      setIsUserLoggedIn(false);
      setProfilePicture(undefined);
    }
  }, [pathname]);

  const handleLogout = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();
    await Promise.all([
      deleteCookie("user"),
      deleteCookie("access"),
      deleteCookie("refresh"),
    ]);
    localStorage.removeItem("profile_picture");
    router.push("/");
    router.refresh();
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className="fixed top-0 left-0 w-full h-16 bg-background text-foreground flex items-center px-2 sm:px-4 shadow-md z-50 border-b border-border">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/"
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
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {isUserLoggedIn ? (
            <>
              {profilePicture && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/profile"
                      aria-label="Profile"
                      className={cn(
                        "rounded-full transition-colors hover:bg-accent hover:text-accent-foreground",
                        getActiveClass().profile
                          ? "bg-accent text-accent-foreground"
                          : "",
                      )}
                    >
                      <Image
                        src={profilePicture}
                        alt="Profile Picture"
                        width={32}
                        height={32}
                        className="rounded-full h-8 w-8 object-cover"
                      />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/browse"
                    aria-label="Browse Stories"
                    className={cn(
                      "px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                      getActiveClass().browse
                        ? "bg-accent text-accent-foreground"
                        : "",
                    )}
                  >
                    Browse
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="#"
                    aria-label="Logout"
                    onClick={handleLogout}
                    className="px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-transparent focus:outline-none"
                  >
                    Logout
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          ) : (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/login"
                    aria-label="Login"
                    className={cn(
                      "px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                      getActiveClass().login
                        ? "bg-accent text-accent-foreground"
                        : "",
                    )}
                  >
                    Login
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/register"
                    aria-label="Register"
                    className={cn(
                      "px-3 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                      getActiveClass().register
                        ? "bg-accent text-accent-foreground"
                        : "",
                    )}
                  >
                    Register
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          )}
          <ModeToggle />
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
