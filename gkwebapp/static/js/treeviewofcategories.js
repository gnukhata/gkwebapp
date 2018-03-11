/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
  This file is part of GNUKhata:A modular,robust and Free Accounting System.

  GNUKhata is Free Software; you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation; either version 3 of
  the License, or (at your option) any later version.and old.stockflag = 's'

  GNUKhata is distributed in the hope that it will be useful, but
  WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License along with GNUKhata (COPYING); if not, write to the
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
  Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


Contributors:
"Krishnakant Mane" <kk@gmail.com>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
"Vaibhav Kurhe" <vaibspidy@openmailbox.org>
*/
/*
This script is for the tree view of categories.
*/

$(document).ready(function() {
     //For redirecting to the homepage
    $("#backbutton").click(function(event) {
	location.reload();
    });
  $("#tvtoloc").click(function(event) {
    $.ajax({
      type: "POST",
      url: "/category?action=list",
      global: false,
      async: false,
      datatype: "text/html",
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    })
    .done(function(resp) {
      $("#info").html(resp);
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  });
  $("#messagespan").append('Tree View of Categories'+'There are '+$(".list-group").length+' categories. They are ');
  $(".categoryname").each(function() {
    var categoryname = $(this).html();
    $("#messagespan").append(categoryname);
  });
  $(".topparent").first().focus();
  $(document).off("click",".topparent").on("click", ".topparent", function(event){
    event.preventDefault();
    var indextp = $(".topparent").index(this);
    var categorycode = $(".topparent").eq(indextp).next(".categorycode").val();
    if ($(this).closest("li").children().length > 2) {
      $(this).children(".glyphicon-triangle-bottom").toggle();
      $(this).children(".glyphicon-triangle-right").toggle();
      $(this).attr('aria-expanded', 'false');
      $(this).blur();
      $(".topparent").eq(indextp).focus();
      $(this).closest("li").children("li").toggle();
    }
    else {
      if ($(this).children(".badge").text()!="0") {
        $(this).attr('aria-expanded', 'true');
        $(this).blur();
        $(".topparent").eq(indextp).focus();
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
            $(".topparent").eq(indextp).parent("li").append('<li class="list-group-item list-group-item-primary" style="margin-left:20px;"><a href="" class="topparent list-group-item list-group-item-primary" aria-expanded="false"><span class="glyphicon glyphicon-triangle-right"></span><span class="glyphicon glyphicon-triangle-bottom" style="display: none;"></span>'+childrenofparent[i].categoryname+'<span class="sr-only">has</span><span class="badge">'+childrenofparent[i].subcount+'</span><span class="sr-only"> sub-categories</span></a><input type="text" class="categorycode" name="name" value='+childrenofparent[i].categorycode+' hidden></li>');
          }
        });
      }
    }
  });
});
