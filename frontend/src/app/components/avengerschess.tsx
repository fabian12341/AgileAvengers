// components/AvengersChess.tsx
"use client";

import React, { useState } from "react";

type PieceType =
  | "spiderman"
  | "captain"
  | "ironman"
  | "thor"
  | "widow"
  | "hulk"
  | "empty";

interface Piece {
  type: PieceType;
  player: 1 | 2 | null;
}

const pieceIcons: Record<PieceType, string> = {
  spiderman: "🕷️",
  captain: "🛡️",
  ironman: "🔥",
  thor: "🔨",
  widow: "⚔️",
  hulk: "💪",
  empty: "",
};

export default function AvengersChess() {
  const emptyRow = Array(8).fill({ type: "empty", player: null });

  const initialBoard: Piece[][] = [
    [
      { type: "thor", player: 2 },
      { type: "ironman", player: 2 },
      { type: "widow", player: 2 },
      { type: "captain", player: 2 },
      { type: "spiderman", player: 2 },
      { type: "widow", player: 2 },
      { type: "ironman", player: 2 },
      { type: "thor", player: 2 },
    ],
    Array(8).fill({ type: "hulk", player: 2 }),
    ...Array(4).fill(emptyRow),
    Array(8).fill({ type: "hulk", player: 1 }),
    [
      { type: "thor", player: 1 },
      { type: "ironman", player: 1 },
      { type: "widow", player: 1 },
      { type: "captain", player: 1 },
      { type: "spiderman", player: 1 },
      { type: "widow", player: 1 },
      { type: "ironman", player: 1 },
      { type: "thor", player: 1 },
    ],
  ];

  const [board, setBoard] = useState<Piece[][]>(initialBoard);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(
    null
  );
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);

  function handleClick(row: number, col: number) {
    const piece = board[row][col];

    if (!selected) {
      if (piece.player === currentPlayer) setSelected({ row, col });
      return;
    }

    const selectedPiece = board[selected.row][selected.col];
    const targetPiece = board[row][col];

    if (targetPiece.player === currentPlayer) {
      setSelected(null);
      return;
    }

    const rowDiff = Math.abs(row - selected.row);
    const colDiff = Math.abs(col - selected.col);
    if (rowDiff <= 1 && colDiff <= 1) {
      const newBoard = board.map((r) => r.map((c) => ({ ...c })));
      newBoard[row][col] = selectedPiece;
      newBoard[selected.row][selected.col] = { type: "empty", player: null };
      setBoard(newBoard);
      setSelected(null);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    } else {
      setSelected(null);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-white mb-2">Avengers Chess</h2>
      <div className="text-white mb-2">
        Turno: {currentPlayer === 1 ? "🦸‍♂️ Jugador 1" : "🦹‍♂️ Jugador 2"}
      </div>
      <div className="grid grid-cols-8 border-4 border-gray-700">
        {board.map((row, rIdx) =>
          row.map((piece, cIdx) => {
            const isSelected = selected?.row === rIdx && selected?.col === cIdx;
            const isBlack = (rIdx + cIdx) % 2 === 1;
            return (
              <button
                key={`${rIdx}-${cIdx}`}
                onClick={() => handleClick(rIdx, cIdx)}
                className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-xl md:text-2xl font-bold
                  ${isBlack ? "bg-gray-700" : "bg-gray-300"}
                  ${isSelected ? "ring-4 ring-yellow-400" : ""}
                `}
              >
                {pieceIcons[piece.type]}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
