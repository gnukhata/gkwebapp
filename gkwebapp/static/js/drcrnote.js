$(document).ready(function() {
    // This script is for base page of drcrnote.
    $("#creditnote_create").click(function() { // calls create credit note page.
	$.ajax(
	    {
		type: "POST",
		url: "/drcrnote?action=add",
		global: false,
		async: false,
		datatype: "text/html",
     		data: {"drcrflag": 3},
		datatype: "text/html",
		beforeSend: function(xhr){
		    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
		},
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
		datatype: "text/html",
		beforeSend: function(xhr){
		    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
		},
		success: function(resp)
		{
		    $("#drcrnote_div").html(resp);
		}
	    }
	);
    });
    $("#creditnote_view").click(function() { // calls view credit note page.
	console.log("Hello");
	$.ajax(
	    {
		type: "POST",
		url: "/drcrnote?action=showdrcrnote",
		global: false,
		async: false,
		datatype: "text/html",
		data: {"drcrflag": 3},
		beforeSend: function(xhr){
		    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
		},
		success: function(resp)
		{
		    console.log(resp);
		    $("#drcrnote_div").html("");
		    $("#viewdrcrdiv").html(resp);
		}
	    }
	);
    });
    $("#debitnote_view").click(function() { // calls view debit note page.
	$.ajax(
	    {
		type: "POST",
		url: "/drcrnote?action=showdrcrnote",
		global: false,
		async: false,
		datatype: "text/html",
		data: {"drcrflag": 4},
		beforeSend: function(xhr){
		    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
		},
		success: function(resp)
		{
		    $("#drcrnote_div").html("");
		    $("#viewdrcrdiv").html(resp);
		}
	    }
	);
    });
    $("#creditnote_create").click();
});
