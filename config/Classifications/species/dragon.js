"use strict";
module.exports = {
    id: "dragon",
    name: "Dragon",
    type: "species",
    attributes: [
    {
        id: "default",
        center: 1.0,
        range: 0.1
    }],
    documentation: "dragons.hbs",
    descriptors: [
    {
        id: "eye_color",
        variations: ["green", "blue", "brown"]
    },
    {
        id: "skin_color",
        variations: ["white", "light brown", "dark brown", "black"]
    },
    {
        id: "hair_color",
        variations: ["blonde", "black", "red", "brown"]
    },
    {
        id: "body_type",
        variations: ["ectomorph", "ecto-mesomorph", "mesomorph", "meso-endomorph", "endomorph"]
    }],
    classifications: [
    {
        type: "sex",
        id: "male",
        name: "Male",
        documentation: "dragons-male.hbs",
        attributes: [],
        descriptors: [
        {
            id: "height",
            center: 5.75,
            range: 0.75
        }],
        transforms: [
        {
            target: "processing",
            transform: function(value)
            {
                return value * 1.1;
            }
        },
        {
            target: "strength",
            transform: function(value)
            {
                return value * 1.1;
            }
        }]
    },
    {
        type: "sex",
        id: "female",
        name: "Female",
        documentation: "dragons-female.hbs",
        attributes: [],
        descriptors: [
        {
            id: "height",
            center: 5.75,
            range: 0.75
        }],
        transforms: [
        {
            target: "instincts",
            transform: function(value)
            {
                return value * 1.1;
            }
        },
        {
            target: "charisma",
            transform: function(value)
            {
                return value * 1.1;
            }
        }],
    },
    {
        type: "race",
        id: "air",
        name: "Air"
    },
    {
        type: "race",
        id: "earth",
        name: "Earth"
    },
    {
        type: "race",
        id: "fire",
        name: "Fire"
    },
    {
        type: "race",
        id: "water",
        name: "Water"
    }]
};
