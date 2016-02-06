/**
 * Created by Hemant on 4/2/16.
 */
    // Connecting with server on port 3000.
var server_name = 'http://localhost:3000/';
var server = io.connect(server_name);
console.log('Client: Connecting to server '+ server_name);

// Listening to event 's:tweet' from the server.
server.on('s:tweet', function(data) {
   //Updates the total number of tweets received.
   $('#total').html('<h1>'+ data.total +'</h1>');

   $('#word_a').html(data.name_a);
   $('#word_b').html(data.name_b);

   $('#start_a').html('<h4>No of Tweets with \''+data.name_a+'\'</h4>');
   $('#start_b').html('<h4>No of Tweets with \''+data.name_b+'\'</h4>');

   $('#desc_a').html('<h4>Percentage of Tweets with \''+data.name_a+'\'</h4>');
   $('#desc_b').html('<h4>Percentage of Tweets with \''+data.name_b+'\'</h4>');

   // Updates the Left column with statistics and tweets with love.
   if(data['text'].toLowerCase().indexOf('smart') >= 0) {

       // Keeps the latest 10 tweets from server. This will stop the DOM model from blotting.
       if ($('#lbody div').size() > 10) {
           $('#lbody div:last').remove();
       }
       // Updates tweets for love
       $('#lbody').prepend('<div><h5>'+'<img src="'+ data.url +'">'+'<b>'+ data.name + '</b>' + data['text'] + '</h5></div>');
       // Updates the number of love tweets
       $('#lcount').html('<h4>'+data.l_count+'</h4>');

       // Updates the percentage of love tweets
       $('#lpercent').html('<h4>'+data.l_percent+'</h4>');
   }

    // Updates the left column with statistics and tweets with hate.
    if(data['text'].toLowerCase().indexOf('fool') >= 0) {

       // Keeps the latest 10 tweets from server. This will stop the DOM model from blotting.
       if ($('#hbody div').size() > 10) {
           $('#hbody div:last').remove();
       }
       // Updates tweets for hate
       $('#hbody').prepend('<div><h5>'+'<img src="'+ data.url +'">'+'<b>'+ data.name + '</b>' + data['text'] + '</h5></div>');
       // Updates number of tweets for hate.
        $('#hcount').html('<h4>'+data.h_count+'</h4>');
        // Updates percentage of hate tweets
        $('#hpercent').html('<h4>' + data.h_percent+'</h4>');
   }
});
