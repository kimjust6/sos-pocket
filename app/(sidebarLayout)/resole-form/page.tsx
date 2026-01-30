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
import { Separator } from "@/components/ui/separator";
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

  const FormSchema = z.object({
    fName: z.string().min(1, { message: "First Name is required." }),
    lName: z.string().min(1, { message: "Last Name is required." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z
      .string()
      .min(10, { message: "Please enter a valid phone number." }),
    address: z.string().min(1, { message: "Please enter a valid address." }),
    city: z
      .string()
      .min(2, { message: "The city must be at least 2 characters" }),
    apartment: z
      .string()
      .min(0, { message: "Apartment does not have any requirements." }),
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
    // Initial check
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser?.email) {
      form.setValue("email", currentUser.email, { shouldDirty: true });
    }

    // Subscribe to auth changes
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
    <section className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel
                    className="pl-2 -mb-1 mt-1 flex gap-2 items-center"
                    htmlFor="email">
                    Email*
                    <FormMessage />
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      placeholder="Email*"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={user ? true : false}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fName"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel
                    className="pl-2 -mb-1 mt-1 flex gap-2 items-center"
                    htmlFor="fName">
                    First Name*
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="fName"
                      placeholder="First Name*"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="fName"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lName"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel
                    className="pl-2 -mb-1 mt-1 flex gap-2 items-center"
                    htmlFor="lName">
                    Last Name*
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="lName"
                      placeholder="Last Name*"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="lName"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel
                    className="pl-2 -mb-1 mt-1 flex gap-2 items-center"
                    htmlFor="phone">
                    Phone Number*
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="phone"
                      placeholder="Phone Number*"
                      type="tel"
                      autoCapitalize="none"
                      autoComplete="phone"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel
                    className="pl-2 -mb-1 mt-1 flex gap-2 items-center"
                    htmlFor="address">
                    Address*
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="address"
                      placeholder="Address*"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="address"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apartment"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel
                    className="pl-2 -mb-1 mt-1 flex gap-2 items-center"
                    htmlFor="apartment">
                    Apartment
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="apartment"
                      placeholder="Apartment Number"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="apartment"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel
                    className="pl-2 -mb-1 mt-1 flex gap-2 items-center"
                    htmlFor="city">
                    City*
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="city"
                      placeholder="City*"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="city"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormLabel
                      className="pl-2 -mb-1 mt-1 flex gap-2 items-center"
                      htmlFor="province">
                      Province*
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Province*" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Province</SelectLabel>
                        {[
                          provinces.map((province) => {
                            return (
                              <SelectItem
                                key={province.code}
                                value={province.name}>
                                {province.name}
                              </SelectItem>
                            );
                          }),
                        ]}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postal"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel
                    className="pl-2 -mb-1 mt-1 flex gap-2 items-center"
                    htmlFor="postal">
                    Postal Code*
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="postal"
                      placeholder="Postal Code*"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="postal"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <span className="flex sm:flex-col-reverse flex-col mt-2">
              <Button
                variant="destructive"
                type="button"
                disabled={isLoading}
                onClick={() => {
                  form.reset();
                }}>
                Clear Fields
              </Button>
              <Separator className="my-2" />
              <Button disabled={isLoading} type="submit">
                {isLoading ? (
                  <Spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <span>Next</span>
                )}
              </Button>
            </span>
          </div>
        </form>
      </Form>
    </section>
  );
}

const SubmitResoleForm = () => {
  return (
    <section className="container items-center justify-center min-w-[300px] max-w-[700px] border rounded-lg lg:my-5 py-5 bg-background m-auto">
      <div className="flex flex-col space-y-2 text-center mb-6 ">
        <h1 className="text-2xl font-semibold tracking-tight">Resole Form</h1>
        <p className="text-sm text-muted-foreground">
          Enter your address information below.
        </p>
      </div>
      <ResoleForm />
    </section>
  );
};
export default SubmitResoleForm;
