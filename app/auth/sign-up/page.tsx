import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Center the LoginForm */}

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <SignUpForm />
        </div>
      </div>

      <Footer />
    </main>
  );
}
