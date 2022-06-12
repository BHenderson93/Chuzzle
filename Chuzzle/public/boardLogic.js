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
        let start = [ Number(this.tryMove[0][0]) , Number(this.tryMove[0][1])]
        let end = [ Number(this.tryMove[1][0]) , Number(this.tryMove[1][1])]
        let piece = this.board[start[0]][start[1]]

        if(typeof(piece) !== 'object'){
            console.log('Cannot find piece on that square')
            return 
        }else{
            if((piece.side === 'White' && currentTurn !== 0) ||(piece.side === 'Black' && currentTurn !== 1)){
                console.log('Not your turn!')
                return
            }}
            console.log('end is' ,end)
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
            //contains logic for pawn doubleMove, en passant, and castling.
            if(!movePath){
                if(piece.name === 'Pawn'){
                    let captureStyle = piece.movementStyle[0]
                    //statement for capturing a piece by a pawn diagonally
                    if (typeof(this.board[end[0]][end[1]]) === 'object' && (end[0] === piece.location[0]+captureStyle[0] && (end[1]===piece.location[1] +1 || end[1] === piece.location[1]-1))){
                        console.log('capturing w/ pawn')
                        this.board[start[0]][start[1]] = ''
                        this.captured.push(this.board[end[0]][end[1]])
                        this.board[end[0]][end[1]] = piece
                        piece.location = [end[0],end[1]]
                        piece.initialMoveAvailable = false
                        console.log('Move successful')
                        currentTurn ===  0 ? currentTurn = 1 : currentTurn = 0
                        this.redrawBoard()
                        return
                        //statement for capturing a pawn en passant
                    }else if( ( this.enPassant && end[1] === this.enPassant[1]) && (end[0] === piece.location[0]+captureStyle[0] && (end[1]===piece.location[1] +1 || end[1] === piece.location[1]-1))){
                        console.log('en passanted')
                        this.board[start[0]][start[1]] = ''
                        this.captured.push(this.board[this.enPassant[0]][this.enPassant[1]])
                        this.board[this.enPassant[0]][this.enPassant[1]] = ''
                        this.board[end[0]][end[1]] = piece
                        piece.location = [end[0],end[1]]
                        piece.initialMoveAvailable = false
                        currentTurn ===  0 ? currentTurn = 1 : currentTurn = 0
                        this.enPassant = null
                        this.redrawBoard()
                        return
                    }
            }
            else if(piece.initialMoveAvailable && piece.name === 'King' && Math.abs(end[1]-start[1])===2 && end[0]-start[0] ===0 ){

                if( this.board[end[0]][7].initialMoveAvailable && end[1] === 6){
                        if (this.board[end[0]][5] !== '' || this.board[end[0]][6] !== ''){
                            //add in logic for castling through check
                            console.log('Something is blocking castling')
                            return
                        }else{
                            //king stuff
                            this.board[end[0]][end[1]] = piece
                            piece.location= end
                            this.board[start[0]][start[1]]=''
                            piece.initialMoveAvailable = false
                            //rook stuff
                            this.board[end[0]][7].location = [end[0],end[1]-1]
                            this.board[end[0]][end[1]-1] = this.board[end[0]][7]
                            this.board[end[0]][7] = ''
                            //move stuff
                            console.log('Castled')
                            currentTurn ===  0 ? currentTurn = 1 : currentTurn = 0
                            this.redrawBoard()
                            return
                        }
                    }else if(this.board[end[0]][0].initialMoveAvailable && end[1] === 2){
                    console.log('attempting castle')
                    if(this.board[end[0]][3] !== '' || this.board[end[0]][2] !== '' || this.board[end[0]][1] !== ''){
                        console.log('Something is blocking castling')
                            return
                    }else{
                        //king stuff
                        this.board[end[0]][end[1]] = piece
                        piece.location = end
                        this.board[start[0]][start[1]]=''
                        piece.initialMoveAvailable = false
                        //rook stuff
                        this.board[end[0]][0].location = [end[0],end[1]+1]
                        this.board[end[0]][end[1]+1] = this.board[end[0]][0]
                        this.board[end[0]][0] = ''
                        //move stuff
                        console.log('Castled')
                        currentTurn ===  0 ? currentTurn = 1 : currentTurn = 0
                        this.redrawBoard()
                        return
                    }
                }
            }
                console.log('Cannot find path to that square with this piece - inside king/pawn logic')
                return
            }
            //movePath should be found now or else the function exits.
            //time to check whether something is in the way.

            for (let move of movePath){
                console.log(move)
                let square = this.board[move[0]][move[1]]
                console.log(square)
                if( move[0] === end[0] && move[1]===end[1] && ( typeof(square) !=='object' || (typeof(square) === 'object' && square.side !== piece.side))){
                    //check for captures
                    if(typeof(square) === 'object') {
                        if(piece.name === 'Pawn'){
                            console.log('A piece is in the way!')
                            return   
                        }else{
                            this.captured.push(square)
                        }
                         }
                    this.board[start[0]][start[1]] = ''
                    this.board[end[0]][end[1]] = piece
                    piece.location = [end[0],end[1]]
                    piece.initialMoveAvailable = false
                    console.log('math',Math.abs(start[0]-end[0]))
                    if(piece.name === 'Pawn' && Math.abs(start[0]-end[0])===2){
                        this.enPassant = end
                    }else{
                        this.enPassant = null
                    }
                    console.log('Move successful')
                    currentTurn ===  0 ? currentTurn = 1 : currentTurn = 0
                    this.redrawBoard()
                    return
                }else{
                    if(typeof(square) === 'object'){
                        console.log('A piece is in the way!')
                        return
                    }
                }
            }


        }

    //end of pieceAttemptsMove

    redrawBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let piece = this.board[col][row]
                let square = document.getElementById(`${col}${row}`)
                if(typeof(this.board[col][row]) === 'object'){
                    square.innerText = piece.img
                    square.style.color = piece.side === 'White' ? 'orange' : 'blue'

                }else{
                    square.innerText = ''
                }

                typeof(this.board[col][row]) ==='object' ? this.board[col][row].makeAllMovesArray() : null
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
                    this.pieceArray[fenIndex] === 'Q' ? rowArray.push(new Queen('White' , [row,col])) : null
                    this.pieceArray[fenIndex] === 'K' ? rowArray.push(new King('White' , [row,col])) : null
                    this.pieceArray[fenIndex] === 'R' ? rowArray.push(new Rook('White' , [row,col])) : null
                    this.pieceArray[fenIndex] === 'B' ? rowArray.push(new Bishop('White' , [row,col])) : null
                    this.pieceArray[fenIndex] === 'N' ? rowArray.push(new Knight('White' , [row,col])) : null
                    this.pieceArray[fenIndex] === 'P' ? rowArray.push(new Pawn('White' , [row,col])) : null
                    this.pieceArray[fenIndex] === 'q' ? rowArray.push(new Queen('Black' , [row,col])) : null
                    this.pieceArray[fenIndex] === 'k' ? rowArray.push(new King('Black' , [row,col])) : null
                    this.pieceArray[fenIndex] === 'r' ? rowArray.push(new Rook('Black' , [row,col])) : null
                    this.pieceArray[fenIndex] === 'b' ? rowArray.push(new Bishop('Black' , [row,col])) : null
                    this.pieceArray[fenIndex] === 'n' ? rowArray.push(new Knight('Black' , [row,col])) : null
                    this.pieceArray[fenIndex] === 'p' ? rowArray.push(new Pawn('Black' , [row,col])) : null
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
        console.log('in makeAll')
        this.allMoves = []
        let tempMax = this.name === 'Pawn' ? this.initialMoveAvailable? this.movementMax+1: this.movementMax: this.movementMax
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
            this.movementStyle = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
            this.movementMax = 1
    }
}

class Bishop extends Piece {
    constructor(side, location) {
        super(side, location)
            this.name = 'Bishop'
            this.img = 'B'
            this.movementStyle = [ [-1, 1],  [1, 1], [1, -1], [-1, -1]]
            this.movementMax = 8
    }
}

class Pawn extends Piece {
    constructor(side, location) {
        super(side, location)
            this.name = 'Pawn'
            this.img = 'P'
            this.movementStyle = this.side === 'White' ? [[-1,0]] : [[1,0]]
            this.movementMax = 1
            this.initialMoveAvailable = true
    }
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

let currentTurn = 0
const gameBoard = new GameBoard(generalFEN)
initializeScreen()


