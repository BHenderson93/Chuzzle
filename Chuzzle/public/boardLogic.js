console.log('Hooked up')
const generalFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
const testFEN = "8/8/8/3Q4/8/8/8/8"

class GameBoard {
    constructor(initialFEN) {
        this.board = []
        this.pieceArray = this.fenConverter(initialFEN)
    }

    pieceAttemptsMoves(piece, start, end) {

    }

    redrawBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let square = document.getElementById(`${col}${row}`)
                square.innerText = this.board[col][row] //placeholder for inserting the actual piece
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
                    rowArray.push(this.pieceArray[fenIndex])
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
    constructor() {
        this.name = 'piece',
            this.side = 'white/black',
            this.location = ['col', 'row']
        this.img = '',
            this.movementStyle = [[1, 0]],
            this.movementMax = 1,
            this.allMoves = [],
            this.initialMoveAvailable = true,
            this.specialMove1 = true,
            this.specialMove2 = true
    }
    makeAllMovesArray() {
        for (let movement of this.movementStyle) {
            console.log(movement)
            for (let inc = 1; inc <= this.movementMax; inc++) {
                let tempMove = this.location.slice()
                tempMove[0] += (movement[0] * inc)
                tempMove[1] += (movement[1] * inc)
                console.log('tempmove' , tempMove)
                if (tempMove[0] >= 0 && tempMove[0] <= 7 && tempMove[1] >= 0 && tempMove[1] <= 7) {
                    this.allMoves.push(tempMove)
                }
            }
        }
    }
}

class Queen extends Piece {
    constructor() {
        super(),
        this.name = 'Queen',
            this.side = 'White',
            this.location = [3, 3],
            this.img = 'Q',
            this.movementStyle = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]],
            this.movementMax = 8
    }



}

const initializeScreen = () => {
    document.addEventListener('mousedown', (e) => {
        console.log(e.target.id)
    })
    document.addEventListener('mouseup', (e) => {
        console.log(e.target.id)
    })
    //insert element sticks to mouse listener on click somewhere in here

    gameBoard.initializeBoard()
}

const queen = new Queen()
const gameBoard = new GameBoard(testFEN)
initializeScreen()

queen.makeAllMovesArray()
console.log(queen.allMoves)

