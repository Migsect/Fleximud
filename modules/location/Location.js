"use strict";

/** @type {Location} The root location that all locations will be made in by default */
var root = null;
/**
 * @constructor
 * @param {String} localId The id of the location that differeniates it from its siblings
 */
var Location = function(json)
{
  var self = this;
  Object.defineProperties(self,
  {
    /** @type {String} An id that will be used to differeniate the location from its siblings */
    localId:
    {
      value: (function()
      {
        /* Validating/cleaning of the localId happens here */
        return json.localId;
      })()
    },
    /** @type {Map<String, Location>} The locations that exist within this location */
    children:
    {
      value: (function()
      {
        /* The map of all the children */
        var childrenMap = new Map();
        /* Adding all the children */
        json.children.forEach(function(childJSON)
        {
          /* Creating the child and adding it */
          try
          {
            var child = new Location(childJSON);
            self.addChild(child);
          }
          catch (error)
          {
            /* TODO adding error logging */
          }
        });
        /* Returning the children map */
        return childrenMap;
      })()
    },
    /** @type {Connection[]} A list of all the connections at this location */
    connections:
    {
      value: []
    },
    /** @type {Function(character)} A function that takes in a character and
     *           returns true or false based on some contrait speicifed by the
     *           function. This will be called whenever a character enters a location
     *           or has a "character update" event is provided.
     */
    limitations:
    {
      value: []
    },
    /** @type {String} The parent path of this location */
    parent:
    {
      writable: true,
      value: null
    },
    /** @type {Client} A list of all the clients at this location */
    clients:
    {
      value: []
    }
  });

};
/* Setting the root to the universe */
var root = new Location("universe");

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
  /**
   * [getPath description]
   * @return {String} The path of this location from the perspective of the root
   *                      location.  This means that if this path was called with
   *                      The "getDescendants" function from that root element, then
   *                      this element will be returned.
   */
  getPath:
  {
    value: function()
    {
      /* If there is no parent, return nothing. */
      if (this.parent === null)
      {
        return "";
      }
      /* If the parent is a root location, then we need to just return what we got */
      if (this.parent.parent === null)
      {
        return this.localId;
      }
      /* Returning the path */
      return this.parent.getPath() + "." + this.localId;
    }
  },
  /**
   * Checks to see if this location has a child with the specified id.
   * 
   * @param {Stirng} childID Local id of a child to check for
   * @return {Boolean} True if there is a child with the id.
   */
  hasChild:
  {
    value: function(childId)
    {
      return this.children.has(childId);
    }
  },
  /**
   * Adds a child location to this location.
   * This will make use of the child's internal identifier to place the child.
   *
   * If the identifier is already being used, then an exception will be thrown.
   * 
   * @param {Location} child The child to add.
   */
  addChild:
  {
    value: function(child)
    {
      /* If there is already a child with the localId, throw an error */
      if (this.children.has(child.localId))
      {
        throw new Error("addChild Error, Temporary message. Conflicting localId");
      }
      /* Checking if the child has a parent already, if it does then we
       * should not be adding it since that will create a break.
       */
      if (child.parent === null)
      {
        throw new Error("addChild Error, Temponrary message. Child not orphan");
      }
      /* Otherwise we're going to add the child to this location */
      child.parent = this;
      this.chilren.set(child.localId, child);
    }
  },
  /**
   * Removes a child location from this location.  This will make the child an orphan.
   * This will fail silent if the child is not found. This is because the contact
   * of this function is to make sure that the child is not included in the location,
   * not that it is removed.
   *
   * @param {String} localId The localID of the child to remove from this location.
   */
  removeChild:
  {
    value: function(localId)
    {
      /* Return silently if you cannot remove the child */
      if (!this.children.has(localId))
      {
        return;
      }

      var child = this.children.get(localId);
      child.parent = null;
      this.children.delete(localId);

    }
  },
  /**
   * Removes this element from its parent and makes this element's parent null.
   * This will make the location a true orphan (parent is not root). 
   *
   * The contract of this function is to make sure the location has no parent.
   * As such if the location has no parent then it will fail silent as the
   * state is already done and the contract is fulfilled.
   */
  orphanate:
  {
    value: function()
    {
      if (this.parent === null)
      {
        return;
      }
      this.parent.removeChild(this.localId);
    }
  },
  /**
   * Duplicates this Location.
   * The duplicate will not share all the same properties as the location it
   * is duplicating.  This is due to there being some contraints on a location's
   * members.
   *
   * Characters can only be in one location, as such this will not have any 
   * characters.  This duplicate will also be an orphan.
   * 
   * @return A duplicate of this location.
   */
  duplcate:
  {
    value: function() {

    }
  },
  /**
   * Check if the character is allowed to be in this location.
   * 
   * @param {Character} character The character to test.
   */
  isValidCharacter:
  {
    value: function(character)
    {
      for (var i = 0; i < this.limitations.length; i++)
      {
        var limitation = this.limitations[i];
        try
        {
          if (!limitation(character))
          {
            return false;
          }
        }
        catch (error)
        {
          /* Error logging of the lambdas*/
        }
      }
      return true;
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
