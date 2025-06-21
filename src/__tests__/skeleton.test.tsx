import React from "react";
import { render } from "@testing-library/react";
import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton", () => {
  it("renders without crashing", () => {
    render(<Skeleton data-testid="skeleton" />);
  });
}); 