const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");
const imageContainer = document.getElementById("image-container");
const divGrass = document.getElementById("grass");
const divWater = document.getElementById("water");
const divCliff = document.getElementById("cliff");
const divFlowers = document.getElementById("flower");
const sc = document.getElementsByClassName("s-container");
const fileInput = document.getElementById('gardenInput');

const grassColor = '#a6da95';
const waterColor = '#91d7e3';
const voidColor = '#363a4f';
const glowColor = '#939ab7';
const mountainColor = '#a5adcb';
const highMountainColor = '#cad3f5';
const sandColor = '#f7e1b2';
const populationColor = '#ed8796';

const tileSize = 10;
let currentImage = 0;
let hours = 0;
let filterValue = 'brightness(100%)';

let erase = false;
let noCycle = true;
let freezeTime = false;
let isGenerating = false;

let currentChoice = "null";

let lastUndo = new Date();
let lastEdits = []
let hover = false;
let hoverX = 0;
let hoverY = 0;

let sizeOfCanvas = 60;

let categories = ["grass", "water", "glow", "void", "mountain", "highMountain", "sand"];

//on génère une seed entre 0 et 40
let seed = Math.floor(Math.random() * 40);

let canvasArray = new Array(60).fill(0).map(() => new Array(60).fill("void"));

let selectedImage;
for (let i = 0; i < canvas.width; i += tileSize) {
  for (let j = 0; j < canvas.height; j += tileSize) {
    ctx.rect(i, j, tileSize, tileSize);
  }
}

function GeneratePlanet() {
  isGenerating = true;
  planetOutiline(); //shape and glow 
  clearInteriorPlanet();
  placeWater();
  placeDirt();
 isGenerating = false; 
}

GeneratePlanet();

function addPopulation(){
  currentChoice = "population";
}
canvas.addEventListener("click", (event) => {
  let i = Math.floor(event.offsetX / tileSize);
  let j = Math.floor(event.offsetY / tileSize);
  let x = i * tileSize;
  let y = j * tileSize;
  if (erase) { //on ne pose pas d'image, on efface
    lastEdits.push({i, j, prevImg: canvasArray[i][j]})
    canvasArray[i][j] = "void";
  } else if(selectedImage != "null") {
    canvasArray[i][j] = currentChoice;
    console.log(currentChoice);
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
  //we call the function qui calcule les populations
  onTick();

  ctx.filter = filterValue;
  if(noCycle) {
    ctx.filter = "brightness(100%)";
  }
  canvasArray.forEach((row, i) => {
    row.forEach((tile, j) => {
      let imgTag = canvasArray[i][j];
      if (imgTag == "void") {
        ctx.fillStyle = voidColor;
        ctx.fillRect(i*tileSize, j*tileSize, tileSize, tileSize);
        
      } 
      else if(imgTag == "grass"){
        //on prends la couleur verte
        ctx.fillStyle = grassColor;
        ctx.fillRect(i*tileSize, j*tileSize, tileSize, tileSize);
      } 
      else if(imgTag == "water"){
        //on prends la couleur bleue
        ctx.fillStyle = waterColor;
        ctx.fillRect(i*tileSize, j*tileSize, tileSize, tileSize);
      }
      else if(imgTag == "glow"){
        ctx.fillStyle = glowColor;
        ctx.fillRect(i*tileSize, j*tileSize, tileSize, tileSize);
      }
      else if(imgTag == "mountain"){
        ctx.fillStyle = mountainColor;
        ctx.fillRect(i*tileSize, j*tileSize, tileSize, tileSize);
      }
      else if(imgTag == "highMountain"){
        ctx.fillStyle = highMountainColor;
        ctx.fillRect(i*tileSize, j*tileSize, tileSize, tileSize);
      }
      else if(imgTag == "sand"){
        ctx.fillStyle = sandColor;
        ctx.fillRect(i*tileSize, j*tileSize, tileSize, tileSize);
      }
      else if(imgTag == "population"){
        ctx.fillStyle = populationColor;
        ctx.fillRect(i*tileSize, j*tileSize, tileSize, tileSize);
      }
    })
  });

  if (hover) {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    let rect = ctx.strokeRect(hoverX*tileSize, hoverY*tileSize, tileSize, tileSize);
    console.log(hoverX, hoverY)
  }
  //on definit une pause de 10ms entre chaque frame
  setTimeout(() => {
    onTick
    requestAnimationFrame(draw);

  }, 350);
}

draw();