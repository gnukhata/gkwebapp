$(document).ready(function() {
  $("#tvback").click(function(event) {
    $("#listofcategories").click();
  });
  $(document).off("click",".topparent").on("click", ".topparent", function(event){
    event.preventDefault();
    var indextp = $(".topparent").index(this);
    console.log($(".topparent").index(this));
    var categorycode = $(".topparent").eq(indextp).next(".categorycode").val();
    console.log(categorycode);
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
        $(".topparent").eq(indextp).parent("li").append('<li style="margin-left:20px;"><a href="" class="topparent"><span class="glyphicon glyphicon-triangle-right"></span>'+childrenofparent[i].categoryname+'</a><input type="text" class="categorycode" name="name" value='+childrenofparent[i].categorycode+' hidden></li>');
      }
    });
  });
});
