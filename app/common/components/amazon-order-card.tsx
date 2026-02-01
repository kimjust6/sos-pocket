"use client";

import { formatDate } from "@/app/common/utils/date-formatter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import Link from "next/link";
import { IResoleOrdersDB, IResoleShoesDB } from "../data/interfaces";
import { getOrderTotal } from "../utils/helper-functions";
import { ChevronDown } from "lucide-react";

interface AmazonOrderCardProps {
  order: IResoleOrdersDB;
}

const OrderHeader = ({ order }: { order: IResoleOrdersDB }) => {
  return (
    <div className="bg-muted/40 p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground flex flex-col sm:flex-row justify-between gap-4 sm:items-center rounded-t-lg border-b">
      <div className="flex flex-row justify-between sm:justify-start sm:gap-14 w-full sm:w-auto">
        <div className="flex flex-col">
          <span className="font-semibold uppercase text-xs mb-1">
            Order Placed
          </span>
          <span className="text-foreground">
            {formatDate(new Date(order.created))}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="font-semibold uppercase text-xs mb-1">Total</span>
          <span className="text-foreground">
            ${getOrderTotal(order).toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col relative group cursor-pointer">
          <span className="font-semibold uppercase text-xs mb-1">Ship To</span>
          <Popover>
            <PopoverTrigger asChild>
              <span className="text-link hover:underline decoration-blue-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer text-blue-600">
                {order.first_name} {order.last_name}{" "}
                <ChevronDown className="h-3 w-3" />
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-60 text-sm">
              <p className="font-semibold mb-2">
                {order.first_name} {order.last_name}
              </p>
              <p>{order.street_address}</p>
              <p>
                {order.city}, {order.province} {order.postal_code}
              </p>
              <p>{order.country}</p>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex flex-col items-start sm:items-end w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
        <div className="flex flex-row sm:flex-col justify-between w-full sm:w-auto gap-2">
          <div>
            <span className="font-semibold uppercase text-xs mb-1 sm:hidden mr-2">
              Order #
            </span>
            <span className="text-xs mb-1">ORDER # {order.id}</span>
          </div>

          <div className="flex gap-2 sm:gap-4 text-blue-600">
            <Link
              href={`/orders/${order.id}`}
              className="hover:underline hover:text-blue-700">
              View order details
            </Link>
            <span className="hidden sm:inline text-gray-300">|</span>
            <Link
              href="#"
              className="hover:underline hover:text-blue-700 hidden sm:inline">
              Invoice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for shoe images (from orderCard2)
const ShoeImage = ({ shoe }: { shoe: any }) => {
  // Determine image src - PB serves images via specific URL pattern if filename is stored
  // But interfaces define image as string.
  // Fallback if needed.
  const imgSrc =
    shoe.image && shoe.image.length > 0
      ? shoe.image // If full URL (from edgestore/cloudinary?) or PB filename
      : "https://placehold.co/200x200?text=No+Image";

  return (
    <div className="flex-shrink-0">
      <Image
        src={imgSrc}
        alt={shoe.model || "Shoe"}
        width={90}
        height={90}
        className="object-cover rounded-md border"
      />
    </div>
  );
};

export default function AmazonOrderCard({ order }: AmazonOrderCardProps) {
  const shoes = order.shoes || [];

  return (
    <Card className="rounded-lg overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow bg-card text-card-foreground">
      <OrderHeader order={order} />

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* LEFT: Status & Items */}
          <div className="flex-1">
            <h3 className="font-bold text-lg sm:text-xl mb-4 text-foreground">
              {order.status === "Completed" ? "Delivered" : order.status}
            </h3>

            {shoes.length > 0 ? (
              shoes.map((shoe: any, idx: number) => (
                <div key={idx} className="flex gap-4 mb-6 last:mb-0">
                  <ShoeImage shoe={shoe} />
                  <div className="flex flex-col">
                    <Link
                      href="#"
                      className="font-medium text-primary hover:underline hover:text-primary/80 text-base line-clamp-2">
                      {shoe.manufacturer} - {shoe.serviceType} for {shoe.model}
                    </Link>
                    <span className="text-xs text-muted-foreground mt-1">
                      Size: {shoe.size}
                    </span>
                    {shoe.addons && (
                      <span className="text-xs text-muted-foreground">
                        Addons: {shoe.addons}
                      </span>
                    )}

                    <div className="mt-2 text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs bg-yellow-400 hover:bg-yellow-500 border-yellow-500 hover:border-yellow-600 text-black font-normal rounded-md mr-2">
                        Buy it again
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs rounded-md border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground">
                        View your item
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                No items found for this order.
              </div>
            )}
          </div>

          {/* RIGHT: Action Buttons */}
          <div className="w-full sm:w-64 flex flex-col gap-2 pt-2 sm:pt-0">
            <Button className="w-full rounded-full bg-yellow-400 hover:bg-yellow-500 text-black border-none font-normal shadow-sm">
              Track package
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground font-normal h-8 text-sm shadow-sm">
              Return or replace items
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground font-normal h-8 text-sm shadow-sm">
              Share gift receipt
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground font-normal h-8 text-sm shadow-sm">
              Write a product review
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-muted/50 p-3 border-t text-sm text-primary hover:underline cursor-pointer font-medium pl-6 rounded-b-lg">
        Archive order
      </div>
    </Card>
  );
}
