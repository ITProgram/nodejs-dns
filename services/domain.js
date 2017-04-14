/**
 * Created by MR on 12.04.2017.
 */
const jwt = require('jsonwebtoken');
const EasyXml = require('easyxml');

const serializer = new EasyXml({
    singularizeChildren: true,
    underscoreAttributes: true,
    rootElement: 'response',
    dateFormat: 'SQL',
    indent: 2,
    manifest: true
});


var cost=30;

module.exports = (domainRepository, userRepository, errors) => {
    const needle = require("needle");
    var Promise = require("bluebird");
    Promise.promisifyAll(needle);

    function DomainService(domainRepository, errors) {
        let self = this;
        self.register = register;
        self.check = check;
        self.pay=pay;

        function register(domainName, id) {
            return new Promise((resolve, reject) => {
                let domain = {
                    domain: domainName,
                    status: false,
                    userId: id
                };
                domainRepository.create(domain)
                    .then((domain) => {

                       return resolve(domain);
                    }).catch((err) => reject(err));
            });
        }


        function check(domain) {
            return new Promise((resolve, reject) => {
                if (!(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/.test(domain)))
                    return reject("Invalid domain address");

                needle.get('https://api.domainr.com/v2/status?domain=' + domain + '&client_id=fb7aca826b084569a50cfb3157e924ae',
                    {
                        headers: {
                            'Origin': 'https://www.namecheap.com/',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                    }, function (err, response, body) {
                        if ((body.status[0].summary === "inactive") ||
                            (body.status[0].summary === "undelegated")) {
                            domainRepository.findAll(
                                {
                                    where: {domain: domain}
                                })
                                .then((domain) => {
                                    if (domain.length != 0) {
                                        resolve({status: "domain already use"})

                                    }
                                    else {
                                        resolve({status: "domain can be get"})
                                    }
                                })
                                .catch(reject);
                        }
                        else if (body.status[0].summary === "active") {
                            resolve({status: "domain already use"})
                        }

                    })
            })
        }

        function pay(id, idUser) {
            return new Promise((resolve, reject) => {
                domainRepository.findById(id, {attributes: ["userId", "status"]})
                    .then(dmn => {
                        console.log("1then:");
                        console.log(dmn);
                        if (dmn == null || dmn.userId != idUser) throw ("User error or id domain");
                        else if (dmn.status == true) throw("Already pay");
                        else {
                            console.log("fbi");
                            return userRepository.findById(idUser, {attributes: ["id", "money"]})
                        }
                    })
                    .then(user => {
                        console.log("2then");
                        //console.log(user);
                        if (user.money < cost) throw("not enough money");
                        else {
                            Promise.all([
                                user.decrement({money: cost}),
                                domainRepository.update({status: true}, {where: {id: id}})
                            ]).spread((user, domain) => {
                               return resolve({success: "true"});
                            })
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err)
                    });
            })
        }
    }

    return new DomainService(domainRepository, errors);
};