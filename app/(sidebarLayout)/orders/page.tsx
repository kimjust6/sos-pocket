"use client";

import {
  getCurrentUser,
  onAuthStateChange,
} from "@/app/common/services/pocketbase.service";
import { useEffect, useState } from "react";
import Spinner from "@/app/common/components/spinner";
import { getUserOrders as getOrders } from "@/app/common/services/resole-order.service";
import AmazonOrderCard from "@/app/common/components/amazon-order-card";
import { IResoleOrdersDB } from "@/app/common/data/interfaces";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Orders = () => {
  const [orders, setOrders] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ... (keep getShoeOrders logic same as before) ...
  const getShoeOrders = async (u: any) => {
    if (!u?.email) return;
    setLoading(true);

    try {
      const response = await getOrders(u.id as string, "pocketbase");

      const ordersData = response?.items || [];

      const processedOrders = ordersData.map((order: any) => {
        const expandedShoes = order.expand?.shoes;
        let shoes: any[] = [];
        if (expandedShoes) {
          shoes = Array.isArray(expandedShoes)
            ? expandedShoes
            : [expandedShoes];
        }

        // Map address from relation if flat fields are missing
        const shipping = order.expand?.shipping_address;
        const addressData = {
          first_name: order.first_name || shipping?.first_name || "",
          last_name: order.last_name || shipping?.last_name || "",
          street_address: order.street_address || shipping?.street_line1 || "",
          city: order.city || shipping?.city || "",
          province: order.province || shipping?.province || "",
          postal_code: order.postal_code || shipping?.postal_code || "",
          country: order.country || shipping?.country || "Canada",
        };

        return {
          ...order,
          ...addressData,
          shoes: shoes,
        };
      });

      setOrders(processedOrders);
    } catch (error) {
      console.error("OrdersPage: Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser?.email) {
      getShoeOrders(currentUser);
    }

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
    <section className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h1 className="text-3xl font-regular text-foreground">Your Orders</h1>

        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search all orders"
              className="pl-8 w-full bg-background border-input text-foreground"
            />
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
            Search Orders
          </Button>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="border-b mb-6 text-sm">
        <div className="flex gap-6 overflow-x-auto pb-1">
          <button className="border-b-2 border-foreground font-semibold pb-2 px-1 text-foreground whitespace-nowrap">
            Orders
          </button>
          <button className="border-b-2 border-transparent hover:border-muted-foreground pb-2 px-1 text-muted-foreground hover:text-foreground whitespace-nowrap">
            Buy Again
          </button>
          <button className="border-b-2 border-transparent hover:border-muted-foreground pb-2 px-1 text-muted-foreground hover:text-foreground whitespace-nowrap">
            Not Yet Shipped
          </button>
          <button className="border-b-2 border-transparent hover:border-muted-foreground pb-2 px-1 text-muted-foreground hover:text-foreground whitespace-nowrap">
            Cancelled Orders
          </button>
        </div>
      </div>

      {/* Count & Time Range Filter */}
      <div className="flex items-center gap-2 mb-6 text-sm flex-wrap">
        <span className="font-semibold text-foreground">
          {orders ? orders.length : 0} orders
        </span>
        <span className="text-muted-foreground">placed in</span>
        <Select defaultValue="3months">
          <SelectTrigger className="w-[180px] h-8 bg-background border-input text-foreground shadow-sm rounded-md">
            <SelectValue placeholder="past 3 months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">past 30 days</SelectItem>
            <SelectItem value="3months">past 3 months</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex justify-center p-12">
            <Spinner />
          </div>
        ) : orders && orders.length > 0 ? (
          orders.map((order: IResoleOrdersDB) => {
            return <AmazonOrderCard order={order} key={order.id} />;
          })
        ) : (
          <div className="border rounded-lg p-8 text-center bg-muted/20">
            <h2 className="text-xl font-semibold mb-2">No orders found</h2>
            <p className="text-muted-foreground">
              Looks like you haven't placed any orders yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;
