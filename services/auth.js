var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
module.exports = (userRepository, domainRepository, errors) => {
    return {
        login: login,
        register: register
    };
    function login(data) {
        return new Promise((resolve, reject) => {
            userRepository
                .findOne({where: {name: data.name}, attributes: ['id', 'name', 'password']})
                .then((user) => {
                    if (user == null ) {
                        reject(errors.notFound);
                        return;
                    }
                    bcrypt.compare(data.password, user.password, (err, res) => {
                        if (res == true) {
                            console.log(user.id);

                            resolve(jwt.sign({__user_id: user.id/*__username: user.name*/}, 'DNS'));
                        }
                        else    reject(errors.InvalidNamePassword)
                    })
                })
                .catch(reject);
        });
    }

    function register(data) {
        return new Promise((resolve, reject) => {
                if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email) == false) {
                    return reject(errors.InvalidEmail);
                }
                else if (data.name.length < 3 || data.password.length < 5)
                    return reject(errors.InvalidNamePassword)
                else {
                    userRepository.findAll({
                        where: {
                            name: data.name
                        }
                    }).then((users) => {
                        if (users.length > 0) throw errors.noUnique;
                        else {
                            bcrypt.hash(data.password, 5, (err, hash) => {
                                let user = {
                                    email: data.email,
                                    password: hash,
                                    name: data.name,
                                };
                                userRepository.create(user);
                            })
                        }
                    }).then(() => resolve({success: true}))
                        .catch(reject);
                }
            }
        );
    }

    /*
     function checkPermissions(userId, route) {
     return new Promise((resolve, reject) => {
     if (permissions[route] == undefined) resolve();
     else if (userId == undefined) reject();
     else {
     Promise.all([
     userRepository.findById(userId),
     roleRepository.findOne({ where: { name: permissions[route] } })
     ])
     .then(([user, role]) => {
     return user.hasRole(role);
     })
     .then((has) => {
     if (has) resolve();
     else reject();
     })
     .catch(reject);
     }
     });
     }*/
}
;