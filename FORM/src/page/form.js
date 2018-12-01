import React, { Component } from 'react';
import Head from '../components/Headbar';
import InputItem from '../components/InputItem';
import { $post } from '../tools/ajax';

class Form extends Component {
    constructor(props) {
        super(props);
        this.$post = $post;
        this.state = {
            nameInfo: {
                name: 'nameInfo',
                label: '你的姓名',
                type: 'input',
                placeholder: '你的姓名',
                changeInput: this.changeInput,
                desc: '暂时使用真名',
                value: '',
            },
            gradeInfo: {
                name: 'gradeInfo',
                label: '你的班号',
                type: 'input',
                placeholder: '你的班号',
                changeInput: this.changeInput,
                desc: '仅面向大一新生，老生请移步滚动招新渠道',
                value: '',
            },
            checkListInfo: {
                name: 'checkListInfo',
                label: '你的意向',
                type: 'checkbox',
                selectCheckbox: this.selectCheckbox,
                value: { '技术部': false, '宣传部': false, '秘书部': false, '运维部': false, '活动部': false },
                desc: '具体介绍请移步官网 https://xdsec.org',
                length: 0,
                max: 2,
            },
            introductionInfo: {
                name: 'introductionInfo',
                label: '你的介绍',
                type: 'textarea',
                placeholder: 
`1.若意向是技术岗，请告知我们你的技术经历，起因经过结果，这有助于我们更好的了解你，也有助于你的通过。

 2.若意向是宣传部，请告知我们你的活动经历，起因经过结果，这有助于我们更好的了解捏，也有助于你的通过。`,
                rows: 20,
                changeTextarea: this.changeTextarea,
                value: '',
            },
            phoneInfo: {
                name: 'phoneInfo',
                label: '你的电话',
                placeholder: '你的电话',
                type: 'input',
                changeInput: this.changeInput,
                value: '',
                desc: '方便随后的联系'
            },
        };


        this.submit = this.submit.bind(this);
    }

    changeInput = (name, e) => {
        this.setState({
            [name]: Object.assign({}, this.state[name], {value: e.target.value}),
        });
        
    }

    changeTextarea = (name, e) => {
        this.setState({
            [name]: Object.assign({}, this.state[name], { value: e.target.value }),
        })
    }

    selectCheckbox = (name, i, e) => {
        let newObject;
        if (this.state[name].value[i]) {
            newObject = Object.assign({}, this.state[name].value, {[i]: false});
            newObject = Object.assign({}, this.state[name], { length: this.state[name].length - 1 }, {value: newObject});
        }
        else {
            newObject = Object.assign({}, this.state[name].value, { [i]: true });
            newObject = Object.assign({}, this.state[name], { length: this.state[name].length + 1 }, { value: newObject });
        }
        this.setState({
            [name]: newObject,
        }, () => {
            
        })
    }

    submit = () => {
        let purpose = [];
        for(let i in this.state.checkListInfo.value) {
            if (this.state.checkListInfo.value[i] === true) {
                purpose.push(i);
            }
        }
        let data = {
            name: this.state.nameInfo.value,
            grade: this.state.gradeInfo.value,
            purpose: purpose,
            intro: this.state.introductionInfo.value,
            phone: this.state.phoneInfo.value,
        }

        this.$post('/form', data).then(resp => {
            alert(resp.message);
        }).catch(error => {
            // alert(error);
        });
        
    }

    render() {
        return (
            <div className="container">
                <Head jump={this.props.jump}></Head>
                <div className="form-container">
                    <div className="form-title">XDSEC报名表</div>
                    <InputItem info={this.state.nameInfo} ></InputItem>
                    <InputItem info={this.state.gradeInfo} ></InputItem>
                    <InputItem info={this.state.checkListInfo} ></InputItem>
                    <InputItem info={this.state.introductionInfo} ></InputItem>
                    <InputItem info={this.state.phoneInfo} ></InputItem>


                    <div className="circle-submit" onClick={this.submit.bind(this)}>
                        <i className="fa fa-check"></i>
                    </div>
                </div>
            </div>
        )
    }
}

export default Form;