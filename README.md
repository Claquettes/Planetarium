![Language](https://img.shields.io/github/languages/count/AuttgamesTeam/Autt-Garden)
![Licence](https://img.shields.io/github/license/AuttgamesTeam/Autt-Garden)
# Planetarium
A 0 player game where you can place 5 populations tiles on a randomly generated planet. The goal is to create a planet with a maximum of population. The population need water and grass to grow. The project started in april 2023 by [@Claquettes](https://github.com/Claquettes).

## Getting Started
### How to play:

- Open the game in your browser by clicking [here](https://claquettes.github.io/Planetarium/).
- Click on a grass tile on the planet to place a population tile. If there is no water near the tile, the population will die.
- Place 5 population tiles on the planet, and watch them grow.
- The game is over when you have placed 5 population tiles, and the score is the pourcentage of the planet covered by population tiles !

### Terrain generation:
- Randomly generated planet, with realistic water and grass distribution.
- Sand tiles near water tiles. They can't be used to place population tile and population can't grow on them.
- Mountain that spawn with realistic distribution. They can't be used to place population tile and population can't grow on them. 

### Population growth:
- Population can only grow on grass tiles.
- Population dies if there is no water near the tile, or at least 2 adjacent population tiles.
- Population dies if there is 3 adjacent population and if there is no water near the tile.
- Population will generate 2 adjacent population tiles if there is exactly 2 adjacent population tiles.
- Else population will generate 1 adjacent population tile, in a random direction.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
