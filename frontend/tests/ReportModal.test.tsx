import { render, screen, fireEvent } from "@testing-library/react";
import ReportModal from "@/app/components/ReportModal";

describe("ReportModal Component", () => {
  // Props iniciales para las pruebas
  const mockReport = {
    date: "2023-10-01",
    agent: "Agent1",
    client: "Client1",
    summary: "This is a test summary.\nWith multiple lines.",
  };
  const mockOnClose = jest.fn();

  const defaultProps = {
    report: mockReport,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
  });

  test("renders main elements correctly", () => {
    render(<ReportModal {...defaultProps} />);
    expect(
      screen.getByText(/Reporte de llamada del 2023-10-01/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Agente: Agent1")).toBeInTheDocument();
    expect(screen.getByText("Cliente: Client1")).toBeInTheDocument();
    expect(screen.getByText("Resumen:")).toBeInTheDocument();
    expect(screen.getByText(mockReport.summary)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cerrar/i })).toBeInTheDocument();
  });

  test("displays report data from props", () => {
    const customReport = {
      date: "2023-11-01",
      agent: "Agent2",
      client: "Client2",
      summary: "Another test summary.",
    };
    render(<ReportModal report={customReport} onClose={mockOnClose} />);
    expect(
      screen.getByText(/Reporte de llamada del 2023-11-01/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Agente: Agent2")).toBeInTheDocument();
    expect(screen.getByText("Cliente: Client2")).toBeInTheDocument();
    expect(screen.getByText("Another test summary.")).toBeInTheDocument();
  });

  test("calls onClose when clicking the Close button", () => {
    render(<ReportModal {...defaultProps} />);
    const closeButton = screen.getByRole("button", { name: /Cerrar/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when clicking the backdrop", () => {
    render(<ReportModal {...defaultProps} />);
    const backdrop = screen.getByTestId("modal-backdrop");
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("does not call onClose when clicking inside the modal content", () => {
    render(<ReportModal {...defaultProps} />);
    const modalContent = screen.getByTestId("modal-content");
    fireEvent.click(modalContent);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("has correct CSS classes", () => {
    render(<ReportModal {...defaultProps} />);
    const backdrop = screen.getByTestId("modal-backdrop");
    const modalContent = screen.getByTestId("modal-content");
    const summary = screen.getByText(mockReport.summary);

    expect(backdrop).toHaveClass(
      "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
    );
    expect(modalContent).toHaveClass(
      "bg-white text-black p-6 rounded-xl max-w-lg w-full shadow-xl"
    );
    expect(summary).toHaveClass(
      "bg-gray-100 p-2 rounded mt-1 whitespace-pre-line"
    );
    expect(screen.getByRole("button", { name: /Cerrar/i })).toHaveClass(
      "mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
    );
  });
});
