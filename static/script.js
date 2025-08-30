console.log("Tic Tac Toe script loaded!");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    const boardElement = document.getElementById('game-board');
    const statusElement = document.getElementById('status');
    const newGameButton = document.getElementById('new-game');

    if (!boardElement || !statusElement || !newGameButton) {
        console.error("Could not find one or more required elements on the page.");
        return;
    }

    // Game state
    let game = {
        board: [['', '', ''], ['', '', ''], ['', '', '']],
        current_player: 'X',
        winner: null,
        game_over: false,
        winning_path: null
    };

    // Helper function to check for a winner
    function checkWinner(board, player) {
        // Check rows
        for (let r = 0; r < 3; r++) {
            if (board[r][0] === player && board[r][1] === player && board[r][2] === player) {
                return [[r, 0], [r, 1], [r, 2]];
            }
        }
        // Check columns
        for (let c = 0; c < 3; c++) {
            if (board[0][c] === player && board[1][c] === player && board[2][c] === player) {
                return [[0, c], [1, c], [2, c]];
            }
        }
        // Check diagonals
        if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
            return [[0, 0], [1, 1], [2, 2]];
        }
        if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
            return [[0, 2], [1, 1], [2, 0]];
        }
        return null;
    }

    // Helper function to check if the board is full
    function isBoardFull(board) {
        return board.every(row => row.every(cell => cell !== ''));
    }

    function createNewGame() {
        console.log("Creating a new client-side game...");
        game = {
            board: [['', '', ''], ['', '', ''], ['', '', '']],
            current_player: 'X',
            winner: null,
            game_over: false,
            winning_path: null
        };
        updateBoardDisplay();
    }

    function makeMove(row, col) {
        if (game.game_over) {
            statusElement.textContent = "Game is over. Start a new game!";
            return;
        }

        if (!(row >= 0 && row < 3 && col >= 0 && col < 3)) {
            statusElement.textContent = "Invalid move: row and col must be between 0 and 2";
            return;
        }

        if (game.board[row][col] !== '') {
            statusElement.textContent = "Invalid move: cell is already taken";
            return;
        }

        game.board[row][col] = game.current_player;

        const winningPath = checkWinner(game.board, game.current_player);
        if (winningPath) {
            game.winner = game.current_player;
            game.game_over = true;
            game.winning_path = winningPath;
        } else if (isBoardFull(game.board)) {
            game.game_over = true;
        }

        if (!game.game_over) {
            game.current_player = game.current_player === 'X' ? 'O' : 'X';
        }

        updateBoardDisplay();
    }

    function updateBoardDisplay() {
        console.log("Updating board display:", game);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = boardElement.querySelector(`[data-row="${i}"][data-col="${j}"]`);
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
            boardElement.appendChild(strike);

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
                statusElement.textContent = `Player ${game.winner} wins!`;
            } else {
                statusElement.textContent = "It's a draw!";
            }
        } else {
            statusElement.textContent = `Current player: ${game.current_player}`;
        }
    }

    boardElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('cell')) {
            const row = parseInt(event.target.dataset.row);
            const col = parseInt(event.target.dataset.col);
            makeMove(row, col);
        }
    });

    newGameButton.addEventListener('click', createNewGame);

    // Initialize the game on load
    createNewGame();
});