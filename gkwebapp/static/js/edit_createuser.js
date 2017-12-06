//Show UserDetails
$(document).ready(function() {
    $('.modal-backdrop').remove();
    $("#all").focus();
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
		//$("#password").prop(userdetails["password"]);
		$("#password").prop("disabled",true);
		$("#passwordconfirm").prop("disabled",true);
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
		$("#GodInCharge").show();
		$("#usertable").show();
		if(userdetails["userrole"]== -1){
		    $("#delete").hide();
		    $("#GodInCharge").hide();
		    $("#usertable").hide();
		}
		if (userdetails["userrole"]== 3){
		    console.log(userdetails["godowns"]);
		    let i=0;
		    console.log("#latable tbody tr:eq('+i+')".attr("value"));
		    /*for(let i=0; i<$('#latable tbody tr').length; i++){
	            if($('#latable tbody tr:eq('+i+')').attr("value") in userdetails["godowns"]){
			('#latable tbody tr td').is(":checked");
			}
		   //console.log(($('#latable tbody tr:eq('+i+')').attr("value"));
		}*/
		}
               }
           });
       });

    
 //For Edit Button
 $("#edit").click(function(event) {
        event.preventDefault();
        $("#edusrsubmit").show();
        $("#editname").prop("disabled", false);
        $("#password").prop("disabled", false);   
        $("#passwordconfirm").prop("disabled", false);
        $("#userrole").prop("disabled", false);
        $("#question").prop("disabled", false);
        $("#answer").prop("disabled", false);
        $("#edit").hide();
        $("#editname").focus().select();
    });

  // When "Godown In charge" role is select from userrole will gives Godown List.
  if (sessionStorage.invflag==1) {
    $.ajax(
       {
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
    
    //Event For New User Name
    $("#editname").keydown(function(e){
    	if (e.which==13) {
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
    	                 $("#password").focus();
    	               }
    	    }
     });
    
    
    //Event for Edit Password
    $("#password").keydown(function(e){
               if (e.which==13)
               {
                   e.preventDefault();
                  $("#passwordconfirm").focus();
               }
               if (e.which==38)
               {
                  $("#editname").focus();
               }
          });

    //Event For Confirm Password
    $("#passwordconfirm").keydown(function(e){
     if (e.which==13)
      {
        e.preventDefault();
        $("#userrole").focus();
      }
     if (e.which==38)
      {
        $("#password").focus();
      }
    });

    $("#passwordconfirm").blur(function(event) {
        if ($.trim($("#password").val())!=$.trim($("#passwordconfirm").val())) {
          $("#checkpassuser-blank-alert").alert();
          $("#checkpassuser-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#checkpassuser-blank-alert").hide();
          });
          $("#password").focus();
          return false;
        }
    });

    //Event for User Role
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

   //Event for Security Question
   $("#question").keydown(function(e){
        if (e.which==13)
        {
          e.preventDefault();
            $("#answer").focus().select();
        }
        else if (e.which==38) {
          e.preventDefault();
          $("#userrole").focus();
        }
      });

   //Event for Security Answer
   $("#answer").keydown(function(e){
        if (e.which==13)
        {
          e.preventDefault();
            $("#edusrsubmit").focus();
        }
    if (e.which==38) {
          e.preventDefault();
          $("#question").focus();
        }
   });

    $("#edituser").keydown(function(e) {
        if ($(".edituserform").is(':visible')) {
            if (e.which == 13) {
                $("#edit").click();
            }
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
        $('#m_confirmdel').modal('show').on('click', '#usrdel', function(e)
	 {
	     console.log("User ID");
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
            $("#username-blank-alert").alert();
            $("#username-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#username-blank-alert").hide();
            });
            $("#editname").focus().select();
            return false;
        };
        if ($.trim($("#password").val()) == "") {
            $("#password-blank-alert").alert();
            $("#password-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#password-blank-alert").hide();
            });
            $("#password").focus().select();
            return false;
        };
        if ($.trim($("#passwordconfirm").val()) == "") {
            $("#checkpassuser-blank-alert").alert();
            $("#checkpassuser-blank-alert").fadeTo(2250, 500).slideUp(500, function() {
                $("#checkpassuser-blank-alert").hide();
            });
            $("#passwordconfirm").focus().select();
            return false;
        };


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


        //For Edit Data load purpose

        var userid = $("#edituser option:selected").val();
        var username = $("#editname").val();
        var userpassword = $.trim($("#password").val());
        var userrole = $("#userrole").val();
        var userquestion = $("#question").val();
        var useranswer = $("#answer").val();
        $.ajax({
            type: "POST",
            url: "/showuser?type=edituser",
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
    
