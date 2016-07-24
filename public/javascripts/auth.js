$(document).ready(function()
{
    $(document).mouseup(function(e)
    {
        var $createAccountWindow = $("#createAccountWindow");

        if (!$createAccountWindow.is(e.target) && $createAccountWindow.has(e.target).length === 0)
        {
            $createAccountWindow.hide();
        }

        var $loginWindow = $("#loginWindow");

        if (!$loginWindow.is(e.target) && $loginWindow.has(e.target).length === 0)
        {
            $loginWindow.hide();
        }
    });
    $('#toggleCreateAccount').click(function()
    {
        if ($('#createAccountWindow').is(":visible"))
        {
            $('#loginWindow').hide();
        } else
        {
            $('#createAccountWindow').show();
        }
    });
    $('#toggleLogin').click(function()
    {
        if ($('#loginWindow').is(":visible"))
        {
            $('#loginWindow').hide();
        } else
        {
            $('#loginWindow').show();
        }
    });
    $('#loginInputs input').keypress(function(e)
    {
        if (e.keyCode == 13) $('#loginAccount').click();
    });
    $("#loginAccount").click(function()
    {
        var $message = $("#loginMessage");
        $message.empty();
        $message.hide(100);

        var invalid = false

        var $email = $("#loginEmail");
        $email.removeClass("error");
        var $pass = $("#loginPass");
        $pass.removeClass("error");

        var email = $email.val();
        var pass = $pass.val();
        if (email.length < 6)
        {
            invalid = true;
            $email.addClass("error");
            $message.append("Username is too short.<br>");
        }
        if (pass.length < 6)
        {
            invalid = true;
            $pass.addClass("error");
            $message.append("Password is too short.<br>");
        }
        if (invalid == true)
        {
            $message.show(100);
            return;
        }

        $.post("/auth/login",
        {
            email : email,
            pass : pass
        }, function(response)
        {
            var message = response.message;
            console.log("Response :", response);
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
        });
    });
    $('#createAccountInputs input').keypress(function(e)
    {
        if (e.keyCode == 13) $('#createAccount').click();
    });
    $("#createAccount").click(function()
    {
        var $message = $("#createMessage");
        $message.empty();
        $message.hide(100);

        var invalid = false

        var $name = $("#createName");
        $name.removeClass("error");
        var $email = $("#createEmail");
        $email.removeClass("error");
        var $pass = $("#createPass");
        $pass.removeClass("error");
        var $passRedo = $("#createPassRedo");
        $passRedo.removeClass("error");

        var name = $name.val();
        var email = $email.val();
        var pass = $pass.val();
        var passRedo = $passRedo.val();
        if (name.length < 6)
        {
            invalid = true;
            $name.addClass("error");
            $message.append("Username is too short.<br>");
        }
        if (email.length < 3)
        {
            invalid = true;
            $email.addClass("error");
            $message.append("Email is too short.<br>");
        }
        if (pass != passRedo)
        {
            invalid = true;
            $pass.addClass("error");
            $passRedo.addClass("error");
            $message.append("Passwords do not match<br>");
        } else if (pass.length < 6)
        {
            invalid = true;
            $pass.addClass("error");
            $passRedo.addClass("error");
            $message.append("Password is too short.<br>");
        }

        if (invalid == true)
        {
            $message.show(100);
            return;
        }

        $.post("/auth/create",
        {
            name : name,
            email : email,
            pass : pass
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
            console.log()
            window.location.replace("/account");
        });
    });
});