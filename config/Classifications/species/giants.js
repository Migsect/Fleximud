"use strict";

module.exports = {
  id: "giant",
  name:
  {
    singular: "Giant",
    plural: "Giantss"
  },
  attributes: [
  {
    id: "default",
    center: 1.0,
    range: 0.1
  }],
  descriptors: [
  {
    id: "eyeColor",
    name: "Eye Color",
    variations: ["green", "blue", "brown"]
  },
  {
    id: "skinColor",
    name: "Skin Color",
    variations: ["white", "light brown", "dark brown", "black"]
  },
  {
    id: "hairColor",
    name: "Hair Color",
    variations: ["blonde", "black", "red", "brown"]
  },
  {
    id: "bodyType",
    name: "Body Type",
    variations: ["ectomorph", "ecto-mesomorph", "mesomorph", "meso-endomorph", "endomorph"]
  }],
  documentation: "Giants are rather big.",
  slots: [
  {
    type: "head",
    value: 1
  },
  {
    type: "chest",
    value: 1
  },
  {
    type: "waist",
    value: 1
  },
  {
    type: "legs",
    value: 1
  },
  {
    type: "feet",
    value: 2
  },
  {
    type: "arms",
    value: 2
  },
  {
    type: "wrists",
    value: 2
  },
  {
    type: "hands",
    value: 2
  },
  {
    type: "back",
    value: 1
  }],
  sexes: [
  {
    id: "male",
    name: "male",
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
    }],
    attributes: [],
    descriptors: [
    {
      id: "height",
      center: 50,
      range: 10
    }]
  },
  {
    id: "female",
    name: "female",
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
    attributes: [],
    descriptors: [
    {
      id: "height",
      center: 45,
      range: 10
    }]
  }]
}
