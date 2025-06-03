// components/MiniGamesPopup.tsx
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Carga dinámica de los juegos
const Tetris = dynamic(() => import("./tetrisgame"), { ssr: false });
const Snake = dynamic(() => import("./snakegame"), { ssr: false });
const AvengersChess = dynamic(() => import("./avengerschess"), { ssr: false });


export default function MiniGamesPopup() {
  const [open, setOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<
    "tetris" | "snake" | "chess" | null
  >(null);

  return (
    <>
      <button
        className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-500 transition"
        onClick={() => setOpen(true)}
      >
        🎮 Sh-AI Arcade
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-black/50">
          <div className="relative bg-gray-900 rounded-lg shadow-xl p-6 overflow-auto w-full max-w-[480px] max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-500 rounded-full px-3 py-1"
              onClick={() => {
                setOpen(false);
                setSelectedGame(null);
              }}
            >
              ✕
            </button>

            {!selectedGame && (
              <>
                <h1 className="text-3xl font-bold mb-6 text-white text-center">
                  Selecciona una misión
                </h1>
                <div className="flex flex-col gap-4 items-center justify-center">
                  <button
                    className="bg-purple-600 hover:bg-purple-500 text-white py-3 px-6 rounded text-lg w-2/3"
                    onClick={() => setSelectedGame("tetris")}
                  >
                    Tetris
                  </button>
                  <button
                    className="bg-green-600 hover:bg-green-500 text-white py-3 px-6 rounded text-lg w-2/3"
                    onClick={() => setSelectedGame("snake")}
                  >
                    Snake
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded text-lg w-2/3"
                    onClick={() => setSelectedGame("chess")}
                  >
                    Avengers Chess
                  </button>
                </div>
              </>
            )}

            {selectedGame === "tetris" && <Tetris />}
            {selectedGame === "snake" && <Snake />}
            {selectedGame === "chess" && <AvengersChess />}
          </div>
        </div>
      )}
    </>
  );
}
