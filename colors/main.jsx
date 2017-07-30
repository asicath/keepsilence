


class CardDisplay extends React.Component {
    render() {
        return <div>
                <div className="card-holder"><img className="card" src="img/c01.jpg" /></div>
                <div className="card-holder">
                    <PathColors path={paths["13"]} />
                    <PathColors path={paths["13"]} />
                </div>
        </div>
    }
}

class PathColors extends React.Component {
    render() {
        return <div className="path-colors">
            <div><ColorButton color={this.props.path.colors[0]} /><div className="color-button-label">king scale</div></div>
            <div><ColorButton color={this.props.path.colors[1]} /><div className="color-button-label">queen scale</div></div>
            <div><ColorButton color={this.props.path.colors[2]} /><div className="color-button-label">emperor scale</div></div>
            <div><ColorButton color={this.props.path.colors[3]} /><div className="color-button-label">empress scale</div></div>
        </div>
    }
}

class ColorButton extends React.Component {
    render() {
        return <div className="color-button" style={{backgroundColor: "#" + this.props.color.back}}>
            <table><tbody><tr><td className="color-name">{this.props.color.name}</td></tr></tbody></table>
        </div>
    }
}

const paths = {

    "13": {
        type: 'Planet',
        name: 'Luna',
        colors: [
            { back: "0085ca", name: "Blue" },
            { back: "e8e8e8", name: "Silver" },
            { back: "A5C5D9", name: "Cold pale blue" },
            { back: "e8e8e8", rayed: "8ABAD3", name: "Silver, rayed sky blue" }
        ]
    }

}

const element = <CardDisplay />;
ReactDOM.render(
    element,
    document.getElementById('root')
);
