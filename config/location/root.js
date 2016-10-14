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
    connections: [],
    children: [],
    limitations: []
  },
  {
    localId: "beta",
    connections: [],
    children: [],
    limitations: []
  },
  {
    localId: "gamma",
    connections: [],
    children: [],
    limitations: []
  }]
};
