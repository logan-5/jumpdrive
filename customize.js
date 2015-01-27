// this file holds all the definitions of variables for easy customization of the game
// modifying most of these values should not break things

var Game = {}; //

// -1 = pre-game lore
// 0 = waiting for next level
// 1 = playing level, waiting for click
// 2 = playing level, after click
// 3 = end of level message
// 4 = end of game
Game.state = -1;
Game.waiting = 0; // 0 = false, 1 = true
Game.cell = 0; // which level are we on?
Game.statusString = "";
Game.loreStringIndex = 0;
Game.input = null; // store user input for the next frame

// global variables for easy customization
Game.fps = 60;  // how often will we refresh the screen?
var LTIME = 0; // this variable will always store the time of the last frame cycle
var TEMP_TIME = 0; // do not use
var SCREEN_SIZE_X = 800; // canvas size in pixels
var SCREEN_SIZE_Y = 600;
var CANVAS_X;  // get and store the upper left corner of the canvas's coordinates
var CANVAS_Y;
var MIN_CIRCLE_SIZE = 12; // smallest circle (often used with *2 because diameter)
var MAX_CIRCLE_SIZE = 25; // biggest circle
var CATCHER_COLOR = ""; // color of the circle outline created when user clicks
var BACKGROUND_COLOR = "";
var WIN_STRING = "Cell reactive and online!  Moving to next cell.";
var LOSE_STRING = "Cell unreactive.  Catalyst injector reloaded.";
Game.loreString = [ "You are deep in enemy space, a billion miles from home.", "Your ship is badly damaged and your jump drive is offline.",
					"Your ship's chief engineer is dead.  You must repair the jump drive yourself.",
					"Repair each cell by injecting a catalyst at a strategic location to cause a chain reaction.",
					"Good luck."
				  ];
Game.egString = [ "Jump drive engaging.... success!", "Congratulations!  You have won.", "Click to play again." ];
Game.egStringIndex = 0;
var LORE_WAIT_TIME = 300; // for automatically scrolling through lore
var loreTimer = 0;
// all the colors that the atoms may have
Game.colors = ["#FFFFFF", "#123459", "#AAFF43", "#009099", "#FACFAC", "#DFA43D", "#888888", "#098765", "#DACCBA", "#4B333F", "#FE09AC", "#0008FF", "#2BFF00"];
// each level is stored in an array below
Game.cells = [{total:5, required:1}, {total:25, required:5}, {total:35, required:10}, {total: 45, required:20}, {total: 60, required: 40}, {total:100, required: 90}, {total: 200, required: 200}];
Game.cellString = "";
Game.score = 0;
Game.expandedAtoms = 0;
Game.activeAtoms = 0;

// here's all our entities. don't delete this
var entList = [];

////////////////////////////////////////////////////////////////////////////////////////
// drawing-related defines
var GRID_COLOR = "#D1A554";
var BACKGROUND_COLOR1 = "#2E2C2B"; // gradient business
var BACKGROUND_COLOR2_DEFAULT = "#474443";
var BACKGROUND_COLOR2_WIN = "#E6946C";
var currentBackgroundColor = BACKGROUND_COLOR2_DEFAULT;
var backgroundFadeSteps = 50; // how fast to fade (bigger = slower)
var MESSAGEBOX_COLOR = "#111111";
var MESSAGEBOX_ALPHA = 0.8; 

var loreCursorCounter = 0;
var LORE_CURSOR_SPEED = 20; // bigger = slower
var LORE_TEXT_FONT = "small-caps 18px Lucida Console";
var LORE_TEXT_COLOR = "#FF9D47";
var PRELEVEL_TEXT_FONT = "small-caps 18px Lucida Console";
var PRELEVEL_TEXT_COLOR = "#FF9D47";
var LEVEL_TEXT_FONT = "small-caps 18px Lucida Console";
var LEVEL_TEXT_COLOR = "#FF9D47";
var POSTLEVEL_TEXT_FONT = "small-caps 18px Lucida Console";
var POSTLEVEL_TEXT_COLOR = "#FF9D47";
var EG_TEXT_FONT = "small-caps 18px Lucida Console";
var EG_TEXT_COLOR = "#FF9D47";
var scrollTextCounter = 0;
// scroll speeds: 1 = painfully slow, 20 = a little too fast to be cool
var loreScrollSpeed = 5;
var preLevelScrollSpeed = 12;
var postLevelScrollSpeed = 10;
var egScrollSpeed = 5;
var oldState = 0; // save the old state of the game to check when it changes
