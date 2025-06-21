import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";

describe("Sheet", () => {
  it("opens and closes when triggered", () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>Sheet Description</SheetDescription>
          <div>Sheet Content</div>
        </SheetContent>
      </Sheet>
    );
    expect(screen.queryByText("Sheet Content")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Open Sheet"));
    expect(screen.getByText("Sheet Content")).toBeInTheDocument();

    // Close sheet (by clicking the close button with accessible name 'Close')
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByText("Sheet Content")).not.toBeInTheDocument();
  });
}); 