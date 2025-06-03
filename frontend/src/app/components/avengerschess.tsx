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
      { type: "rook", player: 2, hasMoved: false },
      { type: "knight", player: 2, hasMoved: false },
      { type: "bishop", player: 2, hasMoved: false },
      { type: "queen", player: 2, hasMoved: false },
      { type: "king", player: 2, hasMoved: false },
      { type: "bishop", player: 2, hasMoved: false },
      { type: "knight", player: 2, hasMoved: false },
      { type: "rook", player: 2, hasMoved: false },
    ],
    Array(8)
      .fill(null)
      .map(() => ({ type: "pawn", player: 2, hasMoved: false })),
    ...Array(4)
      .fill(null)
      .map(() => createEmptyRow()),
    Array(8)
      .fill(null)
      .map(() => ({ type: "pawn", player: 1, hasMoved: false })),
    [
      { type: "rook", player: 1, hasMoved: false },
      { type: "knight", player: 1, hasMoved: false },
      { type: "bishop", player: 1, hasMoved: false },
      { type: "queen", player: 1, hasMoved: false },
      { type: "king", player: 1, hasMoved: false },
      { type: "bishop", player: 1, hasMoved: false },
      { type: "knight", player: 1, hasMoved: false },
      { type: "rook", player: 1, hasMoved: false },
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

  function isSquareUnderAttack(
    row: number,
    col: number,
    player: 1 | 2,
    boardState: Piece[][]
  ): boolean {
    const opponent = player === 1 ? 2 : 1;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = boardState[r][c];
        if (
          piece.player === opponent &&
          canMove(piece, { row: r, col: c }, { row, col }, boardState)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function isKingUnderAttack(player: 1 | 2, boardState: Piece[][]): boolean {
    const kingPos = findKingPosition(player, boardState);
    if (!kingPos) return false;
    return isSquareUnderAttack(kingPos.row, kingPos.col, player, boardState);
  }

  function canCastle(
    king: Piece,
    from: { row: number; col: number },
    to: { row: number; col: number },
    boardState: Piece[][]
  ): boolean {
    const colDiff = to.col - from.col;
    if (Math.abs(colDiff) !== 2 || to.row !== from.row) return false;
    if (king.hasMoved) return false;

    const rookCol = colDiff > 0 ? 7 : 0;
    const rook = boardState[from.row][rookCol];
    if (rook.type !== "rook" || rook.player !== king.player || rook.hasMoved)
      return false;

    const step = colDiff > 0 ? 1 : -1;
    for (let c = from.col + step; c !== rookCol; c += step) {
      if (boardState[from.row][c].type !== "empty") return false;
    }

    if (isKingUnderAttack(king.player!, boardState)) return false;

    const path = [from.col + step, from.col + 2 * step];
    for (const c of path) {
      if (isSquareUnderAttack(from.row, c, king.player!, boardState))
        return false;
    }

    return true;
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
      let r = start.row + rowStep;
      let c = start.col + colStep;
      while (r !== end.row || c !== end.col) {
        if (boardState[r][c].type !== "empty") return false;
        r += rowStep;
        c += colStep;
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
      case "king":
        if (Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1) return true;
        return canCastle(piece, from, to, boardState);
      default:
        return false;
    }
  }
}
