import React, { Component } from 'react'

class Step extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    initStep () {
        let result = [];
        for(let i = 0, j = 0, q = 0; i < this.props.stepInfo.length; i++, j++, q = q + 2) {
            if(i < this.props.current) {
                result.push((
                    <div className="step-circle-group" key={q}>
                        <div className="step-circle active" onClick={this.props.back.bind(this, i + 1)}>
                            <div className="step-circle-inside">
                                <i className="fa fa-check"></i>
                            </div>
                            
                        </div>
                        <div className="step-name active">
                            {this.props.stepInfo[i]}
                        </div>
                    </div>
                ))
            }
            else {
                result.push((
                    <div className="step-circle-group" key={q}>
                        <div className="step-circle" onClick={this.props.back.bind(this, i + 1)}>
                            <div className="step-circle-inside">
                                <i className="fa fa-check"></i>
                            </div>

                        </div>
                        <div className="step-name">
                            {this.props.stepInfo[i]}
                        </div>
                    </div>
                ))
            }
            if (j < this.props.stepInfo.length - 1) {
                if (i < this.props.current - 1)
                    result.push((
                        <div className="step-line active" key={q + 1}></div>
                    ))
                else {
                    result.push((
                        <div className="step-line" key={q + 1}></div>
                    ))
                }
            }
        }
        return result;
    }


    render() {
        let component = this.initStep();
        return (
            <div className="step-container">
                { component }
            </div >
        )
    }
}

export default Step;