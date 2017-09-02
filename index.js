const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const oauth = require('./routes_oauth.js');

const app = express();
const environment = app.get('env') || 'production';
const development = environment === 'development';
const test = environment === 'test';

app.set('port', process.env.PORT || 3000);
app.set('tlsPort', process.env.TLS_PORT || 3443);
app.disable('x-powered-by');
app.enable('trust proxy');
app.use(compression());
if (!test) {
    app.use(morgan('combined'));
}

app.use('/oauth', oauth);
app.use(express.static(path.join(__dirname, 'build')));
app.use((req, res) => res.sendFile(__dirname + '/build/index.html'));

// error handlers
app.use((err, req, res, next) => {
    var status = err.status || 500;
    res.status(status).json({
        stack: development ? err.stack : undefined,
        error: err.message,
    });
});

app.listen(app.get('port'), () => {
    console.info('pina started on port ' + app.get('port'));
});
