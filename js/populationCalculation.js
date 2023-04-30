
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
    if (adjacentWater < 1) {
        canvasArray[i][j] = "grass";
        return;
    }
    //rule 2
    if (adjacentGrass == 2 || adjacentGrass == 3) {
        if (Math.random()<0.25){
            if (i > 0 && canvasArray[i-1][j] == "grass") {
                canvasArray[i-1][j] = "population";
                return;
            }
            else if (i < canvasArray.length - 1 && canvasArray[i+1][j] == "grass") {
                canvasArray[i+1][j] = "population";
                return;
            }
        } else if (Math.random()<0.5){
            if (j > 0 && canvasArray[i][j-1] == "grass") {
                canvasArray[i][j-1] = "population";
                return;
            }
            else if (j < canvasArray[i].length - 1 && canvasArray[i][j+1] == "grass") {
                canvasArray[i][j+1] = "population";
                return;
            }
        }
    }
    //rule 3
    if (adjacentPopulation > 3) {
        canvasArray[i][j] = "grass";
        return;
    }
    //rule 4
    if (adjacentPopulation == 2 || adjacentPopulation == 3) {
        return;
    }


    //rule 5
    if (adjacentGrass == 1 && adjacentWater == 1) {
        canvasArray[i][j] = "city";
        return;
    }

    //if none of the rules apply, the tile stays the same
    if (adjacentPopulation == 0)
        canvasArray[i][j] = "population";
    return;

}

   
