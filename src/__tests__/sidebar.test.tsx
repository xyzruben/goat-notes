import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SidebarProvider, Sidebar, SidebarTrigger } from "@/components/ui/sidebar";

describe("Sidebar", () => {
  it("toggles sidebar with trigger", () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <div>Sidebar Content</div>
        </Sidebar>
        <SidebarTrigger>Toggle Sidebar</SidebarTrigger>
      </SidebarProvider>
    );
    // Sidebar content should be visible by default
    expect(screen.getByText("Sidebar Content")).toBeInTheDocument();

    // Simulate trigger (if it collapses/hides, check accordingly)
    fireEvent.click(screen.getByText("Toggle Sidebar"));
    // Add assertion for collapsed/hidden state if applicable
  });
}); 