module.exports = (Sequelize, sequelize) => {
    return sequelize.define('domains', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            domain: {
                type: Sequelize.STRING,
                allowNull: false

            },
            status: Sequelize.BOOLEAN
        }/*,
        {
            timestamps: false
        }*/
    )
        ;
};