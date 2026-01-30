"use client";

import {
  adminSidebarItems,
  guestSidebarItems,
  navbarItemsGuest,
  navbarItemsUser,
  userSidebarItems,
} from "@/app/common/data/data";
import {
  getCurrentUser,
  onAuthStateChange,
} from "@/app/common/services/pocketbase.service";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link, { LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import { sidebarAtom } from "../atoms/atoms";

const HeaderNav = () => {
  const [topNavItems, setTopNavItems] = useState<any[]>([]);
  const [sideNavItems, setSideNavItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const pathname = usePathname();
  const [sidebar, setSidebar] = useAtom(sidebarAtom);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    // Initial check
    const currentUser = getCurrentUser();
    setUser(currentUser);
    updateNav(currentUser);

    // Subscribe to changes
    const unsubscribe = onAuthStateChange((token, record) => {
      setUser(record);
      updateNav(record);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateNav = (currentUser: any) => {
    if (currentUser?.role) {
      setTopNavItems(navbarItemsUser);
    } else {
      setTopNavItems(navbarItemsGuest);
    }

    if (currentUser?.role === "admin" || currentUser?.role === "employee") {
      setSideNavItems(adminSidebarItems);
    } else if (currentUser?.role === "user") {
      setSideNavItems(userSidebarItems);
    } else {
      setSideNavItems(guestSidebarItems);
    }
  };

  return (
    <>
      {/* Desktop nav */}
      <nav className="items-center space-x-6 text-sm font-medium ml-4 hidden md:flex">
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => setSidebar(!sidebar)}>
          <Menu />
        </Button>
        {topNavItems.map((navItem) => (
          <Link
            key={navItem.link}
            href={navItem.link}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.includes(navItem.link)
                ? "text-foreground"
                : "text-foreground/60"
            )}>
            {navItem.name}
          </Link>
        ))}
      </nav>
      {/* Mobile nav */}
      <Sheet open={mobileSidebar} onOpenChange={setMobileSidebar}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="mr-5 px-1 md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="mx-2">
          <MobileLink
            href="/"
            className="flex items-center"
            onOpenChange={setMobileSidebar}>
            <Image
              src="https://i.imgur.com/Q31euXN.jpg"
              className="mr-2 rounded-full border-2"
              height={36}
              width={36}
              alt="Logo"
            />
            <span className="font-bold">{siteConfig.name}</span>
          </MobileLink>
          <nav className="flex flex-col space-y-3 ml-1 mt-5">
            {sideNavItems.map((sideNavItem) => (
              <MobileLink
                key={sideNavItem.link}
                href={sideNavItem.link}
                onOpenChange={setMobileSidebar}>
                {sideNavItem.name}
              </MobileLink>
            ))}
            <Separator />
            {topNavItems.map((topNavItem) => (
              <MobileLink
                key={topNavItem.link}
                href={topNavItem.link}
                onOpenChange={setMobileSidebar}>
                {topNavItem.name}
              </MobileLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default HeaderNav;

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}>
      {children}
    </Link>
  );
}
