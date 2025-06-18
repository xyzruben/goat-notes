
import React from "react";
import { render, screen } from "@testing-library/react";
import SelectNoteButton from "@/components/ui/SelectNoteButton";
import { SidebarProvider } from "@/components/ui/sidebar";

type Note = {
  id: string;
  title: string;
  text: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

jest.mock("@/hooks/useNote", () => ({
  __esModule: true,
  default: () => ({
    noteText: "This is a real note body",
  }),
}));

jest.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "noteId" ? "note-id-123" : null),
  }),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("SelectNoteButton", () => {
  const note: Note = {
    id: "note-id-123",
    title: "This is a real title",
    text: "This is a real note body",
    authorId: "author-1",
    createdAt: new Date("2025-06-17"),
    updatedAt: new Date("2025-06-17"),
  };

  it("renders the note text when not selected", () => {
    render(
      <SidebarProvider>
        <SelectNoteButton note={{ ...note, id: "different-id" }} />
      </SidebarProvider>
    );
    expect(screen.getByText(note.text)).toBeInTheDocument();
  });

  it("renders properly even when selected (internal noteId logic)", () => {
    render(
      <SidebarProvider>
        <SelectNoteButton note={note} />
      </SidebarProvider>
    );
    expect(screen.getByText(note.text)).toBeVisible();
  });
});
