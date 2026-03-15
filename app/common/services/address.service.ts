"use server";

import PocketBase from "pocketbase";
import { cookies } from "next/headers";
import {
  Collections,
  AddressesRecord,
  AddressesResponse,
} from "@/pocketbase-types";

// Helper to get authenticated PB instance on server
async function getAuthenticatedPb() {
  const pb = new PocketBase(
    process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://sos-be.jkim.win"
  );
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("pb_auth");

  if (authCookie) {
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
  }
  return pb;
}

export async function getUserAddresses() {
  const pb = await getAuthenticatedPb();
  const user = pb.authStore.model;

  if (!user) return [];

  try {
    const result = await pb
      .collection(Collections.Addresses)
      .getFullList<AddressesResponse>({
        filter: `user = "${user.id}"`,
        sort: "-created",
      });
    return result;
  } catch (error) {
    console.error("getUserAddresses error:", error);
    return [];
  }
}

export async function createAddress(data: Partial<AddressesRecord>) {
  const pb = await getAuthenticatedPb();
  const user = pb.authStore.model;

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const record = await pb.collection(Collections.Addresses).create({
      ...data,
      user: user.id,
    });
    return { success: true, data: record };
  } catch (error: any) {
    console.error("createAddress error:", error);
    return {
      success: false,
      error: error.message || "Failed to create address",
    };
  }
}

export async function deleteAddress(id: string) {
  const pb = await getAuthenticatedPb();

  try {
    await pb.collection(Collections.Addresses).delete(id);
    return { success: true };
  } catch (error: any) {
    console.error("deleteAddress error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete address",
    };
  }
}

export async function updateAddress(
  id: string,
  data: Partial<AddressesRecord>
) {
  const pb = await getAuthenticatedPb();

  try {
    const record = await pb.collection(Collections.Addresses).update(id, data);
    return { success: true, data: record };
  } catch (error: any) {
    console.error("updateAddress error:", error);
    return {
      success: false,
      error: error.message || "Failed to update address",
    };
  }
}
