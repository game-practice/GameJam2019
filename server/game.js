const Matter = require("matter-js");

const players = new Map();
const world = {
  bullets: []
};

const SPEED = 5;
const ROTATION_SPEED = 0.08;
const BULLET_SPEED = 10;

/**
 * Adds a new player
 * @param {string} playerId
 */
function newPlayer(playerId) {
  const initialState = {
    x: Math.random() * 500,
    y: Math.random() * 500,
    width: 52,
    height: 70,
    rotation: Math.random() * 2 * Math.PI
  };
  players.set(playerId, {
    pressedKeys: {},
    state: initialState
  });
}

/**
 * Removes a player
 * @param {string} playerId
 */
function removePlayer(playerId) {
  players.delete(playerId);
}

/**
 * Checks whether a player is still alive
 * @param {string} id
 */
function isAlive(id) {
  return players.has(id);
}

/**
 * Check pressedkeys, update player state
 * @param {{pressedKeys: {}, state: {x: number, y: number, width:number, height: number, rotation: number}}} player
 * @param {*} id
 */
function updatePlayer(player, id) {
  const { pressedKeys, state } = player;
  players.set(id, { ...player, state });
}

function checkCollisions() {
  // Check all players vs all bullets for spherical collision
  const { bullets } = world;
  bullets.forEach(bullet => {
    players.forEach(({ state: player }, playerId) => {
      const playerRadius = Math.min(player.width, player.height);

      const dx = player.x - bullet.x;
      const dy = player.y - bullet.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < playerRadius + bullet.radius) {
        players.delete(playerId);
      }
    });
  });
}

/**
 * Updates state according to pressedKeys and last state
 * @returns The updated state
 */
function updateState() {
  players.forEach(updatePlayer);
  checkCollisions();

  const nextState = {
    players: [...players.keys()]
      .map(id => ({ id, state: players.get(id).state }))
      .reduce((prevState, client) => {
        return { ...prevState, [client.id]: client.state };
      }, {}),
    world
  };

  return nextState;
}

/**
 * Takes a list of key events and sets the pressedKeys object accordingly
 * @param {{id: string, type: string, key: string}[]} keyEvents
 */
function handleKeyInput(keyEvents) {
  keyEvents.forEach(keyEvent => {
    const client = players.get(keyEvent.id);
    if (client) {
      if (
        client.pressedKeys[keyEvent.key] === "keydown" &&
        keyEvent.type === "keyup"
      ) {
        client.pressedKeys[keyEvent.key] = "release";
      } else {
        client.pressedKeys[keyEvent.key] = keyEvent.type;
      }
      // check if previously keydown and now keyup
    }
  });
}

/**
 * Runs the game loop according to key events and current state
 * @param {{id: string, type: string, key: string}[]} keyEvents
 */
function gameLoop(keyEvents) {
  handleKeyInput(keyEvents);
  const nextState = updateState();
  return nextState;
}

module.exports = { gameLoop, newPlayer, removePlayer, isAlive };
