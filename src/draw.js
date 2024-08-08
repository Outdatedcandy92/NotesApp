const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let brushSize = 15;
let allPoints = [];
let currentColor = '#fff';

context.lineCap = 'round'; 
context.lineJoin = 'round'; 

let scale = 1;
let translatePos = { x: 0, y: 0 };
let startDragOffset = { x: 0, y: 0 };
let isDragging = false;

let isHighlighterMode = false;
let isEraserMode = false;

const highlighter = () => {
  console.log('Highlighter mode activated');
  isHighlighterMode = true;
  isEraserMode = false;
  // const highlighterSize = brushSize * 2; 
  // brushSize = highlighterSize;
  currentColor = currentColor + '80'; 
};

const pen = () => {
  console.log('Pen mode activated');
  isHighlighterMode = false;
  isEraserMode = false; 
  const penSize = brushSize / 2; 
  brushSize = penSize;
  currentColor = currentColor.slice(0, -2);
};

const eraser = () => {
  console.log('Eraser mode activated');
  isHighlighterMode = false;
  isEraserMode = true; 
  // const eraserSize = brushSize * 2; 
  // brushSize = eraserSize;
};

const getMousePos = (event) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left - translatePos.x) / scale,
    y: (event.clientY - rect.top - translatePos.y) / scale
  };
};

const drawGrid = () => {
  const gridSize = 100; 
  context.strokeStyle = '#ccc'; 
  context.lineWidth = 0.5 / scale; 

  const startX = Math.floor(-translatePos.x / scale / gridSize) * gridSize;
  const startY = Math.floor(-translatePos.y / scale / gridSize) * gridSize;

  context.save();
  context.translate(translatePos.x, translatePos.y);
  context.scale(scale, scale);

  for (let x = startX; x <= (canvas.width / scale); x += gridSize) {
    context.beginPath();
    context.moveTo(x, startY);
    context.lineTo(x, (canvas.height / scale));
    context.stroke();
  }

  for (let y = startY; y <= (canvas.height / scale); y += gridSize) {
    context.beginPath();
    context.moveTo(startX, y);
    context.lineTo((canvas.width / scale), y);
    context.stroke();
  }

  context.restore();
};

const redrawCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.translate(translatePos.x, translatePos.y);
  context.scale(scale, scale);

  context.lineCap = 'round'; 
  context.lineJoin = 'round'; 

  for (let i = 0; i < allPoints.length; i++) {
    const points = allPoints[i];
    if (points.length > 0) {
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (let j = 1; j < points.length; j++) {
        if (!points[j].erased) {
          context.lineTo(points[j].x, points[j].y);
        } else {
          context.moveTo(points[j].x, points[j].y);
        }
      }
      context.strokeStyle = points[0].color;
      context.lineWidth = points[0].size;
      context.stroke();
    }
  }

  context.restore();
};

const startDrawing = (event) => {
  if (event.button !== 0) return;
  const { x, y } = getMousePos(event);
  allPoints.push([{ x, y, size: brushSize, color: currentColor, erased: false }]);
  isDrawing = true;
};

const draw = (event) => {
  if (!isDrawing) return;
  const { x, y } = getMousePos(event);
  if (isEraserMode) {

    allPoints.forEach(points => {
      points.forEach(point => {
        const dx = point.x - x;
        const dy = point.y - y;
        if (Math.sqrt(dx * dx + dy * dy) <= brushSize / 2) {
          point.erased = true;
        }
      });
    });
  } else {
    allPoints[allPoints.length - 1].push({ x, y, size: brushSize, color: currentColor, erased: false });
  }
  requestAnimationFrame(redrawCanvas);
};

const stopDrawing = () => {
  isDrawing = false;
};

const clearCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  allPoints = [];
};

const setBrushSize = (size) => {
  brushSize = size;
};

const setBrushColor = (color) => {
  if (isHighlighterMode) {
    currentColor = color + '80'; // 80 = 50% opacity (hex thingy)
  } else {
    currentColor = color;
  }
};

canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  const mousePos = getMousePos(event);
  const zoomFactor = event.deltaY < 0 ? 1.05 : 0.95; //zoom sped

  const newScale = scale * zoomFactor;

  translatePos.x = mousePos.x - (mousePos.x - translatePos.x) * (newScale / scale);
  translatePos.y = mousePos.y - (mousePos.y - translatePos.y) * (newScale / scale);

  scale = newScale;
  redrawCanvas();
});

canvas.addEventListener('mousedown', (event) => {
  if (event.button === 1) { 
    isDragging = true;
    startDragOffset.x = event.clientX - translatePos.x;
    startDragOffset.y = event.clientY - translatePos.y;
  } else {
    startDrawing(event);
  }
});

canvas.addEventListener('mousemove', (event) => {
  if (isDragging) {
    translatePos.x = event.clientX - startDragOffset.x;
    translatePos.y = event.clientY - startDragOffset.y;
    redrawCanvas();
  } else {
    draw(event);
  }
});

canvas.addEventListener('mouseup', (event) => {
  if (event.button === 1) {
    isDragging = false;
  } else {
    stopDrawing();
  }
});

canvas.addEventListener('mouseleave', stopDrawing);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redrawCanvas();
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
redrawCanvas();