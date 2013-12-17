var contactSchema = module.exports = {
  "kind": "mirror#contact",
  "source": { type: String },
  "id": { type: String },
  "displayName": { type: String },
  "imageUrls": [ { type: String } ],
  "type": { type: String },
  "acceptTypes": [ { type: String } ],
  "phoneNumber": { type: String },
  "priority": unsigned integer,
  "acceptCommands": [ { "type": { type: String } } ],
  "speakableName": { type: String },
  "sharingFeatures": [ { type: String } ] 
};
