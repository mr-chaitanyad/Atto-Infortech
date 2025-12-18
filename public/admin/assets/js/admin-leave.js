var minDate, maxDate;

$(document).ready(function() {

  // DataTables initialisation
  var tbl = $('#all-leave').DataTable({
    ordering: false,
    pageLength: 100
  });

  var start = moment();
  var end = moment();

  function cb(start, end) {
      $('#fromTo span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      let startDate = {
        year: parseInt(start.format('YYYY')),
        month: parseInt(start.format('MM')),
        date: parseInt(start.format('DD'))
      };
      let endDate = {
        year: parseInt(end.format('YYYY')),
        month: parseInt(end.format('MM')),
        date: parseInt(end.format('DD'))
      };

      swall("Please wait...");

      $.ajax({
        type: 'POST',
        url: `/admin/leave/filter/date`,
        dataType: "json",
        data: {
          start: startDate,
          end: endDate
        },
        success: function(result) {
          if (result.code == 200) {
            swal.close();
            tbl.clear().rows.add(result.data.newArr).draw();
            return;
          } else if (result.code == 309) {
            swal.close();
            swall("Something went wrong. Try again later!");
          } else if (result.code == 401) {
            swall("Something went wrong. Try again later!");
          } else {
            swal.close();
            notifyy("Something went wrong! Try again later.", "danger");
          }
        }
      })
  }

  function swall(text) {
    var SweetAlert2Demo = function () {
      //== Demos
      var initDemos = function () {
        swal(text, {
          buttons: false,
          timer: 2000,
          backdrop:true,
          closeOnClickOutside: false,
          closeOnEsc: false
        })
      };
      return {
          //== Init
          init: function () {
            initDemos();
          },
        };
      }();
    jQuery(document).ready(function () {
      SweetAlert2Demo.init();
    });
  }

  function notifyy(text, type) {
    $.notify({
      message: text
    },{
      type: type,
      showProgressbar: false
    },
    {
      offset: 20,
      spacing: 10,
      z_index: 1031,
      delay: 5000,
      timer: 1000
    });
  }

  $('#fromTo').daterangepicker({
      startDate: start,
      endDate: end,
      autoUpdateInput: false,
      locale: {
        cancelLabel: 'Clear'
      }
  }, cb);

  $('#clear_filter').click(function() {
    window.location.reload();
    return;
  })
  // =====================================================
// SECOND DATE RANGE PICKER (FOR ADD EMPLOYEE FANCYBOX)
// =====================================================

if ($('#empDateRange').length > 0) {

  var empStart = moment();
  var empEnd = moment();

  function empCb(empStart, empEnd) {
      $('#empDateRange span').html(
          empStart.format('MMMM D, YYYY') + ' - ' + empEnd.format('MMMM D, YYYY')
      );

      $('#startDate').val(empStart.format('YYYY-MM-DD'));
      $('#endDate').val(empEnd.format('YYYY-MM-DD'));
  }

  $('#empDateRange').daterangepicker({
      startDate: empStart,
      endDate: empEnd,
      autoUpdateInput: false,
      locale: { cancelLabel: 'Clear' }
  }, empCb);

  $('#empDateRange').on('apply.daterangepicker', function (ev, picker) {
      empCb(picker.startDate, picker.endDate);
  });

  $('#empDateRange').on('cancel.daterangepicker', function () {
      $('#empDateRange span').html('Select range');
      $('#startDate').val('');
      $('#endDate').val('');
  });

}
});

