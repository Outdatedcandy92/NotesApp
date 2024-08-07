const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let brushSize = 5;
let allPoints = [];
let scale = 1;
let translatePos = { x: 0, y: 0 };
let isPanning = false;
let panStart = { x: 0, y: 0 };
const tension = 0;
const currentColor = '#fff'; 

const adjustControlPoint = (p0, p1, p2) => {
  return {
    x: p1.x + tension * (p2.x - p0.x),
    y: p1.y + tension * (p2.y - p0.y)
  };
};

const redrawCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.translate(translatePos.x, translatePos.y);
  context.scale(scale, scale);
  context.imageSmoothingEnabled = true;

  allPoints.forEach(points => {
    if (points.length < 3) return;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 2; i++) {
      const cp = adjustControlPoint(points[i - 1], points[i], points[i + 1]);
      context.quadraticCurveTo(points[i].x, points[i].y, cp.x, cp.y);
    }

    context.strokeStyle = currentColor; 
    context.stroke();
  });

  context.restore();
};

const getMousePos = (event) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / scale,
    y: (event.clientY - rect.top) / scale,
  };
};

const startDrawing = (event) => {
  if (event.button !== 0) return;
  const { x, y } = getMousePos(event);
  allPoints.push([{ x, y, size: brushSize }]);
  context.beginPath();
  context.moveTo(x, y);
  isDrawing = true;
};

const draw = (event) => {
  if (!isDrawing) return;
  const { x, y } = getMousePos(event);
  allPoints[allPoints.length - 1].push({ x, y, size: brushSize });
  requestAnimationFrame(redrawCanvas);
};

const stopDrawing = () => {
  isDrawing = false;
};

const handleWheel = (event) => {
  event.preventDefault();
  const scaleAmount = -event.deltaY * 0.01;
  const newScale = Math.max(0.01, scale + scaleAmount);

  const rect = canvas.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const mouseX = (centerX - translatePos.x) / scale;
  const mouseY = (centerY - translatePos.y) / scale;

  translatePos = {
    x: centerX - mouseX * newScale,
    y: centerY - mouseY * newScale,
  };

  scale = newScale;
};

const startPanning = (event) => {
  if (event.button !== 1) return;
  isPanning = true;
  panStart = { x: event.clientX - translatePos.x, y: event.clientY - translatePos.y };
};

const pan = (event) => {
  if (!isPanning) return;
  translatePos = { x: event.clientX - panStart.x, y: event.clientY - panStart.y };
};

const stopPanning = () => {
  isPanning = false;
};

const clearCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  allPoints = [];
};

const setBrushSize = (size) => {
  brushSize = size;
};

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);
canvas.addEventListener('wheel', handleWheel);
canvas.addEventListener('mousedown', startPanning);
canvas.addEventListener('mousemove', pan);
canvas.addEventListener('mouseup', stopPanning);
canvas.addEventListener('mouseleave', stopPanning);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redrawCanvas();
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
redrawCanvas();




document.addEventListener('DOMContentLoaded', () => {
  const penIcon = document.querySelector('.Pen .fa-pen');
  const dropdownMenu = document.querySelector('.Pen .dropdown-menu');
  const brushPlus = document.getElementById('Brush-plus');
  const brushMinus = document.getElementById('Brush-minus');

  penIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleDropdown();
  });

  brushPlus.addEventListener('click', () => {
    changeBrushSize(1);
  });

  brushMinus.addEventListener('click', () => {
    changeBrushSize(-1);
  });

  function toggleDropdown() {
    const isVisible = dropdownMenu.classList.contains('show');

    if (isVisible) {
      dropdownMenu.classList.remove('show');
      setTimeout(() => {
        dropdownMenu.style.display = 'none';
      }, 300);
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    } else {
      dropdownMenu.style.display = 'block';
      setTimeout(() => {
        dropdownMenu.classList.add('show');
      }, 10);
      document.addEventListener('mousedown', handleOutsideInteraction);
      document.addEventListener('touchstart', handleOutsideInteraction);
    }
  }

  function handleOutsideInteraction(event) {
    if (!dropdownMenu.contains(event.target) && !penIcon.contains(event.target)) {
      toggleDropdown();
    }
  }

  function changeBrushSize(delta) {
    brushSize = Math.max(1, brushSize + delta); 
    console.log(`Brush size changed to: ${brushSize}`);
    setBrushSize(brushSize);
  }
});
