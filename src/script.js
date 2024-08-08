document.addEventListener('DOMContentLoaded', () => {
  const penIcon = document.querySelector('.Pen .fa-pen');
  const dropdownMenu = document.querySelector('.Pen .dropdown-menu');
  const brushPlus = document.getElementById('Brush-plus');
  const brushMinus = document.getElementById('Brush-minus');
  const highlighterButton = document.getElementById('highlighter-btn');
  const highlighterDropdownMenu = document.querySelector('.Highlighter .highlighter-dropdown');
  const highlighterPlus = document.getElementById('Highlighter-plus');
  const highlighterMinus = document.getElementById('Highlighter-minus');

  let holdTimeout;

  highlighterButton.addEventListener('click', () => {
    highlighter();
  });

  highlighterButton.addEventListener('mousedown', (event) => {
    event.stopPropagation();
    holdTimeout = setTimeout(() => toggleDropdown(highlighterDropdownMenu), 500); // added hold functionality
  });

  highlighterButton.addEventListener('mouseup', (event) => {
    event.stopPropagation();
    clearTimeout(holdTimeout);
  });

  highlighterButton.addEventListener('mouseleave', (event) => {
    event.stopPropagation();
    clearTimeout(holdTimeout);
  });

  penIcon.addEventListener('mousedown', (event) => {
    event.stopPropagation();
    holdTimeout = setTimeout(() => toggleDropdown(dropdownMenu), 500); // added hold functionality
  });

  penIcon.addEventListener('mouseup', (event) => {
    event.stopPropagation();
    clearTimeout(holdTimeout);
  });

  penIcon.addEventListener('mouseleave', (event) => {
    event.stopPropagation();
    clearTimeout(holdTimeout);
  });

  penIcon.addEventListener('click', () => {
    pen();
  });

  brushPlus.addEventListener('click', () => {
    changeBrushSize(1);
  });

  brushMinus.addEventListener('click', () => {
    changeBrushSize(-1);
  });

  highlighterPlus.addEventListener('click', () => {
    changeBrushSize(1);
  });

  highlighterMinus.addEventListener('click', () => {
    changeBrushSize(1);
  });

  function toggleDropdown(menu) {
    const isVisible = menu.classList.contains('show');

    if (isVisible) {
      menu.classList.remove('show');
      setTimeout(() => {
        menu.style.display = 'none';
      }, 300);
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    } else {
      menu.style.display = 'block';
      setTimeout(() => {
        menu.classList.add('show');
      }, 10);
      document.addEventListener('mousedown', handleOutsideInteraction);
      document.addEventListener('touchstart', handleOutsideInteraction);
    }
  }

  function handleOutsideInteraction(event) {
    if (!dropdownMenu.contains(event.target) && !penIcon.contains(event.target) && !highlighterButton.contains(event.target) && !highlighterDropdownMenu.contains(event.target)) {
      toggleDropdown(dropdownMenu);
      toggleDropdown(highlighterDropdownMenu);
    }
  }

  function changeBrushSize(delta) {
    brushSize = Math.max(1, brushSize + delta);
    console.log(`Brush size changed to: ${brushSize}`);
    setBrushSize(brushSize);
    showBrushSizeModal(brushSize);
  }

  function changeHighlighterSize(delta) {
    highlighterSize = Math.max(1, highlighterSize + delta);
    console.log(`Highlighter size changed to: ${highlighterSize}`);
    setHighlighterSize(highlighterSize);
    showHighlighterSizeModal(highlighterSize);
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

  function showHighlighterSizeModal(size) {
    const modal = document.getElementById('highlighterSizeModal');
    const highlighterSizeText = document.getElementById('highlighterSizeText');
    highlighterSizeText.textContent = `Highlighter Size: ${size}`;
    
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