// Mock askAIAboutNotesAction FIRST, before any imports
jest.mock("@/actions/notes", () => ({
  askAIAboutNotesAction: jest.fn().mockResolvedValue("This is a mocked AI response."),
}));

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import AskAIButton from "@/components/ui/AskAIButton";
import { User } from "@supabase/supabase-js";
import NoteProvider from "@/providers/NoteProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
    push: jest.fn(),
  }),
}));

// Mock OpenAI API
jest.mock("openai", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: "This is a mocked AI response." } }],
        }),
      },
    },
  })),
}));

const mockUser = {
  id: "123",
  email: "test@example.com",
} as User;

describe("AskAIButton", () => {
  it("shows mocked AI response when user submits a question", async () => {
    render(
      <ThemeProvider>
        <NoteProvider>
          <AskAIButton user={mockUser} />
        </NoteProvider>
      </ThemeProvider>
    );

    // Open the dialog
    fireEvent.click(screen.getByRole("button", { name: /ask ai/i }));

    // Type a question
    const input = screen.getByPlaceholderText(/ask me anything about your notes/i);
    fireEvent.change(input, { target: { value: "What is GOAT Notes?" } });

    // Submit the question (find the send button by its role and class)
    const sendButton = screen.getAllByRole("button").find(
      (btn) => btn.className.includes("rounded-full")
    );
    if (!sendButton) throw new Error("Send button not found");
    await act(async () => {
      fireEvent.click(sendButton);
    });

    // Debug: print the DOM after clicking send
    screen.debug();

    // Wait for the mocked response to appear
    await waitFor(() => {
      const matches = screen.getAllByText((_content, element) => {
        if (element) {
          console.log("Checking element:", element.innerHTML);
        }
        return !!element && element.innerHTML.includes("This is a mocked AI response.");
      });
      expect(matches.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });
});
