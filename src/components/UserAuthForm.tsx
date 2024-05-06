"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import { toast } from "sonner";

interface UserAuthForm extends React.HTMLAttributes<HTMLDivElement> {}

export const UserAuthForm = ({ className, ...props }: UserAuthForm) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button
        onClick={loginWithGoogle}
        size="sm"
        isLoading={isLoading}
        className="w-full"
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2"/>}Google
      </Button>
    </div>
  ); 
};
