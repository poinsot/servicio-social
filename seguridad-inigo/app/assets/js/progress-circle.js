// progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

var bar = new ProgressBar.Circle(document.getElementById("circlecontainer"), {
    color: '#aaa',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 4,
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 1400,
    text: {
      autoStyleContainer: false
    },
    // cambiar el color según el theme
    from: { color: '#FF9800', width: 1 },
    to: { color: '#FF9800', width: 4 },
    // Set default step function for all animate calls
    step: function(state, circle) {
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);
  
      // value() puede salirse ligeramente de [0,1] durante el tween; clamp para texto
      var raw = circle.value();
      if (!isFinite(raw)) {
        raw = 0;
      }
      raw = Math.min(1, Math.max(0, raw));
      var pct = Math.round(raw * 100);
      // Ocultar solo "0%" dejaba el círculo en blanco cuando el progreso real redondea a 0 (<0,5%)
      if (pct === 0 && raw > 0.0005) {
        pct = 1;
      }
      circle.setText(pct + '%');
  
    }
  });
  bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
  bar.text.style.fontSize = '30px';
  bar.text.style.color = '#000';

  
  // Number from 0.0 to 1.0
  
  function show(x) {
      var t = typeof x === 'string' ? parseFloat(x, 10) : Number(x);
      if (!isFinite(t)) {
        t = 0;
      }
      if (t < 0) {
        t = 0;
      }
      if (t > 1) {
        t = 1;
      }
      bar.stop();
      bar.set(t);
  }