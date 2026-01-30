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

interface orderProps {
  params: { orderID: string };
}

const OrderDetails = ({ params }: orderProps) => {
  const [shippingInfo, setShippingInfo] = useState(sampleResoleOrders);
  const [shoeInfo, setShoeInfo] = useState([sampleResoleShoes]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getShippingInfo = async () => {
      // get order info
      const resoleOrder = await getUserResoleOrdersByID(params.orderID);
      setShippingInfo(resoleOrder ? resoleOrder.data : sampleResoleOrders);
      // get shoe info
      if (resoleOrder?.status === "ok") {
        const response = await getMultiShoesByOrder([resoleOrder?.data]);
        setShoeInfo(response ? response.data : null);
      }
      setIsLoading(false);
    };

    getShippingInfo();
  }, []);

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
          <p className="text-muted-foreground">{shippingInfo?.deliveryType}</p>

          <Separator className="my-4" />
          <h2 className="font-semibold text-lg">Delivery Address</h2>
          <div className="text-muted-foreground">
            <p>
              {shippingInfo?.fName} {shippingInfo?.lName}
            </p>
            <p>{shippingInfo.address}</p>
            <p>
              {shippingInfo?.city}, {shippingInfo?.province}
            </p>
            <p className="uppercase">{shippingInfo?.postalCode}</p>
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
                  <div className="flex items-end justify-between" key={index}>
                    <div>
                      <h2 className="font-semibold text-lg capitalize">
                        {shoe.manufacturer} {shoe.model}
                      </h2>
                      <span className="font-semibold text-md">Size: </span>
                      <span className="text-muted-foreground">{shoe.size}</span>
                      <br />
                      <span className="font-semibold text-md">Status: </span>
                      <span className="text-muted-foreground">
                        {shoe.status}
                      </span>
                      <br />
                      <span className="font-semibold text-md">Service: </span>
                      <span className="text-muted-foreground">
                        {shoe.serviceType}
                      </span>
                    </div>
                    <span>${shoe?.price?.toFixed(2) ?? (0.0).toFixed(2)}</span>
                  </div>
                );
              })}

            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Price</span>
              <span>
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
