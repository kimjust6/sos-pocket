"use client";
import {
  getCurrentUser,
  onAuthStateChange,
} from "@/app/common/services/pocketbase.service";
import { Card, CardContent } from "@/components/ui/card";
import { User2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial check
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);

    // Subscribe to auth changes
    const unsubscribe = onAuthStateChange((token, record) => {
      setUser(record);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getProfileImage = (user: any) => {
    if (!user?.avatar) return null;
    const pbUrl =
      process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://sos-be.jkim.win";
    return `${pbUrl}/api/files/${user.collectionId}/${user.id}/${user.avatar}`;
  };

  if (isLoading) {
    return null; // Or legitimate loading spinner
  }

  if (!user) {
    return (
      <section className="w-full mt-24 flex justify-center items-center flex-col gap-4">
        <div>Please log in to view your profile.</div>
      </section>
    );
  }

  const profileImage = getProfileImage(user);
  const displayName =
    user.name || `${user.fName ?? ""} ${user.lName ?? ""}`.trim() || user.email;

  return (
    <section className="w-full mt-24 flex justify-center items-center flex-col gap-4">
      <Card className="glassmorphism-sm px-20 py-14 flex flex-col items-center">
        {!profileImage ? (
          <User2 strokeWidth={1.5} className="h-20 w-20" />
        ) : (
          <Image
            src={profileImage}
            alt="Profile Picture"
            width={120}
            height={120}
            priority={true}
            className="rounded-full aspect-square object-cover"
          />
        )}
        <CardContent className="p-4 mt-5 text-center">
          <h2 className="text-2xl font-bold">{displayName}</h2>
          <h3 className="text-gray-500">{user.email ?? ""}</h3>
        </CardContent>
      </Card>
    </section>
  );
};

export default ProfilePage;
