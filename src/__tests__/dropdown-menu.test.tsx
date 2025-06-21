import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

// Mock Radix UI primitives
jest.mock("@radix-ui/react-dropdown-menu", () => ({
  Root: ({ children, ...props }: any) => <div data-testid="dropdown-root" {...props}>{children}</div>,
  Trigger: ({ children, ...props }: any) => <button data-testid="dropdown-trigger" {...props}>{children}</button>,
  Portal: ({ children, ...props }: any) => <div data-testid="dropdown-portal" {...props}>{children}</div>,
  Content: ({ children, ...props }: any) => <div data-testid="dropdown-content" {...props}>{children}</div>,
  Item: ({ children, ...props }: any) => <div data-testid="dropdown-item" {...props}>{children}</div>,
  CheckboxItem: ({ children, ...props }: any) => <div data-testid="dropdown-checkbox-item" {...props}>{children}</div>,
  RadioGroup: ({ children, ...props }: any) => <div data-testid="dropdown-radio-group" {...props}>{children}</div>,
  RadioItem: ({ children, ...props }: any) => <div data-testid="dropdown-radio-item" {...props}>{children}</div>,
  Label: ({ children, ...props }: any) => <div data-testid="dropdown-label" {...props}>{children}</div>,
  Separator: ({ ...props }: any) => <div data-testid="dropdown-separator" {...props} />,
  Group: ({ children, ...props }: any) => <div data-testid="dropdown-group" {...props}>{children}</div>,
  Sub: ({ children, ...props }: any) => <div data-testid="dropdown-sub" {...props}>{children}</div>,
  SubTrigger: ({ children, ...props }: any) => <div data-testid="dropdown-sub-trigger" {...props}>{children}</div>,
  SubContent: ({ children, ...props }: any) => <div data-testid="dropdown-sub-content" {...props}>{children}</div>,
  ItemIndicator: ({ children, ...props }: any) => <div data-testid="dropdown-item-indicator" {...props}>{children}</div>,
}));

describe("DropdownMenu", () => {
  it("renders basic dropdown menu", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByTestId("dropdown-root")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-trigger")).toBeInTheDocument();
    expect(screen.getByText("Open Menu")).toBeInTheDocument();
  });

  it("renders dropdown menu with all components", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Menu Label</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>Regular Item</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Destructive Item</DropdownMenuItem>
            <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Checkbox Item</DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup>
            <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuItem>
            Item with Shortcut
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub Item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByTestId("dropdown-label")).toBeInTheDocument();
    expect(screen.getByText("Menu Label")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-group")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-separator")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-checkbox-item")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-radio-group")).toBeInTheDocument();
    expect(screen.getAllByTestId("dropdown-radio-item")).toHaveLength(2);
    expect(screen.getByTestId("dropdown-sub")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-sub-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-sub-content")).toBeInTheDocument();
  });

  it("handles click events on menu items", () => {
    const handleClick = jest.fn();
    
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleClick}>Clickable Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const menuItem = screen.getByTestId("dropdown-item");
    fireEvent.click(menuItem);
    expect(handleClick).toHaveBeenCalled();
  });

  it("renders items with different variants", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem variant="default">Default Item</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Destructive Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const items = screen.getAllByTestId("dropdown-item");
    expect(items).toHaveLength(2);
  });

  it("renders checkbox items with checked state", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>Checked Item</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={false}>Unchecked Item</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const checkboxItems = screen.getAllByTestId("dropdown-checkbox-item");
    expect(checkboxItems).toHaveLength(2);
  });

  it("renders radio items with values", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup>
            <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const radioItems = screen.getAllByTestId("dropdown-radio-item");
    expect(radioItems).toHaveLength(2);
  });

  it("renders items with shortcuts", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Item with Shortcut
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByText("⌘K")).toBeInTheDocument();
  });

  it("renders sub menu components", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub Item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByTestId("dropdown-sub")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-sub-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-sub-content")).toBeInTheDocument();
  });
});
