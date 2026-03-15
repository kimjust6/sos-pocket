"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  getCurrentUser,
  onAuthStateChange,
  getPocketBase,
} from "@/app/common/services/pocketbase.service";
import { UsersResponse } from "@/pocketbase-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Camera, User2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SecurityPage = () => {
  const [user, setUser] = useState<UsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState({ name: "", phone: "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    // @ts-ignore
    setUser(currentUser);
    if (currentUser) {
      setEditForm({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
      });
    }
    setIsLoading(false);

    const unsubscribe = onAuthStateChange((token, record) => {
      // @ts-ignore
      setUser(record);
      if (record) {
        setEditForm({
          name: record.name || "",
          phone: record.phone || "",
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const getProfileImage = () => {
    if (previewUrl) return previewUrl;
    if (user?.avatar) {
      const pbUrl =
        process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://sos-be.jkim.win";
      return `${pbUrl}/api/files/${user.collectionId}/${user.id}/${user.avatar}`;
    }
    return null;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const pb = getPocketBase();
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("phone", editForm.phone);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const updatedUser = await pb
        .collection("users")
        .update(user.id, formData);
      // @ts-ignore
      setUser(updatedUser);
      toast({
        title: "Profile Updated",
        description: "Your account details have been successfully saved.",
      });
      router.push("/account");
    } catch (error) {
      console.error("Failed to update profile", error);
      toast({
        title: "Update Failed",
        description:
          "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
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
      <div className="container py-10 text-center">
        <p>Please log in to view this page.</p>
      </div>
    );
  }

  const profileImageSrc = getProfileImage();

  return (
    <div className="min-h-screen bg-muted/5 py-12">
      <div className="container max-w-2xl">
        <div className="mb-6">
          <Link
            href="/account"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Account
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login & Security</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center justify-center gap-4">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}>
                  <div className="h-24 w-24 rounded-full overflow-hidden ring-4 ring-background shadow-lg relative bg-primary/10 flex items-center justify-center">
                    {profileImageSrc ? (
                      <Image
                        src={profileImageSrc}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User2 className="h-10 w-10 text-primary" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}>
                  Change Photo
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed here.
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <Link href="/account">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityPage;
