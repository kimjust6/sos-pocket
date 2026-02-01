"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MapPin, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

const AddressesPage = () => {
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

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Your Addresses</h1>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Address
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder for no addresses */}
          <Card className="col-span-full border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="bg-muted p-4 rounded-full">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No saved addresses</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-1">
                  Add an address to speed up checkout for future orders.
                </p>
              </div>
              <Button variant="outline" className="mt-4">
                Add New Address
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddressesPage;
