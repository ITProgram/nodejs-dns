const express = require('express');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const config = require('../config');

const dbcontext = require('../context/db')(Sequelize, config);

//utils
const errors = require('../utils/errors');

//services pass to api controller
const userService = require('../services/user')(dbcontext.user,  errors);
const authService = require('../services/auth')(dbcontext.user, dbcontext.domain, errors);
const domainService = require('../services/domain')(dbcontext.domain,dbcontext.user, errors);

const auth = require('../utils/auth')(authService, config, errors);

test(' user readAll', () => {
    console.log(process.env.NODE_ENV);
    return userService.readAllUser()
        .then(users => {
            console.log(users);
            expect(users.length).toBeDefined();
            expect(users.length).toBeGreaterThan(0);

        })
});
