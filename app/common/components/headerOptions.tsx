"use client";
import {
  getCurrentUser,
  logout,
  onAuthStateChange,
} from "@/app/common/services/pocketbase.service";
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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./themeToggle";

const HeaderOptions = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial check
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);

    // Subscribe to changes
    const unsubscribe = onAuthStateChange((token, record) => {
      setUser(record);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
    router.refresh();
  };

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

  const getProfileImage = (user: any) => {
    if (!user.avatar) return null;
    // Construct PocketBase file URL
    const pbUrl =
      process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://sos-be.jkim.win";
    return `${pbUrl}/api/files/${user.collectionId}/${user.id}/${user.avatar}`;
  };

  const dropdownMenu = () => {
    if (!user) {
      return null;
    }

    // Display name logic: name field or combine fName/lName if available, or email
    const displayName = user.name || user.email;
    const profileImage = getProfileImage(user);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {!profileImage ? (
              <User2 strokeWidth={1.5} className="h-5 w-5 -ml-1" />
            ) : (
              <Image
                src={profileImage}
                alt="Profile Picture"
                width={24}
                height={24}
                priority={true}
                className="rounded-full -ml-1 aspect-square object-cover"
              />
            )}
            <span className="mx-2 truncate max-w-[100px]">{displayName}</span>
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
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut strokeWidth={1.5} className="h-4 w-4" />
            <span className="mx-3">Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (isLoading) {
    return null; // Or skeleton
  }

  return (
    <>
      <TooltipProvider>
        <ThemeToggle />
      </TooltipProvider>
      {user ? dropdownMenu() : signInButton()}
    </>
  );
};

export default HeaderOptions;
