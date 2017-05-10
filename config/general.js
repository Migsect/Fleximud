"use strict";

module.exports = {
  database:
  {
    client: "sqlite3",
    connection:
    {
      filename: "./data/main.sqlite"
    },
    useNullAsDefault: true
  },
  logging:
  {
    level: "debug",
    fileLevel: "info"
  },
  sessions:
  {
    secret: "macro dogos",
    maxAge: 86400000
  },
  admin:
  {
    email: "radmin",
    username: "radmin",
    password: "radmin"
  },
  characterCreation:
  {
    maxAttributeChoices: 5,
    attributeChoiceMultiplier: 1.2,
    minimumLongNameLength: 6
  },
  tickRate: 20,
  stats:
  {
    attributeMidTier: 2,
    regenUpdateRate: 0.5
  }
};
