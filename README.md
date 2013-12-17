# mirror-client

Google Mirror API client for managing Glass timeline items, contacts, and subscriptions.",

[![Build Status](https://secure.travis-ci.org/alexanderscott/node-mirror-api-client.png)](http://travis-ci.org/alexanderscott/node-mirror-api-client)

## Installation
Install via npm:

    npm install mirror-api-client

Or clone the repo and link: 

    git clone https://github.com/alexanderscott/mirror-api-client  
    cd mirror-api-client
    npm link

## Usage
    
    var MirrorClient = require('mirror-client');

    var mirrorClient = new MirrorClient({
        clientId: config.googleApis.clientId,
        clientSecret: config.googleApis.clientSecret,
        redirectUri: config.googleApis.redirectUris[0],
        scope: config.googleApis.scope
    });

    mirrorClient.authorize().getTimeline(  function(err, timeline){
        for(var i = 0; i < timeline.items.length; i++) { 
            console.log(timeline.items[i].text);
        }
    });


        
## API Methods


#### authorize( [optional code], callback(error, response) ) 


### Timeline Items

#### getTimeline( {options}, callback(error, [items]) )
#### getTimelineItem( 'itemId', callback(error, {item}) )
#### insertTimelineItem( {}, callback(error, {item}) )
#### patchTimelineItem( {}, callback(error, {item}) )
#### updateTimelineItem( {}, callback(error, {item}) )
#### deleteTimelineItem( 'id' or {}, callback(error) )


### Contacts

#### getContacts( [max number of contacts], callback(error, [contacts]) ) 
#### getContact( 'contactId', callback(error, {contact}) )
#### insertContact( {contact}, callback(error, {contact}) )
#### patchContact( {contact}, callback(error, {contact}) )
#### updateContact( {contact}, callback(error, {contact}) )
#### deleteContact( 'id' or {contact}, callback(error) )


### Subscriptions
    
#### getSubscriptions( [max number of items], callback(error, [subscriptions] )
#### getSubscription( 'subscriptionId', callback(error, {subscription}) )
#### updateSubscription( {subscription}, callback(error, {subscription}) )
#### deleteSubscription( 'subscriptionId' or {subscription}, callback(error, {subscription}) )




## Streaming

    var MirrorStreamClient = require('mirror-client').MirrorStreamClient;

    var subscriptionStream = new mirrorClient.Stream();


### Events

#### 'error'

    on('error', console.log)

#### 'data'

    on('data', console.log)

#### 'close'
    
    on('close', console.log)




## Running Tests

To run the test suite, first invoke the following command within the repo, installing the development dependencies:

    $ npm install

Then run the tests:

    $ make test




## License

MIT License

Copyright (c) 2013 Alex Ehrnschwender (http://alexehrnschwender.com/)
 
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
 
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
