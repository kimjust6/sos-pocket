"use server";

import { auth } from "@/auth";
import { IAddress, IResoleInfo } from "@/app/common/data/interfaces";
import { getPocketBase } from "@/app/common/services/pocketbase.service";
import { Collections, ResoleItemsStatusOptions } from "@/pocketbase-types";

/**
 * @name getAllResoleOrders
 * @description gets all resole orders from PocketBase
 * @returns array of resole order objects
 */
export async function getAllResoleOrders(page: number, limit: number) {
  const pb = getPocketBase();
  try {
    const result = await pb
      .collection(Collections.Orders)
      .getList(page, limit, {
        sort: "-created",
        expand: "shoes", // Assuming 'shoes' relation exists
      });
    return result;
  } catch (error) {
    console.error("getAllResoleOrders error:", error);
    return { items: [], totalItems: 0 };
  }
}

import { cookies } from "next/headers";
import PocketBase from "pocketbase";

export async function getUserOrders(userId: string, provider: string) {
  // Create a new instance per request to avoid singleton state issues on server
  const pb = new PocketBase(
    process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://sos-be.jkim.win"
  );

  const cookieStore = await cookies();
  const authCookie = cookieStore.get("pb_auth");

  if (authCookie) {
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
  }

  // Debug to confirm auth state on server
  console.log(
    "Server PB Auth Valid?",
    pb.authStore.isValid,
    "User:",
    pb.authStore.model?.id
  );

  try {
    // Filter by user relation ID
    const result = await pb.collection(Collections.Orders).getList(1, 50, {
      filter: `user = "${userId}"`,
      sort: "-created",
      expand: "shoes,shipping_address",
    });
    return result;
  } catch (error) {
    console.error("getUserResoleOrders error:", error);
    return { items: [], totalItems: 0 };
  }
}

/**
 * @description this method gets a single resole order by id
 * @param orderID the id of the order being requested
 */
export async function getUserResoleOrdersByID(orderID: string): Promise<any> {
  // Create a new instance per request to avoid singleton state issues on server
  const pb = new PocketBase(
    process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://sos-be.jkim.win"
  );

  const cookieStore = await cookies();
  const authCookie = cookieStore.get("pb_auth");

  if (authCookie) {
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
  }

  try {
    const record = await pb.collection(Collections.Orders).getOne(orderID, {
      expand: "shoes,shipping_address,order_items(order)",
    });
    return { status: "success", data: record };
  } catch (error) {
    console.error("getUserResoleOrdersByID error:", error);
    return null;
  }
}

/**
 * @name getMultiShoesByOrder
 * @description Helper to get shoe details if they weren't expanded.
 * With PB expand, this is often unnecessary, but kept for compatibility or deep fetching.
 */
export async function getMultiShoesByOrder(orders: any[]) {
  // In PB, we use expand. If orders already have expanded shoes, return them.
  // This function might need to extract them from the expand property.
  const shoes = [];
  for (const order of orders) {
    if (order.expand?.shoes) {
      shoes.push(
        ...(Array.isArray(order.expand.shoes)
          ? order.expand.shoes
          : [order.expand.shoes])
      );
    }
  }
  return shoes;
}

/**
 * @name postResoleOrder
 * @description create a resole order in PocketBase
 * @param order order object
 */
export async function postResoleOrder(
  shoeAddress: IAddress,
  shoes: IResoleInfo[]
) {
  const session: any = await auth();
  const pb = getPocketBase();

  try {
    // 1. Create Shoe Records first
    const shoeIds: string[] = [];
    for (const shoe of shoes) {
      const shoeData = {
        size: shoe.size, // Ensure type matches (number vs string)
        manufacturer: shoe.manufacturer,
        model: shoe.model,
        service_type: shoe.serviceType,
        addons: "", // Map addons if needed
        image: shoe.image, // Assuming this is a file ID or URL handled correctly
        location: "Missisauga",
        status: ResoleItemsStatusOptions["Ordered"],
      };
      const record = await pb
        .collection(Collections.ResoleItems)
        .create(shoeData);
      shoeIds.push(record.id);
    }

    // 2. Create Order Record
    const orderData = {
      first_name: shoeAddress.fName,
      last_name: shoeAddress.lName,
      email: shoeAddress.email,
      street_address: shoeAddress.address,
      city: shoeAddress.city,
      province: shoeAddress.province,
      postal_code: shoeAddress.postal.replace(/\s/g, ""),
      country: "Canada",
      phone: shoeAddress.phone,
      status: "Order Received",
      delivery_type: "Pickup",
      user: session?.user?.id, // Link to user if possible
      shoes: shoeIds, // Assuming 'shoes' relation field exists (array of Relation)
      // subtotals?
    };

    const order = await pb.collection(Collections.Orders).create(orderData);
    return order;
  } catch (error) {
    console.error("postResoleOrder error:", error);
    return {};
  }
}
