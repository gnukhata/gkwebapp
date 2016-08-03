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
"Dinesh Sutar" <dinesh.sutar@openmailbox.org>
*/

$(document).ready(function(){
$("#selectorg").load("/existingorg");
$("#createorg").load("/createorg");
  $(document).keydown(function(event) {
    if(event.ctrlKey && event.keyCode == 69) {
      $("#selectnav").click();
      setTimeout( function() { $("select:first, input:first").focus(); }, 500 );
      /*console.log("Hey! Ctrl+S event captured!");*/
      event.preventDefault();
      }
    if(event.ctrlKey && event.keyCode == 82) {
      $("#createnav").click();
      setTimeout( function() { $("#orgname").focus(); }, 500 );
      /*console.log("Hey! Ctrl+S event captured!");*/
      event.preventDefault();
      }
    });

  $.ajax({
    url: '/orgexists',
    type: 'POST',
    datatype: 'json',
  })
  .done(function(jsonobj) {
    var orgs = jsonobj["gkresult"]
    if (orgs==0) {
      $("#selectnav").hide();
      $("#createnav").click();
    }
    else {
      $("#selectnav").click();
    }
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });


  $("#selectnav").click(function(event){
  setTimeout( function() { $("select:first, input:first").focus(); }, 500 );
});

$("#createnav").click(function(event){
setTimeout( function() { $("#orgname").focus(); }, 500 );
});


  return;
});
