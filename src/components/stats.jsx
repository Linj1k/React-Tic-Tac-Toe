import React from 'react';

class Stats extends React.Component {
    render() {
        const Game = this.props.game;
        return (
            <div className={`stats text-center ${this.props.className}`}>
                <h1 className="text-lg font-bold">Statistiques</h1>

                <div className="flex justify-center">
                    <div className="px-4 py-2 mx-2 bg-gray rounded-md flex flex-col justify-center items-center">
                        <h1 className="text-sm font-bold">{Game.state.player1.name}</h1>
                        <span>Gagnées: {Game.state.player1.win}</span>
                        <span>Perdues: {Game.state.player1.lose}</span>
                    </div>
                    <div className="px-4 py-2 mx-2 bg-gray rounded-md flex flex-col justify-center items-center">
                        <h1 className="text-sm font-bold">{Game.state.player2.name}</h1>
                        <span>Gagnées: {Game.state.player2.win}</span>
                        <span>Perdues: {Game.state.player2.lose}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Stats;