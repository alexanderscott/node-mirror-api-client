"use strict";

var assert = require('assert'),
    MirrorClient = require('../lib/mirror-api-client'),
    _und = require('underscore');

var mirrorClient;

describe('MirrorClient', function() {
    before(function(cb) {
        try {
            mirrorClient = new MirrorClient({
                clientId: config.googleApis.clientId,
                clientSecret: config.googleApis.clientSecret,
                redirectUri: config.googleApis.redirectUris[0],
                scope: config.googleApis.scope
            });
        } catch(err){
            return cb(err);
        }
        cb();
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
            cb();
        });
    });
    
    describe('#createClient()', function(){
        it('can create a mirror client', function(cb){
            cb();
        });
    });

    describe('#getAuthUrl()', function(){
        it('can get the google auth url for redirect', function(cb){
            cb();
        });
    });

    describe('#download()', function(){
        it('can download an attachment from a url', function(cb){
            cb();
        });
    });


    describe('#insertTimelineItem()', function(){
        it('can insert a timeline item', function(cb){
            cb();
        });
    });

    describe('#getTimelineItem()', function(){
        it('can get a timeline item', function(cb){
            cb();
        });
    });

    describe('#listTimelineItems()', function(){
        it('can list timeline items', function(cb){
            cb();
        });
    });

    describe('#getTimelineItemAttachment()', function(){
        it('can get a timeline item attachment', function(cb){
            cb();
        });
    });

    describe('#patchTimelineItem()', function(){
        it('can patch a timeline item', function(cb){
            cb();
        });
    });

    describe('#updateTimelineItem()', function(){
        it('can update a timeline item', function(cb){
            cb();
        });
    });

    describe('#deleteTimelineItem()', function(){
        it('can delete a timeline item', function(cb){
            cb();
        });
    });


    describe('#insertContact()', function(){
        it('can insert a contact', function(cb){
            cb();
        });
    });

    describe('#listContacts()', function(){
        it('can list contacts', function(cb){
            cb();
        });
    });

    describe('#updateContact()', function(){
        it('can update a contact', function(cb){
            cb();
        });
    });

    describe('#patchContact()', function(){
        it('can patch a contact', function(cb){
            cb();
        });
    });

    describe('#deleteContact()', function(){
        it('can delete a contact', function(cb){
            cb();
        });
    });

    describe('#insertSubscription()', function(){
        it('can insert a subscription', function(cb){
            cb();
        });
    });

    describe('#updateSubscription()', function(){
        it('can update a subscription', function(cb){
            cb();
        });
    });

    describe('#deleteSubscription()', function(){
        it('can delete a subscription', function(cb){
            cb();
        });
    });

    describe('#getLocation()', function(){
        it('can fetch a glass location', function(cb){
            cb();
        });
    });

    describe('#listLocations()', function(){
        it('can list glass locations', function(cb){
            cb();
        });
    });
});

