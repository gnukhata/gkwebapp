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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
*/

$(document).ready(function()
{
  $("#godownform").validate();
  $("#reset").click(function()
  {
      $('#addgodown').click();
  });
  $("#submit").click(function(e)
  {
    if ($.trim($("#godownname").val())=="") {
      $("#blank-alert").alert();
      $("#blank-alert").fadeTo(2250, 200).slideUp(500, function(){
        $("#blank-alert").hide();
      });
      $("#godownname").focus().select();
      return false;
    }
    if ($.trim($("#godownaddress").val())=="") {
      $("#addressblank-alert").alert();
      $("#addressblank-alert").fadeTo(2250, 200).slideUp(500, function(){
        $("#addressblank-alert").hide();
      });
      $("#godownaddress").focus().select();
      return false;
    }
    if ($.trim($("#godowncontact").val())=="") {
      $("#contactblank-alert").alert();
      $("#contactblank-alert").fadeTo(2250, 200).slideUp(500, function(){
        $("#contactblank-alert").hide();
      });
      $("#godowncontact").focus().select();
      return false;
    }
    $.ajax(
      {

        type: "POST",
        url: "/addgodown",
        global: false,
        async: false,
        datatype: "json",
        data: $("#godownform").serialize(),
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          if(resp["gkstatus"]==0)
          {
            $("#reset").click();
            $("#success-alert").alert();
            $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#success-alert").hide();
            });
          }
          else if(resp["gkstatus"]==1)
          {
            $("#duplicate-alert").alert();
            $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#duplicate-alert").hide();
            });
            $("#godownname").focus().select();
          }
          else
          {
            $("#failure-alert").alert();
            $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#failure-alert").hide();
            });
          $("#godownname").focus().select();
          }
        }

      }
    );
    e.preventDefault();
  }
  );


  $('#mgodowns').change(function() {
    $.ajax({
      type: "POST",
      url: "/showmultigodown",
      global: false,
      async: false,
      datatype: "text/html"

    })
    .done(function(resp) {
      $("#multigodown_modal").html("");
      $('.modal-backdrop').remove();
      $('.modal').modal('hide');
      $("#multigodown_modal").html(resp);
      $("#m_multigod").modal('show');
      $('#m_multigod').on('shown.bs.modal', function (e)
      {
        $(".m_godname:enabled:first").focus().select();

      });
      $('#m_multigod').on('hidden.bs.modal', function (e)
      {
        $('#mgodowns').attr('checked', false);
        $("#multigodown_modal").html("");
        $("#reset").click();


      });

    })
    .fail(function() {
      alert("failed");
    });
  });
});
