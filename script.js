var origBoard;
var ember_win = "0";
var dontetlen = "0";
var gep_win = "0";
const huPlayer = "O";
const aiPlayer = "X";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

const cells = document.querySelectorAll(".cell");
var e = document.getElementById("difficulty");
var difficultyLevel = e.value;
console.log(difficultyLevel);
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  document.querySelector(".ember_win").innerHTML = ember_win;
  document.querySelector(".dontetlen").innerHTML = dontetlen;
  document.querySelector(".gep_win").innerHTML = gep_win;
  origBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].style.color = "#000000";
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == "number") {
    turn(square.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer) && !checkTie())
      turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.color =
      gameWon.player == huPlayer ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? ember_win++ : gep_win++);
  declareWinner(
    gameWon.player == huPlayer
      ? "Gratulálunk, győztél!"
      : "Sajnos most nem nyertél."
  );
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
  document.querySelector(".ember_win").innerHTML = ember_win;
  document.querySelector(".dontetlen").innerHTML = dontetlen;
  document.querySelector(".gep_win").innerHTML = gep_win;
}

function emptySquares() {
  return origBoard.filter((s) => typeof s == "number");
}

function bestSpot() {
  var e = document.getElementById("difficulty");
  var difficultyLevel = e.value;
  console.log(difficultyLevel);
  if (difficultyLevel === "easy") {
    return emptySquares()[Math.floor(Math.random() * emptySquares().length)];
  } else if (difficultyLevel === "medium") {
    return minimax(origBoard, aiPlayer, 0).index;
  } else {
    return maxmini(origBoard, aiPlayer).index;
  }
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.color = "blue";
      cells[i].removeEventListener("click", turnClick, false);
    }
    dontetlen++;
    declareWinner("Döntetlen!");
    return true;
  }
  return false;
}

function minimax(newBoard, player, depth) {
  const availSpots = emptySquares();
  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 + depth };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 - depth };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    if (player === aiPlayer) {
      var result = minimax(newBoard, huPlayer, depth + 1);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer, depth + 1);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }
  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score + Math.random() * 10 > bestScore) {
        bestScore = moves[i].score + Math.random() * 10;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score - Math.random() * 10 < bestScore) {
        bestScore = moves[i].score - Math.random() * 10;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function maxmini(newBoard, player) {
  var availSpots = emptySquares();

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = maxmini(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = maxmini(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
