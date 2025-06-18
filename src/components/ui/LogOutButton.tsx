"use client";

import React from "react";
import { Loader2 } from "lucide-react"
import { Button } from "./button"
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { logOutAction } from "@/actions/users";
import { supabase } from "../../../__mocks__/supabase";

function LogOutButton() {

    const {toast} = useToast();
    const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true)
    const { errorMessage } = await logOutAction();

    if (!errorMessage) {
        toast({
            title: "Logged out",
            description: "You have been successfully Logged out",
            variant: "success",
        });
        router.push("/");
    } else {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  return (
    <Button 
    variant="outline"
    onClick={handleLogOut}
    disabled={loading}
    className="width-24">
        {loading ? <Loader2 className="animate-spin" /> : "Log Out"}
    </Button>
  
);
}

export default LogOutButton;