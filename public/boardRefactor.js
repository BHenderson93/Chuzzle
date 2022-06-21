class Piece {
    constructor(side, location) {
        this.name = 'piece'
        this.side = side
        this.location = location
        this.img = ''
        this.movementStyle = [{
            captureLocation:[],
            clContents:'',
            pieceMovesTo:[],
            plContents:''
        }]
        this.movementMax = 1
        this.allMoves = []
        this.initialMoveAvailable = true
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