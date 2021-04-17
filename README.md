# A* pathfinding algorithm 

![A* pathfinding algorithm found a path !](https://raw.githubusercontent.com/Sulay35/Astar-pathfinding/main/images/illustration.PNG)

**[try it live](https://sulay35.github.io/Astar-pathfinding/)**

### Program:
This website works with the library [p5.js](https://p5js.org), it allows you to create a grid with a given number of rows and columns and size of each cell 
of the grid. You can draw on the grid walkable tile, obstacles, point A and B. Then by pressing space, the A* algorithm implemented will run 
and find the best path to link point A and B. 

#### Features : 
You can generate a random grid with obstacles, it works even if you have already gave point A and B, it will keep them  but it is going to reset the grid.

### Grid drawing system: 
You can draw on a grid which will be processed by the chosen algorithm. It make the link between user interface and array. This can be used as a base for ulterior projects.

---

### How to use it: 
Firstly, the user has a grid canvas, he can draw: a walkable tile, a obstacle, a point A and B. These can be chosen by pressing on the 
keys 1 to 4 of the keyboard or by scrolling with the _mouse wheel_ .
He is able to reset the grid by pressing _R_ key and use the walkable tile as an eraser when drawing.
Then by pressing the _SPACE BAR_ he let the algorithm run on the grid he set up.
To hide the tool bar, press _M_.
**Warning**: Point A and B are mandatory for the algorithm to work.

Once the algorithm finished to processed, clicking on the _RESET_ button will set the drawing back.

_[More info about the algorithm](https://fr.wikipedia.org/wiki/Algorithme_A*)_
