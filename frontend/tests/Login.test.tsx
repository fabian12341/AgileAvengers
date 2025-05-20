// __tests__/Login.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/app/Login/page"; // ajusta la ruta si es distinta
import { useRouter } from "next/navigation";

// Mock del router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock del hook useLogin definido inline
const mockLogin = jest.fn();
jest.mock("@/app/hooks/useLogin", () => ({
  useLogin: () => ({
    login: mockLogin,
    error: null,
    loading: false,
  }),
}));

import { useLogin } from "@/app/hooks/useLogin"; // importa después del mock

describe("Login Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    mockLogin.mockReset();
    localStorage.clear();
  });

  it("should redirect to /Home with admin role", async () => {
    mockLogin.mockResolvedValue({
      success: true,
      user: {
        name: "Admin User",
        role: "admin",
        id_team: "T1",
        id: "U1",
      },
    });

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "adminpass" },
    });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        "/Home?name=Admin%20User&role=admin&id_team=T1&id=U1"
      );
    });

    const storedUser = JSON.parse(localStorage.getItem("userInfo")!);
    expect(storedUser).toEqual({
      name: "Admin User",
      role: "admin",
      id_team: "T1",
      id: "U1",
    });
  });

  it("should redirect to /Home with user role", async () => {
    mockLogin.mockResolvedValue({
      success: true,
      user: {
        name: "Normal User",
        role: "user",
        id_team: "T2",
        id: "U2",
      },
    });

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "userpass" },
    });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        "/Home?name=Normal%20User&role=user&id_team=T2&id=U2"
      );
    });

    const storedUser = JSON.parse(localStorage.getItem("userInfo")!);
    expect(storedUser).toEqual({
      name: "Normal User",
      role: "user",
      id_team: "T2",
      id: "U2",
    });
  });

  it("should show error on failed login", async () => {
    mockLogin.mockResolvedValue({ success: false });

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: "fail@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(
        screen.getByText(/Login failed. Please check your credentials./i)
      ).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
