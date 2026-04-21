let tree = [];
let pathStack = [];

function getCurrentFolder() {
  let node = { children: tree };
  for (let i of pathStack) {
    node = node.children[i];
  }
  return node;
}

function addNode() {
  const name = document.getElementById("name").value.trim();
  const type = document.getElementById("type").value;
  if (!name) return;

  let parent = getCurrentFolder();

  parent.children.push({
    name,
    type,
    children: type === "folder" ? [] : null
  });

  document.getElementById("name").value = "";
  render();
}

function enterFolder(index) {
  pathStack.push(index);
  render();
}

function goRoot() {
  pathStack = [];
  render();
}

function getPathString() {
  let node = { children: tree };
  let path = [];

  for (let i of pathStack) {
    node = node.children[i];
    path.push(node.name);
  }

  return path.length ? "/" + path.join("/") : "/ (root)";
}

function renderNode(nodes, depth = 0) {
  let container = document.createElement("div");

  nodes.forEach((node, i) => {
    let div = document.createElement("div");

    div.className = "node " + node.type;
    div.style.marginLeft = (depth * 20) + "px";

    div.textContent = (node.type === "folder" ? "📁 " : "📄 ") + node.name;

    if (node.type === "folder") {
      div.onclick = () => enterFolder(i);
    }

    container.appendChild(div);

    if (node.type === "folder" && node.children.length) {
      container.appendChild(renderNode(node.children, depth + 1));
    }
  });

  return container;
}

function render() {
  document.getElementById("currentPath").textContent =
    "Current folder: " + getPathString();

  let treeDiv = document.getElementById("tree");
  treeDiv.innerHTML = "";
  treeDiv.appendChild(renderNode(tree));
}

function exportASCII() {
  function build(nodes, depth = 0) {
    let result = "";

    for (let node of nodes) {
      result += "    ".repeat(depth) + node.name + "\n";

      if (node.type === "folder") {
        result += build(node.children, depth + 1);
      }
    }

    return result;
  }

  document.getElementById("asciiOut").textContent = build(tree);
}

render();
