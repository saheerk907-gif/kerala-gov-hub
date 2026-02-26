import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}