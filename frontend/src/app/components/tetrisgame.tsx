"use client";

import React, { useState, useEffect, useRef } from "react";

// ... consts sin cambios ...
const ROWS_DEFAULT = 15;
const COLS_DEFAULT = 12;
const BLOCK_SIZE_DEFAULT = 30;

const shapes = [
  [],
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // J
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // L
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // Z
];

const colors = [
  "none",
  "cyan",
  "yellow",
  "purple",
  "blue",
  "orange",
  "green",
  "red",
];

function randomShape() {
  return Math.floor(Math.random() * (shapes.length - 1)) + 1;
}

const GameOverDisplay = ({ onRestart }: { onRestart: () => void }) => {
  const letters = "GAME OVER".split("");

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="grid grid-cols-9 gap-1">
        {letters.map((char, i) => (
          <div
            key={i}
            className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg animate-bounce"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "0.8s",
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
              color: "#FF416C",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </div>
        ))}
      </div>
      <p className="text-gray-300">Presiona para reiniciar</p>
      <button
        onClick={onRestart}
        className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 rounded-lg shadow-lg text-white font-semibold hover:scale-105 transition-transform"
      >
        Restart Game
      </button>
    </div>
  );
};

export default function Tetris() {
  const [rows] = useState(ROWS_DEFAULT);
  const [cols] = useState(COLS_DEFAULT);
  const [blockSize] = useState(BLOCK_SIZE_DEFAULT);

  const [board, setBoard] = useState(
    Array(ROWS_DEFAULT)
      .fill(0)
      .map(() => Array(COLS_DEFAULT).fill(0))
  );
  const [currentShape, setCurrentShape] = useState(randomShape());
  const [currentRotation, setCurrentRotation] = useState(0);
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [gameOver, setGameOver] = useState(false);

  const [dropInterval, setDropInterval] = useState(300);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const gameOverRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setBoard(
      Array(rows)
        .fill(0)
        .map(() => Array(cols).fill(0))
    );
    setPos({ x: Math.floor(cols / 2) - 2, y: 0 });
  }, [rows, cols]);

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.5;
      bgMusicRef.current.play().catch(() => {
        console.log("Se requiere interacción del usuario para reproducir audio automáticamente.");
      });
    }
  }, []);

  useEffect(() => {
    if (gameOver) {
      if (bgMusicRef.current) bgMusicRef.current.pause();
      if (gameOverRef.current) {
        gameOverRef.current.currentTime = 0;
        gameOverRef.current.play();
      }
    }
  }, [gameOver]);

  function rotate(matrix: number[][]) {
    return matrix[0].map((_, index) =>
      matrix.map((row) => row[index]).reverse()
    );
  }

  function getShapeMatrix() {
    const shape = shapes[currentShape];
    let matrix = shape;
    for (let i = 0; i < currentRotation; i++) {
      matrix = rotate(matrix);
    }
    return matrix;
  }

  function isValidPosition(x: number, y: number, matrix: number[][]) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j]) {
          const newX = x + j;
          const newY = y + i;
          if (newX < 0 || newX >= cols || newY >= rows) return false;
          if (newY >= 0 && board[newY][newX]) return false;
        }
      }
    }
    return true;
  }

  function placePiece() {
    const matrix = getShapeMatrix();
    const newBoard = board.map((row) => row.slice());
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j]) {
          const x = pos.x + j;
          const y = pos.y + i;
          if (y >= 0) newBoard[y][x] = currentShape;
        }
      }
    }
    return newBoard;
  }

  function clearLines(board: number[][]) {
    const newBoard = board.filter((row) => row.some((cell) => cell === 0));
    const cleared = rows - newBoard.length;
    for (let i = 0; i < cleared; i++) {
      newBoard.unshift(Array(cols).fill(0));
    }
    return newBoard;
  }

  function moveDown() {
    const matrix = getShapeMatrix();
    if (isValidPosition(pos.x, pos.y + 1, matrix)) {
      setPos({ ...pos, y: pos.y + 1 });
    } else {
      let newBoard = placePiece();
      newBoard = clearLines(newBoard);
      setBoard(newBoard);
      const newShape = randomShape();
      setCurrentShape(newShape);
      setCurrentRotation(0);
      setPos({ x: Math.floor(cols / 2) - 2, y: 0 });
      if (!isValidPosition(Math.floor(cols / 2) - 2, 0, shapes[newShape])) {
        setGameOver(true);
      }
    }
  }

  // ⛔️ Aquí se evita el scroll con flechas
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (gameOver) return;

      const matrix = getShapeMatrix();
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowUp"
      ) {
        e.preventDefault(); // ✅ prevenir comportamiento del navegador
      }

      if (e.key === "ArrowLeft") {
        if (isValidPosition(pos.x - 1, pos.y, matrix))
          setPos({ ...pos, x: pos.x - 1 });
      } else if (e.key === "ArrowRight") {
        if (isValidPosition(pos.x + 1, pos.y, matrix))
          setPos({ ...pos, x: pos.x + 1 });
      } else if (e.key === "ArrowDown") {
        moveDown();
      } else if (e.key === "ArrowUp") {
        const nextRotation = (currentRotation + 1) % 4;
        let rotatedMatrix = shapes[currentShape];
        for (let i = 0; i < nextRotation; i++)
          rotatedMatrix = rotate(rotatedMatrix);
        if (isValidPosition(pos.x, pos.y, rotatedMatrix))
          setCurrentRotation(nextRotation);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [pos, currentRotation, currentShape, board, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      moveDown();
    }, dropInterval);
    return () => clearInterval(interval);
  }, [pos, currentRotation, currentShape, board, gameOver, dropInterval]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <audio ref={bgMusicRef} src="/tetris.mp3" loop />
      <audio ref={gameOverRef} src="/gameover.mp3" />

      <h1 className="text-4xl font-bold mb-6 text-pink-500">TetriShield AI</h1>

      <div
        className={`relative ${
          gameOver ? "opacity-30 blur-sm transition-all duration-500" : ""
        }`}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${blockSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${blockSize}px)`,
            gap: 1,
            border: "2px solid white",
            backgroundColor: "#111",
          }}
        >
          {board.map((row, y) =>
            row.map((cell, x) => {
              const matrix = getShapeMatrix();
              const relativeX = x - pos.x;
              const relativeY = y - pos.y;
              const isCurrent =
                relativeX >= 0 &&
                relativeX < matrix[0].length &&
                relativeY >= 0 &&
                relativeY < matrix.length &&
                matrix[relativeY][relativeX] === 1;

              const colorIndex = isCurrent ? currentShape : cell;
              const bgColor = colors[colorIndex] || "transparent";

              return (
                <div
                  key={`${x}-${y}`}
                  style={{
                    width: blockSize,
                    height: blockSize,
                    backgroundColor:
                      bgColor === "none" ? "transparent" : bgColor,
                    border: "1px solid #333",
                  }}
                />
              );
            })
          )}
        </div>
      </div>

      {gameOver && (
        <GameOverDisplay
          onRestart={() => {
            setBoard(
              Array(rows)
                .fill(0)
                .map(() => Array(cols).fill(0))
            );
            setGameOver(false);
            setCurrentShape(randomShape());
            setCurrentRotation(0);
            setPos({ x: Math.floor(cols / 2) - 2, y: 0 });
            setDropInterval(300);

            if (gameOverRef.current) gameOverRef.current.pause();
            if (bgMusicRef.current) {
              bgMusicRef.current.currentTime = 0;
              bgMusicRef.current.play();
            }
          }}
        />
      )}

      <p className="mt-4 text-gray-400 text-sm">
        Usa flechas para mover y rotar las piezas
      </p>
    </div>
  );
}
