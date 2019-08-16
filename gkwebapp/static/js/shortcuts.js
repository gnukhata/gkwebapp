$(document).ready(function(){
    if (sessionStorage.userrole== 3){
        $(".godowninchagehide").remove();
    }
    else if (sessionStorage.userrole== 2){
        $(".internalauditorhide").remove();
    }
    else if (sessionStorage.userrole== 1){
        $(".operatorhide").remove();
    }
    else if (sessionStorage.userrole== 0){
        $(".hidemanager").remove();
    }

    if (sessionStorage.orgt=="Not For Profit") {
        // If orgtype is Not for Profit than some heading and menu items text is changed.
        $(".hidenof").hide();
      }
      else{
        $(".hidefm").hide();
      }
});
