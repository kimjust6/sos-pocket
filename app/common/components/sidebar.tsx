"use client";

import {
  adminSidebarItems,
  guestSidebarItems,
  userSidebarItems,
} from "@/app/common/data/data";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { sidebarAtom } from "@/app/common/atoms/atoms";
import {
  getCurrentUser,
  logout,
  onAuthStateChange,
} from "@/app/common/services/pocketbase.service";

const Sidebar = () => {
  const [sidebar, setSidebar] = useAtom(sidebarAtom);
  const router = useRouter();

  const pathname = usePathname();
  const [items, setItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Initial load
    const currentUser = getCurrentUser();
    setUser(currentUser);
    updateItems(currentUser);

    // Subscribe to auth changes
    const unsubscribe = onAuthStateChange((token, record) => {
      setUser(record);
      updateItems(record);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateItems = (u: any) => {
    if (u?.role === "admin" || u?.role === "employee") {
      setItems(adminSidebarItems);
    } else if (u?.role === "user") {
      setItems(userSidebarItems);
    } else {
      setItems(guestSidebarItems);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    router.refresh();
  };

  return (
    <aside
      className={
        "sticky top-0 z-50 h-[100dvh] border-r py-6 pl-2 hidden md:block " +
        (sidebar ? "w-[250px] pr-2" : "w-[64px]")
      }>
      <nav className="flex flex-col">
        <Link href="/" className="flex items-center mb-3 mx-1">
          <Image
            src="https://i.imgur.com/Q31euXN.jpg"
            className="h-10 w-10 rounded-full border-2 mr-2"
            height={35}
            width={35}
            alt="Logo"
          />
          <span className="hidden font-bold sm:inline-block text-2xl">
            {sidebar && siteConfig.name}
          </span>
        </Link>
        {/* if the sidebar is expanded, show text, otherwise show icon and tooltip  */}
        {items.map((navItem) => {
          return sidebar ? (
            <Link
              key={navItem.link}
              href={navItem.link}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === navItem.link || pathname.includes(navItem.link)
                  ? "bg-muted hover:bg-muted"
                  : "hover:bg-transparent hover:underline",
                !sidebar && "w-fit",
                "justify-start mt-1"
              )}>
              <div>{navItem.icon}</div>
              {sidebar && <span className="ml-3">{navItem.name}</span>}
            </Link>
          ) : (
            <Tooltip delayDuration={0} key={"tooltip" + navItem.link}>
              <TooltipTrigger asChild>
                <Link
                  href={navItem.link}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    pathname === navItem.link || pathname.includes(navItem.link)
                      ? "bg-muted hover:bg-muted"
                      : "hover:bg-transparent hover:underline",
                    !sidebar && "w-fit",
                    "justify-start mt-1"
                  )}>
                  <div>{navItem.icon}</div>
                  {sidebar && <span className="ml-3">{navItem.name}</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{navItem.name}</p>
                <TooltipArrow width={11} height={5} />
              </TooltipContent>
            </Tooltip>
          );
        })}
        {user && (
          <>
            <Separator className="my-4" />
            {/* if the sidebar is expanded, show text, otherwise show icon and tooltip  */}
            {sidebar ? (
              <button
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "hover:bg-transparent hover:underline",
                  "justify-start"
                )}
                onClick={handleLogout}>
                <IoLogOutOutline />
                {sidebar && <span className="ml-3">Sign Out</span>}
              </button>
            ) : (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "hover:bg-transparent hover:underline",
                      "justify-start"
                    )}
                    onClick={handleLogout}>
                    <IoLogOutOutline />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Sign Out</p>
                  <TooltipArrow width={15} height={8} />
                </TooltipContent>
              </Tooltip>
            )}
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
