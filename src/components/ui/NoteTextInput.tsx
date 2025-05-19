"use client";

import { useSearchParams } from "next/navigation";

type Props = {
    noteId: string;
    startingNoteText: string;
}

function NoteTextInput({ noteId, startingNoteText}: Props) {
    const noteIdParam = useSearchParams().get("noteId") || "";
    const {noteId, setNoteId} = useNote();
  return (
    <div>NoteTextInput</div>
  )
}

export default NoteTextInput;