{
  "kind": "mirror#timelineItem",
  "id": string,
  "sourceItemId": string,
  "canonicalUrl": string,
  "bundleId": string,
  "isBundleCover": boolean,
  "selfLink": string,
  "created": datetime,
  "updated": datetime,
  "displayTime": datetime,
  "isPinned": boolean,
  "pinScore": integer,
  "isDeleted": boolean,
  "etag": etag,
  "creator": contacts Resource,
  "recipients": [
    contacts Resource
  ],
  "inReplyTo": string,
  "title": string,
  "text": string,
  "html": string,
  "speakableType": string,
  "speakableText": string,
  "attachments": [
    timeline.attachments Resource
  ],
  "location": locations Resource,
  "menuItems": [
    {
      "id": string,
      "action": string,
      "values": [
        {
          "state": string,
          "displayName": string,
          "iconUrl": string
        }
      ],
      "removeWhenSelected": boolean,
      "payload": string
    }
  ],
  "notification": {
    "level": string,
    "deliveryTime": datetime
  }
}
