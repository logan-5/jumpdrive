///////////////////////////////////////////////////////////////////////////////////
// collision engine
// the collision system is a grid with squares of size MAX_CIRCLE_SIZE

// collision variables
Game.collisionGrid = [];
var GRID_SIZE_X = 0; // calculated dynamically based on SCREEN_SIZE_X and stored for later
var GRID_SIZE_Y = 0;
var arrayEmpty = [];
var squares; // for housekeeping, coordinates of all squares around current square
var collisionChecks = []; // store the indices of entities that want to be checked
var GridSquare = function() {
	this.entities = new Array();
}
GridSquare.prototype.empty = function() { return this.entities.length < 1; };

// circles are allowed to be, at the closest, half a radius from the screen edge
function enforce_boundary(entity) {
	entity.x = Math.min(SCREEN_SIZE_X - MIN_CIRCLE_SIZE/2, Math.max(entity.x, MIN_CIRCLE_SIZE/2));
	entity.y = Math.min(SCREEN_SIZE_Y - MIN_CIRCLE_SIZE/2, Math.max(entity.y, MIN_CIRCLE_SIZE/2));
}

// build the collision grid based on screen size and circle size
function initCollisionGrid() {
	// if the screen size divides evenly into squares, do that
	// otherwise still do that but add extra rows of overflow
	GRID_SIZE_X = SCREEN_SIZE_X % (MAX_CIRCLE_SIZE*2) == 0 ? 
					SCREEN_SIZE_X / (MAX_CIRCLE_SIZE*2) : Math.trunc(SCREEN_SIZE_X / (MAX_CIRCLE_SIZE*2)) + 1; 
    GRID_SIZE_Y = SCREEN_SIZE_Y % (MAX_CIRCLE_SIZE*2) == 0 ? 
					SCREEN_SIZE_Y / (MAX_CIRCLE_SIZE*2) : Math.trunc(SCREEN_SIZE_Y / (MAX_CIRCLE_SIZE*2)) + 1;

	for(var i = 0; i < GRID_SIZE_X; i++) {
		
		Game.collisionGrid.push(new Array(GRID_SIZE_Y));
		for(var j = 0; j < GRID_SIZE_Y; j++) { 
			Game.collisionGrid[i][j] = (new GridSquare());
		}
	}
}

function addToCollisionGrid(entity) {
        var gridX = 0;
        var gridY = 0;
        
        // our current square is:
        gridX = Math.min(Math.max(Math.trunc(entity.x / (MAX_CIRCLE_SIZE*2)), 0), GRID_SIZE_X);
        gridY = Math.min(Math.max(Math.trunc(entity.y / (MAX_CIRCLE_SIZE*2)), 0), GRID_SIZE_Y);
        
        //console.log(gridX+", "+gridY);
        // remove the old us from the grid if we are there
        if(Game.collisionGrid[entity.gridX][entity.gridY].entities.indexOf(entity) !== -1)
        Game.collisionGrid[entity.gridX][entity.gridY].entities.splice(
                             Game.collisionGrid[entity.gridX][entity.gridY].entities.indexOf(entity), 1);    
                               
        // now store this information with the entity to be retrieved later
        entity.gridX = gridX;
        entity.gridY = gridY;
        
        Game.collisionGrid[gridX][gridY].entities.push(entity);
}

//
function removeFromCollisionGrid(entity) {
	var i = Game.collisionGrid[entity.gridX][entity.gridY].entities.indexOf(entity);
	Game.collisionGrid[entity.gridX][entity.gridY].entities.splice(i, 1);
}

function detectCollisions(entity) {
        var colliders = [];
        var x = entity.gridX; // because typing
        var y = entity.gridY;
        
        var collisionDistance = 0;  // the distance will be the radius of thing1 + radius of thing2
        
        // first, check for possible collisions with the map boundary
        if(x == 0 && (entity.x <= entity.radius))
			colliders.push({id: "Left Boundary"});
		if(y == 0 && (entity.y <= entity.radius))
			colliders.push({id: "Top Boundary"});
		if(x == Game.collisionGrid.length-1 && (SCREEN_SIZE_X - entity.x <= entity.radius))
			colliders.push({id: "Right Boundary"});
		if(y == Game.collisionGrid[0].length-1 && (SCREEN_SIZE_Y - entity.y <= entity.radius))
			colliders.push({id: "Bottom Boundary"});
                
        // check the actual square the entity is in
        for(var i = 0; i < Game.collisionGrid[x][y].entities.length; i++) {
			if(Game.collisionGrid[x][y].entities[i] === entity) continue; // don't worry, it's just me
                
					var distance = entity.distanceFrom(Game.collisionGrid[x][y].entities[i].x,Game.collisionGrid[x][y].entities[i].y);
					collisionDistance = entity.radius + Game.collisionGrid[x][y].entities[i].radius;
					if(distance <= collisionDistance) {
						//console.log("collision (same square)");
						colliders.push(Game.collisionGrid[x][y].entities[i]); // add to list of colliders
					}
        }
        
        squares = [{_x: x-1, _y: y-1}, 
                   {_x: x, _y: y-1},                                       
                   {_x: x+1, _y: y-1}, 
                   {_x: x-1, _y: y}, 
                   {_x: x+1, _y: y}, 
                   {_x: x-1, _y: y+1}, 
                   {_x: x, _y: y+1}, 
                   {_x: x+1, _y: y+1}];
        // now check all the squares around the square
        // should be 8, but in case the universe drastically changes, I've automated it
        for(var i = 0; i < squares.length; i++) {
			// if the indices are outside the bounds,
			if(squares[i]._x < 0 || squares[i]._x >= GRID_SIZE_X 
						|| squares[i]._y < 0 || squares[i]._y >= GRID_SIZE_Y) continue; // skip this square, it's invalid
						
				// otherwise go through every entity in this square and see if we're touching it
                for(var j = 0; j < Game.collisionGrid[squares[i]._x][squares[i]._y].entities.length; j++) {
					collisionDistance = entity.radius + Game.collisionGrid[squares[i]._x][squares[i]._y].entities[j].radius;
					 if(entity.distanceFrom(Game.collisionGrid[squares[i]._x][squares[i]._y].entities[j].x, 
											Game.collisionGrid[squares[i]._x][squares[i]._y].entities[j].y) <= collisionDistance) {
						//console.log("collision (different square)");
                        colliders.push(Game.collisionGrid[squares[i]._x][squares[i]._y].entities[j]);
                 	}
				}
        }
        
        // k
        return colliders;
}

function handleCollisions(entity, collisionList) {
	if(entity.id === "Catcher") return; // catchers don't react to their own collisions
	for(var i = 0; i < collisionList.length; i++) {
		if(collisionList[i].id === "Left Boundary" || collisionList[i].id === "Right Boundary") {
			entity.angle = 180 - entity.angle;
			entity.act();
		}
		if(collisionList[i].id === "Top Boundary" || collisionList[i].id === "Bottom Boundary") {
			entity.angle = -1* entity.angle;
			entity.act();
		}
		enforce_boundary(entity);
		if(collisionList[i].id === "Catcher" || 
			(collisionList[i].id === "Atom" && (collisionList[i].expanded === 1 || collisionList[i].expanding === 1))) {
				//alert(entity.id);
			if(!(entity.expanding === 1 || entity.expanded === 1)) {
				entity.expand();
				Game.activeAtoms++;
				Game.expandedAtoms++;
				Game.score += Math.trunc(Math.random()*(Game.colors.indexOf(entity.color) + 1) * 1000);
			}
			break;
		}
	}
}
