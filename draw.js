///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// drawing

function drawCollisionLines(context) {
	context.strokeStyle = GRID_COLOR;
	for(var i = 0; i * MAX_CIRCLE_SIZE*2 < SCREEN_SIZE_X; i++) {
		context.beginPath();
		context.moveTo(i * MAX_CIRCLE_SIZE*2, 0);
		context.lineTo(i * MAX_CIRCLE_SIZE*2, SCREEN_SIZE_Y);
		context.stroke();
	}
		
	
	for(var i = 0; i * MAX_CIRCLE_SIZE*2 < SCREEN_SIZE_Y; i++) {
		context.beginPath();
		context.moveTo(0, i * MAX_CIRCLE_SIZE*2);
		context.lineTo(SCREEN_SIZE_X, i * MAX_CIRCLE_SIZE*2);
		context.stroke();
	}
}

// copied and pasted from javascripter.net
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
function rgbToHex(R,G,B) {return "#"+toHex(R)+toHex(G)+toHex(B)}
function toHex(n) {
 n = parseInt(n,10);
 if (isNaN(n)) return "00";
 n = Math.max(0,Math.min(n,255));
 return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
}

var fadeIndex = 0;
function getBackgroundColor() {
	if((Game.state === 1 || Game.state === 2) && 
		Game.expandedAtoms >= Game.cells[Game.cell].required && (currentBackgroundColor !== BACKGROUND_COLOR2_WIN && fadeIndex < backgroundFadeSteps)) {
		// copied and pasted from stackoverflow
		oldRed = hexToR(BACKGROUND_COLOR2_DEFAULT);
		newRed = hexToR(BACKGROUND_COLOR2_WIN);
		oldGreen = hexToG(BACKGROUND_COLOR2_DEFAULT);
		newGreen = hexToG(BACKGROUND_COLOR2_WIN);
		oldBlue = hexToB(BACKGROUND_COLOR2_DEFAULT);
		newBlue = hexToB(BACKGROUND_COLOR2_WIN);
		
		redStepAmount = (newRed - oldRed) / (backgroundFadeSteps-1);
		greenStepAmount = (newGreen - oldGreen) / (backgroundFadeSteps-1);
		blueStepAmount = (newBlue - oldBlue) / (backgroundFadeSteps-1);

		var currentRed = hexToR(currentBackgroundColor) + redStepAmount;
		var currentGreen = hexToG(currentBackgroundColor) + greenStepAmount;
		var currentBlue = hexToB(currentBackgroundColor) + blueStepAmount;
		
		currentBackgroundColor = rgbToHex(currentRed, currentGreen, currentBlue);
		fadeIndex++;
	}
	else {
		if((Game.state === 0 || Game.state === 1 || Game.state === 2) && Game.expandedAtoms < Game.cells[Game.cell].required)
			currentBackgroundColor = BACKGROUND_COLOR2_DEFAULT;
	}
	return currentBackgroundColor;
}

// copied from stackoverflow
// maybe could have done it myself but really didn't wanna
// http: //www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
     function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var cars = text.split("\n");

        for (var ii = 0; ii < cars.length; ii++) {

            var line = "";
            var words = cars[ii].split(" ");

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + " ";
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;

                if (testWidth > maxWidth) {
                    context.fillText(line, x, y);
                    line = words[n] + " ";
                    y += lineHeight;
                }
                else {
                    line = testLine;
                }
            }

            context.fillText(line, x, y);
            y += lineHeight;
        }
     }

// draw all entities to the screen
Game.draw = function() {
	if(Game.state !== oldState) {
		scrollTextCounter = 0;
		oldState = Game.state;
	}
        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        // draw background
        ctx.clearRect(0, 0, c.width, c.height); // clear the screen for redrawing
        
        // prepare gradient for background
        var grad = ctx.createLinearGradient(SCREEN_SIZE_X/2, 0, SCREEN_SIZE_X/2, SCREEN_SIZE_Y);
        grad.addColorStop(0, BACKGROUND_COLOR1);
        grad.addColorStop(1, getBackgroundColor());
        ctx.fillStyle = grad;
        
        // draw background rectangle
        ctx.fillRect(0, 0, SCREEN_SIZE_X, SCREEN_SIZE_Y);
        switch(Game.state) {
				case -1: 
					// very beginning of the game, scroll through the game's "lore"
					ctx.fillStyle = MESSAGEBOX_COLOR;
                        ctx.fillRect(0, SCREEN_SIZE_Y/4, 
                                                SCREEN_SIZE_X, SCREEN_SIZE_Y*(1/2));
                                                                     
                        // now render the text
                        // TODO: move some of this into CSS if possible
                        ctx.font = LORE_TEXT_FONT;
                        ctx.fillStyle = LORE_TEXT_COLOR;
                        var outputString; 
                        if((scrollTextCounter/10) > Game.loreString[Game.loreStringIndex].length) { 
								outputString = "> "+Game.loreString[Game.loreStringIndex];
								// obligatory sci-fi blinking cursor
								if(++loreCursorCounter >= LORE_CURSOR_SPEED/2)
									outputString += "_";
								loreCursorCounter %= LORE_CURSOR_SPEED;
						} else {
							 outputString = "> "+Game.loreString[Game.loreStringIndex].substring(0, Math.trunc(scrollTextCounter/10));
							 scrollTextCounter += loreScrollSpeed;
						}
						wrapText(ctx, outputString, 20, SCREEN_SIZE_Y/4 + 20, SCREEN_SIZE_X-20, 18);
                        //ctx.fillText(outputString, 20, SCREEN_SIZE_Y/4 + 20);
				break;
                case 0:
                        // if we are waiting for the player, draw a box prompting an OK
                        // (TODO: just once)
                        //ctx.clearRect(0, 0, c.width, c.height); // clear the screen for redrawing
                        ctx.fillStyle = MESSAGEBOX_COLOR;
                        ctx.fillRect(0, SCREEN_SIZE_Y/4, 
                                                SCREEN_SIZE_X, SCREEN_SIZE_Y*(1/2));
                                                                                            
                        // now render the text
                        // TODO: move some of this into CSS if possible
                        ctx.font = PRELEVEL_TEXT_FONT;
                        ctx.fillStyle = PRELEVEL_TEXT_COLOR;
                        var outputString; 
                        if((scrollTextCounter/10) > Game.cellString.length) { 
								outputString = "> "+Game.cellString;
								if(++loreCursorCounter >= LORE_CURSOR_SPEED/2)
									outputString += "_";
								loreCursorCounter %= LORE_CURSOR_SPEED;
						} else {
							 outputString = "> "+Game.cellString.substring(0, Math.trunc(scrollTextCounter/10));
							 scrollTextCounter += preLevelScrollSpeed;
						}
						
						wrapText(ctx, outputString, 20, SCREEN_SIZE_Y/4 + 20, SCREEN_SIZE_X-20, 18);
                        break;
                case 2:                 
                case 1:
                        // if the game is being played, draw all entities
                        //ctx.clearRect(0, 0, c.width, c.height); // clear the screen for redrawing
						
						drawCollisionLines(ctx); // for debugging (nvm keeping them, they look cool)
                
                        for(var i = 0; i < entList.length; i++) {
                                if(entList[i].id == "Atom") {
                                        ctx.beginPath();
                                        ctx.arc(entList[i].x, entList[i].y, entList[i].radius, 0, 2*Math.PI);
                                        ctx.fillStyle = entList[i].color;
                                        ctx.fill();
                                }
                                if(entList[i].id == "Catcher") {
                                        ctx.beginPath();
                                        ctx.arc(entList[i].x, entList[i].y, entList[i].radius, 0, 2*Math.PI);
                                        ctx.strokeStyle = CATCHER_COLOR;
                                        ctx.stroke();
                                }
                        }
                        ctx.font = LEVEL_TEXT_FONT;
                        ctx.fillStyle = LEVEL_TEXT_COLOR;
                        ctx.fillText("Score: "+Game.score+"\nExpanded atoms: "+Game.expandedAtoms+" of "+Game.cells[Game.cell].required, 3, 18);
                        break;
                 case 3:
						// message showing if we won or lost the level
						// message box with the level still showing in the background
						drawCollisionLines(ctx); // for debugging (nvm keeping them, they look cool)
                
                        for(var i = 0; i < entList.length; i++) {
                                if(entList[i].id == "Atom") {
                                        ctx.beginPath();
                                        ctx.arc(entList[i].x, entList[i].y, entList[i].radius, 0, 2*Math.PI);
                                        ctx.fillStyle = entList[i].color;
                                        ctx.fill();
                                }
                                if(entList[i].id == "Catcher") {
                                        ctx.beginPath();
                                        ctx.arc(entList[i].x, entList[i].y, entList[i].radius, 0, 2*Math.PI);
                                        ctx.strokeStyle = CATCHER_COLOR;
                                        ctx.stroke();
                                }
                        }
                        ctx.fillStyle = MESSAGEBOX_COLOR;
                        ctx.globalAlpha = MESSAGEBOX_ALPHA;
                        ctx.fillRect(0, SCREEN_SIZE_Y/4, 
                                                SCREEN_SIZE_X, SCREEN_SIZE_Y*(1/2));  
                        ctx.globalAlpha = 1;                                           
                        // now render the text
                        // Game.statusString tells us whether we won or lost and is modified by Game.update()
                        ctx.font = POSTLEVEL_TEXT_FONT;
                        ctx.fillStyle = POSTLEVEL_TEXT_COLOR;
                        var outputString; 
                        if((scrollTextCounter/10) > Game.statusString.length) { 
								outputString = "> "+Game.statusString;
								if(++loreCursorCounter >= LORE_CURSOR_SPEED/2)
									outputString += "_";
								loreCursorCounter %= LORE_CURSOR_SPEED;
						} else {
							 outputString = "> "+Game.statusString.substring(0, Math.trunc(scrollTextCounter/10));
							 scrollTextCounter += postLevelScrollSpeed;
						}
						
						wrapText(ctx, outputString, 20, SCREEN_SIZE_Y/4 + 20, SCREEN_SIZE_X-20, 18);
                        break;
                  case 4:
                        // very end of game, scroll through victory message(s)
					ctx.fillStyle = MESSAGEBOX_COLOR;
                        ctx.fillRect(0, SCREEN_SIZE_Y/4, 
                                                SCREEN_SIZE_X, SCREEN_SIZE_Y*(1/2));                                             
                        // now render the text
                        // TODO: move some of this into CSS if possible
                        ctx.font = EG_TEXT_FONT;
                        ctx.fillStyle = EG_TEXT_COLOR;
                        var outputString; 
                        if((scrollTextCounter/10) > Game.egString[Game.egStringIndex].length) { 
								outputString = "> "+Game.egString[Game.egStringIndex];
								// obligatory sci-fi blinking cursor
								if(++loreCursorCounter >= LORE_CURSOR_SPEED/2)
									outputString += "_";
								loreCursorCounter %= LORE_CURSOR_SPEED;
						} else {
							 outputString = "> "+Game.egString[Game.egStringIndex].substring(0, Math.trunc(scrollTextCounter/10));
							 scrollTextCounter += egScrollSpeed;
						}
						
						wrapText(ctx, outputString, 20, SCREEN_SIZE_Y/4 + 20, SCREEN_SIZE_X-20, 18);
                  break;
        }
}
