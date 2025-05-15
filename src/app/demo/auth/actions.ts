"use server";
import { sleep } from "@/lib/time";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyDemoEnabled } from "../dal";
import { LoginFormSchema } from "./defines";
export async function login(data: unknown) {
  verifyDemoEnabled();
  const formData = LoginFormSchema.parse(data);
  await sleep(300);
  if (formData.username === "Bob" && formData.password === "123456") {
    const cookieStore = await cookies();
    cookieStore.set("_demo_auth_username", formData.username);
    revalidatePath("/demo/auth");
    return { success: true };
  }
  return { success: false, error: "Invalid username or password" };
}

export async function logout() {
  verifyDemoEnabled();
  await sleep(300);
  const cookieStore = await cookies();
  cookieStore.delete("_demo_auth_username");
  revalidatePath("/demo/auth");
}
