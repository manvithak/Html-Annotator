const annotationContainer = document.getElementById('annotation-container');

let startX, startY, isDrawing = false, currentBox, commentBox, targetElement;

console.log("here")

// Function to get the full CSS path of the target element
function getCssPath(element) {
  if (element.tagName === 'HTML') return 'HTML';
  if (element === document.body) return 'BODY';

  const path = [];
  while (element.parentElement) {
    let selector = element.tagName.toLowerCase();
    if (element.id) {
      selector += `#${element.id}`;
    } else {
      let sib = element, nth = 1;
      while (sib.previousElementSibling) {
        sib = sib.previousElementSibling;
        if (sib.tagName.toLowerCase() === selector) nth++;
      }
      if (nth !== 1) selector += `:nth-of-type(${nth})`;
    }
    path.unshift(selector);
    element = element.parentElement;
  }
  return path.join(' > ');
}

// Function to get the full XPath of the target element
function getXPath(element) {
  if (element.id) return `//*[@id="${element.id}"]`;

  const parts = [];
  while (element && element.nodeType === Node.ELEMENT_NODE) {
    let sibling = element;
    let index = 1;
    while (sibling.previousElementSibling) {
      sibling = sibling.previousElementSibling;
      if (sibling.nodeName === element.nodeName) index++;
    }
    const tagName = element.nodeName.toLowerCase();
    const pathIndex = index > 1 ? `[${index}]` : '';
    parts.unshift(`${tagName}${pathIndex}`);
    element = element.parentNode;
  }
  return parts.length ? `/${parts.join('/')}` : null;
}

// Mouse down event to start drawing
annotationContainer.addEventListener('mousedown', (e) => {
  startX = e.pageX;
  startY = e.pageY;
  isDrawing = true;

  // Capture the element where the annotation is created
  targetElement = document.elementFromPoint(e.clientX, e.clientY);

  // Log CSS Path and XPath
  const cssPath = getCssPath(targetElement);
  const xpath = getXPath(targetElement);
  console.log("CSS Path:", cssPath);
  console.log("XPath:", xpath);

  // Create the rectangle box
  currentBox = document.createElement('div');
  currentBox.className = 'annotation-box';
  currentBox.style.left = `${startX}px`;
  currentBox.style.top = `${startY}px`;
  annotationContainer.appendChild(currentBox);
});

// Mouse move event to resize the box
annotationContainer.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;

  const width = e.pageX - startX;
  const height = e.pageY - startY;
  currentBox.style.width = `${width}px`;
  currentBox.style.height = `${height}px`;
});

// Mouse up event to stop drawing and prompt for a comment
annotationContainer.addEventListener('mouseup', (e) => {
  isDrawing = false;

  // Ask for a comment
  const comment = prompt("Add a comment for this annotation:");
  if (comment) {
    // Get CSS Path and XPath again in case the element changed during the drawing
    const cssPath = getCssPath(targetElement);
    const xpath = getXPath(targetElement);

    // Create a comment box near the annotation
    commentBox = document.createElement('div');
    commentBox.className = 'annotation-comment';
    commentBox.style.left = `${startX}px`;
    commentBox.style.top = `${startY + parseInt(currentBox.style.height) + 5}px`;
    commentBox.innerText = `${comment}\n(CSS Path: ${cssPath})\n(XPath: ${xpath})`;
    annotationContainer.appendChild(commentBox);
  } else {
    annotationContainer.removeChild(currentBox); // Remove if no comment
  }
});
