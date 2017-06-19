"use strict";

module.exports = {
    help: "Placing points into attributes makes the character stronger in those attributes, but at a cost to all other attributes in that same level.  Each additional point placed into an attribute will make the next point cost more.  Placing points into Totality changes nothing for your character.",
    types: [
    {
        name: "Might",
        id: "might",
        tag: "MIGHT",
        children: [],
        color: "#FF4900",
        help: "",
        transforms: [
        {
            target: "stamina_efficiency",
            transform: function(value, character)
            {
                return value + (character.getStat("might") - 1);
            }
        }]
    },
    {
        name: "Tolerance",
        id: "tolerance",
        tag: "TOLER",
        children: [],
        color: "#E40045",
        transforms: [
        {
            target: "health_efficiency",
            transform: function(value, character)
            {
                return value + (character.getStat("tolerance") - 1);
            }
        }]
    },
    {
        name: "Strength",
        id: "strength",
        tag: "STRE",
        children: ["might", "tolerance"],
        color: "#FF0000",
        transforms: []
    },
    {
        name: "Dexterity",
        id: "dexterity",
        tag: "DEXTR",
        color: "#FF9200"
    },
    {
        name: "Quickness",
        id: "quickness",
        tag: "QUICK",
        color: "#FFBF00",
        transforms: [
        {
            target: "stamina_regen",
            transform: function(value, character)
            {
                return value + Math.ceil(5 * character.getStat("quickness"));
            }
        }]
    },
    {
        name: "Agility",
        id: "agility",
        tag: "AGIL",
        children: ["quickness", "dexterity"],
        color: "#FFAA00",
        transforms: [
        {
            target: "spirit_efficiency",
            transform: function(value, character)
            {
                return value + (character.getStat("agility") - 1);
            }
        }]
    },
    {
        name: "Stamina",
        id: "stamina",
        tag: "STAMI",
        color: "#FF9200",
        transforms: [
        {
            target: "stamina_max",
            transform: function(value, character)
            {
                return value + Math.ceil(100 * character.getStat("stamina"));
            }
        }]
    },
    {
        name: "resilience",
        id: "resilience",
        tag: "RESIL",
        color: "#FF4900",
        transforms: [
        {
            target: "health_regen",
            transform: function(value, character)
            {
                return value + Math.ceil(2 * character.getStat("resilience"));
            }
        }]
    },
    {
        name: "Constitution",
        id: "constitution",
        tag: "CONS",
        children: ["stamina", "resilience"],
        color: "#FF7400",
        transforms: [
        {
            target: "spirit_max",
            transform: function(value, character)
            {
                return value + Math.ceil(100 * character.getStat("constitution"));
            }
        }]
    },
    {
        name: "Perception",
        id: "perception",
        tag: "PERCE",
        color: "#FFE800"
    },
    {
        name: "Coordination",
        id: "coordination",
        tag: "COORD",
        color: "#FFE800"
    },
    {
        name: "Sense",
        id: "sense",
        tag: "SENS",
        color: "#FFD300",
        children: ["perception", "coordination"],
        transforms: [
        {
            target: "spirit_regen",
            transform: function(value, character)
            {
                return value + Math.ceil(5 * character.getStat("sense"));
            }
        }]
    },
    {
        name: "Body",
        id: "body",
        tag: "BOD",
        color: "#FF5313",
        children: ["strength", "agility", "constitution", "sense"],
        transforms: [
        {
            target: "health_max",
            transform: function(value, character)
            {
                return value + Math.ceil(100 * character.getStat("body"));
            }
        }]
    },
    {
        name: "Intuition",
        id: "intuition",
        tag: "INTUI",
        color: "#0877C6",
        transforms: []
    },
    {
        name: "Processing",
        id: "processing",
        tag: "PROCE",
        color: "#1318C",
        transforms: [
        {
            target: "focus_regen",
            transform: function(value, character)
            {
                return value + Math.ceil(10 * character.getStat("processing"));
            }
        }]
    },
    {
        name: "Intelligence",
        id: "intelligence",
        tag: "INTE",
        children: ["processing", "intuition"],
        color: "#0D49CA",
        transforms: [
        {
            target: "mana_max",
            transform: function(value, character)
            {
                return value + Math.ceil(100 * character.getStat("intelligence"));
            }
        }]
    },
    {
        name: "Memory",
        id: "memory",
        tag: "MEMOR",
        color: "#1318CF",
        transforms: [
        {
            target: "focus_efficiency",
            transform: function(value, character)
            {
                return value + (character.getStat("memory") - 1);
            }
        }]
    },
    {
        name: "Instincts",
        id: "instincts",
        tag: "INSTI",
        color: "#5C0BCC",
        transforms: [
        {
            target: "willpower_efficiency",
            transform: function(value, character)
            {
                return character.getStat("instincts") - 1;
            }
        }]
    },
    {
        name: "Knowledge",
        id: "knowledge",
        tag: "KNOW",
        children: ["memory", "instincts"],
        color: "#390FCE"
    },
    {
        name: "Charm",
        id: "charm",
        tag: "CHARM",
        color: "#EE004C"
    },
    {
        name: "Sociability",
        id: "sociability",
        tag: "SOCIA",
        color: "#C201C9"
    },
    {
        name: "Charisma",
        id: "charisma",
        tag: "CHAR",
        children: ["sociability", "charm"],
        color: "#DF0082",
        transforms: [
        {
            target: "mana_efficiency",
            transform: function(value, character)
            {
                return value + (character.getStat("charisma") - 1);
            }
        }]
    },
    {
        name: "Lucidity",
        id: "lucidity",
        tag: "LUCID",
        color: "#5B0BCC",
        transforms: [
        {
            target: "willpower_regen",
            transform: function(value, character)
            {
                return value + Math.ceil(2 * character.getStat("lucidity"));
            }
        }]
    },
    {
        name: "Focus",
        id: "focus",
        tag: "FOCUS",
        color: "#C101C7",
        transforms: [
        {
            target: "focus_max",
            transform: function(value, character)
            {
                return value + Math.ceil(100 * character.getStat("focus"));
            }
        }]
    },
    {
        name: "Fortitude",
        id: "fortitude",
        tag: "FORT",
        children: ["focus", "lucidity"],
        color: "#8207CA",
        transforms: [
        {
            target: "mana_regen",
            transform: function(value, character)
            {
                return value + Math.ceil(5 * character.getStat("fortitude"));
            }
        }]
    },
    {
        name: "Mind",
        id: "mind",
        tag: "MIN",
        children: ["intelligence", "knowledge", "charisma", "fortitude"],
        color: "#0EB76A",
        transforms: [
        {
            target: "willpower_max",
            transform: function(value, character)
            {
                return value + Math.ceil(100 * character.getStat("mind"));
            }
        }]
    },
    {
        name: "Totality",
        id: "totality",
        tag: "TO",
        children: [
            "mind",
            "body"
        ],
        color: "#999999"
    }]
};
