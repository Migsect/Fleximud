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
    documentation: "humans.html",
    descriptors: [
    {
        id: "eye_color",
        name: "Eye Color",
        variations: ["green", "blue", "brown"]
    },
    {
        id: "skin_color",
        variations: ["white", "light brown", "dark brown", "black"]
    },
    {
        id: "hair_color",
        name: "Hair Color",
        variations: ["blonde", "black", "red", "brown"]
    },
    {
        id: "body_type",
        name: "Body Type",
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
    }]
};
