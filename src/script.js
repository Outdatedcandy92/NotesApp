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