import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { getCookie } from 'cookies-next';
import Link from 'next/link';

export default function NavBar() {
  const user = getCookie('user');
  return (
    <NavigationMenu>
      <NavigationMenuList className="fixed top-0 left-0 w-full h-16 bg-black text-white flex items-center px-4 shadow-md z-50">
        <NavigationMenuItem>
          <Link href="/" passHref legacyBehavior>
            <NavigationMenuLink className="hover:bg-neutral-300/40 hover:text-white focus:text-white focus:bg-transparent focus:outline-none active:bg-transparent active:outline-none">
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {!user ? (
          <>
            <NavigationMenuItem className="ml-auto">
              <Link href="/login" passHref legacyBehavior>
                <NavigationMenuLink className="hover:bg-neutral-300/40 hover:text-white focus:text-white focus:bg-transparent focus:outline-none active:bg-transparent active:outline-none">
                  Login
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/register" passHref legacyBehavior>
                <NavigationMenuLink className="hover:bg-neutral-300/40 hover:text-white focus:text-white focus:bg-transparent focus:outline-none active:bg-transparent active:outline-none">
                  Register
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        ) : (
          <NavigationMenuItem className="ml-auto">
            <Link href="/logout" passHref legacyBehavior>
              <NavigationMenuLink className="hover:bg-neutral-300/40 hover:text-white focus:text-white focus:bg-transparent focus:outline-none active:bg-transparent active:outline-none">
                Logout
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
