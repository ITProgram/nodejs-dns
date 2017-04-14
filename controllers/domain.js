const express = require('express');
var jwt = require('jsonwebtoken');
var xml2js = require('xml2js').parseString;

const EasyXml = require('easyxml');

const serializer = new EasyXml({
    singularizeChildren: true,
    underscoreAttributes: true,
    rootElement: 'response',
    dateFormat: 'SQL',
    indent: 2,
    manifest: true
});


module.exports = (domainService, promiseHandler) => {
    const router = express.Router();

    router.get('/check', (req, res) => {
        promiseHandler(res,domainService.check(req.query.domain));
    });
    router.post('/', (req, res) => {
        promiseHandler(res, domainService.check(req.body.domain)
            .then(data => {
                console.log(data);
                if (data.status == "domain can be get") {
                    return getId(req.cookies["x-access-token"]);
                }
                else throw("error. Domain already usemmm");
            })
            .then(id => {
                return domainService.register(req.body.domain, id)
            })
            .then(data => {
                let contentType = req.headers['content-type'];
                if (contentType == 'application/json') {
                    res.header('Content-Type', 'application/json');
                    res.send(data);
                } else if (contentType == 'application/xml') {
                    res.header('Content-Type', 'text/xml');
                    let xml = serializer.render(data.dataValues);
                    res.send(xml);
                } else {
                    res.send(data);
                }


            }))//;req.headers['content-type']);
    });
    router.post('/pay', (req, res) => {
        promiseHandler(res, getId(req.cookies["x-access-token"])
            .then(id => {
                return domainService.pay(req.body.id, id)
            })
            .then(data => {
                let contentType = req.headers['content-type'];
                if (contentType == 'application/json') {
                    res.header('Content-Type', 'application/json');
                    res.send(data);
                } else if (contentType == 'application/xml') {
                    res.header('Content-Type', 'text/xml');
                    let xml = serializer.render(data);
                    res.send(xml);
                } else {
                    res.send(data);
                }


            },reject=>{
                "use strict";
                let contentType = req.headers['content-type'];
                if (contentType == 'application/json') {
                    res.header('Content-Type', 'application/json');
                    res.send(reject);
                } else if (contentType == 'application/xml') {
                    res.header('Content-Type', 'text/xml');
                    let xml = serializer.render(reject);
                    res.send(xml);
                } else {
                    res.send(reject);
                }

            }))




    });

    function getId(token) {
        return new Promise((resolve, reject) => {
            var decoded = jwt.verify(token, 'DNS');
            resolve(decoded.__user_id);
        });
    }

    return router;
}