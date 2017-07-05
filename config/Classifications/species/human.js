"use strict";

module.exports = {
    id: "human",
    name: "Human",
    type: "species",
    attributes: [
    {
        id: "default",
        center: 1.0,
        range: 0.1
    }],
    documentation: "humans.hbs",
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
        attributes: [],
        descriptors: [
        {
            id: "height",
            center: 5.50,
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
        id: "northern",
        name: "Northern"
    },
    {
        type: "race",
        id: "central",
        name: "Central"
    },
    {
        type: "race",
        id: "southern",
        name: "Southern"
    }]
};
