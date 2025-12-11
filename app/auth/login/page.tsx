import Footer from "@/components/footer";
import { LoginForm } from "@/components/login-form";
import Navbar from "@/components/navbar";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Center the LoginForm */}

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>

      <Footer />
    </main>
  );
}
