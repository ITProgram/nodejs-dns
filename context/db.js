module.exports = (Sequelize, config) => {
    const optionsProduction = {
        host: config.db.host,
        dialect: config.db.dialect,
        dialectOptions: {ssl: true}
    };
    const optionsLocal = {
        host: config.dbl.host,
        dialect: 'mysql',
        logging: false,
        define: {
            timestamps: true,
            paranoid: true,
            defaultScope: {
                where: {
                    deletedAt: {$eq: null}
                }
            }
        }
    };
    let sequelize;
    if (global.isProduction = process.env.NODE_ENV === 'production' ||  process.env.NODE_ENV === 'test')
        sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, optionsProduction);
    else
        sequelize = new Sequelize(config.dbl.name, config.dbl.user, config.dbl.password, optionsLocal);

    const User = require('../models/user')(Sequelize, sequelize);
    const Domain = require('../models/domain')(Sequelize, sequelize);
    Domain.belongsTo(User);

    return {
        user: User,
        domain: Domain,
        sequelize: sequelize
        //role: Role,
        //post: Post,
    };

};

//const Role = require('../models/role')(Sequelize, sequelize);
//const UserRole = require('../models/userRole')(Sequelize, sequelize);
//const Post = require('../models/post')(Sequelize, sequelize);

/*
 // User <-> Role
 User.belongsToMany(Role,
 {through: UserRole});

 Role.belongsToMany(User,
 {through: UserRole});

 // Post -> User
 Post.belongsTo(User);
 User.hasMany(Post);
 */