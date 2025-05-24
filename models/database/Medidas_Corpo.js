import db from './db.js';

const Medida_Corpo = db.sequelize.define('Medida_Corpo', {
    id_usuario: {
        type: db.Sequelize.INTEGER(15),
        allowNull: false,
        references: {
            model: 'Usuario', // nome da tabela referenciada
            key: 'ID_USUARIO' // NO DA CHAVE DE REFERENCIA
      },
       onUpdate: 'CASCADE',
       onDelete: 'CASCADE'
    },

     biceps_direito: {
      type: db.Sequelize.FLOAT,
      allowNull: true
    },
    triceps_direito: {
      type: db.Sequelize.FLOAT,
      allowNull: true
    },
    deltoid_direito: {
      type: db.Sequelize.FLOAT,
      allowNull: true
    },
    coxa_direita: {
      type: db.Sequelize.FLOAT,
      allowNull: true
    },
    panturrilha_direita: {
      type: db.Sequelize.FLOAT,
      allowNull: true
    },

    // Lado esquerdo
    biceps_esquerdo: {
      type: db.Sequelize.FLOAT,
      allowNull: true
    },
    triceps_esquerdo: {
      type: db.Sequelize.FLOAT,
      allowNull: true
    },
    deltoid_esquerdo: {
      type: db.Sequelize.FLOAT,
      allowNull: true
    },
    coxa_esquerda: {
      type: db.Sequelize.FLOAT,
      allowNull: true
    },
    panturrilha_esquerda: {
      type: db.Sequelize.FLOAT,
      allowNull: true
    },

    // Medidas centrais (únicas)
    peitoral: {
      type: db.Sequelize.FLOAT,
      allowNull: true
    },
    cintura: {
      type: db.Sequelize.FLOAT,
      allowNull: true
    },
    gordura: {
        type: db.Sequelize.INTEGER,
        allowNull: true
    }
  }, {
    tableName: 'Medida_Corpo'
  });

//Medida_Corpo.sync({force:true});

export default Medida_Corpo;
