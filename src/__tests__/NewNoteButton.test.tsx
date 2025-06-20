import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewNoteButton from "@/components/ui/NewNoteButton";
import { User } from "@supabase/supabase-js";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/actions/notes", () => ({
  createNoteAction: jest.fn().mockResolvedValue(undefined),
}));

const mockToast = {
  toast: jest.fn(),
};

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => mockToast,
}));

import { createNoteAction } from "@/actions/notes";

describe("NewNoteButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a new note and redirects with user present", async () => {
    const fakeUser = { id: "123", email: "test@example.com" } as User;

    render(<NewNoteButton user={fakeUser} />);

    const button = screen.getByRole("button", { name: /new note/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(createNoteAction).toHaveBeenCalled();

      expect(mockPush).toHaveBeenCalled();
      const arg = mockPush.mock.calls[0][0];
      expect(arg).toMatch(/^\/\?noteId=[a-f0-9-]+$/i);

      expect(mockToast.toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.any(String),
          description: expect.any(String),
          variant: "success",
        })
      );
    });
  });

  it("redirects to /login if no user is present", () => {
    render(<NewNoteButton user={null} />);
    const button = screen.getByRole("button", { name: /new note/i });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
