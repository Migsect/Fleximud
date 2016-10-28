"use strict";

var Util = require(process.cwd() + "/modules/Util");

var Gameloop = require("node-gameloop");
var PriorityQueue = require("priorityqueuejs");

var config = require(process.cwd() + "/config/general");

/**
 * Not actually a task but a combination of task and a 
 * scheduled time.
 *
 * @constructor
 * @param {Task} task The task to execute at the scheduled time.
 * @param {Number} scheduledTime The time to execute the task at.
 */
var ScheduledTask = function(task, scheduledTime)
{
  var self = this;
  Object.defineProperties(self,
  {
    scheduledTime:
    {
      value: scheduledTime,
      enumerable: true
    },
    task:
    {
      enumerable: true,
      value: task
    }
  });
};

/**
 * The scheduler is a loop that executes tasks either once or multiple times.
 * 
 * @constructor
 * @param {Number} tickRate The amount of ticks per second the scheduler runs at.
 */
var Scheduler = function(tickRate)
{
  Util.assertNotNull(tickRate);

  var self = this;
  Object.defineProperties(self,
  {
    tickRate:
    {
      /** @type {Number} The amount of ticks per second that should be performed */
      value: tickRate,
      enumerable: true
    },
    counter:
    {
      /** @type {Number} The current tick the server is on. */
      value: 0,
      writable: true,
      enumerable: true
    },
    taskQueue:
    {
      /** @type {PriorityQueue} The queue for all the tasks. */
      value: new PriorityQueue(function(a, b)
      {
        return a.scheduledTime - b.scheduledTime;
      }),
      enumerable: true
    },
    loopId:
    {
      /** @type {Number} The ID of the gameloop */
      value: -1,
      writable: true,
      enumerable: true
    }
  });
};

Object.defineProperties(Scheduler.prototype,
{
  schedule:
  {
    /**
     * Schedules the task to be executed instantly on the next tick.
     * @param  {Task} task The task to execute later.
     */
    value: function(task)
    {
      Util.assertNotNull(task);
      this.taskQueue.enq(new ScheduledTask(task, this.counter + 1));
    }
  },
  scheduleDelayed:
  {
    /**
     * [value description]
     * @param  {Task} task    The task to execute at the delay.
     * @param  {Number} delay The delay to execute the task at.
     */
    value: function(task, delay)
    {
      Util.assertNotNull(task);
      Util.assertNumber(delay);
      this.taskQueue.enq(new ScheduledTask(task, this.counter + delay));
    }
  },
  start:
  {
    /**
     * Starts the scheduler loop.
     */
    value: function()
    {
      if (this.loopId >= 0)
      {
        throw new Error("Attempted to start an already started scheduler.");
      }

      var self = this;
      self.loopId = Gameloop.setGameLoop(function()
      {
        /* If the queue is empty, then nothing needs to be done.*/
        if (self.taskQueue.isEmpty())
        {
          return;
        }

        /* While the top is able to be executed */
        while (!self.taskQueue.isEmpty() && self.taskQueue.peek().scheduledTime <= self.counter)
        {
          /* Removing the top task */
          var task = self.taskQueue.deq().task;
          task.execute();
          /* Rescheduling the task if it has a period greater than 0 */
          if (task.period > 0)
          {
            self.scheduleDelayed(task, task.period);
          }
        }

        /* Incrementing the tick at the end. */
        self.counter++;
      }, 1000 / self.tickRate);
    }
  },
  stop:
  {
    /**
     * Stops the scheduler loop.  Generally this doesn't ever need to be done.
     */
    value: function()
    {
      if (this.loopId < 0)
      {
        throw new Error("Attempted to stop an already stopped scheduler.");
      }
      Gameloop.clearGameLoop(this.loopId);

      /* Resetting the loop id */
      this.loopId = -1;
    }
  }
});

Object.defineProperties(module.exports,
{
  cons
tructor:
  {
    value: Scheduler
  },
  instance:
  {
    value: new Scheduler(Util.isNull(config.tickRate) ? 20 : config.tickRate)
  }
});
