const gameBoard = document.querySelector("#gameBoard")
const infoDisplay = document.querySelector("#info")
const startCells = [ "", "", "", "", "", "", "", "", ""] //9 empty cells
const resetBtn = document.getElementById("resetBtn")
const soundToggleIcon = document.getElementById("soundToggleIcon")
const resetScoreIcon = document.getElementById("resetScoreIcon")
let soundEnabled = true // Sound is enabled by default
let playerScore = parseInt(localStorage.getItem("player")) || 0
let cpuScore = parseInt(localStorage.getItem("cpu")) || 0
let playerScoreElement = document.getElementById("playerScore")
let cpuScoreElement = document.getElementById("cpuScore")
let go = "circle"

createBoard()
display("Player's turn")
displayScore()

function display(message) {
    const formattedMessage = message.replace(/Player/, '<p class="circle-info">Player</p>')
                                   .replace(/CPU/, '<p class="cross-info">CPU</p>')
    infoDisplay.innerHTML = formattedMessage 
}

function createBoard() {
    // Creates 9 empty divs for each items in the array and appends it to the gameboard
    startCells.forEach( (cell, index) => {
        const cellElement = document.createElement("div")
        cellElement.classList.add("square") // Classlist adds css to the element
        cellElement.id = index // Gives each square cells an index from 0-8
        cellElement.addEventListener("click", addGo)
        gameBoard.append(cellElement)
    })
}

function addGo(e){ // e.target is the exact div that has been clicked on, if we use only e as argument we can see all the information on that clicked square in inspecter tools
    const goDisplay = document.createElement("p") // Creates a p tag 
    goDisplay.classList.add(go) // go has "circle" as a string so we are adding the .circle css class properties to the p tag in this case
    goDisplay.innerText = "O"
    go = "cross"
    e.target.append(goDisplay) // Appends the p tag that we created above
    playSound("playerClick")

    display(`CPU's turn`)
    e.target.removeEventListener("click", addGo) // Removes the addEventlListener so we cant click on the same square again

    checkScore()
    
    if (!isGameOver()) {
        disableUserClicks()
        setTimeout(() => {
            cpuMove() 
        }, 1000)
    }
}

function checkScore() {
    const allSquares = document.querySelectorAll(".square") // Fetches all the div with the square class. If we use console.log(allSquares) we can see a nodelist containing the divs and its name and index so we now how and what to target
    const winningCombos = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ]

    let isGameWon = false

    winningCombos.forEach(array => { // We are checkning in each array (also called array) in winningCombos and then checking if each cell (also called cell) in that array for example [0,1,2] if firstchild of each cell in that array is a circle so if 0 is a cirle, and then if 1 is a circle and if 2 is a circle, then we got a winning combo
        const circleWins = array.every(cell => allSquares[cell].firstChild?.classList.contains("circle"))
        const crossWins = array.every(cell => allSquares[cell].firstChild?.classList.contains("cross"))

        if (circleWins) {
            isGameWon = true
            handleWin("Player")
            array.forEach(cell => {
                allSquares[cell].classList.add('winning-square')
            })
        } else if (crossWins) {
            isGameWon = true
            handleWin("CPU")
            array.forEach(cell => {
                allSquares[cell].classList.add('winning-square')
            })
        }
        
    })

    // [...] turns allSqaures to an array since it is a nodelist and by doing that we can use the methods that we normally can use on arrays like every() that checks if every element in that array satfies given condition
    // the first square.firstChild checks if the the div with that class square has ANY child elements, and only so will we check the other condition that if that square is a circle or cross.
    if(!isGameWon) {
        const allSquaresFilled = [...allSquares].every(square =>
            square.firstChild && (square.firstChild.classList.contains("circle") || square.firstChild.classList.contains("cross"))
        )

        if(allSquaresFilled) {
            display("It's a draw")
            disableUserClicks()
            resetBtn.innerText = "Play again!"
            playSound("draw")
        }
    }

}   

function getScore(winner) {
    if (winner === "Player") {
        playerScore++
        localStorage.setItem("player", playerScore) // Sets updated score in localstorage
        playerScoreElement.textContent = playerScore // Sets new score to UI
    } else if (winner === "CPU") {
        cpuScore++
        localStorage.setItem("cpu", cpuScore) 
        cpuScoreElement.textContent = cpuScore 
    }
}

function handleWin(winner) {
    disableUserClicks()
    display(`${winner}&nbspwins!`)
    if (winner === "Player") {
        getScore("Player")
        playSound("playerWin")
    } else {
        getScore("CPU")
        playSound("cpuWin")
    }
    resetBtn.innerText = "Play again!"
}

function displayScore() {
    playerScoreElement.textContent = playerScore
    cpuScoreElement.textContent = cpuScore
}

resetScoreIcon.addEventListener("click", resetScore)

function resetScore(){
    localStorage.clear()
    playerScore = 0
    cpuScore = 0
    playerScoreElement.textContent = playerScore
    cpuScoreElement.textContent = cpuScore
}

function cpuMove() {
    const allSquares = document.querySelectorAll(".square")
    
    // Finds all available squares (those without any children)
    const availableSquares = [...allSquares].filter(square => !square.firstChild)
    
    if (availableSquares.length > 0) {
        const randomSquare = availableSquares[Math.floor(Math.random() * availableSquares.length)]
        const goDisplay = document.createElement("p")

        goDisplay.classList.add("cross") // CPU is cross
        goDisplay.innerText = "X"
        randomSquare.append(goDisplay)
        playSound("cpuClick")
        randomSquare.removeEventListener("click", addGo) 

        checkScore()

         // Only re-enable clicks if the game is NOT over
         if (!isGameOver()) {
            enableUserClicks() 
            go = "circle" 
            display(`Player's turn`)
        } 
    }
}

function isGameOver() {
    const message = infoDisplay.textContent
    return message.includes("wins") || message.includes("draw")
}

resetBtn.addEventListener("click", () => {
    const allSquares = document.querySelectorAll(".square")
    
    // Clear all squares by removing any children (circle/cross) inside the square
    allSquares.forEach(square => {
        square.innerHTML = "" // This removes any inner content, basically sets it to an empty string
        square.classList.remove('winning-square')
    })

    // Reset the turn to "circle"
    go = "circle"
    display(`Player's turn`)
    enableUserClicks()
    resetBtn.innerText = "Reset Game"
    playSound("resetGame")
})

// Disable clicks on all squares
function disableUserClicks() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach(square => {
        square.removeEventListener("click", addGo) // Temporarily remove the event listener
    })
}

// Re-enable clicks on empty squares
function enableUserClicks() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach(square => {
        if (!square.firstChild) {
            square.addEventListener("click", addGo) // Re-adding the eventListener to empty squares
        }
    })
}


/* Sound */

soundToggleIcon.addEventListener("click", toggleSound)

function toggleSound() {
    playSound("onOff")
    soundEnabled = !soundEnabled // Toggle the soundEnabled flag
    // Update the icon depending on the state of soundEnabled
    if (soundEnabled) {
        soundToggleIcon.classList.remove("fa-volume-mute")
        soundToggleIcon.classList.add("fa-volume-up")
        playSound("onOff2")
    } else {
        soundToggleIcon.classList.remove("fa-volume-up")
        soundToggleIcon.classList.add("fa-volume-mute")
    }
}

function playSound(soundId) {
    if (soundEnabled) {
        document.getElementById(soundId).play() // Play sound if enabled
    }
}


