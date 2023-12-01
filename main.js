dragElement(document.getElementById("mydiv"));

$(function() {
    $( "#signature-pad" ).resizable();
});


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function appendToDiv(data){
  var img = document.createElement("img");
  img.src = data;
  var target = document.getElementById('result_pad')
  target.innerHTML = '';
  target.appendChild(img);
}

var canvas = document.getElementById('signature-pad');

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}

window.onresize = resizeCanvas;
resizeCanvas();

var signaturePad = new SignaturePad(canvas, {
  backgroundColor: 'rgb(255,255,255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
});

document.getElementById('save-png').addEventListener('click', function () {
  if (signaturePad.isEmpty()) {
    return alert("Please provide a signature first.");
  }
  
  var data = signaturePad.toDataURL('image/png');
  console.log(data);
  //window.open(data);
  appendToDiv(data);
});

document.getElementById('save-jpeg').addEventListener('click', function () {
  if (signaturePad.isEmpty()) {
    return alert("Please provide a signature first.");
  }

  var data = signaturePad.toDataURL('image/jpeg');
  console.log(data);
  appendToDiv(data);
});

document.getElementById('save-svg').addEventListener('click', function () {
  if (signaturePad.isEmpty()) {
    return alert("Please provide a signature first.");
  }

  var data = signaturePad.toDataURL('image/svg+xml');
  appendToDiv(data);
  console.log(data);
  console.log(atob(data.split(',')[1]));
 // window.open(data);
});

document.getElementById('clear').addEventListener('click', function () {
  signaturePad.clear();
});

document.getElementById('draw').addEventListener('click', function () {
  var ctx = canvas.getContext('2d');
  console.log(ctx.globalCompositeOperation);
  ctx.globalCompositeOperation = 'source-over'; // default value
});

document.getElementById('erase').addEventListener('click', function () {
  var ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'destination-out';
});
