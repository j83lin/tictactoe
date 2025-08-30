from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

class Game(BaseModel):
    game_id: str
    board: List[List[Optional[str]]] = [['', '', ''], ['', '', ''], ['', '', '']]
    current_player: str = 'X'
    winner: Optional[str] = None
    game_over: bool = False
    winning_path: Optional[List[List[int]]] = None

games = {}

@app.get("/")
async def read_index():
    return FileResponse('static/index.html')

@app.post("/game", response_model=Game)
def create_game():
    game_id = str(uuid.uuid4())
    game = Game(game_id=game_id)
    games[game_id] = game
    return game

@app.get("/game/{game_id}", response_model=Game)
def get_game(game_id: str):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")
    return games[game_id]

class Move(BaseModel):
    row: int
    col: int

@app.post("/game/{game_id}/move", response_model=Game)
def make_move(game_id: str, move: Move):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Game not found")

    game = games[game_id]

    if game.game_over:
        raise HTTPException(status_code=400, detail="Game is over")

    if not (0 <= move.row < 3 and 0 <= move.col < 3):
        raise HTTPException(status_code=400, detail="Invalid move: row and col must be between 0 and 2")

    if game.board[move.row][move.col] is not None and game.board[move.row][move.col] != '':
        raise HTTPException(status_code=400, detail="Invalid move: cell is already taken")

    game.board[move.row][move.col] = game.current_player

    winning_path = check_winner(game.board, game.current_player)
    if winning_path:
        game.winner = game.current_player
        game.game_over = True
        game.winning_path = winning_path
    elif is_board_full(game.board):
        game.game_over = True

    if not game.game_over:
        game.current_player = 'O' if game.current_player == 'X' else 'X'

    return game

def check_winner(board: List[List[Optional[str]]], player: str) -> Optional[List[List[int]]]:
    # Check rows
    for r in range(3):
        if all(board[r][c] == player for c in range(3)):
            return [[r, 0], [r, 1], [r, 2]]
    # Check columns
    for c in range(3):
        if all(board[r][c] == player for r in range(3)):
            return [[0, c], [1, c], [2, c]]
    # Check diagonals
    if all(board[i][i] == player for i in range(3)):
        return [[0, 0], [1, 1], [2, 2]]
    if all(board[i][2 - i] == player for i in range(3)):
        return [[0, 2], [1, 1], [2, 0]]
    return None

def is_board_full(board: List[List[Optional[str]]]) -> bool:
    return all(cell is not None and cell != '' for row in board for cell in row)