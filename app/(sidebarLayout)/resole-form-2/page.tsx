"use client";
import { addressAtom, shoeDetailsAtom } from "@/app/common/atoms/atoms";
import Spinner from "@/app/common/components/spinner";
import { provinces } from "@/app/common/data/data";
import { postResoleOrder } from "@/app/common/services/resole-order.service";

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
import { useToast } from "@/components/ui/use-toast";

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
  const [shoeDetails] = useAtom(shoeDetailsAtom);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fName: address.fName || "",
      lName: address.lName || "",
      email: address.email || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      apartment: address.apartment || "",
      province: address.province || "",
      postal: address.postal || "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setAddress(data); // Update atom with latest address

    try {
      if (!shoeDetails || shoeDetails.shoes.length === 0) {
        toast({
          title: "Error",
          description: "No shoe details found. Please start over.",
          variant: "destructive",
        });
        router.push("/resole-form");
        return;
      }

      // Combine address and shoe data for submission
      await postResoleOrder(data, shoeDetails.shoes);
      router.push("/resole-form-3");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

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

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() => router.push("/resole-form")}
              className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shoe Details
            </Button>

            <Button
              disabled={isLoading}
              type="submit"
              size="lg"
              className="w-full sm:w-auto px-8 ml-auto">
              {isLoading ? (
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Submit Order
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

const SubmitAddressForm = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Where should we send them back?
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Enter your shipping details below.
          </p>
        </div>

        <div className="bg-card border rounded-xl p-6 sm:p-10 shadow-sm">
          <ResoleForm />
        </div>
      </div>
    </div>
  );
};

export default SubmitAddressForm;
