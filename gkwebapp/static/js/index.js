$(document).ready(function(){
  $("#about").load("/about");
  $("#selectnav").click(function(event){
  $("#selectorg").load("/existingorg");
});
$("#createnav").click(function(event){
$("#createorg").load("/createorg");
});

  return;
});
