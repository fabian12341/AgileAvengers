import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UploadPage from "@/app/Upload/page";
// Mock de componentes
jest.mock("@/app/components/Navigation", () => () => (
  <div data-testid="mock-navigation">Mock Navigation</div>
));
jest.mock("@/app/components/Data/calltable", () => () => (
  <div data-testid="mock-calltable">Mock CallTable</div>
));

// Mock de fetch
global.fetch = jest.fn();

describe("UploadPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders main elements correctly", () => {
    render(<UploadPage />);
    expect(screen.getByText(/Upload New Call/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Client/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Agent/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Project/i)).toBeInTheDocument();
    expect(screen.getByTestId("date-input")).toBeInTheDocument();
    expect(screen.getByTestId("time-input")).toBeInTheDocument();
    expect(screen.getByTestId("language-select")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /File/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Upload/i })).toBeInTheDocument();
    expect(screen.getByTestId("mock-navigation")).toBeInTheDocument();
    expect(screen.getByTestId("mock-calltable")).toBeInTheDocument();
  });

  test("shows error when selecting non-.wav file", () => {
    window.alert = jest.fn();
    render(<UploadPage />);
    const fileInput = screen.getByTestId("file-input");
    const file = new File(["audio"], "test.mp3", { type: "audio/mpeg" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(window.alert).toHaveBeenCalledWith("Solo se permiten archivos .wav");
    expect(screen.queryByText(/Selected: test.mp3/i)).not.toBeInTheDocument();
  });

  test("shows selected .wav file name", () => {
    render(<UploadPage />);
    const fileInput = screen.getByTestId("file-input");
    const file = new File(["audio"], "test.wav", { type: "audio/wav" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(screen.getByText(/Selected: test.wav/i)).toBeInTheDocument();
  });

  test("shows error when uploading with missing fields", () => {
    window.alert = jest.fn();
    render(<UploadPage />);
    const uploadButton = screen.getByRole("button", { name: /Upload/i });
    fireEvent.click(uploadButton);
    expect(window.alert).toHaveBeenCalledWith(
      "Please fill out all fields and select a .wav file."
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  test("uploads file successfully and shows success message", async () => {
    window.alert = jest.fn();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<UploadPage />);
    const fileInput = screen.getByTestId("file-input");
    const clientInput = screen.getByPlaceholderText(/Client/i);
    const agentInput = screen.getByPlaceholderText(/Agent/i);
    const dateInput = screen.getByTestId("date-input");
    const timeInput = screen.getByTestId("time-input");
    const uploadButton = screen.getByRole("button", { name: /Upload/i });

    // Llena los campos
    fireEvent.change(fileInput, {
      target: {
        files: [new File(["audio"], "test.wav", { type: "audio/wav" })],
      },
    });
    fireEvent.change(clientInput, { target: { value: "Client1" } });
    fireEvent.change(agentInput, { target: { value: "Agent1" } });
    fireEvent.change(dateInput, { target: { value: "2023-10-01" } });
    fireEvent.change(timeInput, { target: { value: "12:00" } });

    // Haz clic en Upload
    fireEvent.click(uploadButton);

    // Verifica el indicador de carga
    expect(
      screen.getByText(/Transcribing and creating report.../i)
    ).toBeInTheDocument();

    // Espera a que la solicitud se complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/upload-call`,
        expect.objectContaining({
          method: "POST",
          headers: { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY },
          body: expect.any(FormData),
        })
      );
      expect(window.alert).toHaveBeenCalledWith(
        "Call uploaded and processed successfully!"
      );
    });

    // Verifica que el indicador de carga desaparezca
    expect(
      screen.queryByText(/Transcribing and creating report.../i)
    ).not.toBeInTheDocument();
  });

  test("shows error message on upload failure", async () => {
    window.alert = jest.fn();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Upload failed" }),
    });

    render(<UploadPage />);
    const fileInput = screen.getByTestId("file-input");
    const clientInput = screen.getByPlaceholderText(/Client/i);
    const agentInput = screen.getByPlaceholderText(/Agent/i);
    const dateInput = screen.getByTestId("date-input");
    const timeInput = screen.getByTestId("time-input");
    const uploadButton = screen.getByRole("button", { name: /Upload/i });

    // Llena los campos
    fireEvent.change(fileInput, {
      target: {
        files: [new File(["audio"], "test.wav", { type: "audio/wav" })],
      },
    });
    fireEvent.change(clientInput, { target: { value: "Client1" } });
    fireEvent.change(agentInput, { target: { value: "Agent1" } });
    fireEvent.change(dateInput, { target: { value: "2023-10-01" } });
    fireEvent.change(timeInput, { target: { value: "12:00" } });

    // Haz clic en Upload
    fireEvent.click(uploadButton);

    // Espera a que la solicitud falle
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Upload failed");
    });
  });

  test("shows error message on network error", async () => {
    window.alert = jest.fn();
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(<UploadPage />);
    const fileInput = screen.getByTestId("file-input");
    const clientInput = screen.getByPlaceholderText(/Client/i);
    const agentInput = screen.getByPlaceholderText(/Agent/i);
    const dateInput = screen.getByTestId("date-input");
    const timeInput = screen.getByTestId("time-input");
    const uploadButton = screen.getByRole("button", { name: /Upload/i });

    // Llena los campos
    fireEvent.change(fileInput, {
      target: {
        files: [new File(["audio"], "test.wav", { type: "audio/wav" })],
      },
    });
    fireEvent.change(clientInput, { target: { value: "Client1" } });
    fireEvent.change(agentInput, { target: { value: "Agent1" } });
    fireEvent.change(dateInput, { target: { value: "2023-10-01" } });
    fireEvent.change(timeInput, { target: { value: "12:00" } });

    // Haz clic en Upload
    fireEvent.click(uploadButton);

    // Espera a que la solicitud falle
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(
        "Unexpected error uploading call."
      );
    });
  });
});
