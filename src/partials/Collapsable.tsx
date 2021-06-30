import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import "./Collapsable.css"

type Props = {
    title: string,
    children: React.ReactChild | React.ReactChild[];
    defaultCollapsed: boolean
}

type State = {
    collapsed: boolean
}

class Collapsable extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            collapsed: props.defaultCollapsed
        }
    }

    render() {
        return <div className="Collapsable">
            <div className="head">
                <h2 className="title">{this.props.title}</h2>
                <div className="collapsable-control">
                    <Button variant="secondary" onClick={() => this.toggleCollapsed()}>{this.getButtonContent()}</Button>
                </div>
            </div>
            <div hidden={this.state.collapsed}>
                {this.props.children}
            </div>
        </div>;
    }

    getButtonContent() {
        return this.state.collapsed ? "View" : "Collapse";
    }

    toggleCollapsed() {
        this.setState(Object.assign({}, this.state, {collapsed: !this.state.collapsed}));
    }
}

export default Collapsable;