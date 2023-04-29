function planetOutiline(){ //on ajoute a l'array des tiles un cercle de 40px de rayon avec la tile g10 et le reste en void
    for (let i = 0; i < canvas.width; i += tileSize) {
      for (let j = 0; j < canvas.height; j += tileSize) {
        if (Math.sqrt(Math.pow(i - canvas.width/2, 2) + Math.pow(j - canvas.height/2, 2)) <= 350) {
          canvasArray[i/tileSize][j/tileSize] = "grass";
        } else {
          canvasArray[i/tileSize][j/tileSize] = "void";
        }
      }
    }
    //on enleève les 4 coins
    canvasArray[40][5] = "void";
    canvasArray[5][40] = "void";
    canvasArray[canvas.width/tileSize-40][5] = "void";
    canvasArray[canvas.width/tileSize-5][40] = "void";
    canvasArray[40][canvas.height/tileSize-5] = "void";
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
              canvasArray[i/tileSize][j/tileSize] = "water";
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
            canvasArray[i/tileSize][j/tileSize] = "grass";
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