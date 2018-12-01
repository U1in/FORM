import React, { Component } from 'react'

class Head extends Component {
    constructor(props) {
        super(props);
        this.state = {
            route: '',
        }
    }

    getURL () {
        this.setState((preValue, props) => ({
            route: window.location.hash.split('/')[1],
        }))
    }

    componentWillMount () {
        this.getURL();
    }

    render () {
        return (
            <div className="head-container">
                <div onClick={this.props.jump.bind(this, '/index')} className={this.state.route === '/index' ? 'active' : ''}>首页</div>
                <div onClick={this.props.jump.bind(this, '/form')} className={this.state.route === '/form' ? 'active' : ''}>问卷</div>
                <div onClick={this.props.jump.bind(this, '/interview')} className={this.state.route === '/interview' ? 'active' : ''}>面试</div>
            </div>
        )
    }
}

export default Head;