
const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
const scoreDisplay = document.querySelector('#score');
const startBtn = document.querySelector('#start-button');
const width = 10;
let nextRandom = 0;
let timerId = null;
let score = 0;
const colors = ['orange', 'red', 'purple', 'green', 'blue'];

// // The Tetrominoes: 

// // The LTetramino:
const lTetromino = [
    [1,width+1,width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1,width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2],
];

const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2,width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2,width*2, width*2+1],
]

const tTetromino = [
    [1,width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1,width+2, width*2+1],
    [1,width, width+1, width*2+1],
]

const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
]

const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
]

const TheTetrominoes = [lTetromino, zTetromino,tTetromino,oTetromino,iTetromino];

let currentPosition = 4;
let currentRotation = 0;


// randomly selecting a tetromino and its first rotation.
let random = Math.floor(Math.random()*TheTetrominoes.length);
console.log(random);

let current = TheTetrominoes[random][currentRotation];

// draw the first rotation in the first tetromino

function draw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[random];
    })
}
draw();

function undraw(){
    current.forEach(index => {
         squares[currentPosition + index].classList.remove('tetromino');
         squares[currentPosition + index].style.backgroundColor = '';
    })
}


// make the tetromino move down every second 

// const timerId = setInterval(moveDown, 1000);

// assign function to keycodes
function control(e){
    if(e.keyCode === 37)
    {
        moveLeft();
    }
    else if( e.keyCode === 38)
    {
        rotate();
    }
    else if (e.keyCode === 39)
    {
        moveRight();
    }
    else if( e.keyCode === 40)
    {
        moveDown();
    }
}

document.addEventListener('keyup', control)

function moveDown(){
    undraw();
    currentPosition +=width;
    draw();
    freeze();
}


// Freeze function...
function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        random = nextRandom;
        nextRandom = Math.floor(Math.random()*TheTetrominoes.length);
        current = TheTetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        gameOver();
    }
}

// move the tetromino left, unless is at the edge or there is a blockage

function moveLeft(){
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) %width === 0)

    if(!isAtLeftEdge)
    {
        currentPosition -=1;
    }
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition +=1;
    }

    draw();
}


// move the tetromino right, unless is at the edge or there is a blockage

function moveRight(){
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index)%width === width - 1);

    if(!isAtRightEdge)
    {
        currentPosition +=1;
    }

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -=1;
    }
    

    draw();


}


// rotate the tetromino 
function rotate(){
    undraw();
    currentRotation++;
    if (currentRotation === current.length)  // If the current rotation gets to 4, make it go back to 0
    {
        currentRotation = 0;
    }
    current = TheTetrominoes[random][currentRotation];
    draw();
}


// Show up-next tetromino in mini-grid display: 

const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let displayIndex = 0;

// theTetrominos without rotation

const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], // Ltetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], // zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], // tTetromino
    [0, 1, displayWidth, displayWidth+1], // oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // iTetromino
]

// Display the shape in the mini-grid display:

function displayShape(){
    // remove any trace of a tetromino from the entire grid.
    displaySquares.forEach( square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
    })
    upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino');
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    })
}


//  add functionality to the button: 
startBtn.addEventListener('click', () => {
    // if statement basically means if timer id is not null
    if(timerId){
        clearInterval(timerId);
        timerId = null;
    }
    else
    {
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random()*TheTetrominoes.length);
        displayShape();
    }
})



function addScore () {
    for ( let i = 0; i< 199; i += width)
    {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7,i+8, i+9];

        if(row.every(index => squares[index].classList.contains('taken'))){
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach( index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor = '';
            })
            const squaresRemoved = squares.splice(i,width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));

        }
    }
}

// Gameover Function: 

function gameOver() {
    if( current.some ( index => squares[currentPosition + index].classList.contains('taken'))){
        scoreDisplay.innerHTML = 'END';
        clearInterval(timerId);
    }
}




