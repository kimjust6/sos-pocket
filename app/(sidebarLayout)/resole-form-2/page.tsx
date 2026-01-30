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
    <section className="w-full flex justify-center mt-10 px-3 sm:px-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {fields.map((field, index: number) => {
            return (
              <section key={field.id}>
                <FormField
                  control={form.control}
                  name={`shoes.${index}.manufacturer`}
                  render={({ field }) => (
                    <FormItem className="grid gap-1">
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormLabel className="sr-only" htmlFor="manufacturer">
                          Manufacturer*
                          <FormMessage />
                        </FormLabel>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Manufacturer*" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select Manufacturer</SelectLabel>
                            {[
                              shoeManufacturers.map((manufacturer) => {
                                return (
                                  <SelectItem
                                    key={manufacturer.name}
                                    value={manufacturer.name}>
                                    {manufacturer.name}
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
                  name={`shoes.${index}.model`}
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem className="grid gap-1">
                      <FormLabel className="sr-only" htmlFor="model">
                        Shoe Model*
                        <FormMessage />
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={`shoes.${index}.model`}
                          placeholder="Shoe Model*"
                          type="text"
                          autoCapitalize="none"
                          autoComplete="model"
                          autoCorrect="off"
                          {...form.register(`shoes.${index}.model` as const, {
                            required: true,
                          })}
                          className={
                            form.formState.errors?.shoes?.[index]?.model
                              ? "error"
                              : ""
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`shoes.${index}.size`}
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem className="grid gap-1">
                      <FormLabel className="sr-only" htmlFor="size">
                        Shoe Size*
                        <FormMessage />
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={`shoes.${index}.size`}
                          placeholder="Shoe Size (EU)"
                          type="number"
                          autoCapitalize="none"
                          autoComplete="size"
                          autoCorrect="off"
                          {...field}
                          {...form.register(`shoes.${index}.size` as const, {
                            required: true,
                          })}
                          className={
                            form.formState.errors?.shoes?.[index]?.size
                              ? "error"
                              : ""
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`shoes.${index}.serviceType`}
                  render={({ field }) => (
                    <FormItem className="grid gap-1">
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormLabel className="sr-only" htmlFor="serviceType">
                          Service*
                          <FormMessage />
                        </FormLabel>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Service*" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select Service</SelectLabel>
                            {[
                              resoleServices.map((serviceType) => {
                                return (
                                  <SelectItem
                                    key={serviceType.name}
                                    value={serviceType.name}>
                                    {serviceType.name}
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
                  name={`shoes.${index}.image`}
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem>
                      {/* <UploadImage /> */}
                      <SingleImageDropzoneUsage
                        className="mt-4"
                        index={index}
                      />
                    </FormItem>
                  )}
                />

                {index > 0 && (
                  <div className="w-full flex justify-center">
                    <Button
                      variant="destructive"
                      type="button"
                      className="mt-5 w-full md:w-auto"
                      onClick={() => {
                        remove(index);
                        setImgArr((oldArr: string[]) => {
                          oldArr.splice(index, 1);
                          return oldArr;
                        });
                      }}>
                      Remove Shoe
                    </Button>
                  </div>
                )}
                <Separator className="mt-5 mb-3" />
              </section>
            );
          })}

          <div className="mt-5 flex md:justify-around gap-3 flex-wrap">
            <Button
              variant="outline"
              type="button"
              className="mr-0 md:mr-8 w-full md:w-auto mb-3 md:mb-0"
              onClick={() => {
                router.push("/resole-form");
              }}>
              Back
            </Button>
            <Button
              variant="secondary"
              type="button"
              className="w-full md:w-auto"
              onClick={() => {
                append(emptyShoe as any);
              }}>
              Add Another Shoe
            </Button>
            <Button
              className="w-full md:w-auto"
              type="submit"
              disabled={isLoading || isUploading}>
              Submit Order
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
