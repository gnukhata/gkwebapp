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

$(document).ready(function(){
  $("#name").focus();
  $('.modal-backdrop').remove();
  var inselect = 0;
  $("#userrole").focus(function(){
    inselect = 1;
  });
  $("input,select").keydown(function(e) {
    var n = $("input,select").length;
    var f = $('input,select');
    var s1 = $("#userrole option:selected").index();
    if (e.which == 13)
    {
      var nextIndex = f.index(this) + 1;
      if(nextIndex < n){
        e.preventDefault();
        f[nextIndex].focus();}
      }
      if (e.which == 38 && ((inselect == 1 && s1 == 1) || inselect == 0))
      {
        var prevIndex = f.index(this) - 1;
        if(prevIndex < n){
          e.preventDefault();
          f[prevIndex].focus();}
        }
      });
      $("#confirm_password").blur(function(event) {
        if ($.trim($("#password").val())!=$.trim($("#confirm_password").val())) {
          $("#checkpassuser-blank-alert").alert();
          $("#checkpassuser-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#checkpassuser-blank-alert").hide();
          });
          $("#password").focus();
          return false;
        }
      });

      $("#answer").keydown(function(e){
        if (e.which==13)
        {
          e.preventDefault();
          $("#adduser_button").click();
        }
      });

      $("#adduser_button").click(function(e)
      {
        if ($.trim($("#name").val())=="") {
          $("#username-blank-alert").alert();
          $("#username-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#username-blank-alert").hide();
          });
          $("#name").focus();
          return false;
        }
        if ($.trim($("#password").val())=="") {
          $("#password-blank-alert").alert();
          $("#password-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#password-blank-alert").hide();
          });
          $("#password").focus();
          return false;
        }
        if ($.trim($("#confirm_password").val())=="") {
          $("#cnfpass-blank-alert").alert();
          $("#cnfpass-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#cnfpass-blank-alert").hide();
          });
          $("#confirm_password").focus();
          return false;
        }
        if ($.trim($("#password").val())!=$.trim($("#confirm_password").val())) {
          $("#checkpassuser-blank-alert").alert();
          $("#checkpassuser-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#checkpassuser-blank-alert").hide();
          });
          $("#confirm_password").focus();
          return false;
        }
        if ($.trim($("#userrole").val())=="") {
          $("#role-blank-alert").alert();
          $("#role-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#role-blank-alert").hide();
          });
          $("#userrole").focus();
          return false;
        }
        if ($.trim($("#question").val())=="") {
          $("#secque-blank-alert").alert();
          $("#secque-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#secque-blank-alert").hide();
          });
          $("#question").focus();
          return false;
        }
        if ($.trim($("#answer").val())=="") {
          $("#secans-blank-alert").alert();
          $("#secans-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#secans-blank-alert").hide();
          });
          $("#answer").focus();
          return false;
        }
        $.ajax(
          {
            type: "POST",
            url: "/createuser",
            global: false,
            async: false,
            datatype: "json",
            data: $("#adduser").serialize(),
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(resp)
            {
              if(resp["gkstatus"]==0)
              {
                $('#adduser')[0].reset();
                $("#name").focus();
                $("#success-blank-alert").alert();
                $("#success-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#success-blank-alert").hide();
                });
              }
              if(resp["gkstatus"]==1)
              {
                $("#name").focus();
                $("#DuplicateEntry-blank-alert").alert();
                $("#DuplicateEntry-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#DuplicateEntry-blank-alert").hide();
                });
              }
              if(resp["gkstatus"]==4)
              {
                $('#adduser')[0].reset();
                $("#name").focus();
                $("#BadPrivilege-blank-alert").alert();
                $("#BadPrivilege-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#BadPrivilege-blank-alert").hide();
                });
              }
            }

          }
        );

        e.preventDefault();
      }
    );
  });
