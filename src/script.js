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

  drawGrid(); //NOT WORKING PROPERLY


  for (let i = 0; i < allPoints.length; i++) {
    const points = allPoints[i];
    if (points.length > 0) {
      context.beginPath();
      context.arc(points[0].x, points[0].y, points[0].size / 2, 0, Math.PI * 2);
      context.fillStyle = points[0].color;
      context.fill();

      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (let j = 1; j < points.length - 1; j++) {
        const midPoint = {
          x: (points[j].x + points[j + 1].x) / 2,
          y: (points[j].y + points[j + 1].y) / 2
        };
        context.quadraticCurveTo(points[j].x, points[j].y, midPoint.x, midPoint.y);
      }
      context.quadraticCurveTo(
        points[points.length - 1].x,
        points[points.length - 1].y,
        points[points.length - 1].x,
        points[points.length - 1].y
      );
      context.strokeStyle = points[0].color;
      context.lineWidth = points[0].size;
      context.stroke();

      context.beginPath();
      context.arc(points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].size / 2, 0, Math.PI * 2);
      context.fillStyle = points[points.length - 1].color;
      context.fill();
    }
  }

  context.restore();
};

const startDrawing = (event) => {
  if (event.button !== 0) return;
  const { x, y } = getMousePos(event);
  allPoints.push([{ x, y, size: brushSize, color: currentColor }]);
  context.beginPath();
  context.moveTo(x, y);
  isDrawing = true;
};

const draw = (event) => {
  if (!isDrawing) return;
  const { x, y } = getMousePos(event);
  allPoints[allPoints.length - 1].push({ x, y, size: brushSize, color: currentColor });
  requestAnimationFrame(redrawCanvas);
};

const stopDrawing = () => {
  isDrawing = false;
  context.beginPath(); 
};

const clearCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  allPoints = [];
};


const setBrushSize = (size) => {
  brushSize = size;
};


const setBrushColor = (color) => {
  currentColor = color;
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
    showBrushSizeModal(brushSize);
  }

  function showBrushSizeModal(size) {
    const modal = document.getElementById('brushSizeModal');
    const brushSizeText = document.getElementById('brushSizeText');
    brushSizeText.textContent = `Brush Size: ${size}`;
    
    modal.offsetHeight;
    
    modal.style.display = 'flex';
    modal.style.zIndex = 10;
    modal.style.opacity = 1;

    setTimeout(() => {
      modal.style.opacity = 0;
      setTimeout(() => {
        modal.style.display = 'none';
        modal.style.zIndex = -10;
      }, 500); 
    }, 2000);
  }
});