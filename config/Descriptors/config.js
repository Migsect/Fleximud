"use strict";

module.exports = [
{
    id: "eye_color",
    format: "variation",
    name: "Eye Color",
    transforms: []
},
{
    id: "hair_color",
    format: "variation",
    name: "Hair Color",
    transforms: []
},
{
    id: "skin_color",
    format: "variation",
    name: "Skin Color",
    transforms: []
},
{
    id: "body_type",
    format: "variation",
    name: "Body Type",
    transforms: []
},
{
    id: "height",
    format: "range",
    name: "Height",
    unit: "Feet",
    base: 6,
    transforms: [
    {
        target: "agility",
        transform: function(value, source)
        {
            var height = source.stats.getStat(source, "height");
            return value * Math.pow(1.25, (module.exports.baseSize / height) - 1);
        }
    },
    {
        target: "strength",
        transform: function(value, source)
        {
            var height = source.stats.getStat(source, "height");
            return value * Math.pow(1.25, (height / module.exports.baseSize) - 1);
        }
    },
    {
        target: "stamina",
        transform: function(value, source)
        {
            var height = source.stats.getStat(source, "height");
            return value * Math.pow(1.05, (module.exports.baseSize / height) - 1);
        }
    }]
}];
