import * as Mousetrap from "mousetrap";

export const KEYS = {
  a: "a",
  d: "d",
  w: "w",
  s: "s",
  space: "space"
};
/**
 * Binds a keyboard key to send message to the server when pressed.
 * @param {string} id
 * @param {string} key
 * @param {WebSocket} ws
 */
export function bindKey(id, key, ws) {
  const keydown = "keydown";
  Mousetrap.bind(
    key,
    () => {
      ws.send(JSON.stringify({ id, type: keydown, key }));
    },
    keydown
  );

  const keyup = "keyup";
  Mousetrap.bind(
    key,
    () => {
      ws.send(JSON.stringify({ id, type: keyup, key }));
    },
    keyup
  );
}
