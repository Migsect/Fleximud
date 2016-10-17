"use strict";

/* Making use of javascript configuration */
module.exports = {
  localId: "root",
  connections: [
  {
    name: "Alpha Connection",
    destination: "alpha"
  },
  {
    name: "Beta Connection",
    destination: "beta"
  },
  {
    name: "Gamma Connection",
    destination: "gamma"
  }],
  limitations: [],
  children: [
  {
    localId: "alpha",
    name: "Alpha Point",
    connections: [],
    children: [],
    limitations: []
  },
  {
    localId: "beta",
    name: "Beta Point",
    connections: [],
    children: [],
    limitations: []
  },
  {
    localId: "gamma",
    name: "Gamma Point",
    connections: [],
    children: [],
    limitations: []
  }]
};
