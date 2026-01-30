"use client";

import Spinner from "@/app/common/components/spinner";
import {
  getCurrentUser,
  isAuthenticated,
  loginWithEmail,
  loginWithGoogle,
  onAuthStateChange,
} from "@/app/common/services/pocketbase.service";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import * as z from "zod";

const LoginFormSchema = z.object({
  email: z.string().min(8, {
    message: "Email must be at least 8 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isLoadingGoogle) {
      return;
    }
    const timeout = setTimeout(() => {
      setIsLoadingGoogle(false);
    }, 10000);
    return () => clearTimeout(timeout);
  }, [isLoadingGoogle]);

  useEffect(() => {
    if (!isLoadingEmail) {
      return;
    }
    const timeout = setTimeout(() => {
      setIsLoadingEmail(false);
    }, 10000);
    return () => clearTimeout(timeout);
  }, [isLoadingEmail]);

  async function onSubmitGoogle(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoadingGoogle(true);

    try {
      const result = await loginWithGoogle();

      if (result.success) {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in with Google.",
        });
        router.push("/profile");
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          variant: "destructive",
          description: result.error || "Google authentication failed.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Uh oh! Something went wrong.",
        variant: "destructive",
        description: error?.message || "Google authentication failed.",
      });
    } finally {
      setIsLoadingGoogle(false);
    }
  }

  async function onSubmitEmail(data: z.infer<typeof LoginFormSchema>) {
    setIsLoadingEmail(true);

    try {
      const result = await loginWithEmail(data.email, data.password);

      if (result.success) {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        router.push("/profile");
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          variant: "destructive",
          description: result.error || "Invalid email or password.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Uh oh! Something went wrong.",
        variant: "destructive",
        description: error?.message || "Internal Server Error.",
      });
    } finally {
      setIsLoadingEmail(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitEmail)}
          className="grid gap-6">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      placeholder="password"
                      type="password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={isLoadingEmail}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoadingEmail} className="relative">
            <Mail className="h-4 w-4 mr-2" />
            <span>Sign In with Email</span>
            {isLoadingEmail && (
              <Spinner className="absolute right-4 h-4 w-4 animate-spin" />
            )}
          </Button>
        </form>
      </Form>
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={onSubmitGoogle}
        disabled={isLoadingGoogle}
        className="relative">
        <FcGoogle className="text-lg" />
        <span className="ml-2">Sign In with Google</span>
        {isLoadingGoogle && (
          <Spinner className="absolute right-4 h-4 w-4 animate-spin" />
        )}
      </Button>
    </div>
  );
}

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Check if already authenticated (only on client-side)
    try {
      if (isAuthenticated() && getCurrentUser()) {
        router.push("/profile");
        return;
      }
    } catch (e) {
      // Ignore auth check errors on initial load
    }
    setIsLoading(false);

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange((token, record) => {
      if (token && record) {
        router.push("/profile");
      }
    });

    return () => unsubscribe();
  }, [router, isMounted]);

  if (!isMounted || isLoading) {
    return (
      <section className="h-full w-full flex items-center justify-center">
        <Spinner className="h-8 w-8 animate-spin" />
      </section>
    );
  }

  return (
    <section className="h-full w-full flex">
      <div className="w-[400px] px-8 py-12 m-auto">
        <div className="flex mb-8 justify-between">
          <div className="space-y-2">
            <p className="text-3xl font-semibold tracking-tight">
              Login to SOS
            </p>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="underline underline-offset-4 hover:text-primary">
                Register
              </Link>
            </p>
          </div>
          <Image
            className="rounded-full"
            width={66}
            height={66}
            src="https://i.imgur.com/Q31euXN.jpg"
            alt="Logo"
            priority={true}
          />
        </div>

        <LoginForm />

        <p className="px-6 mt-4 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      <Image
        src="https://i.imgur.com/whZRT0S.jpg"
        className="lg:w-1/2 object-cover object-right-bottom hidden 
                lg:flex border-l border-stone-200"
        alt="Climbing"
        width={1920}
        height={1080}
        priority={true}></Image>
    </section>
  );
};

export default Login;
