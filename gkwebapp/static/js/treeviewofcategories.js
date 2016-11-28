$(document).ready(function() {
  $("#tvback").click(function(event) {
    $("#listofcategories").click();
  });
  $(document).off("click",".topparent").on("click", ".topparent", function(event){
    event.preventDefault();
    var indextp = $(".topparent").index(this);
    var categorycode = $(".topparent").eq(indextp).next(".categorycode").val();
    if ($(this).closest("li").children().length > 2) {
      $(this).closest("li").children("li").toggle();
    }
    else {
      if ($(this).children(".badge").text()!="0") {
        $(this).children(".glyphicon-triangle-bottom").toggle();
        $(this).children(".glyphicon-triangle-right").toggle();
        $.ajax({
          url: '/category?action=treechildren',
          type: 'POST',
          global: false,
          async: false,
          datatype: 'json',
          data:{"categorycode":categorycode},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          }
        })
        .done(function(resp){
          var childrenofparent = resp["gkresult"];
          for (i in childrenofparent) {
            $(".topparent").eq(indextp).parent("li").append('<li class="list-group-item list-group-item-primary" style="margin-left:20px;"><a href="" class="topparent list-group-item list-group-item-primary"><span class="glyphicon glyphicon-triangle-right"></span><span class="glyphicon glyphicon-triangle-bottom" style="display: none;"></span>'+childrenofparent[i].categoryname+'<span class="badge">'+childrenofparent[i].subcount+'</span></a><input type="text" class="categorycode" name="name" value='+childrenofparent[i].categorycode+' hidden></li>');
          }
        });
      }
    }
  });
});
