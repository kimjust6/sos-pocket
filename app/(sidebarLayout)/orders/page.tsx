"use client";

import {
  getCurrentUser,
  onAuthStateChange,
} from "@/app/common/services/pocketbase.service";
import { useEffect, useState } from "react";
import Spinner from "@/app/common/components/spinner";
import {
  getMultiShoesByOrder,
  getUserResoleOrders,
} from "@/app/common/services/resole-order.service";
import OrderCard2 from "@/app/common/components/orderCard2";
import { IResoleOrdersDB } from "@/app/common/data/interfaces";

const Orders = () => {
  const [orders, setOrders] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getShoeOrders = async (u: any) => {
    if (!u?.email) return;
    setLoading(true);
    var ordersData = null;
    var shoesData = null;
    // get user orders
    try {
      const response = await getUserResoleOrders(
        u.email as string,
        "pocketbase" // or adjust based on your API
      );
      ordersData = response?.data;
    } catch (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    // get shoe orders
    try {
      shoesData = await getMultiShoesByOrder(ordersData);
      shoesData?.data ? (shoesData = shoesData?.data) : "";
    } catch (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    // combine shoes and orders
    let ordersObject: any = {};
    for (var i = 0; i < ordersData?.length; i++) {
      // Use id or _id, preferring id
      const id = ordersData[i].id || ordersData[i]._id;
      ordersObject[id] = ordersData[i];
      ordersObject[id].shoes = [];
    }
    // add shoes to orders
    for (var i = 0; i < shoesData?.length; i++) {
      // Assuming shoesData structure: check if orderId needs update, might be order_id now if backend changed?
      // Based on service it seems to return shoe objects.
      // NOTE: getMultiShoesByOrder implementation in service uses `orders[i].shoes` which is array of strings.
      // The return of getMultiShoesByOrder is from `multi-resole-shoes` endpoint.
      // If that endpoint returns `orderId` (camelCase) we need to be careful.
      // Assuming existing backend code for `multi-resole-shoes` returns `orderId`.
      // If the backend was also updated to snake_case, this might be `order_id`.
      // I will check `orderId` first.
      const orderId = shoesData[i].order_id || shoesData[i].orderId;
      if (ordersObject[orderId]) {
        ordersObject[orderId].shoes.push(shoesData[i]);
      }
    }
    // convert ordersObject to array
    let ordersArray = [];
    for (var key in ordersObject) {
      ordersArray.push(ordersObject[key]);
    }
    setOrders(ordersArray);
    setLoading(false);
  };

  useEffect(() => {
    // Initial check
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser?.email) {
      getShoeOrders(currentUser);
    }

    // Subscribe to auth changes
    const unsubscribe = onAuthStateChange((token, record) => {
      setUser(record);
      if (record?.email) {
        getShoeOrders(record);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <section className="w-full flex flex-col items-center">
      <h1 className="header_text">My Orders</h1>
      <div className="flex flex-col gap-4 mx-2">
        {orders ? (
          orders.map((order: IResoleOrdersDB) => {
            return (
              <OrderCard2 resoleOrders={order} key={order._id}></OrderCard2>
            );
          })
        ) : loading ? (
          <span className="mt-4">
            <Spinner />
          </span>
        ) : (
          <h1 className="text-2xl">No Orders</h1>
        )}
      </div>
    </section>
  );
};

export default Orders;
