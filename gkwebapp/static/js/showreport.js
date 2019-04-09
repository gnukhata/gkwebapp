$(document).ready(function(){

  var curindex ;
  var nextindex;
  var previndex;

  $(document).off('keydown' ,'.focuscls').on('keydown' ,'.focuscls',function(event) {
    event.preventDefault();
  currentrow = $(this).closest("div");
    curindex = $(this).closest('div').index();
    nextindex = curindex+1;
    previndex = curindex-1;

    if (event.which == 13){
      $(this).closest("div").click();
    }
    if (event.which==40)
    {
      event.preventDefault();
    $(currentrow).removeClass("keyclass");
    $(currentrow).next().find("a").focus(); 
    $(currentrow).next().addClass("keyclass");
    }
    else if (event.which==38)
    {
      event.preventDefault();
      $(currentrow).removeClass("keyclass");
      $(currentrow).prev().find("a").focus(); 
      $(currentrow).prev().addClass("keyclass");
    }

  });
});