"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { createNoteAction } from "@/actions/notes";

type Props = {
    user: User | null;
};

function NewNoteButton({ user }: Props) {
    const router = useRouter();

    const {toast} = useToast()

    const [loading, setLoading] = useState(false);

    const handleClickNewNoteButton = async () => {
      if (!user) {
        router.push("/login")
      } else {
        setLoading(true)

        const uuid = uuidv4()
        await createNoteAction(uuid)
        router.push(`/?noteId=${uuid}`)

        toast({
          title: "New Note Created",
          description: "You have created a new note",
          variant: "success"
        });
        setLoading(false)
      }
    }

  return(
  <Button 
  onClick={handleClickNewNoteButton} 
  variant="secondary" 
  className="w-24" 
  disabled={loading}

  >
    {loading ? <Loader2 className="animate-spin" /> : "New Note"}
  </Button>
  );
}

export default NewNoteButton;