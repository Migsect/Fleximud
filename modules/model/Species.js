var Util = require('../Util');
var Fuzzy = Util.Fuzzy;

var speciesJSON = require('../../config/species.json');

var Species = function(json)
{
    this.id = json.id;
    console.log("Created new species with id '" + this.id + "'");
    this.name = json.name;
    this.attributes = json.attributes;
    this.sexes = (function()
    {
        var sexMap = new Map();
        json.sexes.forEach(function(sexJSON)
        {
            sexMap.set(sexJSON.id, sexJSON);
        });
        return sexMap;
    })();
};

Species.prototype =
{
    getSexes : function()
    {
        var list = [];
        this.sexes.forEach(function(sex)
        {
            list.push(sex);
        });
        return list;
    },
    getMaxHeight : function(sex)
    {
        Util.assertNotNull(sex);
        var sexObj = this.sexes.get(sex);
        Util.assertNotNull(sexObj);

        return sexObj.height.center * (1 + sexObj.height.range);
    },
    getMinHeight : function(sex)
    {
        Util.assertNotNull(sex);
        var sexObj = this.sexes.get(sex);
        Util.assertNotNull(sexObj);

        return sexObj.height.center * (1 - sexObj.height.range);
    },
    getAverageHeight : function(sex)
    {
        Util.assertNotNull(sex);
        var sexObj = this.sexes.get(sex);
        Util.assertNotNull(sexObj);

        return sexObj.height.center;
    },
    /* Gets the core scalar */
    getAttributeScalar : function(attribute, sex)
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
    },
    getAdjustingAttributes : function(sex)
    {
        Util.assertNotNull(sex);
        var sexObj = this.sexes.get(sex);
        Util.assertNotNull(sexObj);

        var attributes = this.attributes.map(function(attribute)
        {
            return attribute.id;
        }).filter(function(str)
        {
            return str !== "default"
        });

        sexObj.attributes.forEach(function(attribute)
        {
            if (!attributes.some(function(str)
            {
                return attribute.id === str;
            }))
            {
                attributes.push(attribute.id)
            }
        })

        return attributes;
    }
};

/* Setting up the lists of species */
var speciesList = speciesJSON.map(function(json)
{
    return new Species(json)
});
var speciesMap = new Map();
speciesList.forEach(function(species)
{
    speciesMap.set(species.id, species)
});

var test = speciesList[0];

module.exports =
{
    /**
     * A list of all the species
     */
    list : speciesList,
    /**
     * A map of all the species with their ids as keys
     */
    map : speciesMap,
    /**
     * Scales (and mutates) the attributes of the character to fit their sex and species.
     * 
     * @param character
     *            The character to have their attributes transformed (scaled) by the species. This is a slighly random
     *            scaling and should only occur once. This does not normalize the stats.
     */
    scaleAttributes : function(character)
    {

    }
};