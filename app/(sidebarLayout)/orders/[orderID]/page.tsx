"use client";

import {
  sampleResoleOrders,
  sampleResoleShoes,
} from "@/app/common/data/interfaces";
import {
  getMultiShoesByOrder,
  getUserResoleOrdersByID,
} from "@/app/common/services/resole-order.service";
import { getOrderTotal } from "@/app/common/utils/helper-functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

const OrderDetails = () => {
  const params = useParams<{ orderID: string }>();
  const [shippingInfo, setShippingInfo] = useState(sampleResoleOrders);
  const [shoeInfo, setShoeInfo] = useState<any[]>([sampleResoleShoes]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getShippingInfo = async () => {
      // get order info
      const resoleOrder = await getUserResoleOrdersByID(params.orderID);

      if (resoleOrder?.status === "success" && resoleOrder?.data) {
        const order = resoleOrder.data;
        const expandedAddress = order.expand?.shipping_address;

        // Extract order items from expansion using the reverse relation name
        // PocketBase expands reverse relations as "collectionName(relationField)" e.g. "order_items(order)"
        const items = order.expand?.["order_items(order)"] || [];
        setOrderItems(items);

        // Map address fields (prefer expanded address if flat fields are empty)
        const mappedOrder = {
          ...order,
          first_name: order.first_name || expandedAddress?.first_name || "",
          last_name: order.last_name || expandedAddress?.last_name || "",
          street_address:
            order.street_address || expandedAddress?.street_line1 || "",
          city: order.city || expandedAddress?.city || "",
          province: order.province || expandedAddress?.province || "",
          postal_code: order.postal_code || expandedAddress?.postal_code || "",
          country: order.country || expandedAddress?.country || "Canada",
        };

        setShippingInfo(mappedOrder);

        // Handle shoes data
        // If expanded, use it directly. If getting via helper, use that.
        let shoes = order.expand?.shoes;

        if (!shoes) {
          const shoesList = await getMultiShoesByOrder([order]);
          shoes = shoesList;
        } else if (!Array.isArray(shoes)) {
          shoes = [shoes];
        }

        setShoeInfo(shoes || []);
      } else {
        // Fallback or error state
        setShippingInfo(sampleResoleOrders);
        setShoeInfo([]);
      }

      setIsLoading(false);
    };

    getShippingInfo();
  }, [params.orderID]);

  return (
    <section className="flex flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipping Details</CardTitle>
        </CardHeader>
        <CardContent className="capitalize gap-2">
          <h2 className="font-semibold text-lg">Delivery Status</h2>
          <p className="text-muted-foreground">{shippingInfo?.status}</p>
          <Separator className="my-4" />
          <h2 className="font-semibold text-lg">Delivery Method</h2>
          <p className="text-muted-foreground">{shippingInfo?.delivery_type}</p>

          <Separator className="my-4" />
          <h2 className="font-semibold text-lg">Delivery Address</h2>
          <div className="text-muted-foreground">
            <p>
              {shippingInfo?.first_name} {shippingInfo?.last_name}
            </p>
            <p>{shippingInfo.street_address}</p>
            <p>
              {shippingInfo?.city}, {shippingInfo?.province}
            </p>
            <p className="uppercase">{shippingInfo?.postal_code}</p>
          </div>

          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Payment Status</h2>
            <div
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                shippingInfo?.payment_status?.toLowerCase() === "paid"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
              }`}>
              {shippingInfo?.payment_status || "Pending"}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <Image
            src="https://i.imgur.com/C3bv3N5.jpg"
            className=""
            width={580}
            height={580}
            priority={true}
            alt="shoe image"
          /> */}

          <section className="grid gap-6">
            {shoeInfo &&
              shoeInfo.map((shoe: any, index: number) => {
                return (
                  <div
                    className="flex items-end justify-between text-sm"
                    key={index}>
                    <div>
                      <h2 className="font-semibold text-lg capitalize">
                        {shoe.manufacturer} {shoe.model}
                      </h2>
                      <span className="font-semibold">Size: </span>
                      <span className="text-muted-foreground">{shoe.size}</span>
                      <br />
                      <span className="font-semibold">Status: </span>
                      <span className="text-muted-foreground">
                        {shoe.status}
                      </span>
                      <br />
                      <span className="font-semibold">Service: </span>
                      <span className="text-muted-foreground">
                        {shoe.service_type}
                      </span>
                    </div>
                    <span>${shoe?.price?.toFixed(2) ?? (0.0).toFixed(2)}</span>
                  </div>
                );
              })}

            {/* Order Items Section */}
            {orderItems.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium">Products</h3>
                  {orderItems.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start text-sm">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <p>
                        $
                        {(
                          (item.unit_price || 0) * (item.quantity || 1)
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            <Separator />
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-muted-foreground text-sm">
                <span>Subtotal</span>
                <span>${shippingInfo?.subtotals?.toFixed(2) ?? "0.00"}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-sm">
                <span>Shipping</span>
                <span>
                  ${shippingInfo?.shipping_amount?.toFixed(2) ?? "0.00"}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-sm">
                <span>Tax</span>
                <span>${shippingInfo?.tax?.toFixed(2) ?? "0.00"}</span>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Price</span>
              <span className="font-bold">
                ${shippingInfo && getOrderTotal(shippingInfo).toFixed(2)}
              </span>
            </div>
          </section>
        </CardContent>
      </Card>
    </section>
  );
};

export default OrderDetails;
