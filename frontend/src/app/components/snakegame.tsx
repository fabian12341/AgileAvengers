import React, { useState, useEffect, useRef } from "react";

type Point = { x: number; y: number };

const BOARD_SIZE = 15;
const INITIAL_SNAKE: Point[] = [{ x: 7, y: 7 }];
const INITIAL_FOOD: Point = { x: 5, y: 5 };
const BLOCK_COUNT = 10;

const DIRECTIONS: Record<string, Point> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const GAME_OVER_TEXT = "Game Over!";

export default function Snake() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Point>(DIRECTIONS.ArrowRight);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [blocks, setBlocks] = useState<Point[]>([]);
  const [activeLetterIndex, setActiveLetterIndex] = useState<number>(0);

  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const gameOverRef = useRef<HTMLAudioElement>(null);

  const generateBlocks = (snakePositions: Point[], foodPosition: Point): Point[] => {
    const newBlocks: Point[] = [];
    while (newBlocks.length < BLOCK_COUNT) {
      const block = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
      if (
        !snakePositions.some(s => s.x === block.x && s.y === block.y) &&
        !(foodPosition.x === block.x && foodPosition.y === block.y) &&
        !newBlocks.some(b => b.x === block.x && b.y === block.y)
      ) {
        newBlocks.push(block);
      }
    }
    return newBlocks;
  };

  useEffect(() => {
    setBlocks(generateBlocks(snake, food));
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.2;
      bgMusicRef.current.play().catch(() => {});
    }
  }, []);

  const moveSnake = () => {
    setSnake((prevSnake) => {
      const newHead: Point = {
        x: (prevSnake[0].x + direction.x + BOARD_SIZE) % BOARD_SIZE,
        y: (prevSnake[0].y + direction.y + BOARD_SIZE) % BOARD_SIZE,
      };

      if (
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y) ||
        blocks.some(block => block.x === newHead.x && block.y === newHead.y)
      ) {
        triggerGameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        placeFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  const triggerGameOver = () => {
    setGameOver(true);
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }
    if (gameOverRef.current) {
      gameOverRef.current.play();
    }
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
      ) || blocks.some(block => block.x === newFood.x && block.y === newFood.y)
    );
    setFood(newFood);
  };

  useEffect(() => {
    if (gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key in DIRECTIONS) {
        setDirection((currentDir) => {
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

  useEffect(() => {
    if (!gameOver) {
      setActiveLetterIndex(0);
      return;
    }
    const animationInterval = setInterval(() => {
      setActiveLetterIndex((prev) => (prev + 1) % GAME_OVER_TEXT.length);
    }, 150);

    return () => clearInterval(animationInterval);
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white select-none p-4">
      {/* Audio files */}
      <audio ref={bgMusicRef} src="/Snake1.mp3" loop preload="auto" />
      <audio ref={gameOverRef} src="/SGM.mp3" preload="auto" />

      <h2
        style={{
          color: "#90ee90",
          fontFamily: "'Courier New', Courier, monospace",
          textShadow: "0 0 10px #32cd32",
          marginBottom: 15,
        }}
      >
        Snake Game
      </h2>

      {gameOver ? (
        <div
          style={{
            fontWeight: "bold",
            fontSize: "2rem",
            fontFamily: "'Courier New', Courier, monospace",
            userSelect: "none",
            display: "inline-block",
            letterSpacing: 4,
          }}
        >
          {GAME_OVER_TEXT.split("").map((char, idx) => (
            <span
              key={idx}
              style={{
                color: idx === activeLetterIndex ? "#ff0000" : "#440000",
                textShadow:
                  idx === activeLetterIndex
                    ? "0 0 10px #ff0000, 0 0 20px #ff4d4d"
                    : "none",
                transition: "color 0.2s ease",
                cursor: "default",
              }}
            >
              {char}
            </span>
          ))}
          <div style={{ fontSize: "1rem", marginTop: 10, color: "#ff5555" }}>
            Tus clientes te necesitan Avenger.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 22px)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, 22px)`,
            gap: 2,
            backgroundColor: "#121212",
            border: "3px solid #444",
            borderRadius: 8,
            width: BOARD_SIZE * 24,
            margin: "0 auto",
            boxShadow: "0 0 20px #1e90ff",
          }}
        >
          {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, i) => {
            const x = i % BOARD_SIZE;
            const y = Math.floor(i / BOARD_SIZE);
            const isSnake = snake.some((seg) => seg.x === x && seg.y === y);
            const isFood = food.x === x && food.y === y;
            const isBlock = blocks.some(b => b.x === x && b.y === y);

            let backgroundColor = "#222";
            let borderRadius: string | number = 0;
            let boxShadow = "none";

            if (isSnake) {
              backgroundColor = "#32cd32";
              borderRadius = 6;
              boxShadow = "0 0 8px #32cd32";
            } else if (isFood) {
              backgroundColor = "#ff3b3b";
              borderRadius = "50%";
              boxShadow = "0 0 12px #ff3b3b";
            } else if (isBlock) {
              backgroundColor = "#8b0000";
              borderRadius = 3;
              boxShadow = "inset 0 0 10px #550000";
            } else {
              backgroundColor = "#111";
            }

            return (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 22,
                  backgroundColor,
                  borderRadius,
                  boxShadow,
                  transition: "background-color 0.3s ease",
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
