"use strict";

var baseSize = 6;

module.exports = [
{
    id: "eye_color",
    type: "variation",
    creation: "color",
    name: "Eye Color",
    transforms: []
},
{
    id: "hair_color",
    type: "variation",
    creation: "color",
    name: "Hair Color",
    transforms: []
},
{
    id: "skin_color",
    type: "variation",
    creation: "color",
    name: "Skin Color",
    transforms: []
},
{
    id: "body_type",
    type: "variation",
    creation: "variation",
    name: "Body Type",
    transforms: []
},
{
    id: "height",
    type: "range",
    name: "Height",
    creation: "size",
    unit: "Feet",
    transforms: [
    {
        target: "agility",
        transform: function(value, source)
        {
            var height = source.stats.getStat(source, "height");
            return value * Math.pow(1.25, (baseSize / height) - 1);
        }
    },
    {
        target: "strength",
        transform: function(value, source)
        {
            var height = source.stats.getStat(source, "height");
            return value * Math.pow(1.25, (height / baseSize) - 1);
        }
    },
    {
        target: "stamina",
        transform: function(value, source)
        {
            var height = source.stats.getStat(source, "height");
            return value * Math.pow(1.05, (baseSize / height) - 1);
        }
    }]
}];
