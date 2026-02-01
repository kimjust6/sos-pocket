"use client";

import { dashboardAtom } from "@/app/common/atoms/atoms";
import OrderTable from "@/app/common/components/orderTable";
import OrderCard from "@/app/common/components/orderCard";
import Spinner from "@/app/common/components/spinner";
import {
  getAllResoleOrders,
  getMultiShoesByOrder,
} from "@/app/common/services/resole-order.service";
import { useAtom } from "jotai";

import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [orders, setOrders] = useState<any>([]);
  const [showModal, setShowModal] = useAtom(dashboardAtom);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // helper function
  const getShoeOrders = async () => {
    setLoading(true);
    var ordersData = null;
    var shoesData = null;
    // get all orders
    try {
      const response = await getAllResoleOrders(page, 10);
      ordersData = response?.data;
    } catch (error) {
      console.error(error);
      return;
    }
    // get shoe orders
    try {
      shoesData = await getMultiShoesByOrder(ordersData);
      shoesData?.data ? (shoesData = shoesData?.data) : "";
    } catch (error) {
      console.error(error);
      return;
    }
    // combine shoes and orders
    let ordersObject: any = {};
    for (var i = 0; i < ordersData?.length; i++) {
      const id = ordersData[i].id || ordersData[i]._id;
      ordersObject[id] = ordersData[i];
      ordersObject[id].shoes = [];
    }
    // add shoes to orders
    for (var i = 0; i < shoesData?.length; i++) {
      const orderId = shoesData[i].order_id || shoesData[i].orderId;
      if (ordersObject[orderId]) {
        ordersObject[orderId].shoes.push(shoesData[i]);
      }
    }
    // convert ordersObject to array
    let ordersArray: any = [];
    for (var key in ordersObject) {
      ordersArray.push(ordersObject[key]);
    }
    setOrders((oldOrders: any) => {
      return [...oldOrders, ...ordersArray];
    });
    setLoading(false);
  };
  useEffect(() => {
    getShoeOrders();
  }, [page]);

  return (
    <section
      className={"w-full flex items-center flex-col " + (showModal ? " " : "")}>
      <h1 className="header_text">Dashboard</h1>
      <div className="hidden lg:flex">
        <OrderTable resoleOrders={orders} />
      </div>
      <div className="flex lg:hidden flex-col gap-4">
        <OrderCard resoleOrders={orders} />
      </div>
      {loading ? (
        <span className="mt-4">
          <Spinner />
        </span>
      ) : orders ? (
        <button
          className="button_secondary mt-4"
          onClick={() => {
            setPage((oldPage) => {
              return oldPage + 1;
            });
          }}>
          Load More
        </button>
      ) : (
        <h1 className="text-2xl">No Orders</h1>
      )}
    </section>
  );
};

export default AdminDashboard;
