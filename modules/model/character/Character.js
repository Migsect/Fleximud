"use strict";

class Character
{
  constructor(config)
  {
    const self = this;
    Object.defineProperties(self,
    {
      id:
      {
        value: config.id
      },
      accountId:
      {
        value: config.accountId
      },
      name:
      {
        value: config.name
      },
      nickName:
      {
        value: config.nickName
      },
      attributes:
      {
        value: config.attibutes
      },
      descriptors:
      {
        value: config.descriptors
      },
      species:
      {
        value: config.species
      },
      sex:
      {
        value: config.sex
      }
    });
  }
}

Object.defineProperties(module.exports,
{
  initializeDatabase:
  {
    value: function(connection) {

    }
  }
});
