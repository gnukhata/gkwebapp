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
$(document).ready(function() {
    $('.modal-backdrop').remove();
    $("#egdnsubmit").hide();

    $("#editgoddet").bind("change keyup", function() {
        $("#egdnsubmit").hide();
        var goid = $("#editgoddet option:selected").val();
        var goname = $("#editgoddet option:selected").text();
        $.ajax({
            type: "POST",
            url: "/getgoddetails",
            data: {
                "goid": goid
            },
            global: false,
            async: false,
            dataType: "json",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
            success: function(resp) {
                goddetails = resp["gkresult"];
                $("#goname").val(goddetails["godownname"]);
                $("#goname").prop("disabled", true);
                $("#goaddress").val(goddetails["godownaddress"]);
                $("#goaddress").prop("disabled", true);
                $("#gocontact").val(goddetails["godowncontact"]);
                $("#gocontact").prop("disabled", true);
                $("#gostate").val(goddetails["godownstate"]);
                $("#gostate").prop("disabled", true);
                $("#godesignation").val(goddetails["godowndesignation"]);
                $("#godesignation").prop("disabled", true);
                $("#gocontactname").val(goddetails["godowncontactname"]);
                $("#gocontactname").prop("disabled", true);
                $("#goid").val(goddetails["godownid"]);
                $(".editgodownform").show();
                $("#form-footer").show();
                $("#delete").show();
                $("#edit").show();
            }
        });
    });

    $("#edit").click(function(event) {
        event.preventDefault();
        $("#egdnsubmit").show();
        $("#goname").prop("disabled", false);
        $("#goaddress").prop("disabled", false);
        $("#gocontact").prop("disabled", false);
        $("#gostate").prop("disabled", false);
        $("#godesignation").prop("disabled", false);
        $("#gocontactname").prop("disabled", false);
        $("#edit").hide();
        $("#goname").focus();
    });

    $("#goname").keydown(function(e){
      if (e.which == 13) {
        e.preventDefault();
        $("#gostate").focus();
      }
    });
    $("#gostate").keydown(function(e){
      if (e.which == 13) {
        e.preventDefault();
        $("#goaddress").focus();
      }
      if (e.which == 38 && $("#gostate option:selected").index()==0) {
        $("#goname").focus();
      }
    });
        var delta = 500;
        var lastKeypressTime = 0;
        $("#goaddress").keydown(function(e){
          if (e.which == 13) {
            var thisKeypressTime = new Date();
            if ( thisKeypressTime - lastKeypressTime <= delta )
            {
              $("#gocontactname").focus();
              thisKeypressTime = 0;
            }
            lastKeypressTime = thisKeypressTime;
          }
          if (e.which == 38) {
            $("#gostate").focus();
          }
        });
        $("#gocontactname").keydown(function(e){
          if (e.which == 13) {
            e.preventDefault();
            $("#godesignation").focus();
          }
          if (e.which == 38) {
            $("#goaddress").focus();
          }
        });
        $("#godesignation").keydown(function(e){
          if (e.which == 13) {
            e.preventDefault();
            $("#gocontact").focus();
          }
          if (e.which == 38) {
            $("#gocontactname").focus();
          }
        });
        $("#gocontact").keydown(function(e){
          if (e.which == 13) {
            e.preventDefault();
            $("#egdnsubmit").click();
          }
          if (e.which == 38) {
            $("#godesignation").focus();
          }
        });

    $("#editgoddet").keyup(function(e) {
        if ($(".editgodownform").is(':visible')) {
            if (e.which == 13) {
                $("#edit").click();
            }
        }
    });

    $("#reset").click(function() {
        $("a[href ='#godown_edit']").click();
    });



    $(document).off("click", "#delete").on("click", "#delete", function(event) {
        event.preventDefault();
        $('.modal-backdrop').remove();
        $('.modal').modal('hide');
        $('#m_confirmdel').modal('show').on('click', '#goddel', function(e) {

            var goid = $("#editgoddet option:selected").val();
            $.ajax({
                type: "POST",
                url: "/deletegodown",
                global: false,
                async: false,
                datatype: "json",
                data: {
                    "goid": goid
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                },
                success: function(resp) {
                    if (resp["gkstatus"] == 0) {
                        $("#reset").click();
                        $('.modal-backdrop').remove();
                        $("#delsuccess-alert").alert();
                        $("#delsuccess-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#delsuccess-alert").hide();
                        });
                    } else if (resp["gkstatus"] == 5) {
                        $("#transaction-alert").alert();
                        $("#transaction-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#transaction-alert").hide();
                        });
                        $("#editgoddet").focus().select();
                    }

                }
            });
        });
        $('#m_confirmdel').on('shown.bs.modal', function(event) {
            $("#m_cancel").focus();
        });
        $('#m_confirmdel').on('hidden.bs.modal', function(event) {
            $("#editgoddet").focus();
        });
    });
    $(document).keydown(function(e){
      if (e.which == 45) {
        e.preventDefault();
        $("#egdnsubmit").click();
      }
    });
    $("#egdnsubmit").click(function(e) {

        if ($.trim($("#goname").val()) == "") {
            $("#blank-alert").alert();
            $("#blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#blank-alert").hide();
            });
            $("#goname").focus().select();
            return false;
        };
        if ($.trim($("#goaddress").val()) == "") {
            $("#addressblank-alert").alert();
            $("#addressblank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#addressblank-alert").hide();
            });
            $("#goaddress").focus().select();
            return false;
        };
        if ($.trim($("#gocontact").val()) == "") {
            $("#contactblank-alert").alert();
            $("#contactblank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#contactblank-alert").hide();
            });
            $("#gocontact").focus().select();
            return false;
        };
        var goid = $("#editgoddet option:selected").val();
        var goname = $("#goname").val();
        var goaddr = $("#goaddress").val();
        var gocontact = $("#gocontact").val();
        var gocontactname = $("#gocontactname").val();
        var godesignation = $("#godesignation").val();
        var gostate = $("#gostate option:selected").val();
        $.ajax({
            type: "POST",
            url: "/editgodown",
            global: false,
            async: false,
            datatype: "json",
            data: {
                "goid": goid,
                "goname": goname,
                "goaddr": goaddr,
                "gocontact": gocontact,
                "gocontactname": gocontactname,
                "godesignation": godesignation,
                "gostate": gostate
            },
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
            success: function(resp) {
                if (resp["gkstatus"] == 0) {
                    $("#reset").click();
                    $("#success-alert").alert();
                    $("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#success-alert").hide();
                    });
                } else if (resp["gkstatus"] == 1) {
                    $("#duplicate-alert").alert();
                    $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#duplicate-alert").hide();
                    });
                    $("#goname").focus().select();
                } else {
                    $("#failure-alert").alert();
                    $("#failure-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#failure-alert").hide();
                    });
                    $("#goname").focus().select();
                }
            }
        });
        e.preventDefault();
    });
});
