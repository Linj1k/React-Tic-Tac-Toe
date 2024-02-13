import React from 'react';

class Case extends React.Component {
    constructor(props) {
        super(props);

        this.caseRef = React.createRef()
        this.state = {
            used: -1,
            winning: false
        };
    }

    setUsed(turn, onUpdated) {
        this.setState((prevState) => ({used: turn}), onUpdated);
    }

    clear() {
        this.setState({used: -1, winning: false});
    }

    render() {
        const caseItem = this;
        function handleClick(e) {
            e.preventDefault();
            if (caseItem.state.used !== -1) return;
            if (typeof(caseItem.props.onCasePlayed) == 'function') caseItem.props.onCasePlayed(caseItem);
        }

        const usedClass = ["", "text-primary", "text-secondary"][this.state.used]
    
        return (
            <div ref={this.caseRef} className={`case border-primary w-24 h-24 flex justify-center items-center text-5xl font-bold cursor-pointer ${this.props.className} ${this.state.winning && "bg-green-200"} ${usedClass}`} onClick={handleClick}>{["", "X", "O"][this.state.used]}</div>
        );
    }
}

export default Case;