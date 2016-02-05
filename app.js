var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// Creating server socket and listening for client on port 3000.
// Mainly uses 'http' and 'socket.io'
var server = require('http').createServer(app);
var port = 3000;
server.listen(port);
console.log("Server Socket started and listening on port : " + port);

var sio = require('socket.io').listen(server);

// Using 'Twit' node.js library to fetch twitter stream of tweets currently getting tweeted.
var Twit = require('twit');

// Passing the Twitter Credentials stored as environment variables.
var T = new Twit({
    consumer_key: 'X5YzGrm339RubsbBOI12uG0A0',
    consumer_secret: 'FDUrQvbrwgiuAs9jLnj1ftKt57nHhwtFtVOTINbhrWJ4T77cJs',
    access_token: '73602145-QM07HyWN7uVeKOHhErbSMfATY2dSdTbt3jPb4nJUt',
    access_token_secret: 'p02lmeHPhwOusyF9BOPGOCiG8lQUFzpMIUGU9A7NZv2D8'
});

// Variables for calculating the statistics for number of tweets and percentages
var a_count = 0;
var b_count = 0;
var apercent = 0;
var bpercent = 0;
var total = 0;

//Query to fetch the twitter stream with filter A and B.
var stream = T.stream('statuses/filter', { track: ['smart', 'fool'] });

//Listening to 'tweet' event which sends callback whenever someone sends a tweet with the specified filter.
stream.on('tweet', function(tweet){
    //Calculating the statistics.
    total++;
    if(tweet['text'].toLowerCase().indexOf('smart') >= 0) {
        a_count++;
    }
    else if(tweet['text'].toLowerCase().indexOf('fool') >= 0) {
        b_count++;
    }
    apercent = (a_count / total * 100);
    apercent = Math.round(apercent * 100)/100;
    bpercent = (b_count / total * 100);
    bpercent = Math.round(bpercent * 100)/100;

    // Broadcasting messages to all the connected clients.
    // The message contains all the statistic information, actual tweet message, the name of the person who tweeted, and the image URl of the person.
    sio.sockets.emit('s:tweet', {
        l_count: a_count,
        h_count: b_count,
        l_percent: apercent,
        h_percent: bpercent,
        total: total,
        text: tweet.text,
        name: tweet.user.screen_name,
        url: tweet.user.profile_image_url,
        name_a: 'Smart',
        name_b: 'Fool'
    });

});

// Just prints a message if client is connected or disconnected. Not really required as a functionality.
sio.sockets.on('connection', function(socket) {
    console.log('Web client connected');

    socket.on('disconnect', function() {
        console.log('Web Client Disconnected');
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
