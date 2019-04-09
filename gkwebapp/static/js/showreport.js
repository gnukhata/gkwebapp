$(document).ready(function(){

var currentindex;
var rowcount;
var currentrow;

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
  $(document).off('keydown' ,'#accountingrepdiv').on('keydown' ,'#accountingrepdiv',function(event) {
    if (event.altKey && event.shiftKey && event.keyCode == 40) {
      event.preventDefault();
      $('.accountingfocus').closest('div').removeClass('keyclass');
      $('.inventoryfocus:first').focus();
      $('.inventoryfocus:first').closest('div').addClass('keyclass');
    }
    
  });

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

  $(document).off('keydown' ,'#inventoryrepdiv').on('keydown' ,'#inventoryrepdiv',function(event) {
    if (event.altKey && event.shiftKey && event.keyCode == 40) {
      event.preventDefault();
      $('.inventoryfocus').closest('div').removeClass('keyclass');
      $('.documentfocus:first').focus();
      $('.documentfocus:first').closest('div').addClass('keyclass');
    }
    if (event.altKey && event.shiftKey && event.keyCode == 38) {
      event.preventDefault();
      $('.inventoryfocus').closest('div').removeClass('keyclass');
      $('.accountingfocus:first').focus();
      $('.accountingfocus:first').closest('div').addClass('keyclass');
    }
  });

      $(document).off('keydown' ,'.documentfocus').on('keydown' ,'.documentfocus',function(event) {
        event.preventDefault();
      currentrow = $(this).closest("div");
      currentindex = $(currentrow).index();
      rowcount =$(".documentfocus").length-1;
    
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

      $(document).off('keydown' ,'#documentsrepdiv').on('keydown' ,'#documentsrepdiv',function(event) {
        if (event.altKey && event.shiftKey && event.keyCode == 40) {
          event.preventDefault();
          $('.documentfocus').closest('div').removeClass('keyclass');
          $('.administrationfocus:first').focus();
          $('.administrationfocus:first').closest('div').addClass('keyclass');
        }
        if (event.altKey && event.shiftKey && event.keyCode == 38) {
          event.preventDefault();
          $('.documentfocus').closest('div').removeClass('keyclass');
          $('.inventoryfocus:first').focus();
          $('.inventoryfocus:first').closest('div').addClass('keyclass');
        }
      });
    $(document).off('keydown' ,'.administrationfocus').on('keydown' ,'.administrationfocus',function(event) {
        event.preventDefault();
      currentrow = $(this).closest("div");
      currentindex = $(currentrow).index();
      rowcount =$(".administrationfocus").length-1;
    
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

      $(document).off('keydown' ,'#administrationrepdiv').on('keydown' ,'#administrationrepdiv',function(event) {
        if (event.altKey && event.shiftKey && event.keyCode == 38) {
          event.preventDefault();
          $('.administrationfocus').closest('div').removeClass('keyclass');
          $('.documentfocus:first').focus();
          $('.documentfocus:first').closest('div').addClass('keyclass');
        }
      });
  
});