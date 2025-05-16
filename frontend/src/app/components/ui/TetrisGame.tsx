'use client';

import React, { useState, useEffect, useRef } from 'react';

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

const shapes = [
  [],
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[0,1,0],[1,1,1]], // T
  [[1,0,0],[1,1,1]], // J
  [[0,0,1],[1,1,1]], // L
  [[1,1,0],[0,1,1]], // S
  [[0,1,1],[1,1,0]], // Z
];

// Set original de colores (actual)
const colorsSet1 = [
  'none',
  'cyan',
  'yellow',
  'purple',
  'blue',
  'orange',
  'green',
  'red',
];

// Set alternativo de colores para cambio cada 100 puntos
const colorsSet2 = [
  'none',
  'lightblue',
  'lightyellow',
  'plum',
  'lightblue',
  'lightsalmon',
  'lightgreen',
  'lightcoral',
];

function randomShape() {
  return Math.floor(Math.random() * (shapes.length - 1)) + 1;
}

export default function Tetris() {
  const [board, setBoard] = useState(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
  const [currentShape, setCurrentShape] = useState(randomShape());
  const [currentRotation, setCurrentRotation] = useState(0);
  const [pos, setPos] = useState({x: 3, y: 0});
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0); // estado para puntuación

  // Rotar matriz de la pieza
  function rotate(matrix: number[][]) {
    return matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
  }

  // Obtener matriz de la pieza con rotación actual
  function getShapeMatrix() {
    let shape = shapes[currentShape];
    let matrix = shape;
    for(let i=0; i<currentRotation; i++){
      matrix = rotate(matrix);
    }
    return matrix;
  }

  // Verificar si posición es válida (sin colisión)
  function isValidPosition(x: number, y: number, matrix: number[][]) {
    for(let i=0; i < matrix.length; i++){
      for(let j=0; j < matrix[i].length; j++){
        if(matrix[i][j]){
          let newX = x + j;
          let newY = y + i;
          if(newX < 0 || newX >= COLS || newY >= ROWS) return false;
          if(newY >= 0 && board[newY][newX]) return false;
        }
      }
    }
    return true;
  }

  // Colocar pieza en el tablero
  function placePiece() {
    const matrix = getShapeMatrix();
    let newBoard = board.map(row => row.slice());
    for(let i=0; i < matrix.length; i++){
      for(let j=0; j < matrix[i].length; j++){
        if(matrix[i][j]){
          let x = pos.x + j;
          let y = pos.y + i;
          if(y >= 0) newBoard[y][x] = currentShape;
        }
      }
    }
    return newBoard;
  }

  // Limpiar líneas completas y aumentar puntuación
  function clearLines(board: number[][]) {
    let newBoard = board.filter(row => row.some(cell => cell === 0));
    let cleared = ROWS - newBoard.length;

    if(cleared > 0){
      // Sumar puntos: 100 por línea limpiada (puedes ajustar)
      setScore(prev => prev + cleared * 100);
    }

    for(let i=0; i < cleared; i++){
      newBoard.unshift(Array(COLS).fill(0));
    }
    return newBoard;
  }

  // Mover pieza hacia abajo
  function moveDown() {
    const matrix = getShapeMatrix();
    if(isValidPosition(pos.x, pos.y + 1, matrix)){
      setPos({...pos, y: pos.y + 1});
    } else {
      let newBoard = placePiece();
      newBoard = clearLines(newBoard);
      setBoard(newBoard);
      setCurrentShape(randomShape());
      setCurrentRotation(0);
      setPos({x: 3, y: 0});
      // Revisar game over
      if(!isValidPosition(3, 0, shapes[currentShape])){
        setGameOver(true);
      }
    }
  }

  // Manejar teclado
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if(gameOver) return;
      const matrix = getShapeMatrix();
      if(e.key === 'ArrowLeft') {
        if(isValidPosition(pos.x -1, pos.y, matrix)) setPos({...pos, x: pos.x -1});
      } else if(e.key === 'ArrowRight'){
        if(isValidPosition(pos.x +1, pos.y, matrix)) setPos({...pos, x: pos.x +1});
      } else if(e.key === 'ArrowDown'){
        moveDown();
      } else if(e.key === 'ArrowUp'){
        // Rotar pieza
        let nextRotation = (currentRotation +1) % 4;
        let rotatedMatrix = shapes[currentShape];
        for(let i=0; i<nextRotation; i++) rotatedMatrix = rotate(rotatedMatrix);
        if(isValidPosition(pos.x, pos.y, rotatedMatrix)) setCurrentRotation(nextRotation);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pos, currentRotation, currentShape, board, gameOver]);

  // Caída automática
  useEffect(() => {
    if(gameOver) return;
    const interval = setInterval(() => {
      moveDown();
    }, 1000);
    return () => clearInterval(interval);
  }, [pos, currentRotation, currentShape, board, gameOver]);

  // Elegir set de colores según score
  const colors = score >= 100 ? colorsSet2 : colorsSet1;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Tetris</h1>
      <div className="mb-4 text-xl">Score: {score}</div>
      {gameOver ? (
        <div>
          <p className="text-2xl mb-4">Game Over</p>
          <button className="px-4 py-2 bg-purple-700 rounded" onClick={() => {
            setBoard(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
            setGameOver(false);
            setCurrentShape(randomShape());
            setCurrentRotation(0);
            setPos({x:3, y:0});
            setScore(0); // Reiniciar puntaje
          }}>Restart</button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, ${BLOCK_SIZE}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${BLOCK_SIZE}px)`,
            gap: 1,
            border: '2px solid white',
            backgroundColor: '#111',
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
              const bgColor = colors[colorIndex] || 'transparent';

              return (
                <div
                  key={`${x}-${y}`}
                  style={{
                    width: BLOCK_SIZE,
                    height: BLOCK_SIZE,
                    backgroundColor: bgColor === 'none' ? 'transparent' : bgColor,
                    border: '1px solid #333',
                  }}
                />
              );
            })
          )}
        </div>
      )}
      <p className="mt-4 text-gray-400 text-sm">Use arrow keys to move and rotate</p>
    </div>
  );
}
