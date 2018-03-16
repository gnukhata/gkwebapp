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
	$.ajax(
	    {
		type: "POST",
		url: "/drcrnote?action=showdrcrnote&status=3",
		global: false,
		async: false,
		datatype: "text/html",
		beforeSend: function(xhr){
		    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
		},
		success: function(resp)
		{
		    $("#drcrload").html("");
		    $("#drcrload").html(resp);
		}
	    }
	);
    });
    $("#debitnote_view").click(function() { // calls view debit note page.
	$.ajax(
	    {
		type: "POST",
		url: "/drcrnote?action=showdrcrnote&status=4",
		global: false,
		async: false,
		datatype: "text/html",
		beforeSend: function(xhr){
		    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
		},
		success: function(resp)
		{
		    $("#drcrload").html("");
		    $("#drcrload").html(resp);
		}
	    }
	);
    });
    $("#creditnote_create").click();
});
