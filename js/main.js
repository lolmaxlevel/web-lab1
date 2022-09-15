function isInt(value) {
  return !isNaN(value) &&
      parseInt(Number(value)) == value &&
      !isNaN(parseInt(value, 10));
}
function isFloat(str) {
  if (typeof str != "string") return false
  return !isNaN(str) &&
      !isNaN(parseFloat(str))
}

  $('#example').on('click', function(e) {
    var pos = findPos(this);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;
    if (!validateR()) return;
    let r_val = document.getElementById('r-text-input').value
    $.ajax({
      url: 'php/main.php',
      method: 'POST',
      data: {
        'type':'img',
        'x_cord':x,
        'y_cord':y,
        'r':r_val,
        'timezone': new Date().getTimezoneOffset()
      },
      dataType: "json",
      beforeSend: function() {
        $('.button').attr('disabled', 'disabled');
      },
      success: function(data) {
        $('.button').attr('disabled', false);
          newRow = '<tr>';
          newRow += '<td>' + data.xval + '</td>';
          newRow += '<td>' + data.yval + '</td>';
          newRow += '<td>' + data.rval + '</td>';
          newRow += '<td>' + data.curtime + '</td>';
          newRow += '<td>' + data.exectime + '</td>';
          newRow += '<td>' + data.hitres + '</td>';
          $('#result-table').append(newRow);

      }
    });
  });

  function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
      return { x: curleft, y: curtop };
    }
    return undefined;
  }
  
  function validateY() {
    let Y_MAX = 5;
    let Y_MIN = -3;
    let y_val = document.getElementById('y-text-input').value;
    let float_y_val = parseFloat(Number(y_val));
    let hiddenBox = $( ".y-error-box" );
    if (isFloat(y_val) && float_y_val <= Y_MAX && float_y_val >= Y_MIN){
      hiddenBox.hide();
      return true
    }else {
      hiddenBox.show();
    }
  }

  
  function validateR() {
    let R_MAX = 4;
    let R_MIN = 1;
    let r_val = document.getElementById('r-text-input').value;
    let int_r_val = parseInt(Number(r_val));
    let hiddenBox = $( ".r-error-box" );

    if (isInt(r_val) && int_r_val <= R_MAX && int_r_val >= R_MIN) {
      hiddenBox.hide();
      return true
    } else {
      hiddenBox.show();
    }
  }
  
  function validateForm() {
    return validateY() & validateR();
  }

  $('#input-form').on('submit', function(event) {
    event.preventDefault();
    if (!validateForm()) return;
    $.ajax({
      url: 'php/main.php',
      method: 'POST',
      data: $(this).serialize() + '&timezone=' + new Date().getTimezoneOffset() + '&type=abob',
      dataType: "json",
      beforeSend: function() {
        $('.button').attr('disabled', 'disabled');
      },
      success: function(data) {
        $('.button').attr('disabled', false);
          newRow = '<tr>';
          newRow += '<td>' + data.xval + '</td>';
          newRow += '<td>' + data.yval + '</td>';
          newRow += '<td>' + data.rval + '</td>';
          newRow += '<td>' + data.curtime + '</td>';
          newRow += '<td>' + data.exectime + '</td>';
          let color = data.hitres ? "green":"red";
          newRow += '<td>' + '<span class='+color+'>'+ data.hitres +'</span>'+ '</td>';
          $('#result-table').append(newRow);
      }
    });
  });
