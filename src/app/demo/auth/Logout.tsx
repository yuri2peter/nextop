"use client";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { logout } from "./actions";

export default function Logout({ username }: { username: string }) {
  return (
    <form action={logout}>
      <CardContent className="p-4 space-y-4 h-40 flex items-center justify-center">
        <p className="text-lg font-bold">Welcome back, {username}!</p>
      </CardContent>
      <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
        <Button type="submit" className="w-full">
          Logout
        </Button>
      </CardFooter>
    </form>
  );
}
