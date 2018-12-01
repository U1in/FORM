import React, { Component } from 'react';
import Head from '../components/Headbar';

class Index extends Component {
    constructor(prop) {
        super(prop);
        this.state = {};
    }

    render () {
        return (
            <div>
                <Head jump={this.props.jump}></Head>
            </div>
        )
    }
}

export default Index;