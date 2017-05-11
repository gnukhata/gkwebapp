$/*
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
"Vanita Rajpurohit" <vanita.rajpurohit9819@gmail.com>
*/
/*
  This script is for the search category modal.
 */
$(document).ready(function() {

  $.ajax({
    url: '/category?type=countcategory',
    type: 'POST',
    global: false,
    async: false,
    dataType: 'json',
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
    }
  })
   .done(function(resp) {
     if(resp["categorycount"]==0){
       $("#nocategorycreated").show();
       $("#helptext").hide();
       $("#searchcategorypanel").hide();
     }
   })
   .fail(function() {
     console.log("error");
   })
   .always(function() {
     console.log("complete");
   });
  
  $(document).off('keydown', '.catsearch').on('keydown', '.catsearch', function(event) {
    /* Disable Enter keydown on category combo box. */
    if (event.which==13)
    {
      event.preventDefault();
    }
  });

$(document).off('keyup', '.catsearch').on('keyup', '.catsearch', function(event) {
  var rindex = $(this).closest('tr').index();
  if (event.which==13)
  {
    event.preventDefault();
    $("#catsearchtab tbody tr:eq("+rindex+") td:eq(2) button").click();
  }
});

$(document).off('change', '.catsearch').on('change', '.catsearch', function(event) {
  event.preventDefault();
  var rindex = $(this).closest('tr').index();
  catid = $("#catsearchtab tbody tr:eq("+rindex+") td:first-child select option:selected").attr('data-value');
  /* Get products of the selected category on change. */
  $.ajax({
    url: '/product?by=category',
    type: 'POST',
    dataType: 'json',
    data: {"categorycode": catid},
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
    }
  })
  .done(function(resp) {
    console.log("success");
    if (resp["gkstatus"]==0)
    {
      $("#catsearchtab tbody tr:eq("+rindex+") td:eq(1) select").empty();
      if (resp["gkresult"]==0)
      {
        $("#catsearchtab tbody tr:eq("+rindex+") td:eq(1) select").append('<option data-value="">No Products</option>');
      }
      else {

        for (prod of resp["gkresult"]) {
          $("#catsearchtab tbody tr:eq("+rindex+") td:eq(1) select").append('<option data-value="'+prod['productcode']+'">'+prod["productdesc"]+'</option>');
        }

      }
    }

  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });

});

$(document).off('keydown', '.catsearch').on('keydown', '.catsearch', function(event) {
  event.preventDefault();
  /* Navigation function
    Ctrl key and angle bracket keys are used to navigate between all elements in the row.
   */
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  if(event.which==190 && event.shiftKey)
  {
    $('#catsearchtab tbody tr:eq('+nextindex+') td:eq(0) select').focus();
  }
  else if (event.which==188 && event.shiftKey)
  {
    if(previndex>-1)
    {
      event.preventDefault();
      $('#catsearchtab tbody tr:eq('+previndex+') td:eq(0) select').focus();
    }

  }
  else if (event.which==188 && event.ctrlKey) {
    event.preventDefault();
    if (curindex==0) {
      event.preventDefault();
      $("#invoice_schedule").focus().select();
    }
    else {
      $('#catsearchtab tbody tr:eq('+previndex+') td:eq(1) select').focus().select();

    }


  }
  else if (event.which==190 && event.ctrlKey) {
    event.preventDefault();
    $('#catsearchtab tbody tr:eq('+curindex+') td:eq(1) select').focus().select();


  }
});

$(document).off('keydown', '.catprod').on('keydown', '.catprod', function(event) {
  event.preventDefault();
  /* Navigation function
    Ctrl key and angle bracket keys are used to navigate between all elements in the row.
   */

  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  if(event.which==190 && event.shiftKey)
  {
    $('#catsearchtab tbody tr:eq('+nextindex+') td:eq(1) select').focus();
  }
  else if (event.which==188 && event.shiftKey)
  {
    if(previndex>-1)
    {
      event.preventDefault();
      $('#catsearchtab tbody tr:eq('+previndex+') td:eq(1) select').focus();
    }

  }
  else if (event.which==188 && event.ctrlKey) {
    event.preventDefault();
    $('#catsearchtab tbody tr:eq('+curindex+') td:eq(0) select').focus().select();

  }
  else if (event.which==190 && event.ctrlKey) {
    event.preventDefault();
    $('#catsearchtab tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();


  }
});

$(document).off('click', '.showcat').on('click', '.showcat', function(event) {
  event.preventDefault();
  /* On click of show sub category button, the sub categories of the selected category are shown. */
  var rindex = $(this).closest('tr').index();
  var nextindex = rindex+1;
  var lastindex = $('#catsearchtab tbody tr:last-child').index();
  catid = $("#catsearchtab tbody tr:eq("+rindex+") td:first-child select option:selected").attr('data-value');
  if (catid =="")
  {
    $("#cat-blank-alert").alert();
    $("#cat-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#cat-blank-alert").hide();
    });
    $("#catsearchtab tbody tr:last-child td:first-child select").focus();
    return false;
  }
  $.ajax({
    url: '/catsearch?type=children',
    type: 'POST',
    datatype: 'json',
    data: {categorycode: catid},
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
    }
  })
  .done(function(resp) {

    if (resp["gkstatus"] == 0)
    {
      for (var i = nextindex; i < lastindex+1; i++)
      {
        // Remove all rows below the selected row.
        $("#catsearchtab tbody tr:eq("+nextindex+")").remove();
      };
      if (resp["gkresult"]=="")
      {
        $("#cat-blank-alert").alert();
        $("#cat-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#cat-blank-alert").hide();
        });
        $("#catsearchtab tbody tr:last-child td:first-child select").focus();
        return false;

      }
      // append sub categories of the selected category below the category row.
      $("#catsearchtab tbody").append('<tr>'+
      '<td class = "cols-md-6">'+
        '<select class = "form-control input-sm catsearch"  name = "categoryname" >'+
        '</select>'+
      '</td>'+
      '<td class = "cols-md-3">'+
      '<select class = "form-control input-sm catprod"  name = "categoryproduct" >'+
      '</select>'+
      '</td>'+
      '<td class = "cols-md-3">'+
      '<button id="sub-cat" class="btn-primary btn-sm showcat">Show Sub-Category</button>'+
      '</td>'+
      '</tr>');
      for (child of resp["gkresult"]) {
        $("#catsearchtab tbody tr:eq("+nextindex+") td:first-child select").append('<option data-value="'+child['categorycode']+'">'+child["categoryname"]+'('+child["subcount"]+')</option>')
      }
    };
    $("#catsearchtab tbody tr:last-child td:first-child select").focus();
    $("#catsearchtab tbody tr:last-child td:first-child select").change();
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });



});

});
