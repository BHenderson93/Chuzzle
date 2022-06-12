console.log('Hooked up')
const generalFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
const testFEN = "8/8/2Q5/3Q4/8/8/8/8"

class GameBoard {
    constructor(initialFEN) {
        this.board = []
        this.pieceArray = this.fenConverter(initialFEN)
        this.tryMove = []
        this.captured = []
    }

    pieceAttemptsMove() {
        //console.log(this.tryMove)
        let start = [ Number(this.tryMove[0][0]) , Number(this.tryMove[0][1]) ]
        let end = [ Number(this.tryMove[1][0]) , Number(this.tryMove[1][1])]
        let piece = this.board[start[0]][start[1]]

        if(typeof(piece) !== 'object'){
            console.log('Cannot find piece on that square')
            return 
        }else{
            console.log('end is' ,end)
            piece.makeAllMovesArray()
            console.log('piece is ',piece)
            let movePath = false
            //find the movePath to get the piece from start to end.
            for(let moveArray of piece.allMoves){
                for(let array of moveArray){
                    if(array[0]===end[0] && array[1]===end[1]){
                        movePath = moveArray
                        break
                    }
                }
                if(movePath){
                    console.log('movepath is',movePath)
                    break
                }
            }
            if(!movePath){
                console.log('Cannot find path to that square with this piece')
                return
            }
            //movePath should be found now or else the function exits.
            //time to check whether something is in the way.

            for (let move of movePath){
                console.log(move)
                let square = this.board[move[0]][move[1]]
                console.log(square)
                if(move[0] === end[0] && move[1]===end[1] && square.side !==piece.side){
                    //check for captures
                    this.board[start[0]][start[1]] = ''
                    this.board[end[0]][end[1]] = piece
                    piece.location = [end[0],end[1]]
                    console.log('Move successful')
                    this.redrawBoard()
                    break
                }else{
                    if(typeof(square) === 'object'){
                        console.log('Something is in the way.')
                        return
                    }
                }
            }


        }

    } //end of pieceAttemptsMove

    redrawBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let square = document.getElementById(`${col}${row}`)
                if(typeof(this.board[col][row]) === 'object'){
                    let square = document.getElementById(`${col}${row}`)
                    square.innerText = this.board[col][row].img
                }else{
                    square.innerText = ''
                }
                //placeholder for pieces
            }
        }
    }

    initializeBoard() {
        const gameBoard = document.getElementById('board-container')
        let fenIndex = 0
        //make the 64 squres
        for (let row = 0; row < 8; row++) {
            let rowArray = []
            for (let col = 0; col < 8; col++) {
                let square = document.createElement('div')
                square.style.background = col % 2 === row % 2 ? 'white' : 'black'
                square.id = `${col}${row}`
                square.classList.add('square')
                gameBoard.append(square)
                if (this.pieceArray[fenIndex] === ' ') {
                    rowArray.push('')
                } else {
                    //logic for putting in pieces
                    this.pieceArray[fenIndex] === 'Q' ? rowArray.push(new Queen('White' , [col,row])) : null
                }
                fenIndex++
            }
            this.board.push(rowArray)
        }
        this.redrawBoard()
    }

    fenConverter(FEN) {
        //console.log('starting fen converter')
        let newFEN = ''
        let i = 0
        let breaker = 0

        while (i < FEN.length) {
            breaker++
            if (breaker === 100) {
                //console.log('broken')
                break
            }
            let char = FEN[i]
            //console.log(newFEN,char)
            if (char === '/') {
                i++
            } else {
                if (Number(char) < 9) {
                    i++
                    for (let j = 0; j < Number(char); j++) {
                        newFEN += ' '
                    }
                } else {
                    newFEN += char
                    i++
                }
            }
        }
        return newFEN
    }
}


class Piece {
    constructor(side, location) {
        this.name = 'piece'
            this.side = side
            this.location = location
            this.img = ''
            this.movementStyle = [[1, 0]]
            this.movementMax = 1
            this.allMoves = []
            this.initialMoveAvailable = true
            this.specialMove1 = true
            this.specialMove2 = true
    }
    makeAllMovesArray() {
        this.allMoves = []
        for (let movement of this.movementStyle) {
            //console.log(movement)
            let moveStyleArray = []
            for (let inc = 1; inc <= this.movementMax; inc++) {
                let tempMove = this.location.slice()
                tempMove[0] += (movement[0] * inc)
                tempMove[1] += (movement[1] * inc)
                //console.log('tempmove', tempMove)
                if (tempMove[0] >= 0 && tempMove[0] <= 7 && tempMove[1] >= 0 && tempMove[1] <= 7) {
                    moveStyleArray.push(tempMove)
                }
            }
            this.allMoves.push(moveStyleArray)
        }
    }
}

class Queen extends Piece {
    constructor(side, location) {
        super(side, location)
            this.name = 'Queen'
            this.img = 'Q'
            this.movementStyle = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]
            this.movementMax = 8
    }
}

class King extends Piece {

}

class Rook extends Piece {

}

class Knight extends Piece {

}

class Bishop extends Piece {

}

class Pawn extends Piece {

}

const initializeScreen = () => {
    document.getElementById('board-container').addEventListener('mousedown', (e) => {
        console.log(e.target.id)
        gameBoard.tryMove[0] = e.target.id.split('')
    })
    document.getElementById('board-container').addEventListener('mouseup', (e) => {
        console.log(e.target.id)
        gameBoard.tryMove[1] = e.target.id.split('')
        gameBoard.pieceAttemptsMove()
    })
    //insert element sticks to mouse listener on click somewhere in here

    gameBoard.initializeBoard()
}

const gameBoard = new GameBoard(testFEN)
initializeScreen()


