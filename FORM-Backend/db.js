const Sequelize = require('sequelize');

const db = new Sequelize('form', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+08:00',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

});

const Form = db.define('form', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
    },
    name: {
        type: Sequelize.STRING,
        field: 'name',
        allowNull: false,
    },
    grade: {
        type: Sequelize.STRING,
        field: 'grade',
        allowNull: false,
    },
    purpose: {
        type: Sequelize.STRING,
        field: 'purpose',
        allowNull: false,
    },
    intro: {
        type: Sequelize.TEXT,
        field: 'intro',
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
        field: 'phone',
        allowNull: false,
        unique: true,
    }
});

Form.sync({ force: true });

const Judge = db.define('judge', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'user_id',
    },
    form_id: {
        type: Sequelize.INTEGER,
        field: 'form_id',
    },
    note: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: 'note',
    },
    score: {
        type: Sequelize.INTEGER,
        field: 'score'
    }
})

Judge.sync({ force: true});

module.exports = {
    db,
    Form,
    Judge,
}
