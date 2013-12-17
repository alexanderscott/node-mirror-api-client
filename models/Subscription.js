"use strict";

var subscriptionSchema = module.exports = {
    "id": { type: String, required: true },
    "userToken": { type: String },
    "collection": { type: String, required: true, default: 'timeline' },     // locations, timeline
    "callbackUrl": { type: String }
};

