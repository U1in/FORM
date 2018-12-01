import React, { Component } from 'react';
import Head from '../components/Headbar';
import InputItem from '../components/InputItem';
import Step from '../components/Step';
import { $post } from '../tools/ajax';
import { _debounce } from '../tools/debounce';

class Interview extends Component {
    constructor(prop) {
        super(prop);
        this.$post = $post;
        this.scoreInputRef = React.createRef();
        this.interviewContainer = React.createRef();
        this.addTagInput = React.createRef();
        this.state = {
            stepInfo: ['确认身份', '面试会话', '对比评定'],
            tags: localStorage.getItem('tags') === null ? [] : JSON.parse(localStorage.getItem('tags')),
            interviewerNameInfo: {
                label: '面试官ID',
                type: 'input',
                placeholder: '面试官ID',
                changeInput: this.interviewerNameInput,
                value: localStorage.getItem('interviewerName') || '',
                name: 'interviewerNameInfo',
            },
            intervieweePhoneInfo: {
                label: '被面试者电话',
                type: 'input',
                placeholder: '被面试者电话',
                changeInput: this.intervieweeNameInput,
                value: '',
                name: 'intervieweePhoneInfo',
            },
            interviewInfo: {
                label: '面试笔记',
                type: 'textarea',
                placeholder: '面试时的随笔',
                changeTextarea: this.interviewNoteInput,
                value: '',
                name: 'interviewInfo',
                rows: 20,
            },
            scoreInput: false,
            score: 80,
            addTagShow: false,
            addTagString: '',
            intervieweeName: '',
            intervieweeInfo: {
                id: "",
                name: "",
                purpose: "",
                intro: "",
            },
            judgeList: [],
        };

        this.interviewerNameInput = this.interviewerNameInput.bind(this);
        this.interviewNoteInput = this.interviewNoteInput.bind(this);
        this.enterScore = this.enterScore.bind(this);
        this.showScoreInput = this.showScoreInput.bind(this);
        this.addScore = this.addScore.bind(this);
        this.subScore = this.subScore.bind(this);
        this.judge = this.judge.bind(this);
        this.getJudgeList = this.getJudgeList.bind(this);

        this._intervieweeNameInput = _debounce();
    }

    componentWillMount () {
        let step = window.location.hash.split('/')[2];
        if (step === "" || step === undefined) {
            this.props.jump('/interview/1');
        }
        else {
            step = parseInt(step);
            if(!isNaN(step)) {
                if(step >= 4 || step <= 0) {
                    this.props.jump('/interview/1');
                }
            }
        }
    }

    componentWillUpdate () {
        let step = window.location.hash.split('/')[2];
        if (step === "" || step === undefined) {
            this.props.jump('/interview/1');
        }
        else {
            step = parseInt(step);
            if (!isNaN(step)) {
                if (step >= 4 || step <= 0) {
                    this.props.jump('/interview/1');
                }
            }
        }
    }

    componentWillUnmount () {
        localStorage.setItem('tags', JSON.stringify(this.state.tags));
    }

    interviewNoteInput = (name, e) => {
        this.setState({
            [name]: Object.assign({}, this.state[name], { value: e.target.value }),
        })
    }

    interviewerNameInput = (name, e) => {
        this.setState({
            [name]: Object.assign({}, this.state[name], { value: e.target.value}),
        })
    }

    //防抖函数请求被面试者姓名
    intervieweeNameInput = (name, e) => {
        this.setState({
            [name]: Object.assign({}, this.state[name], { value: e.target.value }),
            intervieweeName: "",
        }, () => {
            let data = {
                phone: this.state.intervieweePhoneInfo.value,
            }

            this._intervieweeNameInput(() => {
                if(data.phone !== "") {
                    this.$post('/get_name', data).then(resp => {
                        if (resp.code === 1) {
                            this.setState({
                                intervieweeName: resp.data.name,
                            })
                        }
                        else {
                            this.setState({
                                intervieweeName: "查询不到结果TAT",
                            })
                        }
                    }).catch(error => { console.log(error) });
                }
            }, 1000);
        })
    }

    enterScore = (e) => {
        if (e.keyCode === 13) {
            if (!isNaN(parseInt(this.scoreInputRef.current.value))) {
                this.setState({
                    score: parseInt(this.scoreInputRef.current.value),
                    scoreInput: false,
                })
            }
            else {
                this.setState({
                    score: 0,
                    scoreInput: false,
                })
            }
        }
    }

    addScore = () => {
        if (this.state.score <= 99) {
            this.setState({
                score: this.state.score + 1
            })
        } 
    }

    subScore = () => {
        if (this.state.score >= 1) {
            this.setState({
                score: this.state.score - 1
            })
        }
    }

    showScoreInput = () => {
        this.setState({
            scoreInput: true,
        })
    }

    back = (i, e) => {
        let step = window.location.hash.split('/')[2];
        if(!isNaN(parseInt(step))) {
            step = parseInt(step);
            if(i <= step) {
                document.getElementById('root').scrollIntoView();
                this.props.jump('/interview/' + i);
            }
        }
    }

    //离开路由
    forward = (i, e) => {
        let step = window.location.hash.split('/')[2];
        if (!isNaN(parseInt(step))) {
            step = parseInt(step);
            if (i >= step) {
                document.getElementById('root').scrollIntoView();
                if(i === 1) {
                    if (this.state.intervieweeName !== "") {
                        localStorage.setItem('interviewerName', this.state.interviewerNameInfo.value);
                        this.props.jump('/interview/' + (i + 1));
                    }
                }
                else if(i === 2) {
                    this.props.jump('/interview/' + (i + 1));
                } 
                else if(i === 3) {
                    this.props.jump('/interview/' + (i + 1));
                }
                
            }
        }
    }

    addTag = (text, e) => {
        this.setState({
            interviewInfo: Object.assign({}, this.state.interviewInfo, { value: this.state.interviewInfo.value + '\n' + text + '\n' }),
        })
    }

    showAddTagToggle = () => {
        this.setState({
            addTagShow: !this.state.addTagShow
        })
    }

    addTagInputKeydown = (e) => {
        if(e.keyCode === 13) {
            let newArray = this.state.tags;
            newArray.push(this.addTagInput.current.value)
            this.setState({
                addTagString: newArray,
            }, () => {
                this.showAddTagToggle();
            })
        }
    }

    judge = () => {

        let data = {
            user_id: this.state.interviewerNameInfo.value,
            form_id: this.state.intervieweeInfo.id,
            note: this.state.interviewInfo.value,
            score: this.state.score
        }
        this.$post('/judge', data).then(resp => {
            if(resp.code === 1) {
                alert('打分成功');
            }
        }).catch(error => {
            alert(error);
        });
        
    }

    getJudgeList = () => {
        let data = {
            user_id: this.state.interviewerNameInfo.value,
        }
        return this.$post('/get_judge', data);
        
    }

    render () {
        let step = window.location.hash.split('/')[2];

        let buttonGroup = () => {
            return;
        }

        let component = () => {
            return;
        }

        if (step === '1') {

            let info = [];

            //刚进入时的逻辑
            if (this.state.intervieweeName === '' && this.state.intervieweePhoneInfo.value === '') {
                
            }
            //已经开始输入但是还没有查询结果的逻辑
            else if (this.state.intervieweeName === '' && this.state.intervieweePhoneInfo.value !== '') {
                info.push(
                    <div className="interview-step-1-result" key={1}>
                        <i className="fa fa-spinner fa-spin"></i>
                    </div>
                );
            }
            //查询结果抵达的逻辑
            else if (this.state.intervieweeName !== '' && this.state.intervieweePhoneInfo.value !== '') {
                info.push(
                    <div className="interview-step-1-result" key={1}>
                        {this.state.intervieweeName}
                    </div>);
                info.push(<div className="interview-step-1-info" key={2}>待身份确认无误后，再进行下一步</div>)
            }

            buttonGroup = () => {
                return (
                    <div className="interview-button-group">
                        <div className="interview-button" onClick={this.forward.bind(this, 1)} key="right">
                            <i className="fa fa-angle-right"></i>
                        </div>
                    </div>
                )
            }

            component = () => {
                return (
                    <div className="interview-body">
                        <InputItem info={this.state.interviewerNameInfo} key={this.state.interviewerNameInfo.name}></InputItem>
                        <InputItem info={this.state.intervieweePhoneInfo} key={this.state.intervieweePhoneInfo.name}></InputItem>
                        {info}
                    </div>
                )
            }
        }
        else if (step === '2') {

            if(this.state.intervieweePhoneInfo.value !== "") {
                if (this.state.intervieweeInfo.name === "" || this.state.intervieweeInfo.purpose === "" || this.state.intervieweeInfo.intro === "") {
                    let data = {
                        phone: this.state.intervieweePhoneInfo.value,
                    }

                    this.$post('/get_form', data).then(resp => {
                        if (resp.code === 1) {
                            this.setState({
                                intervieweeInfo: Object.assign({}, this.state.intervieweeInfo, {
                                    id: resp.data.id,
                                    name: resp.data.name,
                                    purpose: JSON.parse(resp.data.purpose).join(' '),
                                    intro: resp.data.intro,
                                })
                            });
                        }
                    }).catch(error => { console.log(error) });
                }
            }
            else {
                this.props.jump('/interview/1');
            }

            buttonGroup = () => {
                return (
                    <div className="interview-button-group">
                        <div className="interview-button" onClick={this.forward.bind(this, 2)} key="right">
                            <i className="fa fa-angle-right"></i>
                        </div>
                    </div>
                )
            }

            component = () => {
                let tags = [];
                let addTagComponent;
                if (this.state.addTagShow) {
                    addTagComponent = (
                        <div className="addtag-container" onClick={this.showAddTagToggle.bind(this)}>
                            <div className="addtag" >
                                <input type="text" onClick={(e) => { e.stopPropagation(); }} placeholder="输入新的短语" ref={this.addTagInput} onKeyDown={this.addTagInputKeydown.bind(this)}></input>
                            </div>
                        </div>
                    )
                }
                for(let i in this.state.tags) {
                    tags.push(<div key={i} onClick={this.addTag.bind(this, this.state.tags[i])}>{this.state.tags[i]}</div>)
                }
                return (
                    <div className="interview-body">
                        <div className="interview-step-2-title">
                            <div>面试者姓名:</div>
                            <div className="interview-step-2-value">
                                {this.state.intervieweeInfo.name}
                            </div>
                        </div>
                        <div className="interview-step-2-title">
                            <div>面试者意向:</div>
                            <div className="interview-step-2-value">
                                {this.state.intervieweeInfo.purpose}
                            </div>
                        </div>
                        <div className="interview-step-2-title intro">
                            <div>面试者简介:</div>
                            <div className="interview-step-2-value intro">
                                {this.state.intervieweeInfo.intro}
                            </div>
                        </div>
                        <div className="interview-step-2-tags">
                            <div className="tag-add-button" onClick={this.showAddTagToggle.bind(this)} >
                                <i className="fa fa-pencil" aria-hidden="true"></i>
                                {addTagComponent}
                            </div>
                            {tags}
                        </div>
                        <InputItem info={this.state.interviewInfo}></InputItem>
                    </div>
                )
            }
        }
        else if(step === '3'){

            let list = [];

            if(this.state.judgeList.length === 0) {
                this.getJudgeList().then( resp => {
                    if(resp.code === 1) {
                        this.setState({
                            judgeList: resp.data,
                        });
                    }
                }).catch(error => { console.log(error) });
            }
            else {
                for(let i in this.state.judgeList) {
                    list.push(
                        <div className="interview-step-3-member" key={i}>
                            <div className="rank">{parseInt(i) + 1}</div>
                            <div>{this.state.judgeList[i].name}</div>
                            <div className="score">{this.state.judgeList[i].score}</div>
                        </div>
                    )
                }
            }

            buttonGroup = () => {
                return (
                    <div className="interview-button-group">
                        <div className="interview-button submit" key="right" onClick={this.judge}>
                            <i className="fa fa-check"></i>
                        </div>
                    </div>
                )
            }

            component = () => {

                let score;
                
                if (this.state.scoreInput) {
                    score = () => {
                        return (
                            <div className="interview-step-3-score-container">
                                <input type="text" onKeyDown={this.enterScore} ref={this.scoreInputRef} defaultValue={this.state.score} autoFocus="autofocus"></input>
                            </div>
                        )
                    }
                }
                else {
                    score = () => {
                        return (
                        <div className="interview-step-3-score-container">
                                <div className="interview-step-3-score-button" onClick={this.addScore}>
                                <i className="fa fa-angle-up"></i>
                            </div>

                            <div className="interview-step-3-score" onClick={this.showScoreInput}>{this.state.score}</div>

                            <div className="interview-step-3-score-button" onClick={this.subScore}>
                                <i className="fa fa-angle-down"></i>
                            </div>
                        </div>)
                    }
                }
                return (
                    <div className="interview-step-3" >
                        {score()}
                        <div className="interview-step-3-member-container">
                            {list}
                        </div>
                    </div>
                )
            }
        }
        return (
            <div className="container">
                <Head jump={this.props.jump}></Head>
                <div className="interview-container" ref={this.interviewContainer}>
                    <Step current={step} stepInfo={this.state.stepInfo} back={this.back}></Step>
                        {component()}
                </div>
                {buttonGroup()}
            </div>
        )
    }
}

export default Interview;