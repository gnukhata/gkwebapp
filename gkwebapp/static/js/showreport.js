$(document).ready(function(){

  $('#report_li').click(function(event) {
console.log("report click");
    $("#showviewledger").focus();
console.log("key event");
  $('.focuscls:first').closest('div').addClass('keyclass');
  
  });

});