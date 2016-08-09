"use strict";

var Util = require(process.cwd() + "/modules/Util");
var Fuzzy = Util.Fuzzy;
var Classification = require("./Classification");
var templates = require(process.cwd() + "/templates/templates");

var speciesJSON = require(process.cwd() + '/config/species.json');

/**
 * A species generally includes different sexes a character can have as well as races.
 * 
 * @param {[type]} json [description]
 */
var Species = function(json)
{
  Classification.call(this, json);
  console.log("Created new species with id '" + this.id + "'");

  /* Getting all the sexes */
  this.sexes = (function()
  {
    var sexMap = new Map();
    json.sexes.forEach(function(sexJSON)
    {
      var sex = new Classification(sexJSON);
      sexMap.set(sex.id, sex);
    });
    return sexMap;
  })();

  /* Getting all the subspcies */
  this.subspecies = (function()
  {
    var subspeciesMap = new Map();
    if (json.subspecies)
    {
      json.subspecies.forEach(function(speciesJSON)
      {
        var species = new Species(speciesJSON);
        subspeciesMap.set(species.id, species);
      });
    }
    return subspeciesMap;
  });
};

Species.prototype = Object.create(Classification.prototype);
Species.prototype.constructor = Species;

Species.prototype.getInfoHTML = function()
{
  var template = templates("characterCreation/classification/speciesInfo");
  return template(
  {
    species: this,
    sexInfos: this.getSexes().map(function(sex)
    {
      return sex.getInfoHTML();
    }).join("")
  });
};

Species.prototype.getItemHTML = function()
{
  var template = templates("characterCreation/classification/speciesItem");
  return template(
  {
    species: this,
    sexItems: this.getSexes().map(function(sex)
    {
      return sex.getItemHTML();
    }).join("")
  });
};

Species.prototype.getDescriptorHTML = function()
{
  var self = this;
  var template = templates("characterCreation/classification/speciesSexDescriptors");
  /* Returning the joined mapping of all the sexes */
  return this.getSexes().map(function(sex)
  {
    var x = {
      speciesId: self.id,
      sexId: sex.id,
      descriptors: self.getDescriptors(sex.id).map(function(descriptor)
      {
        return descriptor.getHTML();
      }).join("")
    };
    return template(x);
  }).join("");
};

Species.prototype.getDescriptor = function(id, sex)
{
  var descriptor = Classification.prototype.getDescriptor.call(id);
  var sexDescriptor = this.sexes.get(sex);
  if (descriptor)
  {
    return sexDescriptor ? descriptor.merge(sexDescriptor) : descriptor;
  }
  else
  {
    return sexDescriptor ? sexDescriptor : null;
  }
};
Species.prototype.getDescriptors = function(sex)
{
  var descriptors = Classification.prototype.getDescriptors.call(this);
  var sexDescriptors = this.sexes.get(sex).getDescriptors();
  /* Merging the sex descriptors into the normal descriptors */
  sexDescriptors.forEach(function(descriptor)
  {
    /* Finding the index */
    var foundIndex = descriptors.findIndex(function(target)
    {
      return target.id == descriptor.id;
    });
    if (foundIndex >= 0)
    {
      /* Merging if it already exists */
      descriptors[foundIndex] = descriptors[foundIndex].merge(descriptor);
    }
    else
    {
      /* Adding it if it doesn't exist*/
      descriptors.push(descriptor);
    }
  });
  return descriptors;

};
/**
 * Returns the max height of the species
 * @param  {String} sex The id of the sex toi get the height for
 * @return {Double}     The max height of the sex
 */
Species.prototype.getMaxHeight = function(sex)
{
  Util.assertNotNull(sex);
  var sexObj = this.sexes.get(sex);
  Util.assertNotNull(sexObj);

  return sexObj.height.center * (1 + sexObj.height.range);
};
/**
 * Returns the min height of the species
 * @param  {String} sex The id of the sex toi get the height for
 * @return {Double}     The min height of the sex
 */
Species.prototype.getMinHeight = function(sex)
{
  Util.assertNotNull(sex);
  var sexObj = this.sexes.get(sex);
  Util.assertNotNull(sexObj);

  return sexObj.height.center * (1 - sexObj.height.range);
};
/**
 * Returns the average height of the species
 * @param  {String} sex The id of the sex toi get the height for
 * @return {Double}     The max average height of the sex
 */
Species.prototype.getAverageHeight = function(sex)
{
  Util.assertNotNull(sex);
  var sexObj = this.sexes.get(sex);
  Util.assertNotNull(sexObj);

  return sexObj.height.center;
};
/**
 * Returns a list of all the sexes this species has.
 * @return {Array<Classification>} The sexes of this speciesa
 */
Species.prototype.getSexes = function()
{
  var list = [];
  this.sexes.forEach(function(sex)
  {
    list.push(sex);
  });
  return list;
};
/**
 * Returns the core scalar for the specified stat.  This is before 
 * there is any normalization going on with the stats
 * @param  {String} attribute The attribute name to select
 * @param  {String} sex       The string name of the sex to select
 * @return {Double}           The attributes scalar
 */
Species.prototype.getAttributeScalar = function(attribute, sex)
{
  Util.assertNotNull(attribute, sex);
  var sexObj = this.sexes.get(sex);
  Util.assertNotNull(sexObj);

  var speciesMod = this.attributes.find(function(attributeJSON)
  {
    return attribute === attributeJSON.id;
  });
  /* get the default if we didn't find a specific one */
  if (!speciesMod)
  {
    speciesMod = this.attributes.find(function(attributeJSON)
    {
      return "default" === attributeJSON.id;
    });
  }
  var speciesFuzzy = new Fuzzy(speciesMod ? speciesMod.center : 1, speciesMod ? speciesMod.range : 0);

  var sex = this.sexes.get(sex);
  var sexMod = sex.attributes.find(function(attributeJSON)
  {
    return attribute === attributeJSON.id;
  });

  var sexFuzzy = new Fuzzy(sexMod ? sexMod.center : 1, sexMod ? sexMod.range : 0);

  return speciesFuzzy.mulitply(sexFuzzy);
};
/**
 * Returns the full attribute object (randomized) for this species.
 * This is generally used for creating characters
 * @param  {String} sex The sex of the character to get the adjusted Attributws for
 * @return {Attribute}     The resulting Object of attributes
 */
Species.prototype.getAdjustingAttributes = function(sex)
{
  Util.assertNotNull(sex);
  var sexObj = this.sexes.get(sex);
  Util.assertNotNull(sexObj);

  var attributes = this.attributes.map(function(attribute)
  {
    return attribute.id;
  }).filter(function(str)
  {
    return str !== "default";
  });

  sexObj.attributes.forEach(function(attribute)
  {
    if (!attributes.some(function(str)
      {
        return attribute.id === str;
      }))
    {
      attributes.push(attribute.id);
    }
  });

  return attributes;
};

/* Setting up the lists of species */
var speciesList = speciesJSON.map(function(json)
{
  return new Species(json);
});
/* Setting up the species map */
var speciesMap = new Map();
speciesList.forEach(function(species)
{
  speciesMap.set(species.id, species);
});

module.exports = {
  /**
   * A list of all the species
   */
  list: speciesList,
  /**
   * A map of all the species with their ids as keys
   */
  map: speciesMap,
  /**
   * Scales (and mutates) the attributes of the character to fit their sex and species.
   * 
   * @param character
   *            The character to have their attributes transformed (scaled) by the species. This is a slighly random
   *            scaling and should only occur once. This does not normalize the stats.
   */
  scaleAttributes: function(character) {

  }
};
