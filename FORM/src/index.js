import React from 'react';
import ReactDOM from 'react-dom';
import './static/css/index.css';
import './static/css/font-awesome.css'


import Index from './page/index';
import Form from './page/form';
import Interview from './page/interview';

var changeRoute = (url) => {
    //更新路由
    window.location.hash = url;
    //应用路由
    route();
}

var route = () => {
    //获取当前路由
    let url = window.location.hash === '' ? '#/index' : '/'+window.location.hash.split('/')[1];
    //切换路由
    switch (url) {
        case '/index':
            ReactDOM.render(<Index  jump={changeRoute} />, document.getElementById('root'));
            break;
        case '/form':
            ReactDOM.render(<Form jump={changeRoute} />, document.getElementById('root'));
            break;
        case '/interview':
            ReactDOM.render(<Interview jump={changeRoute} />, document.getElementById('root'));
            break;
        default:
            ReactDOM.render(<Index jump={changeRoute} />, document.getElementById('root'));
    }
}

route();