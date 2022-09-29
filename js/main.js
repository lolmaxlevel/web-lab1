//checks if string is an int number
function isInt(value) {
  return !isNaN(value) &&
      parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}
//checks if string is a float number
function isFloat(str) {
  if (typeof str != "string") return false
  return !isNaN(str) && !isNaN(parseFloat(str))
}
//sends request to main.php with params from data
function sendRequest(data){
  $.ajax({
    url: 'php/main.php',
    method: 'POST',
    data: data,
    dataType: "json",
    success: function(data) {
      let newRow = '<tr>';
      newRow += '<td>' + data.xval + '</td>';
      newRow += '<td>' + data.yval + '</td>';
      newRow += '<td>' + data.rval + '</td>';
      newRow += '<td>' + data.curtime + '</td>';
      newRow += '<td>' + data.exectime + '</td>';
      let color = data.result ? "green":"red";
      newRow += '<td>' + '<span class='+color+'>'+ data.result +'</span>'+ '</td>';
      $('#result-table').append(newRow);
    }
  });
}
//function to send a request if clicked on graph
  $('#graph').on('click', function(e) {
    let pos = findPos(this);
    let x = e.pageX - pos.x;
    let y = e.pageY - pos.y;
    let experimental = $('.specialCB:checked').val();
    if (!(experimental || validateR())) return;
    let r_val = document.getElementById('r-text-input').value
    let normalized_x = ((x - 23 - 80) / 80) * r_val;
    let normalized_y = -((y - 25 - 80) / 80) * r_val;
    let data= {
      'type':experimental? "experimental":"default",
      'xval':experimental? x : normalized_x,
      'yval':experimental? y : normalized_y,
      'rval':r_val,
      'timezone': new Date().getTimezoneOffset(),
    }
    sendRequest(data);
  });
//finds cursor pos
  function findPos(obj) {
    let curleft = 0, curtop = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return { x: curleft, y: curtop };
    }
    return undefined;
  }
  //validate functions
  function validateY() {
    let Y_MAX = 5;
    let Y_MIN = -3;
    let y_val = document.getElementById('y-text-input').value;
    let float_y_val = parseFloat(Number(y_val));
    if (isFloat(y_val) && float_y_val <= Y_MAX && float_y_val >= Y_MIN){

      $( ".y-error-box" ).hide();
      return true
    }else {
      $( ".y-error-box" ).show();
    }
  }

  function validateR() {
    let R_MAX = 4;
    let R_MIN = 1;
    let r_val = document.getElementById('r-text-input').value;
    let int_r_val = parseInt(Number(r_val));

    if (isInt(r_val) && int_r_val <= R_MAX && int_r_val >= R_MIN) {
      $( ".r-error-box" ).hide();
      return true
    } else {
      $( ".r-error-box" ).show();
    }
  }
  
  function validateForm() {
    return validateY() & validateR();
  }

//sends request when button clicked
  $('#input-form').on('submit', function(event) {
    event.preventDefault();
    if (!validateForm()) return;
    let data = $(this).serialize() + '&timezone=' + new Date().getTimezoneOffset() + '&type=default';
    sendRequest(data);
  });
