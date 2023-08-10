//Modulo encargado de manipular el array que representa el tablero
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

//Factory Function para crear los objetos player
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

//Modulo encargado modificar el tablero por medio del dom
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

//Modulo encargado de controlar el juego
const gameController = ((player1,player2,gameBoard,displayController)=>{
    let currentPlayer = player1;

    const playRoundPlayer = (index) =>{
        gameBoard.updateGameArray(currentPlayer.getMark(),index);
        displayController.updateBoard(gameBoard.getGameArray());
        if(checkGameWin()){
            console.log(`El ganador es ${currentPlayer.getName()}`);
            cellsEventManager.removeCellsEvents();
        }
        else if(checkGameDraw()){
            console.log(`El juego termina como empate`);
        }
        else currentPlayer = currentPlayer === player1 ? player2:player1;
    }

    const checkGameWin = ()=>{
        const winningCombinations = [
            [0,1,2],[3,4,5],[6,7,8], //Horizontal wins
            [0,3,6],[1,4,7],[2,5,8], //Vertical wins
            [2,4,6],[0,4,8]          //Diagonal wins
        ];
        const boardArray = gameBoard.getGameArray();
        for(const combination of winningCombinations){
            if(boardArray[combination[0]]!== ""){ //Comprueba que la combinacion no este vacia
                if((boardArray[combination[0]] === boardArray[combination[1]])&&
                (boardArray[combination[0]] === boardArray[combination[2]])
                ){
                    return true
                }
            }
        }
        return false
    };

    const checkGameDraw = ()=>{
        const boardArray = gameBoard.getGameArray();
        const checkEmptyCell = (cell) =>{
            return cell=== "" ? true:false;
        }
        const hola = boardArray.find(checkEmptyCell);
        const condition = boardArray.find(checkEmptyCell) === undefined ? true:false;
        return condition;
    }


    return{playRoundPlayer};
})(player1,player2,gameBoard,displayController);

//Modulo encargado de los events de las cells
const cellsEventManager = ((gameController)=>{
    const cellsList = document.getElementsByClassName("cells");

    const clickCellHandler = function(){
        gameController.playRoundPlayer(this.getAttribute("data-index"));
        this.removeEventListener("click", clickCellHandler); //Cada evento solo se activa una vez
    }

    const createCellsEvent = (cell) =>{
        
        cell.addEventListener("click", clickCellHandler);
    };

    const assingCellsEvent = () =>{
        Array.from(cellsList).forEach(cell =>{
            createCellsEvent(cell);
        });
    };

    const removeCellsEvents = () =>{
        Array.from(cellsList).forEach(cell =>{
            cell.removeEventListener("click",clickCellHandler);
        })
    }

    return {assingCellsEvent,removeCellsEvents};
})(gameController);

cellsEventManager.assingCellsEvent();
