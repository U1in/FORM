const Koa = require('koa');
const Router = require('koa-router');
const KoaBody = require('koa-body');
const Logger = require('koa-logger');
const KoaCors = require('koa2-cors');
const { db, Form, Judge} = require('./db');

const app = new Koa();
const router = new Router();

app.use(Logger());

app.use(KoaCors({
    origin: function (ctx) {
        return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: false,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(KoaBody());

router.post('/form', async (ctx, next) => {
    try {
        let result = await Form.create({
            name: ctx.request.body.name,
            grade: ctx.request.body.grade,
            purpose: JSON.stringify(ctx.request.body.purpose),
            intro: ctx.request.body.intro,
            phone: ctx.request.body.phone,
        });

        let response = {
            code: 1,
            message: "提交成功",
        }

        ctx.response.body = response;
    } catch (error) {
        console.log(error);
        let result = await Form.findOne({
            phone: ctx.request.body.phone,
        })
        let response;
        if (result.phone === ctx.request.body.phone) {
            response = {
                code: 0,
                message: "注册手机号已存在",
            }
        }
        else {
            response = {
                code: 0,
                message: "提交失败，请重试",
            }
        }
        ctx.response.body = response;
    }
});

router.post('/get_name', async (ctx, next) => {
    try {
        let result = await Form.findOne({
            where: {
                phone: ctx.request.body.phone,
            }
        })
        let response = {
            code: 0,
            message: "查询不到结果",
        }
        if(result != null) {
            response = {
                code: 1,
                message: "查询姓名成功",
                data: {
                    name: result.name
                }
            }
        }
        ctx.response.body = response;
    } catch (error) {
        let response = {
            code: 0,
            message: "查询失败"
        };
        ctx.response.body = response;
    }
})

router.post('/get_form', async (ctx, next) => {
    try {
        let result = await Form.findOne({
            where: {
                phone: ctx.request.body.phone,
            }
        })
        let response = {
            code: 1,
            message: "查询报名表成功",
            data: result.dataValues,
        }
        ctx.response.body = response;
    } catch (error) {
        console.log(error);
    }
})

router.post('/judge', async (ctx, next) => {
    try {
        let result = await Judge.create({
            user_id: ctx.request.body.user_id,
            form_id: ctx.request.body.form_id,
            note: ctx.request.body.note,
            score: ctx.request.body.score
        })
        let response = {
            code: 1,
            message: "打分成功",
        }
        ctx.response.body = response;
    } catch (error) {
        console.log(error);
    }
})

router.post('/get_judge', async (ctx, next) => {
    try {
        let query = `SELECT form.forms.name, form.judges.score FROM form.forms, form.judges WHERE form.forms.id = form.judges.form_id AND form.judges.user_id = "${ctx.request.body.user_id}" ORDER BY form.judges.score DESC;`
        let result = await db.query(query, { type: db.QueryTypes.SELECT });
        let response = {
            code: 1,
            message: "查询记录成功",
            data: result,
        }
        ctx.response.body = response;
    } catch (error) {
        
    }
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, '0.0.0.0', () => {
    console.log('koa is running at 4000');
})