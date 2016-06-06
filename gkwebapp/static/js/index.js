$(document).ready(function(){

  $.ajax({
    url: '/orgexists',
    type: 'POST',
    datatype: 'json',
  })
  .done(function(jsonobj) {
    var orgs = jsonobj["gkresult"]
    if (orgs==0) {
      $("#selectnav").hide();
      $("#createnav").click();
    }
    else {
      $("#selectnav").click();
    }
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });


  $("#selectnav").click(function(event){
  $("#selectorg").load("/existingorg",setTimeout( function() { $("#org-name").focus(); }, 500 ));
});

$("#createnav").click(function(event){
$("#createorg").load("/createorg",setTimeout( function() { $("#orgname").focus(); }, 500 ));
});


  return;
});
