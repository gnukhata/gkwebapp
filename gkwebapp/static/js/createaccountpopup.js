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
  $("#m_openbal").numeric();
  var sel1 = 0;
  var sel2 = 0;

  $("#m_groupname").focus(function() {
    sel1 = 1;
  });
  $("#m_groupname").blur(function(){
    sel1 = 0;
  });
  $("#m_subgroupname").focus(function() {
    sel2 = 1;
  });
  $("#m_subgroupname").blur(function(){
    sel2 = 0;
  });

  $('#m_accountname').keydown( function(event) {
    if (event.which==13)
     {
       event.preventDefault();
      if($("#m_openbal").is(':visible'))
      {
        $("#m_openbal").focus();
        $("#m_openbal").select();
      }
      else
      {
        $("#m_submit").click();

      }
    }
  });


  $('input:text,select, input:checkbox').keyup( function(event) {
    var n = $("input:text:visible,select, input:checkbox").length;
    var f = $('input:text:visible,select, input:checkbox');

    if (event.which == 13)
    {


      var nextIndex = f.index(this) + 1;
      if(nextIndex < n){
        event.preventDefault();
        f[nextIndex].focus();
        f[nextIndex].select();
      }

      }


      var s2 = $("#m_subgroupname option:selected").index();
      if ((event.which == 38 && sel2 == 1 && s2 == 0) || (event.which == 38 && (sel1 == 0 && sel2==0)))
      {
        var prevIndex = f.index(this) - 1;
        if(prevIndex < n){
          event.preventDefault();
          f[prevIndex].focus();
          f[prevIndex].select();
        }
        }
      });


  $("#m_groupname").focus();
  $("#m_accountform").validate();
  $("#m_groupname").bind("change keyup", function(){
    var gname = $("#m_groupname option:selected").text();

    if (gname=="Direct Expense" || gname=="Direct Income" || gname=="Indirect Expense" || gname=="Indirect Income")
    {
      $("#m_obal").hide();
      $("#m_openbal").hide();
      $("#m_baltbl").hide();

    }
    else
    {
      $("#m_baltbl").show();
      $("#m_obal").show();
      $("#m_openbal").show();
    }

    var groups = $("#m_groupname option:selected").val();
    $.ajax({
      type: "POST",
      url: "/getsubgroup",
      data: {"groupcode":groups},
      global: false,
      async: false,
      dataType: "json",
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(jsonObj) {
        subgroups = jsonObj["gkresult"],
        $('#m_subgroupname').empty();
        for (i in subgroups ) {
          $('#m_subgroupname').append('<option value="' + subgroups[i].subgroupcode + '">' +subgroups[i].subgroupname+ '</option>');
        }
        var grpnam=$("#m_groupname option:selected").text();
        if (grpnam=="Direct Expense" || grpnam=="Indirect Expense" || grpnam=="Direct Income" || grpnam=="Indirect Income" || grpnam=="Loans(Asset)" || grpnam=="Reserves" || grpnam=="Capital" || grpnam=="Miscellaneous Expenses(Asset)" || grpnam=="Corpus")
        {
            $('#m_subgroupname').prepend('<option value="None">None</option>');
        }
        $('#m_subgroupname').append('<option value="New">New Sub-Group</option>');
      }

    });
  });

$("#m_nsgp").hide();

$(".gsselect").bind("change keyup", function(){
var sgroups = $("#m_subgroupname option:selected").val();
if (sgroups=="New")
{
  $("#m_nsgp").show();

}
else
{
  $("#m_nsgp").hide();
}


});





  $("#m_accountform").submit(function(e)
  {

    if ($.trim($("#m_accountname").val())=="") {
      $("#m_blank-alert").alert();
      $("#m_blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#m_blank-alert").hide();
      });
      $("#m_accname").focus().select();
      return false;
    }

    if ($.trim($("#m_groupname option:selected").val())=="") {
      $("#m_grpblank-alert").alert();
      $("#m_grpblank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#m_grpblank-alert").hide();
      });
      $("#m_groupname").focus().select();
      return false;
    }

    if ($.trim($("#m_subgroupname option:selected").val())=="") {
      $("#m_sgrpblank-alert").alert();
      $("#m_sgrpblank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#m_sgrpblank-alert").hide();
      });
      $("#m_subgroupname").focus().select();
      return false;
    }

if ($("#m_newsubgroup").is(':visible')) {

  if ($.trim($("#m_newsubgroup").val())=="") {
    $("#m_nsblank-alert").alert();
    $("#m_nsblank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#m_nsblank-alert").hide();
    });
    $("#m_newsubgroup").focus().select();
    return false;
  }

}

    var ob = $('#m_openbal').val();
    if(ob=="")
    {
      $('#m_openbal').val("0.00");
    }

      $.ajax(
        {

          type: "POST",
          url: "/addaccount",
          global: false,
          async: false,
          datatype: "json",
          data: $("#m_accountform").serialize(),
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          {
            if(resp["gkstatus"]==0)
            {
              $("#selpopupaccount").val($("#m_accountname").val());
              $("#m_success-alert").alert();
              $("#m_success-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#m_success-alert").hide();
              });
              $('#m_accmodal').modal('hide');
              $('.modal-backdrop').remove();
            }
            else if(resp["gkstatus"]==1)
            {
              $("#m_duplicate-alert").alert();
              $("#m_duplicate-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#m_duplicate-alert").hide();
              });
              $("#m_accname").focus().select();
            }
            else
            {
              $("#m_failure-alert").alert();
              $("#m_failure-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#m_failure-alert").hide();
              });
              $("#m_accname").focus().select();
            }
          }

        }
      );




    e.preventDefault();
  }
);
});
