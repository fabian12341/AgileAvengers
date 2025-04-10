import { render, screen, fireEvent } from "@testing-library/react";
import Navigation from "@/app/components/Navigation"; // Ajusta la ruta según tu estructura

describe("Navigation Component", () => {
  test("renders logo with link to /Home", () => {
    render(<Navigation />);
    const logoLink = screen.getByAltText(/logo/i);
    expect(logoLink).toBeInTheDocument();
    expect(logoLink.closest("a")).toHaveAttribute("href", "/Home");
  });

  test("renders desktop menu links", () => {
    render(<Navigation />);
    const homeLink = screen.getByText(/home/i);
    const uploadsLink = screen.getByText(/uploads/i);
    const reportsLink = screen.getByText(/reports/i);

    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest("a")).toHaveAttribute("href", "/Home");
    expect(uploadsLink).toBeInTheDocument();
    expect(uploadsLink.closest("a")).toHaveAttribute("href", "/Upload");
    expect(reportsLink).toBeInTheDocument();
    expect(reportsLink.closest("a")).toHaveAttribute("href", "/Reports");
  });

  test("renders UserCircle icon in desktop menu", () => {
    render(<Navigation />);
    const userCircleIcons = screen.getAllByTestId("user-circle");
    expect(userCircleIcons.length).toBeGreaterThan(0);
  });

  test("renders mobile menu button and mobile menu is closed by default", () => {
    render(<Navigation />);
    const menuButton = screen.getByTestId("menu-button");
    expect(menuButton).toBeInTheDocument();

    const mobileMenu = screen.queryByText(/uploads/i);
    expect(mobileMenu).not.toBeInTheDocument();
  });

  test("opens mobile menu when clicking the menu button", () => {
    render(<Navigation />);
    const menuButton = screen.getByTestId("menu-button");

    fireEvent.click(menuButton);

    const homeLink = screen.getByText(/home/i);
    const uploadsLink = screen.getByText(/uploads/i);
    const reportsLink = screen.getByText(/reports/i);
    const userCircleIcon = screen.getByTestId("user-circle-mobile");

    expect(homeLink).toBeInTheDocument();
    expect(uploadsLink).toBeInTheDocument();
    expect(reportsLink).toBeInTheDocument();
    expect(userCircleIcon).toBeInTheDocument();
  });
});
