//防抖函数
export const _debounce = () => {

    var _time = undefined;

    return (func, time) => {

        //存在定时器，清除
        if (_time) {
            clearTimeout(_time);
        }

        //设置定时器time后执行
        _time = setTimeout(function () {
            func();
        }, time);

    };
}

