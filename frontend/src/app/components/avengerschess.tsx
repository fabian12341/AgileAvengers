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
  const createEmptyRow = (): Piece[] =>
    Array(8)
      .fill(null)
      .map(() => ({ type: "empty", player: null }));

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
    Array(8)
      .fill(null)
      .map(() => ({ type: "pawn", player: 2 })),
    ...Array(4).fill(null).map(() => createEmptyRow()),
    Array(8)
      .fill(null)
      .map(() => ({ type: "pawn", player: 1 })),
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
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [promotion, setPromotion] = useState<{ row: number; col: number; player: 1 | 2 } | null>(null);
  const [lastMove, setLastMove] = useState<Move | null>(null);

  function findKingPosition(player: 1 | 2, boardState: Piece[][]): { row: number; col: number } | null {
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

    const isPathClear = (start: { row: number; col: number }, end: { row: number; col: number }) => {
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
            (from.row === startRow && rowDiff === 2 * direction && boardState[from.row + direction][from.col].type === "empty"))
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
          (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) && isPathClear(from, to)
        );
      case "king": {
        if (Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1) return true;
        if (!piece.hasMoved && rowDiff === 0 && Math.abs(colDiff) === 2) {
          const rookCol = colDiff > 0 ? 7 : 0;
          const rook = boardState[from.row][rookCol];
          if (rook.type === "rook" && rook.player === piece.player && !rook.hasMoved) {
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
        if (piece.player === opponent && canMove(piece, { row, col }, kingPosition, boardState)) {
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
    if (targetPiece.player === currentPlayer || !canMove(selectedPiece, selected, { row, col })) {
      setSelected(null);
      return;
    }
    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    if (selectedPiece.type === "pawn" && Math.abs(col - selected.col) === 1 && board[row][col].type === "empty") {
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
    if (selectedPiece.type === "pawn" && ((currentPlayer === 1 && row === 0) || (currentPlayer === 2 && row === 7))) {
      setPromotion({ row, col, player: currentPlayer });
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
    setSelected(null);
  }

  function handlePromotion(pieceType: PieceType) {
    if (!promotion) return;
    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    newBoard[promotion.row][promotion.col] = { type: pieceType, player: promotion.player };
    setBoard(newBoard);
    setPromotion(null);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  }

  const kingInCheck = isKingUnderAttack(currentPlayer, board);

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4">
        Turno del jugador {currentPlayer} {kingInCheck && "(¡Jaque!)"}
      </h2>
      <div className="grid grid-cols-8 border border-black">
        {board.map((row, rowIndex) =>
          row.map((square, colIndex) => {
            const isSelected = selected?.row === rowIndex && selected?.col === colIndex;
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-12 h-12 text-2xl flex items-center justify-center border border-gray-300 ${
                  (rowIndex + colIndex) % 2 === 0 ? "bg-white" : "bg-gray-400"
                } ${isSelected ? "ring-2 ring-red-500" : ""}`}
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {pieceIcons[square.type]}
              </button>
            );
          })
        )}
      </div>
      {promotion && (
        <div className="mt-4 flex gap-2">
          {["queen", "rook", "bishop", "knight"].map((type) => (
            <button
              key={type}
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => handlePromotion(type as PieceType)}
            >
              {pieceIcons[type as PieceType]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

