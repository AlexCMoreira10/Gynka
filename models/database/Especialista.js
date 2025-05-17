import db from './db.js'

const Especialista = db.sequelize.define('Especialista', {
    ID_ESPECIALISTA: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Nome: {
        type: db.Sequelize.STRING(30),
        allowNull: false
    },
    Sobrenome: {
        type: db.Sequelize.STRING(50),
        allowNull: false
    },
    Email: {
        type: db.Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    senha: {
        type: db.Sequelize.STRING(255),
        allowNull: false,
        validate: {
            len: [8, 255] // mínimo 8, máximo 255 caracteres
        }
    },
    Telefone: {
        type: db.Sequelize.BIGINT,
        allowNull: false
    },
    Cod_conselho_classe: {
        type: db.Sequelize.STRING(30),
        allowNull: false
    },
    Especialidade: {
        type: db.Sequelize.STRING(30),
        allowNull: false
    }
    }, {
        tableName: 'Especialista',
        timestamps: false
    });

Especialista.sync({force: true})
export default Especialista