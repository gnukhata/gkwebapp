$(document).ready(function()
{
  var drsum = 0;
  var crsum = 0;

  $(".dramt").each(function()
  {
      drsum += +$(this).val();
      $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
  });

  $(".cramt").each(function(){
      crsum += +$(this).val();
      $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
  });

  $('#viewvoucher').find('input, textarea, select').attr('disabled','disabled');
  $('table#vctable > tbody tr').keynavigator(
    {
      cycle: false,
      activeClass: 'selected'
    }
  );

});
