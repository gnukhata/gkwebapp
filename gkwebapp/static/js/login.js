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

$(document).ready(function()
{
  $('#username').keydown(function(e){
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
        $("#username").focus();

        }
  });
  $("#back").click(function(event){
    event.preventDefault();
    $("#selectorg").load("/existingorg" );

  });

  $("#forgotpwdlink").click(function(event){
    var code = $("#orgcode").val();
    $("#selectorg").load("/forgotpassword?orgcode="+ code);
  });
  $("#changeorg").click(function(event){
    event.preventDefault();
  window.location.replace("/");
  });


  $("#loginform").submit(function(e)
  {
    e.preventDefault();
    if ($.trim($("#username").val())=="") {
      $("#username-blank-alert").alert();
      $("#username-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#username-blank-alert").hide();
      });
      $("#username").focus();
      return false;
    }
      if ($.trim($("#userpassword").val())=="") {
        $("#password-blank-alert").alert();
        $("#password-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
          $("#password-blank-alert").hide();
        });
        $("#userpassword").focus();
        return false;
    }
      $.ajax(
      {
      type: "POST",
      url: "/userlogin",
      global: false,
      async: false,
      datatype: "json",
      data: {"orgcode":$("#orgcode").val(), "username":$("#username").val(), "userpassword":$("#userpassword").val()},
      success: function(resp)
      {
      if(resp["gkstatus"]==0)
      {
        var gt = resp['gktoken'];

        sessionStorage.gktoken = gt;

        window.location="/showmainshell";
      }
      else if(resp["gkstatus"]==2)
      {
        $("#login-blank-alert").alert();
        $("#login-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
          $("#login-blank-alert").hide();
        });
        $("#username").focus();
        return false;
      }
      }

      }
      );

      e.preventDefault();
  }
  );
});
