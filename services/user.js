var bcrypt = require('bcryptjs');
const Promise = require('bluebird');
var jwt = require('jsonwebtoken');
const errors = require('../utils/errors');
module.exports = (userRepository, errors) => {
    const config = require('../config.json');

    function UserService(userRepository, errors) {

        var self = this;
        self.updateUser = updateUser;
        self.readAllUser = readAllUser;
        self.deleteUser = deleteUser;
        self.readUser = readUser;

        function updateUser(id, idUser, data) {
            return new Promise((resolve, reject) => {
                if (id != idUser) reject(errors.accessDenied)
                else {
                    bcrypt.hash(data.password, 5, function (err, hash) {
                        if (err) {
                            throw err;
                        }
                        userRepository.update({name: data.name, password: hash}, {where: {id: id}})
                            .then(resolve()).catch(reject);
                    })
                }
            })
        }

        function readAllUser() {
            return new Promise((resolve, reject) => {
                userRepository.findAll({attributes: ['id', 'name']})
                    .then(users => {
                        let arr=[];
                        users.forEach(function(item, i, array) {
                            arr.push(item.dataValues);
                        });
                        resolve(arr)
                    })
                    .catch(reject);
            });
        }

        function deleteUser(id, idUser) {
            return new Promise((resolve, reject) => {
                if (id != idUser) throw (errors.accessDenied)
                else {
                    console.log("del");
                    userRepository.destroy({where: {id: id}}, {force: true})
                        .then(data => {
                            resolve("deleted");
                        })
                        .catch(reject);
                }
            })
        }

        function readUser(id, idUser) {
            return new Promise((resolve, reject) => {
                var param;//own money
                console.log(id, idUser);
                if (id == idUser) param = ['id', 'name', 'money'];
                else param = ['id', 'name'];
                userRepository.findById(idUser, {attributes: param})
                    .then(user => resolve(user))
                    .catch(reject);
            })
        }
    }

    return new UserService(userRepository, errors);
};