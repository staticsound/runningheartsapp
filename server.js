{

  // server.js
  const env = require('./config/environment');
  env.setEnvironment(process.env);

  require('enum').register();

  // register the logger ASAP
  const logger = require('./config/logging');

  // set up ======================================================================
  // get all the tools we need
  var express = require('express');
  var path = require('path');
  var app = express();
  var port = env.getPort();
  var mongoose = require('mongoose');
  var morgan = require('morgan');
  var bodyParser = require('body-parser');
  var moment = require('moment-timezone');

  var session = require('express-session');
  var passport = require('passport');
  var flash = require('connect-flash');
  var cookieParser = require('cookie-parser');

  var api = require('./app/api/main');
  var configuration = require('./config/configuration.js');
  var automation = require('./app/automation/main');

  automation(configuration.automation);

  moment.tz.setDefault('America/New_York');

  // configuration ===============================================================

  require('./config/passport')(passport);
  var db = configuration[env.getName() === 'dev' ? 'localdb' : 'remotedb'];

  // connect to our configuration
  mongoose.connect(`mongodb://${db.user}:${db.key}@${db.host}:${db.port}/${db.name}`);

  // log every request to the console
  app.use(morgan('[:date[clf]] :method :url :status :response-time ms - :res[content-length]'));


  // get information from html forms
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.set('view engine', 'ejs'); // set up ejs for templating
  app.use(express.static(path.join(__dirname, 'public')));

  //authentication
  app.use(cookieParser(configuration.secret)); // read cookies (needed for auth)
  app.use(flash());
  app.use(session({
    cookie: {
      httpOnly: true,
      maxAge: 86400000
    },
    secret: configuration.secret,
    store: new(require('express-sessions'))({
      storage: 'mongodb',
      instance: mongoose, // optional
      host: db.host, // optional
      port: db.port, // optional
      db: db.name, // optional
      collection: 'sessions', // optional
      expire: 86400 // optional
    })
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/api', api);

  // routes ======================================================================
  require('./app/routes.js')(app);

  // launch ======================================================================
  app.listen(port);
  logger.info('Running Hearts App Listening On... ' + port);

}
