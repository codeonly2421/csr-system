import { ClickableCard } from "@/components/clickable-card";

export default function Page() {
  const items = [
    {
      title: "Channel Codes",
      href: "/protected/channel-code",
      descriptions: "Click to open",
    },
    {
      title: "Solutions",
      href: "/protected/solutions",
      descriptions: "Click to open",
    },
    { title: "Connecx Ops", href: "/##", descriptions: "Not Available" },
    { title: "Cred and Email", href: "/##", descriptions: "Not Available" },
    { title: "CSR Directory", href: "/##", descriptions: "Not Available" },
    { title: "Knowledge Updates", href: "/##", descriptions: "Not Available" },
    { title: "Merchant Contact", href: "/##", descriptions: "Not Available" },
    { title: "Template Response", href: "/##", descriptions: "Not Available" },
    { title: "TG GC", href: "/##", descriptions: "Not Available" },
    {
      title: "Transactions Status",
      href: "/##",
      descriptions: "Not Available",
    },
  ];

  return (
    <div className="py-10 max-w-5xl mx-auto w-full px-4">
      <div className="flex justify-start mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
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
