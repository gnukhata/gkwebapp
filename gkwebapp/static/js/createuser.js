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
  $("#msspinmodal").modal("hide");
  $("#msspinmodal").on('hidden.bs.modal', function(event) {
  $("#name").focus();
  });
    // for reset Button
    $("#adduser_reset").click(function()
     {
       $("a[href ='#user_create']").click();
     });
    
  //$("#userrole option[value=3]").hide();
  if (sessionStorage.invflag==1) {
    $.ajax(
       {
       type: "POST",
       url: "/godown?type=check",
       global: false,
       async: false,
       datatype: "text/html",
       beforeSend: function(xhr)
         {
           xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
         },
       success: function(resp)
       {
         var abc = resp["gkresult"];
         if (resp["gkresult"].length>0) {
           $("#userrole option[value=3]").show();
         }
       }
       });
  }
  $("#name").focus(function(){
    $("#msspinmodal").modal("hide");
  });
  $('.modal-backdrop').remove();
  var inselect = 0;
  $("#userrole").focus(function(){
    inselect = 1;
  });

  $(document).off("change","#userrole").on("change","#userrole",function(e){
    /* Act on the event */
    var role = $("#userrole option:selected").val();
    if (role==3){
      $.ajax(
         {

         type: "POST",
         url: "/godown?type=role_list",
         global: false,
         async: false,
         datatype: "text/html",
         beforeSend: function(xhr)
           {
             xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
           },
         success: function(resp)
         {
           $("#usertable").html(resp);
           $("#latable tbody tr:first td:first input").focus().select();
         }
         });
         }
         else {
           $("#usertable").html("");
         }
  });

  $(document).off("keydown",".user_role").on("keydown",".user_role",function(e){
    if (e.which == 27) {
      e.preventDefault();
      $("#question").focus();
    }
    if (e.which == 13) {
      e.preventDefault();
      var index = $('.user_role').index(this) + 1;
         $('.user_role').eq(index).focus();
    }
    if (e.which==38) {
      e.preventDefault();
      var index = $('.user_role').index(this) - 1;
         $('.user_role').eq(index).focus();
    }
  });

  $(document).off("focus",".user_role").on("focus",".user_role",function(e){
    $(this).closest('tr').addClass('selected');
  });
  $(document).off("blur",".user_role").on("blur",".user_role",function(e){
    $(this).closest('tr').removeClass('selected');
  });

  $("#name").keydown(function(e){
    if (e.which==13)
    {
      e.preventDefault();
      $("#password").focus();
    }
    });

    $("#password").keydown(function(e){
      if (e.which==13)
      {
        e.preventDefault();
        $("#confirm_password").focus();
      }
      if (e.which==38) {
        e.preventDefault();
        $("#name").focus();
      }
    });

    $("#confirm_password").keydown(function(e){
      if (e.which==13)
      {
        e.preventDefault();
        $("#userrole").focus();
      }
      if (e.which==38) {
        $("#password").focus();
      }
    });

    $(document).off("keydown","#userrole").on("keydown", '#userrole', function(e) {

        if (e.which == 13 || e.which == 9) {
          e.preventDefault();
         if ($(this).val()==3) {
           $("#latable tbody tr:first td:first input").focus().select();
         }
         else {
           $("#question").focus().select();
         }
     }

      if (e.which==38) {
        var s1 = $("#userrole option:selected").index();
        if (s1 == 0 || s1 == 1) {
          $("#confirm_password").focus();
        }
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

      $("#question").keydown(function(e){
        if (e.which==13)
        {
          e.preventDefault();
          $("#answer").focus();
        }
        if (e.which==38) {
          e.preventDefault();
          $("#userrole").focus();
        }
      });

      $("#answer").keydown(function(e){
        if (e.which==13)
        {
          e.preventDefault();
            $("#adduser_button").click();
        }
        if (e.which==38) {
          e.preventDefault();
          $("#question").focus();
        }
      });

      $(document).off("click","#adduser_button").on("click", '#adduser_button', function(event) {
        event.preventDefault();
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

        var selectedgodowns = [];
        $('#latable tbody tr').each(function(){
          if ($(".user_role",this).is(":checked")) {
            selectedgodowns.push($(this).attr("value"));
          }
        });

        if (selectedgodowns.length < 1 && $("#userrole").val() == 3) {
          $("#select-godowns-alert").alert();
          $("#select-godowns-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#select-godowns-alert").hide();
          });
          $("#latable tbody tr:first td:first input").focus().select();
          return false;

        }

        var adduserformdata = $("#adduser").serializeArray();
        adduserformdata.push({name: 'godowns', value: JSON.stringify(selectedgodowns)});

        $("#msspinmodal").modal("show");
        $.ajax(
          {
            type: "POST",
            url: "/createuser",
            global: false,
            async: false,
            datatype: "json",
            data: adduserformdata,
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(resp)
            {
              if(resp["gkstatus"]==0)
              {
                $("#msspinmodal").modal("hide");
                $('#adduser')[0].reset();
                $("#success-blank-alert").alert();
                $("#success-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#success-blank-alert").hide();
                  $("#usertable").html("");
                  $("#name").focus();
                });
              }
              if(resp["gkstatus"]==1)
		{
		    $("#msspinmodal").modal("hide");
                $("#DuplicateEntry-blank-alert").alert();
                $("#DuplicateEntry-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#DuplicateEntry-blank-alert").hide();
                  $("#name").focus();
                });
              }
              if(resp["gkstatus"]==4)
		{
		    $("#msspinmodal").modal("hide");
                $('#adduser')[0].reset();
                $("#BadPrivilege-blank-alert").alert();
                $("#BadPrivilege-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#BadPrivilege-blank-alert").hide();
                  $("#name").focus();
                });
              }
            }
          }
        );
      }
    );
  });
