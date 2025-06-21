import React from "react";
import { render } from "@testing-library/react";
import { Separator } from "@/components/ui/separator";

describe("Separator", () => {
  it("renders without crashing", () => {
    render(<Separator data-testid="separator" />);
  });
}); 