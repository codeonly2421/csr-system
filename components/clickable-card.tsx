// components/clickable-card.tsx
"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ClickableCardProps {
  title: string;
  description?: string;
  href: string;
}

export function ClickableCard({
  title,
  description,
  href,
}: ClickableCardProps) {
  return (
    <Link href={href}>
      <Card className="p-6 h-30 flex flex-col justify-center hover:shadow-lg transition-shadow">
        <CardHeader className="p-0 space-y-1">
          <CardTitle className=" text-lg font-semibold">{title}</CardTitle>

          {description && (
            <CardDescription className="text-sm opacity-80">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
