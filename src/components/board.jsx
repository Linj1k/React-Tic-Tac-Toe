import React from 'react';
import Case from './case';

class Board extends React.Component {
    constructor(props) {
        super(props);

        this.cases = Array(9).fill(0).map(() => React.createRef());
    }

    getCases() {
        return this.cases.map((item) => item.current);
    }

    clear() {
        this.cases.forEach((item) => {
            item.current.clear();
        });
    }

    render() {
        const rows = [];
        for (let i = 0; i < 3; i++) {
            const cases = [];
            for (let j = 0; j < 3; j++) {
                const index = i * 3 + j;
                cases.push(
                    <Case 
                        key={index}
                        ref={this.cases[index]} 
                        className={`${j < 2 && 'border-e'} ${i < 2 && 'border-b'}`} 
                        onCasePlayed={this.props.onCasePlayed} 
                    />
                );
            }
            rows.push(<div key={i} className="flex">{cases}</div>);
        }

        return <div>{rows}</div>;
    }
}

export default Board;