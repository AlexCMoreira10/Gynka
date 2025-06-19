import db from './db.js'
import Especialista from './Especialista.js'
import Usuario from './Usuario.js'

const Agendamento = db.sequelize.define('Agendamento', {
  ID_Agendamento: {
    type: db.Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  ID_ESPECIALISTA: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Especialista,
      key: 'ID_ESPECIALISTA'
    },
  },
  ID_USUARIO: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'ID_USUARIO'
    },
  },
  DATA: {
    type: db.Sequelize.DATE,
    allowNull: false
  }
}, {
  tableName: 'Agendamento',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['ID_ESPECIALISTA', 'DATA']
    },
    {
      unique: true,
      fields: ['ID_USUARIO', 'DATA']
    }
  ]
});

// Relacionamentos (opcional, se quiser usar métodos como .getUsuario())
Agendamento.belongsTo(Especialista, { foreignKey: 'ID_ESPECIALISTA' });
Agendamento.belongsTo(Usuario, { foreignKey: 'ID_USUARIO' });
Agendamento.sync(); //{force:true}
export default Agendamento;
