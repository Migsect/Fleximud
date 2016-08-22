"use strict";

var Accounts = require("../model/Account");
var Util = require("../Util");

var accountGrabber = function(request, response, next)
{
  var session = request.session;
  var accountId = session.account;
  Accounts.getAccountById(accountId).then(function(account)
  {
    if (Util.isNull(account))
    {
      switch (request.method)
      {
        case "GET":
          response.redirect("/");
          break;
        case "POST":
          response.status(403).send("Invalid account credentials.");
          break;
      }
      return;
    }

    request.account = account;
    next();
  });
};

module.exports = accountGrabber;
