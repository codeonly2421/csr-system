import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p>CSR System 2025 | Allright Reserved.</p>
      <ThemeSwitcher />
    </footer>
  );
}
