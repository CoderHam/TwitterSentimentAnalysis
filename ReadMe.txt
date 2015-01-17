This is a simple Twitter Sentiment Analyzer. 
The dashboard will show the comparisons between tweets with keyword 'Love' and 'Hate'.

Execution
1) Install Node.js on the system.
2) Unzip the TwitterSentimentAnalysis package.
3) Set the following environment variables. These mainly include twitter credentials
      a) TWITTER_CONSUMER_KEY
      b) TWITTER_CONSUMER_SECRET
      c) TWITTER_ACCESS_TOKEN
      d) TWITTER_ACCESS_TOKEN_SECRET  
4) Start the server with command "node app.js"
5) The server should start running and print the port on the console.
6) Open a brower (except IE) preferably firefox.
7) Connect to URL : http://localhost:3000/
8) You will see a twitter dashboard.

Output:
1) The dashboard contains the total number of tweets captured by server after the server started on the top right corner.
2) There are 2 columns
     a) Column on the left contains the statistics of tweets with 'Love'
     b) Column on the right contains the statistics of tweets with 'Hate'
3) the lower columns show actual tweets. Every Tweet has following 3 parts
     a) The image
     b) The User's screen name in bold. 
     c) The tweet text.

Note:
1) Total number is not the some of 'Love' + 'Hate' tweets, but rather the number of tweets received from twitter, since some tweets can have both love and hate in them.
2) Some of the images don't load since the rate at which tweets come is way too faster than the time required to fetch the resource.
3) Ony the latest 10 tweets with word 'love' and 10 tweets with 'hate' are shown and older ones are flushed out. 
   