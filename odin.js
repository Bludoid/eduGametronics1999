//"use strict";

		
// ******************* CLASS Board BEGINS ******************************* //
class Board
{	constructor()
	{	
		this.pads= [];						// fill with PAD objects
		this.players= [];					// fill with PLAYER objects	
		this.turn= 1;						// represents which player is playing
		this.playing= 1;					// represents how many players are playing
		this.winner = 0;					// flags the end of the game
		this.name= "eduGametronics 1999";	// name for the BOARD
	}
	
	setTurn(playerNum)		{ this.turn= playerNum;				}
	getTurn()				{ return this.turn; 				}
	
	addPlayer(playerObj)	{ this.players.push(playerObj);		}
	getPlayer(pNum)			{ return this.players[pNum];		}
	getActivePlayer()		{ return this.players[this.turn];	}
	getPlaying()			{ return this.playing				}
	setPlaying(n)			{ this.playing =n;					}
	
	
	setWinner(w)			{ this.winner= w;					}
	getWinner()				{ return this.winner;				}
	setPad(padObj)			{ this.pads.push(padObj);			}
	getPad(padNum)			{ return this.pads[padNum];			}
	movePlayer(pNum, roll)	{ this.players[pNum].loc += roll;	}
}

// ******************** CLASS Player BEGINS ***************************** //
class Player
{	constructor()
	{
		this.name= 	 	"ghost0";
		this.colour= 	"pink";
		this.avatar= 	"";
		this.loc=		0;
		this.points= 	0;
		this.rolled= 	0;
	}	
	
	setName(pname)		{ this.name= pname; 	}
	getName()			{ return this.name; 	}
	setColour(pcol)		{ this.colour= pcol; 	}
	getColour()			{ return this.colour; 	}
	setAvatar(pava)		{ this.avatar= pava; 	}
	getAvatar()			{ return this.avatar; 	}
	
	setLoc(n)			{ this.loc= n;			}
	getLoc()			{ return this.loc;		}
	addPoints(ppoints)	{ this.points+= ppoints;}
	setPoints(ppoints)	{ this.points= ppoints; }
	getPoints()			{ return this.points;	}
	getRoll()			{ return this.rolled;	}
	
	roll()				{ return (this.rolled=  Math.ceil(Math.random() * 6)); }
	
	movePlayer()		{ }				  
}

// ******************* CLASS Pad BEGINS ******************************* //
class Pad
{	constructor()
	{
		this.loc= 0;
		this.game= "";
		this.image= "";
		this.guests= [];
	}	
	
	getGame()			{ return this.game;			}
	setGame(g)			{ this.game= g;				}		
	getLoc()			{ return this.loc;			}
	setLoc(n)			{ this.loc= n;				}

	getImage()			{ return this.image;		}
	setImage(i)			{ this.image = i;			}
	addGuest(p)			{ this.guests.push(p);	}
	removeGuest()		{ this.guests.shift();	}
	
	paint()				{ 	const thisPad= getMe( parseInt(this.loc) );
							if(this.getLoc()==0 || this.getLoc()== 27){
								thisPad.style=   "border: 6px solid #ddd";
								getMe(27).style= "border: 6px solid #ddd";
								return; }

							switch( this.guests.length ){
								
								case 0:
									thisPad.style= "border: 6px solid #333";
									break;
									
								case 1: 
									thisPad.style= "border: 6px solid " + this.guests[0].getColour(); 
									break;
									
								case 2:
									thisPad.style=  "border-top: 6px solid " + this.guests[0].getColour() + ";" +
													"border-left: 6px solid " + this.guests[0].getColour() + ";" +
													"border-bottom: 6px solid " + this.guests[1].getColour() + ";" +
													"border-right: 6px solid " + this.guests[1].getColour();
									break; 
								
								case 3:	break;
								case 4:	break;
								default:
									thisPad.style= "border-top: 6px solid " + this.guests[0].getColour();
									break; } }
	
	runGame()			{	let success= false;
							switch(this.getGame()) {	
							
								case "hangman":
									success= loadHangman();
									break;
							
								case "language":
									success= loadLangGame();
									break;
								
								case "million":
									success = loadMill();
									break;
								
								case "math":
									success = loadBigger();
									break;
									
								case "riddle":
									success = loadRiddle();
									break;
							
								case "end":
									success = loadEnd();
									break;
	
								default:
									alert("Default Game Switch triggered");

									break;	} 
							return success; }
}

// ******************* CLASS HMword BEGINS ******************************* //
class HMword
{	constructor() 
	{	this.picked= "";
		this.category= "";
		this.hints= [];
		this.solved= []; 
		this.lives= 5;
	}
	
	getCategory()	{ return this.category; }
	getWord()		{ return this.picked; }
	getHints()		{ return this.hints; }
	isSolved() 		{ return ( this.solved.includes(false) === false ? true : false ); }
	
	pick()
	{	let ok= false;
		let rndWord= 0;
		let counter= 0;
		this.hints= [];		// clear array... this function pushes to hints  EVERY times its called
		this.solved= [];	// clear array... this function pushes to solved EVERY times its called

		while(!rndWord)		// PICK from HMdata (one element= Category, four elements= a word and three hints 
		{   rndWord= Math.floor(Math.random() * HMdata.length);		//  random pick = 1 to length of HMdata[]
			if (HMdata[rndWord].length== 1) { rndWord= 0; }}  		//  finding one element means PICK again
		
		counter= rndWord;													// counter moves up the array
		while(!ok) { ok= (HMdata[--counter].length == 1) ? true : false; }	// find Category = one element
		
		this.picked= HMdata[rndWord][0].toUpperCase();
		this.category= HMdata[counter][0];
		this.hints.push( HMdata[rndWord][1], HMdata[rndWord][2], HMdata[rndWord][3] );
		for (let i=0; i< this.picked.length; i++) { this.solved.push(i == this.picked.indexOf(" ") ? true : false); }		
	}
}

class BoardHost
{	constructor(){
		this.loc;
		this.turn; 
		this.game= "";
		this.roll= 0;
		this.points= 0;
		this.success= true;
		this.message; }
	
	getRoll()				{ return this.roll;			}
	setRoll(r)				{ this.roll = r;			}
	getGame()				{ return this.game;			}
	setGame(g)				{ this.game = g;			}
	getPoints()				{ return this.points;		}
	setPoints(p)			{ this.points = p;			}	
	
	getMessage()			{ return this.message;		}
	setMessage(m)			{ this.message = m;			}
	getSuccess()			{ return this.success;		}
	setSuccess(s)			{ this.success = s;			}
	getLoc()				{ return this.loc;			}
	setLoc(l)				{ this.loc = l;				}				
	getTurn()				{ return this.turn;			}
	setTurn(t)				{ this.turn = t;			}
	
}

// ******************* GLOBAL DECLARATIONS ******************************* //	
let b= new Board();
let host= new BoardHost();
let w= new HMword();

let p0= new Player();
let p1= new Player();
let p2= new Player();

var lgTurns= 6;
let randomData= 0;

const padData= [
	[ "start", 		"images/board/start.png" 	],
	[ "language",	"images/board/french.png" 	],
	[ "language",	"images/board/french.png" 	],
	[ "million",	"images/board/quiz.png" 	],
	[ "million",	"images/board/quiz.png" 	],
	[ "million",	"images/board/quiz.png" 	],
	[ "math",		"images/board/math.png" 	],
	[ "riddle",		"images/board/riddle.png" 	],
	[ "math",		"images/board/math.png" 	],
	[ "hangman",	"images/board/word.png" 	],
	[ "hangman",	"images/board/word.png" 	],
	[ "hangman", 	"images/board/word.png" 	],
	[ "million",	"images/board/quiz.png" 	],
	[ "million",	"images/board/quiz.png" 	],
	[ "riddle",		"images/board/riddle.png" 	],
	[ "language",	"images/board/french.png" 	],
	[ "language",	"images/board/french.png" 	],
	[ "math",		"images/board/math.png" 	],
	[ "math",		"images/board/math.png" 	],
	[ "hangman",	"images/board/word.png" 	],
	[ "hangman",	"images/board/word.png" 	],
	[ "riddle",		"images/board/riddle.png" 	],
	[ "math",		"images/board/math.png" 	],
	[ "math",		"images/board/math.png" 	],
	[ "language",	"images/board/french.png" 	],
	[ "language",	"images/board/french.png" 	],
	[ "hangman",	"images/board/word.png" 	],
	[ "end",		"images/board/end.png" 		] ];

// 		 I don't like typing document.getElementById(id);
function getMe(id)	{ return document.getElementById(id); }	

// ******************* INIT:  Self Executing  **************************** //
const init = (function()					//	 fill 4 sections with pads: btop, bright, bbottom, bleft
{
	for(let i in padData) {							// Load BOARD array (pads) with PAD objects 

		const newPad= new Pad();
		newPad.setLoc(i);							// method to set location of the pad
		newPad.setGame(padData[i][0]);				// method to set game name from padData array
		newPad.setImage(padData[i][1]);				// method to set image from padData array
		b.setPad(newPad); }							// method to push PAD obj to a pad array in BOARD
		

	for(let y= 0; y< 8; y++) { 
		
		let topimg= document.createElement("img");
		let bottomimg= document.createElement("img");
		
		topimg.id= y;
		topimg.src= b.pads[ topimg.id ].getImage();
		bottomimg.id= 21-y;
		bottomimg.src= b.pads[ bottomimg.id ].getImage();	

		getMe("btop").appendChild(topimg);
		getMe("bbottom").appendChild(bottomimg); }
	
	for(let x= 0; x< 6; x++) {
		
		let leftimg= document.createElement("img");
		let rightimg= document.createElement("img");
		
		leftimg.id= 27-x;
		leftimg.src= b.pads[ leftimg.id ].getImage();
		rightimg.id= 8+x;
		rightimg.src= b.pads[ rightimg.id ].getImage();

		getMe("bleft").appendChild(leftimg); 
		getMe("bright").appendChild(rightimg); }
		
	getMe("bulletin").innerHTML= "eduGametronics 1999";
	//  <button type='button' class='jennifer' onclick='loadLangGame()'>Language Game</button>
	//  <button type='button' class='jennifer' onclick='loadHangman()'>Hangman Game</button>";	
	loadIntro0();
	
}) ();


//  ******************* LOADINTRO 0   *************************************************************************

function loadIntro0() {
	const intro0div= document.createElement("div");		// create div to hold our HTML script... intro1
	intro0div.innerHTML= getMe("intro0").innerHTML;
	getMe("bmiddle").innerHTML= "";
	getMe("bmiddle").appendChild(intro0div);		
	getMe("wannaPlay").onclick= function() { loadIntro1() };
	getMe("btop").style= 	"visibility: hidden";
	getMe("bright").style= 	"visibility: hidden";
	getMe("bbottom").style= "visibility: hidden";
	getMe("bleft").style= 	"visibility: hidden";
}
	


//  ******************* LOADINTRO 1   *************************************************************************
function loadIntro1()									//load HTML with button onclick= submitPlayers
{	const intro1div= document.createElement("div");		// create div to hold our HTML script... intro1
	intro1div.innerHTML= getMe("intro1").innerHTML;
	getMe("bmiddle").innerHTML= "";
	getMe("bmiddle").appendChild(intro1div);		
}
	function submitPlayers()							// ONCLICK button function from loadIntro1();  add players 
	{
//		let p0= new Player();
//		let p1= new Player();
//		let p2= new Player();
		
		b.addPlayer(p0);
		b.addPlayer(p1);
		if (getMe("r2").checked) {
			b.addPlayer(p2);
			b.setPlaying(2); }							// radio buttons tells us how many players playing
		
		loadIntro2();									// LOAD new HTML form for player names
		if(b.getPlaying() == 1) {						// show only players needed
			getMe("p2Name").style= "display:none";
			getMe("p2NameLabel").style= "display:none"; }

		for(let p of b.players) { b.getPad(0).addGuest(p); }
		b.getPad(0).removeGuest();
		
	}
	
//  ******************* LOADINTRO 2    *************************************************************************	
function loadIntro2()									// load HTML with button onclick= submitNames
{	const intro2div= document.createElement("div");		// create div to hold our HTML script... intro2
	intro2div.innerHTML= getMe("intro2").innerHTML;
	getMe("bmiddle").innerHTML= "";
	getMe("bmiddle").appendChild(intro2div);		
}	
	function submitNames()								// ONCLICK button function from loadIntro2();  add player attributes 
	{
		b.getPlayer(1).setName(getMe("p1Name").value);
	    b.getPlayer(1).setColour("pink");
		
		if(b.getPlaying() == 1)							// this STARTS the game for SINGLEplayer... LoadGametronics1999
		{	host.setMessage("Welcome " + b.getPlayer(1).getName() + ".  Click Roll to begin");
			getMe("btop").style= 	"visibility: visible";
			getMe("bright").style= 	"visibility: visible";
			getMe("bbottom").style= "visibility: visible";
			getMe("bleft").style= 	"visibility: visible";
			
			loadGametronics1999(); }
		else
		{	b.getPlayer(2).setName(getMe("p2Name").value);			// set attributes for player2
			b.getPlayer(2).setColour("red"); 
			loadIntro3(); 								// LOAD new HTML form for Who Gos First 
		}
	}

//  ******************* LOADINTRO 3    *************************************************************************
function loadIntro3()									// load HTML with ROLL button for each player and START GAME button 
{	const intro3div= document.createElement("div");
	intro3div.innerHTML= getMe("intro3").innerHTML;
	getMe("bmiddle").innerHTML= "";
	getMe("bmiddle").appendChild(intro3div);
	
	getMe("p2Result").style= "display: none";		// flush player2 roll and flush winner results
	getMe("rollResult").style= "display: none";
	getMe("spanP1Name").innerHTML= b.getPlayer(1).getName();
	getMe("spanP2Name").innerHTML= b.getPlayer(2).getName();
}	
	function rollP1()									// ONCLICK button function from loadIntro3; display roll for player 1
	{	getMe("p1Roll").disabled= true;
		b.getPlayer(1).roll();
		getMe("p1Result").innerHTML+= b.getPlayer(1).getName() + ", you rolled a " + b.getPlayer(1).getRoll();
		getMe("p2Result").style= "display: reset";
	}
	function rollP2()									// ONCLICK button function from loadIntro3; display roll for player 2 
	{	
		const pl1 = b.getPlayer(1);
		const pl2 = b.getPlayer(2);
		do		{ pl2.roll(); }
		while 	( pl1.getRoll() == pl2.getRoll() );				// cheating... players cant roll the same (tie)
	
		getMe("p2Roll").disabled= true;
		getMe("p2Result").innerHTML+= pl2.getName() + ", you rolled a " + pl2.getRoll();
		
		getMe("rollResult").style= "display: reset; padding-right: 75px";
		getMe("begin").value= "START";
		let winner= "";
		
		if( pl1.getRoll() > pl2.getRoll() ) {						// set board property for who goes first (turn)
			getMe("rollResult").innerHTML+= pl1.getName() +", you won the toss...<br>Click Begin to begin";
			b.setTurn(2);											// set player wrong because LoadGametronics1999 changes player :(
			winner= b.getPlayer(1).getName(); }
		else {
			getMe("rollResult").innerHTML+= pl2.getName() +", you won the toss... <br>Click Begin to begin";
			b.setTurn(1);											// set player wrong because LoadGametronics1999 changes player :(
			winner= b.getPlayer(2).getName(); }	
		host.setMessage("Welcome Players...  <br>" + winner + ", click roll to begin");
	}
	
	function loadGt1999() {
	getMe("btop").style= 	"visibility: visible";
	getMe("bright").style= 	"visibility: visible";
	getMe("bbottom").style= "visibility: visible";
	getMe("bleft").style= 	"visibility: visible"; 
	b.getPad(0).style=  "border: none";
	b.getPad(27).style= "border: none"; 		
	loadGametronics1999(); }
	

// ************* GAMETRONICS1999  ********************************************************************************
function loadGametronics1999()							// ONCLICK button function to START GAME 
{														// return here until WINNER... from pad 0, player reaches pad 27
	const rolldiv= document.createElement("div");
	rolldiv.innerHTML= getMe("gametronics1999").innerHTML;
	getMe("bmiddle").innerHTML= "";
	getMe("bmiddle").appendChild(rolldiv);
	
	if(!host.success) {	movePlayerBack(); }				// forgive me... i copied movePlayer() essentially
	host.game= "game";
	
	getMe("bulletin").innerHTML= "eduGAMETRONICS 1999";
	getMe("headerMessage").innerHTML = host.getMessage();
	if (b.getPlaying() >1)	{ b.setTurn(b.getTurn()== 1? 2: 1); }

	for(let i =1; i <= b.getPlaying(); i++) {		// Loop PLAYERS setting name, location and points
		let thisPlayer= b.getPlayer(i);				
		getMe("nameP" +i).innerHTML= thisPlayer.getName();
		getMe("pointsP" +i).innerHTML= "Points: " + thisPlayer.getPoints();
		getMe("locationP" +i).innerHTML= "Location: " + (thisPlayer.getLoc() ===0 ?"Start" :thisPlayer.getLoc()); }

	if(b.getPlaying() >1)	{ multiPlayerStyle(); } 	// style Multiple players mostly to highlight active player
	else					{ getMe("dumpP2").style= "display: none"; }
	b.getPad(0).paint();								// hmmmmmmmmmmm
}
	
	function multiPlayerStyle()							// callback function from loadGametronics1999() 
	{	
		for( let j =1; j <= b.getPlaying(); j++) {		// LOOP players highlighting active player and dimming inactive players
			let bColour= b.getPlayer(j).getColour();
			if( j == b.getTurn()) {						// ActivePlayer has yellow border, messages and full opacity
				getMe("dumpP" +j).style= "border: 4px solid " + bColour +"; opacity: 1";
				getMe("dumpRollP" +j).style= "visibility: visible; color: yellow";
				getMe("rollButtonP" +j).disabled= false; }
			else {										// InActivePlayer has no border, messages and dim appearance
				getMe("dumpP" +j).style= "border: none; opacity: 0.6";
				getMe("rollButtonP" +j).disabled= true;
				getMe("dumpRollP" +j).style= "visibility: hidden"; } }	
		getMe("headerButton").style= "display: none";
	}

	function movePlayer(thisButt)
	{
		const thisPlayer= b.getActivePlayer();
		const rolled= thisPlayer.roll();
		const oldLoc= thisPlayer.getLoc();
		const newLoc= oldLoc + rolled;
		const oldPad= b.getPad(oldLoc);
		const newPad= b.getPad(newLoc);
	
		newLoc >27 ?27: newLoc;
		getMe("headerMessage").innerHTML= thisPlayer.getName() + ", you rolled a " + rolled + "<br>Click play to continue...";
		getMe("messageP" + b.getTurn() ).innerHTML= "Click Play to continue...";
		thisButt.innerHTML= "PLAY";
		thisButt.onclick= function() { playGame(this); };
		
		oldPad.removeGuest();
		oldPad.paint();
		thisPlayer.setLoc(newLoc);
		newPad.addGuest(thisPlayer);
		newPad.paint(); 
	}

	function movePlayerBack() {
		const thisPlayer = b.getActivePlayer();
		const oldLoc= host.getLoc();
		const newLoc= oldLoc- host.getRoll();
		const oldPad= b.getPad(oldLoc);
		const newPad= b.getPad(newLoc);
		
		oldPad.removeGuest();
		oldPad.paint();
		thisPlayer.setLoc(newLoc);
		newPad.addGuest(thisPlayer);
		newPad.paint(); 
	}
		
	function playGame(thisButt)
	{
		let success= false;
		const thisPlayer= b.getActivePlayer();
		const thisPad= b.getPad( thisPlayer.getLoc() );
		
		if(thisPlayer.getLoc() >=27) {
			b.setWinner(b.getActivePlayer());
			loadEnd(); }

		thisButt.style= "display: reset";
		getMe("bulletin").innerHTML= (thisPlayer.getName() + " is playing " + thisPad.getGame() );
		host.setRoll(thisPlayer.getRoll());
		host.setGame(thisPad.getGame());	
		host.setLoc(thisPlayer.getLoc());
		host.setTurn(b.getTurn());
		
		success= thisPad.runGame();
		//loadLangGame();
	}
	
	function menuAbout(){
		
		alert("Team Developer:  Ali,  a.k.a. Bludoid \n" +
				"Team Counsel:      Darren, a.k.a. Jimmy Styles\n\n" +
				"Thank you for playing and attempting to free Billy Bitwise");
	}
		
	function menuSettings(){
		
		alert("Unfortunately, I, Billy Bitwise, was sucked into my game \n" +
				"before I could create my Settings Module. Free me, and I will fix it");
	}
	
	function menuHelp(){
	
		switch( host.getGame() ){
		
		case "game":
			alert("Each player must move by clicking their roll button. \n" +
					"when you see the players has moved, click the PLAY button.\n");
			break;
			
		case "hangman": 
			alert("In this game, the player needs to guess the mystery word, \n" +
					"by clicking the letters on the keyboard provided.  Using the category \n" +
					"and the hints provided with each error, guess the mystery word." );
			break;
			
		case "math":
			alert("Using the math skills that you have \n solve the Inequations presented to you \n" +
					"by clicking on the appropriate operator. \n You just need to answer 5 questions correctly. \n" +
					"But should you answer 3 questions incorrectly, \n" +
					"the challenge is lost and the player is moved back.");
			break; 
		
		case "million":
			alert("This is a Trivia game where you answer questions \n" +
					"by choosing one of the answers provided. You will get 5 questions \n" +
					"and will need to answer 3 of them correctly to succeed in this challenge.");
				break;
				
		case "language":
			alert("In this game you can choose to practice French or German words.\n" +  
					"The hidden image represents the word you need to translate.\n" +			
					"Click as many as 6 tiles to reveal a hint. \n\n" +
					"Tip: Write 'dog' instead of 'the dog'.");
			break;
			
		case "riddle":
			alert("The player only needs to pick from one of the four cards provided.\n" +
					"Each card choosen reveals a mystery game to play and defeat.");		
			break;
			
		default:

			break; }
		}
	
	
	function menuQuit(){
		if(window.confirm("If you really wanna leave right now \n Just click 'ok' to confirm")) {window.close(); }
	}
	
// ****************** LOADLANG  ***************************
var lgTurns = 6;

let lgData =    [
        //["url('images/lg/dog.jpg')", "LE CHIEN", "dog", "DER HUND"],
        ["url('images/lg/cat.png')", "LE CHAT", "cat", "DIE KATZE"], 
        ["url('images/lg/apple.jpg')", "LA POMME", "apple", "DER APFEL"], 
        //["url('images/lg/house.jpg')", "LA MAISON", "house", "DAS HAUS"], 
        ["url('images/lg/red.png')", "ROUGE", "red", "ROT"],
        ["url('images/lg/orange.png')", "ORANGE", "orange", "ORANGE"],
        ["url('images/lg/yellow.png')", "JAUNE", "yellow", "GELB"],
        ["url('images/lg/green.png')", "VERT", "green", "GR&#220;N"],
        ["url('images/lg/blue.png')", "BLEU", "blue", "BLAU"],
        ["url('images/lg/pink.png')", "ROSE", "pink", "ROSA"],
        ["url('images/lg/white.png')", "BLANC", "WEIẞ"],
        ["url('images/lg/black.png')", "NOIR", "black", "SCHWARZ"],
        ["url('images/lg/milk.jpg')", "LE LAIT", "milk", "MILCH"],
        ["url('images/lg/book.jpg')", "LE LIVRE", "book", "DAS BUCH"],
        //["url('images/lg/ocean.jpg')", "L'OCEAN", "ocean", "DER OZEAN"],
        ["url('images/lg/car.jpg')", "LA VOITURE", "car", "DAS AUTO"],
        //["url('images/lg/train.jpg')", "LE TRAIN", "train", "DER ZUG"],
        //["url('images/lg/boat.jpg')", "LE BATEAU", "boat", "DAS BOOT"],
        ["url('images/lg/flower.png')", "LA FLEUR", "flower", "DIE BLUME"],
        //["url('images/lg/tree.jpg')", "L'ARBRE", "tree", "DER BAUM"],
        //["url('images/lg/airplane.jpg')", "L'AVION", "airplane", "DAS FLUGZEUG"],
        //["url('images/lg/cow.jpg')", "LA VACHE", "cow", "DIE KUH"],
        //["url('images/lg/table.jpg')", "LA TABLE", "table", "DER TISCH"],
        //["url('images/lg/chair.jpg')", "LA CHAISE", "chair", "DER STUHL"],
        //["url('images/lg/school.jpg')", "L'&#201;COLE", "school", "DIE SCHULE"],
        ["url('images/lg/juice.jpg')", "LE JUS", "juice", "DER SAFT"],
        ["url('images/lg/water.jpg')", "L'EAU", "water", "DAS WASSER"],
        ["url('images/lg/tea.jpg')", "LE TH&#201;", "tea", "DER TEE"],
        ["url('images/lg/coffee.jpg')", "LE CAF&#201;", "coffee", "DER KAFFEE"],
        ["url('images/lg/chocolate.jpg')", "LE CHOCOLAT", "chocolate", "DIE SCHOKOLADE"],
        ["url('images/lg/banana.jpg')", "LA BANANE", "banana", "DIE BANANE"],
        ["url('images/lg/bread.jpg')", "LE PAIN", "bread", "DAS BROT"],
        //["url('images/lg/computer.jpg')", "L'ORDINATEUR", "computer", "DER RECHNER"],
        ["url('images/lg/shower.jpg')", "LA DOUCHE", "shower", "DIE DUSCHE"],
        //["url('images/lg/kitchen.jpg')", "LA CUISINE", "kitchen", "DIE K&#220;CHE"],
        ["url('images/lg/door.jpg')", "LA PORTE", "door", "DIE T&#220;R"],
        //["url('images/lg/window.jpg')", "LA FEN&#202;TRE", "window", "DAS FENSTER"],
        ["url('images/lg/bike.jpg')", "LE V&#201;LO", "bike", "DAS FAHRRAD"],
        //["url('images/lg/cheese.jpg')", "LE FROMAGE", "cheese", "DER K&#196;SE"],
        //["url('images/lg/butter.jpg')", "LE BEURRE", "butter", "DIE BUTTER"],
        ["url('images/lg/hand.jpg')", "LE MAIN", "hand", "DER HAND"],
        //["url('images/lg/bridge.jpg')", "LE PONT", "bridge", "DIE BR&#220;CKE"],
        //["url('images/lg/city.jpg')", "LA VILLE", "city", "DIE STADT"],
        ["url('images/lg/field.jpg')", "LE CHAMP", "field", "DAS FELD"],
        ["url('images/lg/shoes.jpg')", "LES CHAUSSURES", "shoes", "DIE SCHUHE"],
        ["url('images/lg/watch.jpg')", "LA MONTRE", "watch", "DIE ARMBANDUHR"],
        ["url('images/lg/spoon.jpg')", "LA CUILL&#200;RE", "spoon", "DER L&#214;FFEL"],
        ["url('images/lg/sugar.jpg')", "LES SUCRE", "sugar", "DER ZUCKER"],
        ["url('images/lg/scissors.jpg')", "LES CISEAUX", "scissors", "DIE SCHERE"],
        ["url('images/lg/hat.jpg')", "LE CHAPEAU", "hat", "DER HUT"],
        ["url('images/lg/bike.jpg')", "LE V&#200;LO", "bike", "DAS FAHRRAD"],
        ["url('images/lg/umbrella.jpg')", "LA PARAPLUIE", "umbrella", "DER REGENSCHIRM"],
        ["url('images/lg/knife.jpg')", "LE COUTEAU", "knife", "DAS MESSER"],
        ["url('images/lg/pencil.jpg')", "LE CRAYON", "pencil", "DER BLEISTIFT"],
        ["url('images/lg/keyboard.jpg')", "LE CLAVIER", "keyboard", "DIE TASTATUR"],
        ["url('images/lg/key.jpg')", "LA CL&#200;", "key", "DER SCHL&#220;SSEL"],
        ["url('images/lg/fork.jpg')", "LA FOURCHETTE", "fork", "DIE GABEL"],
        ["url('images/lg/clock.jpg')", "L'HORLOGE", "clock", "DIE UHR"],
        //["url('images/lg/.jpg')", "", "", ""],
        //["url('images/lg/.jpg')", "", "", ""],
        //["url('images/lg/.jpg')", "", "", ""],
        
        
    ];

randomData = lgData[Math.floor(Math.random() * lgData.length)];

function loadLangGame() {
    let gameScreen = getMe("bmiddle");
    let myGame = document.createElement("div");
    myGame.setAttribute("id", "myGame");
    myGame.innerHTML = "<h3>&#160;&#160;Choose a language to practice :</h3>";
    myGame.innerHTML += "<button type='button' class='lgChooseL' id='lgF' onclick='lgChoose(this.id)'> FRENCH </button>";
    myGame.innerHTML += "<button type='button' class='lgChooseL' id='lgG' onclick='lgChoose(this.id)'> GERMAN </button>";
    gameScreen.innerHTML = "";
    gameScreen.appendChild(myGame);
} 

function lgChoose(lgChosen) {
    let gameScreen = getMe("bmiddle");
    let myGame = getMe("myGame");
    myGame.innerHTML = document.getElementById("langGame").innerHTML;
    myGame.style.marginLeft = "10px";
    document.getElementById("imageFrame").style.backgroundImage = randomData[0];
    if (lgChosen == "lgF") {
        getMe("lgChosenL").innerHTML = "French";
        getMe("lgWord").innerHTML = randomData[1] + "&#32;-&#32;";
    }
    else if (lgChosen == "lgG") {
        getMe("lgChosenL").innerHTML = "German";
        getMe("lgWord").innerHTML = randomData[3] + "&#32;-&#32;";
    }
}

function makeInvisible(myId){
    getMe(myId).style.visibility = "hidden";     
    getMe(myId).disabled = true;  
    lgTurns--;
    getMe("lgBar" + String(lgTurns)).style.visibility = "hidden";
    if (lgTurns == 1) {
        document.getElementById("lgHint").innerHTML = "<span id='lgInfo'> i </span> &#160;You can get one last hint.";
        document.getElementById("lgInfo").style.border = "2px solid orange";
    }
    else if (lgTurns < 1) {
        let lgButtons = document.getElementsByClassName("lgReveal");
        for(let lgButton of lgButtons) {
        lgButton.disabled = true;
        }
    getMe("lgHint").innerHTML = "<span id='lgInfo'> i </span> &#160;You are out of hints.";
    getMe("lgInfo").style.border = "2px solid red";
    getMe("lgQSection").innerHTML += '<button type="button" class="continueButton" id="lgGive" class="lgButtons" onclick="lgGiveUp()">GIVE UP</button>'; // create give up button
    }
}

function answerLang() {
    let myAnswer = document.getElementById("inputAnswer").value;
    if (myAnswer == randomData[2]) {
        getMe("lgQSection").innerHTML = "AWESOME, that's correct :-)  ";
        getMe("lgQSection").innerHTML += '<button type="button" class ="continueButton" id="lgContinue" onclick="lgFinish(true)">CONTINUE</button>';
        lgRevealAll();
    }
    else {alert("wrong, please try again :-)")}
}

function lgGiveUp () {
    getMe("lgHeader").innerHTML = "The correct answer was: " + randomData[2];
    getMe("lgQSection").innerHTML = '<button type="button" class="continueButton" id="lgContinue" onclick="lgFinish(false)">CONTINUE</button>';
    lgRevealAll();
    
}

function lgRevealAll() {
    let myButtons = document.getElementsByClassName("lgReveal");
    for (myButton of myButtons) {
        myButton.style.visibility = "hidden";    
    }    
}


function lgFinish(win) {
    if(win) {
		host.setSuccess(true);
		host.setPoints(50);
		b.getActivePlayer().addPoints(50);
		host.setMessage("Well done " + b.getActivePlayer().getName() );
	}
	else {
		host.setSuccess(false);
		host.setPoints(0);
		host.setMessage("Better Luck next time " + b.getActivePlayer().getName() ); 
	}
	resetLang();
	loadGametronics1999(); 
}


function resetLang() {
    lgTurns = 6;
    randomData = lgData[Math.floor(Math.random() * lgData.length)];
}


//**********************  HANGMAN **************************
function loadHangman()
{	
	
	let herDiv= document.createElement("div");
	herDiv.innerHTML= getMe("hangman").innerHTML;
	getMe("bmiddle").innerHTML= "";
	getMe("bmiddle").appendChild(herDiv);
	
	hmAlphabet= hm_Keyboard(false);
	hm_Word();
	w.lives= 5;
}

function hm_Keyboard(hmLowcap)  // lowcap is boolean, true is lowercase 
{
	let hmLetters= [];
	for ( hmLowcap ? n= 97: n= 65; hmLowcap ? n<123: n<91; n++)
	{	let hmButt = document.createElement("button");
		let hmVal  = String.fromCharCode(n);
		
		getMe("hmKeyboard").appendChild(hmButt);
		with(hmButt){
			id= hmVal.toLowerCase();  
			innerHTML= hmVal;  
			onclick= function(){ hm_KeyClick(this)}; }

		hmLetters.push(hmVal);
	}	return(hmLetters);
}

function hm_Word()  // visible is boolean, Word revealed if true
{
	w.pick();
	getMe("hmCategory").innerHTML= ( w.category);

	for(let i in w.picked)
	{	let hmButt = document.createElement("button");
		with(hmButt){
			id= "ltr" + i;
			innerHTML= w.picked[i];  //textnode
			style.color= "#555";
			style.visibility= (innerHTML== " " ? "hidden" : "visible"); }
		
		getMe("hmWordTray").appendChild(hmButt);
	}	return;
} 

function hm_KeyClick(butt)
{
	let ok= false;
	let clicked= butt.id.toLowerCase();
	let snd = new Audio("sounds/pfew.wav");
	snd.volume= 1;
	butt.className = "hide";
	
	for (let i in w.picked)  // is letter in word
	{	if(w.picked[i].toLowerCase() === clicked)
		{
			ok= true;
			w.solved[i]= true;
			getMe("ltr"+i).style.color = "#aaa"; 		
		}
	}
	
	if (w.solved.includes(false) === false) {hm_Win(true);}   // solved is true.. you win
	if (!ok)  // letter not found
	{	snd.play();
		w.lives--;
		getMe("hmImage").src= (w.lives > 4 ? "images/hm/happy.png" : "images/hm/" + faces[w.lives]);
		if(!w.lives) { hm_Win(false); }      // You lost all your lives.. You're toast.
		if(w.lives< 4 && w.lives> 0)	{ getMe("hmHint" + w.lives).innerHTML = w.hints[w.lives-1]; }
	}
}

function hm_Win(win)
{
	let butts= document.querySelectorAll("hmKeyboard");

	for(let b of butts) {b.className="hide";}
	for(let i in w.picked)	{getMe("ltr"+i).style.color= "#aaa";}
	
	if(win) {
		host.setSuccess(true);
		host.setPoints(50);
		b.getActivePlayer().addPoints(50);
		host.setMessage("Well done " + b.getActivePlayer().getName() );
		setTimeout(getMe("hmHints").innerHTML= "You won", 2000);
		setTimeout(getMe("hmImage").src= "images/hm/first.png", 3000);
		setTimeout(getMe("hangman").className= "hide", 2000); }
	else {
		host.setSuccess(false);
		host.setPoints(0);
		host.setMessage("Better Luck next time " + b.getActivePlayer().getName() ); }
	
	loadGametronics1999(); 
	return;
}

//**********************  BIGGER **************************

var biggerQuestion = 1;       // number of question (first, second, third,...)
var biggerCorrect;            // stores correct choice/answer for the question 
var biggerStrikes = 0;        // how many strikes
var biggerDone = [];          // which questions have been done in this round - store dataIndex 
var biggerDataIndex = 0;      // index to choose and store the the question
var biggerRandomData;         // line from the database based on biggerDataIndex

let biggerData = [              // &#215; == times ... &#247; == division
    ["4+4", "9-2", "b0"], 
    ["5&#215;4", "31-10", "b2"],
    ["4&#247;2", "8&#247;4", "b1"],
    ["4&#215;6", "40-18", "b0"],
    ["4+10+8", "32-8", "b2"],
    ["27&#247;3", "2&#215;2&#215;2", "b0"],
    ["13+7-1", "31-12", "b1"],
    ["15&#247;3", "25&#247;5", "b1"],

	["2&#215;6", "6+2+6", "b2"],
    ["36&#247;9", "25&#247;5", "b2"],
    ["2+13", "30&#247;3", "b0"],
    ["5&#215;7", "6&#215;6", "b2"],
    ["4&#215;4", "3&#215;5", "b0"],
    ["20-8", "15-3", "b1"],
    ["3+6+5", "5&#215;3", "b2"],
    ["28-13", "20-6", "b0"],
    ["7&#215;5", "44-11", "b0"],
    ["13+4+5", "18+4", "b1"],
    ["48&#247;6", "32&#247;4", "b1"],
    ["4-3+12", "10-5+7", "b0"],
    ["41-7-5", "18+6+4", "b0"],
    ["8&#215;3", "6&#215;4", "b1"] ];


function loadBigger(){
    if (biggerQuestion > 5 || biggerStrikes > 2) {resetBigger()}
    while (biggerDone.length === 0 || biggerDone.includes(biggerDataIndex)) {
        biggerDataIndex = Math.floor(Math.random() * biggerData.length);
        if (biggerDone.includes(biggerDataIndex) === false) {break}
    }
    biggerDone.push(biggerDataIndex);
    biggerRandomData = biggerData[biggerDataIndex];
    let gameScreen = getMe("bmiddle");
    let myGame = document.createElement("div");
    myGame.setAttribute("id", "myGame");
    myGame.innerHTML = document.getElementById("biggerGame").innerHTML;
    gameScreen.innerHTML = "";
    gameScreen.appendChild(myGame);
    myGame.style.marginLeft = "15px";
    getMe("biggerL").innerHTML = biggerRandomData[0];
    getMe("biggerR").innerHTML = biggerRandomData[1];
    biggerCorrect = biggerRandomData[2];
    getMe("noOfQB").innerHTML = biggerQuestion;
    if (biggerStrikes > 0) {
        for (let strikes = 1; strikes<=biggerStrikes; strikes++) {
            getMe("biggerBar" + String(strikes)).style.visibility = "hidden";
        }
    }
}

function answerBigger(myID){
    let biggerFeed = getMe("biggerFrame");
    biggerFeed.innerHTML = ""; 
    if (myID == biggerCorrect) {
        biggerFeed.innerHTML = "<h3> YOU ARE CORRECT :-)</h3>"; // load screen you're correct, includes button to next question, 
    }
    else {
        biggerStrikes++;
        getMe("biggerBar" + String(biggerStrikes)).style.visibility = "hidden";
        if (biggerStrikes === 3) {
            getMe("biggerQuestion").innerHTML = "";
            biggerFeed.innerHTML = "<h3>3 strikes out :-(</h3>";
            biggerFeed.innerHTML += '<br><button type="button" class="continueButton" id="biggerContinue" onclick="biggerFinish(false)">CONTINUE</button>';
            return;
        }
        else {
            biggerFeed.innerHTML = "THAT IS WRONG :-(";
        }
    }
    biggerQuestion++;
    if (biggerQuestion > 5) {
        biggerFeed.innerHTML = "<h3>WELL DONE</h3>";
        biggerFeed.innerHTML += '<br><button type="button" class="continueButton" id="biggerContinue" onclick="biggerFinish(true)">CONTINUE</button>';
    }
    else {
        biggerFeed.innerHTML += "<br><br><button type='button' class='continueButton' id='nextBigger' onclick='loadBigger()'>NEXT QUESTION</button>";
    }
    // take care of repeats (no question repetition)
}

function resetBigger() {
    biggerQuestion = 1;      
    biggerStrikes = 0;        
    biggerDone = [];          
    biggerDataIndex = 0;   
}

function biggerFinish(win) {
    if(win) {
		host.setSuccess(true);
		host.setPoints(50);
		b.getActivePlayer().addPoints(50);
		host.setMessage("Well done " + b.getActivePlayer().getName() );
	}
	else {
		host.setSuccess(false);
		host.setPoints(0);
		host.setMessage("Better Luck next time " + b.getActivePlayer().getName() ); 
	}
	resetBigger();
	loadGametronics1999(); 
} 


//**********************  MILLIONAIRE  **************************

var millQuestion = 1;       // number of question (first, second, third,...)
var millCorrect;            // stores correct choice/answer for the question 
var millStrikes = 0;        // how many strikes
var millDone = [];          // which questions have been done in this round - store dataIndex 
var dataIndex = 0;          // index to choose and store the the question
var millRandomData;         // line from the database based on dataIndex

let millData = [
    ["What is the largest country in the world?", "USA", "Brazil", "Canada", "Russia", "m4"], 
    ["What country has the largest population in the world?", "Brazil", "China", "India", "Nigeria", "m2"],
    ["What is the capital of the USA?", "New York", " Washington D.C.", "Los Angeles", "Miami", "m2"],
    ["Which country is not in Europe?", "Switzerland", "Latvia", "Panama", "Montenegro", "m3"],
    ["What is the largest island in the world?", "Iceland", "Australia", "Greenland", "Madagascar", "m3"],
    ["What is the Capital of Great Britain?", "Berlin", "Madrid", "Oslo", "London", "m4"],
    ["What is the Capital of Spain?", "Madrid", "London", "Sydney", "Lisbon", "m1"],
    ["What is the tallest mountain in the world?", "Mount McKinley", "Mont Blanc", "Mount Rushmore", "Mount Everest", "m4"],
    ["Which country is not in Asia?", "Liberia", "Japan", "China", "Mongolia", "m1"],
	
	["What are 5th to 15th century times called?", "Upper Ages", "Middle Ages", "Lower Ages", "Old Ages", "m2"],
    ["When did first people land on the Moon?", "in 60's", "in 70's", "in 80's", "never", "m1"],
    ["What country are Pyramids in?", "Italy", "Greece", "Egypt", "Israel", "m3"],
    ["What country is Eiffel Tower in?", "Italy", "England", "Spain", "France", "m4"],
    ["What is the capital of France?", "Madrid", "Prague", "Paris", "Rome", "m3"],
    ["What city hosted 2020 Olympics?", "Tokyo", "Beijing", "Sydney", "Berlin", "m1"],
    ["Great wall of China is in...", "Europe", "North America", "Asia", "Australia", "m3"],
    ["The country 'France' is in...", "Europe", "North America", "Asia", "Australia", "m1"],
    ["The country 'Japan' is in...", "Europe", "North America", "Asia", "Australia", "m3"],
    ["The Niagara Falls are in...", "Europe", "North America", "Asia", "Australia", "m2"],
    ["How many zeros does a million have?", "3", "9", "0", "6", "m4"],
    ["What do people with Claustrofobia fear?", "small spaces", "heights", "darkness", "water", "m1"],
    ["What is the taste of ocean water?", "sweet", "salty", "sour", "vanilla", "m2"],
    ["Which one of these doesn't belong?", "dog", "cat", "table", "mouse", "m3"],
    ["Which one of these doesn't belong?", "Paris", "London", "Spain", "Rome", "m3"],
    ["Which one of these doesn't belong?", "computer", "window", "chimney", "wall", "m1"],
    ["Which one of these doesn't belong?", "bike", "skates", "scooter", "shoes", "m4"],
    ["Which one of these doesn't belong?", "butter", "honey", "bread", "cup", "m4"],
    ["Which one of these doesn't belong?", "pencil", "magazine", "newspaper", "book", "m1"],
    ["Closest planet to the Sun?", "Earth", "Mercury", "Mars", "Venus", "m2"],
    ["Decathlon has...", "2 disciplines", "6 disciplines", "10 disciplines", "14 disciplines", "m3"],
    ["Words used for class of people, places, or things...", "nouns", "adjectives", "verbs", "proverbs", "m1"],
    ["Which language is most used in South America?", "Portuguese", "Spanish", "English", "French", "m2"],
    ["What country drives cars on right side?", "Japan", "France", "USA", "Canada", "m1"] ];
    

function loadMill(){
    if (millQuestion > 5 || millStrikes > 2) {resetMill()}
    while (millDone.length === 0 || millDone.includes(dataIndex)) {
        dataIndex = Math.floor(Math.random() * millData.length);
        if (millDone.includes(dataIndex) === false) {break}
    }
    millDone.push(dataIndex);
    millRandomData = millData[dataIndex];
    let gameScreen = getMe("bmiddle");
    let myGame = document.createElement("div");
    myGame.setAttribute("id", "myGame");
    myGame.innerHTML = document.getElementById("millGame").innerHTML;
    gameScreen.innerHTML = "";
    gameScreen.appendChild(myGame);
    myGame.style.marginLeft = "15px";
    getMe("millQuestion").innerHTML = millRandomData[0];
    getMe("m1").innerHTML = millRandomData[1];
    getMe("m2").innerHTML = millRandomData[2];
    getMe("m3").innerHTML = millRandomData[3];
    getMe("m4").innerHTML = millRandomData[4];
    millCorrect = millRandomData[5];
    getMe("noOfQ").innerHTML = millQuestion;
    if (millStrikes > 0) {
        for (let strikes = 1; strikes<=millStrikes; strikes++) {
            getMe("millBar" + String(strikes)).style.visibility = "hidden";
        }
    }
}

function answerMill(myID){
    let millFeed = getMe("millQ");
    millFeed.innerHTML = ""; 
    getMe("millChoices").innerHTML = "";
    if (myID == millCorrect) {
        millFeed.innerHTML = "<h3> YOU ARE CORRECT :-)</h3>"; // load screen you're correct, includes button to next question, 
    }
    else {
        millStrikes++;
        getMe("millBar" + String(millStrikes)).style.visibility = "hidden";
        if (millStrikes === 3) {
            millFeed.innerHTML = "<h3>3 strikes out :-(</h3>";
            millFeed.innerHTML += '<br><button type="button" class="continueButton" id="millContinue" onclick="finishMill(false)">CONTINUE</button>';
            return;
        }
        else {
            millFeed.innerHTML = "THAT IS WRONG :-(";
        }
        // say what was correct answer
    }
    millQuestion++;
    if (millQuestion > 5) {
        millFeed.innerHTML = "<h3>WELL DONE</h3>";
        millFeed.innerHTML += '<br><button type="button" class="continueButton" id="millContinue" onclick="finishMill(true)">CONTINUE</button>';
    }
    else {
        millFeed.innerHTML += "<br><br><button type='button' class='continueButton' id='nextMill' onclick='loadMill()'>NEXT QUESTION</button>";
    }
    // take care of repeats (no question repetition)
}

function resetMill() {
    millQuestion = 1;      
    millStrikes = 0;        
    millDone = [];          
    dataIndex = 0;          
}

function finishMill(win) {
    if(win) {
		host.setSuccess(true);
		host.setPoints(50);
		b.getActivePlayer().addPoints(50);
		host.setMessage("Well done " + b.getActivePlayer().getName() );
	}
	else {
		host.setSuccess(false);
		host.setPoints(0);
		host.setMessage("Better Luck next time " + b.getActivePlayer().getName() ); 
	}
	resetMill();
	loadGametronics1999(); 
}


//*********************************************************

function loadRiddle() {

	let herDiv= document.createElement("div");
	herDiv.innerHTML= getMe("riddle").innerHTML;
	getMe("bmiddle").innerHTML= "";
	getMe("bmiddle").appendChild(herDiv);
	const picks = [ "hangman", "language", "million", "math" ];
	
	for(let ctr in picks){
		
		let card= document.createElement("button");
		with(card){
			id= "r" + ctr;  
			innerHTML= ctr;
			value= picks[ctr];
			className= "cards";
			src= "images/riddle/card.png";
			onclick= function() { riddlePick(this.value) }; }
		getMe("riddleBox").appendChild(card);	} 
}

	function riddlePick(pick){

		b.getActivePlayer().addPoints(25);
		host.setRoll(b.getActivePlayer().getRoll());
		host.setLoc(b.getActivePlayer().getLoc());
		host.setTurn(b.getTurn());
		host.setGame(pick);
		
		switch(pick) {	

			case "hangman":
				loadHangman();
				break;
		
			case "language":
				loadLangGame();
				break;
			
			case "million":
				loadMill();
				break;
			
			case "math":
				loadBigger();
				break; }
	}
	
	
function loadEnd() {

	let herDiv= document.createElement("div");
	herDiv.innerHTML= getMe("endGame").innerHTML;
	getMe("bmiddle").innerHTML= "";
	getMe("bmiddle").appendChild(herDiv);
	b.getActivePlayer().addPoints(100);
	
}

//
//**********************     GLOBAL ARRAYS       ***********************

const faces = 	['toast.png', 'sick.png', 'worried.png', 'content.png', 'happy.png'];
const HMdata = 
	
[	[ "MATHEMATICS" ],
	[ "algebra", 'a study of mathematics', 'similar to arithmetic', 'can use letters to act like numbers' ],
	[ "subtraction", 'a popular operator', 'used to deduct', 'looks flat' ],
	[ "multiplication", 'a popular operator', 'used to increase a value', 'looks like a letter' ],
	[ "division", 'a popular operator', 'used to decrease a value', 'think fractions' ],
	[ "formula", 'looks like an equation', 'expresses relationships between values', 'C= 5/9F -32' ],
	[ "square root", 'a specific division', 'used to decrease a value', 'shape' ],
	[ "geometry", 'a study of mathematics', 'concerned with properties of space', 'Euclid' ],
	[ "equation",  'used in arithmetic', 'needs two expressions', 'vowels' ],
	[ "calculator",  'began as a handheld device', 'your computer should have one', 'great for arithmetic' ],
	[ "fraction", 'repreents a part of a whole', 'has a numerator', 'has a denominator' ],
// NEW	 	
	[ "COMPUTERS" ],
	[ "keyboard", 'a computer peripheral', 'abc123', 'typewriter' ],
	[ "internet", 'you might be using it now', 'no Youtube without it', 'a global web of interconnected networks' ],
	[ "browser", 'you might be using one now', 'Google Chrome', 'MicroSoft Internet Explorer' ],
	[ "mouse", 'you might be using one now', 'small device', 'uses a pointer' ],
	[ "software", 'coders create it', 'an intangible item', 'an app is another word for it' ],
	[ "tablet", 'small device', 'where is the keyboard?', 'looks like a monitor' ],
	[ "laptop", 'small device', 'where is my numeric keypad?', 'most have a touch pad' ],
	[ "download", 'involves software', 'takes a bit of time', 'careful of viruses' ],
	[ "upload", 'involves software', 'takes a bit of time', 'cloud your data' ],
	[ "resolution", 'pertains to monitors', 'a measurment of quality', 'see what I mean' ],
	[ "peripheral", 'a device', 'attaches to computers', 'you might be using one now' ],
	[ "hardware", 'an Intel processor', 'tangible computer components', 'an peripheral is an example' ],
// NEW
	[ "COUNTRIES" ],
	[ "United Kingdom", 'European nation', 'uses Pound for money', 'ruled by Queen Elizabeth' ],
	[ "Iceland", 'Nothern nation', 'only half million population', 'Capital city: Reykjav&#237;k' ],
	[ "United States", 'geographically large', 'relatively young nation', 'capital city is in the District of Columbia' ],
	[ "Madagascar", 'African nation', 'Island nation', 'Disney movie' ],
	[ "Canada", 'geographically large', 'relatively young nation', 'Capital city: Ottawa' ],
	[ "South Africa", 'southern nation', 'African country', 'Capital city: Johannesburg' ],
	[ "Pakistan", 'close to India', 'population: 220 Million', 'Capital city: Islamabad' ],
	[ "Saudi Arabia", 'middle eastern nation', 'very rich in oil resources', 'large Muslim population' ],
	[ "North Korea", 'East Asian nation', 'governed by Dictatorship', 'Capital city: Pyongyang' ],
	[ "Australia", 'Southern nation', 'they drive on the left side', 'uses Dollar for money' ],
	[ "Ireland", 'European nation', 'Largest city: Dublin', 'Island nation'],
	[ "Greenland", 'Northern nation', 'Very low population', 'Capital city: Nuuk' ],
	[ "Czech Republic", 'European nation', 'Land locked nation', 'Capital city: Prague' ],
	[ "New Zealand", 'Southern nation', 'contains a Z', 'Island nation' ],
	[ "Switzerland", 'European nation', 'uses Franc as money', 'Largest city: Z&#252;rich' ]
];

let hmCategoriesCategories= 
[
	["Popular Websites",
	'Facebook', 'Youtube', 'Instagram', 'TikTok', 'Twitter',
	'SnapChat', 'WhatsApp', 'Linkedin', 'Twitch', 'Google'],

	["Computer terminology",
	'keyboard', 'mouse', 'monitor', 'laptop', 'desktop',
	'tablet', 'internet', 'software', 'download', 'resolution'],

	["Countries",
	"United Kingdom", "Czech Republic","United States","El Salvador",
	"South Africa","Pakistan","Saudi Arabia", "North Korea", "Guatemala",
	"Ireland","Poland","Greenland","Iceland","New Zealand","Switzerland",
	"Netherland","Finland","Thailand","Swaziland","Madagascar","Australia"],

	["Musical Instruments",
	'piano', 'electric guitar', 'clarinet', 'drum stick', 'tambourine', 'banjo',
	'bagpipes', 'saxophone', 'ukulele', 'violin', 'trumpet', 'accordian', 'harp',
	'flute', 'tuba', 'french horn', 'synthesizer', 'oboe', 'cello', 'harmonica',
	'harpsichord', 'fiddle', 'snare drum', 'cymbal', 'didgeridoo', 'xylophone',
	'organ', 'sound board', 'mixer', 'lyre', 'tuba', 'trombone', 'bass guitar'],
				
	["Periodic Table",
	'Hydrogen','Helium','Lithium','Beryllium','Boron','Carbon',
	'Nitrogen','Oxygen','Fluorine','Neon','Sodium','Magnesium'],

	["Heavy Living Things",
	'Hippopotamus','Rhinoceros', 'Elephant','Giraffe','Crocodile',
	'Whale','Bison','Alligator','Horse','Cattle','Moose','Shark']];





	
	
//	THE END					

