import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen flex flex-col items-center"
      suppressHydrationWarning
    >
      <Navbar />

      {/* Container for page content */}
      <div className="flex-1 w-full max-w-5xl px-5 flex flex-col gap-8">
        {children}
      </div>

      <Footer />
    </main>
  );
}
