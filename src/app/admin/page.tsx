import type { Metadata } from "next";
import AdminClient from "@/components/AdminClient";

export const metadata: Metadata = {
  title: "Administration – Solimouv'",
};

export default function AdminPage() {
  return <AdminClient />;
}
