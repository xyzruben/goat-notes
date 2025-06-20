import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteNoteButton from "@/components/ui/DeleteNoteButton";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
  useSearchParams: () => new URLSearchParams("noteId=123"),
}));

jest.mock("@/actions/notes", () => ({
  deleteNoteAction: jest.fn().mockResolvedValue({ success: true }),
}));

import { deleteNoteAction } from "@/actions/notes";

describe("DeleteNoteButton", () => {
  it("calls deleteNoteAction and deleteNoteLocally on confirm", async () => {
    const mockDeleteNoteLocally = jest.fn();

    render(<DeleteNoteButton noteId="note123" deleteNoteLocally={mockDeleteNoteLocally} />);

    const triggerButton = screen.getAllByRole("button").find((btn) =>
      btn.innerHTML.toLowerCase().includes("svg")
    );
    if (triggerButton) fireEvent.click(triggerButton);

    const confirmButtons = await screen.findAllByText("Delete");
    const confirmButton = confirmButtons[confirmButtons.length - 1];
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteNoteAction).toHaveBeenCalledWith("note123");
      expect(mockDeleteNoteLocally).toHaveBeenCalledWith("note123");
    });
  });
});
