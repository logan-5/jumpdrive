///////////////////////////////////////////////////////////////////////////////////
// handle user input
Game.handleInput = function() {
        if(Game.input != null) {
                switch(Game.state) {
						case -1: // if scrolling through game lore, go to the next part of the lore
									// unless we're done with the lore, in which case start the game
								scrollTextCounter = 0;
								loreTimer = 0;
								fadeIndex = 0;
								if(++Game.loreStringIndex >= Game.loreString.length) {
									Game.state = 0;
									
								}
						break;
                        case 0: // if waiting for player and player appears, start
                                Game.state = 1;
                        break;
                        case 1: // if waiting for click and click happens, place catcher
                                entList.push(new Catcher(Game.input.pageX - CANVAS_X, 
                                                         Game.input.pageY - CANVAS_Y));
                                Game.state = 2; // and stop listening for clicks
                                Game.activeAtoms++;
                        break;
                        case 3: // post-level message box, click sends us back to pre-level message box
								Game.state = 0;
						break;
						case 4: // if scrolling through endgame lore, go to the next part of the lore
									// unless we're done with the lore, in which case restart the game
								scrollTextCounter = 0;
								fadeIndex = 0;
								loreTimer = 0;
								if(++Game.egStringIndex >= Game.egString.length) {
									Game.state = 0;
									Game.cell = 0;
									Game.egStringIndex = 0;
									Game.score = 0;
									
								}
						break;
                }
                Game.input = null;
        }
}

// move all entities, do all thinking
Game.update = function() {
        switch(Game.state) {
				case -1:
					// increment the lore timer and check if it's done
					if(++loreTimer >= LORE_WAIT_TIME) {
						// if so, start the next lore frame
						loreTimer = 0;
						scrollTextCounter = 0;
						fadeIndex = 0;
						if(++Game.loreStringIndex >= Game.loreString.length)
							Game.state = 0;
					}
                case 0:
                        if(Game.waiting == 0) {
                                // wait for the user to OK the next level
                                Game.waiting = 1;
                                
                                // TODO: change below to printf-style
                                Game.cellString = "Jump drive cell #"+(Game.cell+1)+". React with "
                                        +Game.cells[Game.cell].required+" of "
                                        +Game.cells[Game.cell].total+ " atoms.\n"
                                        +"Click to continue.";
                                while(entList.length > 0) entList.pop(); // empty the entList
                                // create as many atoms as are in the next level
                                for(var i = 0; i < Game.cells[Game.cell].total; i++) {
									// colors are random except 2 new colors get unlocked every level
									var randomColorIndex = Math.trunc(Math.random()*Math.min(Game.colors.length, 2*Game.cell + 2)); // gotta remember because we use colors for speed too
									var randomSpeed = 2*randomColorIndex/10 + 0.5;
                                        entList.push(new Atom(Math.random()*(SCREEN_SIZE_X-2*MIN_CIRCLE_SIZE) + MIN_CIRCLE_SIZE,
                                                                                        Math.random()*(SCREEN_SIZE_Y-2*MIN_CIRCLE_SIZE) + MIN_CIRCLE_SIZE,
                                                                                        Math.random()*360,
                                                                        Game.colors[randomColorIndex],
                                                                                        randomSpeed));
								}
                                
                                // empty and prepare collision grid for next level
                                while(Game.collisionGrid.length > 0) Game.collisionGrid.pop();
                                initCollisionGrid();
                                fadeIndex = 0;
                        }
                break;
                case 2: // "catcher" has been placed. check if level is over. if not, fall through to case 1 below
					if(Game.activeAtoms === 0) { // level is over, did we win or lose?
							if(Game.expandedAtoms < Game.cells[Game.cell].required) {
								Game.statusString = LOSE_STRING;
								Game.state = 3;
							}
							else {
								Game.statusString = WIN_STRING;
								if(++Game.cell >= Game.cells.length)
									Game.state = 4;
								else
									Game.state = 3;
								Game.cell %= Game.cells.length;
							}
						Game.expandedAtoms = 0;
						break;
					} 
                case 1: // normal gameplay
					Game.waiting = 0; // stop the waiting for next time Game.state = 0
                        
                        // now detect and handle collisions from last frame
                        for(var i = 0; i < collisionChecks.length; i++) {
							var collisions = detectCollisions(entList[collisionChecks[i]])
                                if(collisions.length > 0) {
									//alert("collision!");
									handleCollisions(entList[collisionChecks[i]], collisions);
								}
                        }
                        while(collisionChecks.length > 0) collisionChecks.pop();
                        
                        // if the game is in full swing,
                        // let all entities do their thing
                        for(var i = 0; i < entList.length; i++) {
                                var result = entList[i].act();
                                enforce_boundary(entList[i]);
                                if(result === -1) { // act() sent the signal to die
                                        if(entList[i].die() === -1) { // kill meh
											Game.activeAtoms--;
											removeFromCollisionGrid(entList[i]);
                                            delete entList.splice(i, 1); // remove the item from the entList and delete
										}
                                }
                                if(result === 1) { // act() sent the signal that the entity wants to be added to collision detection list
                                        addToCollisionGrid(entList[i]);
                                        collisionChecks.push(i);
                                }
                        }
                        
                break;
                case 4:
					// increment the lore timer and check if it's done
					if(++loreTimer >= LORE_WAIT_TIME) {
						// if so, start the next lore frame
						loreTimer = 0;
						scrollTextCounter = 0;
						fadeIndex = 0;
						if(++Game.egStringIndex >= Game.egString.length) {
							Game.state = 0;
							loreTimer = 0;
						}
					}
                break;
        }
}

// this function is called every frame cycle
Game.run = function() { 
        // update time variable
        var now = Date.now();
        LTIME = (now - TEMP_TIME) / 10;
        TEMP_TIME = now;
        
        // game loop
        Game.handleInput();
        Game.update();
        Game.draw();
}               

function startGame() {
        // set up the canvas
        CANVAS_X = document.getElementById("canvas").getBoundingClientRect().left;  // get and store the upper left corner of the canvas's coordinates
        CANVAS_Y = document.getElementById("canvas").getBoundingClientRect().top;
        document.getElementById("canvas").width = SCREEN_SIZE_X;
        document.getElementById("canvas").height = SCREEN_SIZE_Y;
        
        // let the canvas listen for clicks
        document.getElementById("canvas").addEventListener("click", 
                function(event) {
                        // store the mouse position in an array of input events
                        Game.input = {pageX: event.pageX, pageY: event.pageY};                  
                });

		// set up collision detection
		initCollisionGrid(); //alert(Game.collisionGrid);
        // set up the interval to call this.run
        Game._intervalId = window.setInterval(Game.run, 1000 / Game.fps);
}
