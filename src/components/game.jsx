import React from 'react';
import Board from './board';

class Game extends React.Component {
    constructor(props) {
        super(props);

        // References
        this.boardRef = React.createRef();

        // Variables
        this.waitUpdate = false;
        this.winningCases = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ]

        // States
        this.state = {
            turn: 1,
            gameState: 0,
            player1: {
                name: "Joueur 1",
                win: 0,
                lose: 0
            },
            player2: {
                name: "Joueur 2",
                win: 0,
                lose: 0
            }
        };
    }
    
    // Getters and Setters
    setTurn(turn) {
        this.setState({turn: turn});
    }

    getTurn() {
        return this.state.turn;
    }

    setGameState(state) {
        this.setState({gameState: state});
    }

    getGameState() {
        return this.state.gameState;
    }

    setPlayer1(username) {
        this.setState(prevState => ({
            player1: {
                ...prevState.player1,
                name: username
            }
        }), () => { this.props.stats.current.forceUpdate() });
    }

    setPlayer2(username) {
        this.setState(prevState => ({
            player2: {
                ...prevState.player2,
                name: username
            }
        }), () => { this.props.stats.current.forceUpdate() });
    }

    // Game methods
    onCasePlayed(Game, caseItem) {
        if (caseItem.state.used !== -1 || Game.getGameState() !== 0 || Game.waitUpdate) return;
        
        Game.waitUpdate = true

        caseItem.setUsed(Game.getTurn(), () => {
            Game.waitUpdate = false

            const winCases = Game.checkWinner();
            if (winCases) {
                const winner = winCases[0].state.used;

                if (winner === 1) {
                    Game.setState(prevState => ({
                        player1: {
                            ...prevState.player1,
                            win: prevState.player1.win + 1
                        },
                        player2: {
                            ...prevState.player2,
                            lose: prevState.player2.lose + 1
                        }
                    }));
                } else {
                    Game.setState(prevState => ({
                        player1: {
                            ...prevState.player1,
                            lose: prevState.player1.lose + 1
                        },
                        player2: {
                            ...prevState.player2,
                            win: prevState.player2.win + 1
                        }
                    }));
                }

                winCases.forEach((item) => {
                    item.setState({winning: true});
                });
                
                Game.props.stats.current.forceUpdate()
                Game.setGameState(1);
                return;
            }
        
            const usedCases = Game.checkDraw();
            if (usedCases) {
                Game.setGameState(2);
                return;
            }
        
            Game.setTurn(Game.getTurn() === 1 ? 2 : 1);
        });
    }

    checkWinner() {
        const cases = this.boardRef.current.getCases();

        for (let i = 0; i < this.winningCases.length; i++) {
            const [a, b, c] = this.winningCases[i];
            if (cases[a].state.used !== -1 && cases[a].state.used === cases[b].state.used && cases[a].state.used === cases[c].state.used) {
                return [cases[a], cases[b], cases[c]];
            }
        }

        return null;
    }

    checkDraw() {
        const cases = this.boardRef.current.getCases();
        return cases.filter((item) => item.state.used !== -1).length >= 9;
    }

    restart() {
        this.boardRef.current.clear();
        this.setState({
            turn: 1,
            gameState: 0
        });
    }

    reset() {
        this.restart();
        this.setState({
            player1: {
                name: "Joueur 1",
                win: 0,
                lose: 0
            },
            player2: {
                name: "Joueur 2",
                win: 0,
                lose: 0
            }
        });
        this.clearStateFromLocalStorage();
        this.props.stats.current.forceUpdate()
    }

    // Save, Load and Clear state from localStorage
    saveStateToLocalStorage() {
        const stateToSave = JSON.stringify({
            player1: this.state.player1,
            player2: this.state.player2
        });
        localStorage.setItem('gameState', stateToSave);
    }

    loadStateFromLocalStorage() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const stateToLoad = JSON.parse(savedState);
            this.setState(stateToLoad);
        }
    }

    clearStateFromLocalStorage() {
        localStorage.removeItem('gameState');
    }

    componentDidUpdate() {
        this.saveStateToLocalStorage();
    }

    componentDidMount() {
        this.loadStateFromLocalStorage();
    }

    render() {
        const Game = this;

        function handleCasePlayed(caseItem) {
            Game.onCasePlayed(Game, caseItem);
        }

        function handleRestart() {
            Game.restart();
        }

        function handleReset() {
            if (!window.confirm("Êtes-vous sûr de vouloir réinitialiser le jeu?")) return;
            Game.reset();
        }

        return (
            <div>
                <div className="flex justify-center text-center">
                    <div className="p-2 w-3/12 flex flex-col items-center">
                        <div className="relative">
                            <input className="w-full text-xs font-bold border-b text-center focus:outline-none focus:border-b-2 focus:border-black" type="text" onChange={(e) => {Game.setPlayer1(e.target.value)}} value={Game.state.player1.name} />
                            <span className="absolute right-0 top-0 mt-1 mr-2 text-xs">
                                <i className="fa fa-pencil" aria-hidden="true"></i>
                            </span>
                        </div>
                        <h2 className="text-lg font-bold text-primary">X</h2>
                    </div>
                    <div className={`w-2/5 px-4 py-2 mx-2 bg-gray rounded-md flex flex-col justify-center items-center ${["", "border-2 border-green-500", "border-2 border-red-500"][Game.getGameState()]}`}>
                        {Game.getGameState() < 2
                        ?
                            <div>
                                <h5 className="text-xs text-dark">{Game.getGameState() === 0 ? "Au tour du" : "Victoire du"}</h5>
                                <h1 className={`text-2xl font-bold ${["","text-primary","text-secondary"][Game.getTurn()]}`}>{Game.getTurn() === 1 ? Game.state.player1.name : Game.state.player2.name}</h1>
                            </div>
                        :
                            <h1 className="text-2xl font-bold text-primary">Match Nul</h1>
                        }
                    </div>
                    <div className="p-2 w-3/12 flex flex-col items-center">
                        <div className="relative">
                            <input className="w-full text-xs font-bold border-b text-center focus:outline-none focus:border-b-2 focus:border-black" type="text" onChange={(e) => {Game.setPlayer2(e.target.value)}} value={Game.state.player2.name} />
                            <span className="absolute right-0 top-0 mt-1 mr-2 text-xs">
                                <i className="fa fa-pencil" aria-hidden="true"></i>
                            </span>
                        </div>
                        <h2 className="text-lg font-bold text-secondary">O</h2>
                    </div>
                </div>

                <div className="flex justify-center mt-5">
                    <Board ref={Game.boardRef} onCasePlayed={handleCasePlayed} />      
                </div>

                <div className="flex justify-center mt-5">
                    <button className="px-8 py-1 mr-2 text-xs font-bold border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white hover:scale-105 transition tooltip" onClick={handleReset}>Reset<span className="tooltiptext">Réinitialize le jeu (Joueurs, Statistiques, etc)</span></button>
                    <button className="px-8 py-1 text-xs font-bold border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white hover:scale-105 transition tooltip" onClick={handleRestart}>Relancer<span className="tooltiptext">Relance juste la partie</span></button>
                </div>
            </div>
        );
    }
}

export default Game;