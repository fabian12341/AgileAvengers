/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UploadClient from "@/app/Upload/UploadClient";

// Mock para next/navigation useSearchParams
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => {
      // Puedes modificar esto para devolver distintos roles
      if (key === "role") return "Agent";
      if (key === "name") return "TestUser";
      if (key === "id_team") return "1";
      if (key === "id") return "3";
      return null;
    },
  }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => (store[key] = value),
    clear: () => (store = {}),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("UploadClient Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("Muestra formulario de upload para rol Agent", () => {
    render(<UploadClient />);
    expect(screen.getByText(/Upload New Call/i)).toBeInTheDocument();
    expect(screen.getByText(/Bienvenido, TestUser/i)).toBeInTheDocument();
  });

  test("No muestra formulario upload para rol diferente", () => {
    // Cambiamos mock para que el rol sea 'Manager'
    jest.mocked(require("next/navigation").useSearchParams).mockReturnValue({
      get: (key: string) => {
        if (key === "role") return "Admin";
        if (key === "name") return "TestUser";
        if (key === "id_team") return "1";
        if (key === "id") return "123";
        return null;
      },
    });

    render(<UploadClient />);
    // El texto "Upload New Call" no debe estar
    expect(screen.queryByText(/Upload New Call/i)).not.toBeInTheDocument();

    // Igual se muestra el saludo
    expect(screen.getByText(/Bienvenido, TestUser/i)).toBeInTheDocument();
  });

  test("Permite seleccionar archivo .wav y muestra nombre", async () => {
    render(<UploadClient />);
    const fileInput =
      screen.getByRole("textbox", { hidden: true }) ||
      screen.getByLabelText(/File/i) ||
      screen.getByTestId("file-input");

    // Pero en tu código el input está hidden sin label, mejor accederlo por ref o rol:
    const fileInputHidden = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const file = new File(["dummy content"], "audio.wav", {
      type: "audio/wav",
    });
    fireEvent.change(fileInputHidden, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Selected: audio.wav/i)).toBeInTheDocument();
    });
  });
});
