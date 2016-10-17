"use strict";

/* General Node Modules */
var uuid = require("node-uuid");
var Promise = require("promise");

/* Database */
var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var dbUtils = require(process.cwd() + "/modules/DatabaseUtil");

/* General Utilities or DataStructures*/
var Util = require(process.cwd() + "/modules/Util");

/* Type Configurations */
var AttributeTypes = require("./AttributeTypes");
var DescriptorTypes = require("./DescriptorTypes");
var config = require(process.cwd() + "/config/general");

/* Model Schemas */
var Attributes = require("./DataModels/Attributes");
var SpeciesSex = require("./DataModels/SpeciesSex");
var Descriptors = require("./DataModels/Descriptors");
var Stats = require("./DataModels/Stats");
var Name = require("./DataModels/Name");

/* Locations */
var Location = require(process.cwd() + "/modules/location/Location");

/**
 * The character schema is represented by a character id and the character's data.
 * The character data can be anything ranging from their name to an attribute.*Because the character model may change,
 we make use of a conglomerated data attribute 
 * to store a character's varied data.
 */
var CharacterSchema = Schema(
{
  /** @type {UUID} The unique ID of the character that is allowed to be shown on the front end. */
  id:
  {
    type: String,
    required: true
  },
  /** @type {ObjectId.Account} The objectId of the account this character belongs to. */
  accountId:
  {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },
  /** @type {Name Schema} An object that stores name information about the character */
  name:
  {
    type: Name.schema,
    required: true
  },
  /** @type {Attributes Schema} An object that stores or calculates the attributes of a character */
  attributes:
  {
    type: Attributes.schema,
    required: true
  },
  /** @type {SpeciesSex Schema} An objet that stores the species-sex of the character */
  speciesSex:
  {
    type: SpeciesSex.schema,
    require: true
  },
  /** @type {Decriptors Schema} An object that stores all the descriptors of the character */
  descriptors:
  {
    type: Descriptors.schema,
    require: true
  },
  stats:
  {
    type: Stats.schema,
    require: true
  },
  /** @type {String} A location path that depicts the location of the character. */
  locationPath:
  {
    type: String
  }
});

/* Defining listeners on the database */
/* Too complicated for now, going to instead do a check on each tick
 * If tick rates become too slow, we'll revert this back to the original
 * but that may wish to make a wrapper class around the data models when we do.
 */
// dbUtils.defineObserverPattern(CharacterSchema, "change");

/**
 * Retrieves the location object for the character.
 * This transforms the path into a location by using the location graph.
 * 
 * @return {Location} The location object the character is in.
 */
CharacterSchema.methods.getLocation = function()
{
  return Location.getLocation(this.locationPath);
};

/**
 * Moves the character to the new location.
 * This changes the character's current location, removes the character from
 * their current location, and adds the character to their new location.
 *
 * This will save the character's data to the database.
 *
 * This does not send any updates to the client(s).  The updates should be handled
 * by the clients.
 * 
 * @param  {Location} nextLocation [description] */
CharacterSchema.methods.moveToLocation = function(nextLocation)
{
  /* Grabbing the character's current location */
  var currentLocation = this.getLocation();

  /* Removing the character from the current location and adding them to the new */
  currentLocation.removeCharacter(this.id);
  nextLocation.addCharacter(this.id);

  /* Setting and saving the character's new path */
  this.locationPath = nextLocation.getPath();
  this.save();
};

/**
 * Retrieves all the stat transformations fro the character's different data-holding
 * objects.  For example, species and descriptors.
 *
 * This will order the transforms in the order that they should occur.
 * 
 * @param  {String} key The stat to get the transforms for.
 * @return {Transform[]} A list of the transforms.
 */
CharacterSchema.methods.getStatTransforms = function(key)
{
  /* The main list to return */
  var transforms = [];

  /* Collecting Transforms from Attributes */
  Array.prototype.push.apply(transforms, AttributeTypes.transforms.get(key));

  /* Collecting Transforms from Descriptors */
  Array.prototype.push.apply(transforms, DescriptorTypes.transforms.get(key));

  /* Collecting Transforms from Species and sex */
  Array.prototype.push.apply(transforms, this.speciesSex.speciesType.transforms.get(key));
  Array.prototype.push.apply(transforms, this.speciesSex.sexType.transforms.get(key));

  /* Collecting Transforms from Effects*/
  /* TODO when effects are properly implemented */

  /* Returning the compiled list */
  return transforms;
};

/**
 * Compiles a list of all the keys of the stat transforms.
 * This is useful for commands that want to know all the stats.
 * 
 * @return {String[]} The list of keys from the transforms. 
 */
CharacterSchema.methods.getStatTransformsKeys = function()
{
  var keys = new Set();
  var addToKeys = function(list)
  {
    Array.from(list).forEach(function(element)
    {
      keys.add(element);
    });
  };

  /* Collecting Transforms from Attributes */
  addToKeys(AttributeTypes.transforms.keys());

  /* Collecting Transforms from Descriptors */
  addToKeys(DescriptorTypes.transforms.keys());

  /* Collecting Transforms from Species and sex */
  addToKeys(this.speciesSex.speciesType.transforms.keys());
  addToKeys(this.speciesSex.sexType.transforms.keys());

  /* Returning the compiled list of keys */
  return Array.from(keys.entries()).map(function(element)
  {
    return element[0];
  });
};

/* Hooks for validating on loading */

/* Migration ensuring */
CharacterSchema.post("init", function(document)
{
  document.attributes = dbUtils.migrate(document.attributes, Attributes.createLiteral());
  document.descriptors = dbUtils.migrate(document.descriptors, Descriptors.createLiteral());
  document.stats = dbUtils.migrate(document.stats, Stats.createLiteral());
});

var Character = Mongoose.model("Character", CharacterSchema);

Object.defineProperties(module.exports,
{
  schema:
  {
    value: CharacterSchema
  },
  createCharacter:
  {
    /**
     * Creates a new character under the specified accout.
     *
     * @param  {Account} account The account that the character is being made under.
     * @param  {JSON} JSON An object literal to represent the character data to use.
     * @param  {Callback} callback Called when the character is successfully saved.
     * @param  {Callback} errorCallback Called if there was an error with the creation
     * @return {CharacterModel} The character model that was created.
     */
    value: function(account, JSON, callback, errorCallback)
    {
      /* Generating information */
      var id = uuid.v4();
      /* Creating the actual model */
      var character = new Character(
      {
        id: id,
        accountId: account._id,
        name: Name.createLiteral(JSON.fullName, JSON.shortName),
        attributes: Attributes.createLiteral(),
        speciesSex: SpeciesSex.createLiteral(JSON.species, JSON.sex),
        descriptors: Descriptors.createLiteral(),
        stats: Stats.createLiteral()
      });

      /*** Species-Sex Setting ***/
      var species = character.speciesSex.speciesType;

      /*** Descriptor Setting ***/
      if (!Util.isNull(JSON.descriptors))
      {
        Object.keys(JSON.descriptors).forEach(function(key)
        {
          character.descriptors.setDescriptor(key, JSON.descriptors[key]);
        });
      }
      console.log(character.descriptors);

      /*** Attribute Setting ***/

      /* Setting the species and the sex attributes */
      character.speciesSex.speciesType.applyInitialAttributes(character);
      character.speciesSex.sexType.applyInitialAttributes(character);

      /* Scaling specific attributes as selected by the character */
      /* TODO proper configuration for this */
      if (!Util.isNull(JSON.attributes))
      {
        JSON.attributes.forEach(function(attribute)
        {
          var currentValue = character.attributes.getAttribute(attribute);
          var multiplier = config.characterCreation.attributeChoiceMultiplier;
          character.attributes.setAttribute(attribute, currentValue * multiplier);
        });
      }

      /* Setting the top level attribute to 1 */
      var topKey = AttributeTypes.top.id;
      character.attributes.setAttribute(topKey, 1);

      /*** Location Setting ***/
      character.location = species.startingLocation;

      /*** Saving the character ***/
      character.save(function(err, document)
      {
        if (err)
        {
          if (typeof errorCallback == "function")
          {
            errorCallback(err);
          }
          return console.error(err);
        }
        console.log("Saved Character to Database:", document.id);
        if (typeof callback == "function")
        {
          callback(character);
        }
      });
      /* Adding the character to an account */
      account.addCharacter(character);
      return character;
    }
  },
  deleteCharacter:
  {
    /**
     * Deletes a character based on the Query object.
     * 
     * @param  {Object} query  The query for the character to delete.
     * @return {Promise}       A promise depicting whether the deletion was a sucess.
     */
    value: function(query)
    {
      return new Promise(function(resolve, reject)
      {
        Character.find(query).remove().exec(function(error, result)
        {
          if (error)
          {
            reject(error);
          }
          else
          {
            resolve(result);
          }
        });

      });
    }
  },
  characterExists:
  {
    /**
     * Checks to see if the character exists.
     * 
     * @param  {String} query  Query object to search a character on.
     * @return {Promise}       A promise for the result of the question (true|false)
     */
    value: function(query)
    {
      return new Promise(function(resolve, reject)
      {
        Character.find(query).exec(function(error, result)
        {
          if (error)
          {
            reject(error);
          }
          else
          {
            resolve(result.length > 0);
          }
        });
      });
    }
  },
  getCharacterByQuery:
  {
    /**
     * Attempts to retrived the character by a query.
     * 
     * @param  {Object} query  The query object to search a character on.
     * @return {Promise}       A promise for the result of the character.
     */
    value: function(query)
    {
      return new Promise(function(resolve, reject)
      {
        /* Finding the character and populating all its characters */
        Character.findOne(query).exec(function(error, result)
        {
          if (error)
          {
            reject(error);
            console.log(error);
          }
          else
          {
            resolve(result);
          }
        });
      });
    }
  },
  getCharacterById:
  {
    /**
     * Retrives the character based on the character ID.
     * 
     * @param  {String} id The character's ID
     * @return {Promise}   Promise of the character
     */
    value: function(id)
    {
      return this.getCharacterByQuery(
      {
        id: id
      });
    }
  }
});
