document.addEventListener('DOMContentLoaded', () =>{
 const grid = document.querySelector('.grid')
 const flagsLeft = document.querySelector('#flags-left')
 const result = document.querySelector('#result')
 let width = 10
 let heartAmount = 5
 let flags = 0
 let squares = []
 let isGameOver = false

 //create Board
 function createBoard() {
    flagsLeft.innerHTML = heartAmount

    //get shuffled game array with random hearts
    const heartsArray = Array(heartAmount).fill('heart')
    const emptyArray = Array(width*width - heartAmount).fill('valid')
    const gameArray = emptyArray.concat(heartsArray)
    const shuffledArray = gameArray.sort(() => Math.random() -0.5)


    for(let i = 0; i < width*width; i++){
        const square = document.createElement('div')
        square.setAttribute('id',i)
        square.classList.add(shuffledArray[i])
        grid.appendChild(square)
        squares.push(square)

        //normal click
        square.addEventListener('click', function(e) {
           click(square)
        })

        //cntrl and left click
        square.oncontextmenu = function(e) {
            e.preventDefault()
            addFlag(square)
        }

    }

    //add numbers
    for (let i = 0; i < squares.length; i++) {
        let total =  0
        const isLeftEdge = (i % width === 0)
        const isRightEdge = (i % width === width - 1)

        if (squares[i].classList.contains('valid')) {
            if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('heart')) total ++
            if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('heart')) total ++
            if (i > 10 && squares[i -width].classList.contains('heart')) total ++
            if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('heart')) total ++
            if (i < 98 && !isRightEdge && squares[i +1].classList.contains('heart')) total ++
            if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('heart')) total ++
            if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('heart')) total ++
            if (i < 89 && squares[i +width].classList.contains('heart')) total ++
            squares[i].setAttribute('data', total)
        }
      }
    }
createBoard()

//add Flag with right click
function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags < heartAmount)) {
        if (!square.classList.contains('flag')) {
            square.classList.add('flag')
            square.innerHTML = "🚩"
            flags ++
            flagsLeft.innerHTML = heartAmount - flags
            checkForWin()
        } else {
            square.classList.remove('flag')
            square.innerHTML = ""
            flags --
            flagsLeft.innerHTML = heartAmount - flags
        }
    }
}

//click on square actions
function click(square) {
    let currentId = square.id
    if (isGameOver) return
    if (square.classList.contains('checked') || square.classList.contains('flag')) return
    if (square.classList.contains('heart')) {
        GameOver(square)
    }   else {
        let total = square.getAttribute('data')
        if (total !=0){
            square.classList.add('checked')
            if (total == 1) square.classList.add('one')
            if (total == 2) square.classList.add('two')
            if (total == 3) square.classList.add('three')
            if (total == 4) square.classList.add('four')
            if (total == 5) square.classList.add('five')
            square.innerHTML = total
            return
        }
        checkSquare(square, currentId)
    }
    square.classList.add('checked')
}



  //check neighboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width -1)

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1].id
        //const newId = parseInt(currentId) - 1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 -width].id
        //const newId = parseInt(currentId) +1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 10) {
        const newId = squares[parseInt(currentId -width)].id
        //const newId = parseInt(currentId) -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 -width].id
        //const newId = parseInt(currentId) -1 -width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1].id
        //const newId = parseInt(currentId) +1   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) -1 +width].id
        //const newId = parseInt(currentId) -1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) +1 +width].id
        //const newId = parseInt(currentId) +1 +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) +width].id
        //const newId = parseInt(currentId) +width   ....refactor
        const newSquare = document.getElementById(newId)
        click(newSquare)
      }
    }, 10)
  }

//game over
function GameOver(square) {
    result.innerHTML = 'Hearts! Game Over!'
    isGameOver = true

    //show all hearts
    squares.forEach(square => {
        if (square.classList.contains('heart')) {
            square.innerHTML = '💖'
            square.classList.remove('heart')
            square.classList.add('checked')
        }
    })
}

//check for win
function checkForWin() {
let matches = 0

    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('heart')) {
            matches ++
        }
        if (matches === heartAmount) {
            result.innerHTML = 'LOVE! YOU WIN!'
            isGameOver = true
        }
    }
}


})