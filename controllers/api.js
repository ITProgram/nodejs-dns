const express = require('express');

module.exports = (userService, authService, domainService, config) => {
    const router = express.Router();
    const userController = require('./user')(userService, promiseHandler);
    const authController = require('./auth')(authService, config);
    const domainController = require('./domain')(domainService, promiseHandler);

    router.use('/user', userController);
    router.use('/auth', authController);
    router.use('/domain', domainController);

    return router;
};

function promiseHandler(res, promise) {
    promise
        .then((data) => res.send(data))
        .catch((err) => res.error(err));
}