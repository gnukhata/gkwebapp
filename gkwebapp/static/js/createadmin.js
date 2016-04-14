$(document).ready(function()
{

$("#loginform").submit(function(e)
{

    $.ajax(
    {
    //alert("starting ajax");
    type: "POST",
    url: "/createorglogin",
    global: false,
    async: false,
    datatype: "json",
    data: $("#loginform").serialize(),
    success: function(resp)
    {
    var gt = resp['gktoken'];

    sessionStorage.gktoken = gt;

    window.location= "/showmainshell";
    }

    }
    );

    e.preventDefault();
}
);
}
);
