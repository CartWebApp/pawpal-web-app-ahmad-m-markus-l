/*
========================================
SPLASH PAGE (index.html) LOGIC
========================================
*/
const splashWelcome = document.getElementById('splash-welcome');
if (splashWelcome) {
  setTimeout(() => {
    window.location.href = "login.html";
  }, 3000);
}

/*
========================================
APP LOGIC (Runs on all pages)
========================================
*/

// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. HEADER OVERLAY LOGIC ---
  // This runs on any page that has the dark header
  if (document.body.classList.contains('home-page-dark')) {
    
    // Get header buttons
    const settingsBtn = document.getElementById('settings-icon-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const bellBtn = document.getElementById('bell-icon-btn');
    const notificationsPanel = document.getElementById('notifications-panel');
    const logoutBtn = document.getElementById('logout-btn');
    const logoutPanel = document.getElementById('logout-panel');
    const cancelLogoutBtn = document.getElementById('cancel-logout-btn');
    const pageOverlay = document.getElementById('page-overlay');

    // Show/Hide Functions
    function showPanel(panel) {
      pageOverlay.classList.add('overlay-visible');
      panel.classList.add('overlay-visible');
    }
    function hideAllPanels() {
      pageOverlay.classList.remove('overlay-visible');
      document.querySelectorAll('.overlay-visible').forEach(item => {
        item.classList.remove('overlay-visible');
      });
    }

    // Header Button Listeners
    settingsBtn.addEventListener('click', () => showPanel(settingsPanel));
    bellBtn.addEventListener('click', () => {
      showPanel(notificationsPanel);
      // When user clicks bell, remove the red dot
      bellBtn.querySelector('.notification-dot')?.remove();
      // Mark notifications as "read" in storage
      localStorage.setItem('notificationsRead', 'true');
    });
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logoutPanel.classList.add('overlay-visible');
    });
    pageOverlay.addEventListener('click', hideAllPanels);
    cancelLogoutBtn.addEventListener('click', () => {
      logoutPanel.classList.remove('overlay-visible');
    });
  }

  // --- 2. DYNAMIC "ADD REMINDER" LOGIC ---
  // This code only runs if it finds the "Add Reminder" form
  const reminderForm = document.getElementById('add-reminder-form');
  if (reminderForm) {
    reminderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const input = document.getElementById('reminder-name');
      const reminderText = input.value;

      if (reminderText.trim() === '') return; // Don't add empty reminders

      // --- A. Save to Reminders List (for home.html) ---
      // Get existing reminders from Local Storage, or create an empty array
      let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
      // Add the new one
      reminders.push(reminderText);
      // Save it back
      localStorage.setItem('reminders', JSON.stringify(reminders));

      // --- B. Save to Notifications List (for the bell icon) ---
      let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
      // Add a new notification object
      notifications.push({
        title: 'New Reminder Added',
        text: reminderText,
        time: '1m ago' // This is just an example
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
      
      // Mark notifications as "unread"
      localStorage.setItem('notificationsRead', 'false');

      // Clear the input and give feedback
      input.value = '';
      alert('Reminder added!');
    });
  }

  // --- 3. DYNAMIC "LOAD REMINDERS" LOGIC ---
  // This code only runs if it finds the "Reminders" list
  const remindersList = document.getElementById('reminders-list');
  if (remindersList) {
    // Get reminders from storage
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];

    if (reminders.length === 0) {
      // Show "empty" message if no reminders
      remindersList.innerHTML += '<p class="empty-state">No reminders set yet.</p>';
    } else {
      // Loop through reminders and build the HTML
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
          </div>
        `;
        remindersList.innerHTML += reminderHTML;
      });
    }
  }

  // --- 4. DYNAMIC "LOAD NOTIFICATIONS" LOGIC ---
  // This code runs if it finds the notification list
  const notificationList = document.getElementById('notification-list');
  if (notificationList) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    if (notifications.length > 0) {
      // If we have notifications, remove the "empty" message
      notificationList.querySelector('.empty-state')?.remove();

      // Loop and build the HTML
      notifications.forEach(notif => {
        const notifHTML = `
          <div class="notification-item">
            <img src="images/Icons/bell.svg" alt="Reminder">
            <div class="notification-text">
              <h4>${notif.title}</h4>
              <p>${notif.text}</p>
            </div>
          </div>
        `;
        // 'prepend' adds the newest one to the top
        notificationList.insertAdjacentHTML('afterbegin', notifHTML);
      });
    }
    
    // --- 5. Add the Red Dot ---
    const notificationsRead = localStorage.getItem('notificationsRead');
    const bellBtn = document.getElementById('bell-icon-btn');
    if (notifications.length > 0 && notificationsRead === 'false') {
      bellBtn.innerHTML += '<div class="notification-dot"></div>';
    }
  }

}); // End of "DOMContentLoaded"

/*
========================================
SCHEDULE PAGE (schedule.html) LOGIC
========================================
*/

// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {

  // Check if we are on the schedule page
  if (document.body.classList.contains('schedule-page')) {
    
    // --- Get all the elements ---
    const addEventBtn = document.getElementById('schedule-add-btn');
    const addEventPanel = document.getElementById('schedule-add-event-panel');
    const closeEventPanelBtn = document.getElementById('schedule-close-btn');
    const addEventForm = document.getElementById('schedule-event-form');
    const upcomingList = document.getElementById('upcoming-list');
    const pageOverlay = document.getElementById('page-overlay');

    // Get the new form fields
    const eventNameSelect = document.getElementById('event-name-select');
    const customEventGroup = document.getElementById('custom-event-group');
    const customEventInput = document.getElementById('event-name-custom');

    // A "lookup map" for your icons, just as you described
    const iconMap = {
      "Pill Medication": "images/Icons/pill.svg",
      "Walk": "images/Icons/paw.svg",
      "Groom Appointment": "images/Icons/groom.svg",
      "Veterinary Visit": "images/Icons/black-calender.svg",
      "Other": "images/Icons/bell.svg" // Default bell for custom
    };

    // --- Function to show the event panel ---
    function showEventPanel() {
      pageOverlay.classList.add('overlay-visible');
      addEventPanel.style.display = 'block';
    }

    // --- Function to hide the event panel ---
    function hideEventPanel() {
      pageOverlay.classList.remove('overlay-visible');
      addEventPanel.style.display = 'none';
      // Also hide the custom field when we close
      customEventGroup.style.display = 'none';
    }
    
    // --- Function to add a new event card to the list ---
    // (This is now upgraded to use the event.iconPath)
    function addEventCard(event) {
      const emptyState = upcomingList.querySelector('.empty-state');
      if (emptyState) {
        emptyState.remove();
      }
      
      const eventHTML = `
        <div class="event-card">
          <div class="event-card-icon">
            <img src="${event.iconPath}" alt="Event Icon">
          </div>
          <div class="event-card-text">
            <h4>${event.name}</h4>
            <p>${event.time} - ${event.date}</p>
          </div>
        </div>
      `;
      upcomingList.insertAdjacentHTML('afterbegin', eventHTML);
    }
    
    // --- 1. Load existing events from Local Storage ---
    function loadEvents() {
      const events = JSON.parse(localStorage.getItem('events')) || [];
      if (events.length > 0) {
        // Fix for old events: if iconPath doesn't exist, use a bell
        events.forEach(event => {
          if (!event.iconPath) {
            event.iconPath = 'images/Icons/bell.svg';
          }
          addEventCard(event);
        });
      }
    }
    loadEvents(); // Run this when the page loads

    // --- 2. Listen for "Add Event" button click ---
    addEventBtn.addEventListener('click', showEventPanel);

    // --- 3. Listen for "Close" button click ---
    closeEventPanelBtn.addEventListener('click', hideEventPanel);
    pageOverlay.addEventListener('click', () => {
      if (addEventPanel.style.display === 'block') {
        hideEventPanel();
      }
    });
    
    // --- 4. NEW: Show/Hide Custom Field ---
    eventNameSelect.addEventListener('change', () => {
      if (eventNameSelect.value === 'Other') {
        customEventGroup.style.display = 'block';
      } else {
        customEventGroup.style.display = 'none';
      }
    });

    // --- 5. UPDATED: Listen for "Save" form submission ---
    addEventForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let eventName;
      let iconPath;
      
      // Check which name and icon to use
      if (eventNameSelect.value === 'Other') {
        eventName = customEventInput.value;
        iconPath = iconMap['Other']; // Default bell
      } else {
        eventName = eventNameSelect.value;
        iconPath = iconMap[eventName]; // Look up the correct icon
      }

      // Build the new event object
      const newEvent = {
        name: eventName,
        date: document.getElementById('event-date-schedule').value,
        time: document.getElementById('event-time-schedule').value,
        iconPath: iconPath // Save the icon path!
      };

      // Save to storage
      let events = JSON.parse(localStorage.getItem('events')) || [];
      events.push(newEvent);
      localStorage.setItem('events', JSON.stringify(events));

      // Add the card to the UI
      addEventCard(newEvent);

      // Hide and reset
      hideEventPanel();
      addEventForm.reset();
      customEventGroup.style.display = 'none'; // Make sure to hide this
    });
  }
});

/*
========================================
HEALTH PAGE (health.html) LOGIC
========================================
*/
document.addEventListener('DOMContentLoaded', () => {

  // Check if we are on the health page
  if (document.body.classList.contains('health-page')) {
    
    // --- 1. GET ALL ELEMENTS ---
    const pageOverlay = document.getElementById('page-overlay');

    // Main Page Elements
    const currentWeightText = document.getElementById('current-weight-text');
    const currentAllergyText = document.getElementById('current-allergy-text');
    // ADDED: Main medication text element
    const currentMedicationText = document.getElementById('current-medication-text'); 

    // "Add" Menu (Layer 1)
    const addHealthBtn = document.getElementById('health-add-btn');
    const addHealthPanel = document.getElementById('health-add-panel');
    
    // "Add" Menu Buttons
    const addWeightBtn = document.getElementById('add-weight-btn');
    const addMedicationBtn = document.getElementById('add-medication-btn');
    const addVetVisitBtn = document.getElementById('add-vet-visit-btn');
    const addVaccinationBtn = document.getElementById('add-vaccination-btn');
    const addAllergyBtn = document.getElementById('add-allergy-btn');

    // "History Log" Links
    const weightHistoryBtn = document.getElementById('weight-history-btn');
    const medicationLogBtn = document.getElementById('medication-log-btn');
    const vaccinationLogBtn = document.getElementById('vaccination-log-btn');
    const vetVisitsBtn = document.getElementById('vet-visits-btn');

    // "History Log" Panels (Layer 2 - Display)
    const weightHistoryPanel = document.getElementById('weight-history-panel');
    const medicationLogPanel = document.getElementById('medication-log-panel');
    const vaccinationLogPanel = document.getElementById('vaccination-log-panel');
    const vetVisitsPanel = document.getElementById('vet-visits-panel');
    const logPanels = [weightHistoryPanel, medicationLogPanel, vaccinationLogPanel, vetVisitsPanel];
    
    // "Form" Panels (Layer 2 - Input)
    const logWeightPanel = document.getElementById('log-weight-panel');
    const logMedicationPanel = document.getElementById('log-medication-panel');
    const logVaccinationPanel = document.getElementById('log-vaccination-panel');
    const logVetVisitPanel = document.getElementById('log-vet-visit-panel');
    const logAllergyPanel = document.getElementById('log-allergy-panel');
    const formPanels = [logWeightPanel, logMedicationPanel, logVaccinationPanel, logVetVisitPanel, logAllergyPanel];

    // "Form" Elements
    const logWeightForm = document.getElementById('log-weight-form');
    const logMedicationForm = document.getElementById('log-medication-form');
    const logVaccinationForm = document.getElementById('log-vaccination-form');
    const logVetVisitForm = document.getElementById('log-vet-visit-form');
    const logAllergyForm = document.getElementById('log-allergy-form');

    // "Log List" Containers
    const weightLogList = document.getElementById('weight-log-list');
    const medicationLogList = document.getElementById('medication-log-list');
    const vaccinationLogList = document.getElementById('vaccination-log-list');
    const vetVisitLogList = document.getElementById('vet-visit-log-list');

    // All Close Buttons
    const allCloseButtons = document.querySelectorAll('.health-close-btn');
    
    
    // --- 2. HELPER FUNCTIONS ---
    function showPanel(panel) {
      pageOverlay.classList.add('overlay-visible');
      panel.style.display = 'flex'; // Use flex for vertical centering
    }

    function hideAllPanels() {
      pageOverlay.classList.remove('overlay-visible');
      addHealthPanel.style.display = 'none';
      logPanels.forEach(p => p.style.display = 'none');
      formPanels.forEach(p => p.style.display = 'none');
    }

    // --- 3. LOAD MAIN PAGE DATA ---
    function loadMainHealthData() {
      const weight = localStorage.getItem('currentWeight');
      const allergy = localStorage.getItem('currentAllergy');
      const meds = JSON.parse(localStorage.getItem('medications')) || []; // Get the list of meds
      
      if (weight) {
        currentWeightText.textContent = `${weight} lbs`;
      } else {
        currentWeightText.textContent = '-- lbs';
      }
      
      if (allergy) {
        currentAllergyText.textContent = allergy;
      } else {
        currentAllergyText.textContent = 'No known allergies';
      }

      // NEW: Check for the latest medication name
      if (meds.length > 0) {
          // Display the name of the most recently logged medication
          currentMedicationText.textContent = meds[meds.length - 1].name; 
      } else {
          // Set to blank state if no meds are logged
          currentMedicationText.textContent = 'No medications logged.'; 
      }
    }
    loadMainHealthData(); // Run on page load

    // --- 4. LOAD HISTORY LOG DATA ---
    
    // Load Weight
    function loadWeightHistory() {
      weightLogList.innerHTML = '';
      const weights = JSON.parse(localStorage.getItem('weights')) || [];
      if (weights.length === 0) {
        weightLogList.innerHTML = '<p class="empty-state">No weight history logged.</p>';
        return;
      }
      weights.reverse().forEach(w => {
        const card = `
          <div class="log-card log-card-weight">
            <strong>${w.weight} lbs</strong>
            <span>${w.date}</span>
          </div>`;
        weightLogList.insertAdjacentHTML('beforeend', card);
      });
    }
    
    // Load Medication
    function loadMedicationLog() {
      medicationLogList.innerHTML = '';
      const meds = JSON.parse(localStorage.getItem('medications')) || [];
      if (meds.length === 0) {
        medicationLogList.innerHTML = '<p class="empty-state">No medications logged.</p>';
        return;
      }
      meds.reverse().forEach(m => {
        const card = `
          <div class="log-card log-card-med">
            <h4>${m.name}</h4>
            <div class="log-card-row">
              <span>Dose:</span>
              <strong>${m.dose}</strong>
            </div>
            <div class="log-card-row">
              <span>Date Logged:</span>
              <strong>${m.date}</strong>
            </div>
            <div class="log-card-row">
              <span>Time Administered:</span>
              <strong>${m.time}</strong>
            </div>
          </div>`;
        medicationLogList.insertAdjacentHTML('beforeend', card);
      });
    }

    // Load Vaccinations
    function loadVaccinationLog() {
      vaccinationLogList.innerHTML = '';
      const vax = JSON.parse(localStorage.getItem('vaccinations')) || [];
      if (vax.length === 0) {
        vaccinationLogList.innerHTML = '<p class="empty-state">No vaccinations logged.</p>';
        return;
      }
      vax.reverse().forEach(v => {
        const card = `
          <div class="log-card log-card-vax">
            <h4>${v.name}</h4>
            <div class="log-card-row">
              <span>Date Given:</span>
              <strong>${v.dateGiven}</strong>
            </div>
            <div class="log-card-row">
              <span>Next Due Date:</span>
              <strong>${v.dateDue}</strong>
            </div>
          </div>`;
        vaccinationLogList.insertAdjacentHTML('beforeend', card);
      });
    }

    // Load Vet Visits
    function loadVetVisitLog() {
      vetVisitLogList.innerHTML = '';
      const visits = JSON.parse(localStorage.getItem('vetVisits')) || [];
      if (visits.length === 0) {
        vetVisitLogList.innerHTML = '<p class="empty-state">No vet visits logged.</p>';
        return;
      }
      visits.reverse().forEach(v => {
        const card = `
          <div class="log-card log-card-vet">
            <h4>${v.reason}</h4>
            <div class="log-card-row">
              <span>Date of Visit:</span>
              <strong>${v.date}</strong>
            </div>
            <div class="log-card-row">
              <span>Clinic Name:</span>
              <strong>${v.clinic}</strong>
            </div>
          </div>`;
        vetVisitLogList.insertAdjacentHTML('beforeend', card);
      });
    }


    // --- 5. ADD EVENT LISTENERS ---

    // Open "Add" Menu
    addHealthBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPanel(addHealthPanel);
    });

    // Close all panels
    allCloseButtons.forEach(btn => btn.addEventListener('click', hideAllPanels));
    pageOverlay.addEventListener('click', hideAllPanels);

    // Open "History Log" Panels (Reloads data each time)
    weightHistoryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loadWeightHistory();
      showPanel(weightHistoryPanel);
    });
    medicationLogBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loadMedicationLog();
      showPanel(medicationLogPanel);
    });
    vaccinationLogBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loadVaccinationLog();
      showPanel(vaccinationLogPanel);
    });
    vetVisitsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loadVetVisitLog();
      showPanel(vetVisitsPanel);
    });

    // Open "Form" Panels (from "Add" menu)
    addWeightBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hideAllPanels();
      showPanel(logWeightPanel);
    });
    addMedicationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hideAllPanels();
      showPanel(logMedicationPanel);
    });
    addVaccinationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hideAllPanels();
      showPanel(logVaccinationPanel);
    });
    addVetVisitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hideAllPanels();
      showPanel(logVetVisitPanel);
    });
    addAllergyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hideAllPanels();
      showPanel(logAllergyPanel);
    });

    // --- 6. HANDLE FORM SUBMISSIONS ---

    // Save Weight
    logWeightForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const weight = document.getElementById('weight-input').value;
      const date = document.getElementById('weight-date-input').value;
      
      if (!weight || !date) return; // Simple validation
      
      const newWeight = { weight, date };
      let weights = JSON.parse(localStorage.getItem('weights')) || [];
      weights.push(newWeight);
      localStorage.setItem('weights', JSON.stringify(weights));
      
      // Also update the main page
      localStorage.setItem('currentWeight', weight);
      loadMainHealthData();
      
      hideAllPanels();
      logWeightForm.reset();
    });

    // Save Medication
    logMedicationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // ADDED DOSE INPUT
      const newMed = {
        name: document.getElementById('med-name-input').value,
        dose: document.getElementById('med-dose-input').value, // NEW: get dose
        date: document.getElementById('med-date-input').value,
        time: document.getElementById('med-time-input').value
      };

      if (!newMed.name || !newMed.dose || !newMed.date) return; // Simple validation

      let meds = JSON.parse(localStorage.getItem('medications')) || [];
      meds.push(newMed);
      localStorage.setItem('medications', JSON.stringify(meds));

      // Update the main page to show the new medication name
      loadMainHealthData(); 
      
      hideAllPanels();
      logMedicationForm.reset();
    });

    // Save Vaccination
    logVaccinationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newVax = {
        name: document.getElementById('vax-name-input').value,
        dateGiven: document.getElementById('vax-date-given-input').value,
        dateDue: document.getElementById('vax-date-due-input').value
      };
      if (!newVax.name || !newVax.dateGiven || !newVax.dateDue) return; // Simple validation

      let vax = JSON.parse(localStorage.getItem('vaccinations')) || [];
      vax.push(newVax);
      localStorage.setItem('vaccinations', JSON.stringify(vax));
      hideAllPanels();
      logVaccinationForm.reset();
    });
    
    // Save Vet Visit
    logVetVisitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newVisit = {
        date: document.getElementById('vet-date-input').value,
        reason: document.getElementById('vet-reason-input').value,
        clinic: document.getElementById('vet-clinic-input').value
      };
      if (!newVisit.date || !newVisit.reason || !newVisit.clinic) return; // Simple validation

      let visits = JSON.parse(localStorage.getItem('vetVisits')) || [];
      visits.push(newVisit);
      localStorage.setItem('vetVisits', JSON.stringify(visits));
      hideAllPanels();
      logVetVisitForm.reset();
    });
    
    // Save Allergy
    logAllergyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const allergy = document.getElementById('allergy-name-input').value;
      if (!allergy) return; // Simple validation
      
      localStorage.setItem('currentAllergy', allergy);
      loadMainHealthData();
      hideAllPanels();
      logAllergyForm.reset();
    });

  }
});