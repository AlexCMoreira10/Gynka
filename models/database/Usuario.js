import db from './db.js';

const Usuario = db.sequelize.define('Usuario', {
    ID_USUARIO: {
        type: db.Sequelize.INTEGER(15),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Nome: {
        type: db.Sequelize.STRING(30),
        allowNull: false
    },
    SobreNome: {
        type: db.Sequelize.STRING(50),
        allowNull: false
    },
    email: {
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
    telefone: {
        type: db.Sequelize.BIGINT(11),
        allowNull: false,
        unique: true
    },
    Estado: {
        type: db.Sequelize.ENUM(
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
            'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
            'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ),
        allowNull: true
    },
    Cidade: {
        type: db.Sequelize.STRING(30),
        allowNull: false
    },
    Cep: {
        type: db.Sequelize.CHAR(8),
        allowNull: false
    },
    Lagradouro: {
        type: db.Sequelize.STRING(30),
        allowNull: true
    },
    N_casa: {
        type: db.Sequelize.INTEGER(5),
        allowNull: true
    },
    Complemento: {
        type: db.Sequelize.STRING(30),
        allowNull: true
    }
}, {
    tableName: 'Usuario',
    timestamps: false
});

Usuario.sync({force:true})

export default Usuario;