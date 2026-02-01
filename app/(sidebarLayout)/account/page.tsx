"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getCurrentUser,
  onAuthStateChange,
  getPocketBase,
} from "@/app/common/services/pocketbase.service";
import { UsersResponse } from "@/pocketbase-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  User2,
  Package,
  LogOut,
  Loader2,
  Shield,
  MapPin,
  CreditCard,
  Pencil,
} from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState<UsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial check
    const currentUser = getCurrentUser();
    // @ts-ignore
    setUser(currentUser);
    setIsLoading(false);

    // Subscribe to auth changes
    const unsubscribe = onAuthStateChange((token, record) => {
      // @ts-ignore
      setUser(record);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getProfileImage = (user: UsersResponse) => {
    if (!user?.avatar) return null;
    const pbUrl =
      process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://sos-be.jkim.win";
    return `${pbUrl}/api/files/${user.collectionId}/${user.id}/${user.avatar}`;
  };

  const handleSignOut = () => {
    const pb = getPocketBase();
    pb.authStore.clear();
    setUser(null);
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Not Signed In</h1>
          <p className="mt-2 text-muted-foreground">
            Please log in to view your account details and order history.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login">
            <Button size="lg" className="px-8">
              Log In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline" size="lg" className="px-8">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const profileImage = getProfileImage(user);
  const displayName = user.name || user.email;

  const ActionCard = ({ title, description, icon: Icon, href }: any) => {
    return (
      <Link href={href} className="flex-1">
        <Card className="h-full hover:shadow-md transition-all cursor-pointer border-muted bg-card hover:border-primary/50 group">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/5">
      <section className="relative w-full py-12 md:py-16">
        {/* Dot Pattern Background */}
        <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] pointer-events-none" />

        <div className="container relative px-4 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 bg-background p-6 rounded-lg border shadow-sm">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Your Account
              </h1>
              <p className="text-muted-foreground">
                Manage your orders, profile, and preferences
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-background p-2 pr-4 rounded-full border shadow-sm">
                <div className="relative h-10 w-10">
                  {!profileImage ? (
                    <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center">
                      <User2 className="h-5 w-5 text-primary" />
                    </div>
                  ) : (
                    <Image
                      src={profileImage}
                      alt="Avatar"
                      fill
                      className="object-cover rounded-full"
                    />
                  )}
                </div>
                <span className="font-medium text-sm hidden sm:inline-block">
                  {displayName}
                </span>
              </div>
              <Link href="/account/security">
                <Button variant="ghost">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 1. Orders Card */}
            <ActionCard
              title="Your Orders"
              description="Track, return, or view your order history."
              icon={Package}
              href="/orders"
            />

            {/* 2. Login & Security Card */}
            <ActionCard
              title="Login & Security"
              description="Edit login, name, and mobile number."
              icon={Shield}
              href="/account/security"
            />

            {/* 3. Addresses Card */}
            <ActionCard
              title="Your Addresses"
              description="Edit addresses for orders and gifts."
              icon={MapPin}
              href="/account/addresses"
            />

            {/* 4. Payment Options Card */}
            <ActionCard
              title="Payment Options"
              description="Edit or add payment methods."
              icon={CreditCard}
              href="/account/payments"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
export default ProfilePage;
