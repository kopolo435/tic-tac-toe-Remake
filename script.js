const restartBtn = document.getElementById("restartGame");
const startBtn = document.getElementById("startGame");

//Modulo encargado de manipular el array que representa el tablero
const gameBoard = (() => {
    let gameArray = ["","","","","","","","",""];

    let updateGameArray = (mark,index)=>{
        gameArray[index] = mark;
    }

    let clearGameArray = ()=>{
        gameArray = gameArray.map(mark => "");
    }

    let getGameArray = () => gameArray;

    return {updateGameArray,clearGameArray,getGameArray};
})();

//Factory Function para crear los objetos player
const player = function (mark){

    return Object.assign({
        getName : function(){
            return this.name
        },
        getMark : function(){
            return mark
        },
        setName : function(newName){
            this.name = newName
        },
        setComputer : function(isComputer){
            this.computer = isComputer;
        },
        computer : this.computer,
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

    const changeCurrentPlayer = (currentPlayer)=>{
        const currentPlayerText = document.getElementById("nameCurrentPlayer");
        currentPlayerText.textContent = `Current Player: ${currentPlayer}`;
    }

    const showEndingText = (endingText) =>{
        const endingTextNode = document.getElementById("endingText");SVGAElement
        endingTextNode.textContent = endingText;
    }
    return {updateBoard,changeCurrentPlayer,showEndingText};
    
})();


let player1 = player("X");
let player2 = player("0");


const pageController = (()=>{

    const handleStartClick = () => {
        setPlayer1Name();
        setPlayer2Name();
        setPlayer1Computer();
        setPlayer2Computer();
        setInitialPlayer(player1.getName());
        cellsEventManager.assingCellsEvent();
        restartBtn.disabled = false;
    };

    const startGame = () => {
        const startBtn = document.getElementById("startGame");
        startBtn.addEventListener("click", handleStartClick);
    };

    const setInitialPlayer = (currentPlayer)=>{
        const currentPlayerText = document.getElementById("nameCurrentPlayer");
        currentPlayerText.textContent = `Current Player: ${currentPlayer}`;
    }

    const setPlayer1Name = ()=>{
        const nameInput = document.getElementById("player1");
        const nameText = nameInput.value === "" ? "Player1" : nameInput.value;
        player1.setName(nameText);
    }

    const setPlayer2Name = ()=>{
        const nameInput = document.getElementById("player2");
        const nameText = nameInput.value === "" ? "Player2" : nameInput.value;
        player2.setName(nameText);
    }

    const setPlayer1Computer = (player)=>{
        const computerInput = document.getElementById("compuPlayer1");
        const isComputer = computerInput.checked ? true : false;
        player1.setComputer(isComputer);
    }

    const setPlayer2Computer = (player)=>{
        const computerInput = document.getElementById("compuPlayer2");
        const isComputer = computerInput.checked;
        player2.setComputer(isComputer);
    }

    return{startGame,handleStartClick};
})();



//Modulo encargado de controlar el juego
const gameController = ((player1,player2,gameBoard,displayController)=>{
    let currentPlayer = player1;

    const playRoundPlayer = (index) =>{
        gameBoard.updateGameArray(currentPlayer.getMark(),index);
        displayController.updateBoard(gameBoard.getGameArray());
        if(checkGameWin()){
            let endingText =`El ganador es ${currentPlayer.getName()}`;
            cellsEventManager.removeCellsEvents(); //Elimina todos los eventos de los botones
            displayController.showEndingText(endingText);
        }
        else if(checkGameDraw()){
            let endingText = `El juego termina como empate`;
            displayController.showEndingText(endingText);
        }
        else {
            currentPlayer = currentPlayer === player1 ? player2:player1;
            displayController.changeCurrentPlayer(currentPlayer.getName());
            if(currentPlayer.computer){
                computerPlay();
            }
        }
    }
    const setCurrentPlayer = (newCurrentPlayer)=>{
        currentPlayer = newCurrentPlayer
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

    const computerPlay = ()=>{
        let playNumber;
        let loopCondition = true;
        const boardArray = gameBoard.getGameArray();    
        let emptyOptions = boardArray.map((option,index)=> {
            if(option ===""){
                return index;
            }
        });
        emptyOptions = emptyOptions.filter(tupla => tupla);
        playNumber = Math.floor(Math.random() * emptyOptions.length);
        playRoundPlayer(emptyOptions[playNumber]);
    }


    return{playRoundPlayer,setCurrentPlayer};
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

pageController.startGame();

restartBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    gameBoard.clearGameArray();
    displayController.updateBoard(gameBoard.getGameArray());
    cellsEventManager.removeCellsEvents();
    cellsEventManager.assingCellsEvent();
    gameController.setCurrentPlayer(player1);
    pageController.handleStartClick();
})