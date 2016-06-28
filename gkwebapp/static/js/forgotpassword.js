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
  var answercheck = 9;
  var userstatus = 9;
  var passwordchanged = 9;
  $("#username").focus();
  $("#username").keydown(function(event){
    if (event.which == 13 || event.which == 9) {
      event.preventDefault();
      if ($.trim($("#username").val())=="") {
        $("#username-blank-alert").alert();
        $("#username-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#username-blank-alert").hide();
        });
        $("#securityquestion").val("")
      }
      if ($.trim($("#username").val())!="") {
        $.ajax({
          type: "POST",
          url: "/securityquestion",
          data: {"orgcode":$.trim($("#orgcode").val()), "username":$.trim($("#username").val())},
          global: false,
          async: false,
          datatype: "json",
          success: function(jsonObj) {
            userstatus = jsonObj["gkstatus"],
            userdata = jsonObj["gkresult"],
            $("#securityquestion").val(userdata[0].userquestion);
            $("#userid").val(userdata[0].userid);
            }
        });
      }
      if(userstatus == 0){
        $("#securityanswer").focus();
      }
      if (userstatus == 3) {
        $("#securityanswer-connectionfailed-alert").alert();
        $("#securityanswer-connectionfailed-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#securityanswer-connectionfailed-alert").hide();
        });
      }
      if (userstatus == 4 && $.trim($("#username").val())!="") {
        $("#forgotpassword-nosuchuser-alert").alert();
        $("#forgotpassword-nosuchuser-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#forgotpassword-nosuchuser-alert").hide();
        });
        $("#securityquestion").val("")
      }
    }
  });
  $("#securityanswer").keydown(function(event){
    if (event.which == 13 || event.which == 9) {
      event.preventDefault();
      if ($.trim($("#securityanswer").val())=="") {
        $("#securityanswer-blank-alert").alert();
        $("#securityanswer-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#securityanswer-blank-alert").hide();
        });
      }
      if ($.trim($("#username").val())=="") {
        $("#username-blank-alert").alert();
        $("#username-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#username-blank-alert").hide();
        });
        $("#securityquestion").val("")
      }
      if ($.trim($("#securityanswer").val())!="") {
        $.ajax({
          type: "POST",
          url: "/securityanswer",
          data: {"userid":$.trim($("#userid").val()), "useranswer":$.trim($("#securityanswer").val())},
          global: false,
          async: false,
          datatype: "json",
          success: function(resp) {
            answercheck = resp["gkstatus"];
          }
        });
      }
      if (answercheck == 0) {
        $(".passwordfields").show();
        $("#newpassword").focus();
        $("#securityanswer-correct-alert").alert();
        $("#securityanswer-correct-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#securityanswer-correct-alert").hide();
        });
      }
      if (answercheck == 3) {
        $("#securityanswer-connectionfailed-alert").alert();
        $("#securityanswer-connectionfailed-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#securityanswer-connectionfailed-alert").hide();
        });
      }
      if (answercheck == 4 && $.trim($("#securityanswer").val())!="") {
        $("#securityanswer-incorrect-alert").alert();
        $("#securityanswer-incorrect-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#securityanswer-incorrect-alert").hide();
        });
      }
    }
    if (event.which == 38) {
      event.preventDefault();
      $("#username").focus();
    }
  });
  $("#newpassword").keydown(function(event){
    if (event.which == 13 || event.which == 9) {
      event.preventDefault();
      if ($.trim($("#newpassword").val())=="") {
        $("#newpassword-blank-alert").alert();
        $("#newpassword-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#newpassword-blank-alert").hide();
        });
      }
      else {
      $("#confirmpassword").focus();
      }
    }
    if (event.which == 38) {
      event.preventDefault();
      $("#securityanswer").focus();
      }
  });
  $("#btnsubmit").click(function(event){
    event.preventDefault();
    if ($.trim($("#username").val())=="") {
      $("#username-blank-alert").alert();
      $("#username-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#username-blank-alert").hide();
      });
      $("#securityquestion").val("")
    }

    if ($.trim($("#securityquestion").val())=="") {
      $("#securityquestion-blank-alert").alert();
      $("#securityquestion-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#securityquestion-blank-alert").hide();
      });
    }

    if ($.trim($("#securityanswer").val())=="") {
      $("#securityanswer-blank-alert").alert();
      $("#securityanswer-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#securityanswer-blank-alert").hide();
      });
    }

    if ($.trim($("#newpassword").val())=="") {
      $("#newpassword-blank-alert").alert();
      $("#newpassword-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#newpassword-blank-alert").hide();
      });
    }

    if ( ($.trim($("#confirmpassword").val())=="") || ( $.trim($("#newpassword").val())!==$.trim($("#confirmpassword").val()) ) ) {
      $("#passwords-dont-match-alert").alert();
      $("#passwords-dont-match-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#passwords-dont-match-alert").hide();
      });
    }

    if ($.trim($("#newpassword").val())==$.trim($("#confirmpassword").val())) {
      $.ajax({
        type: "POST",
        url: "/newpassword",
        data: {"userid":$.trim($("#userid").val()), "userpassword":$.trim($("#confirmpassword").val()), "useranswer":$.trim($("#securityanswer").val())},
        global: false,
        async: false,
        datatype: "json",
        success: function(resp) {
          passwordchanged = resp["gkstatus"];
          }
      });
      if (passwordchanged == 0 && $.trim($("#confirmpassword").val())!="") {
      $("#selectorg").load("/login?orgcode="+$.trim($("#orgcode").val())+"&flag=0", setTimeout( function() { $("#username").focus(); }, 500 ));
      }
      if (passwordchanged == 4) {
        $("#forgotpassword-incorrectdetails-alert").alert();
        $("#forgotpassword-incorrectdetails-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#forgotpassword-incorrectdetails-alert").hide();
        });
      }
      if (passwordchanged == 3) {
        $("#securityanswer-connectionfailed-alert").alert();
        $("#securityanswer-connectionfailed-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#securityanswer-connectionfailed-alert").hide();
        });
      }
    }
  })

  $("#back").click(function(event){
    var code = $("#orgcode").val();
    $("#selectorg").load("/login?orgcode="+code);
  })
});
