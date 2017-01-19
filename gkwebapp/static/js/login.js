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
// This script is for login page.
$(document).ready(function()
{
  $("#login_username").focus();
  // Retrives organisation details from sessionstorage.
  var orname = sessionStorage.getItem('orgn');
  var ortype = sessionStorage.getItem('orgt');
  var styear = sessionStorage.getItem('year1');
  var enyear = sessionStorage.getItem('year2');
  var orgdata = orname + " (" + ortype + ")";
  var pathname = window.location.pathname;
  var yeardata = "Financial Year : " + styear + " to " + enyear;
  if(orgdata!=""||yeardata!="")
  {
  // displays organisation details in the status bar.
  $("#ticker").show();
  $("#welcome").hide();
  $("#orgdata").html(orgdata);
  $("#yeardata").html(yeardata);
  }
  if (pathname=="/showmainshell") {
  // if user just logged out then the div is set to col-md-6 size.
    $("#forgotpassworddiv").addClass('col-md-6');
    $("#welcome").show();
    $("#bootstrap").attr('href', '../static/css/Default.min.css');
  }
// Navigation functions.
  $('#login_username').keydown(function(e){
      if (e.which == 13)
      {
        e.preventDefault();
        $("#userpassword").focus();
        }
      });
  $("#userpassword").keydown(function(e) {
      if (e.which == 38)
      {
        e.preventDefault();
        $("#login_username").focus();

        }
  });
  $("#back").click(function(event){
  // loads select organisation page on back.
    event.preventDefault();
    $("#selectorg").load("/existingorg" );

  });

  $("#forgotpwdlink").click(function(event){
    //calls forgotpassword page and passes organisation code as data.
    event.preventDefault();
    var code = $("#orgcode").val();
    $("#selectorg").load("/forgotpassword?orgcode="+ code);
    $("#forgotpassworddiv").load("/forgotpassword?orgcode="+ code);
  });
  $("#changeorg").click(function(event){
    // loads first page of GNUKhata.
    event.preventDefault();
  window.location.replace("/");
  });


  $("#loginform").submit(function(e)
  {
    // submit fires when users clicks on login button.
    // username and password along with organisation code is passed as data.
    e.preventDefault();
    if ($.trim($("#login_username").val())=="") {
      $("#login_username-blank-alert").alert();
      $("#login_username-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#login_username-blank-alert").hide();
      });
      $("#login_username").focus();
      return false;
    }
      if ($.trim($("#userpassword").val())=="") {
        $("#password-blank-alert").alert();
        $("#password-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#password-blank-alert").hide();
        });
        $("#userpassword").focus();
        return false;
    }
    $("#loginspinmodal").modal("show");
      $.ajax(
      {
      type: "POST",
      url: "/userlogin",
      global: false,
      async: false,
      datatype: "json",
      data: {"orgcode":$("#orgcode").val(), "username":$("#login_username").val(), "userpassword":$("#userpassword").val()},
      success: function(resp)
      {
      if(resp["gkstatus"]==0)
      {
        var gt = resp['gktoken'];
        // on successfull login a token is received as response which is stored in sessionstorage.
        sessionStorage.gktoken = gt;
        sessionStorage.invflag = resp["invflag"]
        // Theme is fetched for the user and stored in sessionstorage.
        $.ajax({
          url: '/theme',
          type: 'POST',
          global: false,
          async: false,
          datatype: 'json',
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          }
        })
        .done(function(resp){
          sessionStorage.gktheme = resp["theme"];
        });
        sessionStorage.reload = 1;
        // finally mainshell is called.
        window.location="/showmainshell";
      }
      else if(resp["gkstatus"]==2)
      {
        $("#login-blank-alert").alert();
        $("#login-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#login-blank-alert").hide();
        });
        $("#login_username").focus();
        $("#loginspinmodal").modal("hide");
        $('.modal-backdrop').remove();
        return false;
      }
      }

      }
      );

      e.preventDefault();
  }
  );
});
