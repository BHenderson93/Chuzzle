console.log('Hooked up')
const generalFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
const testFEN = "8/8/8/8/8/8/K7/8"

class GameBoard {
    constructor(initialFEN) {
        this.board = []
        this.pieceArray = this.fenConverter(initialFEN)
        this.tryMove = []
        this.captured = []
        this.enPassant = []
    }

    pieceAttemptsMove() {
        //console.log(this.tryMove)
        let start = [Number(this.tryMove[0][0]), Number(this.tryMove[0][1])]
        let end = [Number(this.tryMove[1][0]), Number(this.tryMove[1][1])]
        let piece = this.board[start[0]][start[1]]
        let movementPath = false

        const checkPiece = () => {
            if (typeof (piece) !== 'object') {
                console.log('Cannot find piece on that square')
                return false
            } else if ((piece.side === 'White' && currentTurn !== 0) || (piece.side === 'Black' && currentTurn !== 1)) {
                console.log('Not your turn!')
                return false
            }
            //console.log(`Piece is ${piece.name} and turn is ${currentTurn}`)
            return true
        }

        const findMoveArray = (currentPiece, endLocation) => {
            //console.log('currPiece' , currentPiece)
            for (let moveArray of currentPiece.allMoves) {
                for (let array of moveArray) {
                    if (array[0] === endLocation[0] && array[1] === endLocation[1]) {
                        return moveArray
                    }
                }
            }
            return false
        }

        const pawnCaptures = () => {
            //statement for capturing a piece by a pawn diagonally
            if (typeof (this.board[end[0]][end[1]]) === 'object' && (end[0] === piece.location[0] + piece.movementStyle[0][0] && (end[1] === piece.location[1] + 1 || end[1] === piece.location[1] - 1))) {
                console.log('capturing w/ pawn')
                this.board[start[0]][start[1]] = ''
                this.captured.push(this.board[end[0]][end[1]])
                this.board[end[0]][end[1]] = piece
                piece.location = [end[0], end[1]]
                piece.initialMoveAvailable = false
                currentTurn === 0 ? currentTurn = 1 : currentTurn = 0
                this.redrawBoard()
                return true
                //statement for capturing a pawn en passant
            } else if ((this.enPassant && end[1] === this.enPassant[1]) && (end[0] === piece.location[0] + piece.movementStyle[0][0] && (end[1] === piece.location[1] + 1 || end[1] === piece.location[1] - 1))) {
                console.log('en passanted')
                this.board[start[0]][start[1]] = ''
                this.captured.push(this.board[this.enPassant[0]][this.enPassant[1]])
                this.board[this.enPassant[0]][this.enPassant[1]] = ''
                this.board[end[0]][end[1]] = piece
                piece.location = [end[0], end[1]]
                piece.initialMoveAvailable = false
                currentTurn === 0 ? currentTurn = 1 : currentTurn = 0
                this.enPassant = null
                this.redrawBoard()
                return true
            }
            return false
        }

        const tryCastling = (currPiece) => {
            let savedLocation = currPiece.location
            if (this.board[end[0]][7].initialMoveAvailable && end[1] === 6) {
                if (this.board[end[0]][5] !== '' || this.board[end[0]][6] !== '') {
                    return false
                } else {
                    //check for castling through check
                    if (noKingChecks()) {
                        currPiece.location = [end[0], 5]
                        this.board[end[0]][5] = currPiece
                        if (noKingChecks()) {
                            currPiece.location = [end[0], 6]
                            this.board[end[0]][6] = currPiece
                            if (noKingChecks()) {
                                this.board[end[0]][end[1]] = currPiece
                                this.board[end[0]][4] = ''
                                currPiece.initialMoveAvailable = false
                                //rook stuff
                                this.board[end[0]][7].location = [end[0], end[1] - 1]
                                this.board[end[0]][end[1] - 1] = this.board[end[0]][7]
                                this.board[end[0]][7] = ''
                                //move stuff
                                currentTurn === 0 ? currentTurn = 1 : currentTurn = 0
                                this.redrawBoard()
                                return true
                            }
                        }
                    }
                    this.board[end[0]][5] = ''
                    this.board[end[0]][6] = ''
                }
            } else if (this.board[end[0]][0].initialMoveAvailable && end[1] === 2) {
                if (this.board[end[0]][3] !== '' || this.board[end[0]][2] !== '' || this.board[end[0]][1] !== '') {
                    return false
                } else {
                    if (noKingChecks()) {
                        currPiece.location = [end[0], 3]
                        this.board[end[0]][3] = currPiece
                        if (noKingChecks()) {
                            currPiece.location = [end[0], 2]
                            this.board[end[0]][2] = currPiece
                            if (noKingChecks()) {
                                //king stuff
                                this.board[end[0]][end[1]] = currPiece
                                this.board[start[0]][4] = ''
                                currPiece.initialMoveAvailable = false
                                //rook stuff
                                this.board[end[0]][0].location = [end[0], end[1] + 1]
                                this.board[end[0]][end[1] + 1] = this.board[end[0]][0]
                                this.board[end[0]][0] = ''
                                //move stuff
                                currentTurn === 0 ? currentTurn = 1 : currentTurn = 0
                                this.redrawBoard()
                                return true
                            }
                        }
                    }
                    this.board[end[0]][3] = ''
                    this.board[end[0]][2] = ''
                }
            }
            currPiece.location = savedLocation
            this.board[end[0]][4] = currPiece
            return false
        }

        const noCollisions = (movePath, currPiece, endLocation) => {
            //console.log('checking movepath... ', movePath)
            //console.log('end loc', endLocation)
            for (let move of movePath) {
                //console.log(move)
                let square = this.board[move[0]][move[1]]
                //console.log(square)
                if (move[0] === endLocation[0] && move[1] === endLocation[1] && (typeof (square) !== 'object' || (typeof (square) === 'object' && square.side !== currPiece.side))) {
                    //check for captures
                    if (typeof (square) === 'object') {
                        if (currPiece.name === 'Pawn') {
                            //console.log('A piece is in the way, and Im a pawn.')
                            return false
                        }
                    }
                    return true
                } else {
                    if (typeof (square) === 'object') {
                        //console.log(`A piece is in the way at ${move}`)
                        return false
                    }
                }
            }
            return false
        }

        const noKingChecks = () => {
            let king = {}
            //find relevant king based off currentTurn
            if (currentTurn === 0) {
                king.side = 'White'
            } else {
                king.side = 'Black'
            }

            //check if each square is that king
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    let currPiece = this.board[row][col]
                    if (currPiece.name === 'King' && currPiece.side === king.side) {
                        king.location = currPiece.location
                        break
                    }
                }
                if (king.location) {
                    break
                }
            }
            console.log('king is ', king)
            //iterate through all opposing pieces to check if there are any moveArrays that can hit the relevant king.
            //if the king is castling (boolean) check all 3 locations for checks.

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    let currPiece = typeof (this.board[row][col]) === 'object' && this.board[row][col].side !== king.side ? this.board[row][col] : null
                    if (currPiece) {
                        let moveArr = findMoveArray(currPiece, king.location)
                        if (moveArr) {
                            if (noCollisions(moveArr, currPiece, king.location)) {
                                console.log('KING IN CHECK!')
                                return false
                            }
                        }
                    }
                }
            }
            return true
        }

        const isCheckmate = () => {
            let king = {}
            //find relevant king based off currentTurn
            if (currentTurn === 0) {
                king.side = 'White'
            } else {
                king.side = 'Black'
            }
            console.log('checking king side' , king.side)
            //check for the current turn's king's pieces
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    let currPiece = this.board[row][col]
                    if (currPiece.side === king.side) {
                        console.log('currPiece to block m8' , currPiece)
                        //if you find one, check to see whether any of its moves prevents that king from being in check.
                        for (let moveArr of currPiece.allMoves) {
                            for (let move of moveArr) {
                                console.log('moveArr, move' , moveArr, move)
                                if (noCollisions(moveArr, currPiece, move)) {
                                    let startContents = this.board[row][col]
                                    let endContents = this.board[move[0]][move[1]]
                                    this.board[move[0]][move[1]] = currPiece
                                    currPiece.location = move
                                    if (noKingChecks()) {
                                        this.board[row][col] = startContents
                                        this.board[move[0]][move[1]] = endContents
                                        currPiece.location = [row,col]
                                        console.log('King ok')
                                        return false
                                    } else {
                                        this.board[row][col] = startContents
                                        this.board[move[0]][move[1]] = endContents
                                        currPiece.location = [row,col]
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return true
        }

        //see if the click is a piece and the right color for the turn.
        if (!checkPiece()) {
            return
        }

        //find the pieces path to the target square
        movementPath = findMoveArray(piece, end)

        //if no path to the target square exists, check for pawn/king exceptions. Pawn captures, en passant, castling...
        if (!movementPath) {
            if (piece.name === 'Pawn') {
                if (pawnCaptures()) {
                    return
                }
            } else if (piece.name === 'King' && piece.initialMoveAvailable && Math.abs(end[1] - start[1]) === 2 && end[0] - start[0] === 0) {
                if (tryCastling(piece)) {
                    console.log('Castled')
                    return
                } else {
                    console.log('Could not castle.')
                    return
                }
            }
            console.log(`Cannot find path for this ${piece.name}.`)
            return
        }

        //check whether something is in the way from start->end for the piece.
        if (noCollisions(movementPath, piece, end)) {

            //test out move and check for checks
            let startContents = this.board[start[0]][start[1]]
            let endContents = this.board[end[0]][end[1]]
            this.board[start[0]][start[1]] = ''
            this.board[end[0]][end[1]] = piece
            piece.location = [end[0], end[1]]

            if (noKingChecks()) {

                piece.initialMoveAvailable = false
                //console.log('math', Math.abs(start[0] - end[0]))
                if (piece.name === 'Pawn' && Math.abs(start[0] - end[0]) === 2) {
                    this.enPassant = end
                } else {
                    this.enPassant = null
                }
                //console.log('Move successful')
                currentTurn === 0 ? currentTurn = 1 : currentTurn = 0
                this.redrawBoard()
            } else {
                //if there's a check, revert back.
                this.board[start[0]][start[1]] = startContents
                this.board[end[0]][end[1]] = endContents
                piece.location = [start[0], start[1]]
            }
        }

        //see if that move results in checkmate
        //console.log('turn is ' , currentTurn)
        if(!noKingChecks()){
            if (isCheckmate()) {
                console.log('Checkmate!')
            }
        }
    }

    redrawBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let piece = this.board[col][row]
                let square = document.getElementById(`${col}${row}`)
                if (typeof (this.board[col][row]) === 'object') {
                    square.innerText = piece.img
                    square.style.color = piece.side === 'White' ? 'orange' : 'blue'

                } else {
                    square.innerText = ''
                }

                typeof (this.board[col][row]) === 'object' ? this.board[col][row].makeAllMovesArray() : null
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
                square.style.background = col % 2 === row % 2 ? 'white' : 'rgba(0,0,0,.7)'
                square.id = `${row}${col}`
                square.classList.add('square')
                gameBoard.append(square)
                if (this.pieceArray[fenIndex] === ' ') {
                    rowArray.push('')
                } else {
                    //logic for putting in pieces
                    this.pieceArray[fenIndex] === 'Q' ? rowArray.push(new Queen('White', [row, col])) : null
                    this.pieceArray[fenIndex] === 'K' ? rowArray.push(new King('White', [row, col])) : null
                    this.pieceArray[fenIndex] === 'R' ? rowArray.push(new Rook('White', [row, col])) : null
                    this.pieceArray[fenIndex] === 'B' ? rowArray.push(new Bishop('White', [row, col])) : null
                    this.pieceArray[fenIndex] === 'N' ? rowArray.push(new Knight('White', [row, col])) : null
                    this.pieceArray[fenIndex] === 'P' ? rowArray.push(new Pawn('White', [row, col])) : null
                    this.pieceArray[fenIndex] === 'q' ? rowArray.push(new Queen('Black', [row, col])) : null
                    this.pieceArray[fenIndex] === 'k' ? rowArray.push(new King('Black', [row, col])) : null
                    this.pieceArray[fenIndex] === 'r' ? rowArray.push(new Rook('Black', [row, col])) : null
                    this.pieceArray[fenIndex] === 'b' ? rowArray.push(new Bishop('Black', [row, col])) : null
                    this.pieceArray[fenIndex] === 'n' ? rowArray.push(new Knight('Black', [row, col])) : null
                    this.pieceArray[fenIndex] === 'p' ? rowArray.push(new Pawn('Black', [row, col])) : null
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
        //console.log('in makeAll')
        this.allMoves = []
        let tempMax = this.name === 'Pawn' ? this.initialMoveAvailable ? this.movementMax + 1 : this.movementMax : this.movementMax
        for (let movement of this.movementStyle) {
            //console.log(movement)
            let moveStyleArray = []
            for (let inc = 1; inc <= tempMax; inc++) {
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
    constructor(side, location) {
        super(side, location)
        this.name = 'King'
        this.img = 'K'
        this.movementStyle = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]
        this.movementMax = 1
    }
}

class Rook extends Piece {
    constructor(side, location) {
        super(side, location)
        this.name = 'Rook'
        this.img = 'R'
        this.movementStyle = [[-1, 0], [0, 1], [1, 0], [0, -1]]
        this.movementMax = 8
    }
}

class Knight extends Piece {
    constructor(side, location) {
        super(side, location)
        this.name = 'Knight'
        this.img = 'N'
        this.movementStyle = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]
        this.movementMax = 1
    }
}

class Bishop extends Piece {
    constructor(side, location) {
        super(side, location)
        this.name = 'Bishop'
        this.img = 'B'
        this.movementStyle = [[-1, 1], [1, 1], [1, -1], [-1, -1]]
        this.movementMax = 8
    }
}

class Pawn extends Piece {
    constructor(side, location) {
        super(side, location)
        this.name = 'Pawn'
        this.img = 'P'
        this.movementStyle = this.side === 'White' ? [[-1, 0]] : [[1, 0]]
        this.movementMax = 1
        this.initialMoveAvailable = true
    }
}

const initializeScreen = () => {
    document.getElementById('board-container').addEventListener('mousedown', (e) => {
        //console.log(e.target.id)
        gameBoard.tryMove[0] = e.target.id.split('')
    })
    document.getElementById('board-container').addEventListener('mouseup', (e) => {
        //console.log(e.target.id)
        gameBoard.tryMove[1] = e.target.id.split('')
        gameBoard.pieceAttemptsMove()
    })
    //insert element sticks to mouse listener on click somewhere in here

    gameBoard.initializeBoard()
}

let currentTurn = 0
const gameBoard = new GameBoard(generalFEN)
initializeScreen()


