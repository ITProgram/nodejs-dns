const express = require('express');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const config = require('./config');

const dbcontext = require('./context/db')(Sequelize, config);

//utils
const errors = require('./utils/errors');

//services pass to api controller
    const userService = require('./services/user')(dbcontext.user,  errors);
    const authService = require('./services/auth')(dbcontext.user, dbcontext.domain, errors);
    const domainService = require('./services/domain')(dbcontext.domain,dbcontext.user, errors);
const apiController = require('./controllers/api')(userService, authService,domainService,  config,errors);

//utils
const auth = require('./utils/auth')(authService, config, errors);
const logger = require('./utils/logger');

const app = express();

app.use(express.static('public'));
app.use(cookieParser(config.cookie.key));
app.use(bodyParser.json());
app.use(bodyParser.xml());
const port = process.env.PORT || 3000;
//xml parser
/*
app.use(bodyParser.xml({
    limit: '1MB',   // Reject payload bigger than 1 MB
    xmlParseOptions: {
        normalize: true,     // Trim whitespace inside text nodes
        normalizeTags: true, // Transform tags to lowercase
        explicitArray: false // Only put nodes in array if >1
    }
}));
*/
app.use('/api', apiController);

app.use('/api', auth);
app.use('/api', logger);

dbcontext.sequelize
    .sync()
    .then(() => {
        app.listen(port, () => console.log('Running'));
    })
    .catch((err) => console.log(err));


/*
 Представьте, что вы DNS-регистратор. От вас требуется написать REST API осуществляющее:
 - регистрацию, аутентификацию и авторизацию пользователей с использованием JWT
 - поиск доступности доменного имени
 - оплата доменного имени
 - привязка доменного имени к пользователю

 Хорошо продумайте структуру своего REST API!

 API для проверки доступности DNS имени (если ключ устарел – спросить преподавателя):
 https://api.domainr.com/v2/status?domain=nodejs.ninja&cli-ent_id=fb7aca826b084569a50cfb3157e924ae
 В запросе необходимо указать заголовок:
 Origin': 'https://www.namecheap.com'

 Время на выполнение: 6 часов / 3 занятия
 */