
const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
const ScoreDisplay = document.querySelector('#score');
const StartBtn = document.querySelector('#start-button');
const width = 10;

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
    })
}
draw();

function undraw(){
    current.forEach(index => {
         squares[currentPosition + index].classList.remove('tetromino');
    })
}


// make the tetromino move down every second 

const timerId = setInterval(moveDown, 1000);

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
        random = Math.floor(Math.random()*TheTetrominoes.length);
        current = TheTetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
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

    // if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
    //     currentPosition -=1;
    // }
    

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



