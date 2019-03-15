const players = new Map();
const game = { phase: "lobby", guesses: {} };
let timer;

/**
 * Adds a new player
 * @param {string} playerId
 */
function newPlayer(playerId) {
  players.set(playerId, {
    points: 0
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

function reduceState() {
  //
  const nextState = {
    players: [...players.keys()],
    // .map(id => ({ id, state: players.get(id).state })),
    game
  };

  return nextState;
}

/**
 * Takes a list of events and update
 * @param {{id: string, type: string, key: string}[]} clientEvents
 */
function handleClientEvents(clientEvents) {
  clientEvents.forEach(event => {
    if (event.guess) {
      game.guesses[event.id] = event.guess;
    }
  });
}

/**
 * Runs the game loop according to client events and current state
 * @param {{id: string, type: string, key: string}[]} clientEvents
 */
function gameLoop(clientEvents) {
  // Are we two or more players?

  // const nextState = state;
  handleClientEvents(clientEvents);
  const minPlayers = 2;
  const drawingTimeout = 4000;
  if (players.size >= minPlayers && game.phase === "lobby") {
    game.guesses = {};
    game.phase = "drawing";
    timer = setTimeout(() => {
      game.phase = "guess";
    }, drawingTimeout);
  } else if (game.phase === "drawing") {
    // game.timeLeft = something
  } else if (game.phase === "guess") {
    if (timer) {
      clearTimeout(timer);
    }

    console.log("guess");
    // check that all players have guessed

    if (game.guesses && Object.keys(game.guesses).length === players.size - 2) {
      console.log(game.guesses);
      game.phase = "scoring";
    }
  } else if (game.phase === "scoring") {
    // Check that all players are "ready"
    game.phase = "lobby";
  }
  return reduceState();
}

module.exports = { gameLoop, newPlayer, removePlayer, isAlive };
