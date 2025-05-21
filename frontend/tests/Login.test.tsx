import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/app/Login/page";
import { useLogin } from "@/app/hooks/useLogin";


// Mock de useLogin
jest.mock("../hooks/useLogin", () => ({
  useLogin: jest.fn(),
}));

// Mock de useRouter
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Login component", () => {
  it("should store user info in localStorage after successful login", async () => {
    const mockLogin = jest.fn().mockResolvedValue({
      success: true,
      user: {
        name: "Test User",
        role: "Agent",
        id_team: 1,
        id: 123,
      },
    });

    // Simula que useLogin devuelve tu mock
    (useLogin as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      loading: false,
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      const stored = localStorage.getItem("userInfo");
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored as string)).toEqual({
        name: "Test User",
        role: "Agent",
        id_team: 1,
        id: 123,
      });
    });
  });
});
