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
  console.log($("#loginform").serialize());
  $("#username").focus();
  var orname = sessionStorage.getItem('orgn');
  var ortype = sessionStorage.getItem('orgt');
  var styear = sessionStorage.getItem('year1');
  var enyear = sessionStorage.getItem('year2');
  var orgdata = orname + " (" + ortype + ")";
  var yeardata = "Financial Year : " + styear + " to " + enyear;
  if(orgdata!=""||yeardata!="")
  {
  $("#ticker").show();
  $("#orgdata").html(orgdata);
  $("#yeardata").html(yeardata);
  }
$('input:not(:hidden),select').bind("keydown", function(e) {
  var n = $("input:not(:hidden),select").length;
  var f = $('input:not(:hidden),select');
  if (e.which == 13)
  {
    var nextIndex = f.index(this) + 1;
    if(nextIndex < n){
      e.preventDefault();
      f[nextIndex].focus();}

    }
  });
  $('input:not(:hidden),select').bind("keydown", function(e) {
    var n = $("input:not(:hidden),select").length;
    var f = $('input:not(:hidden),select');
    if (e.which == 38)
    {
      var prevIndex = f.index(this) - 1;
      if(prevIndex > 0){
        e.preventDefault();
        f[prevIndex].focus();}

      }
    });
    $("#confirmpassword").blur(function(event) {
      if ($.trim($("#password").val())!=$.trim($("#confirmpassword").val())) {
        $("#checkpass-blank-alert").alert();
        $("#checkpass-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#checkpass-blank-alert").hide();
        });
        $("#password").focus();
        return false;
      }
    });

$("#loginform").submit(function(e)
{
  e.preventDefault();
  if ($.trim($("#username").val())=="") {
    $("#usrname-blank-alert").alert();
    $("#usrname-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#usrname-blank-alert").hide();
    });
    $("#username").focus();
    return false;
  }
  if ($.trim($("#password").val())=="") {
    $("#pasword-blank-alert").alert();
    $("#pasword-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#pasword-blank-alert").hide();
    });
    $("#password").focus();
    return false;
  }
  if ($.trim($("#confirmpassword").val())=="") {
    $("#confpass-blank-alert").alert();
    $("#confpass-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#confpass-blank-alert").hide();
    });
    $("#confirmpassword").focus();
    return false;
  }
  if ($.trim($("#password").val())!=$.trim($("#confirmpassword").val())) {
    $("#checkpass-blank-alert").alert();
    $("#checkpass-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#checkpass-blank-alert").hide();
    });
    $("#confirmpassword").focus();
    return false;
  }
  if ($.trim($("#securityquestion").val())=="") {
    $("#secuque-blank-alert").alert();
    $("#secuque-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#secuque-blank-alert").hide();
    });
    $("#securityquestion").focus();
    return false;
  }
  if ($.trim($("#securityanswer").val())=="") {
    $("#secuans-blank-alert").alert();
    $("#secuans-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
      $("#secuans-blank-alert").hide();
    });
    $("#securityanswer").focus();
    return false;
  }
  $("#spinmodal").modal("show");
    $.ajax(
    {
    //alert("starting ajax");
    type: "POST",
    url: "/createorglogin",
    global: false,
    async: false,
    datatype: "json",
    data: $("#loginform").serialize(),
    success: function(resp)
    {
      if (resp['gkstatus']==0) {

        var gt = resp['gktoken'];

        sessionStorage.gktoken = gt;
        sessionStorage.gktheme = 'Default';
        sessionStorage.reload = 1;
        window.location="/showmainshell";
      }
      else if(resp['gkstatus']==3) {

        $("#createnav").click();
        $("#spinmodal").hide();
        $('.modal-backdrop').remove();
        $("#createorg").load("/createorg",setTimeout( function() {
          $("#orgname").focus();
        }, 500 ));
        $("#duplicate-org-alert").alert();
        $("#duplicate-org-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-org-alert").hide();
        });

      }
    }

    }
    );
}
);
}
);
