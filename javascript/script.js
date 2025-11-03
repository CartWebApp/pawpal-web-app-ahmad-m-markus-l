/* SPLASH PAGE */
// This runs immediately
const splashWelcome = document.getElementById('splash-welcome');
if (splashWelcome) {
  setTimeout(() => {
    window.location.href = "login.html";
  }, 3000);
}

/* UNIVERSAL APP LOGIC */

// We only have ONE DOMContentLoaded listener for the entire site
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. GET ALL POSSIBLE ELEMENTS ---
  
  // -- Global Panels & Buttons --
  const pageOverlay = document.getElementById('page-overlay');
  const settingsBtn = document.getElementById('settings-icon-btn');
  const settingsPanel = document.getElementById('settings-panel');
  const bellBtn = document.getElementById('bell-icon-btn');
  const notificationsPanel = document.getElementById('notifications-panel');
  const userBtn = document.getElementById('user-icon-btn'); // For user settings
  const logoutBtn = document.getElementById('logout-btn'); // Link in settings
  const logoutPanel = document.getElementById('logout-panel');
  const cancelLogoutBtn = document.getElementById('cancel-logout-btn');
  // ADDED: The final confirmation button
  const confirmLogoutBtn = document.querySelector('.btn-logout-confirm'); 
  const globalPanels = [settingsPanel, notificationsPanel, logoutPanel];

  // -- Home/Profile Page Elements --
  const reminderForm = document.getElementById('add-reminder-form');
  const remindersList = document.getElementById('reminders-list');
  const notificationList = document.getElementById('notification-list');

  // -- Schedule Page Elements --
  const addEventBtn = document.getElementById('schedule-add-btn');
  const addEventPanel = document.getElementById('schedule-add-event-panel');
  const closeEventPanelBtn = document.getElementById('schedule-close-btn');
  const addEventForm = document.getElementById('schedule-event-form');
  const upcomingList = document.getElementById('upcoming-list');
  const eventNameSelect = document.getElementById('event-name-select');
  const customEventGroup = document.getElementById('custom-event-group');
  const customEventInput = document.getElementById('event-name-custom');

  // -- Health Page Elements --
  const currentWeightText = document.getElementById('current-weight-text');
  const currentAllergyText = document.getElementById('current-allergy-text');
  const currentMedicationText = document.getElementById('current-medication-text');
  const addHealthBtn = document.getElementById('health-add-btn');
  const addHealthPanel = document.getElementById('health-add-panel');
  const weightHistoryBtn = document.getElementById('weight-history-btn');
  const medicationLogBtn = document.getElementById('medication-log-btn');
  const vaccinationLogBtn = document.getElementById('vaccination-log-btn');
  const vetVisitsBtn = document.getElementById('vet-visits-btn');
  const weightHistoryPanel = document.getElementById('weight-history-panel');
  const medicationLogPanel = document.getElementById('medication-log-panel');
  const vaccinationLogPanel = document.getElementById('vaccination-log-panel');
  const vetVisitsPanel = document.getElementById('vet-visits-panel');
  const addWeightBtn = document.getElementById('add-weight-btn');
  const addMedicationBtn = document.getElementById('add-medication-btn');
  const addVetVisitBtn = document.getElementById('add-vet-visit-btn');
  const addVaccinationBtn = document.getElementById('add-vaccination-btn');
  const addAllergyBtn = document.getElementById('add-allergy-btn');
  const logWeightPanel = document.getElementById('log-weight-panel');
  const logMedicationPanel = document.getElementById('log-medication-panel');
  const logVaccinationPanel = document.getElementById('log-vaccination-panel');
  const logVetVisitPanel = document.getElementById('log-vet-visit-panel');
  const logAllergyPanel = document.getElementById('log-allergy-panel');
  const allHealthPanels = [addHealthPanel, weightHistoryPanel, medicationLogPanel, vaccinationLogPanel, vetVisitsPanel, logWeightPanel, logMedicationPanel, logVaccinationPanel, logVetVisitPanel, logAllergyPanel];
  const allHealthCloseButtons = document.querySelectorAll('.health-close-btn');
  const allHealthForms = [
    document.getElementById('log-weight-form'),
    document.getElementById('log-medication-form'),
    document.getElementById('log-vaccination-form'),
    document.getElementById('log-vet-visit-form'),
    document.getElementById('log-allergy-form')
  ];

  // -- Contact Page Elements --
  const contactForm = document.getElementById('contact-form');


  // --- 2. MASTER PANEL FUNCTIONS ---

  function showPanel(panel) {
    if (!panel) return;
    pageOverlay.classList.add('overlay-visible');
    
    if (panel.classList.contains('health-log-overlay') || panel.classList.contains('health-form-overlay')) {
      panel.style.display = 'flex';
    } else {
      panel.style.display = 'block';
    }
  }

  function hideAllPanels() {
    pageOverlay.classList.remove('overlay-visible');
    
    globalPanels.forEach(panel => {
      if (panel) panel.style.display = 'none';
    });
    
    if (addEventPanel) addEventPanel.style.display = 'none';
    
    allHealthPanels.forEach(panel => {
      if (panel) panel.style.display = 'none';
    });
  }

  // --- 3. GLOBAL EVENT LISTENERS ---
  
  if (pageOverlay) {
    pageOverlay.addEventListener('click', hideAllPanels);
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      hideAllPanels();
      showPanel(settingsPanel);
    });
  }
  
  if (bellBtn) {
    bellBtn.addEventListener('click', () => {
      hideAllPanels();
      showPanel(notificationsPanel);
      bellBtn.querySelector('.notification-dot')?.remove();
      localStorage.setItem('notificationsRead', 'true');
    });
  }
  
  if (userBtn) {
    userBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'usersettings.html';
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hideAllPanels();
      showPanel(logoutPanel);
    });
  }
  if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener('click', hideAllPanels);
  }

  // === THIS IS THE NEW LOGIC ===
  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Clear all saved data (reminders, health, etc.)
      localStorage.clear(); 
      
    
      window.location.href = 'login.html';
    });
  }

  // --- 4. HOME/PROFILE PAGE LOGIC ---

  if (reminderForm) {
    reminderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('reminder-name');
      const reminderText = input.value;
      if (reminderText.trim() === '') return;

      let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
      reminders.push(reminderText);
      localStorage.setItem('reminders', JSON.stringify(reminders));

      let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
      notifications.push({
        title: 'New Reminder Added',
        text: reminderText,
        time: '1m ago'
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
      localStorage.setItem('notificationsRead', 'false');

      input.value = '';
      alert('Reminder added!');
    });
  }

  if (remindersList) {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    if (reminders.length === 0) {
      remindersList.innerHTML += '<p class="empty-state">No reminders set yet.</p>';
    } else {
      reminders.forEach(text => {
        const reminderHTML = `
          <div class="reminder-card">
            <div class="reminder-icon">
              <img src="images/Icons/bell.svg" alt="Reminder bell">
            </div>
            <div class="reminder-text">
              <h4>${text}</h4>
              <p>Just now</p>
            </div>
          </div>`;
        remindersList.innerHTML += reminderHTML;
      });
    }
  }

  if (notificationList) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    if (notifications.length > 0) {
      notificationList.querySelector('.empty-state')?.remove();
      notifications.forEach(notif => {
        const notifHTML = `
          <div class="notification-item">
            <img src="images/Icons/bell.svg" alt="Reminder">
            <div class="notification-text">
              <h4>${notif.title}</h4>
              <p>${notif.text}</p>
            </div>
          </div>`;
        notificationList.insertAdjacentHTML('afterbegin', notifHTML);
      });
    }
    
    const notificationsRead = localStorage.getItem('notificationsRead');
    if (bellBtn && notifications.length > 0 && notificationsRead === 'false') {
      bellBtn.innerHTML += '<div class="notification-dot"></div>';
    }
  }

  // --- 5. SCHEDULE PAGE LOGIC ---
  if (document.body.classList.contains('schedule-page')) {
    
    const iconMap = {
      "Pill Medication": "images/Icons/pill.svg",
      "Walk": "images/Icons/paw.svg",
      "Groom Appointment": "images/Icons/groom.svg",
      "Veterinary Visit": "images/Icons/black-calender.svg",
      "Other": "images/Icons/bell.svg"
    };

    function addEventCard(event) {
      const emptyState = upcomingList.querySelector('.empty-state');
      if (emptyState) emptyState.remove();
      
      const eventHTML = `
        <div class="event-card">
          <div class="event-card-icon">
            <img src="${event.iconPath}" alt="Event Icon">
          </div>
          <div class="event-card-text">
            <h4>${event.name}</h4>
            <p>${event.time} - ${event.date}</p>
          </div>
        </div>`;
      upcomingList.insertAdjacentHTML('afterbegin', eventHTML);
    }
    
    function loadEvents() {
      const events = JSON.parse(localStorage.getItem('events')) || [];
      if (events.length > 0) {
        events.forEach(event => {
          if (!event.iconPath) event.iconPath = 'images/Icons/bell.svg';
          addEventCard(event);
        });
      }
    }
    loadEvents(); 

    addEventBtn.addEventListener('click', () => showPanel(addEventPanel));
    closeEventPanelBtn.addEventListener('click', hideAllPanels);
    
    eventNameSelect.addEventListener('change', () => {
      customEventGroup.style.display = (eventNameSelect.value === 'Other') ? 'block' : 'none';
    });

    addEventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let eventName;
      let iconPath;
      
      if (eventNameSelect.value === 'Other') {
        eventName = customEventInput.value;
        iconPath = iconMap['Other'];
      } else {
        eventName = eventNameSelect.value;
        iconPath = iconMap[eventName];
      }

      const newEvent = {
        name: eventName,
        date: document.getElementById('event-date-schedule').value,
        time: document.getElementById('event-time-schedule').value,
        iconPath: iconPath
      };

      let events = JSON.parse(localStorage.getItem('events')) || [];
      events.push(newEvent);
      localStorage.setItem('events', JSON.stringify(events));
      addEventCard(newEvent);
      hideAllPanels();
      addEventForm.reset();
      customEventGroup.style.display = 'none';
    });
  }

  // --- 6. HEALTH PAGE LOGIC ---
  if (document.body.classList.contains('health-page')) {
    
    function loadMainHealthData() {
      const weight = localStorage.getItem('currentWeight');
      const allergy = localStorage.getItem('currentAllergy');
      const meds = JSON.parse(localStorage.getItem('medications')) || []; 
      
      if (weight) currentWeightText.textContent = `${weight} lbs`;
      else currentWeightText.textContent = '-- lbs';
      
      if (allergy) currentAllergyText.textContent = allergy;
      else currentAllergyText.textContent = 'No known allergies';

      if (meds.length > 0) currentMedicationText.textContent = meds[meds.length - 1].name; 
      else currentMedicationText.textContent = 'No medications logged.'; 
    }
    loadMainHealthData();

    function loadWeightHistory() {
      const list = document.getElementById('weight-log-list');
      list.innerHTML = '';
      const weights = JSON.parse(localStorage.getItem('weights')) || [];
      if (weights.length === 0) {
        list.innerHTML = '<p class="empty-state">No weight history logged.</p>';
        return;
      }
      weights.reverse().forEach(w => {
        list.insertAdjacentHTML('beforeend', `
          <div class="log-card log-card-weight">
            <strong>${w.weight} lbs</strong>
            <span>${w.date}</span>
          </div>`);
      });
    }
    
    function loadMedicationLog() {
      const list = document.getElementById('medication-log-list');
      list.innerHTML = '';
      const meds = JSON.parse(localStorage.getItem('medications')) || [];
      if (meds.length === 0) {
        list.innerHTML = '<p class="empty-state">No medications logged.</p>';
        return;
      }
      meds.reverse().forEach(m => {
        list.insertAdjacentHTML('beforeend', `
          <div class="log-card log-card-med">
            <h4>${m.name}</h4>
            <div class="log-card-row"><span>Dose:</span><strong>${m.dose}</strong></div>
            <div class="log-card-row"><span>Date Logged:</span><strong>${m.date}</strong></div>
            <div class="log-card-row"><span>Time Administered:</span><strong>${m.time}</strong></div>
          </div>`);
      });
    }

    function loadVaccinationLog() {
      const list = document.getElementById('vaccination-log-list');
      list.innerHTML = '';
      const vax = JSON.parse(localStorage.getItem('vaccinations')) || [];
      if (vax.length === 0) {
        list.innerHTML = '<p class="empty-state">No vaccinations logged.</p>';
        return;
      }
      vax.reverse().forEach(v => {
        list.insertAdjacentHTML('beforeend', `
          <div class="log-card log-card-vax">
            <h4>${v.name}</h4>
            <div class="log-card-row"><span>Date Given:</span><strong>${v.dateGiven}</strong></div>
            <div class="log-card-row"><span>Next Due Date:</span><strong>${v.dateDue}</strong></div>
          </div>`);
      });
    }

    function loadVetVisitLog() {
      const list = document.getElementById('vet-visit-log-list');
      list.innerHTML = '';
      const visits = JSON.parse(localStorage.getItem('vetVisits')) || [];
      if (visits.length === 0) {
        list.innerHTML = '<p class="empty-state">No vet visits logged.</p>';
        return;
      }
      visits.reverse().forEach(v => {
        list.insertAdjacentHTML('beforeend', `
          <div class="log-card log-card-vet">
            <h4>${v.reason}</h4>
            <div class="log-card-row"><span>Date of Visit:</span><strong>${v.date}</strong></div>
            <div class="log-card-row"><span>Clinic Name:</span><strong>${v.clinic}</strong></div>
          </div>`);
      });
    }

    addHealthBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); showPanel(addHealthPanel); });
    allHealthCloseButtons.forEach(btn => btn.addEventListener('click', hideAllPanels));
    weightHistoryBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); loadWeightHistory(); showPanel(weightHistoryPanel); });
    medicationLogBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); loadMedicationLog(); showPanel(medicationLogPanel); });
    vaccinationLogBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); loadVaccinationLog(); showPanel(vaccinationLogPanel); });
    vetVisitsBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); loadVetVisitLog(); showPanel(vetVisitsPanel); });
    addWeightBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); showPanel(logWeightPanel); });
    addMedicationBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); showPanel(logMedicationPanel); });
    addVaccinationBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); showPanel(logVaccinationPanel); });
    addVetVisitBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); showPanel(logVetVisitPanel); });
    addAllergyBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); showPanel(logAllergyPanel); });

    allHealthForms[0].addEventListener('submit', (e) => {
      e.preventDefault();
      const weight = document.getElementById('weight-input').value;
      const date = document.getElementById('weight-date-input').value;
      if (!weight || !date) return;
      let weights = JSON.parse(localStorage.getItem('weights')) || [];
      weights.push({ weight, date });
      localStorage.setItem('weights', JSON.stringify(weights));
      localStorage.setItem('currentWeight', weight);
      loadMainHealthData();
      hideAllPanels();
      e.target.reset();
    });

    allHealthForms[1].addEventListener('submit', (e) => {
      e.preventDefault();
      const newMed = {
        name: document.getElementById('med-name-input').value,
        dose: document.getElementById('med-dose-input').value,
        date: document.getElementById('med-date-input').value,
        time: document.getElementById('med-time-input').value
      };
      if (!newMed.name || !newMed.dose || !newMed.date) return;
      let meds = JSON.parse(localStorage.getItem('medications')) || [];
      meds.push(newMed);
      localStorage.setItem('medications', JSON.stringify(meds));
      loadMainHealthData();
      hideAllPanels();
      e.target.reset();
    });

    allHealthForms[2].addEventListener('submit', (e) => {
      e.preventDefault();
      const newVax = {
        name: document.getElementById('vax-name-input').value,
        dateGiven: document.getElementById('vax-date-given-input').value,
        dateDue: document.getElementById('vax-date-due-input').value
      };
      if (!newVax.name || !newVax.dateGiven || !newVax.dateDue) return;
      let vax = JSON.parse(localStorage.getItem('vaccinations')) || [];
      vax.push(newVax);
      localStorage.setItem('vaccinations', JSON.stringify(vax));
      hideAllPanels();
      e.target.reset();
    });
    
    allHealthForms[3].addEventListener('submit', (e) => {
      e.preventDefault();
      const newVisit = {
        date: document.getElementById('vet-date-input').value,
        reason: document.getElementById('vet-reason-input').value,
        clinic: document.getElementById('vet-clinic-input').value
      };
      if (!newVisit.date || !newVisit.reason || !newVisit.clinic) return;
      let visits = JSON.parse(localStorage.getItem('vetVisits')) || [];
      visits.push(newVisit);
      localStorage.setItem('vetVisits', JSON.stringify(visits));
      hideAllPanels();
      e.target.reset();
    });
    
    allHealthForms[4].addEventListener('submit', (e) => {
      e.preventDefault();
      const allergy = document.getElementById('allergy-name-input').value;
      if (!allergy) return;
      localStorage.setItem('currentAllergy', allergy);
      loadMainHealthData();
      hideAllPanels();
      e.target.reset();
    });
  }

  // --- 7. CONTACT US PAGE LOGIC ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'contact-confirmation.html';
    });
  }

  // --- 8. SETTINGS TOGGLE-SWITCH LOGIC ---
  const allToggles = document.querySelectorAll('.toggle-switch');
  
  allToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentSrc = toggle.getAttribute('src');
      const altSrc = toggle.getAttribute('data-alt-src');
      toggle.setAttribute('src', altSrc);
      toggle.setAttribute('data-alt-src', currentSrc);
      
      if (altSrc.includes('switch-tab-2.png')) {
        toggle.setAttribute('alt', 'Toggle on');
      } else {
        toggle.setAttribute('alt', 'Toggle off');
      }
    });
  });

}); 