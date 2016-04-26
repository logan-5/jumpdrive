// defines the atom 'class'
// for all the bouncing balls

function Atom(initial_x, initial_y, initial_angle, color_, speed_) {
    // x and y coordinates start from the top left
//    this.x = initial_x;
//    this.y = initial_y;
//	Atom.__proto__ = Entity;
//	this = Object.create(Entity);
    Entity.call(this, initial_x, initial_y);
    this.id = "Atom";
    
    // angle is 0...360 counter-clockwise where 0 is due right (east?)
    this.angle = initial_angle;
    this.color = color_;
    this.speed = speed_;
    this.radius = MIN_CIRCLE_SIZE;
    
    //
    this.expanding = 0;
    this.expanded = 0;
    
    // to be used after expanded = 1
    this.life = 0;
    this.lifespan = 150;
};

// inherit from Entity
Atom.prototype = new Entity();
Atom.prototype.constructor = Atom;

Atom.prototype.act = function() {
	if(this.expanding === 1) {
		this.radius += 2*LTIME;
		if(this.radius >= MAX_CIRCLE_SIZE) {
			this.radius = MAX_CIRCLE_SIZE;
			this.expanding = 0;
			this.expanded = 1;
		}		
		return 1;
	}
	if(this.expanded === 1) { 
		if(this.life >= this.lifespan) // kill if dead
			return -1;
		this.life++; 
		return 1;
	}
	return this.move();
};

Atom.prototype.die = function() {};

Atom.prototype.bounce = function() {
    //this.angle = 180 - this.angle;
    this.angle += 180;
};

Atom.prototype.move = function() {
	// Math.trig functions use radians, so:
	var radAngle = this.angle * (Math.PI / 180);
	
	// move forward one unit of the speed at the present angle
    this.x += this.speed * Math.cos(radAngle) * LTIME;
    this.y += this.speed * Math.sin(radAngle) * LTIME;
    
    return 1; // moved, so add to collision detection list
};

Atom.prototype.expand = function() {
	this.expanding = 1;
}

Atom.prototype.die = function() {
	this.radius -= 2*LTIME;
	if(this.radius < 0)
		return -1;
};
