'use client';

import useNote from "@/hooks/useNote";
import { Note } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
    note: Note;
};

function SelectNoteButton({ note }: Props) {
  const noteId = useSearchParams().get("noteId") || "";

  const {noteText: selectedNoteText} = useNote();
  const [shouldUseGlobalNoteText, setShouldUseGlobalNoteText] = useState(false)
  const [localNoteText, setLocalNoteText] = useState(note.text)

  const blankNoteText = "EMPTY NOTE";
  let noteText = localNoteText || blankNoteText;
  if (shouldBeGlobalNoteText) {
    noteText = selectedNoteText || blankNoteText;
  }

  return (
    <div>SelectNoteButton</div>
  )
}

export default SelectNoteButton;