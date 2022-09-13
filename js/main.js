$(function() {
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  var example = document.getElementById('example');
  var context = example.getContext('2d');
  make_base();

  function make_base()
  {
    base_image = new Image();
    base_image.src = 'img/graph.png';
    base_image.onload = function(){
      context.drawImage(base_image, 0, 0);
    }
  }
  $('#example').on('click', function(e) {
    var pos = findPos(this);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;
    var coord = "x=" + x + ", y=" + y;
    var c = this.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data;
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    $('#status').html(coord + "<br>" + hex);
    console.log(hex,x,y)
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

  function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
  }

  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function randomColor() {
    return `rgb(${randomInt(256)}, ${randomInt(256)}, ${randomInt(256)})`
  }
  function validateX() {
    if ($('.x-radio').is(':checked')) {
      $('.xbox-label').removeClass('box-error');
      return true;
    } else {
      $('.xbox-label').addClass('box-error');
      return false;
    }
  }
  
  function validateY() {
    const Y_MIN = -5;
    const Y_MAX = 5;
  
    let yField = $('#y-textinput');
    let numY = yField.val().replace(',', '.');
  
    if (isNumeric(numY) && numY >= Y_MIN && numY <= Y_MAX)
    {
      yField.removeClass('text-error');
      return true;
    } else {
      yField.addClass('text-error');
      return false;
    }
  }
  
  function validateR() {
    if ($('.r-checkbox').is(':checked')) {
      $('.rbox-label').removeClass('box-error');
      return true;
    } else {
      $('.rbox-label').addClass('box-error');
      return false;
    }
  }
  
  function validateForm() {
    return validateX() & validateY() & validateR();
  }

  $('#input-form').on('submit', function(event) {
    event.preventDefault();
    if (!validateForm()) return;
    $.ajax({
      url: 'php/main.php',
      method: 'POST',
      data: $(this).serialize() + '&timezone=' + new Date().getTimezoneOffset(),
      dataType: "json",
      beforeSend: function() {
        $('.button').attr('disabled', 'disabled');
      },
      success: function(data) {
        $('.button').attr('disabled', false);
        if (data.validate) {
          newRow = '<tr>';
          newRow += '<td>' + data.xval + '</td>';
          newRow += '<td>' + data.yval + '</td>';
          newRow += '<td>' + data.rval + '</td>';
          newRow += '<td>' + data.curtime + '</td>';
          newRow += '<td>' + data.exectime + '</td>';
          newRow += '<td>' + data.hitres + '</td>';
          $('#result-table').append(newRow);
        }
      }
    });
  });
});
