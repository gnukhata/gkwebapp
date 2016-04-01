$(document).ready(function(){
  $('#createuser').click( function (e) {
    $("#info").load("/showuser",setTimeout( function() { $("#name").focus(); }, 500 ));
  });
});
