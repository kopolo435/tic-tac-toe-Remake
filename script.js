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


const player1 = player("alonso","X",false);
const player2 = player("samir","0",false);

const gameController = ((player1,player2,gameBoard,displayController)=>{
    let currentPlayer = player1;

    const playRoundPlayer = (index) =>{
        gameBoard.updateGameArray(currentPlayer.getMark(),index);
        displayController.updateBoard(gameBoard.getGameArray());
        checkGameState();
        currentPlayer = currentPlayer === player1 ? player2:player1;
    }

    const checkGameState = ()=>{
        const winningCombinations = [
            [0,1,2],[3,4,5],[6,7,8], //Horizontal wins
            [0,3,6],[1,4,7],[2,5,8], //Vertical wins
            [2,4,6],[0,4,8]          //Diagonal wins
        ];
        const boardArray = gameBoard.getGameArray();
        for(const combination of winningCombinations){
            if(boardArray[combination[0]]!== ""){
                if((boardArray[combination[0]] === boardArray[combination[1]])&&
                (boardArray[combination[0]] === boardArray[combination[2]])
                ){
                    console.log(`${currentPlayer.getName()} has won`);
                }
            }
        }
    };


    return{playRoundPlayer};
})(player1,player2,gameBoard,displayController);

const cellsEventManager = ((gameController)=>{
    const cellsList = document.getElementsByClassName("cells");

    const createCellsEvent = (cell) =>{
        
        const clickCellHandler = () =>{
            gameController.playRoundPlayer(cell.getAttribute("data-index"));
            cell.removeEventListener("click", clickCellHandler);
        };
        cell.addEventListener("click", clickCellHandler);
    };

    const assingCellsEvent = () =>{
        Array.from(cellsList).forEach(cell =>{
            createCellsEvent(cell);
        });
    };

    return {assingCellsEvent};
})(gameController);

cellsEventManager.assingCellsEvent();
