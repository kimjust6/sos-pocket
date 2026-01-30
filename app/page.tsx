import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const session = await getServerSession();

  return (
    <section className="h-[calc(100vh-4em)] w-full object-scale-down flex justify-center items-center px-4">
      <Image
        src="https://i.imgur.com/KLKdKDT.jpg"
        className="h-screen"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority={true}
        alt="background image"
      />
      <Card className="max-w-2xl bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 flex flex-col items-center w-full">
        <CardHeader className="space-y-1 ">
          <CardTitle className="text-5xl">SOS Resoles</CardTitle>
          {/* <CardDescription>business description goes here</CardDescription> */}
        </CardHeader>
        <CardContent className="grid gap-4">
          <span>
            Summit Outdoor Store is an outdoor equipment company based in
            Ontario that resoles climbing shoes. Our mission is to extend the
            life of your favorite pair of climbing shoes in an affordable and
            sustainable manner.
          </span>
          {!session?.user && (
            <span className="py-6">
              Start by creating your account, or filling out a resole form.
            </span>
          )}
          {session?.user && (
            <span className="py-6">
              Fill out a resole form to start resoling your shoes!
            </span>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-10 flex-wrap">
          {!session?.user && (
            <Link href="/auth/register">
              <Button variant="default" size="lg">
                Create Account
              </Button>
            </Link>
          )}
          {session?.user && (
            <Link href="/home">
              <Button variant="default" size="lg">
                Home Page
              </Button>
            </Link>
          )}
          <Link href="/resole-form">
            <Button variant="outline" size="lg">
              Resole Form
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
