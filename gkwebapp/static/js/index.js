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
// This script is for the first page of GNUKhata i.e index page.
$(document).ready(function(){;
$("#selectorg").load("/existingorg");
$("#createorg").load("/createorg");
  $(document).keydown(function(event) {
    // setting shortcut keys for menu items.
    if(event.ctrlKey && event.keyCode == 69) {
      $("#selectnav").click();
      setTimeout( function() { $("select:first, input:first").focus(); }, 500 );

      event.preventDefault();
      }
    if(event.ctrlKey && event.keyCode == 82) {
      $("#createnav").click();
      setTimeout( function() { $("#orgname").focus(); }, 500 );

      event.preventDefault();
      }
    });

  $.ajax({// this ajax function checks whether any organisations already exists. If the number of organisations is 0 then select organisation tab is hidden.
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
  setTimeout( function() { $("select:first, input:first").focus(); }, 500 );// Set focus after a timeout of 500 milliseconds.
});

$("#createnav").click(function(event){
setTimeout( function() { $("#orgname").focus(); }, 500 );// Set focus after a timeout of 500 milliseconds.
});

$("#restorebutton").click(function(event){
  // Function to restore data from a backup file.
  // Gets the backup file and sends it as formdata.
  event.preventDefault();
  if ($("#openrecovery")[0].files.length > 0) {
    var form_data = new FormData();
    var files = $("#openrecovery")[0].files[0];
    form_data.append("file",files);
    $.ajax({
      type: "POST",
      url: "/recoveryfile",
      global: false,
      contentType: false,
      cache: false,
      processData: false,
      async: false,
      datatype: "json",
      data: form_data,
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(resp)
      {
        if(resp["gkstatus"] ==0){
          $("#recovery-success-alert").alert();
          $("#recovery-success-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#recovery-success-alert").hide();
            $("#restoredialog").hide();
            $(".modal-backdrop").remove();
            location.reload();
          });
        }
        if(resp["gkstatus"] ==5){
          $("#data-exist-alert").alert();
          $("#data-exist-alert").fadeTo(2500, 500).slideUp(500, function(){
            $("#data-exist-alert").hide();
          });
        }
        if(resp["gkstatus"] ==3) {
          $("#recovery-failure-alert").alert();
          $("#recovery-failure-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#recovery-failure-alert").hide();
          });
        }
      }
    });
  }
  else {
    $("#no-backup-alert").alert();
    $("#no-backup-alert").fadeTo(2500, 500).slideUp(500, function(){
      $("#no-backup-alert").hide();
    });
  }
});
  return;
});
