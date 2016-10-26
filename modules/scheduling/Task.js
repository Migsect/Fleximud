"use strict";

var Util = require(process.cwd() + "/modules/Util");

var Task = function(callback, period)
{
  Util.assertNotNull(callback);
  Util.assertFunction(callback);

  var self = this;
  Object.defineProperties(self,
  {
    callback:
    {
      /** @type {Function} The task's callback */
      value: callback
    },
    period:
    {
      /** @type {Number} The delay to reschedule after this executes */
      value: Util.isNull(period) || !Util.isNumber(period) ? -1 : period,
      enumerable: true
    }
  });
};

Object.defineProperties(Task.prototype,
{
  execute:
  {
    /**
     * Executes the task but does not neccessarily 
     * @return {[type]} [description]
     */
    value: function()
    {
      this.callback();
    }
  }
});

module.exports = Task;
