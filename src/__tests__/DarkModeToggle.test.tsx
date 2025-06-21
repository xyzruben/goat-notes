import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { findByText } from "@testing-library/dom";
import DarkModeToggle from "@/components/ui/DarkModeToggle";

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: () => ({ setTheme: jest.fn() }),
}));

// NOTE: Radix UI portals may not render in JSDOM. This test uses user-event and increased timeout.
describe("DarkModeToggle", () => {
  it("renders and allows theme selection", async () => {
    render(<DarkModeToggle />);
    // Use user-event for realistic interaction
    const trigger = screen.getByRole("button", { name: /toggle theme/i });
    await userEvent.click(trigger);
    // Await menu items in document.body with increased timeout
    await waitFor(async () => {
      expect(await findByText(document.body, /light/i)).toBeInTheDocument();
      expect(await findByText(document.body, /dark/i)).toBeInTheDocument();
      expect(await findByText(document.body, /system/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
}); 