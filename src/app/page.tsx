function HomePage() {
  return (
  <div className="flex h-full flex-col items-center gap-4">
    <div className="flex w-full max-w-4xl justify-end gap-2">
      <AskAIButton user={user} />
      <NewNoteButton user={user} />

    </div>
    <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
  </div>

  );
}

export default HomePage;