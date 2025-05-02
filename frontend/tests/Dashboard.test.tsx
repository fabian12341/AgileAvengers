import { render, screen, act } from "@testing-library/react";
import Dashboard from "@/app/components/Dashboard";

// URLs esperadas
const DESKTOP_URL =
  "https://lookerstudio.google.com/embed/reporting/db935019-a2d3-4196-86fb-b19bd5d9fe0b/page/PA8FF";
const MOBILE_URL =
  "https://lookerstudio.google.com/embed/reporting/108aef0b-9c46-4ace-bbdc-2f8b693f72da/page/PA8FF";

// Mock de window.innerWidth y resize event
const mockWindowResize = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
};

describe("Dashboard Component", () => {
  // Limpia los listeners después de cada prueba
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders iframe with desktop URL when window width >= 768", () => {
    mockWindowResize(1024); // Simula pantalla de escritorio
    render(<Dashboard />);
    const iframe = screen.getByTestId("dashboard-iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", DESKTOP_URL);
  });

  test("renders iframe with mobile URL when window width < 768", () => {
    mockWindowResize(500); // Simula pantalla móvil
    render(<Dashboard />);
    const iframe = screen.getByTestId("dashboard-iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", MOBILE_URL);
  });

  test("updates iframe URL when window is resized", () => {
    mockWindowResize(1024); // Comienza con escritorio
    render(<Dashboard />);
    const iframe = screen.getByTestId("dashboard-iframe");
    expect(iframe).toHaveAttribute("src", DESKTOP_URL);

    // Simula resize a móvil
    act(() => {
      mockWindowResize(500);
    });
    expect(iframe).toHaveAttribute("src", MOBILE_URL);

    // Simula resize de vuelta a escritorio
    act(() => {
      mockWindowResize(1024);
    });
    expect(iframe).toHaveAttribute("src", DESKTOP_URL);
  });

  test("iframe has correct attributes", () => {
    mockWindowResize(1024); // Escritorio
    render(<Dashboard />);
    const iframe = screen.getByTestId("dashboard-iframe");
    expect(iframe).toHaveAttribute("frameBorder", "0");
    expect(iframe).toHaveAttribute("allowFullScreen");
    expect(iframe).toHaveAttribute(
      "sandbox",
      "allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    );
    expect(iframe).toHaveStyle({ border: 0 });
  });

  test("adds and removes resize event listener", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    mockWindowResize(1024);
    const { unmount } = render(<Dashboard />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
