"use strict";

var locationSchema = module.exports = {
  "kind": { type: String },                         //"mirror#location",
  "id": { type: String, required: true },
  "timestamp": { type: Date },                       //datetime
  "latitude": { type: Number, required: true },
  "longitude": { type: Number, required: true },
  "accuracy": { type: Number },
  "displayName": { type: String, required: true },
  "address": { type: String }
};

