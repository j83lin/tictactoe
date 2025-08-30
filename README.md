# Tic Tac Toe

A simple Tic Tac Toe game built with FastAPI.

## How to Play

This is a web-based Tic Tac Toe game with a FastAPI backend and a simple HTML/CSS/JavaScript frontend.

### Running the Game

1.  **Ensure Python and pip are installed.**
2.  **Navigate to the project directory** in your terminal.
3.  **Create and activate a virtual environment** (recommended):
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```
4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
5.  **Start the server:**
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000
    ```
    The game will be accessible at `http://localhost:8000`.

### Playing the Game (UI)

1.  Open your web browser and go to `http://localhost:8000`.
2.  The game board will load, and a new game will automatically start.
3.  Click on any empty cell to make a move. 'X' goes first.
4.  The game status (current player, winner, draw) will be displayed below the board.
5.  Click the "New Game" button to start a fresh game at any time.

### API Endpoints (for direct interaction)

You can also interact with the game directly via its API endpoints. Access the interactive API documentation (Swagger UI) at `http://localhost:8000/docs`.

*   **`POST /game`**: Create a new Tic Tac Toe game.
    *   Returns: `Game` object with `game_id`, `board`, `current_player`, `winner`, `game_over`, `winning_path`.
*   **`GET /game/{game_id}`**: Retrieve the state of a specific game.
    *   Path Parameter: `game_id` (string)
    *   Returns: `Game` object.
*   **`POST /game/{game_id}/move`**: Make a move in a specific game.
    *   Path Parameter: `game_id` (string)
    *   Request Body: `{"row": int, "col": int}` (0-indexed)
    *   Returns: Updated `Game` object.