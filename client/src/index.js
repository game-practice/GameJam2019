import { Application, Sprite, loader } from "pixi.js";
import { bindKey, KEYS } from "./keyboard";

require("./draw-canvas");

let PlayerTexture;
let BulletTexture;

const app = new Application();
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
function handleMessage(message, ws) {
  const data = JSON.parse(message.data);
  if (data.type === "id") {
    id = data.value;
    Object.values(KEYS).forEach(key => bindKey(id, key, ws));
  } else if (data.type === "ping") {
    ws.send(JSON.stringify({ id, type: "pong" }));
  } else if (data.type === "state") {
    // Render players, their points and current timer.
    if (data.value.game.phase === "guess") {
      console.log(data.value);
      ws.send(JSON.stringify({ id, guess: "this is my guess" }));
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
  const ws = new WebSocket(`ws://${url}:${port}`);
  ws.onmessage = message => handleMessage(message, ws);
}

/**
 * Sets up background color and size playing field
 */
function setupRenderer() {
  app.renderer.backgroundColor = 0x1e1e1e;
  app.renderer.resize(600, 600);
}

/**
 * Loads assets for player and bullet
 */
function loadAssets() {
  const PLAYER_IMAGE_ASSET = "assets/player.png";
  const BULLET_IMAGE_ASSET = "assets/bullet.png";

  return new Promise(res => {
    loader.add([PLAYER_IMAGE_ASSET, BULLET_IMAGE_ASSET]).load(() => {
      PlayerTexture = loader.resources[PLAYER_IMAGE_ASSET].texture;
      BulletTexture = loader.resources[BULLET_IMAGE_ASSET].texture;
      res();
    });
  });
}

/**
 * Starts the game
 */
async function main() {
  // await loadAssets();
  setupRenderer();
  initiateSockets();
}

document.body.appendChild(app.view);
main();
