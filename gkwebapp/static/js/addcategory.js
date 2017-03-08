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
*/

// This script is for the add category page

$(document).ready(function() {
  $('.modal-backdrop').remove();


  if ($("#catcount").val()==0)
  {
      $("#new_parent_name").focus();
  }
  else
  {
      $("#category_under").focus();
  }


  $("#category_under").keydown(function(event) {

    if (event.which==13) {
        event.preventDefault();
        $("#child_category_name").focus();
    //    $("#category_name").select();
    }

     if (event.which==32)
    {
      event.preventDefault();
      $("#oldparentdiv").hide();
      $("#new_parent_div1").show();

      $("#new_parent_name").focus();
    }

  });
});
$("#child_category_name").keydown(function(event) {

  if (event.which==13) {
      event.preventDefault();
      $("#child_spec").focus();
    }
  });




$("#child_spec").click(function() {
 $.ajax(
 {
 type: "POST",
 url: "/category?type=addspecspopup",
 global: false,
 async: false,
 datatype: "text/html",
 beforeSend: function(xhr)
   {
     xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
   },
 success: function(resp)
 {

	     $("#addspecspopup").html("");
	     $('.modal-backdrop').remove();

       $('.modal').modal('hide');

       $("#addspecspopup").html(resp);

       $('#addspecmodal').modal('show');
       console.log("success rohini");
       $('#addspecmodal').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
       {
         //$("#godownname").focus();
       });

}
 });
});


$("#child_tax").click(function() {
 $.ajax(
 {
 type: "POST",
 url: "/category?type=addtaxpopup",
 global: false,
 async: false,
 datatype: "text/html",
 beforeSend: function(xhr)
   {
     xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
   },
 success: function(resp)
 {

	     $("#addtaxpopup").html("");
	     $('.modal-backdrop').remove();

       $('.modal').modal('hide');

       $("#addtaxpopup").html(resp);

       $('#addtaxmodal').modal('show');
       console.log("success rohini");
       $('#addtaxmodal').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
       {

       });

}
 });
});



$("#parent_spec").click(function() {
 $.ajax(
 {
 type: "POST",
 url: "/category?type=addspecspopup",
 global: false,
 async: false,
 datatype: "text/html",
 beforeSend: function(xhr)
   {
     xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
   },
 success: function(resp)
 {

	     $("#addspecspopup").html("");
	     $('.modal-backdrop').remove();

       $('.modal').modal('hide');

       $("#addspecspopup").html(resp);

       $('#addspecmodal').modal('show');
       console.log("success rohini");
       $('#addspecmodal').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
       {
         //$("#godownname").focus();
       });

}
 });
});


$("#parent_tax").click(function() {
 $.ajax(
 {
 type: "POST",
 url: "/category?type=addtaxpopup",
 global: false,
 async: false,
 datatype: "text/html",
 beforeSend: function(xhr)
   {
     xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
   },
 success: function(resp)
 {

	     $("#addtaxpopup").html("");
	     $('.modal-backdrop').remove();

       $('.modal').modal('hide');

       $("#addtaxpopup").html(resp);

       $('#addtaxmodal').modal('show');
       console.log("success rohini");
       $('#addtaxmodal').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
       {

       });

}
 });
});
