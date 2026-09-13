import { redirect } from "next/navigation";

export default function AdminManageLegacyPage() {
  redirect("/account/manage-admins");
}