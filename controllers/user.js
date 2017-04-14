const express = require('express');
let jwt = require('jsonwebtoken');


const EasyXml = require('easyxml');

const serializer = new EasyXml({
    singularizeChildren: true,
    underscoreAttributes: true,
    rootElement: 'response',
    dateFormat: 'SQL',
    indent: 2,
    manifest: true
});

module.exports = (userService, promiseHandler) => {
    const router = express.Router();

    router.get('/:id', (req, res) => {
        promiseHandler(res, getId(req.cookies["x-access-token"])
            .then((id) => userService.readUser(id, req.params.id))
        );
    });
    router.put('/:id', (req, res) => {
        promiseHandler(res, getId(req.cookies["x-access-token"])
            .then(id => userService.updateUser(id, req.params.id, req.body)), req.headers['content-type']);
    });
    router.get('/', (req, res) => {
        promiseHandler(res, userService.readAllUser()
            .then(data => {
                let contentType = req.headers['content-type'];
                if (contentType == 'application/json') {
                    res.header('Content-Type', 'application/json');
                    res.send(data);
                }
                else if (contentType == 'application/xml') {
                    res.header('Content-Type', 'application/xml');
                    let xml = serializer.render(data.users);
                    res.send(xml);
                } else {
                    res.send(data);
                }
            }))
    });
    router.delete('/:id', (req, res) => {
        promiseHandler(res, getId(req.cookies["x-access-token"])
            .then(id => userService.deleteUser(id, req.params.id)), req.headers['content-type']);
    });

    function getId(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'DNS', function (err, decoded) {
                if (err != null) reject('jhj');
                //var userId = decoded.__user_id;
                resolve(decoded.__user_id);
            });
        });
    }

    return router;
}