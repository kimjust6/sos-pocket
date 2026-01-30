"use client";
import { addressAtom } from "@/app/common/atoms/atoms";
import Spinner from "@/app/common/components/spinner";
import { provinces } from "@/app/common/data/data";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import {
  getCurrentUser,
  onAuthStateChange,
} from "@/app/common/services/pocketbase.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, ArrowLeft } from "lucide-react";

const FormSchema = z.object({
  fName: z.string().min(1, { message: "First Name is required." }),
  lName: z.string().min(1, { message: "Last Name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(1, { message: "Please enter a valid address." }),
  city: z
    .string()
    .min(2, { message: "The city must be at least 2 characters" }),
  apartment: z.string().min(0),
  province: z.string().min(1, { message: "Please select a province" }),
  postal: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z][ -]?[0-9][ABCEGHJ-NPRSTV-Z][0-9]$/i,
      { message: "Please enter a valid postal code." }
    ),
});

interface ResoleFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ResoleForm({ className, ...props }: ResoleFormProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [address, setAddress] = useAtom(addressAtom);
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setAddress(data);
    setIsLoading(false);
    router.push("/resole-form-2");
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fName: "",
      lName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      apartment: "",
      province: "",
      postal: "",
    },
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser?.email) {
      form.setValue("email", currentUser.email, { shouldDirty: true });
    }

    const unsubscribe = onAuthStateChange((token, record) => {
      setUser(record);
      if (record?.email) {
        form.setValue("email", record.email, { shouldDirty: true });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [form]);

  return (
    <section className={cn("", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          {/* Personal Information Group */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold tracking-tight border-b pb-4">
              Contact Information
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fName"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lName"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={!!user}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Address Group */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold tracking-tight border-b pb-4">
              Shipping Address
            </h3>

            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="address"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apartment"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="city"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {provinces.map((province) => (
                            <SelectItem
                              key={province.code}
                              value={province.name}>
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postal"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-background uppercase" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <Button
              variant="ghost"
              type="button"
              disabled={isLoading}
              onClick={() => form.reset()}
              className="text-muted-foreground hover:text-foreground pl-0">
              Clear form
            </Button>

            <Button
              disabled={isLoading}
              type="submit"
              size="lg"
              className="px-8">
              {isLoading ? (
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}

const SubmitResoleForm = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Start a Resole
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Let's get your shoes back on the wall. First, tell us where to ship
            them back.
          </p>
        </div>

        <div className="bg-card border rounded-xl p-6 sm:p-10 shadow-sm">
          <ResoleForm />
        </div>
      </div>
    </div>
  );
};

export default SubmitResoleForm;
