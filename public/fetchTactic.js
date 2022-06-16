const tacticJSONToWindowStorage = (puzzleJSON) => {
    window.sessionStorage.setItem('puzzleId', puzzleJSON.puzzleid)
    window.sessionStorage.setItem('FEN', puzzleJSON.fen)

    let solutionArr = []
    for (let move of puzzleJSON.moves) {
        let specificSq = ''
        for (let char of move) {
            char === 'a' ? specificSq += 0 : null
            char === 'b' ? specificSq += 1 : null
            char === 'c' ? specificSq += 2 : null
            char === 'd' ? specificSq += 3 : null
            char === 'e' ? specificSq += 4 : null
            char === 'f' ? specificSq += 5 : null
            char === 'g' ? specificSq += 6 : null
            char === 'h' ? specificSq += 7 : null
        }
        solutionArr.push(specificSq)
    }
    window.sessionStorage.setItem('Solution', solutionArr)
    return
}



tacticJSONToWindowStorage()

const generalFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"

