$(document).ready(function () {
  $('.sel_proj').select2({
    type: 'bootstrap'
  });
  $('#sub_task0').select2({
    type: 'bootstrap'
  });
  $(document).on("change", '#proj0', function () {
    var projectId = $(this).val();
    // $("sub_task0").empty().trigger("change");
    $("#sub_task0").empty();
    $("#sub_task0").append("<option value=''>Not Provided</option>");

    $.ajax({
      url: `/admin/project/get/sub/task/by/project_id/${projectId}`,
      type: 'get',
      dataType: 'json',
      success: function (response) {
        var len = response.data.length;
        for (var i = 0; i < len; i++) {
          var id = response.data[i]['_id'];
          var name = response.data[i]['sub_task'];

          $("#sub_task0").append("<option value='" + name + "'>" + name + "</option>");
        }
        $("#sub_task0").select2("refresh");
      },
      error: function(err) {
        console.log(err.error);
      }
    });
  })
  // $('.date').val(moment().format('L'))
  $('.date').daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    autoUpdateInput: false,
    maxYear: parseInt(moment().format('YYYY'),10),
    autoApply: true
  });

  $('.date').on('apply.daterangepicker', function(ev, picker) {
    // console.log(picker.startDate.format('YYYY-MM-DD'));
    // console.log(picker.endDate.format('YYYY-MM-DD'));
    $(this).val(picker.startDate.format('MM/DD/YYYY'));
    validateDup();
  });

  $(document).on("click", ".addmore", function () {
    var counterindex = $("#addmoreTable tbody tr:last-child").attr('tr_count');
    if (isNaN(counterindex)) {
      counterindex = 0
    } else {
      counterindex++;
    }

    var htmlContent = `
      <tr tr_count = "${counterindex}">
        <td>
          <select id="proj${counterindex}" class="form-control sel_proj" name="project_id[]" style="height: 20px !important" required="">
            <option value="">--- Select Project ---</option>
            ${allProjectsObj.map(project => `
              ${project.project_id ? `<option value=${project.project_id._id}>${project.project_id.name}</option>` : ""}
            `)}
          </select>
        </td>
        <td>
          <input type='text' id="date${counterindex}" name='date[${counterindex}]' style="height: 30px !important;" class='form-control date' required="" autocomplete="off" value="">
        </td>
        <td>
          <input type='text' name='hour[${counterindex}]' style="height: 30px !important;" class='form-control hour decimal' required="">
        </td>
        <td>
            <select id="sub_task${counterindex}" class="form-control sel_task" name="sub_task[]" style="height: 20px !important">
              <option value="Not Provided" selected>Not Provided</option>
            </select>
        </td>
        <td>
          <textarea class="custom-input notes" name="notes[${counterindex}]" placeholder="Any notes.." style="height: 32px; width: 100%; border: 1px solid rgb(235, 237, 242); margin-top: 3px; border-radius: 5px;"></textarea>
        </td>
        <td>
          <button class='btn btn-danger btn-sm remove' type="button">
            Remove
          </button>
        </td>
      </tr>`;

    $("#addmoreTable tbody").append(htmlContent);

    $(`#date${counterindex}`).daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      autoUpdateInput: false,
      maxYear: parseInt(moment().format('YYYY'),10),
      autoApply: true
    });

    $(`#date${counterindex}`).on('apply.daterangepicker', function(ev, picker) {
      // console.log(picker.startDate.format('YYYY-MM-DD'));
      // console.log(picker.endDate.format('YYYY-MM-DD'));
      $(this).val(picker.startDate.format('MM/DD/YYYY'));
      validateDup();
    });

    $(`#proj${counterindex}`).select2({
      type: 'bootstrap'
    });

    $(`#sub_task${counterindex}`).select2({
      type: 'bootstrap'
    });

    $(document).on("change", `#proj${counterindex}`, function () {
      var projectId = $(this).val();
      // $("sub_task0").empty().trigger("change");
      $(`#sub_task${counterindex}`).empty();
      $(`#sub_task${counterindex}`).append("<option value=''>Not Provided</option>");

      $.ajax({
        url: `/admin/project/get/sub/task/by/project_id/${projectId}`,
        type: 'get',
        dataType: 'json',
        success: function (response) {
          var len = response.data.length;
          for (var i = 0; i < len; i++) {
            var id = response.data[i]['_id'];
            var name = response.data[i]['sub_task'];

            $(`#sub_task${counterindex}`).append("<option value='" + name + "'>" + name + "</option>");
          }
          $(`#sub_task${counterindex}`).select2("refresh");
        },
        error: function(err) {
          console.log(err.error);
        }
      });
    })
  });

  $(document).on("click", ".remove", function () {
    if ($("#addmoreTable tbody tr").length > 1) {
      $(this).closest("tr").remove();
    } else {
      alert("Atleast one row should be there")
    }
  });

  // $(document).on('change', '.date', function () {
  //   alert()
  //   validateDup()
  // })

  $(document).on("keyup", ".decimal", function () {
    var val = $(this).val();
    if(isNaN(val)){
         val = val.replace(/[^0-9\.]/g,'');
         if(val.split('.').length>2)
             val =val.replace(/\.+$/,"");
    }
    $(this).val(val);
  })

  $(document).on('change', '.sel_proj', function () {
    validateDup()
  });

  function validateDup(){
    var arr = [];
    $('.date').each(function(index,data) {
      var changeEve = $(this);
      var exitflag = false;
      var dateVal = $(this).closest("tr").find('.date').val();;
      var projId = $(this).closest("tr").find('.sel_proj').val();
      if(index ==0){
        arr.push({ proj: projId, dateVal: dateVal, elemobj:this });
      }else{
        arr.map(ar =>{
          // console.log(dateVal, ar.dateVal);
          // if(projId == ar.proj && dateVal == ar.dateVal && projId != "" && dateVal != ""){
          //   // arr.push({ proj: projId, dateVal: dateVal });
          //   alert("Same project with same date already exist!");
          //   changeEve.closest("tr").remove();
          //   exitflag = true;
          // }else{
          //   arr.push({ proj: projId, dateVal: dateVal,elemobj:this});
          // }
        });
      }
      if(exitflag == true){
        return false;
      }
      // arr.push({ proj: projId, dateVal: dateVal });
    })
  }

  // $(document).on("change", '.sel_proj', function () {
  //   var flag = false;
  //   $('select.sel_proj').each(function (index,data) {
  //     // console.log(index,data);
  //     // console.log(this.value);
  //     var state = this.value;
  //     // console.log(this);
  //     if (state != "") {
  //       $('.sel_proj')
  //         .not(this)
  //         .filter(function () {
  //           if (!flag) {
  //             if (this.value == state) {
  //               // check for the same date
  //               $('.date').each(function() {
  //                 console.log(this);
  //               })
  //               flag = true;
  //               $(this).val("");
  //               alert("This project is already selected! Please choose different project.");
  //               $(this).closest("tr").remove();
  //               return false;
  //             } else {
  //               // alert("not same");
  //               return false;
  //             }
  //           }
  //         });
  //     }
  //   });
  // });

  // $('.decimal').keyup(function(){
  //   var val = $(this).val();
  //   if(isNaN(val)){
  //        val = val.replace(/[^0-9\.]/g,'');
  //        if(val.split('.').length>2)
  //            val =val.replace(/\.+$/,"");
  //   }
  //   $(this).val(val);
  // });
})

// $('.decimal').keyup(function(){

// });