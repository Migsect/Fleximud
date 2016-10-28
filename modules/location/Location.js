"use strict";

var uuid = require("node-uuid");
var Util = require("../Util");

var Limitation = require("./Limitation");
var Connection = require("./Connection");

/** @type {Location} The root location that all locations will be made in by default */
var root = null;
/** @type {Map} All the locations, this uses a global Id as a key */
var locations = new Map();

/**
 * @constructor
 * @param {String} localId The id of the location that differeniates it from its siblings
 */
var Location = function(json)
{
  var self = this;
  Object.defineProperties(self,
  {
    name:
    {
      enumerable: true,
      value: Util.isNull(json.name) ? "Unknown Location" : json.name
    },
    docoumentation:
    {
      enumerable: true,
      value: Util.parseFileString(Util.isNull(json.documentation) ? "" : json.documentation, process.cwd() + "/config/docoumentation/")
    },
    /** @type {String} An id that will be used to differeniate the location from its siblings */
    localId:
    {
      enumerable: true,
      value: (function()
      {
        /* Validating/cleaning of the localId happens here */
        return json.localId;
      })()
    },
    /** @type {String} An id that will be used to uniquely identify this location from others 
     *                This will be automatically generated if not supplied.
     */
    globalId:
    {
      enumerable: true,
      value: (function()
      {
        return json.globalId ? json.globalId : uuid.v4();
      })()
    },
    /** @type {Map<String, Location>} The locations that exist within this location */
    children:
    {
      enumerable: true,
      value: new Map()
    },
    /** @type {Connection[]} A list of all the connections at this location */
    connections:
    {
      enumerable: true,
      value: Connection.parseJSONList(json.connections)
    },
    /** @type {Function(character)} A function that takes in a character and
     *           returns true or false based on some contrait speicifed by the
     *           function. This will be called whenever a character enters a location
     *           or has a "character update" event is provided.
     */
    limitations:
    {
      enumerable: true,
      value: Limitation.parseJSONList(json.limitations)
    },
    /** @type {String} The parent path of this location */
    parent:
    {
      enumerable: true,
      writable: true,
      value: null
    },
    /** @type {Character} A list of all the characters at this location */
    characters:
    {
      writable: true,
      value: []
    }
  });

  if (locations.has(this.globalId))
  {
    /* TODO Throw an error for when there is a globalId clash */
  }
  locations.set(this.globalId, this);

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
      console.log(error);
    }
  });
};

Object.defineProperties(Location.prototype,
{
  addCharacter:
  {
    /**
     * Adds a client to the location.
     * This will not add the client to the location if the client is already at
     * the location.
     *
     * @param  {CharacterID} characterId The characterId to add to the location.
     */
    value: function(character)
    {
      if (this.characters.findIndex(function(element)
        {
          return element.id === character.id;
        }) >= 0)
      {
        return;
      }
      /* pushing the client onto the list */
      this.characters.push(character);
    }
  },
  removeCharacter:
  {
    /**
     * Removes the client from the location if it is in the location.
     * Will silent fail if there is no client in the location since the contract
     * is the make sure the client is not in this location.
     * 
     * @param  {CharacterID} characterId The characterId to remove.
     */
    value: function(character)
    {
      /* Getting the client's index */
      var characterIndex = this.characters.findIndex(function(element)
      {
        return element.id === character.id;
      });
      /* If the index is less than 0 then the client is not in the list */
      if (characterIndex < 0)
      {
        return;
      }
      /* Splicing the client out */
      this.characters.splice(characterIndex, 1);

    }
  },
  clearCharacters:
  {
    /**
     * Removes all the clients from the location.
     * This is a pure reset of the location's client array.
     */
    value: function()
    {
      this.characters = [];
    }
  },
  getDescendant:
  {
    /**
     * Retrieves a descendant by using a relative path stirng
     * 
     * @param {String} path The path string to get the child by
     */
    value: function(path)
    {
      /* Getting the first localId, splitting into two elements at most */
      var split = path.split(/\./, 2);
      /* Returning self if the first split has nothing */
      if (split[0].length === 0)
      {
        return this;
      }
      /* Grabbing and checking if the descendant exists*/
      var descendant = this.children.get(split[0]);
      if (!descendant)
      {
        return null;
      }
      /* If we have a descendant and there is only one split element */
      if (split.length === 1)
      {
        return descendant;
      }
      /* Returning the next descendant based on the */
      return descendant.getDescendant(split[1]);
    }
  },
  /**
   * Returns the path of the location going up to a root.
   * This does not mean that it will be under the main root and as such may be
   * under an orphaned location.
   * 
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
      if (child.parent !== null)
      {
        throw new Error("addChild Error, Temponrary message. Child not orphan");
      }
      /* Otherwise we're going to add the child to this location */
      child.parent = this;
      this.children.set(child.localId, child);
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
  },
  delete:
  {
    /**
     * Will delete the location by removing all references to it.
     * 
     * If there are characters at the location, however, this will fail.
     * 
     * This removes the location from global mapping as well as from its
     * parents.  It will also call delete on its sub locations.
     * 
     * Furthermore this will remove all connections to the location.
     */
    value: function()
    {
      /* TODO implement this shit yo s*/
    }
  },
  getUpdateData:
  {
    /**
     * Creates an object that contains the data for a location update.
     * 
     * @return {Object} The update data.
     */
    value: function()
    {
      var self = this;
      return {
        name: self.name,
        documentation: self.documentation,
        path: self.getPath(),
        localId: self.localId,
        connections: self.connections.map(function(connection)
        {
          return {
            name: connection.name,
            id: connection.id,
            destination: module.exports.getLocation(connection.destination).name
          };
        })
      };
    }
  }
});

/* Setting the root to the universe */
var rootJSON = require(process.cwd() + "/config/location/root");
var root = new Location(rootJSON);

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
      if (Util.isNull(path))
      {
        return root;
      }
      /* Basically makes use of the getDescendant function */
      return root.getDescendant(path);
    }
  },
  getLocationByGlobalId:
  {
    value: function(globalId) {

    }
  }
});
