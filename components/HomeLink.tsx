import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function HomeLink() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <Link href={user ? "/protected" : "/"}>Connecx</Link>;
}
