console.log('Hooked up')


const initializeBoard = ()=>{
    const gameBoard = document.getElementById('board-container')

    //make the 64 squres
    for (let col = 1 ; col < 9 ; col++){
        for(let row = 1 ; row < 9 ; row++){
            let square = document.createElement('div')
            square.style.background = col%2===row%2 ? 'white' : 'black' 
            square.id = `${col}${row}`
            square.classList.add('square')

            gameBoard.append(square)
        }



    }

}
initializeBoard()