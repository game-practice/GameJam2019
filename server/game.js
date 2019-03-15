const { isSynonym, getImage } = require("./getImage");
const splitImage = require("./splitImage");

const players = new Map();
const game = { phase: "lobby", guesses: {} };
let timer;

let correctAnswer;

const IMAGE_LOAD_STATUSES = {
  NOT_LOADED: 0,
  LOADING: 1,
  LOADED: 2
};
let imageLoadStatus = IMAGE_LOAD_STATUSES.NOT_LOADED;

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
    console.log(event);
    if (event.guess) {
      game.guesses[event.id] = event.guess;
    }
  });
}

function calculateScores() {
  const { guesses } = game;

  Object.keys(guesses).forEach(playerId => {
    const guess = guesses[playerId];
    game.scores[playerId] = game.scores[playerId] || 0;
    if (guess === correctAnswer) {
      game.scores[playerId] += 2;
    } else if (isSynonym(correctAnswer, guess)) {
      game.scores[playerId] += 1;
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
    correctAnswer = getImage();
    imageLoadStatus = IMAGE_LOAD_STATUSES.LOADING;

    splitImage(`${correctAnswer}.jpg`).then(() => {
      imageLoadStatus = IMAGE_LOAD_STATUSES.LOADED;
    });

    // if image has been split and loaded, go to drawing phase
    if (imageLoadStatus === IMAGE_LOAD_STATUSES.LOADED) {
      game.phase = "drawing";
      game.guesses = {};
      timer = setTimeout(() => {
        game.phase = "guess";
      }, drawingTimeout);
    }
  } else if (game.phase === "drawing") {
    // game.timeLeft = something
    console.log("correctAnswer", correctAnswer);
  } else if (game.phase === "guess") {
    if (timer) {
      clearTimeout(timer);
    }
    // check that all players have guessed

    if (game.guesses && Object.keys(game.guesses).length === players.size) {
      console.log(game.guesses);
      game.phase = "scoring";
      calculateScores();
    }
  } else if (game.phase === "scoring") {
    // Check that all players are "ready"
    game.phase = "lobby";
  }
  return reduceState();
}

module.exports = { gameLoop, newPlayer, removePlayer, isAlive };
