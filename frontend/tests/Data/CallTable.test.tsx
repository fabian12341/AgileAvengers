import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CallTable from "@/app/components/Data/calltable";

// Interfaz para los props de CallSearch
interface CallSearchProps {
  searchId: string;
  setSearchId: (value: string) => void;
  searchClient: string;
  setSearchClient: (value: string) => void;
  searchDate: string;
  setSearchDate: (value: string) => void;
}

// Mock de componentes
jest.mock(
  "@/app/components/Data/callsearch",
  () =>
    ({
      searchId,
      setSearchId,
      searchClient,
      setSearchClient,
      searchDate,
      setSearchDate,
    }: CallSearchProps) =>
      (
        <div data-testid="mock-callsearch">
          <input
            data-testid="search-id"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <input
            data-testid="search-client"
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
          />
          <input
            data-testid="search-date"
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
      )
);

jest.mock(
  "@/app/components/Data/tablecomponent",
  () =>
    ({ calls }: { calls: any[] }) =>
      (
        <div data-testid="mock-tablecomponent">
          {calls.map((call, index: number) => (
            <div key={index} data-testid={`call-${call.id}`}>
              <button
                data-testid={`transcription-${call.id}`}
                onClick={() => call.onView("transcription")}
              >
                View Transcription
              </button>
              <button
                data-testid={`report-${call.id}`}
                onClick={() => call.onView("report")}
              >
                View Report
              </button>
            </div>
          ))}
        </div>
      )
);

// Mock de fetch
global.fetch = jest.fn();

describe("CallTable Component", () => {
  const mockApiCalls: any[] = [
    {
      id_call: "1",
      user: { name: "Agent1", role: "Agent" },
      client: "Client1",
      date: "2023-10-01 10:00:00",
      duration: 300,
      transcript: {
        text: [
          { speaker: "AGENT", text: "Hello" },
          { speaker: "CLIENT", text: "Hi" },
        ],
      },
      report: {
        summary: "Test summary",
        overall_emotion: 0.75,
        silence_percentage: 10,
        speakers: [
          {
            role: "Agent",
            emotions: {
              happiness: 0.5,
              sadness: 0.1,
              anger: 0.1,
              neutrality: 0.3,
              text_sentiment: "Positive",
              text_sentiment_score: 0.8,
            },
            voice: { pitch: 200, tempo: 120, loudness: 0.5, zcr: 0.1, hnr: 15 },
          },
        ],
        suggestions: ["Improve greeting"],
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiCalls,
    });
  });

  test("renders CallSearch and TableComponent", async () => {
    render(<CallTable refresh={false} />);
    expect(screen.getByTestId("mock-callsearch")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("mock-tablecomponent")).toBeInTheDocument();
    });
  });

  test("fetches calls on mount and when refresh changes", async () => {
    const { rerender } = render(<CallTable refresh={false} />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/calls/users`,
        expect.objectContaining({
          headers: { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY },
        })
      );
    });

    rerender(<CallTable refresh={true} />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  test("displays filtered calls based on search criteria", async () => {
    render(<CallTable refresh={false} />);
    await waitFor(() => {
      expect(screen.getByTestId("call-1")).toBeInTheDocument();
    });

    const searchIdInput = screen.getByTestId("search-id");
    const searchClientInput = screen.getByTestId("search-client");
    const searchDateInput = screen.getByTestId("search-date");

    // Filtrar por ID
    fireEvent.change(searchIdInput, { target: { value: "1" } });
    await waitFor(() => {
      expect(screen.getByTestId("call-1")).toBeInTheDocument();
    });

    // Filtrar por ID no existente
    fireEvent.change(searchIdInput, { target: { value: "999" } });
    await waitFor(() => {
      expect(screen.queryByTestId("call-1")).not.toBeInTheDocument();
    });

    // Filtrar por cliente
    fireEvent.change(searchIdInput, { target: { value: "" } });
    fireEvent.change(searchClientInput, { target: { value: "Client1" } });
    await waitFor(() => {
      expect(screen.getByTestId("call-1")).toBeInTheDocument();
    });

    // Filtrar por fecha
    fireEvent.change(searchClientInput, { target: { value: "" } });
    fireEvent.change(searchDateInput, { target: { value: "2023-10-01" } });
    await waitFor(() => {
      expect(screen.getByTestId("call-1")).toBeInTheDocument();
    });
  });

  test("shows transcription modal and closes it", async () => {
    render(<CallTable refresh={false} />);
    await waitFor(() => {
      expect(screen.getByTestId("call-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("transcription-1"));
    expect(screen.getByText(/Transcript/i)).toBeInTheDocument();
    expect(screen.getByText("Agent1")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Client1")).toBeInTheDocument();
    expect(screen.getByText("Hi")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Cerrar/i));
    await waitFor(() => {
      expect(screen.queryByText(/Transcript/i)).not.toBeInTheDocument();
    });
  });

  test("shows report modal and closes it", async () => {
    render(<CallTable refresh={false} />);
    await waitFor(() => {
      expect(screen.getByTestId("call-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("report-1"));
    expect(screen.getByText(/Reporte detallado/i)).toBeInTheDocument();
    expect(screen.getByText("Test summary")).toBeInTheDocument();
    expect(screen.getByText("0.75")).toBeInTheDocument();
    expect(screen.getByText("10.00%")).toBeInTheDocument();
    expect(screen.getByText("Improve greeting")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Cerrar/i));
    await waitFor(() => {
      expect(screen.queryByText(/Reporte detallado/i)).not.toBeInTheDocument();
    });
  });

  test("handles empty transcript in transcription modal", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ ...mockApiCalls[0], transcript: { text: [] } }],
    });

    render(<CallTable refresh={false} />);
    await waitFor(() => {
      expect(screen.getByTestId("call-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("transcription-1"));
    expect(
      screen.getByText(/No hay transcripción disponible./i)
    ).toBeInTheDocument();
  });

  test("handles fetch error gracefully", async () => {
    console.error = jest.fn();
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(<CallTable refresh={false} />);
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error al obtener las llamadas:",
        expect.any(Error)
      );
      expect(screen.getByTestId("mock-tablecomponent")).toBeInTheDocument();
    });
  });
});
