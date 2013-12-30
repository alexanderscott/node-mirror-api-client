"use strict";

var assert = require('assert'),
    MirrorClient = require('../lib/mirror-api-client'),
    timelineItemFixtures = require('fixtures/timelineItemFixtures'),
    subscriptionFixtures = require('fixtures/subscriptions'),
    contactFixtures = require('fixtures/contactFixtures'),
    _und = require('underscore');

var mirrorClient,
    tmpTimelineItems = [],
    tmpContacts = [],
    tmpLocations = [],
    tmpSubscriptions = [];

describe('MirrorClient', function() {
    before(function(cb) {
        try {
            mirrorClient = new MirrorClient({
                clientId: config.googleApis.clientId,
                clientSecret: config.googleApis.clientSecret,
                redirectUri: config.googleApis.redirectUris[0],
                scope: config.googleApis.scope
            });
            cb();
        } catch(err){
            return cb(err);
        }
    });

    beforeEach(function(cb) {
        cb();
    });

    afterEach(function(cb) {
        cb();
    });

    after(function(cb) {
        cb();
    });

    describe('#getTokens()', function(){
        it('can get user auth tokens', function(cb){
            mirrorClient.getTokens(function(err, res){
                assert.ifError(err);
                cb();
            });
        });
    });
    
    describe('#createClient()', function(){
        it('can create a mirror client', function(cb){
            mirrorClient.createClient(function(err, client){
                assert.ifError(err);
                cb();
            });
        });
    });

    describe('#getAuthUrl()', function(){
        it('can get the google auth url for redirect', function(cb){
            mirrorClient.getAuthUrl(function(err, authUrl){
                assert.ifError(err);
                cb();
            });
        });
    });

    describe('#download()', function(){
        it('can download an attachment from a url', function(cb){
            mirrorClient.download(function(err, res){
                assert.ifError(err);
                cb();
            });
        });
    });


    describe('#insertTimelineItem()', function(){
        it('can insert a timeline item', function(cb){
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
            mirrorClient.listTimelineItems(function(err, res){
                assert.ifError(err);
                assert.ok( _und.isObject( res ) && _und.isArray(res.items), 'returns an array of timeline items');
                cb();
            });
        });
    });

    describe('#getTimelineItem()', function(){
        it('can get a timeline item', function(cb){
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
            mirrorClient.patchTimelineItem( tmpTimelineItems[0], _und.extend( tmpTimelineItems[0], { title : 'patched' }), function(err, patchedItem){
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
            mirrorClient.patchTimelineItem( tmpTimelineItems[0], _und.extend( tmpTimelineItems[0], { title : 'updated' }), function(err, patchedItem){
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
            mirrorClient.deleteTimelineItem( tmpTimelineItems[0], function(err, res){
                assert.ifError(err);
                mirrorClient.getTimelineItem( tmpTimelineItems[0].id, function(err, deletedItem){
                    assert.ifError(err);
                    assert.ok( _und.isEmpty( deletedItem ), 'item has been deleted');

                    mirrorClient.deleteTimelineItem( tmpTimelineItems[1], function(err, res){
                        mirrorClient.getTimelineItem( tmpTimelineItems[0].id, function(err, deletedItem){
                            assert.ifError(err);
                            assert.ok( _und.isEmpty( deletedItem ), 'item with attachment has been deleted');

                            tmpTimelineItems = [];
                            cb();
                        });
                    });
                });
            });
        });
    });


    describe('#insertContact()', function(){
        it('can insert a contact', function(cb){
            mirrorClient.insertContact( contactFixtures[0], function(err, contact){
                assert.ifError(err);
                assert.ok( _und.isObject( contact ), 'inserted contact is an object' );
                assert.ok( _und.has( contact, 'id'), 'inserted contact has an id');
                tmpContacts.push(contact);
            });
        });
    });

    describe('#listContacts()', function(){
        it('can list contacts', function(cb){
            mirrorClient.listContacts(function(err, res){
                assert.ifError(err);
                assert.ok( _und.isObject( res ) && _und.isArray(res.items), 'returns an array of contacts');
                cb();
            });
        });
    });

    describe('#patchContact()', function(){
        it('can patch a contact', function(cb){
            mirrorClient.patchContact( tmpContacts[0], _und.extend( tmpContacts[0], { name : 'patched contact' }), function(err, patchedContact){
                assert.ifError(err);
                assert.ok( _und.isObject( patchedItem ), 'patched contact is an object'); 
                assert.ok( !_und.isEmpty( patchedItem ), 'patched contact is not empty');
                assert.ok( patchedContact.name === 'patched contact', "contact's name has been successfully patched");
                cb();
            });
        });
    });

    describe('#updateContact()', function(){
        it('can update a contact', function(cb){
            mirrorClient.updateContact( tmpContacts[0], _und.extend( tmpContacts[0], { name : 'updated contact' }), function(err, updatedContact){
                assert.ifError(err);
                assert.ok( _und.isObject( updatedContact ), 'updated contact is an object'); 
                assert.ok( !_und.isEmpty( updatedContact ), 'updated contact is not empty');
                assert.ok( updatedContact.name === 'updated contact', "contact's name has been successfully updateed");
                cb();
            });
        });
    });

    describe('#deleteContact()', function(){
        it('can delete a contact', function(cb){
            mirrorClient.deleteContact( tmpContacts[0], function(err, res){
                assert.ifError(err);
                mirrorClient.listContacts(function(err, resContacts){
                    assert.ifError(err);
                    assert.ok( _und.isEmpty( resContacts.items ), 'contact has been deleted');
                    tmpContacts = [];
                    cb();
                });
            });
        });
    });

    describe('#insertSubscription()', function(){
        it('can insert a subscription', function(cb){
            mirrorClient.insertSubscription( subscriptionFixtures[0], function(err, subscription){
                assert.ifError(err);
                assert.ok( _und.isObject( subscription ), 'inserted subscription is an object' );
                assert.ok( _und.has( subscription, 'id'), 'inserted subscription has an id');
                tmpSubscriptions.push(subscription);
                cb();
            });
        });
    });

    describe('#listSubscriptions()', function(){
        it('can list subscriptions', function(cb){
            mirrorClient.listSubscriptions( function(err, subscriptions){
                assert.ifError(err);
                assert.ok( _und.isObject( subscriptions ) && _und.isArray( subscriptions.items ), 'listed subscriptions is an object with an array of subscriptions');
                assert.ok( !_und.isEmpty( subscriptions.items ), 'listed subscriptions is not empty');
                cb();
            });
        });
    });

    describe('#updateSubscription()', function(){
        it('can update a subscription', function(cb){
            mirrorClient.updateSubscription( tmpSubscriptions[0], _und.extend( tmpSubscriptions[0], { name : 'updated subscription' }), function(err, updatedSubscription){
                assert.ifError(err);
                assert.ok( _und.isObject( updatedSubscription ), 'updated subscription is an object'); 
                assert.ok( !_und.isEmpty( updatedSubscription ), 'updated subscription is not empty');
                assert.ok( updatedSubscription.name === 'updated subscription', "subscription's name has been successfully updateed");
                cb();
            });
        });
    });

    describe('#deleteSubscription()', function(){
        it('can delete a subscription', function(cb){
            mirrorClient.deleteSubscription( tmpSubscriptions[0], function(err, deletedSubscription){
                assert.ifError(err);
                mirrorClient.listSubscriptions( function(err, subscriptionsRes){
                    assert.ifError(err);
                    assert.ok( _und.isEmpty( subscriptionRes ), 'subscription was deleted');
                    tmpSubscriptions = [];
                    cb();
                });
            });
        });
    });

    describe('#listLocations()', function(){
        it('can list glass locations', function(cb){
            mirrorClient.listLocations( function(err, locations){
                assert.ifError(err);
                assert.ok( _und.isArray(locations), 'locations response is an array');
                tmpLocations.push(locations[0]);
                cb();
            });
        });
    });

    describe('#getLocation()', function(){
        it('can fetch a glass location', function(cb){
            mirrorClient.getLocation( tmpLocations[0], function(err, location){
                assert.ifError(err);
                assert.ok( _und.isObject( location ), 'fetched location is an object'); 
                assert.ok( !_und.isEmpty( location ), 'fetched location is not empty');
                tmpLocations = [];
                cb();
            });
        });
    });

});

