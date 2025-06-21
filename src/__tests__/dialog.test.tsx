import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

describe("Dialog", () => {
  it("opens and closes when triggered", () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
          <div>Dialog Content</div>
        </DialogContent>
      </Dialog>
    );
    // Dialog content should not be visible initially
    expect(screen.queryByText("Dialog Content")).not.toBeInTheDocument();

    // Open dialog
    fireEvent.click(screen.getByText("Open Dialog"));
    expect(screen.getByText("Dialog Content")).toBeInTheDocument();

    // Close dialog (by clicking the close button with accessible name 'Close')
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByText("Dialog Content")).not.toBeInTheDocument();
  });
}); 