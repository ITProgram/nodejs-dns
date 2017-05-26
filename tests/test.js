/**
 * Created by MR on 25.05.2017.
 */


const Sequelize = require('sequelize');
const config = require('../config');
const errors = require('../utils/errors');

const dbcontext = require('../context/db')(Sequelize, config);

const user = require('../services/user')(dbcontext.user, dbcontext.game, dbcontext.sequelize, config, errors);
const game = require('../services/game')(dbcontext.game, dbcontext.user, config, errors);
const auth = require('../services/auth')(dbcontext.user, dbcontext.game, config, errors);

test('register user', () => {
    expect.assertions(1);
    return auth.signup({
        login: 'testlogin1',
        email: 'emailaaaa@aa.aa',
        password: "pass"
    })
        .then(id => {
            expect(id).toBeGreaterThan(0);
        });


});

test('login user', () => {
    expect.assertions(3);
    return auth.login({
        login: 'testlogin1',
        password: "pass"
    })
        .then(id => {
            expect(id).not.toBeNull();
            expect(id).toBeDefined();
            expect(id).toBeGreaterThan(0);
        });
});


test('user getById', () => {
    return user.getUser(3)
        .then(user => {
            expect(user.dataValues).not.toBeNull();
            expect(user.dataValues).toBeDefined();
            expect(Object.keys(user.dataValues).length).toEqual(4);
        });
});

test('user getAllUsers', () => {
    return user.getAllUsers({})
        .then(user => {
            let users = JSON.stringify(user);
            //console.log(JSON.stringify(user));
            expect(user).not.toBeNull();
            expect(user).toBeDefined();
        });
});

test('user update', () => {
    return user.update(3, {
        login: 'newLogin',
        password: 'pass',
        email: 'emailemail@emailemail.mmmmm'
    })
        .then(result => {
            expect(result).not.toBeNull();
            expect(result).toBeTruthy();
            expect(result).toBeDefined();
        });
});


test('user updateRating', () => {
    return user.updateRating(1, 2, 1000, 2000, 1)
        .then(result => {
            expect(result).not.toBeNull();
            expect(result).toBeTruthy();
            expect(result).toBeDefined();
        });
});

test('user getUserGame', () => {
    return user.getUserGame(2, 1)
        .then(game => {
            expect(game).not.toBeNull();
            expect(game).toBeDefined();
            expect(Object.keys(game).length).toEqual(7);
        });
});

test('user getUserGames', () => {
    return user.getUserGames(1)
        .then(game => {
            let games = JSON.stringify(game);
            console.log(JSON.stringify(game));
            expect(games).not.toBeNull();
            expect(games).toBeDefined();
        });
});


test('game create', () => {
    return game.create({
        date: new Date(),
        whiteId: 1,
        blackId: 2,
        status: 'w',
        timeForGame: 10,
        steps: "aaabbbccc"
    })
        .then(result => {
            console.log(JSON.stringify(result));
            expect(result).not.toBeNull();
            // expect(id).toBeTruthy();
            expect(result).toBeDefined();
            expect(Object.keys(result.dataValues).length).toEqual(7);
        });
});

test('game getById', () => {
    return game.get(1)
        .then(result => {
            console.log(JSON.stringify(result));
            expect(result).not.toBeNull();
            expect(result).toBeDefined();
            expect(Object.keys(result.dataValues).length).toEqual(7);
        });
});


test('games getAll', () => {
    return game.getAll()
        .then(game => {
            let games = JSON.stringify(game);
            //console.log(JSON.stringify(user));
            expect(game).not.toBeNull();
            expect(game).toBeDefined();
        });
});