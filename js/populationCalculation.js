function onTick(){
    let  = 0;
    let population = 0;
    let adjacentPopulation = 0;
    let adjacentGrass = 0;
    let adjacentWater = 0;
    let adjacentMountain = 0;
    //we loop through all the population tiles
    for (let i = 0; i < canvasArray.length; i++) {
        for (let j = 0; j < canvasArray[i].length; j++) {
            let population = 0;
            let adjacentPopulation = 0;
            let adjacentGrass = 0;
            let adjacentWater = 0;
            let adjacentMountain = 0;
            
            if (canvasArray[i][j] == "population") {
                population++;
                //we check if there is a grass tile next to the population tile
                if (i > 0 && canvasArray[i-1][j] == "grass") {
                    adjacentGrass++;
                }
                if (i < canvasArray.length - 1 && canvasArray[i+1][j] == "grass") {
                    adjacentGrass++;
                }
                if (j > 0 && canvasArray[i][j-1] == "grass") {
                    adjacentGrass++;
                }
                if (j < canvasArray[i].length - 1 && canvasArray[i][j+1] == "grass") {
                    adjacentGrass++;
                }
                //we check if there is a water tile next to the population tile
                if (i > 0 && canvasArray[i-1][j] == "water") {
                    adjacentWater++;
                }
                if (i < canvasArray.length - 1 && canvasArray[i+1][j] == "water") {
                    adjacentWater++;
                }
                if (j > 0 && canvasArray[i][j-1] == "water") {
                    adjacentWater++;
                }
                if (j < canvasArray[i].length - 1 && canvasArray[i][j+1] == "water") {
                    adjacentWater++;
                }
                //we check if there is a mountain tile next to the population tile
                if (i > 0 && canvasArray[i-1][j] == "mountain") {
                    adjacentMountain++;
                }
                if (i < canvasArray.length - 1 && canvasArray[i+1][j] == "mountain") {
                    adjacentMountain++;
                }
                if (j > 0 && canvasArray[i][j-1] == "mountain") {
                    adjacentMountain++;
                }
                if (j < canvasArray[i].length - 1 && canvasArray[i][j+1] == "mountain") {
                    adjacentMountain++;
                }
                //we check if there is a population tile next to the population tile
                if (i > 0 && canvasArray[i-1][j] == "population") {
                    adjacentPopulation++;
                }
                if (i < canvasArray.length - 1 && canvasArray[i+1][j] == "population") {
                    adjacentPopulation++;
                }
                if (j > 0 && canvasArray[i][j-1] == "population") {
                    adjacentPopulation++;
                }
                if (j < canvasArray[i].length - 1 && canvasArray[i][j+1] == "population") {
                    adjacentPopulation++;
                }
                //we call the function that will change the tile, giving it the number of adjacent grass tiles
                changeTilePopulation(i, j, adjacentGrass, adjacentWater, adjacentMountain, adjacentPopulation);
            }
        }
    }
}

function changeTilePopulation(i, j, adjacentGrass, adjacentWater, adjacentMountain, adjacentPopulation) {
    //There are 4 rules:
    //1. Any live cell with fewer than 1 water tile dies (underpopulation)
    //2. Any live cell with 2 or 3 adjacent grass tiles lives on to the next generation, and will have 1 more population tile in a random adjacent tile (survival)
    //3. Any live cell with more than 3 adjacent population tiles dies (overpopulation)
    //4. Any live cell with 2 or 3 adjacent population tiles lives on to the next generation (survival)
    //5. Any live cell with 1 grass tile and 1 water tile produce a city tile
    //we already know that the tile is a population tile, so we only need to check the rules
    //rule 1
    if (adjacentWater < 1 && adjacentPopulation < 2) {
        canvasArray[i][j] = "grass";
        return;
    }
    //rule 3
    else if (adjacentPopulation > 3 && adjacentWater ) {
        canvasArray[i][j] = "grass";
        return;
    }
    else {
        addPopulationOnARandomTile(i, j);
    }
    if(adjacentPopulation == 2 || adjacentPopulation == 0){
        addPopulationOnARandomTile(i, j);
    }
}

function addPopulationOnARandomTile(i, j){
    //we create an array with all the possible tiles where we can add a population tile
    let possibleTiles = [];
    if (i > 0 && canvasArray[i-1][j] == "grass") {
        possibleTiles.push("up");
    }
    if (i < canvasArray.length - 1 && canvasArray[i+1][j] == "grass") {
        possibleTiles.push("down");
    }
    if (j > 0 && canvasArray[i][j-1] == "grass") {
        possibleTiles.push("left");
    }
    if (j < canvasArray[i].length - 1 && canvasArray[i][j+1] == "grass") {
        possibleTiles.push("right");
    }
    //now we choose a random tile from the array
    let randomTile = possibleTiles[Math.floor(Math.random() * possibleTiles.length)];
    //and we add a population tile on that tile
    if (randomTile == "up") {
        canvasArray[i-1][j] = "population";
    }
    if (randomTile == "down") {
        canvasArray[i+1][j] = "population";
    }
    if (randomTile == "left") {
        canvasArray[i][j-1] = "population";
    }
    if (randomTile == "right") {
        canvasArray[i][j+1] = "population";
    }
}
   
function calculateScore(){
    let score = 0;
    let numberOfTiles = 0;
    for (let i = 0; i < canvasArray.length; i++) {
        for (let j = 0; j < canvasArray[i].length; j++) {
            if (canvasArray[i][j] !== "void") {
                numberOfTiles++;
            }
            if (canvasArray[i][j] == "population") {
                score++;
            }
        }
    }
    //The result is the number of population tiles divided by the total number of tiles
    score = score / numberOfTiles * 100;
    //we round the result to 2 decimals
    score = Math.round(score * 100) / 100;
    return score;
}