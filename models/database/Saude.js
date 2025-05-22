import db from './db.js';


const Dados_Saude = db.sequelize.define('Dados_Saude',{
ID_DADO_MEDICO: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    ID_USUARIO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'ID_USUARIO'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },

    cirurgia: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Registro de cirurgias feitas'
    },

    medicacao: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Medicações de uso contínuo'
    },

    doencas: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Doenças conhecidas'
    },

    grupo_risco: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Se pertence a grupo de risco (true/false)'
    }
  }, {tableName: 'Saude'});

Dados_Saude.sync({force:true})

export default Dados_Saude;
