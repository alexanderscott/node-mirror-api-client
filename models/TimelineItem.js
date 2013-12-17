"use strict";

var Contact = require('./Contact'),
    Location = require('./Location'),
    Attachment = require('./Attachment');

var timelineItemSchema = module.exports = {
  "kind": { type: String },                 //"mirror#timelineItem",
  "id": { type: String, required: true },
  "sourceItemId": { type: String },
  "canonicalUrl": { type: String },
  "bundleId": { type: String },
  "isBundleCover": { type: Boolean },
  "selfLink": { type: String },
  "created": { type: Date },
  "updated": { type: Date },
  "displayTime": { type: Date },
  "isPinned": { type: Boolean },
  "pinScore": { type: Number },
  "isDeleted": { type: Boolean },
  "etag": { type: String },         //etag,
  "creator": { type: Contact },
  "recipients": [ Contact ],
  "inReplyTo": { type: String },
  "title": { type: String },
  "text": { type: String },
  "html": { type: String },
  "speakableType": { type: String },
  "speakableText": { type: String },
  "attachments": [ Attachment ],
  "location": [ Location ],
  "menuItems": [
    {
      "id": { type: String },
      "action": { type: String },
      "values": [
        {
          "state": { type: String },
          "displayName": { type: String },
          "iconUrl": { type: String }
        }
      ],
      "removeWhenSelected": { type: Boolean },
      "payload": { type: String }
    }
  ],
  "notification": {
    "level": { type: String },
    "deliveryTime": { type: Date }
  }
};

