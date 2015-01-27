// catcher that appears when the player clicks
// defined thus

var Catcher = function(_x, _y) {
	Entity.call(this, _x, _y);
	this.id = "Catcher";
	
	// for use by the collision engine
	this.gridX = 0;
	this.gridY = 0;
	
	this.radius = MAX_CIRCLE_SIZE;
	
	this.lifespan = 150;
	this.life = 0;
}

// inherit from Entity
Catcher.prototype = new Entity();
Catcher.prototype.constructor = Catcher;

Catcher.prototype.act = function() { 
	if(this.life >= this.lifespan) // kill if dead
		return -1;
	this.life++; 
	return 1;
};

Catcher.prototype.die = function() {
	this.radius -= 2*LTIME;
	if(this.radius < 0)
		return -1;
};
