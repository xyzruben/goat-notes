import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AskAIButton from "@/components/ui/AskAIButton";
import * as notesActions from "@/actions/notes";
import { User } from "@supabase/supabase-js";

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockAskAI = jest.fn(() => Promise.resolve("This is a fake AI response"));
jest.mock("@/actions/notes", () => ({
  __esModule: true,
  askAIAboutNotesAction: (...args: any[]) => mockAskAI(...args),
}));

describe("AskAIButton", () => {
  const mockUser = {
    id: "user_123",
    email: "test@example.com",
  } as User;

  it("sends a question and displays the AI response", async () => {
    render(<AskAIButton user={mockUser} />);

    fireEvent.click(screen.getByText(/ask ai/i));

    const textarea = await screen.findByPlaceholderText(/ask me anything about your notes/i);
    fireEvent.change(textarea, { target: { value: "What is my note about?" } });

    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter", shiftKey: false });

    await waitFor(() => {
      expect(mockAskAI).toHaveBeenCalledWith(["What is my note about?"], []);
    });

    expect(screen.getByText(/this is a fake ai response/i)).toBeInTheDocument();
  });
});
