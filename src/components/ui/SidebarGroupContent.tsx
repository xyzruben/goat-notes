"use client";

import { Note } from "@prisma/client";
import { SidebarGroupContent as SidebarGroupContentShadCN, SidebarMenu } from "./sidebar";
import { SearchIcon } from "lucide-react";
import { Input } from "./input";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js"

type Props = {
    notes: Note[];
};

function SidebarGroupContent( {notes}: Props ) {
  const [searchText, setSearchText] = useState("");
  const [localNotes, setLocalNotes] = useState(notes);

  useEffect(() => {
    setLocalNotes(notes)
  }, [notes])

  const fuse = useMemo(() => {
    return new Fuse(localNotes, {
      keys: ["text"],
      threshold: .4
    })
  }, [localNotes])

  const filteredNotes = searchText ? fuse.search(searchText).map(result => result.item) : localNotes;

  return (
    <SidebarGroupContentShadCN>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-2 size-4" />
        <Input
        className="bg-muted pl-8" 
        placeholder="Search your notes..."
        value={searchText} 
        onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <SidebarMenu className="mt-4">

      </SidebarMenu>
    </SidebarGroupContentShadCN>
  )
}

export default SidebarGroupContent;