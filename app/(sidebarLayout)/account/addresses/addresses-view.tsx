"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Plus, Trash2, Pencil, MoreVertical } from "lucide-react";
import { AddressesRecord } from "@/pocketbase-types";
import { AddressForm } from "@/app/common/components/address-form";
import { deleteAddress } from "@/app/common/services/address.service";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddressesViewProps {
  addresses: AddressesRecord[];
}

export function AddressesView({ addresses }: AddressesViewProps) {
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<
    AddressesRecord | undefined
  >(undefined);
  const router = useRouter();
  const { toast } = useToast();

  const handleEdit = (address: AddressesRecord) => {
    setEditingAddress(address);
    setOpen(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent bubbling if card is clicked
    if (!confirm("Are you sure you want to delete this address?")) return;

    const result = await deleteAddress(id);
    if (result.success) {
      toast({ title: "Address deleted" });
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const closeDialog = () => {
    setOpen(false);
    setTimeout(() => setEditingAddress(undefined), 300); // Reset after close animation
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Your Addresses</h1>
        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) setEditingAddress(undefined);
          }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <AddressForm onSuccess={closeDialog} initialData={editingAddress} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {addresses.length === 0 ? (
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
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setOpen(true)}>
                Add New Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          addresses.map((address) => (
            <Card key={address.id} className="relative group overflow-hidden">
              <CardContent className="p-6">
                {/* Actions Menu */}
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(address)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => handleDelete(address.id, e as any)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="font-semibold mb-1">
                  {address.first_name} {address.last_name}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{address.street_line1}</p>
                  {address.street_line2 && <p>{address.street_line2}</p>}
                  <p>
                    {address.city}, {address.province} {address.postal_code}
                  </p>
                  <p>{address.country}</p>
                  {address.phone && (
                    <p className="pt-2 text-xs">Phone: {address.phone}</p>
                  )}
                </div>
              </CardContent>
              {/* Default Badge could go here if implemented */}
            </Card>
          ))
        )}
      </div>
    </>
  );
}
