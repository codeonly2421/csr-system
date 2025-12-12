import { ClickableCard } from "@/components/clickable-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const items = [
    {
      title: "Limits",
      href: "payports/limits",
      descriptions: "Click to open",
    },
    { title: "Transaction limits", href: "##", descriptions: "Not Available" },
    { title: "Transaction Process", href: "##", descriptions: "Not Available" },
    { title: "Settlement", href: "##", descriptions: "Not Available" },
    { title: "Demo videos", href: "##", descriptions: "Not Available" },
    { title: "Channel Status", href: "##", descriptions: "Not Available" },
  ];

  return (
    <div className="py-10 max-w-5xl mx-auto w-full px-4">
      <div className="flex justify-start mb-6">
        <Link href="/protected/solutions">
          <Button variant="outline">Go Back</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
        {items.map((item, i) => (
          <ClickableCard
            key={i}
            title={item.title}
            href={item.href}
            description={item.descriptions}
          />
        ))}
      </div>
    </div>
  );
}
