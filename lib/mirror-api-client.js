"use strict";

var util = require('util'),
    events = require('events'),
    //connect = require('connect'),
    googleApis = require('googleapis'),
    OAuth2Client = googleApis.OAuth2Client;

function MirrorClient(opts) {
    opts = opts || {};
    this.gClient = opts.gClient || {};
    this.oauth2Client = opts.oauth2Client || new OAuth2Client( opts.clientId, opts.clientSecret, opts.redirectUri );
    this.scope = (opts.scope || 
                    ['https://www.googleapis.com/auth/glass.timeline',
                     'https://www.googleapis.com/auth/glass.location',
                     'https://www.googleapis.com/auth/userinfo.profile' ]).join(' ');
    //this.authorize(opts);
    return this;
}

util.inherits(MirrorClient, events.EventEmitter);

MirrorClient.prototype.authorize = function(code, cb){
    var self = this;
    this.oauth2Client.getTokens(code, function(err, credentials){
        if(err) return cb(err);
        self.oauth2Client.credentials = credentials;
        googleApis
            .discover('oauth2', 'v2')
            .discover('mirror', 'v1')
            .withAuthClient(self.oauth2Client)
            .execute(function(err, client){
                if(err) return cb(err);
                console.log("authorize returned::", client);
                self.mirror = client.mirror;
                cb(null, client);
            });
    });
};

MirrorClient.prototype.getUserInfo = function(cb){
    googleApis
        .oauth2
        .userinfo
        .get()
        .withAuthClient( this.oauthClient )
        .execute(function(err, info){
            if(err) return cb(err);
            console.log("getUserInfo returned:", info);
            cb(null, info);
        });
};

MirrorClient.prototype.connect = function(cb){
    googleApis
        .discover('oauth2', 'v2')
        .discover('mirror', 'v1')
        .withAuthClient(this.oauth2Client)
        .execute((function(err, client){
            if(err){
                this.emit('error', err);
                return;
            }
            this.mirror = client.mirror;
        }).bind(this));
};

//MirrorClient.prototype.getTokens = function(code, cb){
    //this.oauth2Client.getTokens(code, (function(err, tokens){
        //if(err){
            //this.emit('error', err);
            //return;
        //}
        //this.setCredentials(tokens);
    //}).bind(this));
//};

/**
 * Fetch tokens from the oauthClient using specified code.
 * @param {String} code - access code obtained from query param
 * @param {function) cb - callback(error, response)
**/
MirrorClient.prototype.getTokens = function(code, cb){
    this.oauth2Client.getToken(code, function(err, tokens){
        if(err) return cb(err);
        //self.credentials = tokens;
        cb(null, tokens);
    });
};

//MirrorClient.prototype.getUserId = function(cb){
    //var self = this;
    //googleApis
        //.discover('oauth2', 'v2')
        //.execute(function(err, gClient){
            //if(err) return cb(err);

        //});
//};

/**
 * Creates a Google Mirror API client and attaches to this parent object.  
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.createClient = function(cb){
    var self = this;
    googleApis
        .discover('mirror', 'v1')
        .execute(function(err, gClient) {
            if(err) return cb(err);
            //console.log("Initialized googleApis mirror client...");

            //app.locals.gClient = gClient;
            self.mirror = gClient.mirror;

            cb(null, gClient);
        });
};

/**
 * Downloads data from the specified URL, using an authorized connection.
 * @param {String} url
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.getAuthUrl = function(){
    console.log('scope:' + this.scope);
    return this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this.scope
    });
};

/**
 * Downloads data from the specified URL, using an authorized connection.
 * @param {String} url
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.download = function(url, cb){
    this.mirror
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};


/**
 * Retrieves (at most) the most recent "max_results" timeline cards that were
 * inserted by this Glassware. Paging is not supported by this call.
 * @param {Integer} num - max number of items to retrieve
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.listTimelineItems = function(num, cb){
    this.mirror
        .timeline
        .list({ maxResults: num })
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Retrieves the TimelineItem with the specified identifier.
 * @param {String} itemId - timeline item identifier
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.getTimelineItem = function(itemId, cb){
    this.mirror
        .timeline
        .get({ id: itemId })
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Gets the attachment associated with a timeline item.
 * @param {String} itemId - timeline item identifier
 * @param {String} attachmentId - attachment item identifier
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.getTimelineItemAttachment = function(itemId, attachmentId, cb){
    this.mirror
        .timeline
        .get({ id: itemId, attachmentId: attachmentId })
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Inserts a timeline item, with an optional attachment, into the user's timeline.
 * @param {Object} item - item to insert (with optional attachment attribute)  
 * @param {function} cb - callback(error, response)
 **/
MirrorClient.prototype.insertTimelineItem = function(item, cb){
    this.mirror
        .timeline
        .insert(item)
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Patches a timeline item in place.
 * @param {Object} item - item with attributes to patch
 * @param {function} cb - callback(error, response)
 **/
MirrorClient.prototype.patchTimelineItem = function(item, cb){
    this.mirror
        .timeline
        .patch(item)
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Updates a timeline item in place.
 * @param {Object} item - item with all attributes for update
 * @param {function} cb - callback(error, response)
 **/
MirrorClient.prototype.updateTimelineItem = function(item, cb){
    this.mirror
        .timeline
        .update(item)
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Deletes the timeline item with the specified identifier.
 * @param {String} itemId - timeline item identifier
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.deleteTimelineItem = function(itemId, cb){
    this.mirror
        .timeline
        .delete({ id: itemId })
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};



/**
 * Lists the contacts on this Glass.
 * @param {Object} opts - optional params (item, attachment)  
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.listContacts = function(opts, cb){
    this.mirror
        .contacts
        .list( opts )
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Inserts a contact on this Glass.
 * @param {Object} opts - contact object - (id, displayName, imageUrls)  
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.insertContact = function(opts, cb){
    this.mirror
        .contacts
        .insert( opts )
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Updates a contact on this Glass.
 * @param {Object} contact - contact object containing all fields for update
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.updateContact = function(contact, cb){
    this.mirror
        .contacts
        .update( contact )
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Patches a contact on this Glass.
 * @param {Object} contact - contact object containing fields to patch
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.patchContact = function(contact, cb){
    this.mirror
        .contacts
        .patch( contact )
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Deletes a contact from this Glass.
 * @param {Object} contactId - contact identifier
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.deleteContact = function(contactId, cb){
    this.mirror
        .contacts
        .delete({ id: contactId })
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};



/**
 * Lists the subscriptions on this Glass.
 * @param {Object} opts - optional params (item, attachment)  
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.listSubscriptions = function(opts, cb){
    this.mirror
        .subscriptions
        .list( opts )
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Inserts a subscription on this Glass.
 * @param {String} userToken
 * @param {String} collection - the collection ('timeline' or 'location') to subscribe to
 * @param {String} callbackUrl - the URL which will receive a POST request when a notification occurs
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.insertSubscription = function(userToken, collection, callbackUrl, cb){
    this.mirror
        .subscriptions
        .insert({ userToken: userToken, collection: collection, callbackUrl: callbackUrl })
        .withAuthClient( this.oauth2Client )
        .execute( cb );

    cb(null);
};

/**
 * Updates a subscription this Glass.
 * @param {Object} subscription - subscription object with all attributes for update
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.updateSubscription = function(subscription, cb){
    this.mirror
        .subscriptions
        .update(subscription)
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Deletes a subscription this Glass.
 * @param {Object} subscriptionId - subscription identifier
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.deleteSubscription = function(subscriptionId, cb){
    this.mirror
        .subscriptions
        .delete({ id: subscriptionId })
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};


/**
 * Get the user's location
 * @param {Object} locationId - location identifier, defaults to 'latest' for most recent
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.getLocation = function(locationId, cb){
    this.mirror
        .location
        .get( locationId )
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * List locations
 * @param {Object} opts
 * @param {function} cb - callback(error, response)
 */
MirrorClient.prototype.listLocations = function(opts, cb){
    this.mirror
        .location
        .list(opts)
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};
    
module.exports = MirrorClient;
