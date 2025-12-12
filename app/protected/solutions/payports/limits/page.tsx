// app/protected/payports/page.tsx
"use client";

import RegionList from "./RegionList";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PayportsPage() {
  return (
    <div className="py-10 max-w-5xl mx-auto w-full px-4">
      {/* Header / Actions */}
      <div className="flex justify-start items-center mb-6">
        <Link href="/protected/solutions/payports">
          <Button variant="outline">Go Back</Button>
        </Link>
      </div>

      {/* Page Content */}
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Transaction Limits
        </h1>

        {/* Region List */}
        <RegionList />
      </div>
    </div>
  );
}
