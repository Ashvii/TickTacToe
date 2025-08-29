import React, { useState } from 'react'

function App() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXTurn, setIsXTurn] = useState(true);
    const [winner, setWinner] = useState(null);
    const [mode, setMode] = useState(null); // ✅ game mode (player/ai)

    const handleClick = (index) => {
        if (board[index] || winner || !mode) return;

        const newBoard = [...board];
        newBoard[index] = isXTurn ? "X" : "O";
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
            setWinner(result);
            return;
        }

        // If playing vs AI and the human just placed "X",
        // then trigger AI's move next.
        if (mode === "ai" && isXTurn) {
            setTimeout(() => aiMove(newBoard), 200);
        } else {
            setIsXTurn(!isXTurn);
        }
    };


    // ✅ Minimax AI
    const aiMove = (newBoard) => {
        let bestScore = -Infinity;
        let move;

        for (let i = 0; i < newBoard.length; i++) {
            if (newBoard[i] === null) {
                newBoard[i] = "O"; // AI is always O
                let score = minimax(newBoard, 0, false);
                newBoard[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }

        if (move !== undefined) {
            newBoard[move] = "O";
            setBoard([...newBoard]);
            setIsXTurn(true);

            const result = checkWinner(newBoard);
            if (result) setWinner(result);
        }
    };

    // ✅ Minimax Recursive Function
    const minimax = (board, depth, isMaximizing) => {
        let result = checkWinner(board);
        if (result !== null) {
            if (result === "X") return -10 + depth; // human wins → bad for AI
            if (result === "O") return 10 - depth; // AI wins
            if (result === "Draw") return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = "O";
                    let score = minimax(board, depth + 1, false);
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = "X";
                    let score = minimax(board, depth + 1, true);
                    board[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    // ✅ Modified: return winner instead of just setting state
    const checkWinner = (board) => {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        if (!board.includes(null)) {
            return "Draw";
        }

        return null;
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXTurn(true);
        setWinner(null);
        setMode(null);
    };

    return (
        <div>
            <h1 className="font-bold text-3xl text-center mt-12">Tic Tac Toe</h1>

            {/* Mode selection */}
            {!mode && (
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => setMode("player")}
                        className="bg-green-500 text-black border-2 px-4 py-2 rounded"
                    >
                        Play with Player
                    </button>
                    <button
                        onClick={() => setMode("ai")}
                        className="bg-purple-500 text-black border-2 px-4 py-2 rounded"
                    >
                        Play with AI
                    </button>
                </div>
            )}

            {/* Board */}
            {mode && (
                <div className="board grid grid-cols-3 gap-2 w-72 sm:w-96 md:w-[480px] m-auto mt-8">
                    {board.map((value, index) => (
                        <div
                            key={index}
                            onClick={() => handleClick(index)}
                            className="boxes flex items-center justify-center cursor-pointer aspect-square bg-gray-300 border-2 border-black text-6xl font-bold"
                        >
                            {value}
                        </div>
                    ))}
                </div>
            )}

            {/* Winner Message */}
            {winner && (
                <div className="text-center mt-6 text-xl font-semibold">
                    {winner === "Draw"
                        ? "It's a Draw!"
                        : winner === "X"
                            ? "You Win! 🎉"
                            : "AI Wins 🤖"}
                    <button
                        onClick={resetGame}
                        className="ml-4 bg-blue-500 text-black border-2 px-4 py-2 rounded"
                    >
                        Restart
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
