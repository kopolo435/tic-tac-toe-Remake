const gameBoard = (() => {
    let gameArray = ["","","","","","","","",""];

    let updateGameArray = (mark,index)=>{
        gameArray[index] = mark;
    }

    let clearGameArray = ()=>{
        gameArray = gameArray.map(mark => " ");
    }

    let getGameArray = () => gameArray;

    return {updateGameArray,clearGameArray,getGameArray};
})();

const player = function (name,mark,computer){

    return Object.assign({
        getName : () => {
            return name
        },
        getMark : () =>{
            return mark
        },
        computer : computer
    })
}

const displayController = (()=>{
    const board = document.getElementById("board");
    const cellsNodes = board.getElementsByClassName("cells");

    const updateCell = (cell,value)=>{
        let pNode = cell.querySelector("p");
        pNode.textContent = value;
    }

    const updateBoard = (gameArray)=>{
        Array.from(cellsNodes).forEach(cell =>{
            let indexValue = gameArray[cell.getAttribute("data-index")];
            updateCell(cell,indexValue);
        })
    }


    return {updateBoard};
    
})();
displayController.updateBoard(gameBoard.getGameArray());
const player2 = player("samir","X",false);
const player1 = player("alonso","0",false)
