//Show UserDetails
$(document).ready(function() {
    $('.modal-backdrop').remove();
    $("#edusrsubmit").hide();
    $("#edituser").bind("change", function(e) {
        $("#edusrsubmit").hide();
        var userid = $("#edituser option:selected").val();
        var username = $("#edituser option:selected").text();
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
                userdetails = resp["gkresult"];
                $("#editname").val(userdetails["username"]);
                $("#editname").prop("disabled", true);
                $("#editpwd").val(userdetails["password"]);
                $("#editpwd").prop("disabled", true);
                //$("#editpwdconfirm").val(userdetails[""]);
                //$("#editpwdconfirm").prop("disabled", true);
                $("#editrole").val(userdetails["userrole"]);
                $("#editrole").prop("disabled", true);
                $("#editsecquest").val(userdetails["question"]);
                $("#editsecquest").prop("disabled", true);
	        $("#editsecans").val(userdetails["answer"]);
                $("#editsecans").prop("disabled", true);
                $("#userid").val(userdetails["userid"]);
                $(".edituserform").show();
                $("#form-footer").show();
                $("#delete").show();
                $("#edit").show();
            }
        });
    });

/*//Number Of User
 $.ajax({
            type: "POST",
            url: "/showuser?type=list",
            data: {
                "userid": userid
            },
            global: false,
            async: false,
            dataType: "json",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
            success: function(resp) {
		user = resp["gkresult"];
            }
        });
    });

//For Edit Button
$("#edit").click(function(event) {
        event.preventDefault();
        $("#edusrsubmit").show();
        $("#editname").prop("disabled", false);
        $("#editpwd").prop("disabled", false);
        $("#editpwdconfirm").prop("disabled", false);
        $("#editrole").prop("disabled", false);
        $("#editsecquest").prop("disabled", false);
        $("#editsecans").prop("disabled", false);
        $("#edit").hide();
        $("#editname").focus().select();
    });

//Event For New User Name
$("#editname").keydown(function(e){
    	if (e.which == 13) {
    	      e.preventDefault();
    	      if ($.trim($("#editname").val())=="") {
    	          $("#blank-alert").alert();
    	          $("#blank-alert").fadeTo(2250, 200).slideUp(500, function(){
    	            $("#blank-alert").hide();
    	          });
    	          $("#editname").focus();
    	          return false;
    	        }
    	      else {
    	      $("#editpwd").focus();
    	      }
    	}
 });
    
//Event for Edit Password
$("#editpwd").keydown(function(e){
      if (e.which == 13) {
        e.preventDefault();
        $("#editpwdconfirm").focus();
      }
      else if(e.which == 38) {
        e.preventdefault();
        $("#editname").focus();
      }
    });

//Event For Confirm Password
 $("#editpwdconfirm").keydown(function(e){
      if (e.which==13)
      {
        e.preventDefault();
        $("#editrole").focus();
      }
      if (e.which==38) {
        $("#editpwd").focus();
      }
    });

$("#editpwdconfirm").blur(function(event) {
        if ($.trim($("#editpwd").val())!=$.trim($("#editpwdconfirm").val())) {
          $("#checkpassuser-blank-alert").alert();
          $("#checkpassuser-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#checkpassuser-blank-alert").hide();
          });
          $("#editpwd").focus();
          return false;
        }
      });

//Event for User Role
$(document).off("keydown","#editrole").on("keydown", '#editrole', function(e) {

        if (e.which == 13 || e.which == 9) {
          e.preventDefault();
         if ($(this).val()==3) {
           $("#latable tbody tr:first td:first input").focus().select();
         }
         else {
           $("#editsecquest").focus().select();
         }
     }

      if (e.which==38) {
        var s1 = $("#editrole option:selected").index();
        if (s1 == 0 || s1 == 1) {
          $("#editpwdconfirm").focus();
        }
      }
    });

//Event for Security Question
$("#editsecquest").keydown(function(e){
        if (e.which==13)
        {
          e.preventDefault();
          $("#editsecans").focus();
        }
        if (e.which==38) {
          e.preventDefault();
          $("#editrole").focus();
        }
      });

//Event for Security Answer

$("#editsecans").keydown(function(e){
        if (e.which==13)
        {
          e.preventDefault();
            $("#edusrsubmit").click();
        }
        if (e.which==38) {
          e.preventDefault();
          $("#editsecquest").focus();
        }
      });

   //To Edit User 
 $("#reset").click(function() {
        $("a[href ='#user_edit']").click();
    });

//Delete User

$(document).off("click", "#delete").on("click", "#delete", function(event) {
        event.preventDefault();
        $('.modal-backdrop').remove();
        $('.modal').modal('hide');
        $('#m_confirmdel').modal('show').on('click', '#usrdel', function(e) {

          if (prod==0) {
            var userid = $("#edituser option:selected").val();
            $.ajax({
                type: "POST",
                url: "/#?type=delete",
                global: false,
                async: false,
                datatype: "json",
                data: {
                    "userid": userid
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
                        //$("#user").click();
                        });
                    } else if (resp["gkstatus"] == 5) {
                        $("#transaction-alert").alert();
                        $("#transaction-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#transaction-alert").hide();
                        });
                        $("#edituser").focus().select();
                    }

                }
            });}
            else{
              $("#prod-alert").alert();
              $("#prod-alert").fadeTo(2250, 500).slideUp(500, function() {
                  $("#prod-alert").hide();
              });
              $("#edituser").focus().select();
              return false;
            }
        });


//
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
            $("#username-blank-alert").alert();
            $("#username-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#username-blank-alert").hide();
            });
            $("#editname").focus().select();
            return false;
        };
        if ($.trim($("#editpwd").val()) == "") {
            $("#password-blank-alert").alert();
            $("#password-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#password-blank-alert").hide();
            });
            $("#editpwd").focus().select();
            return false;
        };
        if ($.trim($("#editpwdconfirm").val()) == "") {
            $("#checkpassuser-blank-alert").alert();
            $("#checkpassuser-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#checkpassuser-blank-alert").hide();
            });
            $("#editpwdconfirm").focus().select();
            return false;
        };


if ($.trim($("#editsecquest").val()) == "") {
            $("#secque-blank-alert").alert();
            $("#secque-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#secque-blank-alert").hide();
            });
            $("#editsecquest").focus().select();
            return false;
        };

if ($.trim($("#editsecans").val()) == "") {
            $("#secans-blank-alert").alert();
            $("#secans-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#secans-blank-alert").hide();
            });
            $("#editsecans").focus().select();
            return false;
        };


//For Edit Data load purpose

var userid = $("#edituser option:selected").val();
        var username = $("#editname").val();
        var userpassword = $.trim($("#editpwd").val());
        var userrole = $("#editrole").val();
        var userquestion = $("#editsecquest").val();
        var useranswer = $("#editsecans").val();
        $.ajax({
            type: "POST",
            url: "/#showuser?type=edituser",
            global: false,
            async: false,
            datatype: "json",
            data: {
                "userid": userid,
                "username": username,
                "userpassword": userpassword,
                "userrole": userrole,
                "userquestion": userquestion,
                "useranswer": useranswer
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
                    $("#editname").focus().select();
                } else {
                    $("#failure-alert").alert();
                    $("#failure-alert").fadeTo(2250, 500).slideUp(500, function() {
                        $("#failure-alert").hide();
                    });
                    $("#editname").focus().select();
                }
            }
        });
        e.preventDefault();
});
});
*/    
