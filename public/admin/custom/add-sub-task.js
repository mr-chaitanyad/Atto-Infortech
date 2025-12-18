$(document).ready(function () {
  $('.sel_proj').select2({
    type: 'bootstrap'
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
          <textarea class="" name="sub_task[${counterindex}]" placeholder="Enter sub task" style="height: 32px; width: 100%; border: 1px solid rgb(235, 237, 242); margin-top: 3px; border-radius: 5px;" required></textarea>
        </td>
        <td>
          <button class='btn btn-danger btn-sm remove' type="button">
            Remove this sub task
          </button>
        </td>
      </tr>
    `;

    $("#addmoreTable tbody").append(htmlContent);
  });

  $(document).on("click", ".remove", function () {
    if ($("#addmoreTable tbody tr").length > 1) {
      $(this).closest("tr").remove();
    } else {
      alert("Atleast one row should be there")
    }
  });
})