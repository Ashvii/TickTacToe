import React, { useState } from 'react'


function App() {

    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXTurn, setIsXTurn] = useState(true);

    const [winner, setWinner] = useState(null);

    const handleClick = (index) => {


        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = isXTurn ? "X" : "O";
        setBoard(newBoard);
        setIsXTurn(!isXTurn);


        checkWinner(newBoard);
    }

    const checkWinner = (board) => {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        for (let combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                setWinner(board[a]);
                return;
            }
        }

        // check draw
        if (!board.includes(null)) {
            setWinner("Draw");

        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXTurn(true);
        setWinner(null);
    };




    return (
        <div>
            <h1 className="font-bold text-3xl text-center mt-12">Tic Tac Toe</h1>

            {/* Board */}
            <div className="board grid grid-cols-3 gap-2 w-72 sm:w-96 md:w-[480px] m-auto mt-8">
                {board.map((value, index) => (
                    <div
                        key={index}
                        onClick={() => handleClick(index)}
                        className="boxes flex items-center justify-center cursor-pointer aspect-square bg-gray-300 border-2 border-black text-4xl font-bold"
                    >
                        {value}
                    </div>
                ))}
            </div>

            {/* Winner Message */}
            {winner && (
                <div className="text-center mt-6 text-xl font-semibold">
                    {winner === "Draw"
                        ? "It's a Draw!"
                        : `Player ${winner === "X" ? 1 : 2} Wins!`}
                    <button
                        onClick={resetGame}
                        className="ml-4 bg-blue-500 text-black border-2 px-4 py-2 rounded"
                    >
                        Restart
                    </button>
                </div>
            )}
        </div>
    )
}

export default App
