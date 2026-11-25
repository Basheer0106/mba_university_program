/* Inline SVG icons.
 *   ICONS.<name>   – small 24px outline icons used in form fields, the stepper and the trust strip
 *   ICONS.big.<n>  – 64px coloured icons for the highlights strip and the footer logo
 * index.html uses  <span data-icon="name">  placeholders; app.js fills them from here.
 */
(function () {
  var s = function (inner, strokeWidth) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (strokeWidth || 2) +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + inner + '</svg>'
    );
  };

  var N = '#0f2a6b';
  var b = function (inner) {
    return '<svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" focusable="false">' + inner + '</svg>';
  };

  window.ICONS = {
    user: s('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
    mail: s('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    phone: s('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
    cap: s('<polygon points="12 4 22 9 12 14 2 9"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>'),
    briefcase: s('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>'),
    calendar: s('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    pin: s('<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
    percent: s('<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>'),
    wallet: s('<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>'),
    shield: s('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'),
    headset: s('<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.5" y="13" width="4" height="6" rx="1.5"/><rect x="17.5" y="13" width="4" height="6" rx="1.5"/><path d="M20 19c0 2-2 3-5 3"/>'),
    bolt: s('<polygon points="13 2 4 14 11 14 10 22 20 9 13 9"/>'),
    check: s('<polyline points="5 12 10 17 19 7"/>', 3),
    arrow: s('<path d="M5 12h14M13 6l6 6-6 6"/>'),

    big: {
      cap: b(
        '<polygon points="32,8 61,21 32,34 3,21" fill="' + N + '"/>' +
        '<path d="M15 29v12c0 5 8 10 17 10s17-5 17-10V29L32 38z" fill="' + N + '"/>' +
        '<path d="M56 23v19" stroke="' + N + '" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="56" cy="45" r="3" fill="' + N + '"/>'
      ),
      laptop: b(
        '<rect x="10" y="10" width="44" height="31" rx="3.5" fill="none" stroke="' + N + '" stroke-width="4.5"/>' +
        '<polygon points="28,18 28,33 41,25.5" fill="' + N + '"/>' +
        '<rect x="3" y="45" width="58" height="7" rx="3.5" fill="' + N + '"/>'
      ),
      calendar: b(
        '<rect x="9" y="12" width="46" height="44" rx="6" fill="none" stroke="' + N + '" stroke-width="4.5"/>' +
        '<rect x="9" y="12" width="46" height="12" rx="5" fill="' + N + '"/>' +
        '<rect x="19" y="5" width="5" height="13" rx="2.5" fill="' + N + '"/>' +
        '<rect x="40" y="5" width="5" height="13" rx="2.5" fill="' + N + '"/>' +
        [18, 28, 38].map(function (x) {
          return '<rect x="' + x + '" y="30" width="8" height="7" rx="1.5" fill="' + N + '"/>' +
                 '<rect x="' + x + '" y="41" width="8" height="7" rx="1.5" fill="' + N + '"/>';
        }).join('')
      ),
      medal: b(
        '<polygon points="20,38 12,60 23,54 29,61 34,40" fill="#e8472b"/>' +
        '<polygon points="44,38 52,60 41,54 35,61 30,40" fill="#f26a3b"/>' +
        '<circle cx="32" cy="26" r="21" fill="#f4a31c"/>' +
        '<circle cx="32" cy="26" r="21" fill="none" stroke="#e8890b" stroke-width="3" stroke-dasharray="4 3"/>' +
        '<circle cx="32" cy="26" r="15" fill="#ffc72c" stroke="#e8890b" stroke-width="2"/>' +
        '<polygon points="32,15 34.8,22.4 42.7,22.7 36.5,27.6 38.6,35.2 32,30.8 25.4,35.2 27.5,27.6 21.3,22.7 29.2,22.4" fill="#f4a31c"/>'
      ),
      briefcase: b(
        '<path d="M22 18v-4a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v4" fill="none" stroke="' + N + '" stroke-width="4.5"/>' +
        '<rect x="5" y="17" width="54" height="36" rx="7" fill="' + N + '"/>' +
        '<rect x="27" y="29" width="10" height="9" rx="2" fill="none" stroke="#fff" stroke-width="2.5"/>'
      ),
      globe: b(
        '<circle cx="32" cy="32" r="26" fill="none" stroke="' + N + '" stroke-width="4.5"/>' +
        '<ellipse cx="32" cy="32" rx="11" ry="26" fill="none" stroke="' + N + '" stroke-width="3.5"/>' +
        '<path d="M32 6v52M7 24h50M7 40h50" stroke="' + N + '" stroke-width="3.5" fill="none"/>'
      )
    }
  };

  /* fill every <span data-icon="..."> placeholder in the static HTML */
  document.addEventListener('DOMContentLoaded', function () {
    var nodes = document.querySelectorAll('[data-icon]');
    for (var i = 0; i < nodes.length; i++) {
      var name = nodes[i].getAttribute('data-icon');
      // the strip / footer use the big coloured set; trust items use the small outline set
      var svg = nodes[i].classList.contains('trust-icon') ? window.ICONS[name] : window.ICONS.big[name];
      if (svg) nodes[i].innerHTML = svg;
    }
  });
})();
