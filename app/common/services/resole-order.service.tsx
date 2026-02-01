"use server";

import { auth } from "@/auth";
import {
  IAddress,
  IResoleInfo,
  IResoleOrdersDB,
  IResoleShoesDB,
} from "@/app/common/data/interfaces";
const BASE_URL = process.env.API_BASE_URL + "api/v1/";

/**
 * @name getAllResoleOrders
 * @description gets all resole orders from express backend
 * @returns array of resole order objects
 */
export async function getAllResoleOrders(page: number, limit: number) {
  // get user session and check if you can post
  const session: any = await auth();
  // api call to node.js backend from next.js server side
  try {
    const response = await fetch(
      `${BASE_URL}resole-orders/by-user/${session?.user?.provider}/${session?.user?.email}?` +
        new URLSearchParams({
          page: page?.toString(),
          limit: limit?.toString(),
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": session?.user?.token as string,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export async function getUserResoleOrders(email: string, provider: string) {
  // get user session and check if you can post
  const session: any = await auth();
  // api call to node.js backend from next.js server side
  try {
    const response = await fetch(
      `${BASE_URL}resole-orders/by-user/${provider}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": session?.user?.token as string,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

/**
 * @description this method gets a single resole order by id, the shoes are an array of strings
 * @param orderID the id of the order that is being requested
 * @returns Promise of IResoleOrdersDB | {}
 */
export async function getUserResoleOrdersByID(
  orderID: string
): Promise<{ status: string; data: IResoleOrdersDB } | null> {
  // get user session and check if you can post
  const session: any = await auth();
  // api call to node.js backend from next.js server side
  try {
    const response = await fetch(`${BASE_URL}resole-order/${orderID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": session?.user?.token as string,
      },
      cache: "no-store",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * @name getMultiShoesByOrder
 * @description pass in an array of order objects to get more information about the shoes in the order
 * @param orders an array of order objects
 * @returns an array of shoe objects (the shoes that were in each order)
 */
export async function getMultiShoesByOrder(orders: any[]) {
  const session: any = await auth();

  let shoeIds = [];
  // get all shoe ids from orders and put them into an array shoeIds
  for (let i = 0; i < orders?.length; i++) {
    for (let j = 0; j < orders[i].shoes.length; j++) {
      shoeIds.push(orders[i].shoes[j]);
    }
  }
  const serializedIds = JSON.stringify(shoeIds);
  // serialize the shoeIds array and pass it as query params
  try {
    const response = await fetch(
      BASE_URL +
        "multi-resole-shoes?" +
        new URLSearchParams({ shoeIds: serializedIds }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": session?.user?.token as string,
        },
        cache: "no-store",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

/**
 * @name postResoleOrder
 * @description post a resole order to the express backend to add to mongodb
 * @param order order object
 * @returns order object that was created
 */
export async function postResoleOrder(
  shoeAddress: IAddress,
  shoes: IResoleInfo[]
) {
  const session: any = await auth();

  let orderTime = new Date().toISOString();
  let order: IResoleOrdersDB = {
    first_name: shoeAddress.fName,
    last_name: shoeAddress.lName,
    email: shoeAddress.email,
    provider: session.user.provider,
    street_address: shoeAddress.address,
    city: shoeAddress.city,
    province: shoeAddress.province,
    postal_code: shoeAddress.postal.replace(/\s/g, ""),
    country: "Canada",
    phone: shoeAddress.phone,
    status: "Order Received",
    shoes: [],
    created: orderTime,
    updated: orderTime,
    subtotals: [],
    delivery_type: "Pickup",
  };

  let myShoeArray: IResoleShoesDB[] = [];
  for (let i = 0; i < shoes.length; i++) {
    let myShoe: IResoleShoesDB = {
      size: shoes[i].size,
      manufacturer: shoes[i].manufacturer,
      model: shoes[i].model,
      service_type: shoes[i].serviceType,
      addons: [],
      image: shoes[i].image,
      location: "Missisauga",
      status: "Ordered",
      price: 0,
    };
    myShoeArray.push(myShoe);
  }
  order.shoes = myShoeArray;
  // post order object to express backend (haven't tested function)
  try {
    const response = await fetch(`${BASE_URL}resole-orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": session?.user?.token as string,
      },
      body: JSON.stringify(order),
      cache: "no-store",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}
