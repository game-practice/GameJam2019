import { bindKey, KEYS } from "./keyboard";
import "./main.css";

import canvasToImage from "./draw-canvas";

let ws;

let id;
let state;

/**
 * Renders the game according to the newState object
 * @param {object} newState
 */
function render(newState) {
  state = state || newState; // handle first state update

  const serverPlayers = Object.keys(newState.players);
  const clientPlayers = Object.keys(state.players);

  const alivePlayers = serverPlayers.filter(x => clientPlayers.includes(x));
  const deadPlayers = clientPlayers.filter(x => !serverPlayers.includes(x));

  state = newState;
}

/**
 * Handles a message from the server
 * @param {{data: { type: string, value: any}}} message
 * @param {WebSocket} ws
 */
function handleMessage(message) {
  const data = JSON.parse(message.data);

  data.value.game = {};
  data.value.game.phase = "drawing";
  if (data.type === "id") {
    id = data.value;
    Object.values(KEYS).forEach(key => bindKey(id, key, ws));
  } else if (data.type === "ping") {
    ws.send(JSON.stringify({ id, type: "pong" }));
  } else if (data.type === "state") {
    // Render players, their points and current timer.

    if (data.value.game.phase === "lobby") {
      // do something
      console.log("data.value", data.value);
    } else if (data.value.game.phase === "drawing") {
      // get images and show them
      const imagePath = `${window.location.host.split(":8080")[0]}:3001`;
      const left = `http://${imagePath}/left.jpg`;

      const img = new Image(400, 400);
      img.src = left;
      img.id = "left";

      const game = document.getElementById("game");

      console.log("game.childNodes.length", game.childNodes.length);
      if (game.childNodes.length < 8) {
        game.appendChild(img);
      }
    } else if (data.value.game.phase === "guess") {
      console.log(data.value);
    } else if (data.value.game.phase === "scoring") {
      // Show the score and the result
      // Wait for players to click "ready"
      console.log("Scoring Phase!");
    }
    console.log(data.value.game);
  } else if (data.type === "draw") {
    // Draw on the image until timeout
  }
}

/**
 * Initiates a connection to the server
 */
function initiateSockets() {
  const url = "127.0.0.1";
  const port = 3000;
  ws = new WebSocket(`ws://${url}:${port}`);
  ws.onmessage = message => handleMessage(message);
}

function sendGuess() {
  const { value } = document.querySelector('[name="guessInput"]');
  ws.send(JSON.stringify({ id, guess: value }));
}

function setupForms() {
  document
    .querySelector('[name="guessButton"]')
    .addEventListener("click", sendGuess);
}

/**
 * Starts the game
 */
async function main() {
  // await loadAssets();
  initiateSockets();
  setupForms();
}

main();
