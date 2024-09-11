// THE CULPRITS

var domTree = document.getElementById("dom-tree");
var page = document.getElementById("page");
var highlight = document.getElementById("highlight");



// THE CREATION OF THE DOM TREE LOGIC

function createDomTree() {
  domTree.innerHTML = "";

  function walkElement(element, indent = 0) {
    domTree.appendChild(document.createTextNode("  ".repeat(indent)));

    var span = document.createElement("span");
    span.textContent = "<" + element.tagName.toLowerCase() + ">";
    span.attachedElement = element;
    element.attachedDomTreeElement = span;
    span.className = "dom-element";
    domTree.appendChild(span);

    domTree.appendChild(document.createTextNode("\n"));

    for (let child of element.children) {
      walkElement(child, indent + 1);
    }
  }

  walkElement(page);
}



// THE HIGHLIGHTING LOGIC

let currentlyHighlightedItem = null;

function highlightElement(element, domTreeElement) {
  if (currentlyHighlightedItem == element)
    return;

  let rect = element.getBoundingClientRect();

  highlight.style.left = rect.x + "px";
  highlight.style.top = rect.y + "px";
  highlight.style.width = rect.width + "px";
  highlight.style.height = rect.height + "px";

  page.appendChild(highlight);
  
  let selectedDomTreeElement = document.querySelector(".dom-element.selected");
  if(selectedDomTreeElement) {
  	selectedDomTreeElement.classList.remove("selected");
  }
  domTreeElement.classList.add("selected");

  currentlyHighlightedItem = element;
}



// EVENTS

// on the dom tree elements

domTree.addEventListener("mousemove", function(e) {
  let target = e.target;
  if (target.classList.contains("dom-element")) {
    highlightElement(target.attachedElement, target);
  }
  // const cssPath = getCssPath(target);
  // console.log(cssPath)
}, true);

domTree.addEventListener("mouseleave", function(e) {
  highlight.remove();
  currentlyHighlightedItem = null;
  let selectedDomTreeElement = document.querySelector(".dom-element.selected");
  const cssPath = getCssPath(selectedDomTreeElement);
  console.log(cssPath)
  if(selectedDomTreeElement) {
  	selectedDomTreeElement.classList.remove("selected");
  }
});

// on the page itself

page.addEventListener("click", function(e) {
  let target = e.target;
  if (target.attachedDomTreeElement) {
    highlightElement(target, target.attachedDomTreeElement);
  }
  const cssPath = getCssPath(target);
  console.log(cssPath)
}, true);

page.addEventListener("mousemove", function(e) {
  let target = e.target;
  if (target.attachedDomTreeElement) {
    highlightElement(target, target.attachedDomTreeElement);
  }
  // const cssPath = getCssPath(target);
  // console.log(cssPath)
}, true);

page.addEventListener("mouseleave", function(e) {
  highlight.remove();
  currentlyHighlightedItem = null;
  let selectedDomTreeElement = document.querySelector(".dom-element.selected");
  const cssPath = getCssPath(selectedDomTreeElement);
  console.log(cssPath)
  if(selectedDomTreeElement) {
  	selectedDomTreeElement.classList.remove("selected");
  }
});

// BOOTSTRAP

createDomTree();

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
