import React, { useState, useEffect } from "react";

type Point = { x: number; y: number };

const BOARD_SIZE = 15;
const INITIAL_SNAKE: Point[] = [{ x: 7, y: 7 }];
const INITIAL_FOOD: Point = { x: 5, y: 5 };

const DIRECTIONS: Record<string, Point> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

export default function Snake() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Point>(DIRECTIONS.ArrowRight);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const moveSnake = () => {
    setSnake((prevSnake) => {
      const newHead: Point = {
        x: (prevSnake[0].x + direction.x + BOARD_SIZE) % BOARD_SIZE,
        y: (prevSnake[0].y + direction.y + BOARD_SIZE) % BOARD_SIZE,
      };

      // Colisión con el cuerpo
      if (
        prevSnake.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y
        )
      ) {
        setGameOver(true);
        return prevSnake;
      }

      let newSnake = [newHead, ...prevSnake];

      // Comer comida
      if (newHead.x === food.x && newHead.y === food.y) {
        placeFood(newSnake);
      } else {
        newSnake.pop(); // Elimina la cola si no comió
      }

      return newSnake;
    });
  };

  const placeFood = (snakePositions: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (
      snakePositions.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    setFood(newFood);
  };

  useEffect(() => {
    if (gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key in DIRECTIONS) {
        setDirection((currentDir) => {
          // Evitar reversa
          if (
            (e.key === "ArrowUp" && currentDir.y === 1) ||
            (e.key === "ArrowDown" && currentDir.y === -1) ||
            (e.key === "ArrowLeft" && currentDir.x === 1) ||
            (e.key === "ArrowRight" && currentDir.x === -1)
          ) {
            return currentDir;
          }
          return DIRECTIONS[e.key];
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [direction, gameOver]);

  return (
    <div>
      <h2 className="text-white mb-2">Snake Game</h2>
      {gameOver && (
        <div className="text-red-500 font-bold mb-2">
          Game Over! Refresh para jugar otra vez.
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 20px)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 20px)`,
          gap: 1,
          backgroundColor: "#222",
          border: "2px solid #555",
        }}
      >
        {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, i) => {
          const x = i % BOARD_SIZE;
          const y = Math.floor(i / BOARD_SIZE);
          const isSnake = snake.some((seg) => seg.x === x && seg.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              style={{
                width: 20,
                height: 20,
                backgroundColor: isSnake
                  ? "limegreen"
                  : isFood
                  ? "red"
                  : "#111",
                borderRadius: isSnake ? 4 : 0,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
