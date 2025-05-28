import {Sequelize} from "sequelize"

const sequelize = new Sequelize("gynka2", "root", "", {
    host: "localhost",
    dialect: "mysql"
})

export default {
    Sequelize: Sequelize,
    sequelize: sequelize
};