

let populationUpdateForThisTickLIMIT = 20;
let populationUpdateForThisTick = 0;

function onTick(){
    console.log("tick");
    let  = 0;
    let population = 0;
    let adjacentPopulation = 0;
    let adjacentGrass = 0;
    let adjacentWater = 0;
    let adjacentMountain = 0;
    //we loop through all the population tiles
    for (let i = 0; i < canvasArray.length; i++) {
        for (let j = 0; j < canvasArray[i].length; j++) {
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
    //RULES FOR THE POPULATION:
    //1) Population growth: If a population is adjacent to at least 2 squares of grass, it will grow by 1 square every turn. If it is not adjacent to at least 2 squares of grass, it will not grow.
    //2) Population decline: If a population is adjacent to at least 2 squares of dangerous mountains, it will decrease by 1 square every turn. If it is not adjacent to at least 2 squares of dangerous mountains, it will not decrease.
    //3) Water dependence: If a population is not adjacent to at least 1 square of water, it will decrease by 1 square every turn.
    //4) Migration: If a population is not adjacent to at least 2 squares of grass, it will migrate to a nearby square of grass at a rate of 1 square per turn.
//---------------
    if (adjacentGrass >= 2 && populationUpdateForThisTick < populationUpdateForThisTickLIMIT) { //growth of the population, we add a population tile on a grass tile next to the population tile
        if (i > 0 && canvasArray[i-1][j] == "grass") {
            canvasArray[i-1][j] = "population";
            populationUpdateForThisTick++;
        }
        else if (i < canvasArray.length - 1 && canvasArray[i+1][j] == "grass") {
            canvasArray[i+1][j] = "population";
            populationUpdateForThisTick++;
        }
        else if (j > 0 && canvasArray[i][j-1] == "grass") {
            canvasArray[i][j-1] = "population";
            populationUpdateForThisTick++;
        }
    }
}