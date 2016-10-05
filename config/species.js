"use strict";

module.exports = [
{
  id: "human",
  name:
  {
    singular: "Human",
    plural: "Humans"
  },
  attributes: [
  {
    id: "default",
    center: 1.0,
    range: 0.1
  }],
  documentation: "humans.html",
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
    attributes: [
    {
      id: "processing",
      center: 1.1,
      range: 0.1
    },
    {
      id: "strength",
      center: 1.1,
      range: 0.1
    }],
    descriptors: [
    {
      id: "height",
      name: "Height",
      center: 1.1,
      range: 0.05
    }]
  },
  {
    id: "female",
    name: "female",
    attributes: [
    {
      id: "instincts",
      center: 1.1,
      range: 0.1
    },
    {
      id: "charisma",
      center: 1.1,
      range: 0.1
    }],
    descriptors: [
    {
      id: "height",
      name: "Height",
      center: 1,
      range: 0.05
    }]
  }]
}];
