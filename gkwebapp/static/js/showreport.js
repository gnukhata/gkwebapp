$(document).ready(function(){

  var currentindex;
var rowcount;
var currentrow;

$(document).off('keydown' ,'#accountingrepdiv').on('keydown' ,'#accountingrepdiv',function(event) {
  if (event.altKey && event.shiftKey && event.keyCode == 40) {
    event.preventDefault();
    $('.accountingfocus').closest('div').removeClass('keyclass');
    $('#inventoryfocus:first').focus();
    $('#inventoryfocus:first').addClass('keyclass');
  }
});
  $(document).off('keydown' ,'.accountingfocus').on('keydown' ,'.accountingfocus',function(event) {
    event.preventDefault();
  currentrow = $(this).closest("div");
  currentindex = $(currentrow).index();
  rowcount =$(".accountingfocus").length-1;

    if (event.which == 13){
      $(this).closest("div").click();
    }
    if (event.which==40 && currentindex != rowcount)
    {
      event.preventDefault();
    $(currentrow).removeClass("keyclass");
    $(currentrow).next().find("a").focus(); 
    $(currentrow).next().addClass("keyclass");
    }
    else if (event.which==38  && currentindex != 0)
    {
      event.preventDefault();
      $(currentrow).removeClass("keyclass");
      $(currentrow).prev().find("a").focus(); 
      $(currentrow).prev().addClass("keyclass");
    }

  });

  // $(document).off('keydown' ,'#inventoryrepdiv').on('keydown' ,'#inventoryrepdiv',function(event) {
  //   if (event.altKey && event.shiftKey && event.keyCode == 40) {
  //     event.preventDefault();
  //     $('.accountingfocus').closest('div').removeClass('keyclass');
  //     $('.inventoryfocus:first').focus();
  //     $('.inventoryfocus:first').addClass('keyclass');
  //   }
  // });

    $(document).off('keydown' ,'.inventoryfocus').on('keydown' ,'.inventoryfocus',function(event) {
      event.preventDefault();
    currentrow = $(this).closest("div");
    currentindex = $(currentrow).index();
    rowcount =$(".inventoryfocus").length-1;
  
      if (event.which == 13){
        $(this).closest("div").click();
      }
      if (event.which==40 && currentindex != rowcount)
      {
        event.preventDefault();
      $(currentrow).removeClass("keyclass");
      $(currentrow).next().find("a").focus(); 
      $(currentrow).next().addClass("keyclass");
      }
      else if (event.which==38  && currentindex != 0)
      {
        event.preventDefault();
        $(currentrow).removeClass("keyclass");
        $(currentrow).prev().find("a").focus(); 
        $(currentrow).prev().addClass("keyclass");
      }
  
    });
});