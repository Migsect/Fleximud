"use strict";

module.exports = [
{
  name: "Health",
  id: "health",
  showBar: true,
  stats:
  {
    max: "health_max",
    current: "health_current",
    efficiency: "health_efficiency",
    regen: "health_regen"
  }
},
{
  name: "Energy",
  id: "energy",
  showBar: true,
  stats:
  {
    max: "energy_max",
    current: "energy_current",
    efficiency: "energy_efficiency",
    regen: "energy_regen"
  }
},
{
  name: "Willpower",
  id: "willpower",
  showBar: true,
  stats:
  {
    max: "willpower_max",
    current: "willpower_current",
    efficiency: "willpower_efficiency",
    regen: "willpower_regen"
  }
},
{
  id: "mana",
  showBar: true,
  stats:
  {
    name: "Mana",
    max: "mana_max",
    current: "mana_current",
    efficiency: "mana_efficiency",
    regen: "mana_regen"
  }
}];
