import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Login from "./Login";
import Logout from "./Logout";
const title = "Demo - Auth";
const description = "An example of how to use auth with cookies.";

export const metadata: Metadata = {
  title,
  description,
};

export default async function DemoAuth() {
  const cookieStore = await cookies();
  const username = cookieStore.get("_demo_auth_username")?.value;
  return (
    <>
      <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {username ? <Logout username={username} /> : <Login />}
    </>
  );
}
