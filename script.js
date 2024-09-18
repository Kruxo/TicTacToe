const gameBoard = document.querySelector("#gameBoard")
const infoDisplay = document.querySelector("#info")
const startCells = [ "", "", "", "", "", "", "", "", ""] //9 empty cells
const resetBtn = document.getElementById("resetBtn")
let playerScore = document.getElementById("playerScore");
let cpuScore = document.getElementById("cpuScore");
let go = "circle"

playerScore.innerText += 0
cpuScore.innerText += 0
display("Player's turn")
createBoard()

function display(message) {
    const formattedMessage = message.replace(/Player/, '<p class="circle-info">Player</p>')
                                   .replace(/CPU/, '<p class="cross-info">CPU</p>');
    infoDisplay.innerHTML = formattedMessage; 
}

function createBoard() {
    // Creates 9 empty divs for each items in the array and appends it to the gameboard
    startCells.forEach( (cell, index) => {
        const cellElement = document.createElement("div")
        cellElement.classList.add("square") // Creates and adds css to this element
        cellElement.id = index // Gives each square cells an index from 0-8
        cellElement.addEventListener("click", addGo)
        gameBoard.append(cellElement)
    })
}

function addGo(e){ // e.target is the exact div that has been clicked on, if we use only e as argument we can see all the information on that clicked square in inspecter tools
    const goDisplay = document.createElement("p") //creates a p tag and appends it on the square thats clicked on
    goDisplay.classList.add(go) // go has "circle" as a string so we are adding the .circle css properties in this case
    goDisplay.innerText = "O"
    go = "cross"
    e.target.append(goDisplay)
    
    display(`CPU's turn`)
    e.target.removeEventListener("click", addGo) // Removes the addeventlister so we cant click on the same square again
    e.target.di
    disableUserClicks();

    checkScore()
    
    if (!isGameOver()) {
        setTimeout(() => {
            cpuMove(); 
            enableUserClicks(); 
        }, 1000);
    }
}

function checkScore() {
    const allSquares = document.querySelectorAll(".square") // Fetching all the div with the square class if we use console.log(allSquares) we can see a nodelist containing the divs and its name and index so we now how and what to target
    const winningCombos = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ]

    let isGameWon = false;

    winningCombos.forEach(array => { // We are checkning in each array (also called array) in winningCombos and then checking if each cell (also called cell) in that array for example [0,1,2] if firstchild of each cell in that array is a circle so if 0 is a cirle, and then if 1 is a circle and if 2 is a circle, then we got a winning combo
        const circleWins = array.every(cell => allSquares[cell].firstChild?.classList.contains("circle"))
        const crossWins = array.every(cell => allSquares[cell].firstChild?.classList.contains("cross"))

        if (circleWins) {
            display("Player&nbspwins!")
            isGameWon = true;
            allSquares.forEach(square => 
                square.replaceWith(square.cloneNode(true))) // clone the square and removes existing eventlisteners on it to stop the game
            resetBtn.innerText = "Play again!"
            playerScore.innerText ++;
            }
        else if (crossWins) {
            display("CPU&nbspwins!")
            isGameWon = true;
            allSquares.forEach(square => 
                square.replaceWith(square.cloneNode(true)))
            resetBtn.innerText = "Play again!"
            cpuScore.innerText ++;
            }
        
    })

    // [...] turns allSqaures to an array since it is a nodelist and by doing that we can use the methods that we normally an use on arrays like every() that checks if every element in that array satfies gives condition
    // the first square.firstChild checks if the the div with that class square has ANY child elements, and only so will we check the other condition that if that square is a circle or cross.
    if(!isGameWon) {
        const allSquaresFilled = [...allSquares].every(square =>
            square.firstChild && (square.firstChild.classList.contains("circle") || square.firstChild.classList.contains("cross"))
        )

        if(allSquaresFilled) {
            display("It's a draw")
            allSquares.forEach(square => 
                square.replaceWith(square.cloneNode(true)))
            resetBtn.innerText = "Play again!"
        }
    }

}   

function cpuMove() {
    const allSquares = document.querySelectorAll(".square");
    
    // Finds all available squares (those without any children)
    const availableSquares = [...allSquares].filter(square => !square.firstChild);
    
    if (availableSquares.length > 0) {
        // Randomly select an available square
        const randomSquare = availableSquares[Math.floor(Math.random() * availableSquares.length)];
        
        // Make CPU move (cross)
        const goDisplay = document.createElement("p");
        goDisplay.classList.add("cross"); // CPU is cross
        goDisplay.innerText = "X"
        randomSquare.append(goDisplay);
        randomSquare.removeEventListener("click", addGo); // Disable future clicks on this square

        go = "circle"; // Switch back to player's turn
        display(`Player's turn`)
        checkScore();
    }
}

function isGameOver() {
    const message = infoDisplay.textContent;
    return message.includes("wins") || message.includes("draw");
}


resetBtn.addEventListener("click", () => {
    const allSquares = document.querySelectorAll(".square");
    
    // Clear all squares by removing any children (circle/cross) inside the square
    allSquares.forEach(square => {
        square.innerHTML = ""; // This removes any inner content, basically sets it to an empty string
        square.addEventListener("click", addGo); // Re-enable the click event listener
    });

    // Reset the turn to "circle"
    go = "circle";
    display(`Player's turn`)
    resetBtn.innerText = "Reset Game"
});

// Disable clicks on all squares
function disableUserClicks() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach(square => {
        square.removeEventListener("click", addGo); // Temporarily remove the event listener
    });
}

// Re-enable clicks on empty squares
function enableUserClicks() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach(square => {
        if (!square.firstChild) {
            square.addEventListener("click", addGo); // Re-add the event listener to empty squares
        }
    });
}
