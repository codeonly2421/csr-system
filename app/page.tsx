import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { LoginForm } from "@/components/login-form";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>

      <Footer />
    </main>
  );
}
