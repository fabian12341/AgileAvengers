"use client";

import React, { useState } from "react";

type PieceType =
  | "pawn"
  | "rook"
  | "knight"
  | "bishop"
  | "queen"
  | "king"
  | "empty";

interface Piece {
  type: PieceType;
  player: 1 | 2 | null;
  hasMoved?: boolean;
}

interface Move {
  from: { row: number; col: number };
  to: { row: number; col: number };
  piece: Piece;
}

const pieceIcons: Record<PieceType, string> = {
  pawn: "♟",
  rook: "♜",
  knight: "♞",
  bishop: "♝",
  queen: "♛",
  king: "♚",
  empty: "",
};

export default function ChessGame() {
  const emptyRow: Piece[] = Array(8).fill({
    type: "empty",
    player: null,
  } as Piece);

  const initialBoard: Piece[][] = [
    [
      { type: "rook", player: 2 },
      { type: "knight", player: 2 },
      { type: "bishop", player: 2 },
      { type: "queen", player: 2 },
      { type: "king", player: 2 },
      { type: "bishop", player: 2 },
      { type: "knight", player: 2 },
      { type: "rook", player: 2 },
    ],
    Array(8).fill({ type: "pawn", player: 2 }),
    ...Array(4).fill(emptyRow),
    Array(8).fill({ type: "pawn", player: 1 }),
    [
      { type: "rook", player: 1 },
      { type: "knight", player: 1 },
      { type: "bishop", player: 1 },
      { type: "queen", player: 1 },
      { type: "king", player: 1 },
      { type: "bishop", player: 1 },
      { type: "knight", player: 1 },
      { type: "rook", player: 1 },
    ],
  ];

  const [board, setBoard] = useState<Piece[][]>(initialBoard);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(
    null
  );
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [promotion, setPromotion] = useState<{
    row: number;
    col: number;
    player: 1 | 2;
  } | null>(null);
  const [lastMove, setLastMove] = useState<Move | null>(null);

  function findKingPosition(
    player: 1 | 2,
    boardState: Piece[][]
  ): { row: number; col: number } | null {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (piece.type === "king" && piece.player === player) {
          return { row, col };
        }
      }
    }
    return null;
  }

  function canMove(
    piece: Piece,
    from: { row: number; col: number },
    to: { row: number; col: number },
    boardState: Piece[][] = board
  ): boolean {
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;

    const target = boardState[to.row][to.col];
    if (target.player === piece.player) return false;

    const isPathClear = (
      start: { row: number; col: number },
      end: { row: number; col: number }
    ) => {
      const rowStep = Math.sign(end.row - start.row);
      const colStep = Math.sign(end.col - start.col);

      let currentRow = start.row + rowStep;
      let currentCol = start.col + colStep;

      while (currentRow !== end.row || currentCol !== end.col) {
        if (boardState[currentRow][currentCol].type !== "empty") {
          return false;
        }
        currentRow += rowStep;
        currentCol += colStep;
      }
      return true;
    };

    switch (piece.type) {
      case "pawn": {
        const direction = piece.player === 1 ? -1 : 1;
        const startRow = piece.player === 1 ? 6 : 1;

        if (
          colDiff === 0 &&
          boardState[to.row][to.col].type === "empty" &&
          (rowDiff === direction ||
            (from.row === startRow &&
              rowDiff === 2 * direction &&
              boardState[from.row + direction][from.col].type === "empty"))
        ) {
          return true;
        }

        if (
          Math.abs(colDiff) === 1 &&
          rowDiff === direction &&
          ((target.player && target.player !== piece.player) ||
            (lastMove &&
              lastMove.piece.type === "pawn" &&
              Math.abs(lastMove.from.row - lastMove.to.row) === 2 &&
              lastMove.to.row === from.row &&
              lastMove.to.col === to.col))
        ) {
          return true;
        }

        return false;
      }
      case "rook":
        return (rowDiff === 0 || colDiff === 0) && isPathClear(from, to);

      case "knight":
        return (
          (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
          (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)
        );

      case "bishop":
        return Math.abs(rowDiff) === Math.abs(colDiff) && isPathClear(from, to);

      case "queen":
        return (
          (rowDiff === 0 ||
            colDiff === 0 ||
            Math.abs(rowDiff) === Math.abs(colDiff)) &&
          isPathClear(from, to)
        );

      case "king": {
        if (Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1) return true;
        if (!piece.hasMoved && rowDiff === 0 && Math.abs(colDiff) === 2) {
          const rookCol = colDiff > 0 ? 7 : 0;
          const rook = boardState[from.row][rookCol];
          if (
            rook.type === "rook" &&
            rook.player === piece.player &&
            !rook.hasMoved
          ) {
            const between = colDiff > 0 ? [5, 6] : [1, 2, 3];
            if (
              between.every((c) => boardState[from.row][c].type === "empty") &&
              !isKingUnderAttack(piece.player!, boardState)
            ) {
              return true;
            }
          }
        }
        return false;
      }
      default:
        return false;
    }
  }

  function isKingUnderAttack(player: 1 | 2, boardState: Piece[][]): boolean {
    const kingPosition = findKingPosition(player, boardState);
    if (!kingPosition) return false;

    const opponent = player === 1 ? 2 : 1;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (
          piece.player === opponent &&
          canMove(piece, { row, col }, kingPosition, boardState)
        ) {
          return true;
        }
      }
    }

    return false;
  }

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

    if (!canMove(selectedPiece, selected, { row, col })) {
      setSelected(null);
      return;
    }

    const newBoard = board.map((r) => r.map((c) => ({ ...c })));

    if (
      selectedPiece.type === "pawn" &&
      Math.abs(col - selected.col) === 1 &&
      board[row][col].type === "empty"
    ) {
      newBoard[selected.row][col] = { type: "empty", player: null };
    }

    if (selectedPiece.type === "king" && Math.abs(col - selected.col) === 2) {
      const rookFrom = col > selected.col ? 7 : 0;
      const rookTo = col > selected.col ? col - 1 : col + 1;
      newBoard[row][rookTo] = newBoard[row][rookFrom];
      newBoard[row][rookFrom] = { type: "empty", player: null };
    }

    newBoard[row][col] = { ...selectedPiece, hasMoved: true };
    newBoard[selected.row][selected.col] = { type: "empty", player: null };

    setBoard(newBoard);
    setLastMove({ from: selected, to: { row, col }, piece: selectedPiece });

    if (
      selectedPiece.type === "pawn" &&
      ((currentPlayer === 1 && row === 0) || (currentPlayer === 2 && row === 7))
    ) {
      setPromotion({ row, col, player: currentPlayer });
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }

    setSelected(null);
  }

  function handlePromotion(pieceType: PieceType) {
    if (!promotion) return;

    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    newBoard[promotion.row][promotion.col] = {
      type: pieceType,
      player: promotion.player,
    };

    setBoard(newBoard);
    setPromotion(null);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  }

  const kingInCheck = isKingUnderAttack(currentPlayer, board);

  return (
    <div className="flex flex-col items-center justify-center relative">
      <h2 className="text-2xl font-bold text-white mb-2">Chess Game</h2>
      <div className="text-white mb-2">
        Turn: {currentPlayer === 1 ? "Player 1" : "Player 2"}
      </div>
      <div className="grid grid-cols-8 border-4 border-gray-700 relative z-10">
        {board.map((row, rIdx) =>
          row.map((piece, cIdx) => {
            const isSelected = selected?.row === rIdx && selected?.col === cIdx;
            const isBlack = (rIdx + cIdx) % 2 === 1;
            const pieceColor = piece.player === 1 ? "text-white" : "text-black";
            const isKingTile =
              piece.type === "king" && piece.player === currentPlayer;
            const isKingInCheck =
              isKingTile &&
              kingInCheck &&
              findKingPosition(currentPlayer, board)?.row === rIdx &&
              findKingPosition(currentPlayer, board)?.col === cIdx;

            return (
              <button
                key={`${rIdx}-${cIdx}`}
                onClick={() => handleClick(rIdx, cIdx)}
                className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-xl md:text-2xl font-bold ${
                  isBlack ? "bg-gray-700" : "bg-gray-300"
                } ${isKingInCheck ? "ring-4 ring-red-500 animate-pulse" : ""} ${
                  isSelected ? "ring-4 ring-yellow-400" : ""
                } ${pieceColor}`}
              >
                {pieceIcons[piece.type]}
              </button>
            );
          })
        )}
      </div>
      {promotion && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-2">
              Choose a piece for promotion:
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {["rook", "knight", "bishop", "queen"].map((type) => (
                <button
                  key={type}
                  onClick={() => handlePromotion(type as PieceType)}
                  className="p-2 border rounded text-xl bg-gray-200 hover:bg-gray-300"
                >
                  {pieceIcons[type as PieceType]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
