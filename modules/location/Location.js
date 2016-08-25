"use strict";

/** @type {Location} The root location that all locations will be made in by default */
var root = null;
/**
 * @constructor
 * @param {String} localId The id of the location that differeniates it from its siblings
 */
var Location = function(localId, parent)
{
  var self = this;
  Object.defineProperties(self,
  {
    /** @type {String} An id that will be used to differeniate the location from its siblings */
    localId:
    {
      value: localId
    },
    /** @type {Map<String, Location>} The locations that exist within this location */
    children:
    {
      value: new Map()
    },
    /** @type {Connection[]} A list of all the connections at this location */
    connections:
    {
      value: []
    },
    /** @type {String} The parent path of this location */
    parent:
    {
      writable: true,
      value: ""
    },
    /** @type {CharacterId} A list of all the characters that are currently at this location */
    characters:
    {
      value: []
    }
  });
  /* Adding this as a child to the root if root exists*/
  if (root !== null && !parent)
  {
    root.addChild(this);
  }
  /* If a parent was specified add it to it*/
  if (parent)
  {
    parent.addChild(this);
  }

};
/* Setting the root to the universe */
root = new Location("universe");

Object.defineProperties(Location.prototype,
{
  /**
   * Retrieves a descendant by using a relative path stirng
   * 
   * @param {String} path The path string to get the child by
   */
  getDescendant:
  {
    value: function(path)
    {
      /* Getting the first localId*/
      var split = path.split(/\./, 2);
      var descendant = this.children.has(split[0]);
      if (!descendant)
      {
        return null;
      }
      if (split.length === 1)
      {
        return descendant;
      }
      /* Returning the next descendant based on the*/
      return descendant.getDescendant(split[1]);
    }
  },
  addChild:
  {
    value: function(child) {

    }
  }

});

Object.defineProperties(module.exports,
{

  constructor:
  {
    value: Location
  },
  root:
  {
    value: root
  },
  /**
   * Retrieves a location as determined by the path.
   * @param {String} path The path to get the location for
   */
  getLocation:
  {
    value: function(path)
    {
      /* Basically makes use of the getDescendant function */
      return root.getDescendant(path);
    }
  }
});
