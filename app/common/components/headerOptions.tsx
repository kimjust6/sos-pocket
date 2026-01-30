"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ChevronDown,
  CreditCard,
  LogIn,
  LogOut,
  Settings,
  User2,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./themeToggle";

const HeaderOptions = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  const signInButton = () => {
    return (
      <Link href="/auth/login">
        <Button variant="outline" onClick={() => {}}>
          <LogIn strokeWidth={1.5} className="h-5 w-5 -ml-1" />
          <span className="mx-2">Sign In</span>
        </Button>
      </Link>
    );
  };

  const dropdownMenu = () => {
    if (!session?.user) {
      return null;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {!session.user.image ? (
              <User2 strokeWidth={1.5} className="h-5 w-5 -ml-1" />
            ) : (
              <Image
                src={session.user.image}
                alt="Profile Picture"
                width={24}
                height={24}
                priority={true}
                className="rounded-full -ml-1"
              />
            )}
            <span className="mx-2">{session.user.name}</span>
            <ChevronDown strokeWidth={1.5} className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52 mr-4">
          <DropdownMenuLabel>Manage Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                router.push("/profile");
              }}>
              <User2 strokeWidth={1.5} className="h-4 w-4" />
              <span className="mx-3">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                router.push("/billing");
              }}>
              <CreditCard strokeWidth={1.5} className="h-4 w-4" />
              <span className="mx-3">Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                router.push("/settings");
              }}>
              <Settings strokeWidth={1.5} className="h-4 w-4" />
              <span className="mx-3">Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {/* <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="cursor-pointer">
              <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="mx-3">Toggle Theme</span>
            </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer">
            <LogOut strokeWidth={1.5} className="h-4 w-4" />
            <span className="mx-3">Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <>
      {/* <SearchBar /> */}
      <TooltipProvider>
        <ThemeToggle />
      </TooltipProvider>
      {session?.user ? dropdownMenu() : signInButton()}
    </>
  );
};

export default HeaderOptions;
