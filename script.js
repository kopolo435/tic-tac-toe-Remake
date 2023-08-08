const gameBoard = (() => {
    let gameArray = ["","","","","","","","",""];

    let updateGameArray = (mark,index)=>{
        gameArray[index] = mark;
    }

    let clearGameArray = ()=>{
        gameArray = gameArray.map(mark => " ");
    }

    return {updateGameArray,clearGameArray};
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

const player2 = player("samir","X",false);
const player1 = player("alonso","0",false)
