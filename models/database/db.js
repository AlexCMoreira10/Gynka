import {Sequelize} from "sequelize"

const sequelize = new Sequelize("gynka2", "root", "Novasenha8523!", {
    host: "localhost",
    dialect: "mysql"
})

export default {
    Sequelize: Sequelize,
    sequelize: sequelize
};