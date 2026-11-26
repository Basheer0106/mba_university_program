/* Higher Education India – Online MBA 2027
 *
 * One page. This script does three things:
 *   1. page effects  – fade-in on scroll, top progress bar, smooth in-page links
 *   2. the 3-step application (#apply):  1 Basic Details → 2 Compare → 3 Admission Details → Thank you
 *   3. saving each finished application as one row in a Google Sheet (see js/config.js)
 * Content (comparison tables, fees, links) comes from js/data.js; icons from js/icons.js.
 */
(function () {
  'use strict';

  var D = window.APP_DATA;
  var I = window.ICONS;
  var CFG = window.APP_CONFIG || {};
  var CMP = D.cmp;
  var STORE_KEY = 'mba-form-v1';
  var STEP_LABELS = ['Basic Details', 'Compare Universities', 'Admission Details'];

  /* ------------------------------------------------------------------ helpers */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var byId = function (list, id) { return list.filter(function (x) { return x.id === id; })[0]; };
  var scrollToId = function (id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ================================================================== 1. PAGE EFFECTS */

  /* fade elements in as they scroll into view – also ones added later (the comparison step) */
  function initReveal() {
    document.documentElement.classList.add('js');
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -6% 0px' }
    );
    var watch = function () {
      $$('[data-reveal]:not(.in)').forEach(function (el) { io.observe(el); });
    };
    watch();
    var raf = 0;
    new MutationObserver(function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(watch);
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* thin progress bar at the very top (CSS reads --progress) */
  function initProgress() {
    var raf = 0;
    var update = function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        var p = max > 0 ? h.scrollTop / max : 0;
        h.style.setProperty('--progress', String(Math.min(1, Math.max(0, p))));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* in-page links: [data-jump="id"] scrolls smoothly; placeholder href="#" links do nothing */
  function initLinks() {
    document.addEventListener('click', function (ev) {
      var jump = ev.target.closest('[data-jump]');
      if (jump) {
        ev.preventDefault();
        scrollToId(jump.getAttribute('data-jump'));
        return;
      }
      var dead = ev.target.closest('a[href="#"]');
      if (dead) ev.preventDefault();
    });
  }

  /* ================================================================== 2. FORM STATE */

  var initial = function () {
    return {
      /* step 1 */
      fullName: '', email: '', phone: '', status: '', university: '', course: '', consent: false,
      /* step 3 */
      qualification: '', percentage: '', passingYear: '', experience: '',
      intake: '', payment: '', comments: ''
    };
  };

  /* answers survive a refresh (this tab only) */
  function loadData() {
    try {
      var raw = sessionStorage.getItem(STORE_KEY);
      if (raw) return Object.assign(initial(), JSON.parse(raw));
    } catch (e) { /* storage blocked – start empty */ }
    return initial();
  }
  var data = loadData();
  function persist() { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ } }
  function update(patch) { Object.assign(data, patch); persist(); }
  function resetData() {
    data = initial();
    try { sessionStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
  }

  /* ---------- validation (same rules as before) ---------- */
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateBasic(d) {
    var e = {};
    if (d.fullName.trim().length < 2) e.fullName = 'Enter your full name';
    if (!emailRe.test(d.email)) e.email = 'Enter a valid email address';
    if (!/^[6-9]\d{9}$/.test(d.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (!d.status) e.status = 'Select what describes you best';
    if (!d.university) e.university = 'Select the university you are interested in';
    if (!d.course) e.course = 'Select a course';
    if (!d.consent) e.consent = 'Please agree to be contacted';
    return e;
  }

  function validateAdmission(d) {
    var e = {};
    if (!d.qualification) e.qualification = 'Select your highest qualification';
    var p = Number(d.percentage);
    if (!d.percentage || p < 1 || p > 100) e.percentage = 'Enter a percentage between 1 and 100';
    if (!/^(19|20)\d{2}$/.test(d.passingYear)) e.passingYear = 'Enter a valid year (e.g. 2022)';
    if (!d.experience) e.experience = 'Select your work experience';
    if (!d.intake) e.intake = 'Select a preferred intake';
    if (!d.payment) e.payment = 'Select a payment preference';
    return e;
  }

  /* ---------- show / clear an error message under a field ---------- */
  function setError(root, key, msg) {
    var host = $('[data-field="' + key + '"]', root);
    if (!host) return;
    $$('[data-err-for="' + key + '"]', root).forEach(function (n) { n.remove(); });
    host.classList.toggle('has-error', !!msg);
    if (!msg) return;
    var span = document.createElement('span');
    span.className = 'err';
    span.setAttribute('role', 'alert');
    span.setAttribute('data-err-for', key);
    span.textContent = msg;
    if (host.classList.contains('check')) host.insertAdjacentElement('afterend', span);
    else host.appendChild(span);
  }
  function showErrors(root, errors) {
    $$('[data-field]', root).forEach(function (el) {
      var key = el.getAttribute('data-field');
      setError(root, key, errors[key]);
    });
  }

  /* ---------- small HTML builders ---------- */
  function field(o) {
    return (
      '<div class="field" data-field="' + o.id + '">' +
        '<label for="' + o.id + '">' + esc(o.label) + (o.required ? ' <span class="req">*</span>' : '') + '</label>' +
        '<div class="control' + (o.icon ? ' has-icon' : '') + '">' +
          (o.icon ? '<span class="ctl-icon">' + I[o.icon] + '</span>' : '') +
          (o.prefix ? '<span class="ctl-prefix">' + o.prefix + '</span>' : '') +
          o.control +
        '</div>' +
      '</div>'
    );
  }
  function textInput(id, attrs) {
    return '<input id="' + id + '" value="' + esc(data[id]) + '" ' + (attrs || '') + ' />';
  }
  function select(id, placeholder, options) {
    return (
      '<select id="' + id + '">' +
      '<option value="">' + esc(placeholder) + '</option>' +
      options.map(function (o) {
        return '<option' + (data[id] === o ? ' selected' : '') + '>' + esc(o) + '</option>';
      }).join('') +
      '</select>'
    );
  }
  /* <select> where each option has its own value and label, e.g. {value:'vit', label:'VIT University'} */
  function selectKV(id, placeholder, options) {
    return (
      '<select id="' + id + '">' +
      '<option value="">' + esc(placeholder) + '</option>' +
      options.map(function (o) {
        return '<option value="' + esc(o.value) + '"' + (data[id] === o.value ? ' selected' : '') + '>' + esc(o.label) + '</option>';
      }).join('') +
      '</select>'
    );
  }
  /* the courses offered by the university that is currently selected */
  function coursesOf(universityId) {
    var u = byId(D.universities, universityId);
    return u ? u.courses : [];
  }
  function courseOptionsHtml() {
    var list = coursesOf(data.university);
    return '<option value="">' + (list.length ? 'Select course' : 'Select a university first') + '</option>' +
      list.map(function (c) { return '<option' + (data.course === c ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('');
  }
  var sidePanel =
    '<aside class="panel"><img src="img/journey.webp" alt="Your MBA Journey Starts Here! Get personalized university counseling and admission assistance. Compare Top Universities, Explore MBA Programs, Apply with Ease." /></aside>';

  /* ================================================================== 3. THE STEPS */

  /* ---------- Step 1 · Basic Details ---------- */
  function step1Html() {
    return (
      '<form class="apply-body s1" id="form1" novalidate>' + sidePanel +
      '<div class="apply-main"><div class="step">' +
        '<h2 class="page-title">Tell us about yourself</h2>' +
        (resumeTo ? '<p class="callout">Almost there &mdash; please fill in your details to continue to the admission step.</p>' : '') +
        '<p class="muted">Let&rsquo;s get started with some basic details.</p>' +
        '<div class="grid2">' +
          field({ id: 'fullName', label: 'Full Name', required: true, icon: 'user', control: textInput('fullName', 'autocomplete="name" placeholder="Enter your full name"') }) +
          field({ id: 'email', label: 'Email Address', required: true, icon: 'mail', control: textInput('email', 'type="email" autocomplete="email" placeholder="you@example.com"') }) +
          field({ id: 'phone', label: 'Mobile Number', required: true, icon: 'phone', prefix: '+91', control: textInput('phone', 'inputmode="numeric" maxlength="10" autocomplete="tel-national" placeholder="98765 43210"') }) +
          field({ id: 'status', label: 'I am a', required: true, icon: 'briefcase', control: select('status', 'Select', ['Working professional', 'Final-year student', 'Graduate (not working)', 'Entrepreneur / Business owner']) }) +
          field({ id: 'university', label: 'University Interested In', required: true, icon: 'cap', control: selectKV('university', 'Select university', D.universities.map(function (u) { return { value: u.id, label: u.name }; })) }) +
          field({ id: 'course', label: 'Course', required: true, icon: 'book', control: '<select id="course"' + (data.university ? '' : ' disabled') + '>' + courseOptionsHtml() + '</select>' }) +
        '</div>' +
        '<label class="check" data-field="consent"><input type="checkbox" id="consent"' + (data.consent ? ' checked' : '') + ' />' +
          '<span>I agree to be contacted by counsellors via call, SMS, WhatsApp and email.</span></label>' +
      '</div>' +
      '<div class="actions"><span></span><div class="next-wrap">' +
        '<button type="submit" class="btn pill">Next <span class="arr">' + I.arrow + '</span></button>' +
        '<small class="step-count">Step 1 of 3</small></div></div>' +
      '</div></form>'
    );
  }

  /* ---------- Step 3 · Admission Details ---------- */
  function step3Html() {
    return (
      '<form class="apply-body s3" id="form3" novalidate>' + sidePanel +
      '<div class="apply-main"><div class="step">' +
        '<h2 class="page-title">Admission Details</h2>' +
        '<p class="muted">Almost done &mdash; share a few academic details to start your admission.</p>' +
        '<div class="grid2">' +
          field({ id: 'qualification', label: 'Highest Qualification', required: true, icon: 'cap', control: select('qualification', 'Select', ["Bachelor's degree (3 years)", "Bachelor's degree (4 years)", "Master's degree", 'Diploma']) }) +
          field({ id: 'percentage', label: 'Graduation Aggregate (%)', required: true, icon: 'percent', control: textInput('percentage', 'type="number" min="1" max="100" step="0.01"') }) +
          field({ id: 'passingYear', label: 'Year of Passing', required: true, icon: 'calendar', control: textInput('passingYear', 'inputmode="numeric" maxlength="4" placeholder="e.g. 2022"') }) +
          field({ id: 'experience', label: 'Work Experience', required: true, icon: 'briefcase', control: select('experience', 'Select', ['Fresher', '1–3 years', '3–5 years', '5+ years']) }) +
          field({ id: 'intake', label: 'Preferred Intake', required: true, icon: 'calendar', control: select('intake', 'Select', ['January 2027', 'July 2027']) }) +
          field({ id: 'payment', label: 'Payment Preference', required: true, icon: 'wallet', control: select('payment', 'Select', ['Full payment', 'Semester-wise', 'No-cost EMI / Education loan']) }) +
        '</div>' +
        '<div class="field"><label for="comments">Anything else we should know? (optional)</label>' +
          '<div class="control"><textarea id="comments" rows="2">' + esc(data.comments) + '</textarea></div></div>' +
      '</div>' +
      '<div class="actions">' +
        '<button type="button" class="btn ghost" data-go="2">← Back</button>' +
        '<div class="next-wrap"><button type="submit" class="btn pill" id="submitBtn">Submit Application</button>' +
        '<small class="step-count">Step 3 of 3</small></div></div>' +
      '</div></form>'
    );
  }

  /* ---------- Step 2 · Compare (follows the supplied comparison guide) ---------- */
  var cols = CMP.cols;
  var inSiteOrder = function (row) {
    return cols.map(function (c) { return row[CMP.SOURCE_ORDER.indexOf(c.id)]; });
  };
  var cell = function (v) {
    if (v === 'Yes') return '<span class="yes">✓ Yes</span>';
    if (v === '—') return '<span class="no">—</span>';
    return esc(v);
  };
  function section(id, n, title, intro, body) {
    return (
      '<section id="cmp-' + id + '" class="cmp-sec" data-reveal>' +
      '<h3><span class="num">' + n + '</span>' + esc(title) + '</h3>' +
      (intro ? '<p class="muted">' + esc(intro) + '</p>' : '') + body + '</section>'
    );
  }
  /* rows are PDF-ordered: [label, Amrita, Amity, VIT, SMU] */
  function matrix(corner, rows, label) {
    return (
      '<div class="mx-wrap" role="region" aria-label="' + esc(label) + '" tabindex="0"><table class="matrix"><thead><tr><th>' + esc(corner) + '</th>' +
      cols.map(function (c) { return '<th class="th-' + c.theme + '">' + esc(c.label) + '</th>'; }).join('') +
      '</tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><th scope="row">' + esc(r[0]) + '</th>' +
          inSiteOrder(r.slice(1)).map(function (v) { return '<td>' + cell(v) + '</td>'; }).join('') + '</tr>';
      }).join('') +
      '</tbody></table></div>'
    );
  }
  var callout = function (strong, text) { return '<p class="callout"><b>' + esc(strong) + '</b> ' + esc(text) + '</p>'; };

  function step2Html() {
    var st = CMP.status;
    var f = CMP.fees;

    var statusTable =
      '<div class="mx-wrap" role="region" aria-label="University status" tabindex="0"><table class="matrix stat"><thead><tr>' +
      '<th>University</th><th>Status</th><th>Recognition / quality claims</th></tr></thead><tbody>' +
      cols.map(function (c) {
        return '<tr><th scope="row"><span class="dot-c t-' + c.theme + '"></span>' + esc(st[c.id].name) + '</th><td>' + esc(st[c.id].type) + '</td><td>' + esc(st[c.id].claim) + '</td></tr>';
      }).join('') + '</tbody></table></div>';

    var feeTable =
      '<div class="mx-wrap" role="region" aria-label="Fee comparison" tabindex="0"><table class="matrix stat fee"><thead><tr>' +
      '<th>University</th><th>Registration / application</th><th>Semester fee</th><th>4-semester total</th><th>Other fee details</th></tr></thead><tbody>' +
      cols.map(function (c) {
        var r = f.rows[c.id];
        return '<tr><th scope="row"><span class="dot-c t-' + c.theme + '"></span>' + esc(c.label) + '</th>' +
          '<td>' + r.registration.map(function (x) { return '<div>' + esc(x) + '</div>'; }).join('') + '</td>' +
          '<td>' + esc(r.semester) + '</td><td><b>' + esc(r.total) + '</b></td><td>' + esc(r.other) + '</td></tr>';
      }).join('') + '</tbody></table></div>';

    var sorted = cols.slice().sort(function (a, b) { return f.rows[a.id].totalNumber - f.rows[b.id].totalNumber; });
    var max = Math.max.apply(null, cols.map(function (c) { return f.rows[c.id].totalNumber; }));
    var snapshot =
      '<h4 class="snap-title">Fee snapshot (four semesters)</h4><div class="snap" data-reveal>' +
      sorted.map(function (c, i) {
        var r = f.rows[c.id];
        return '<div class="snap-item" style="--w:' + Math.round((r.totalNumber / max) * 100) + '%;--d:' + (i * 0.12) + 's">' +
          '<div class="snap-top"><b>' + esc(c.label) + (i === 0 ? '<em>Lowest</em>' : '') + '</b><span>' + esc(r.lakh) + '</span></div>' +
          '<div class="bar"><i class="bg-' + c.theme + '"></i></div>' + (r.offer ? '<small>' + esc(r.offer) + '</small>' : '') + '</div>';
      }).join('') + '</div>';

    var checklist =
      '<h4 class="snap-title">Verification checklist</h4><ul class="checklist">' +
      CMP.verificationChecklist.map(function (v) { return '<li><span>' + I.check + '</span>' + esc(v) + '</li>'; }).join('') + '</ul>';

    var links =
      '<div class="links-grid">' +
      cols.map(function (c) {
        var l = CMP.officialLinks[c.id];
        var uni = byId(D.universities, c.id);
        var pdf = uni.prospectusUrl.indexOf('http') === 0 ? null : uni.prospectusUrl;
        return '<article class="link-card t-' + c.theme + '">' +
          '<div class="link-logo"><img src="' + esc(uni.logo) + '" alt="' + esc(l.name) + ' logo" /></div>' +
          '<div class="link-body"><h4>' + esc(l.name) + '</h4>' +
          '<p><b>Programme / prospectus:</b> <a href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(l.programme) + '</a></p>' +
          '<p><b>Admission:</b> <a href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(l.admission) + '</a></p>' +
          '<small class="url">' + esc(l.url) + '</small>' +
          (pdf ? '<a class="btn small" href="' + esc(pdf) + '" download>Download brochure (PDF)</a>' : '') +
          '</div></article>';
      }).join('') + '</div>' +
      '<p class="disclaimer"><b>Information disclaimer.</b> ' + esc(CMP.disclaimer) + '</p>';

    return (
      '<div class="apply-body s2 wide"><div class="apply-main"><div class="step cmp">' +
        '<header class="cmp-hero"><small>Online MBA • 2027 Admissions</small><h2 class="page-title">A Comparative Guide</h2>' +
        '<p class="cmp-sub">Four Leading Universities</p>' +
        '<p class="cmp-lead">Compare university status, specialisations, curriculum, eligibility, exams, career support and fees — all in one guide.</p></header>' +
        '<p class="muted">Programme details, fees, approvals, dates and policies can change; confirm the latest 2027 information directly with each university before applying.</p>' +
        '<div class="cmp-unis">' + cols.map(function (c) {
          return '<div class="cmp-uni t-' + c.theme + '"><b>' + esc(st[c.id].name) + '</b><span>' + esc(st[c.id].type) + '</span></div>';
        }).join('') + '</div>' +
        '<nav class="sec-nav" aria-label="Comparison sections">' + CMP.sections.map(function (s, i) {
          return '<a href="#cmp-' + s.id + '" data-chip="' + s.id + '"' + (i === 0 ? ' class="on"' : '') + '>' + esc(s.short) + '</a>';
        }).join('') + '</nav>' +
        section('status', 1, 'University status & recognition', 'Institutional status and recognition as described in the comparison. Please verify the exact current accreditation wording on official university and UGC-DEB sources.', statusTable) +
        section('specialisations', 2, 'MBA specialisations', '', matrix('Specialisation', CMP.specialisations, 'MBA specialisations') + '<p class="fine">' + esc(CMP.specialisationsNote) + '</p>') +
        section('curriculum', 3, 'Semester-wise curriculum overview', CMP.curriculumNote, matrix('Semester', CMP.curriculum, 'Curriculum')) +
        section('eligibility', 4, 'Admission eligibility', '', matrix('Requirement', CMP.eligibility, 'Eligibility') + callout('Admission advice:', CMP.eligibilityAdvice)) +
        section('exams', 5, 'Examination system', '', matrix('Particulars', CMP.exams, 'Examination system')) +
        section('placement', 6, 'Placement & career support', '', matrix('Support area', CMP.placement, 'Placement and career support') + callout('Important:', CMP.placementWarning)) +
        section('fees', 7, 'Fee comparison', f.intro, feeTable + snapshot) +
        section('regulatory', 8, 'Official prospectus & regulatory checks', CMP.regulatoryIntro, checklist) +
        section('choose', 9, 'How to choose', '', '<p class="plain">' + esc(CMP.howToChoose) + '</p>') +
        section('links', 10, 'University prospectus & admission links', 'Open the official Online MBA programme / admission page of each university.', links) +
      '</div>' +
      '<div class="actions"><button type="button" class="btn ghost" data-go="1">← Back</button>' +
      '<div class="next-wrap"><button type="button" class="btn pill" data-go="3">Next <span class="arr">' + I.arrow + '</span></button>' +
      '<small class="step-count">Step 2 of 3</small></div></div>' +
      '</div></div>'
    );
  }

  /* highlight the section chip that is currently in view (only while step 2 is open) */
  var onCompareScroll = null;
  function bindCompare(host) {
    var chips = $$('[data-chip]', host);
    chips.forEach(function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        scrollToId('cmp-' + a.getAttribute('data-chip'));
      });
    });
    onCompareScroll = function () {
      var cur = CMP.sections[0].id;
      CMP.sections.forEach(function (s) {
        var el = document.getElementById('cmp-' + s.id);
        if (el && el.getBoundingClientRect().top <= 170) cur = s.id;
      });
      chips.forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-chip') === cur); });
    };
    window.addEventListener('scroll', onCompareScroll, { passive: true });
    onCompareScroll();
  }
  function unbindCompare() {
    if (onCompareScroll) window.removeEventListener('scroll', onCompareScroll);
    onCompareScroll = null;
  }

  /* ---------- Thank you ---------- */
  function thanksHtml() {
    var u = byId(D.universities, data.university);
    var picked = u ? [u.short + (data.course ? ' (' + data.course + ')' : '')] : [];
    return (
      '<div class="apply-card success"><div class="tick" aria-hidden="true">✓</div>' +
      '<h2 class="page-title">Thank you, ' + esc(data.fullName.trim().split(' ')[0]) + '!</h2>' +
      '<p>Your enquiry' + (picked.length ? ' for <b>' + esc(picked.join(', ')) + '</b>' : '') +
      ' has been received. Our counsellor will call you on <b>+91 ' + esc(data.phone) + '</b> shortly.</p>' +
      '<button type="button" class="btn pill" data-action="reset">Submit another enquiry</button></div>'
    );
  }

  /* ================================================================== 4. SAVING (Google Sheet) */

  function saveLead(d) {
    if (!CFG.sheetUrl) return Promise.reject(new Error('sheet-not-configured'));
    var row = {
      submittedAt: new Date().toISOString(),
      fullName: d.fullName.trim(), email: d.email.trim(), phone: '+91 ' + d.phone,
      status: d.status,
      /* the university's name only; the course goes in its own "Course" column */
      universities: (function () { var u = byId(D.universities, d.university); return u ? u.name : d.university; })(),
      course: d.course,
      qualification: d.qualification, percentage: d.percentage, passingYear: d.passingYear,
      experience: d.experience, intake: d.intake, payment: d.payment,
      comments: d.comments.trim(), consent: d.consent ? 'Yes' : 'No'
    };
    /* text/plain avoids a CORS preflight, which Apps Script does not answer.
       The reply is opaque (no-cors), so only a network failure can be detected here. */
    return fetch(CFG.sheetUrl, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(row)
    });
  }

  /* ================================================================== 5. THE FLOW (which step is on screen) */

  var host = document.getElementById('apply');
  var step = 1; // 1 | 2 | 3 | 'done'
  var resumeTo = null; // set when the visitor opened the comparison first: after step 1, continue to this step

  function stepperHtml() {
    return '<ol class="steps" aria-label="Form progress">' + STEP_LABELS.map(function (label, i) {
      var n = i + 1;
      var before = typeof step === 'number' && step > n;                      // a step we have already passed
      var ticked = before && !(n === 1 && Object.keys(validateBasic(data)).length); // ...and really finished
      var state = step === n ? 'active' : ticked ? 'done' : '';
      var inner = '<span class="dot">' + (ticked ? I.check : n) + '</span><span class="slabel">' + label + '</span>';
      return '<li class="' + state + '"' + (step === n ? ' aria-current="step"' : '') + '>' +
        (before ? '<button type="button" class="step-link" data-go="' + n + '">' + inner + '</button>' : '<span class="step-link">' + inner + '</span>') + '</li>';
    }).join('') + '</ol>';
  }

  function go(n) {
    step = n;
    render();
    requestAnimationFrame(function () { scrollToId('apply'); }); // bring the top of the card into view
  }

  function render() {
    unbindCompare();

    if (step === 'done') {
      host.innerHTML = thanksHtml();
      return;
    }

    /* keep the white card in place between steps so only its content swaps */
    var card = $('.apply-card', host);
    if (!card || card.classList.contains('success')) {
      host.innerHTML = '<div class="apply-card"><div data-host="stepper"></div><div data-host="step"></div></div>';
    }
    $('[data-host="stepper"]', host).innerHTML = stepperHtml();
    var body = $('[data-host="step"]', host);

    if (step === 1) { body.innerHTML = step1Html(); bindForm(body, 1); }
    if (step === 2) { body.innerHTML = step2Html(); bindCompare(body); }
    if (step === 3) { body.innerHTML = step3Html(); bindForm(body, 3); }
  }

  /* ================================================================== THEMED DROPDOWNS */
  /* The browser's own <select> list cannot be styled, so each <select> in the forms is hidden and replaced
     by a button + list that match the site. The real <select> stays in the page (it keeps the value and
     fires the same input/change events), so validation and saving work exactly as before. */
  var CHEVRON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
  var openDropdown = null;

  document.addEventListener('click', function (ev) {
    if (openDropdown && !openDropdown.wrap.contains(ev.target)) openDropdown.close();
  });
  window.addEventListener('resize', function () { if (openDropdown) openDropdown.close(); });

  function enhanceSelect(sel) {
    if (sel._dd) { sel._dd.refresh(); return; }

    var uid = 'dd-' + sel.id;
    var wrap = document.createElement('div');
    wrap.className = 'dd';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dd-btn';
    btn.id = uid + '-btn';
    btn.setAttribute('role', 'combobox');
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', uid + '-list');
    btn.innerHTML = '<span class="dd-text"></span><span class="dd-chev">' + CHEVRON + '</span>';
    var text = btn.firstChild;

    var list = document.createElement('ul');
    list.className = 'dd-list';
    list.id = uid + '-list';
    list.setAttribute('role', 'listbox');
    list.hidden = true;

    wrap.appendChild(btn);
    wrap.appendChild(list);
    sel.insertAdjacentElement('afterend', wrap);
    sel.classList.add('dd-native');
    sel.setAttribute('tabindex', '-1');
    sel.setAttribute('aria-hidden', 'true');

    /* clicking the label should focus the visible button */
    var label = document.querySelector('label[for="' + sel.id + '"]');
    if (label) {
      if (!label.id) label.id = uid + '-label';
      label.setAttribute('for', btn.id);
      btn.setAttribute('aria-labelledby', label.id);
    }

    var active = -1;
    var typed = '';
    var typedTimer = 0;
    var choices = function () { return Array.prototype.slice.call(sel.options).filter(function (o) { return o.value !== ''; }); };

    var logoEl = null; // only used by the University field: shows the chosen university's logo

    function paintButton() {
      var has = sel.value !== '';
      var o = sel.options[sel.selectedIndex];
      text.textContent = has && o ? o.text : (sel.options[0] ? sel.options[0].text : 'Select');
      btn.classList.toggle('placeholder', !has);
      btn.disabled = sel.disabled;
      wrap.classList.toggle('disabled', sel.disabled);

      if (sel.id === 'university') {
        var ctl = wrap.closest('.control');
        var u = has ? byId(D.universities, sel.value) : null;
        if (u && u.logo) {
          if (!logoEl) {
            logoEl = document.createElement('span');
            btn.insertBefore(logoEl, text);
          }
          logoEl.className = 'dd-logo t-' + u.id;           /* badge colour = the university's colour */
          logoEl.innerHTML = '<img src="' + esc(u.logo) + '" alt="" />';
          btn.classList.add('has-logo');
          if (ctl) ctl.classList.add('has-logo');            /* hides the generic cap icon */
        } else {
          if (logoEl) { logoEl.remove(); logoEl = null; }
          btn.classList.remove('has-logo');
          if (ctl) ctl.classList.remove('has-logo');
        }
      }
    }

    function paintList() {
      list.innerHTML = choices().map(function (o, i) {
        var on = o.value === sel.value;
        return '<li role="option" id="' + uid + '-o' + i + '" class="dd-opt' + (on ? ' sel' : '') + '" aria-selected="' + on + '" data-i="' + i + '">' +
          '<span>' + esc(o.text) + '</span>' + (on ? '<i class="dd-tick">' + I.check + '</i>' : '') + '</li>';
      }).join('');
    }

    function setActive(i, scroll) {
      var items = $$('.dd-opt', list);
      if (!items.length) return;
      active = Math.max(0, Math.min(items.length - 1, i));
      items.forEach(function (li, n) { li.classList.toggle('act', n === active); });
      btn.setAttribute('aria-activedescendant', items[active].id);
      if (scroll !== false) items[active].scrollIntoView({ block: 'nearest' });
    }

    function open() {
      if (sel.disabled) return;
      if (openDropdown && openDropdown !== api) openDropdown.close();
      paintList();
      list.hidden = false;
      wrap.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      /* open upwards when there is not enough room underneath */
      var r = btn.getBoundingClientRect();
      var need = Math.min(list.scrollHeight, 264) + 12;
      wrap.classList.toggle('up', window.innerHeight - r.bottom < need && r.top > window.innerHeight - r.bottom);
      var idx = choices().map(function (o) { return o.value; }).indexOf(sel.value);
      setActive(idx < 0 ? 0 : idx);
      openDropdown = api;
    }

    function close() {
      list.hidden = true;
      wrap.classList.remove('open', 'up');
      btn.setAttribute('aria-expanded', 'false');
      btn.removeAttribute('aria-activedescendant');
      active = -1;
      if (openDropdown === api) openDropdown = null;
    }

    function choose(i) {
      var o = choices()[i];
      if (!o) return;
      sel.value = o.value;
      sel.dispatchEvent(new Event('input', { bubbles: true }));
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      paintButton();
      close();
      btn.focus();
    }

    btn.addEventListener('click', function () { if (wrap.classList.contains('open')) close(); else open(); });

    btn.addEventListener('keydown', function (ev) {
      var isOpen = wrap.classList.contains('open');
      var k = ev.key;
      if (k === 'ArrowDown' || k === 'ArrowUp') {
        ev.preventDefault();
        if (!isOpen) open(); else setActive(active + (k === 'ArrowDown' ? 1 : -1));
      } else if (k === 'Home' && isOpen) { ev.preventDefault(); setActive(0); }
      else if (k === 'End' && isOpen) { ev.preventDefault(); setActive(choices().length - 1); }
      else if (k === 'Enter' || k === ' ') {
        if (isOpen && active > -1) { ev.preventDefault(); choose(active); }
        else if (!isOpen) { ev.preventDefault(); open(); }
      } else if (k === 'Escape' && isOpen) { ev.preventDefault(); close(); }
      else if (k === 'Tab' && isOpen) { close(); }
      else if (k.length === 1 && !ev.ctrlKey && !ev.metaKey && !ev.altKey) {
        /* type-ahead: jump to the first option that starts with what was typed */
        typed += k.toLowerCase();
        clearTimeout(typedTimer);
        typedTimer = setTimeout(function () { typed = ''; }, 600);
        var texts = choices().map(function (o) { return o.text.toLowerCase().replace(/^mba\s*[–-]\s*/, ''); });
        var hit = texts.findIndex(function (t) { return t.indexOf(typed) === 0; });
        if (hit > -1) { if (!isOpen) open(); setActive(hit); }
      }
    });

    /* keep focus on the button while using the mouse on the list */
    list.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
    list.addEventListener('click', function (ev) {
      var li = ev.target.closest('.dd-opt');
      if (li) choose(Number(li.getAttribute('data-i')));
    });
    list.addEventListener('mousemove', function (ev) {
      var li = ev.target.closest('.dd-opt');
      if (li) setActive(Number(li.getAttribute('data-i')), false);
    });

    var api = {
      wrap: wrap,
      close: close,
      /* call after the <select>'s options / value / disabled state were changed from code */
      refresh: function () { paintButton(); if (wrap.classList.contains('open')) paintList(); }
    };
    sel._dd = api;
    paintButton();
  }

  /* ---------- wiring for the two real forms ---------- */
  function bindForm(body, which) {
    var form = $('form', body);
    $$('select', form).forEach(enhanceSelect);

    /* every typed answer is stored straight away */
    var onEdit = function (ev) {
      var t = ev.target;
      if (t.id === 'university') { // a different university has different courses
        update({ university: t.value, course: '' });
        var cs = $('#course', form);
        if (cs) {
          cs.innerHTML = courseOptionsHtml();
          cs.disabled = !t.value;
          if (cs._dd) cs._dd.refresh();
        }
        setError(form, 'university', '');
        setError(form, 'course', '');
        return;
      }
      if (!t.id || !(t.id in data)) return;
      var v = t.type === 'checkbox' ? t.checked : t.value;
      if (t.id === 'phone') { v = v.replace(/\D/g, ''); t.value = v; }
      var patch = {}; patch[t.id] = v;
      update(patch);
      setError(form, t.id, '');
    };
    form.addEventListener('input', onEdit);
    form.addEventListener('change', onEdit);

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      if (which === 1) {
        var e1 = validateBasic(data);
        showErrors(form, e1);
        if (Object.keys(e1).length === 0) {
          var next = resumeTo || 2;
          resumeTo = null;
          go(next);
        }
        return;
      }

      var e3 = validateAdmission(data);
      showErrors(form, e3);
      if (Object.keys(e3).length) return;

      var btn = $('#submitBtn', form);
      var old = $('.submit-err', form);
      if (old) old.remove();
      btn.disabled = true;
      btn.textContent = 'Submitting…';

      saveLead(data).then(function () {
        step = 'done';
        render();
        requestAnimationFrame(function () { scrollToId('apply'); });
      }).catch(function (err) {
        console.error(err);
        btn.disabled = false;
        btn.textContent = 'Submit Application';
        var p = document.createElement('p');
        p.className = 'err submit-err';
        p.setAttribute('role', 'alert');
        p.textContent = CFG.sheetUrl
          ? 'Could not submit right now. Please check your internet connection and try again.'
          : 'Spreadsheet is not connected yet (set sheetUrl in js/config.js).';
        $('.actions', form).insertAdjacentElement('beforebegin', p);
      });
    });
  }

  /* Next / Back / stepper / "submit another" buttons */
  host.addEventListener('click', function (ev) {
    var g = ev.target.closest('[data-go]');
    if (g) {
      var target = Number(g.getAttribute('data-go'));
      if (step === 2 && target === 3 && Object.keys(validateBasic(data)).length) {
        resumeTo = 3; // came here straight from the hero button – ask for the basic details first
        go(1);
        return;
      }
      go(target);
      return;
    }
    if (ev.target.closest('[data-action="reset"]')) {
      resetData();
      step = 1;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  /* the hero's "Compare MBA Courses" button opens the comparison (step 2) straight away */
  document.addEventListener('click', function (ev) {
    var o = ev.target.closest('[data-open-step]');
    if (!o) return;
    ev.preventDefault();
    if (step === 'done') resetData(); // don't let a finished application be re-sent from the comparison
    go(Number(o.getAttribute('data-open-step')));
  });

  /* ================================================================== start */
  initReveal();
  initProgress();
  initLinks();
  render();
})();
