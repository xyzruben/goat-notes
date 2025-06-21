import React from "react";
import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

describe("Label", () => {
  it("renders without crashing", () => {
    render(<Label>Label Content</Label>);
    expect(screen.getByText("Label Content")).toBeInTheDocument();
  });
}); 