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
"Vanita Rajpurohit" <vanita.rajpurohit9819@gmail.com>
*/

$(document).ready(function() {
  $("#current_password").focus();
  $("#current_password").select();

  $("input:visible").keydown(function(event) {
    var n = $("input:visible").length;
    var f= $("input:visible");
    if(event.which==13)
    {
      var nextIndex = f.index(this) + 1;
      if(nextIndex < n){
        event.preventDefault()
        f[nextIndex].focus();}
    }
    if (event.which==38)
    {
      var prevIndex = f.index(this) - 1;
      if(prevIndex < n){
        event.preventDefault();
        f[prevIndex].focus().select();}
      }

  });

  $("#confirm_password").blur(function(event) {
    if ($.trim($("#new_password").val())!=$.trim($("#confirm_password").val())) {
      $("#checkpassuser-blank-alert").alert();
      $("#checkpassuser-blank-alert").fadeTo(3000, 500).slideUp(500, function(){
      $("#checkpassuser-blank-alert").hide();
      });
      $("#new_password").focus().select();
      return false;
    }
  });

  $("#edituserform").submit(function(e){
    e.preventDefault();
    if ($.trim($("#current_password").val())=="") {
      $("#curpass-blank-alert").alert();
      $("#curpass-blank-alert").fadeTo(3000, 500).slideUp(500, function(){
        $("#curpass-blank-alert").hide();
      });
      $("#current_password").focus().select();
      return false;
    }
    if ($.trim($("#new_password").val())=="") {
      $("#password-blank-alert").alert();
      $("#password-blank-alert").fadeTo(3000, 500).slideUp(500, function(){
        $("#password-blank-alert").hide();
      });
      $("#new_password").focus().select();
      return false;
    }
    if ($.trim($("#confirm_password").val())=="") {
      $("#cnfpass-blank-alert").alert();
      $("#cnfpass-blank-alert").fadeTo(3000, 500).slideUp(500, function(){
        $("#cnfpass-blank-alert").hide();
      });
      $("#confirm_password").focus().select();
      return false;
    }

    if ($.trim($("#new_password").val())!=$.trim($("#confirm_password").val())) {
      $("#checkpassuser-blank-alert").alert();
      $("#checkpassuser-blank-alert").fadeTo(3000, 500).slideUp(500, function(){
      $("#checkpassuser-blank-alert").hide();
      });
      $("#new_password").focus().select();
      return false;
    }
    var orgcode="";
    var orgstatus="";
    var loginstatus="";
    var editstatus="";
    $.ajax(
      {
        type: "POST",
        url: "/getorgcode",
        global: false,
        async: false,
        datatype: "json",
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp){
          if(resp["gkstatus"]==0)
          {
             orgcode = resp["gkdata"];
             orgstatus = resp["gkstatus"];
          }
          if (resp["gkstatus"]==2 || resp["gkstatus"]==4 || resp["gkstatus"]==3)
          {
            $("#badprivilege-alert").alert();
            $("#badprivilege-alert").fadeTo(3000, 500).slideUp(500, function(){
            $("#badprivilege-alert").hide();
            });
            return false;
          }
        }

      });
      if (orgstatus==0)
      {
        $.ajax(
          {
            type: "POST",
            url: "/userlogin",
            global: false,
            async: false,
            datatype: "json",
            data: {"username":$("#username").val(), "userpassword":$("#current_password").val(), "orgcode":orgcode},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(resp){
              loginstatus=resp["gkstatus"];
              if (resp["gkstatus"]==0)
              {
              }
              if (resp["gkstatus"]==3)
              {
                $("#connectionfailed-alert").alert();
                $("#connectionfailed-alert").fadeTo(3000, 500).slideUp(500, function(){
                $("#connectionfailed-alert").hide();
                });
                return false;
              }
              if (resp["gkstatus"]==2 || resp["gkstatus"]==4)
              {
                $("#badprivilege-alert").alert();
                $("#badprivilege-alert").fadeTo(3000, 500).slideUp(500, function(){
                $("#badprivilege-alert").hide();
                });
                return false;
              }
            }
          });
      }
      if (loginstatus==0)
      {
        $.ajax(
          {
            type: "POST",
            url: "/edituser",
            global: false,
            async: false,
            datatype: "json",
            data: {"username":$("#username").val(), "userpassword":$("#new_password").val(), "userid":$("#userid").val()},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(resp){
              if (resp["gkstatus"]==0)
              {
                $("#showedituser").click();
                $("#success-alert").alert();
                $("#success-alert").fadeTo(3000, 500).slideUp(500, function(){
                $("#success-alert").hide();
                });
              }
              if (resp["gkstatus"]==3)
              {
                $("#connectionfailed-alert").alert();
                $("#connectionfailed-alert").fadeTo(3000, 500).slideUp(500, function(){
                $("#connectionfailed-alert").hide();
                });
                return false;
              }
              if (resp["gkstatus"]==2 || resp["gkstatus"]==4)
              {
                $("#badprivilege-alert").alert();
                $("#badprivilege-alert").fadeTo(3000, 500).slideUp(500, function(){
                $("#badprivilege-alert").hide();
                });
                return false;
              }
            }
          });
      }

  });


});
