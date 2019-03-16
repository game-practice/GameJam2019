const sheet = document.getElementById("sheet");
let context = sheet.getContext("2d");
const canvas = document.getElementById("sheet");
context = canvas.getContext("2d");
context.strokeStyle = "#ff0000";
context.lineJoin = "round";
context.lineWidth = 5;

const clickX = [];
const clickY = [];
const clickDrag = [];
let paint;

/**
 * Add information where the user clicked at.
 * @param {number} x
 * @param {number} y
 * @return {boolean} dragging
 */
function addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

/**
 * Draw the newly added point.
 * @return {void}
 */
function drawNew() {
  const i = clickX.length - 1;
  console.log("preparing to draw");
  if (!clickDrag[i]) {
    if (clickX.length == 0) {
      context.beginPath();
      context.moveTo(clickX[i], clickY[i]);
      context.stroke();
    } else {
      context.closePath();

      context.beginPath();
      context.moveTo(clickX[i], clickY[i]);
      context.stroke();
    }
  } else {
    context.lineTo(clickX[i], clickY[i]);
    context.stroke();
  }
}

function mouseDownEventHandler(e) {
  paint = true;
  const x = e.pageX - canvas.offsetLeft;
  const y = e.pageY - canvas.offsetTop;
  if (paint) {
    addClick(x, y, false);
    drawNew();
  }
}

function touchstartEventHandler(e) {
  paint = true;
  if (paint) {
    addClick(
      e.touches[0].pageX - canvas.offsetLeft,
      e.touches[0].pageY - canvas.offsetTop,
      false
    );
    drawNew();
  }
}

function mouseUpEventHandler(e) {
  context.closePath();
  paint = false;
}

function mouseMoveEventHandler(e) {
  const x = e.pageX - canvas.offsetLeft;
  const y = e.pageY - canvas.offsetTop;
  if (paint) {
    addClick(x, y, true);
    drawNew();
  }
}

function touchMoveEventHandler(e) {
  if (paint) {
    addClick(
      e.touches[0].pageX - canvas.offsetLeft,
      e.touches[0].pageY - canvas.offsetTop,
      true
    );
    drawNew();
  }
}
function removeRaceHandlers() {
  canvas.removeEventListener("mousedown", mouseWins);
  canvas.removeEventListener("touchstart", touchWins);
}

function setUpHandler(isMouseandNotTouch, detectEvent) {
  removeRaceHandlers();
  if (isMouseandNotTouch) {
    canvas.addEventListener("mouseup", mouseUpEventHandler);
    canvas.addEventListener("mousemove", mouseMoveEventHandler);
    canvas.addEventListener("mousedown", mouseDownEventHandler);
    mouseDownEventHandler(detectEvent);
  } else {
    canvas.addEventListener("touchstart", touchstartEventHandler);
    canvas.addEventListener("touchmove", touchMoveEventHandler);
    canvas.addEventListener("touchend", mouseUpEventHandler);
    touchstartEventHandler(detectEvent);
  }
}

function mouseWins(e) {
  setUpHandler(true, e);
}

function touchWins(e) {
  setUpHandler(false, e);
}

canvas.addEventListener("mousedown", mouseWins);
canvas.addEventListener("touchstart", touchWins);

/*
 canvasToImage :: Object canvasElement -> String filetype -> Int imageQuality -> data-URL
  Example:
  const dataUrl = canvasToImage(canvas, "image/jpeg", 0.5);
 */
const canvasToImage = (canvasElement, fileType, imageQuality) => {
  const dataUrl = canvasElement.toDataURL(fileType, imageQuality);
  return dataUrl;
};

// TODO: convert canvas image to png or jpg
