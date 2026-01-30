"use client";
import { getOauthUser } from "@/app/common/services/auth.service";
import { Card, CardContent } from "@/components/ui/card";
import { User2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>({});

  if (status !== "loading") {
  }

  useEffect(() => {
    const getMyOauthUser = async () => {
      const s = session as any;
      if (session && s?.user?.email && s?.user?.provider) {
        const response = await getOauthUser(s?.user?.email, s?.user?.provider);
        if (response?.status == "ok") {
          setProfile(response.data);
        }
      }
    };

    getMyOauthUser();
  }, [status]);
  return (
    status !== "loading" &&
    profile && (
      <section className="w-full mt-24 flex justify-center items-center flex-col gap-4">
        <Card className="glassmorphism-sm px-20 py-14 flex flex-col items-center">
          {!profile.image ? (
            <User2 strokeWidth={1.5} className="h-20 w-20" />
          ) : (
            <Image
              src={profile?.image}
              alt="Profile Picture"
              width={120}
              height={120}
              priority={true}
              className="rounded-full"
            />
          )}
          <CardContent className="p-4 mt-5">
            <h2 className="text-2xl font-bold">{`${profile?.fName ?? ""} ${
              profile?.lName ?? ""
            }`}</h2>
            <h3 className="text-gray-500">{profile.email ?? ""}</h3>
          </CardContent>
          {/* {Object.keys(profile).map((p, index) => {
            return <span key={index}>{p}</span>;
          })} */}
        </Card>
      </section>
    )
  );
};

export default ProfilePage;
