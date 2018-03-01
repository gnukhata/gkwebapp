$(document).ready(function() {
    $("#creditnote_create").click();
    // This script is for base page of drcrnote.
    $("#creditnote_create").click(function() { // calls create credit note page.
	console.log("Hello");
	$.ajax(
	    {
		type: "POST",
		url: "/drcrnote?action=add",
		global: false,
		async: false,
		datatype: "text/html",
     		data: {"drcrflag": 3},
		success: function(resp)
		{
		    $("#drcrnote_div").html(resp);
		    
		}
	    }
	);
    });
    $("#debitnote_create").click(function() { // calls create debit note page.
	$.ajax(
	    {
		type: "POST",
		url: "/drcrnote?action=add",
		global: false,
		async: false,
		datatype: "text/html",
		data:{"drcrflag": 4},
		success: function(resp)
		{
		    $("#drcrnote_div").html(resp);
		}
	    }
	);
    });
    $("#creditnote_create").click();
});
