"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

type Props = {
    user: User | null;
}

function NewNoteButton({ user }: Props) {
    console.log(user?.email);
  return(<Button 
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