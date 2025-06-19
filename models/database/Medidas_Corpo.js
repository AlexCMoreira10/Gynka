import db from './db.js';

const Medida_Corpo = db.sequelize.define('Medida_Corpo', {
ID_DadosCorporais: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  ID_Usuario: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuario', // nome da tabela referenciada
      key: 'ID_USUARIO'
    }
  },
  Bra_Con_Di: {
    type: db.Sequelize.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  Bra_Con_Es: {
    type: db.Sequelize.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  Bra_Rx_Es: {
    type: db.Sequelize.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  Bra_Rx_Di: {
    type: db.Sequelize.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  Cx_Es: {
    type: db.Sequelize.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  Cx_Di: {
    type: db.Sequelize.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  Pt_Es: {
    type: db.Sequelize.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  Pt_Di: {
    type: db.Sequelize.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  Peitoral: {
    type: db.Sequelize.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  Abdomen: {
    type: db.Sequelize.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  Gluteo: {
    type: db.Sequelize.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  Quadril: {
    type: db.Sequelize.FLOAT,
    allowNull: true,
    validate: {
      min: 0
    }
  }
}, {
    tableName: 'Medida_Corpo'
  });

//Medida_Corpo.sync({force:true});

export default Medida_Corpo;
