import { formatDate } from "@/app/common/utils/date-formatter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { IResoleOrdersDB, IResoleShoesDB } from "../data/interfaces";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getOrderTotal } from "@/app/common/utils/helper-functions";

interface orderProps {
  resoleOrders: IResoleOrdersDB;
}

interface myImageProps {
  shoes: IResoleShoesDB[] | string[];
  className: string;
}

const MyImage = (props: myImageProps) => {
  return (
    <Image
      src={
        (props?.shoes[0]?.image as string) ?? "https://i.imgur.com/1s6cWdT.jpg"
      }
      className={cn("rounded-sm ", props.className)}
      width={200}
      height={150}
      object-fit="cover"
      priority={true}
      alt="thumbnail image"
    />
  );
};

export default function OrderCard2({ resoleOrders }: orderProps) {
  return (
    <Card>
      <MyImage
        className="w-full sm:hidden"
        shoes={resoleOrders.shoes}></MyImage>
      <CardHeader>
        <CardTitle>Order: #{resoleOrders._id?.slice(-8)} </CardTitle>
        <CardDescription>
          <span className=" font-semibold">Status: </span>
          {resoleOrders.status}
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-4 flex">
        <>
          <MyImage className="hidden sm:block" shoes={resoleOrders.shoes} />
          <div className="flex flex-col justify-between capitalize">
            <div className="justify-between">
              <p>
                Placed On:{" "}
                <span className="text-muted-foreground">
                  {formatDate(resoleOrders.created)}
                </span>
              </p>
              {resoleOrders?.shoes?.length > 0 && (
                <p>
                  Shoes:{" "}
                  <span className="text-muted-foreground">
                    {resoleOrders.shoes.map((shoe: any, index: any) => {
                      return (
                        <span key={index}>
                          {index !== 0 && ", "}
                          {shoe.model}
                        </span>
                      );
                    })}
                  </span>
                </p>
              )}{" "}
              Ship To:{" "}
              <span className="text-muted-foreground">
                {resoleOrders.fName} {resoleOrders.lName}
              </span>
            </div>
            <p className="font-semibold">
              {" "}
              Subtotal:{" "}
              <span className="text-muted-foreground">
                ${getOrderTotal(resoleOrders).toFixed(2)}
              </span>
            </p>
          </div>
        </>
      </CardContent>
      <CardFooter>
        <Link href={`/orders/${resoleOrders._id}`} className="w-full">
          <Button type="button" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
