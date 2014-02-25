"use strict";

var util = require('util'),
    events = require('events'),
    //connect = require('connect'),
    googleApis = require('googleapis'),
    OAuth2Client = googleApis.OAuth2Client;

function MirrorClient(opts) {
    if (!(this instanceof MirrorClient)) return new MirrorClient(opts);

    if(!opts) throw new Error("Must supply Mirror API client ID + secret");

    opts = opts || {};
    this.gClient = opts.gClient || {};
    this.oauth2Client = opts.oauth2Client || new OAuth2Client( opts.clientId, opts.clientSecret, opts.redirectUri || '' );
    this.scope = (opts.scope || 
                    ['https://www.googleapis.com/auth/glass.timeline',
                     'https://www.googleapis.com/auth/glass.location',
                     'https://www.googleapis.com/auth/userinfo.profile' ]).join(' ');
    //this.authorize(opts);

    this._defaults = {
        maxResults: 50
    };

    return this;
}

util.inherits(MirrorClient, events.EventEmitter);

MirrorClient.prototype.authorize = function(code, cb){
    var self = this;
    this.oauth2Client.getToken(code, function(err, credentials){
        if(err){
            if(cb) return cb(err);
            else return false;
        }
        self.oauth2Client.credentials = credentials;
        googleApis
            .discover('oauth2', 'v2')
            .discover('mirror', 'v1')
            .withAuthClient(self.oauth2Client)
            .execute(function(err, client){
                if(err){ 
                    if(cb) return cb(err);
                    else return false;
                }
                self.gClient = client;
                self.mirror = client.mirror;
                if(cb) return cb(null, credentials);
                else return credentials;
            });
    });
};

MirrorClient.prototype.getUserInfo = function(cb){
    var self = this;
    if(!self.gClient.oauth2) return cb(new Error("Client not authorized to get user info."));

    self.gClient
        .oauth2
        .userinfo
        .get()
        .withAuthClient( self.oauth2Client )
        .execute(function(err, info){
            if(err) return cb(err);
            cb(null, info);
        });
};

MirrorClient.prototype.connect = function(cb){
    var self = this;
    googleApis
        .discover('oauth2', 'v2')
        .discover('mirror', 'v1')
        .withAuthClient(self.oauth2Client)
        .execute(function(err, client){
            if(err) return cb(err);
            self.gClient = client;
            self.mirror = client.mirror;
            cb(null, client);
        });
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
            self.gClient = gClient;

            cb(null, gClient);
        });
};


/**
 * Downloads data from the specified URL, using an authorized connection.
 * @param {String} url
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.getAuthUrl = function(){
    //console.log('scope:' + this.scope);
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
    if(!cb){
        cb = num;
        num = this._defaults.maxResults;
    }

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
        .patch({ id: item.id }, item)
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
        .update({ id: item.id }, item)
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Deletes the timeline item with the specified identifier.
 * @param {String} itemId - timeline item identifier
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.deleteTimelineItem = function(itemId, cb){
    if(typeof itemId === 'object' && 'id' in itemId) itemId = itemId.id;
    this.mirror
        .timeline
        .delete({ id: itemId })
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};



/**
 * Lists the contacts on this Glass.
 * @param {Integer} num (optional) - max results to return
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.listContacts = function(cb){
    this.mirror
        .contacts
        .list()
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Gets a contact on this Glass.
 * @param {String} id - contact id (or contact object)
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.getContact = function(contactId, cb){
    if(typeof contactId === 'object' && 'id' in contactId) contactId = contactId.id;
    this.mirror
        .contacts
        .get({ id: contactId })
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Inserts a contact on this Glass.
 * @param {Object} contact - contact object - (id, displayName, imageUrls)  
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.insertContact = function(contact, cb){
    this.mirror
        .contacts
        .insert( contact )
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
        .update({ id: contact.id }, contact)
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
        .patch({ id: contact.id}, contact )
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Deletes a contact from this Glass.
 * @param {Object} contactId - contact identifier
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.deleteContact = function(contactId, cb){
    if(typeof contactId === 'object' && 'id' in contactId) contactId = contactId.id;
    this.mirror
        .contacts
        .delete({ id: contactId })
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};



/**
 * Lists the subscriptions on this Glass.
 * @param {Integer} num (optional) - max results to return
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.listSubscriptions = function(num, cb){
    if(!cb){
        cb = num;
        num = this._defaults.maxResults;
    }

    this.mirror
        .subscriptions
        .list({ maxResults: num })
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
        .update({ id: subscription.id }, subscription)
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * Deletes a subscription this Glass.
 * @param {Object} subscriptionId - subscription identifier
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.deleteSubscription = function(subscriptionId, cb){
    if(typeof subscriptionId === 'object' && 'id' in subscriptionId) subscriptionId = subscriptionId.id;
    this.mirror
        .subscriptions
        .delete({ id: subscriptionId })
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};


/**
 * Get the location by id
 * @param {Object} locationId - location identifier, defaults to 'latest' for most recent
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.getLocation = function(locationId, cb){
    if(typeof locationId === 'object' && 'id' in locationId) locationId = locationId.id;
    this.mirror
        .locations
        .get({ id: locationId })
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};

/**
 * List user locations
 * @param {function} cb - callback(error, response)
**/
MirrorClient.prototype.getLocation = function(cb){
    this.mirror
        .locations
        .list()
        .withAuthClient( this.oauth2Client )
        .execute( cb );
};
    
module.exports = MirrorClient;
