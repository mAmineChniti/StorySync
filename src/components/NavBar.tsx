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

  const Logout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    deleteCookie("user");
    deleteCookie("access");
    deleteCookie("refresh");
    router.push("/");
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className="fixed top-0 left-0 w-full h-16 bg-background text-foreground flex items-center px-4 shadow-md z-50">
        <NavigationMenuItem>
          <Link href="/" passHref legacyBehavior>
            <NavigationMenuLink className="hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground focus:bg-transparent focus:outline-none active:bg-transparent active:outline-none">
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {!isUserLoggedIn ? (
          <>
            <NavigationMenuItem className="ml-auto">
              <Link href="/login" passHref legacyBehavior>
                <NavigationMenuLink className="hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground focus:bg-transparent focus:outline-none active:bg-transparent active:outline-none">
                  Login
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/register" passHref legacyBehavior>
                <NavigationMenuLink className="hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground focus:bg-transparent focus:outline-none active:bg-transparent active:outline-none">
                  Register
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        ) : (
          <>
            <NavigationMenuItem className="ml-auto">
              <Link href="/browse" passHref legacyBehavior>
                <NavigationMenuLink className="hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground focus:bg-transparent focus:outline-none active:bg-transparent active:outline-none">
                  Browse Stories
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/profile" passHref legacyBehavior>
                <NavigationMenuLink className="hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground focus:bg-transparent focus:outline-none active:bg-transparent active:outline-none">
                  Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="#" passHref legacyBehavior>
                <NavigationMenuLink
                  onClick={Logout}
                  className="hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground focus:bg-transparent focus:outline-none active:bg-transparent active:outline-none"
                >
                  Logout
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        )}
        <NavigationMenuItem>
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
