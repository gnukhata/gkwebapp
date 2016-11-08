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
  $("#msspinmodal").modal("hide");
  $('.modal-backdrop').remove();
  if($("#username option").size()==1){
    $("#removeUserform").hide();
    $("#remove").hide();
    $("#nousers").show();
  }
  $("#username").focus();

  $("#username").keydown(function(event) {
    if (event.which==13) {
      $("#remove").click();
    }
  });
  $("#newuser").click(function(event) {
    $("#createuser").click();
  });
  $(document).off("click","#remove").on("click", "#remove", function(event)
  {
    event.preventDefault();
    if ($.trim($("#username").val())=="") {
      $("#remove-blank-alert").alert();
      $("#remove-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#remove-blank-alert").hide();
      });
      $("#username").focus();
      return false;
    }
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#m_confirmdel').modal('show').one('click', '#m_yes', function (e)
    {

        var code = $("#username option:selected").val();
        $.ajax({
          type: "POST",
          url: "/deleteuser",
          global: false,
          async: false,
          datatype: "json",
          data: {"username":code},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          },
          success: function(resp)
          {
            if (resp["gkstatus"]==0){
              $("#REMOVEuser").click();
              $("#remsuccess-alert").alert();
              $("#remsuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#remsuccess-alert").hide();
              });
              $('.modal-backdrop').remove();
              return false;
          }
          else if (resp["gkstatus"]==4) {
            $("#accessdenied-alert").alert();
            $("#accessdenied-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#accessdenied-alert").hide();
            });
            $("#username").focus();
            return false;
          }
          else if (resp["gkstatus"]==5) {
            $("#actiondisallowed-alert").alert();
            $("#actiondisallowed-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#actiondisallowed-alert").hide();
            });
            $("#username").focus();
            return false;
          }
          else if (resp["gkstatus"]==3) {
            $("#connectionfailed-alert").alert();
            $("#connectionfailed-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#connectionfailed-alert").hide();
            });
            $("#username").focus();
            return false;
          }
          }
        });

      });
      $('#m_confirmdel').on('shown.bs.modal', function(event) {
        $("#m_no").focus();
      });
      $('#m_confirmdel').on('hidden.bs.modal', function(event) {
        $("#username").focus();
      });
  }
);
});
