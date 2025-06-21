import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders without crashing", () => {
    render(<Button>Button Content</Button>);
    expect(screen.getByText("Button Content")).toBeInTheDocument();
  });
}); 