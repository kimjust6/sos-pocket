"use client";

import { dashboardAtom } from "@/app/common/atoms/atoms";
import OrderTable from "@/app/common/components/orderTable";
import OrderCard from "@/app/common/components/orderCard";
import Spinner from "@/app/common/components/spinner";
import { getAllResoleOrders } from "@/app/common/services/resole-order.service";
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

    try {
      const response = await getAllResoleOrders(page, 10);
      const ordersData = response?.items || [];

      // Map expanded shoes to the 'shoes' property for the UI
      const processedOrders = ordersData.map((order: any) => {
        const expandedShoes = order.expand?.shoes;
        let shoes: any[] = [];
        if (expandedShoes) {
          shoes = Array.isArray(expandedShoes)
            ? expandedShoes
            : [expandedShoes];
        }
        return {
          ...order,
          shoes: shoes,
        };
      });

      setOrders((oldOrders: any) => {
        // Prevent duplicates if needed, or just append
        return [...oldOrders, ...processedOrders];
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
