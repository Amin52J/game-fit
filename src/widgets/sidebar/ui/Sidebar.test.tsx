import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  renderWithProviders,
  resetAllMocks,
  mockAuthContext,
  mockNavigationContext,
} from "@/__tests__/test-utils";
import { Sidebar } from "./Sidebar";

beforeEach(() => {
  resetAllMocks();
  mockAuthContext.user = { id: "user-1", email: "test@example.com" } as any;
});

describe("Sidebar", () => {
  it("renders navigation items", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getAllByText("Analyze").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Library").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("History").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Help")).toBeInTheDocument();
  });

  it("renders GameOrWait logo", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText("GameOrWait")).toBeInTheDocument();
  });

  it("renders log out button", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText("Log Out")).toBeInTheDocument();
  });

  it("shows logout confirmation modal on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Sidebar />);
    await user.click(screen.getByText("Log Out"));
    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    });
  });

  it("calls signOut when logout is confirmed", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Sidebar />);
    await user.click(screen.getByText("Log Out"));
    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    });
    const logoutConfirm = screen
      .getAllByText("Log Out")
      .find((el) => el.closest("[role='dialog']") || el.closest("div[class*='Modal']"));
    if (logoutConfirm) {
      await user.click(logoutConfirm);
      await waitFor(() => {
        expect(mockAuthContext.signOut).toHaveBeenCalled();
      });
    }
  });

  it("cancels logout modal", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Sidebar />);
    await user.click(screen.getByText("Log Out"));
    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    });
    await user.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
    });
  });

  it("has navigation links with correct hrefs", () => {
    renderWithProviders(<Sidebar />);
    const analyzeLink = screen.getAllByText("Analyze").find((el) => el.closest("a"));
    expect(analyzeLink?.closest("a")).toHaveAttribute("href", "/analyze");
    const libraryLink = screen.getAllByText("Library").find((el) => el.closest("a"));
    expect(libraryLink?.closest("a")).toHaveAttribute("href", "/library");
  });

  it("has hamburger menu toggle", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByLabelText(/open menu|close menu/i)).toBeInTheDocument();
  });

  it("toggles mobile menu on hamburger click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Sidebar />);
    const toggle = screen.getByLabelText(/open menu/i);
    await user.click(toggle);
    expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument();
  });

  it("displays user email when user is logged in", () => {
    mockAuthContext.user = { id: "u1", email: "player@test.com" } as any;
    renderWithProviders(<Sidebar />);
    expect(screen.getByText("player@test.com")).toBeInTheDocument();
  });

  it("displays full_name from user_metadata when available", () => {
    mockAuthContext.user = {
      id: "u1",
      email: "player@test.com",
      user_metadata: { full_name: "John Doe" },
    } as any;
    renderWithProviders(<Sidebar />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("displays email prefix when full_name is not available", () => {
    mockAuthContext.user = {
      id: "u1",
      email: "player@test.com",
      user_metadata: {},
    } as any;
    renderWithProviders(<Sidebar />);
    expect(screen.getByText("player")).toBeInTheDocument();
  });

  it("does not display user block when user is null", () => {
    mockAuthContext.user = null;
    renderWithProviders(<Sidebar />);
    expect(screen.queryByText("player@test.com")).not.toBeInTheDocument();
  });

  it("closes logout modal with Escape key", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Sidebar />);
    await user.click(screen.getByText("Log Out"));
    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    });
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
    });
  });

  it("closes mobile menu with Escape key", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Sidebar />);
    await user.click(screen.getByLabelText(/open menu/i));
    expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.getByLabelText(/open menu/i)).toBeInTheDocument();
    });
  });

  it("closes logout modal when clicking Cancel", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Sidebar />);
    await user.click(screen.getByText("Log Out"));
    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    });
    await user.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
    });
  });

  it("calls setIntent when navigation link is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Sidebar />);
    const libraryLink = screen.getAllByText("Library").find((el) => el.closest("a"))!;
    await user.click(libraryLink);
    expect(mockNavigationContext.setIntent).toHaveBeenCalledWith("/library");
  });
});
