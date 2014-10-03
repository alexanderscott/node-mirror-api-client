"use strict";

var assert = require('assert'),
    MirrorClient = require('../lib/mirror-api-client'),
    timelineItemFixtures = require('./fixtures/timelineItems'),
    subscriptionFixtures = require('./fixtures/subscriptions'),
    contactFixtures = require('./fixtures/contacts'),
    readline = require('readline'),
    _und = require('underscore');

var rl, creds = {};

var timeout = 120000;    // timeout needed for async tests

var mirrorClient;
var tmpTimelineItems = [],
    tmpContacts = [],
    tmpLocations = [],
    tmpSubscriptions = [];

describe('MirrorClient', function() {

    function _getCred(rl, question, req, cb){
        rl.question( question, function(answer){
            if(!answer && req) _getCred(rl, question, req, cb);      // recurse
            else cb(null, answer);
        });
    }

    function _readlineCreds(cb){
        if(!rl) rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        
        _getCred(rl, "Google Client ID: ", true, function(inClientId){
            creds.clientId = inClientId;
            _getCred(rl, "Google Client Secret: ", true, function(inClientSecret){
                creds.clientSecret = inClientSecret;
                _getCred(rl, "Redirect URI: ", true, function(inRedirectUri){
                    creds.redirectUri = inRedirectUri;
                    creds.scope = ['https://www.googleapis.com/auth/glass.timeline',
                     'https://www.googleapis.com/auth/glass.location',
                     'https://www.googleapis.com/auth/userinfo.profile' ]).join(' ');
                    cb(null, creds);
                });
            });
        });
    }

    function _readlineAuthCode(cb){
        var authUrl = mirrorClient.getAuthUrl();
        console.log("Copy and paste the following URL into your browser: \n"+ authUrl);
        if(!rl) rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question("\nPaste the returned code query string: ", function(inCode){
            console.log("Attempting to authorize with code: " + inCode.trim());
            mirrorClient.authorize(inCode.trim(), function(err, res){
                if(err){
                    console.log("Error authorizing:", err);
                    assert.ifError(err);
                    return cb(err);
                }
                cb();
            });
        });

    }

    before(function(cb) {
        this.timeout(timeout);

        var creds;
        try {
            var config = require('../config.json');
            creds = {
                clientId: config.googleApis.clientId,
                clientSecret: config.googleApis.clientSecret,
                redirectUri: config.googleApis.redirectUris[0],
                scope: config.googleApis.scope
            }
            mirrorClient = require('../lib/mirror-api-client')( creds );
            _readlineAuthCode(cb);
        } catch(err){
            console.log("Could not find local config.  Using readline.");
            _readlineCreds(function(err, inCreds){
                creds = inCreds; 
                try {
                    mirrorClient = require('../lib/mirror-api-client')( creds );
                    _readlineAuthCode(cb);
                } catch(err){
                    console.log("Error initializing MirrorClient: ", err);
                    return cb(err);
                }
            });
        }
    });

    beforeEach(function(cb) {
        cb();
    });

    afterEach(function(cb) {
        cb();
    });

    after(function(cb) {
        tmpTimelineItems = [];
        tmpContacts = [];
        tmpLocations = [];
        tmpSubscriptions = [];
        cb();
    });


    describe('#insertTimelineItem()', function(){
        it('can insert a timeline item', function(cb){
            this.timeout(timeout);
            mirrorClient.insertTimelineItem( timelineItemFixtures[0], function(err, item){
                assert.ifError(err);
                assert.ok( _und.isObject( item ), 'inserted timeline item is an object' );
                assert.ok( _und.has( item, 'id'), 'inserted timeline item has an id');
                tmpTimelineItems.push(item);

                mirrorClient.insertTimelineItem( timelineItemFixtures[1], function(err, itemWithAttachment){
                    assert.ifError(err);
                    assert.ok( _und.isObject( itemWithAttachment ), 'inserted timeline item with attachment is an object' );
                    assert.ok( _und.has( itemWithAttachment, 'id'), 'inserted timeline item with attachment has an id');
                    tmpTimelineItems.push(itemWithAttachment);
                    cb();
                });
            });
        });
    });

    describe('#listTimelineItems()', function(){
        it('can list timeline items', function(cb){
            this.timeout(timeout);
            mirrorClient.listTimelineItems(function(err, res){
                assert.ifError(err);
                assert.ok( _und.isObject( res ) && _und.isArray(res.items), 'returns an array of timeline items');
                cb();
            });
        });
    });

    describe('#getTimelineItem()', function(){
        it('can get a timeline item', function(cb){
            this.timeout(timeout);
            mirrorClient.getTimelineItem( tmpTimelineItems[0].id, function(err, item){
                assert.ifError(err);
                assert.ok( _und.isObject( item ), 'fetched timeline item is an object'); 
                assert.ok( !_und.isEmpty( item ), 'fetched timeline item is not empty');
                cb();
            });
        });
    });


    describe('#getTimelineItemAttachment()', function(){
        it('can get a timeline item attachment', function(cb){
            this.timeout(timeout);
            mirrorClient.getTimelineItem( tmpTimelineItems[0].id, function(err, item){
                assert.ifError(err);
                assert.ok( _und.isObject( item ), 'fetched timeline item with attachment is an object'); 
                assert.ok( !_und.isEmpty( item ), 'fetched timeline item with attachment is not empty');
                cb();
            });
        });
    });

    describe('#patchTimelineItem()', function(){
        it('can patch a timeline item', function(cb){
            this.timeout(timeout);
            mirrorClient.patchTimelineItem( _und.extend( tmpTimelineItems[0], { title : 'patched' }), function(err, patchedItem){
                assert.ifError(err);
                assert.ok( _und.isObject( patchedItem ), 'patched timeline item is an object'); 
                assert.ok( !_und.isEmpty( patchedItem ), 'patched timeline item is not empty');
                assert.ok( patchedItem.title === 'patched', "item's title has been successfully patched");
                cb();
            });
        });
    });

    describe('#updateTimelineItem()', function(){
        it('can update a timeline item', function(cb){
            this.timeout(timeout);
            mirrorClient.updateTimelineItem( _und.extend( tmpTimelineItems[0], { title : 'updated' }), function(err, updatedItem){
                assert.ifError(err);
                assert.ok( _und.isObject( updatedItem ), 'updated timeline item is an object'); 
                assert.ok( !_und.isEmpty( updatedItem ), 'updated timeline item is not empty');
                assert.ok( updatedItem.title === 'updated', "item's title has been successfully updated");
                cb();
            });
        });
    });

    describe('#deleteTimelineItem()', function(){
        it('can delete a timeline item', function(cb){
            this.timeout(timeout);
            mirrorClient.deleteTimelineItem( tmpTimelineItems[0], function(err, res){
                assert.ifError(err);
                mirrorClient.getTimelineItem( tmpTimelineItems[0].id, function(err, deletedItem){
                    assert.ifError(err);
                    assert.ok( deletedItem.isDeleted , 'item has been deleted');

                    mirrorClient.deleteTimelineItem( tmpTimelineItems[1], function(err, res){
                        mirrorClient.getTimelineItem( tmpTimelineItems[1].id, function(err, deletedItem){
                            assert.ifError(err);
                            assert.ok( deletedItem.isDeleted , 'item with attachment has been deleted');

                            //tmpTimelineItems = [];
                            cb();
                        });
                    });
                });
            });
        });
    });


    describe('#insertContact()', function(){
        it('can insert a contact', function(cb){
            this.timeout(timeout);
            mirrorClient.insertContact( contactFixtures[0], function(err, contact){
                assert.ifError(err);
                assert.ok( _und.isObject( contact ), 'inserted contact is an object' );
                assert.ok( _und.has( contact, 'id'), 'inserted contact has an id');
                tmpContacts.push(contact);
                cb();
            });
        });
    });

    describe('#listContacts()', function(){
        it('can list contacts', function(cb){
            this.timeout(timeout);
            mirrorClient.listContacts(function(err, res){
                assert.ifError(err);
                assert.ok( _und.isObject( res ) && _und.isArray(res.items), 'returns an array of contacts');
                cb();
            });
        });
    });

    describe('#patchContact()', function(){
        it('can patch a contact', function(cb){
            this.timeout(timeout);
            mirrorClient.patchContact( _und.extend( tmpContacts[0], { displayName : 'patched contact' }), function(err, patchedContact){
                assert.ifError(err);
                assert.ok( _und.isObject( patchedContact ), 'patched contact is an object'); 
                assert.ok( !_und.isEmpty( patchedContact ), 'patched contact is not empty');
                assert.ok( patchedContact.displayName === 'patched contact', "contact's name has been successfully patched");
                cb();
            });
        });
    });

    describe('#updateContact()', function(){
        it('can update a contact', function(cb){
            this.timeout(timeout);
            mirrorClient.updateContact( _und.extend( tmpContacts[0], { displayName : 'updated contact' }), function(err, updatedContact){
                assert.ifError(err);
                assert.ok( _und.isObject( updatedContact ), 'updated contact is an object'); 
                assert.ok( !_und.isEmpty( updatedContact ), 'updated contact is not empty');
                assert.ok( updatedContact.displayName === 'updated contact', "contact's name has been successfully updateed");
                cb();
            });
        });
    });

    describe('#deleteContact()', function(){
        it('can delete a contact', function(cb){
            this.timeout(timeout);
            mirrorClient.deleteContact( tmpContacts[0], function(err, res){
                assert.ifError(err);
                //mirrorClient.getContact( tmpContacts[0], function(err, resContact){
                mirrorClient.listContacts( function(err, resContacts){
                    if(err){
                        console.log("Error getting contact after deleting:", err);
                        assert.ifError(err);
                        return cb(err);
                    }

                    var contactIds = _und.reduce(resContacts.items, function(memo, contact){
                        memo.push(contact.id);
                        return memo;
                    }, []);

                    assert.ok(contactIds.indexOf( tmpContacts[0].id ) === -1, 'deleted contact is no longer in list of contacts');
                    
                    //assert.ok( resContact.isDeleted , 'contact has been deleted');
                    //assert.ok( _und.isEmpty( resContacts.items ), 'contact has been deleted');
                    //tmpContacts = [];
                    cb();
                });
            });
        });
    });


    describe('#getLocation()', function(){
        it('can fetch a glass location', function(cb){
            this.timeout(timeout);
            mirrorClient.getLocation(function(err, location){
                assert.ifError(err);
                assert.ok( _und.isObject( location ), 'fetched location is an object'); 
                assert.ok( !_und.isEmpty( location ), 'fetched location is not empty');
                assert.ok( location.kind === 'mirror#locationsList' );
                cb();
            });
        });
    });

    describe('#getSettings()', function(){
        if('can get mirror API settings', function(cb){
            this.timeout(timeout);
            mirrorClient.getSettings('timezone', function(err, settings){
                assert.ifError(err);
                assert.ok( _und.isObject( settings ), 'fetched settings is an object'); 
                assert.ok( !_und.isEmpty( settings ), 'fetched settings is not empty');
                assert.ok( settings.kind === 'mirror#settings' );
                cb();
            });
        });
    });

});

