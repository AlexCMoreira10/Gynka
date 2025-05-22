import db  from './db.js'

const Habitos = db.sequelize.define('Habitos', {
    ID_HABITO: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    ID_USUARIO: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'Usuario',
            key: 'ID_USUARIO'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },

    sono: {
        type: db.Sequelize.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 24
        },
        comment: 'Horas de sono por noite'
    },

    preferencia: {
        type: db.Sequelize.STRING,
        allowNull: true,
        comment: 'Tipo de treino preferido'
    },

    periodo: {
        type: db.Sequelize.ENUM('manha', 'tarde', 'noite'),
        allowNull: true,
        comment: 'Período preferido para treinar'
    },
    }, {tableName:'Habitos'});

//Habitos.sync({force: true})

export default Habitos