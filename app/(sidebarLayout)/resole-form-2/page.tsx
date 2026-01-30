"use client";
import { addressAtom, uploadingImageAtom } from "@/app/common/atoms/atoms";
import { SingleImageDropzoneUsage } from "@/app/common/components/SingleImageDrop";
import { resoleServices, shoeManufacturers } from "@/app/common/data/data";
import { IResoleInfo } from "@/app/common/data/interfaces";
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Footprints,
  Wrench,
  Tag,
  Ruler,
  Camera,
} from "lucide-react";
import Spinner from "@/app/common/components/spinner";
import { cn } from "@/lib/utils";

const emptyShoe: IResoleInfo = {
  size: "",
  manufacturer: "",
  otherManufacturer: "",
  model: "",
  serviceType: "",
  image: "",
};

export default function SubmitShoeForm() {
  const [imgArr, setImgArr] = useAtom(uploadingImageAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const [shoeAddress, setShoeAddress] = useAtom(addressAtom);

  const FormSchema = z.object({
    shoes: z.array(
      z.object({
        size: z.string().min(1, { message: "Shoe size is required." }),
        manufacturer: z
          .string()
          .min(1, { message: "Please select a manufacturer." }),
        otherManufacturer: z.string(),
        model: z.string().min(2, { message: "Please enter a valid model." }),
        serviceType: z.string().min(1, { message: "Please select a service." }),
        image: z.string(),
      })
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      shoes: [emptyShoe],
    },
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    name: "shoes",
    control: form.control,
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    // add the image link to the shoes array
    for (let i = 0; i < data.shoes.length; i++) {
      if (imgArr[i]) {
        data.shoes[i].image = imgArr[i];
      }
    }
    await postResoleOrder(shoeAddress, data.shoes);
    setIsLoading(false);
    router.push("/resole-form-3");
  };

  useEffect(() => {
    // console.log({ imgArr });
    // for (let i = 0; i < imgArr.length; i++) {
    //   if (imgArr[i] === "") {
    //     setIsUploading(true);
    //     return;
    //   }
    // }
    // setIsUploading(false);
  }, [JSON.stringify(imgArr)]);

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Shoe Details
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Tell us about the shoes you're sending in. You can add multiple
            pairs.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn(index > 0 ? "border-t border-border" : "")}>
                  <div className="p-6 sm:p-10 space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight">
                          Shoe Information
                        </h3>
                      </div>

                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            remove(index);
                            setImgArr((oldArr: string[]) => {
                              oldArr.splice(index, 1);
                              return oldArr;
                            });
                          }}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`shoes.${index}.manufacturer`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              Manufacturer
                            </FormLabel>
                            <Select
                              disabled={isLoading}
                              onValueChange={field.onChange}
                              defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background h-11">
                                  <SelectValue placeholder="Select manufacturer" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  {shoeManufacturers.map((manufacturer) => (
                                    <SelectItem
                                      key={manufacturer.name}
                                      value={manufacturer.name}>
                                      {manufacturer.name}
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
                        name={`shoes.${index}.model`}
                        disabled={isLoading}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Footprints className="w-4 h-4" />
                              Model
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g. Solution Comp"
                                className="bg-background h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`shoes.${index}.size`}
                        disabled={isLoading}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Ruler className="w-4 h-4" />
                              Size (EU)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="e.g. 42"
                                className="bg-background h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`shoes.${index}.serviceType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Wrench className="w-4 h-4" />
                              Service
                            </FormLabel>
                            <Select
                              disabled={isLoading}
                              onValueChange={field.onChange}
                              defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background h-11">
                                  <SelectValue placeholder="Select service type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  {resoleServices.map((serviceType) => (
                                    <SelectItem
                                      key={serviceType.name}
                                      value={serviceType.name}>
                                      {serviceType.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`shoes.${index}.image`}
                      disabled={isLoading}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Photo
                          </FormLabel>
                          <div className="bg-background border rounded-lg p-2">
                            <SingleImageDropzoneUsage
                              className="mt-0"
                              index={index}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              <div className="bg-muted/30 p-4 border-t flex justify-center">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => append(emptyShoe as any)}
                  className="w-full sm:w-auto border-dashed">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Pair
                </Button>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                variant="outline"
                type="button"
                className="flex-1 h-12"
                onClick={() => router.push("/resole-form")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 text-base"
                disabled={isLoading || isUploading}>
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
      </div>
    </div>
  );
}
