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
  $("#username").focus();
  $('input:visible, textarea').keydown(function(event){
    var n =$('input:visible,textarea').length;
    var f= $('input:visible, textarea');
    if (event.which == 13)
    {
      var nextIndex = f.index(this)+1;
      if(nextIndex < n){
        event.preventDefault();
        f[nextIndex].focus().select();
      }
    }
    if(event.which == 38){
      var prevIndex = f.index(this)-1;
      if(prevIndex < n){
        event.preventDefault();
        f[prevIndex].focus().select();
      }
    }
  });
  $("#btnsubmit").click(function(event){
    event.preventDefault();
    if ($.trim($("#username").val())=="") {
      $("#username-blank-alert").alert();
      $("#username-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#username-blank-alert").hide();
      });
      $("#username").focus();
      return false;
    }

    if ($.trim($("#securityquestion").val())=="") {
      $("#securityquestion-blank-alert").alert();
      $("#securityquestion-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#securityquestion-blank-alert").hide();
      });
      $("#securityquestion").focus();
      return false;
    }

    if ($.trim($("#securityanswer").val())=="") {
      $("#securityanswer-blank-alert").alert();
      $("#securityanswer-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#securityanswer-blank-alert").hide();
      });
      $("#securityanswer").focus();
      return false;
    }

    if ($.trim($("#newpassword").val())=="") {
      $("#newpassword-blank-alert").alert();
      $("#newpassword-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#newpassword-blank-alert").hide();
      });
      $("#newpassword").focus();
      return false;
    }

    if ( ($.trim($("#confirmpassword").val())=="") || ( $.trim($("#newpassword").val())!==$.trim($("#confirmpassword").val()) ) ) {
      $("#passwords-dont-match-alert").alert();
      $("#passwords-dont-match-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#passwords-dont-match-alert").hide();
      });
      $("#confirmpassword").focus();
      return false;
    }
  })

  $("#back").click(function(event){
    var code = $("#orgcode").val();
    $("#selectorg").load("/login?orgcode="+code);
  })
});
