/*
  Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
  Copyright (C) 2017 Digital Freedom Foundation & Accion Labs Pvt. Ltd.
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
"Krishnakant Mane" <kk@dff.org.in>
"Prajkta Patkar" <prajakta@dff.org.in>
"Abhijith Balan" <abhijith@dff.org.in>
"Nitesh Chaughule" <nitesh@disroot.org>
*/

// This script for edit user.

$(document).ready(function() {    
    $('.modal-backdrop').remove();
    $("#all").focus().click();
    //This change event filter out list of user on basis of its role
    $(document).off('change', '.iib').on('change', '.iib', function(event){
	if ($("#managerradio").is(":checked")) {
	    $("#edituser option[role!='Manager']").prop("hidden", true).prop("disabled", true);
	    $("#edituser option[role='Manager']").prop("hidden", false).prop("disabled", false);
	}
	else if ($("#operatorradio").is(":checked")) {
	    $("#edituser option[role!='Operator']").prop("hidden",true).prop("disabled",true);
	    $("#edituser option[role='Operator']").prop("hidden", false).prop("disabled", false);
	}
	else if ($("#auditorradio").is(":checked")) {
	    $("#edituser option[role='Internal Auditor']").prop("hidden", false).prop("disabled", false);
	    $("#edituser option[role!='Internal Auditor']").prop("hidden",true).prop("disabled",true);
	}
	else if ($("#Inchargeradio").is(":checked")) {
	    $("#edituser option[role='Godown In Charge']").prop("hidden", false).prop("disabled", false);
	    $("#edituser option[role!='Godown In Charge']").prop("hidden", true).prop("disabled", true);
	}
	else {
	    $("#edituser option").prop("hidden", false).prop("disabled", false); 
	}
	$("#edituser").change();
    });

    //focus Event for radio buttons. 
    $(document).off('focusin', '.iib').on('focusin', '.iib', function(event) {
	event.preventDefault();
	$("#edituser option:first").prop("selected",true);
	$("#edituser").change();
    });

    $(document).off('keydown', '.iib').on('keydown', '.iib', function(event) {
	if (event.which == 13) {
	    event.preventDefault();
	    if($("#all").is(":checked")){
		$("#edituser").focus();
	    }
	    else if ($("#managerradio").is(":checked")) {
		$("#edituser").focus();
	    }
	    else if ($("#operatorradio").is(":checked")) {
		$("#edituser").focus();
	    }
	    else if ($("#auditorradio").is(":checked")) {
		$("#edituser").focus();
	    }
	    else if ($("#Inchargeradio").is(":checked")) {
		$("#edituser").focus();
	    }
	}
    });

    //following ajax will calls selected user details and hide it.
    $("#edituser").bind("change", function(e) {
	$("#edusrsubmit").hide();
	$("#usertable").html("");
	var userid = $("#edituser option:selected").val();
        var username = $("#edituser option:selected").text();
	if( userid !=""){
	$.ajax({
	    type: "POST",
            url:"/showuser?type=getuserdetails",
            data:{
		"userid": $("#edituser option:selected").val()
            },
            global: false,
            async: false,
            dataType: "json",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
	    success: function(resp) {
		var userdetails = resp["gkresult"];
                $("#editname").val(userdetails["username"]);
                $("#editname").prop("disabled", true);
		$("#password").prop("disabled",true);
		$("#passwordconfirm").prop("disabled",true);
		$("#current_password").prop("disabled",true);
		$("#userrole").val(userdetails["userrole"]);
		$("#userrole").prop("disabled", true);
                $("#question").val(userdetails["userquestion"]);
                $("#question").prop("disabled", true);
	        $("#answer").val(userdetails["useranswer"]);
                $("#answer").prop("disabled", true);
                $("#userid").val(userdetails["userid"]);
                $(".edituserform").show();
                $("#form-footer").show();
                $("#delete").show();
                $("#edit").show();
		$("#userrolediv").show();
		$("#pass_link").hide();
		$("#moresmall").hide();

		if(userdetails["userrole"]== -1){
		    $("#delete").hide();
		    $("#userrolediv").hide();
		    $("#usertable").hide();
		    $("#curpassdiv").show();
		    $("#user_pass").hide();   
		}else{
		    $("#curpassdiv").hide();
		    $("#user_pass").show();
		    $("#pass_link").hide();
		}

		
		//This ajax gives the assign list of godowns for particular user. 
		if (userdetails["userrole"] == 3){
		    $("#usertable").show();
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
				for(let i=0; i<$('#latable tbody tr').length; i++){
				    if($('#latable tbody tr:eq('+i+')').attr("value") in userdetails["godowns"]){
					$('#latable tbody tr:eq('+i+') td input').prop("checked", true);
					$('#latable tbody tr td input').prop("disabled", true);
				    }
				}
			    }
			});
		}
		if (userdetails["userrole"] != 3){
		    $("#usertable").hide();
		}
               }
        });
	}
	else{
	    $(".edituserform, .panel-footer, #usertable").hide();
	}
    });

    //When clicking on Edit Button all fields will be enabled.
    $("#edit").click(function(event) {
	event.preventDefault();
	$("#edusrsubmit").show();
	$("#editname").prop("disabled", false);
	$("#current_password").prop("disabled",false);
	$("#passwordconfirm").prop("disabled", false);
	$("#password").prop("disabled", false);
	if($("#edituser option:selected").attr("role") == "Admin" && $.trim($("#current_password").val()) == "") {
	    $("#passconfirm_admin").prop("disabled", true);
	    $("#pass_admin").prop("disabled", true);
	}else{
	    $("#passconfirm_admin").prop("disabled", false);
	    $("#pass_admin").prop("disabled", false);
	}
	$("#userrole").prop("disabled", false);
	$("#usertable").show();
	$("#question").prop("disabled", false);
	$("#answer").prop("disabled", false);
	$("#edit").hide();
	$("#editname").focus().select();
	$('#latable tbody tr td input').prop("disabled", false);
	if($("#edituser option:selected").attr("role") == "Admin"){
	    $("#pass_link").show();
	}
    });
    
    
    //When "Godown In charge" role is selected from userrole will gives Godown List.
    if (sessionStorage.invflag==1) {
	$.ajax({
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

    $("#editname").focus(function(){
	$("#msspinmodal").modal("hide");
    });
    $('.modal-backdrop').remove();
    var inselect = 0;
    $("#userrole").focus(function(){
	inselect = 1;
    });

    $("#userrole").change(function(e){
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

    $("#edituser").keydown(function(e) {
        if ($(".edituserform").is(':visible')) {
            if (e.which == 13) {
		e.preventDefault();
                $("#edit").click();
            }
        }
	if(e.which == 188 && e.shiftKey) {
	    e.preventDefault();
	    $("#all").focus().click();
	}
    });

    // Key event For New User Name
    $("#editname").keydown(function(e){
	if (e.which==13) {
	    e.preventDefault();
	    if ($("#editname").val()=="") {
		$("#blank-alert").alert();
		$("#blank-alert").fadeTo(2250, 200).slideUp(500, function(){
		    $("#blank-alert").hide();
		});
		$("#editname").focus();
		return false;
	    }
	    else if($("#edituser option:selected").attr("role") == "Admin"){
		$("#question").focus();
	    }
	    else{
		$("#password").focus();
	    }
	}
	if (e.which==38) {
	    $("#edituser").focus();
	}
    });
    
    //For Admin Userrole
    //If Current password is correct then only "New password" and "Confirm New Password" fields will be enabled.
    $("#current_password").keydown(function(e){
	if(e.which==13){
	    if($("#current_password").val()==""){
		$("#curpass-blank-alert").alert();
		$("#curpass-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#curpass-blank-alert").hide();
		});
	    }
	    if($("#current_password").val()!=""){
		$.ajax(
		    {
		    type: "POST",
		    url: "/showuser?type=userloginstatus",
		    global: false,
		    async: false,
		    datatype: "json",
		    data: {"username":$("#edituser option:selected").attr("username"), "userpassword":$("#current_password").val()},
		    beforeSend: function(xhr) {
			xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		    },
                    success: function(resp)
		    {
			if(resp["gkstatus"]==0){
			    $("#passconfirm_admin").prop("disabled", false);
			    $("#pass_admin").prop("disabled", false);
			    $("#pass_admin").focus();
			}
			else{
			    $("#passconfirm_admin").prop("disabled", true);
			    $("#pass_admin").prop("disabled", true);
			    $("#curpass-not-valid").alert();
			    $("#curpass-not-valid").fadeTo(2250, 200).slideUp(500, function(){
				$("#curpass-not-valid").hide();
			    });
			    }
		    }
		});
	    }
	}
	if(e.which==38){
	    $("#editname").focus();
	}
    });

    $("#pass_admin").keydown(function(e){
	if (e.which == 13){
	    $("#passconfirm_admin").focus();
	}
	if (e.which == 38){
	    $("#current_password").focus();
	}
    });

    $("#passconfirm_admin").keydown(function(e){
	if(e.which==13){
	    $("#question").focus();
	}
	if(e.which==38){
	    $("#pass_admin").focus();
	}
    });

    $("#passconfirm_admin").blur(function(event) {
	if ($.trim($("#pass_admin").val()) != $.trim($("#passconfirm_admin").val())) {
	    $("#checkpassuser-blank-alert").alert();
	    $("#checkpassuser-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#checkpassuser-blank-alert").hide();
	    });
	    $("#pass_admin").focus();
	    return false;
	}
	if($("#edituser option:selected").attr("role") == "Admin"){
	    if($.trim($("#current_password").val())=="") {
		$("#curpass-blank-alert").alert();
		$("#curpass-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#curpass-blank-alert").hide();
		});
		$("#current_password").focus().select();
	    }
	}
    });

    
    //Key event for Edit Password
    $("#password").keydown(function(e){
	if (e.which==13){
	    $("#passwordconfirm").focus();
	}
	if (e.which==38){
	    $("#editname").focus();
	}
    });

    //Key event For Confirm Password
    $("#passwordconfirm").keydown(function(e){
	if(e.which==13){
	    $("#userrole").focus();
	}
	if(e.which==38){
	    e.preventDefault();
	    $("#password").focus();
	}
    });

    $("#passwordconfirm").blur(function(event) {
	if ($.trim($("#password").val()) != $.trim($("#passwordconfirm").val())) {
	    $("#checkpassuser-blank-alert").alert();
	    $("#checkpassuser-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#checkpassuser-blank-alert").hide();
	    });
	    $("#password").focus();
	    return false;
	}
    });

    //Key event for User Role
    $("#userrole").keydown(function(e) {
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
		$("#passwordconfirm").focus();
	    }
	}
    });

   //Key event for Security Question
   $("#question").keydown(function(e) {
       if (e.which==13){
	   e.preventDefault();
	   if ($("#question").val() == "") {
	       $("#secque-blank-alert").alert();
	       $("#secque-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
		   $("#secque-blank-alert").hide();
	       });
	       $("#question").focus().select();
	       return false;
	   }else {
	       $("#answer").focus();
	   }
       }
       if (e.which==38) {
	   e.preventDefault();
	   if($("#edituser option:selected").attr("role") == "Admin"){
	       $("#editname").focus();
	   }
	   else{
	       $("#userrole").focus();
	   }
       }
   });

   //Key event for Security Answer
    $("#answer").keydown(function(e){
	if (e.which==13){
	    if ($.trim($("#answer").val()) == "") {
	    $("#secans-blank-alert").alert();
            $("#secans-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#secans-blank-alert").hide();
            });
		$("#answer").focus().select();
		return false;
	    };
	    $("#edusrsubmit").focus();
	}else{
	    if (e.which==38) {
		$("#question").focus();
	    }
	}
    });

    //Key Event for Select Godown Table.
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
    
   //To reset all data  
    $("#reset").click(function(event) {
	event.preventDefault();
        $("a[href ='#user_edit']").click();
    });

    $("#smalllink").click(function(event) {
	event.preventDefault();
        $("#moresmall").toggle();
	if ($("#moresmall").is(':visible')){
	    $("#current_password").focus();
	}
    });

   //Delete User from oraganization
    $(document).off("click", "#delete").on("click", "#delete", function(event) {
	event.preventDefault();     
        $('.modal-backdrop').remove();
        $('.modal').modal('hide');
	$('#m_confirmdel').modal('show').on('click', '#usrdel', function(e) {
	    $.ajax({
		type: "POST",
                url: "/deleteuser",
                global: false,
                async: false,
                datatype: "json",
                data: {
		    "username": $("#edituser option:selected").val()
		},
		beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                },
                success: function(resp) {
		    if (resp["gkstatus"] == 0) {
			$('.modal-backdrop').remove();
                        $("#delsuccess-alert").alert();
                        $("#delsuccess-alert").fadeTo(2250, 500).slideUp(500, function() {
			    $("#delsuccess-alert").hide();
			    $("a[href ='#user_create']").click();
                        });
			return false;
		    }
		    else if (resp["gkstatus"] == 3) {
                        $("#connectionfailed-alert").alert();
                        $("#connectionfailed-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#connectionfailed-alert").hide();
                        });
                        $("#editname").focus().select();
			return false;
                    }
		}
	    });
	});

	$('#m_confirmdel').on('shown.bs.modal', function(event) {
	    $("#m_cancel").focus();
        });

        $('#m_confirmdel').on('hidden.bs.modal', function(event) {
            $("#edituser").focus();
        });
    });

    $(document).off("keyup").on("keyup", function(e) {
	if (e.which == 45) {
	    e.preventDefault();
	    $("#edusrsubmit").click();
	}
    });
    //Submit Button Validation
    $("#edusrsubmit").click(function(e) {
	if ($.trim($("#editname").val()) == "") {
	    $("#blank-alert").alert();
            $("#blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#blank-alert").hide();
            });
            $("#editname").focus().select();
            return false;
	};
	if($("#edituser option:selected").attr("role") == "Admin" && $.trim($("#passconfirm_admin").val()) != ""){
	  if ($.trim($("#pass_admin").val()) == "") {
            $("#password-blank-alert").alert();
            $("#password-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#password-blank-alert").hide();
            });
            $("#pass_admin").focus().select();
            return false;
        };
        if ($.trim($("#passconfirm_admin").val()) == "") {
            $("#confpassword-blank-alert").alert();
            $("#confpassword-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#confpassword-blank-alert").hide();
            });
            $("#passconfirm_admin").focus().select();
            return false;
        };  
	}
	else if($("#edituser option:selected").attr("role") != "Admin"){	    
        if ($.trim($("#password").val()) == "") {
            $("#password-blank-alert").alert();
            $("#password-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#password-blank-alert").hide();
            });
            $("#password").focus().select();
            return false;
        };
        if ($.trim($("#passwordconfirm").val()) == "") {
            $("#confpassword-blank-alert").alert();
            $("#confpassword-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#confpassword-blank-alert").hide();
            });
            $("#passwordconfirm").focus().select();
            return false;
        };
	}
	if ($.trim($("#question").val()) == "") {
	    $("#secque-blank-alert").alert();
            $("#secque-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#secque-blank-alert").hide();
            });
            $("#question").focus().select();
            return false;
        };
	if ($.trim($("#answer").val()) == "") {
	    $("#secans-blank-alert").alert();
            $("#secans-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#secans-blank-alert").hide();
            });
	    $("#answer").focus().select();
	    return false;
	};

	//Selected Godown list.
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

        //To store Edited Data.
	var dataset={"userid": $("#edituser option:selected").val(),
		     "username": $("#editname").val(),
		     "userquestion": $("#question").val(),
		     "useranswer": $("#answer").val()
		    };
	if($("#edituser option:selected").attr("role") == "Admin" && $.trim($("#passconfirm_admin").val()) != ""){
	    dataset["userpassword"]=$("#pass_admin").val();
	}
	if($("#edituser option:selected").attr("role") != "Admin" && $.trim($("#passwordconfirm").val()) != ""){
	    dataset["userpassword"]=$("#passwordconfirm").val();
	    dataset["userrole"]=$("#userrole").val();
	}
	if($("#userrole").val()==3){
	    dataset["godowns"]=JSON.stringify(selectedgodowns);
	}
	$.ajax({
	    type: "POST",
            url: "/showuser?type=updateuser",
            global: false,
            async: false,
            datatype: "json",
            data:dataset,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
            success: function(resp) {
		if (resp["gkstatus"] == 0) {
		    if($("#edituser option:selected").attr("role") == "Admin"){
			$("#success-alert").alert();
			$("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
			    $("#success-alert").hide();
			});
			location.reload();//After Admin successfully edited hole page refresh.
		    }else{
			$("#reset").click();
			$("#success-alert").alert();
			$("#success-alert").fadeTo(2250, 500).slideUp(500, function() {
                            $("#success-alert").hide();
			});
		    }
                } else if (resp["gkstatus"] == 1) {
                    $("#duplicate-alert").alert();
                    $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#duplicate-alert").hide();
                    });
                    $("#editname").focus().select();
                } else {
                    $("#failure-alert").alert();
                    $("#failure-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#failure-alert").hide();
                    });
                    $("#all").focus().select();
		}
            }
        });
       e.preventDefault();
    });
 });
    
