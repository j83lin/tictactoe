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
        newGameButton.hidden = true;
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
        const winningLine = document.getElementById('winning-line');
        winningLine.setAttribute('x1', '0');
        winningLine.setAttribute('y1', '0');
        winningLine.setAttribute('x2', '0');
        winningLine.setAttribute('y2', '0');
        winningLine.classList.remove('draw-line');

        if (game.winning_path) {
            const path = game.winning_path;
            const startCell = boardElement.querySelector(`[data-row="${path[0][0]}"][data-col="${path[0][1]}"]`);
            const endCell = boardElement.querySelector(`[data-row="${path[2][0]}"][data-col="${path[2][1]}"]`);

            const boardRect = boardElement.getBoundingClientRect();
            const startRect = startCell.getBoundingClientRect();
            const endRect = endCell.getBoundingClientRect();

            const startX = startRect.left + startRect.width / 2 - boardRect.left;
            const startY = startRect.top + startRect.height / 2 - boardRect.top;
            const endX = endRect.left + endRect.width / 2 - boardRect.left;
            const endY = endRect.top + endRect.height / 2 - boardRect.top;

            winningLine.setAttribute('x1', startX);
            winningLine.setAttribute('y1', startY);
            winningLine.setAttribute('x2', endX);
            winningLine.setAttribute('y2', endY);
            
            // Trigger reflow to restart animation
            winningLine.classList.remove('draw-line');
            void winningLine.offsetWidth;
            winningLine.classList.add('draw-line');
        }

        if (game.game_over) {
            newGameButton.hidden = false;
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