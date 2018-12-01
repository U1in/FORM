import React, { Component } from 'react'

class IunputItem extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    input () {
        return (
            <input type="text" placeholder={this.props.info.placeholder} value={this.props.info.value} onChange={this.props.info.changeInput.bind(this, this.props.info.name)} className="input-item-input"></input>
        )
    }

    textarea () {
        return (
            <textarea rows={this.props.info.rows} placeholder={this.props.info.placeholder} value={this.props.info.value} onChange={this.props.info.changeTextarea.bind(this, this.props.info.name)} className="input-item-textarea"></textarea>
        )
    }

    checkbox () {
        let res = [];
        for (let i in this.props.info.value) {
            res.push(
                <div key={i} >
                    <input type="checkbox" name={i} value={this.props.info.value[i]} onClick={this.props.info.selectCheckbox.bind(this, this.props.info.name, i)} disabled={(this.props.info.length >= this.props.info.max && this.props.info.value[i] === false) ? 'disabled' : ''}/>
                    {i}
                    <br />
                </div>
            )
        }
        return (
            <div className="check-list-container">
                {res}
            </div>
        );
    }

    render() {
        let component;
        switch(this.props.info.type) {
            case 'input':
                component = this.input();
                break;
            case 'textarea': 
                component = this.textarea();
                break;
            case 'checkbox': 
                component = this.checkbox();
                break;
            default:
                component = '';
        }
        return (
            <div className="input-item-container">
                <div className="inpit-item-name"><i>*</i> {this.props.info.label} <div className="input-item-name-desc">{this.props.info.desc}</div></div>
                {component}
            </div>
        )
    }
}

export default IunputItem;