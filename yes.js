const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");
const imageContainer = document.getElementById("image-container");
const divGrass = document.getElementById("grass");
const divWater = document.getElementById("water");
const divCliff = document.getElementById("cliff");
const divFlowers = document.getElementById("flower");
const sc = document.getElementsByClassName("s-container");
const fileInput = document.getElementById('gardenInput');

const tileSize = 10;
let currentImage = 0;
let hours = 0;
let filterValue = 'brightness(100%)';

let erase = false;
let noCycle = true;
let freezeTime = false;
let isGenerating = false;

let lastUndo = new Date();
let lastEdits = []
let hover = false;
let hoverX = 0;
let hoverY = 0;

let sizeOfCanvas = 80;


//on génère une seed entre 0 et 40
let seed = Math.floor(Math.random() * 40);

const imageFolder = "assets/tiles/";
const categories = {
                      'g': {name: "grass", number: 59, prefix: "g", container: divGrass},
                      'w': {name: "water", number: 57, prefix: "w", container: divWater},
                      'c': {name: "cliffs", number: 37, prefix: "c", container: divCliff},
                      'f': {name: "flowers", number: 8, prefix: "f", container: divFlowers}
};
let canvasArray = new Array(80).fill(0).map(() => new Array(80).fill("void"));

for (let prefix in categories) {
  let category = categories[prefix];
  category.images = new Array(category.number);
  for (let i = 0; i < category.number; i++) {
    const image = new Image();
    image.src = `${imageFolder}${category.name}/${prefix}${i}.png`;
    category.images[i] = image;

    image.addEventListener("click", () => {
      selectedImage = {img: image, tag: `${prefix}${i}`, category: category, number: i};
    });
    category.container.appendChild(image);
  }};

let selectedImage;
for (let i = 0; i < canvas.width; i += tileSize) {
  for (let j = 0; j < canvas.height; j += tileSize) {
    ctx.rect(i, j, tileSize, tileSize);
  }
}

function planetOutiline(){ //on ajoute a l'array des tiles un cercle de 40px de rayon avec la tile g10 et le reste en void
  for (let i = 0; i < canvas.width; i += tileSize) {
    for (let j = 0; j < canvas.height; j += tileSize) {
      if (Math.sqrt(Math.pow(i - canvas.width/2, 2) + Math.pow(j - canvas.height/2, 2)) <= 350) {
        canvasArray[i/tileSize][j/tileSize] = "g10";
      } else {
        canvasArray[i/tileSize][j/tileSize] = "void";
      }
    }
  }
}

function clearInteriorPlanet() { //on efface l'intérieur du cercle
  for (let i = 0; i < canvas.width; i += tileSize) {
    for (let j = 0; j < canvas.height; j += tileSize) {
      if (Math.sqrt(Math.pow(i - canvas.width/2, 2) + Math.pow(j - canvas.height/2, 2)) <= 340) {
        canvasArray[i/tileSize][j/tileSize] = "void";
      }
    }
  }
}

function procedurallyGeneratePlanet() {
  isGenerating = true;
  placeWater();
  placeDirt();
  
}

function placeWater() {
  const waterThreshold = 5; // the number of adjacent tiles required to change a tile to water
  const chanceToBecomeWater = 0.6; // the chance that a tile will become water if it meets the threshold
  const radius = 340; // the radius within which tiles can be changed
  // loop through each tile on the canvas
  for (let i = 0; i < canvas.width; i += tileSize) {
    for (let j = 0; j < canvas.height; j += tileSize) {
      // check if the tile is within the radius
      if (Math.sqrt(Math.pow(i - canvas.width/2, 2) + Math.pow(j - canvas.height/2, 2)) <= radius) {
        // check if the tile is empty
        if (canvasArray[i/tileSize][j/tileSize] == "void") {
          let adjacentTiles = 0;
          // loop through each adjacent tile
          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              // check if the adjacent tile is within the canvas boundaries and is the same type as the current tile
              if (i/tileSize+x >= 0 && i/tileSize+x < canvasArray.length && j/tileSize+y >= 0 && j/tileSize+y < canvasArray[0].length && canvasArray[i/tileSize+x][j/tileSize+y] == canvasArray[i/tileSize][j/tileSize]) {
                adjacentTiles++;
              }
            }
          }
          // check if the tile meets the threshold to become water
          if (adjacentTiles >= waterThreshold && Math.random() < chanceToBecomeWater) {
            canvasArray[i/tileSize][j/tileSize] = "w49";
          }
        }
      }
    }
  }
  // loop through each tile on the canvas, and delete any water tiles that is not adjacent to 2 or more water tiles
  for (let i = 0; i < canvas.width; i += tileSize) {
    for (let j = 0; j < canvas.height; j += tileSize) {
      // check if the tile is within the radius
      if (Math.sqrt(Math.pow(i - canvas.width/2, 2) + Math.pow(j - canvas.height/2, 2)) <= radius) {
        // check if the tile is empty
        if (canvasArray[i/tileSize][j/tileSize].startsWith("w")) {
          let adjacentWaterTiles = 0;
          // loop through each adjacent tile
          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              // check if the adjacent tile is within the canvas boundaries and is the same type as the current tile
              if (i/tileSize+x >= 0 && i/tileSize+x < canvasArray.length && j/tileSize+y >= 0 && j/tileSize+y < canvasArray[0].length && canvasArray[i/tileSize+x][j/tileSize+y].startsWith("w")) {
                adjacentWaterTiles++;
              }
            }
          }
          // check if the tile meets the threshold to become water
          if (adjacentWaterTiles < 5) {
            canvasArray[i/tileSize][j/tileSize] = "void";
          }
        }
      }
    }
  }
}

function placeDirt() {
  //on pose simplement de la dirt sur les tiles void, à l'intérieur du cercle
  for (let i = 0; i < canvas.width; i += tileSize) {
    for (let j = 0; j < canvas.height; j += tileSize) {
      if (Math.sqrt(Math.pow(i - canvas.width/2, 2) + Math.pow(j - canvas.height/2, 2)) <= 340) {
        if (canvasArray[i/tileSize][j/tileSize] == "void") {
          canvasArray[i/tileSize][j/tileSize] = "g48";
        }
      }
    }
  }
}



function getAdjacentTiles(x, y) {
  const adjacentTiles = [];
  
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i === x && j === y) continue; // ignore current tile
      if (i < 0 || i >= canvasArray.length || j < 0 || j >= canvasArray[0].length) continue; // ignore tiles outside canvas
      adjacentTiles.push(canvasArray[i][j]);
    }
  }
  
  return adjacentTiles;
}

  


planetOutiline();
clearInteriorPlanet();
procedurallyGeneratePlanet();



canvas.addEventListener("click", (event) => {
  let i = Math.floor(event.offsetX / tileSize);
  let j = Math.floor(event.offsetY / tileSize);
  let x = i * tileSize;
  let y = j * tileSize;
  if (erase) { //on ne pose pas d'image, on efface
    lastEdits.push({i, j, prevImg: canvasArray[i][j]})
    canvasArray[i][j] = "void";
  } else if(selectedImage) {
    lastEdits.push({i, j, prevImg: canvasArray[i][j]})
    canvasArray[i][j] = selectedImage.tag;
  }
});

canvas.addEventListener("mousemove", (event) => {
  hoverX = Math.floor(event.offsetX / tileSize);
  hoverY = Math.floor(event.offsetY / tileSize);
  hover = true;
});

canvas.addEventListener("mouseout", (event) => {
  hover = false;
});

function undo() {
  if ((new Date() - lastUndo) < 30) return;
  lastUndo = new Date();

  if (lastEdits.length == 0) return;
  console.dir(lastEdits)

  let lastEdit = lastEdits.pop();

  canvasArray[lastEdit.i][lastEdit.j] = lastEdit.prevImg;
}

//on met les fonctions des boutons ici
function changeSize() {
  let newHeight = document.getElementById("height").value;
  let newWidth = document.getElementById("width").value;
  canvas.width = newHeight*tileSize;
  canvas.height = newWidth*tileSize;
  canvasArray = new Array(canvas.width/tileSize).fill(0).map(() => new Array(canvas.height/tileSize).fill("void"));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < canvas.width; i += tileSize) {
    for (let j = 0; j < canvas.height; j += tileSize) {
      ctx.rect(i, j, tileSize, tileSize);
    }
  }
}

function clearButton() {
  //on demande confirmation
  if (confirm("Voulez-vous vraiment tout effacer ?")) {
  canvasArray = new Array(10).fill(0).map(() => new Array(10).fill("void"));
  }
}

function eraserButton() {
  if(erase) { //si on est déjà en mode gomme, on désactive
    erase = false;
    //on remet la couleur du bouton à la normale
    document.getElementById("eraser").style.backgroundColor = "white";
  } else { //sinon on active le mode gomme
    selectedImage = null;
    erase = true;
    document.getElementById("eraser").style.backgroundColor = "red";
  }
}

function saveButton() {
  setTimeout(() => {
    const dataURL = canvas.toDataURL('image/png')
    const downloadLink = document.createElement('a');
    //on demande le nom du fichier
    let filenamepng = prompt("Name of your creation :");
    filenamepng = filenamepng + ".png";
    downloadLink.href = dataURL;
    downloadLink.download = filenamepng;
    downloadLink.click();
  }, 800);
}

function gitButton() {
  window.open("https://github.com/Claquettes/garden");
}

function cycleButton() {
  if(noCycle) {
    noCycle = false;
  } else {
    noCycle = true;
  }
  console.log(noCycle)
}

function freezeTimeButton() {
  if(freezeTime) {
    freezeTime = false;
  } else {
    freezeTime = true;
  }
  console.log(freezeTime)
}

function exportButton(){ //we export the canvas as a json file
  console.dir(canvasArray)
    let data = [];
    //for each tile, we get the image source and the position

    canvasArray.forEach((row, i) => {
      row.forEach((tile, j) => {
        console.log(canvasArray[i][j])
        let imgTag = canvasArray[i][j];
        data.push({imgTag, i, j});
      })
    });
    let json = JSON.stringify({width: canvas.width/tileSize, height: canvas.height/tileSize, tiles: data});
    //we create a json file
    let blob = new Blob([json], {type: "application/json"});
    let url  = URL.createObjectURL(blob);
    //we download the file
    let a = document.createElement('a');
    //on met le nom du fichier, en ajoutant l'heure et la date
    let filename = prompt("Name of your creation :");
    filename += ".json";
    a.download    = filename;
    a.href        = url;
    a.textContent = "Download file";
    a.click();
}

//we import a json file in the "gardenInput" input
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  
  console.log('Selected file:', file);
  //when we select a file, we read it, and then we draw the images on the canvas
  const reader = new FileReader();
  reader.onload = (event) => {
    const json = JSON.parse(event.target.result);
    let height = json["height"];
    let width = json["width"];
    canvas.width = height*tileSize;
    canvas.height = width*tileSize;
    canvasArray = new Array(canvas.width/tileSize).fill(0).map(() => new Array(canvas.height/tileSize).fill("void"));
    json["tiles"].forEach((tile) => {
      let imgTag = tile.imgTag;
      let i = tile.i;
      let j = tile.j;

      if (imgTag == "void") {
        canvasArray[i][j] = "void";
      } else {
        let category = categories[imgTag[0]];
        console.log(category)
        let number = parseInt(imgTag.slice(1));
        canvasArray[i][j] = imgTag;
      }
    });
  };
  reader.readAsText(file);
  fileInput.value = "";
});
    


//on appelle la fonction cycle tous les 1000ms  
setInterval(cycle, 5000);

function cycle() {
  if (!freezeTime) {
    hours += 0.1;
    hours = hours % 24;
  } else {
    hours = document.getElementById("hourSlide").value/10;
  }
  const brightness = (2/3+Math.sin(3.14/24*hours)/3)*100;
  if (15<=hours && hours<=21) {
    filterValue = `brightness(${brightness}%) sepia(${(0.3+Math.sin(hours+2)/5)*100}%)`;
  } else {
    filterValue = `brightness(${brightness}%)`;
  }
  console.log(hours);
}

function keyDownHandler(e) {
  if(e.key == "Shift") {
    erase = true;
    document.getElementById("eraser").style.backgroundColor = "red";
  } else if (e.keyCode == 90 && e.ctrlKey) {
    undo();
  }
}

function keyUpHandler(e) {
  if(e.key == "Shift") {
    erase = false;
    document.getElementById("eraser").style.backgroundColor = "white";
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = filterValue;
  if(noCycle) {
    ctx.filter = "brightness(100%)";
  }
  canvasArray.forEach((row, i) => {
    row.forEach((tile, j) => {
      let imgTag = canvasArray[i][j];
      if (imgTag == "void") {
        ctx.clearRect(i*tileSize, j*tileSize, tileSize, tileSize);
      } else {
        let category = categories[imgTag[0]];
        let number = parseInt(imgTag.slice(1));
        ctx.drawImage(category.images[number], i*tileSize, j*tileSize, tileSize, tileSize);
      }
    })
  });

  if (hover) {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    let rect = ctx.strokeRect(hoverX*tileSize, hoverY*tileSize, tileSize, tileSize);
    console.log(hoverX, hoverY)
  }


  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
