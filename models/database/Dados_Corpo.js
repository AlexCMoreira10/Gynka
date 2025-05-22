import db from './db.js'

const Dado_Corporal = db.sequelize.define('Dado_Corporal', {
    ID_DADO_CORPORAL: {
      type: db.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_USUARIO: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario', // nome da tabela relacionada
        key: 'ID_USUARIO' // deve bater com o nome real da chave primária na tabela Usuario
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    Idade: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 0, //garantias que a idade sera respeitada
        max: 150
      }
    },

    Altura: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      comment: 'Altura em centímetros'
    },

    Peso: {
      type: db.Sequelize.INTEGER,
      allowNull: false,
      comment: 'Peso em quilogramas'
    },

    BioTipo: {
      type: db.Sequelize.ENUM('Ectomorfo', 'Mesomorfo', 'Endomorfo'),
      allowNull: false
    },

    Sexo: {
      type: db.Sequelize.ENUM('M', 'F', 'Outro'),
      allowNull: true
    },

    TipoFisico: {
      type: db.Sequelize.ENUM('Magro', 'Atletico', 'Acima do Peso', 'Sedentario', 'Outro'),
      allowNull: false
    }
  }, {tableName: 'Dado_Corporal'});

Dado_Corporal.sync({force:true})

export default Dado_Corporal;