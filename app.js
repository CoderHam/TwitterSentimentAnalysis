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
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Variables for calculating the statistics for number of tweets and percentages
var love_count = 0;
var hate_count = 0;
var lpercent = 0;
var hpercent = 0;
var total = 0;

//Query to fetch the twitter stream with filter Love and Hate.
var stream = T.stream('statuses/filter', { track: ['love', 'hate'] });

//Listening to 'tweet' event which sends callback whenever someone sends a tweet with the specified filter.
stream.on('tweet', function(tweet){
    //Calculating the statistics.
    total++;
    if(tweet['text'].toLowerCase().indexOf('love') >= 0) {
        love_count++;
    }
    if(tweet['text'].toLowerCase().indexOf('hate') > -1) {
        hate_count++;
    }
    lpercent = (love_count / total * 100);
    lpercent = Math.round(lpercent * 100)/100;
    hpercent = (hate_count / total * 100);
    hpercent = Math.round(hpercent * 100)/100;

    // Broadcasting messages to all the connected clients.
    // The message contains all the statistic information, actual tweet message, the name of the person who tweeted, and the image URl of the person.
    sio.sockets.emit('s:tweet', {
        l_count: love_count,
        h_count: hate_count,
        l_percent: lpercent,
        h_percent: hpercent,
        total: total,
        text: tweet.text,
        name: tweet.user.screen_name,
        url: tweet.user.profile_image_url
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
