import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NoteTextInput from "@/components/ui/NoteTextInput";
import * as actions from "@/actions/notes";

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => ({
    get: () => "123",
  }),
}));

jest.mock("@/actions/notes", () => ({
  __esModule: true,
  updateNoteAction: jest.fn(),
}));

const mockSetNoteText = jest.fn();
jest.mock("@/hooks/useNote", () => ({
  __esModule: true,
  default: () => ({
    noteText: "Initial text",
    setNoteText: mockSetNoteText,
  }),
}));

describe("NoteTextInput", () => {
  it("renders the textarea with initial value", () => {
    render(<NoteTextInput noteId="123" startingNoteText="Initial text" />);
    expect(screen.getByPlaceholderText(/type your notes here/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Initial text")).toBeInTheDocument();
  });

  it("updates note text and calls updateNoteAction", async () => {
    const mockUpdateNoteAction = actions.updateNoteAction as jest.Mock;

    jest.useFakeTimers(); 

    render(<NoteTextInput noteId="123" startingNoteText="Initial text" />);

    const textarea = screen.getByPlaceholderText(/type your notes here/i);
    fireEvent.change(textarea, { target: { value: "New content" } });

    expect(mockSetNoteText).toHaveBeenCalledWith("New content");

    jest.runAllTimers();

    await waitFor(() => {
      expect(mockUpdateNoteAction).toHaveBeenCalledWith("123", "New content");
    });

    jest.useRealTimers(); 
  });
});
