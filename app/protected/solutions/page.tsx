import { ClickableCard } from "@/components/clickable-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const items = [
    {
      title: "Payport",
      href: "solutions/payports",
      descriptions: "Click to open",
    },
    { title: "Coins", href: "##", descriptions: "Not Available" },
    { title: "Pay5", href: "##", descriptions: "Not Available" },
    { title: "Icore", href: "##", descriptions: "Not Available" },
    { title: "Paypro", href: "##", descriptions: "Not Available" },
    { title: "Safety Pay", href: "##", descriptions: "Not Available" },
    { title: "Payrock", href: "##", descriptions: "Not Available" },
    { title: "Duk Pay", href: "##", descriptions: "Not Available" },
    { title: "Wells Payment", href: "##", descriptions: "Not Available" },
  ];

  return (
    <div className="py-10 max-w-5xl mx-auto w-full px-4">
      <div className="flex justify-start mb-6">
        <Link href="/protected">
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
