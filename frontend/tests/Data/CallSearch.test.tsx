import { render, screen, fireEvent } from "@testing-library/react";
import CallSearch from "@/app/components/Data/callsearch";

describe("CallSearch Component", () => {
  // Props iniciales para las pruebas
  const mockSetSearchId = jest.fn();
  const mockSetSearchClient = jest.fn();
  const mockSetSearchDate = jest.fn();

  const defaultProps = {
    searchId: "",
    setSearchId: mockSetSearchId,
    searchClient: "",
    setSearchClient: mockSetSearchClient,
    searchDate: "",
    setSearchDate: mockSetSearchDate,
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
  });

  test("renders main elements correctly", () => {
    render(<CallSearch {...defaultProps} />);
    expect(
      screen.getByText(/Search for transcript or report/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Fill in the necessary fields to find a specific call./i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Call ID/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Client/i)).toBeInTheDocument();
    expect(screen.getByTestId("date-input")).toBeInTheDocument();
  });

  test("renders inputs with initial prop values", () => {
    const propsWithValues = {
      ...defaultProps,
      searchId: "12345",
      searchClient: "TestClient",
      searchDate: "2023-10-01",
    };
    render(<CallSearch {...propsWithValues} />);
    expect(screen.getByPlaceholderText(/Call ID/i)).toHaveValue("12345");
    expect(screen.getByPlaceholderText(/Client/i)).toHaveValue("TestClient");
    expect(screen.getByTestId("date-input")).toHaveValue("2023-10-01");
  });

  test("updates searchId when Call ID input changes", () => {
    render(<CallSearch {...defaultProps} />);
    const callIdInput = screen.getByPlaceholderText(/Call ID/i);
    fireEvent.change(callIdInput, { target: { value: "67890" } });
    expect(mockSetSearchId).toHaveBeenCalledWith("67890");
  });

  test("updates searchClient when Client input changes", () => {
    render(<CallSearch {...defaultProps} />);
    const clientInput = screen.getByPlaceholderText(/Client/i);
    fireEvent.change(clientInput, { target: { value: "NewClient" } });
    expect(mockSetSearchClient).toHaveBeenCalledWith("NewClient");
  });

  test("updates searchDate when Date input changes", () => {
    render(<CallSearch {...defaultProps} />);
    const dateInput = screen.getByTestId("date-input");
    fireEvent.change(dateInput, { target: { value: "2023-11-01" } });
    expect(mockSetSearchDate).toHaveBeenCalledWith("2023-11-01");
  });

  test("inputs have correct classes and attributes", () => {
    render(<CallSearch {...defaultProps} />);
    const callIdInput = screen.getByPlaceholderText(/Call ID/i);
    const clientInput = screen.getByPlaceholderText(/Client/i);
    const dateInput = screen.getByTestId("date-input");

    expect(callIdInput).toHaveClass(
      "bg-gray-800 p-2 rounded-md w-full border border-gray-600 text-white"
    );
    expect(clientInput).toHaveClass(
      "bg-gray-800 p-2 rounded-md w-full border border-gray-600 text-white"
    );
    expect(dateInput).toHaveClass(
      "bg-gray-800 p-2 rounded-md w-full border border-gray-600 text-white"
    );
    expect(dateInput).toHaveAttribute("type", "date");
  });
});
