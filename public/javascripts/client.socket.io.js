/**
 * Created by parth on 1/11/15.
 */
var server_name = 'http://127.0.0.1:3000/';
var server = io.connect(server_name);
console.log('Client: Connecting to server '+ server_name);
var love = 0;
var hate = 0;
$('lcount').innerHTML = '<p>' + love + '</p>';
$('hcount').innerHTML = '<p>' + hate + '</p>';
server.on('s:tweet', function(data) {
   if(data.text.toLowerCase().indexOf('love') >= 0) {
       love++;
       if ($('#inbody div').size() > 10) {
           $('#inbody div:last').remove();
       }

       $('#lbody').prepend('<div><h5>' + data.text + '</h5></div>');
       $('#lcount').innerHTML = '' + love;
   }

    if(data.text.toLowerCase().indexOf('hate') >= 0) {
       hate++;
       if ($('#outbody div').size() > 10) {
           $('#outbody div:last').remove();
       }

       $('#hbody').prepend('<div><h5>' + data.text + '</h5></div>');
       $('hcount').innerHTML = hate;
   }
});