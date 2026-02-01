import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getUserAddresses } from "@/app/common/services/address.service";
import { AddressesView } from "./addresses-view";

const AddressesPage = async () => {
  const addresses = await getUserAddresses();

  return (
    <div className="min-h-screen bg-muted/5 py-12">
      <div className="container max-w-4xl">
        <div className="mb-6">
          <Link
            href="/account"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Account
          </Link>
        </div>

        <AddressesView addresses={addresses} />
      </div>
    </div>
  );
};

export default AddressesPage;
