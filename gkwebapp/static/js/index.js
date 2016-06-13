$(document).ready(function(){

  $(document).keydown(function(event) {
    if(event.ctrlKey && event.keyCode == 69) {
      $("#selectnav").click();
      /*console.log("Hey! Ctrl+S event captured!");*/
      event.preventDefault();
      }
    if(event.ctrlKey && event.keyCode == 82) {
      $("#createnav").click();
      $("#createorg").load("/createorg",setTimeout( function() { $("#orgname").focus(); }, 500 ));
      /*console.log("Hey! Ctrl+S event captured!");*/
      event.preventDefault();
      }
    });

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
