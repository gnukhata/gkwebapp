/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
  This file is part of GNUKhata:A modular,robust and Free Accounting System.

  GNUKhata is Free Software; you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation; either version 3 of
  the License, or (at your option) any later version.

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
// This script is for the project create edit and delete page.
$(document).ready(function() {
  $("#msspinmodal").modal("hide");
  $('.modal-backdrop').remove();
  $("#prjname").focus();
// Calculate width and height of the table depending on the screen.
  var percentwid = 100*(($("table").width()-9)/$("table").width());
  $('.table-fixedheader thead').width(percentwid+"%");
  var percentheigth = 100*(($("body").height()-$(".navbar").height()-170)/$("body").height());
  $('.table-fixedheader tbody').height(percentheigth+"%");
  if (sessionStorage.orgt=="Not For Profit") {
// Change headings and labels is orgtype is Not for Profit.
  if ($("#projects").val()==0) {
    $("#addid").html("Create Project"+' <i class="fa fa-question-circle pull-right" style="font-size:16px;color:white;"data-toggle="modal" data-target="#ProjModal"></i>');
    $("#listid").text("Project List");
  }
  else {
    $("#addid").html("Add Project"+' <i class="fa fa-question-circle pull-right" style="font-size:16px;color:white;"data-toggle="modal" data-target="#ProjModal"></i>');
    $("#listid").text("Project List");
  }
  }
  else {
// Change alert msgs if orgtype is Profit Making.
    $("#success-alert").html("Cost Center Saved!");
    $("#failure-alert").html("Cost Center could not be saved!");
    $("#blank-alert").html("Please enter Cost Center name!");
    $("#duplicate-alert").html("Cost Center already exists!");
    $("#transaction-alert").html("Cost Center cannot be deleted!<br>Transactions might be remaining for this Cost Center.");
    $("#prjlbl").html("Cost Center: ");
    $("#amtlbl").html("Budge<u>t</u>ed Amount: ");
    $("#prjlbltbl").html("Cost Center");
    $("#amtlbltbl").html("Budgeted Amount");
  }

  $("#prjamount").numeric({ negative: false });
  $("#m_prjamount").numeric({ negative: false });
  if($("#prjtable tbody tr").length==0){
// Hide the table if there are no projects.
    $("#prjtable").hide();
    $("#prjlist").hide();
    $("#prjlistpanel").hide();
  }
  else{
    $("#prjtable").show();
    $("#prjlist").show();
    $("#prjlistpanel").show();
  }
  $('.close').click(function() {

    $(this).parent().hide();

  });

  $("#prjname").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#prjamount").focus().select();
    }
  });
  $("#m_prjname").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#m_prjamount").focus().selet();
    }
  });

  $(document).off("click",".delprj").on("click", ".delprj", function() {
// Deletes the selected project.
    var prjcode = $(this).closest('tr').attr('value');
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#m_confirmdel').modal('show').one('click', '#prjdel', function (e) {
      $.ajax(
        {
          type: "POST",
          url: "/delproject",
          global: false,
          async: false,
          datatype: "json",
          data: {"projectcode":prjcode},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          {
            if (resp["gkstatus"]==0) {
              $("#showproject").click();
              $('.modal-backdrop').remove();
            }
            else if (resp["gkstatus"]==5) {
              $("#transaction-alert").alert();
              $("#transaction-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#transaction-alert").hide();
              });
            }
            $("#prjname").focus().select();
          }
        });

    });
    $('#m_confirmdel').on('shown.bs.modal', function(event) {
      $("#m_cancel").focus();
    });
  });

  $(document).off("click",".editprj").on("click", ".editprj", function() {
// Function to edit project, updates the project name and sanctionedamount.
    var prjcode = $(this).closest('tr').attr('value');
    var closesttr = $(this).closest('tr')
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $('#m_editprj').modal('show').one('click',"#m_edit", function(event) {
      if ($.trim($("#m_prjname").val())=="") {
        return false;
      }
      if ($.trim($("#m_prjamount").val())=="") {
        $("#m_prjamount").val("0.00");
      }
      $.ajax(
        {
          type: "POST",
          url: "/editproject",
          global: false,
          async: false,
          datatype: "json",
          data: {"projectcode":prjcode ,"projectname":$.trim($("#m_prjname").val()),"sanctionedamount":$.trim($("#m_prjamount").val())},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          {
            if (resp["gkstatus"]==0) {
              $("#showproject").click();
              $('.modal-backdrop').remove();
              $("#success-alert").alert();
              $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#success-alert").hide();
              });
            }
          }
        });
    });;
    $('#m_editprj').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
    {
// Shows the project details in a modal.
      $.ajax(
        {
          type: "POST",
          url: "/viewproject",
          global: false,
          datatype: "json",
          data: {"projectcode":prjcode},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          {
            if (resp["gkstatus"]==0) {
              var prj = resp["gkdata"];
              $("#m_prjname").val(prj["projectname"]);
              $("#m_prjamount").val(prj["sanctionedamount"]);
            }
            $("#m_prjname").select();
            $("#m_prjname").focus();
          }
        });
    });
  });

  $("#prjform").submit(function(e)
  {
    $("#msspinmodal").modal("show");
// Validations.
    if ($.trim($("#prjname").val())=="") {
      $("#blank-alert").alert();
      $("#blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#blank-alert").hide();
      });
      $("#prjname").focus().select();
      return false;
    }
    if ($.trim($("#prjamount").val())=="") {
      $("#prjamount").val("0.00");
    }
// Function to save project.
    $.ajax(
      {
        type: "POST",
        url: "/addproject",
        global: false,
        async: false,
        datatype: "json",
        data: $("#prjform").serialize(),
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          if(resp["gkstatus"]==0){
            $("#showproject").click();
            $("#success-alert").alert();
            $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#success-alert").hide();
            });
          }
          else if(resp["gkstatus"]==1) {
            $("#duplicate-alert").alert();
            $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#duplicate-alert").hide();
            });
            $("#prjname").focus().select();
          }
          else {
            $("#failure-alert").alert();
            $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#failure-alert").hide();
            });
            $("#prjname").focus().selct();
          }

        }

      }
    );
    e.preventDefault();
  });
});
