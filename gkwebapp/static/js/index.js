$(document).ready(function(){
  $("#about").load("/about");
  $("#selectnav").click(function(event){
  $("#selectorg").load("/existingorg",setTimeout( function() { $("#org-name").focus(); }, 500 ));
});
$("#createnav").click(function(event){
$("#createorg").load("/createorg",setTimeout( function() { $("#orgname").focus(); }, 500 ));
});

  return;
});
