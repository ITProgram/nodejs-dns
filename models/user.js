
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },

        password: {
            type: Sequelize.STRING,
        },
        money:{
            type: Sequelize.INTEGER,
            defaultValue: 100
        }
    }/*, {timestamps: false}*/);
};