console.log("Tic Tac Toe script loaded!");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    const board = document.getElementById('game-board');
    const status = document.getElementById('status');
    const newGameButton = document.getElementById('new-game');

    if (!board || !status || !newGameButton) {
        console.error("Could not find one or more required elements on the page.");
        return;
    }

    let gameId = null;

    async function createNewGame() {
        try {
            console.log("Creating a new game...");
            const response = await fetch('/game', { method: 'POST' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const game = await response.json();
            console.log("New game created:", game);
            gameId = game.game_id;
            updateBoard(game);
        } catch (error) {
            console.error("Error creating new game:", error);
            status.textContent = "Error creating new game. See console for details.";
        }
    }

    async function makeMove(row, col) {
        if (!gameId) {
            console.error("Game ID is not set. Cannot make a move.");
            return;
        }
        try {
            console.log(`Making a move at (${row}, ${col}) for game ${gameId}...`);
            const response = await fetch(`/game/${gameId}/move`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ row, col })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }
            const game = await response.json();
            console.log("Move successful:", game);
            updateBoard(game);
        } catch (error) {
            console.error("Error making move:", error);
            status.textContent = `Error: ${error.message}`;
        }
    }

    function updateBoard(game) {
        console.log("Updating board:", game);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = board.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                cell.textContent = game.board[i][j] || '';
                cell.classList.remove('x', 'o'); // Remove existing classes
                if (game.board[i][j] === 'X') {
                    cell.classList.add('x');
                } else if (game.board[i][j] === 'O') {
                    cell.classList.add('o');
                }
            }
        }

        // Remove existing strikethrough
        const existingStrike = document.querySelector('.strikethrough');
        if (existingStrike) {
            existingStrike.remove();
        }

        if (game.winning_path) {
            const strike = document.createElement('div');
            strike.classList.add('strikethrough');
            board.appendChild(strike);

            const path = game.winning_path;
            const startCell = path[0];
            const endCell = path[2];

            const startX = startCell[1] * 105 + 50;
            const startY = startCell[0] * 105 + 50;
            const endX = endCell[1] * 105 + 50;
            const endY = endCell[0] * 105 + 50;

            const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

            strike.style.width = `${length}px`;
            strike.style.transform = `rotate(${angle}deg)`;
            strike.style.top = `${startY}px`;
            strike.style.left = `${startX}px`;
        }

        if (game.game_over) {
            if (game.winner) {
                status.textContent = `Player ${game.winner} wins!`;
            } else {
                status.textContent = "It's a draw!";
            }
        } else {
            status.textContent = `Current player: ${game.current_player}`;
        }
    }

    board.addEventListener('click', (event) => {
        if (event.target.classList.contains('cell')) {
            const row = parseInt(event.target.dataset.row);
            const col = parseInt(event.target.dataset.col);
            makeMove(row, col);
        }
    });

    newGameButton.addEventListener('click', createNewGame);

    createNewGame();
});