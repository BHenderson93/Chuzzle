//console.log('Hooked up')
const emptyFEN = "8/8/8/8/8/8/8/8"

//bug list - stalemate, pawn captures/en passant allowing check containing positions.
class GameBoard {
    constructor(initialFEN) {
        this.board = []
        this.pieceArray = this.fenConverter(initialFEN)
        this.tryMove = []
        this.captured = []
        this.enPassant = []
        this.lastMoveLocation = []
        this.moveString
    }

    pieceAttemptsMove() {
        //console.log('trymove is', this.tryMove)
        this.moveString = this.tryMove[0].join('') + this.tryMove[1].join('')
        //console.log('moveString is', this.moveString)
        //console.log(this.tryMove)
        let start = [Number(this.tryMove[0][0]), Number(this.tryMove[0][1])]
        let end = [Number(this.tryMove[1][0]), Number(this.tryMove[1][1])]
        //console.log('start,end',start,end)
        let piece = this.board[start[0]][start[1]]
        let movementPath = false

        const checkPiece = () => {
            if (typeof (piece) !== 'object') {
                //console.log('Cannot find piece on that square')
                return false
            } else if ((piece.side === 'White' && currentTurn !== 0) || (piece.side === 'Black' && currentTurn !== 1)) {
                //console.log('Not your turn!')
                return false
            }
            //console.log(`Piece is ${piece.name} and turn is ${currentTurn}`)
            return true
        }

        const findMoveArray = (currentPiece, endLocation) => {
            //console.log('currPiece', currentPiece)
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
            let startContents, endContents
            if (typeof (this.board[end[0]][end[1]]) === 'object' && (end[0] === piece.location[0] + piece.movementStyle[0][0] && (end[1] === piece.location[1] + 1 || end[1] === piece.location[1] - 1))) {
                //console.log('capturing w/ pawn')
                this.board[start[0]][start[1]] = ''
                endContents = this.captured.push(this.board[end[0]][end[1]])
                this.board[end[0]][end[1]] = piece
                piece.location = [end[0], end[1]]
                piece.initialMoveAvailable = false
                if (noKingChecks) {
                    if ((piece.side === 'White' && piece.location[0] === 0) || (piece.side === 'Black' && piece.location[0] === 7)) {
                        //console.log('attempting pawn promote')
                        this.board[piece.location[0]][piece.location[1]] = promotePawn(piece.side, piece.location)
                    }
                    currentTurn === 0 ? currentTurn = 1 : currentTurn = 0
                    this.redrawBoard()
                } else {
                    this.board[end[0]][end[1]] = endContents
                    this.board[start[0]][start[1]] = piece
                    piece.location = [start[0], start[1]]
                }
                if (!noKingChecks()) {
                    if (isCheckmate()) {
                        //console.log('Checkmate!')
                    }
                }
                return true
                //statement for capturing a pawn en passant
            } else if ((this.enPassant && end[1] === this.enPassant[1]) && (end[0] === piece.location[0] + piece.movementStyle[0][0] && (end[1] === piece.location[1] + 1 || end[1] === piece.location[1] - 1))) {
                //console.log('en passanted')
                this.board[start[0]][start[1]] = ''
                endContents = this.board[this.enPassant[0]][this.enPassant[1]]
                this.board[this.enPassant[0]][this.enPassant[1]] = ''
                this.board[end[0]][end[1]] = piece
                piece.location = [end[0], end[1]]
                if (noKingChecks()) {
                    piece.initialMoveAvailable = false
                    currentTurn === 0 ? currentTurn = 1 : currentTurn = 0
                    this.enPassant = null
                    this.redrawBoard()
                } else {
                    this.board[start[0]][start[1]] = piece
                    this.board[this.enPassant[0]][this.enPassant[1]] = endContents
                    this.board[end[0]][end[1]] = ''
                    piece.location = [start[0], start[1]]
                    return false
                }

                if (!noKingChecks()) {
                    if (isCheckmate()) {
                        //console.log('Checkmate!')
                    }
                }
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
        //needs work
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
            //console.log('king is ', king)
            //iterate through all opposing pieces to check if there are any moveArrays that can hit the relevant king.
            //if the king is castling (boolean) check all 3 locations for checks.

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    let currPiece = typeof (this.board[row][col]) === 'object' && this.board[row][col].side !== king.side ? this.board[row][col] : null
                    if (currPiece) {
                        let moveArr = findMoveArray(currPiece, king.location)
                        if (moveArr) {
                            if (noCollisions(moveArr, currPiece, king.location)) {
                                //console.log('KING IN CHECK!')
                                return false
                            }
                        } else if (currPiece.name === 'Pawn') {
                            let pawnTakesRow = currPiece.location[0] + currPiece.movementStyle[0][0]
                            //console.log(currPiece.location[0], currPiece.movementStyle[0])
                            //console.log('ptr ', pawnTakesRow)
                            if ((king.location[0] === pawnTakesRow && (king.location[1] === currPiece.location[1] - 1 || king.location[1] === currPiece.location[1] + 1))) {
                                //console.log('KING IN CHECK!')
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
            //console.log('checking king side', king.side)
            //check for the current turn's king's pieces
            let startContents, endContents
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    let currPiece = this.board[row][col]
                    if (currPiece.side === king.side) {
                        //console.log('currPiece to try to block m8', currPiece)
                        //if you find one, check to see whether any of its moves prevents that king from being in check.
                        for (let moveArr of currPiece.allMoves) {
                            for (let move of moveArr) {
                                //console.log('moveArr, move', moveArr, move)
                                if (noCollisions(moveArr, currPiece, move)) {
                                    startContents = this.board[row][col]
                                    endContents = this.board[move[0]][move[1]]
                                    this.board[move[0]][move[1]] = currPiece
                                    currPiece.location = move
                                    this.board[row][col] = ''
                                    if (noKingChecks()) {
                                        this.board[row][col] = startContents
                                        this.board[move[0]][move[1]] = endContents
                                        currPiece.location = [row, col]
                                        //console.log(`King ok bc of ${currPiece.name} ${move}`)
                                        return false
                                    } else {
                                        this.board[row][col] = startContents
                                        this.board[move[0]][move[1]] = endContents
                                        currPiece.location = [row, col]
                                    }
                                }
                            }
                        }
                        //check for special pawn exceptions
                        if (currPiece.name === 'Pawn') {
                            //console.log('verifying enP', this.enPassant)
                            if (this.enPassant && this.enPassant[0] === currPiece.location[0] && (this.enPassant[1] === currPiece.location[1] + 1 || this.enPassant[1] === currPiece.location[1] - 1)) {
                                //console.log('checking en passant')
                                startContents = this.board[row][col]
                                endContents = this.board[this.enPassant[0]][this.enPassant[1]]
                                currPiece.location = [this.enPassant[0] + currPiece.movementStyle[0], this.enPassant[1]]
                                this.board[this.enPassant[0] + currPiece.movementStyle[0][0]][this.enPassant[1]] = currPiece
                                let enPassantContents = this.board[this.enPassant[0]][this.enPassant[1]]
                                this.board[this.enPassant[0]][this.enPassant[1]] = ''
                                this.board[row][col] = ''
                                if (noKingChecks()) {
                                    this.board[row][col] = currPiece
                                    this.board[this.enPassant[0]][this.enPassant[1]] = endContents
                                    this.board[this.enPassant[0] + currPiece.movementStyle[0][0]][this.enPassant[1]] = ''
                                    currPiece.location = [row, col]
                                    //console.log('King ok by en passant')
                                    return false
                                } else {
                                    this.board[row][col] = startContents
                                    this.board[this.enPassant[0]][this.enPassant[1]] = endContents
                                    this.board[this.enPassant[0]][this.enPassant[1]] = enPassantContents
                                    currPiece.location = [row, col]
                                }
                            }

                            let pawnTakesRow = currPiece.location[0] + currPiece.movementStyle[0][0]
                            let pawnTakesCol1 = currPiece.location[1] - 1
                            let pawnTakesCol2 = currPiece.location[1] + 1

                            let square = this.board[pawnTakesRow][pawnTakesCol1]
                            //check for object
                            if (typeof (square) === 'object' && square.side !== currPiece.side) {
                                startContents = currPiece
                                endContents = this.board[pawnTakesRow][pawnTakesCol1]
                                this.board[pawnTakesRow][pawnTakesCol1] = currPiece
                                currPiece.location = [pawnTakesRow][pawnTakesCol1]
                                this.board[row][col] = ''
                                if (noKingChecks()) {
                                    this.board[row][col] = startContents
                                    this.board[pawnTakesRow][pawnTakesCol1] = endContents
                                    currPiece.location = [row, col]
                                    //console.log('King ok by pawn capture')
                                    return false
                                } else {
                                    this.board[row][col] = startContents
                                    this.board[pawnTakesRow][pawnTakesCol1] = endContents
                                    currPiece.location = [row, col]
                                }
                            }
                            //reset and check other
                            square = this.board[pawnTakesRow][pawnTakesCol2]
                            if (typeof (square) === 'object' && square.side !== currPiece.side) {
                                startContents = currPiece
                                endContents = this.board[pawnTakesRow][pawnTakesCol2]
                                this.board[pawnTakesRow][pawnTakesCol2] = currPiece
                                currPiece.location = [pawnTakesRow][pawnTakesCol2]
                                this.board[row][col] = ''
                                if (noKingChecks()) {
                                    this.board[row][col] = startContents
                                    this.board[pawnTakesRow][pawnTakesCol2] = endContents
                                    currPiece.location = [row, col]
                                    //console.log('King ok by pawn capture')
                                    return false
                                } else {
                                    this.board[row][col] = startContents
                                    this.board[pawnTakesRow][pawnTakesCol2] = endContents
                                    currPiece.location = [row, col]
                                }
                            }
                        }
                    }
                }
            }
            return true
        }

        const promotePawn = (side, location) => {
            let newPiece = new Queen(side, location)
            //need logic for other piece options
            return newPiece
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
                    //console.log('Castled')
                    return
                } else {
                    //console.log('Could not castle.')
                    return
                }
            }
            //console.log(`Cannot find path for this ${piece.name}.`)
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
                if (piece.name === 'Pawn') {
                    if ((piece.side === 'White' && piece.location[0] === 0) || (piece.side === 'Black' && piece.location[0] === 7)) {
                        //console.log('attempting pawn promote')
                        this.board[piece.location[0]][piece.location[1]] = promotePawn(piece.side, piece.location)
                    }
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
        if (!noKingChecks()) {
            if (isCheckmate()) {
                //console.log('Checkmate!')
            }
        }
    }

    redrawBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                let piece = this.board[col][row]
                let square = document.getElementById(`${col}${row}`)
                if (square.firstChild) {
                    //console.log('Removing child')
                    square.removeChild(square.firstChild)
                }
                if (typeof (this.board[col][row]) === 'object') {
                    //square.innerText = piece.img
                    let pieceImage = document.createElement('img')
                    pieceImage.classList.add('piece-image')
                    pieceImage.src = `/ChessPieces/${piece.side.toLowerCase()}${piece.name}.png`
                    square.appendChild(pieceImage)
                    square.style.color = piece.side === 'White' ? 'orange' : 'blue'

                } else {
                    square.innerText = ''
                }

                typeof (this.board[col][row]) === 'object' ? this.board[col][row].makeAllMovesArray() : null
                //placeholder for pieces
            }
        }
        if( recordingOn === true){
            let solution =''
            //console.log('try move is' ,this.tryMove)
            moveRecord.push(this.tryMove.slice())
            solution+=String(this.tryMove[0][1])
            solution+=String(this.tryMove[0][0])
            solution+=String(this.tryMove[1][1])
            solution+=String(this.tryMove[1][0])

            let returnSolution = ''
            switch (solution[0]){
                case '0':
                returnSolution+= 'a'
                break
                case '1':
                returnSolution+= 'b'
                break
                case '2':
                returnSolution+= 'c'
                break
                case '3':
                returnSolution+= 'd'
                break
                case '4':
                returnSolution+= 'e'
                break
                case '5':
                returnSolution+= 'f'
                break
                case '6':
                returnSolution+= 'g'
                break
                case '7':
                returnSolution+= 'h'
                break
            }
            returnSolution+=(8-Number(solution[1]))

            switch (solution[2]){
                case '0':
                returnSolution+= 'a'
                break
                case '1':
                returnSolution+= 'b'
                break
                case '2':
                returnSolution+= 'c'
                break
                case '3':
                returnSolution+= 'd'
                break
                case '4':
                returnSolution+= 'e'
                break
                case '5':
                returnSolution+= 'f'
                break
                case '6':
                returnSolution+= 'g'
                break
                case '7':
                returnSolution+= 'h'
                break
            }
            returnSolution+=(8-Number(solution[3]))
            //console.log('returning solution record' , solution, returnSolution)
            record.push(returnSolution)
        }
    }

    initializeBoard() {
        const gameBoard = document.getElementById('board-container-independent')
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

    fenCreater() {
        let fen = ''
        for (let row = 0; row < 8; row++) {
            let empty = 0
            for (let col = 0; col < 8; col++) {
                let sq = this.board[row][col]
                if (typeof (sq) !== 'object') {
                    empty++
                } else {
                    if (empty > 0) {
                        fen += String(empty)
                        empty = 0
                    }
                    if(sq.side === 'Black'){
                        fen += String(sq.img).toLowerCase()
                    }else{
                        fen += sq.img
                    }
                }
            }
            if (empty > 0) {
                fen += empty
                empty = 0
            }
            if (row < 7) {
                fen += '/'
            }
        }

        fen+= startMove
        
        return fen
    }
}
// #region pieces
class Piece {
    constructor(side, location) {
        this.name = 'piece'
        this.side = side
        this.location = location
        this.img = ''
        this.imageFile
        this.movementStyle = [[1, 0]]
        this.movementMax = 1
        this.allMoves = []
        this.initialMoveAvailable = true
        this.specialMove1 = true
        this.specialMove2 = true
    }

    makeAllMovesArray() {
        //console.log('in makeAll')
        //console.log(this.location)
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
        //console.log(this.allMoves)
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

//#endregion

const initializeScreen = () => {
    document.getElementById('create-menu').addEventListener('mousedown', (e) => {
        //console.log(e.target.id)
        if (recordingOn === true) {
            if(e.target.classList.contains('piece-image')){
                e.preventDefault();
                document.body.style.cursor = `url(${e.target.src}) 45 45 , auto`
                gameBoard.tryMove[0] = e.target.parentNode.id.split('')
            }

        } else {
            if (!e.target.classList.contains('menu-btn')) {
                e.preventDefault();
                document.body.style.cursor = `url(${e.target.src}) 45 45 , auto`
                if (e.target.parentNode.classList.contains('square')) {
                    gameBoard.tryMove[0] = e.target.parentNode.id.split('')
                } else if (e.target.classList.contains('piece-image')) {
                    //console.log('menu clicked')
                    currentSelection = e.target.id
                    //console.log('piece selected is ', currentSelection)
                } else {
                    currentSelection = e.target.id
                }
            }
        }


    })

    document.addEventListener('mouseup', (e) => {
        //console.log(e.target.id)
        document.body.style.cursor = ``
        let workingID
        if (!e.target.id) {
            workingID = e.target.parentNode.id
        } else {
            workingID = e.target.id
        }
            if (e.target.classList.contains('square') || e.target.parentNode.classList.contains('square')) {
                if (currentSelection !== '') {
                    //console.log('attempting to create')
                    let boardcoords = workingID.split('')
                    boardcoords[0] = Number(boardcoords[0])
                    boardcoords[1] = Number(boardcoords[1])
                    let piece
                    currentSelection === 'Q' ? piece = new Queen('White', [boardcoords[0], boardcoords[1]]) : null
                    currentSelection === 'K' ? piece = new King('White', [boardcoords[0], boardcoords[1]]) : null
                    currentSelection === 'R' ? piece = new Rook('White', [boardcoords[0], boardcoords[1]]) : null
                    currentSelection === 'B' ? piece = new Bishop('White', [boardcoords[0], boardcoords[1]]) : null
                    currentSelection === 'N' ? piece = new Knight('White', [boardcoords[0], boardcoords[1]]) : null
                    currentSelection === 'P' ? piece = new Pawn('White', [boardcoords[0], boardcoords[1]]) : null
                    currentSelection === 'q' ? piece = new Queen('Black', [boardcoords[0], boardcoords[1]]) : null
                    currentSelection === 'k' ? piece = new King('Black', [boardcoords[0], boardcoords[1]]) : null
                    currentSelection === 'r' ? piece = new Rook('Black', [boardcoords[0], boardcoords[1]]) : null
                    currentSelection === 'b' ? piece = new Bishop('Black', [boardcoords[0], boardcoords[1]]) : null
                    currentSelection === 'n' ? piece = new Knight('Black', [boardcoords[0], boardcoords[1]]) : null
                    currentSelection === 'p' ? piece = new Pawn('Black', [boardcoords[0], boardcoords[1]]) : null
                    currentSelection === 'eraser' ? piece = '' : null
                    gameBoard.board[boardcoords[0]][boardcoords[1]] = piece
                    currentSelection = ''
                    gameBoard.redrawBoard()
                } else {
                    if(recordingOn === true){
                        //console.log('attempt moved called')
                        gameBoard.tryMove[1] = workingID.split('')
                        gameBoard.pieceAttemptsMove()
                    }
                }

            } else {
                currentSelection = ''
            }
        }
    )
    //insert element sticks to mouse listener on click somewhere in here

    //console.log('initi board')
    gameBoard.initializeBoard()
}

const clearScreen = () => {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            gameBoard.board[row][col] = ''
        }
    }
    recordingOn = false
    currentTurn = 0
    gameBoard.redrawBoard()
    return true
}
let startMove = ''
let startTurn = 0
const startRecording = () =>{
    console.log('startrecording currturn' , currentTurn)
    currentTurn = startTurn
    currentTurn === 0 ? startMove = ' w' : ' b'
    recordingOn = true
    record = []
    moveRecord = []
    fen = gameBoard.fenCreater()
    fen+=startMove
    clearInterval(playback)
}

const endRecording = () =>{
    recordingOn = false
    document.getElementById('fen-tracker').value = fen
    document.getElementById('moves-tracker').value = record
}
let playback
const replaySolution = () =>{
    startMove === ' w' ? currentTurn=0:currentTurn=1
    console.log('curr turn, start move', currentTurn, startMove)
    gameBoard = new GameBoard(fen)
    gameBoard.initializeBoard()
    let moveIndex = 0
    const intervalFunction = () =>{

        gameBoard.tryMove = moveRecord[moveIndex]
        gameBoard.pieceAttemptsMove(false, false)
        moveIndex++
        if (moveIndex === moveRecord.length){
            clearInterval(playback)
        }
    }

     playback = setInterval(intervalFunction, 1000)
}

let fen
let recordingOn = false
let moveRecord = []
let record = []
let currentSelection = ''
let currentTurn = 0
let gameBoard = new GameBoard(document.getElementById('fen').innerText)
initializeScreen()