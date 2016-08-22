"use strict";

var $createAccountWindow = document.getElementById("createAccountWindow");
var $loginWindow = document.getElementById("loginWindow");

document.addEventListener("mouseup", function(event)
{
  var wasClicked = function(element)
  {
    if (element === event.target)
    {
      return true;
    }
    var descendants = Array.prototype.slice.call(element.querySelectorAll("*"), 0);
    return !descendants.every(function(item)
    {
      return item !== event.target;
    });
  };
  if (!wasClicked($createAccountWindow))
  {
    $createAccountWindow.classList.add("hidden");
  }

  if (!wasClicked($loginWindow))
  {
    $loginWindow.classList.add("hidden");
  }
});
var $toggleCreateAccount = document.getElementById("toggleCreateAccount");
if ($toggleCreateAccount)
{
  $toggleCreateAccount.addEventListener("click", function()
  {
    $createAccountWindow.classList.toggle("hidden");
  });
}

var $toggleLogin = document.getElementById("toggleLogin");
if ($toggleLogin)
{
  $toggleLogin.addEventListener("click", function()
  {
    $loginWindow.classList.toggle("hidden");
  });
}

/**
 * Sends a login to the server based on the current info in the inputs.
 */
var sendLogin = function()
{
  var $message = document.getElementById("loginMessage");
  $message.innerHTML = "";
  $message.classList.add("hidden");

  var invalid = false;

  var $email = document.getElementById("loginEmail");
  var $pass = document.getElementById("loginPass");
  $email.classList.remove("error");
  $pass.classList.remove("error");

  var email = $email.value;
  var pass = $pass.value;
  if (email.length < 6)
  {
    invalid = true;
    $email.classList.add("error");
    $message.innerHTML = "Username is too short.<br>";
  }
  if (pass.length < 6)
  {
    invalid = true;
    $pass.classList.add("error");
    $message.innerHTML = "Password is too short.<br>";
  }
  if (invalid)
  {
    $message.classList.remove("hidden");
    return;
  }

  var request = new XMLHttpRequest();
  request.open('POST', '/auth/login', true);
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8; charset=UTF-8');
  request.send(
    JSON.stringify(
    {
      email: email,
      pass: pass
    }));

  request.onload = function()
  {

    console.log("Status :", request.status);
    if (request.status >= 200 && request.status < 400)
    {
      var message = request.responseText;
      console.log("Response :", message);
      if (message == "badInfo")
      {
        $message.empty();
        $email.addClass("error");
        $pass.addClass("error");
        $message.append("Invalid Email or Password.<br>");
        $message.show(100);
        return;
      }
      /* Redirect to the account page if we were successful */
      window.location.replace("/account");
    }
    else
    {
      // error
    }
  };
  request.onerror = function()
  {
    // Connection error
  };

  // request.send();
};
Array.prototype.slice.call(document.querySelectorAll("#loginInputs input"), 0).forEach(function(element)
{
  element.addEventListener("keydown", function(e)
  {
    if (e.keyCode == 13)
    {
      sendLogin();
    }
  });
});
Array.prototype.slice.call(document.querySelector("#loginInputs input"));
document.getElementById("loginAccount").addEventListener("click", function()
{
  sendLogin();
});

var sendCreateAccount = function()
{
  var $message = document.getElementById("createMessage");
  $message.innerHTML = "";
  $message.classList.add("hidden");

  var invalid = false;

  var $name = document.getElementById("createName");
  var $email = document.getElementById("createEmail");
  var $pass = document.getElementById("createPass");
  var $passRedo = document.getElementById("createPassRedo");

  [$name, $email, $pass, $passRedo].forEach(function(element)
  {
    element.classList.remove("errror");
  });

  var name = $name.value;
  var email = $email.value;
  var pass = $pass.value;
  var passRedo = $passRedo.value;
  if (name.length < 6)
  {
    invalid = true;
    $name.classList.add("error");
    $message.innerHTML = "Username is too short.<br>";
  }
  if (email.length < 3)
  {
    invalid = true;
    $email.classList.add("error");
    $message.innerHTML = "Email is too short.<br>";
  }
  if (pass != passRedo)
  {
    invalid = true;
    $pass.classList.add("error");
    $passRedo.classList.add("error");
    $message.innerHTML = "Passwords do not match<br>";
  }
  else if (pass.length < 6)
  {
    invalid = true;
    $pass.addClass("error");
    $passRedo.addClass("error");
    $message.append("Password is too short.<br>");
  }

  if (invalid)
  {
    $message.classList.remove("hidden");
    return;
  }

  $.post("/auth/create",
  {
    name: name,
    email: email,
    pass: pass
  }, function(response)
  {
    var message = response.message;
    console.log("Response :", response);
    if (message == "nameTaken")
    {
      $message.empty();
      $email.addClass("error");
      $name.addClass("error");
      $message.append("Username or Email already taken.<br>");
      $message.show(100);
      return;
    }
    /* Redirect to the account page if we were successful */
    window.location.replace("/account");
  });

  var request = new XMLHttpRequest();
  request.open('POST', '/auth/create', true);
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8; charset=UTF-8');
  request.send(
    JSON.stringify(
    {
      name: name,
      email: email,
      pass: pass
    }));

  request.onload = function()
  {

    console.log("Status :", request.status);
    if (request.status >= 200 && request.status < 400)
    {
      var message = request.responseText;
      console.log("Response :", message);
      if (message == "badInfo")
      {
        $email.classList.add("error");
        $pass.classList.add("error");
        $passRedo.classList.add("error");
        $message.innerHTML = "Invalid Email or Password.<br>";
        $message.classList.remove("hidden");
        return;
      }
      /* Redirect to the account page if we were successful */
      window.location.replace("/account");
    }
    else
    {
      // error
    }
  };
  request.onerror = function()
  {
    // Connection error
  };

  // request.send();
};

Array.prototype.slice.call(document.querySelectorAll("#loginInputs input"), 0).forEach(function(element)
{
  element.addEventListener("keydown", function(e)
  {
    if (e.keyCode == 13)
    {
      sendCreateAccount();
    }
  });
});
document.getElementById("createAccount").addEventListener("click", function()
{
  sendCreateAccount();
});
