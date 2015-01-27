// defines a generic "entity" class that the game will use for a couple things

var Entity = function(_x, _y) {
	this.x = _x;
	this.y = _y;
	
	// for use by the collision engine
	this.gridX = 0;
	this.gridY = 0;
}

Entity.prototype.act = function() {};
Entity.prototype.die = function() {};

Entity.prototype.distanceFrom = function(other_x, other_y) {
    return Math.sqrt(Math.pow(other_x-this.x, 2) + Math.pow(other_y-this.y, 2));
};

