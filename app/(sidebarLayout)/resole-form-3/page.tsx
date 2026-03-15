"use client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Package, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ResoleFormSuccess() {
  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden text-center p-8 sm:p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
            Order Received!
          </h1>

          <p className="text-muted-foreground text-lg mb-8">
            Thanks for choosing SOS. We've received your resole request and sent
            a confirmation email to your inbox.
          </p>

          <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left space-y-4">
            <h3 className="font-semibold text-foreground">
              What happens next?
            </h3>

            <div className="flex gap-3">
              <div className="bg-background border rounded-full w-8 h-8 flex items-center justify-center shrink-0 text-sm font-medium">
                1
              </div>
              <p className="text-sm text-muted-foreground pt-1">
                We'll review your order and send you a prepaid shipping label
                within 24 hours.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="bg-background border rounded-full w-8 h-8 flex items-center justify-center shrink-0 text-sm font-medium">
                2
              </div>
              <p className="text-sm text-muted-foreground pt-1">
                Pack your shoes in a box, attach the label, and drop it off at
                any post office.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="bg-background border rounded-full w-8 h-8 flex items-center justify-center shrink-0 text-sm font-medium">
                3
              </div>
              <p className="text-sm text-muted-foreground pt-1">
                We'll get to work! You'll receive updates when we receive your
                shoes and when they ship back.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/home" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-11">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
            <Link href="/orders" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-11">
                View My Orders
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
