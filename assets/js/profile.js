(function(){
  "use strict";

  /* ---- Rewards progress bar, driven by the stamped count ---- */
  var filledStamps = document.querySelectorAll('.stamp.is-filled').length;
  var progressFill = document.getElementById('progressFill');
  if (progressFill) progressFill.style.width = (filledStamps / 5 * 100) + '%';

  /* ---- Calendar ---- */
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var today = new Date();
  today.setHours(0,0,0,0);
  var viewYear = today.getFullYear();
  var viewMonth = today.getMonth();
  var selectedDate = null;

  var calMonth = document.getElementById('calMonth');
  var calGrid = document.getElementById('calGrid');
  var calPrev = document.getElementById('calPrev');
  var calNext = document.getElementById('calNext');
  var timeSlots = document.querySelectorAll('.time-slot');
  var timeHint = document.getElementById('timeHint');
  var confirmBtn = document.getElementById('confirmBtn');
  var summary = document.getElementById('bookingSummary');
  var summaryService = document.getElementById('summaryService');
  var summaryWhen = document.getElementById('summaryWhen');
  var serviceSelect = document.getElementById('serviceSelect');
  var selectedTime = null;

  function renderCalendar(){
    if (!calGrid) return;
    calMonth.textContent = monthNames[viewMonth] + ' ' + viewYear;
    calGrid.innerHTML = '';

    var firstDay = new Date(viewYear, viewMonth, 1).getDay();
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (var i = 0; i < firstDay; i++) {
      var empty = document.createElement('span');
      empty.className = 'cal-day is-empty';
      calGrid.appendChild(empty);
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var cellDate = new Date(viewYear, viewMonth, d);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day';
      btn.textContent = d;

      var isPast = cellDate < today;
      var isSunday = cellDate.getDay() === 0;

      if (isPast || isSunday) {
        btn.classList.add('is-disabled');
        btn.disabled = true;
      } else {
        btn.addEventListener('click', function(dateObj, el){
          return function(){
            selectedDate = dateObj;
            calGrid.querySelectorAll('.cal-day.is-selected').forEach(function(x){ x.classList.remove('is-selected'); });
            el.classList.add('is-selected');
            enableTimeSlots();
            updateSummary();
          };
        }(cellDate, btn));
      }

      if (cellDate.getTime() === (selectedDate && selectedDate.getTime())) {
        btn.classList.add('is-selected');
      }

      calGrid.appendChild(btn);
    }

    calPrev.disabled = (viewYear === today.getFullYear() && viewMonth === today.getMonth());
  }

  function enableTimeSlots(){
    timeSlots.forEach(function(slot){ slot.disabled = false; });
    if (timeHint) timeHint.textContent = 'Times are shown in Pacific Time.';
  }

  function updateSummary(){
    var hasDate = !!selectedDate;
    var hasTime = !!selectedTime;
    if (hasDate || hasTime) summary.classList.add('is-active');

    summaryService.textContent = serviceSelect.value;
    summaryWhen.textContent =
      (hasDate ? selectedDate.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' }) : 'Select a date')
      + (hasTime ? ' at ' + selectedTime : '');

    confirmBtn.disabled = !(hasDate && hasTime);
  }

  timeSlots.forEach(function(slot){
    slot.addEventListener('click', function(){
      timeSlots.forEach(function(s){ s.classList.remove('is-selected'); });
      slot.classList.add('is-selected');
      selectedTime = slot.textContent;
      updateSummary();
    });
  });

  if (serviceSelect) serviceSelect.addEventListener('change', updateSummary);
  if (calPrev) calPrev.addEventListener('click', function(){
    viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });
  if (calNext) calNext.addEventListener('click', function(){
    viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  var bookingPanel = document.querySelector('.booking-panel');
  var bookingSuccess = document.getElementById('bookingSuccess');
  var successDetail = document.getElementById('successDetail');
  var bookAgainBtn = document.getElementById('bookAgainBtn');

  if (confirmBtn) confirmBtn.addEventListener('click', function(){
    if (confirmBtn.disabled) return;
    successDetail.textContent = serviceSelect.value + ' — ' + summaryWhen.textContent + '.';
    bookingPanel.classList.add('is-hidden');
    bookingSuccess.classList.add('is-visible');
  });

  if (bookAgainBtn) bookAgainBtn.addEventListener('click', function(){
    bookingSuccess.classList.remove('is-visible');
    bookingPanel.classList.remove('is-hidden');
    selectedDate = null; selectedTime = null;
    timeSlots.forEach(function(s){ s.classList.remove('is-selected'); s.disabled = true; });
    summary.classList.remove('is-active');
    confirmBtn.disabled = true;
    if (timeHint) timeHint.textContent = 'Pick a date first to see available times.';
    renderCalendar();
  });

  renderCalendar();

})();
