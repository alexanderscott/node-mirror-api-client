# mirror-api-client
Google Mirror API client for managing Glass timeline items, contacts, and subscriptions.

[![NPM](https://nodei.co/npm/mirror-api-client.png?downloads=true)](https://nodei.co/npm/mirror-api-client/)


## Installation
Install via npm:

    npm install mirror-api-client

Or clone the repo and link: 

    git clone https://github.com/alexanderscott/mirror-api-client  
    cd mirror-api-client
    npm link

## Usage
    
    // Client credentials from the Google API Projects site
    // https://code.google.com/apis/console/?pli=1
    var mirrorClient = require('mirror-client')({ 
        clientId: '',
        clientSecret: '',
        redirectUri: '',
        scope: ''
    });

    // Auth code stored in back-end or retrieved from auth redirect
    var code = '';      

    // Authorize the client and list timeline items to console
    mirrorClient.authorize(code, function(err){
        mirrorClient.listTimelineItems(50, function(err, list){
            for(var i = 0; i < list.items.length; i++) { 
                console.log("Timeline item: ", list.items[i].text);
            }
        });
    });


        
## API Methods


#### getAuthUrl()
 * Returns a URL for the user to log in via browser.
 * If log-in successful, will return a code in query param of redirectURL for client authorization

#### authorize( [optional code], callback(error, response) ) 
 * Authorizes the Mirror Client, creating auth_token from the code stored or retrieved above

#### download( 'url', callback(error, data) )
 * Downloads data from the specified URL, using an authorized connection.


### Timeline Items

##### listTimelineItems( 'maxResults', callback(error, [items]) )
##### getTimelineItem( 'itemId', callback(error, {item}) )
##### insertTimelineItem( {item}, callback(error, {item}) )
##### patchTimelineItem( {item}, callback(error, {item}) )
##### updateTimelineItem( {item}, callback(error, {item}) )
##### deleteTimelineItem( 'id' or {}, callback(error) )


### Contacts

##### listContacts( callback(error, [contacts]) ) 
##### getContact( 'contactId', callback(error, {contact}) )
##### insertContact( {contact}, callback(error, {contact}) )
##### patchContact( {contact}, callback(error, {contact}) )
##### updateContact( {contact}, callback(error, {contact}) )
##### deleteContact( 'id' or {contact}, callback(error) )


### Subscriptions
    
##### listSubscriptions( callback(error, [subscriptions] )
##### getSubscription( 'subscriptionId', callback(error, {subscription}) )
##### updateSubscription( {subscription}, callback(error, {subscription}) )
##### deleteSubscription( 'subscriptionId' or {subscription}, callback(error, {subscription}) )


### Locations

##### listLocations( callback(error, [locations]) )
##### getLocation( 'locationId', callback(error, {location}) )

### Settings

##### getSettings( 'settingsId', callback(error, {settings} )



## Running Tests

To run the test suite, first invoke the following command within the repo, installing the development dependencies:

    $ NODE_ENV=development npm install

Then run the tests with:

    $ npm test

The easiest way to pass app credentials into the tests is to create a config.json file in the project root and gitignore it.  It must contain clientId, clientSecret, and redirectUris[].

If this file is missing, readline is used for credentials.  You will be given a URL to copy/paste into your browser, then must copy/paste back into node the code query parameter after authenticating.


## TODO
* Wrap objects in models for initial validation 
* Streaming EventEmitter for subscriptions

## License

MIT License

Copyright (c) 2014 Alex Ehrnschwender (http://alexehrnschwender.com/)
 
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
 
