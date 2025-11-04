/* SPLASH PAGE */
// This runs immediately
const splashWelcome = document.getElementById('splash-welcome');
if (splashWelcome) {
  setTimeout(() => {
    window.location.href = "login.html";
  }, 3000);
}

/* UNIVERSAL APP LOGIC */

// --- HELPER FUNCTIONS ---
function getPetProfile() {
  return JSON.parse(localStorage.getItem('petProfile')) || {};
}
function savePetProfile(petData) {
  localStorage.setItem('petProfile', JSON.stringify(petData));
}
// NEW User Profile helpers
function getUserProfile() {
  return JSON.parse(localStorage.getItem('userProfile')) || {};
}
function saveUserProfile(userData) {
  localStorage.setItem('userProfile', JSON.stringify(userData));
}
// --- END HELPER FUNCTIONS ---


// We only have ONE DOMContentLoaded listener for the entire site
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. GET ALL POSSIBLE ELEMENTS ---
  
  // -- Global Panels & Buttons --
  const pageOverlay = document.getElementById('page-overlay');
  const settingsBtn = document.getElementById('settings-icon-btn');
  const settingsPanel = document.getElementById('settings-panel');
  const bellBtn = document.getElementById('bell-icon-btn');
  const notificationsPanel = document.getElementById('notifications-panel');
  const userBtn = document.getElementById('user-icon-btn'); 
  const logoutBtn = document.getElementById('logout-btn'); 
  const logoutPanel = document.getElementById('logout-panel');
  const cancelLogoutBtn = document.getElementById('cancel-logout-btn');
  const confirmLogoutBtn = document.querySelector('.btn-logout-confirm'); 
  const globalPanels = [settingsPanel, notificationsPanel, logoutPanel];
  const markAllReadBtn = document.getElementById('mark-all-read-btn');

  // -- Home Page Elements --
  const homePetName = document.getElementById('home-pet-name'); 
  const remindersList = document.getElementById('reminders-list');
  const notificationList = document.getElementById('notification-list');
  
  // -- Profile "View" Page Elements --
  const reminderForm = document.getElementById('add-reminder-form'); 

  // -- Schedule Page Elements --
  const addEventBtn = document.getElementById('schedule-add-btn');
  const addEventPanel = document.getElementById('schedule-add-event-panel');
  const closeEventPanelBtn = document.getElementById('schedule-close-btn');
  const addEventForm = document.getElementById('schedule-event-form');
  const upcomingList = document.getElementById('upcoming-list');
  const eventNameSelect = document.getElementById('event-name-select');
  const customEventGroup = document.getElementById('custom-event-group');
  const customEventInput = document.getElementById('event-name-custom');
  
  // -- Pet Profile "View" Page Elements --
  const profilePetName = document.getElementById('profile-pet-name');
  const profileWeight = document.getElementById('profile-weight-text');
  const profileGender = document.getElementById('profile-gender-text');
  const profileNeuter = document.getElementById('profile-neuter-text');
  const profileEventList = document.getElementById('profile-event-list');
  const profileSleepCircle = document.getElementById('sleep-circle');
  const profileSleepPercent = document.getElementById('sleep-percent');
  const profileEnergyCircle = document.getElementById('energy-circle');
  const profileEnergyPercent = document.getElementById('energy-percent');

  // -- Health Page Elements --
  const currentWeightText = document.getElementById('current-weight-text');
  const currentAllergyText = document.getElementById('current-allergy-text');
  const currentMedicationText = document.getElementById('current-medication-text');
  const addHealthPanel = document.getElementById('health-add-panel'); 
  const allHealthPanels = document.querySelectorAll('.health-log-overlay, .health-form-overlay, #health-add-panel');
  const allHealthCloseButtons = document.querySelectorAll('.health-close-btn');
  const allHealthForms = [
    document.getElementById('log-weight-form'),
    document.getElementById('log-medication-form'),
    document.getElementById('log-vaccination-form'),
    document.getElementById('log-vet-visit-form'),
    document.getElementById('log-allergy-form')
  ];
  const addHealthBtn = document.getElementById('health-add-btn');
  const weightHistoryBtn = document.getElementById('weight-history-btn');
  const medicationLogBtn = document.getElementById('medication-log-btn');
  const vaccinationLogBtn = document.getElementById('vaccination-log-btn');
  const vetVisitsBtn = document.getElementById('vet-visits-btn');
  const addWeightBtn = document.getElementById('add-weight-btn');
  const addMedicationBtn = document.getElementById('add-medication-btn');
  const addVetVisitBtn = document.getElementById('add-vet-visit-btn');
  const addVaccinationBtn = document.getElementById('add-vaccination-btn');
  const addAllergyBtn = document.getElementById('add-allergy-btn');
  
  // === THIS IS THE FIX FOR THE ERRORS IN YOUR SCREENSHOT ===
  const weightHistoryPanel = document.getElementById('weight-history-panel');
  const medicationLogPanel = document.getElementById('medication-log-panel');
  const vaccinationLogPanel = document.getElementById('vaccination-log-panel');
  const vetVisitsPanel = document.getElementById('vet-visits-panel');
  const logWeightPanel = document.getElementById('log-weight-panel');
  const logMedicationPanel = document.getElementById('log-medication-panel');
  const logVaccinationPanel = document.getElementById('log-vaccination-panel');
  const logVetVisitPanel = document.getElementById('log-vet-visit-panel');
  const logAllergyPanel = document.getElementById('log-allergy-panel');
  // === END OF FIX ===

  // -- Contact Page Elements --
  const contactForm = document.getElementById('contact-form');
  
  // -- Pet "Create" Flow Elements --
  const nextBtn = document.getElementById('next-btn'); 
  const createPetGenderSelect = document.getElementById('create-pet-gender');
  const createNeuterGroup = document.getElementById('neuter-group');
  const createSpayGroup = document.getElementById('spay-group');
  const doneBtn = document.getElementById('done-btn');

  // -- Pet "Edit" Flow Elements --
  const saveEditPetBtn = document.getElementById('save-edit-pet-btn'); 
  const editPetGenderSelect = document.getElementById('edit-pet-gender');
  const editNeuterGroup = document.getElementById('edit-neuter-group');
  const editSpayGroup = document.getElementById('edit-spay-group');

  // -- User "Create" & "Edit" Flow --
  const signupForm = document.getElementById('signup-form');
  const saveUserSettingsBtn = document.getElementById('save-user-settings-btn');


  // --- 2. MASTER PANEL FUNCTIONS ---

  function showPanel(panel) {
    if (!panel) return;
    pageOverlay.classList.add('overlay-visible');
    
    // This is the other fix, which is already in your file
    if (panel && (panel.classList.contains('health-log-overlay') || panel.classList.contains('health-form-overlay') || panel.classList.contains('health-add-overlay'))) {
      panel.style.display = 'flex';
    } else if (panel) {
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

  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear(); 
      window.location.href = 'login.html';
    });
  }

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('notifications', JSON.stringify([]));
      localStorage.setItem('notificationsRead', 'true');
      bellBtn.querySelector('.notification-dot')?.remove();
      if (notificationList) {
        notificationList.innerHTML = '<p class="empty-state">No notifications yet.</p>';
      }
    });
  }

  // --- 4. HOME PAGE & NOTIFICATION LOGIC ---
  
  if (homePetName) {
    const pet = getPetProfile();
    homePetName.textContent = pet.name || 'Pet Name';
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

  // --- 5. PET-PROFILE "VIEW" PAGE LOGIC ---
  
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
  
  if (document.body.classList.contains('profile-page')) {
    
    const pet = getPetProfile(); 
    
    function loadProfileData() {
      const weight = localStorage.getItem('currentWeight') || '--';
      if (profileWeight) profileWeight.textContent = `${weight} lbs`;
      
      if (profilePetName) profilePetName.textContent = pet.name || 'Pet Name';
      if (profileGender) profileGender.textContent = pet.gender || 'Not Set';
      if (profileNeuter) profileNeuter.textContent = pet.neuterStatus || 'Not Set';
    }

    function loadProfileEvents() {
      if (!profileEventList) return;
      
      const events = JSON.parse(localStorage.getItem('events')) || [];
      profileEventList.innerHTML = ''; 
      
      if (events.length === 0) {
        profileEventList.innerHTML = '<p class="empty-state">No upcoming events.</p>';
        return;
      }

      events.forEach(event => {
        const eventHTML = `
          <section class="event-card-item">
            <img src="${event.iconPath || 'images/Icons/bell.svg'}" alt="Event Icon">
            <span>${event.name} - ${event.time}</span>
          </section>
        `;
        profileEventList.insertAdjacentHTML('beforeend', eventHTML);
      });
    }

    function loadProfileStats() {
      let sleep = parseInt(localStorage.getItem('petSleep')) || 97;
      let energy = parseInt(localStorage.getItem('petEnergy')) || 50;
      
      sleep = Math.max(70, sleep - Math.floor(Math.random() * 3)); 
      energy = Math.max(40, energy - Math.floor(Math.random() * 5)); 
      
      if (profileSleepPercent) profileSleepPercent.textContent = `${sleep}%`;
      if (profileEnergyPercent) profileEnergyPercent.textContent = `${energy}%`;
      
      if (profileSleepCircle) profileSleepCircle.style.background = `conic-gradient(#43A2A2 0% ${sleep}%, #f0f0f0 ${sleep}% 100%)`;
      if (profileEnergyCircle) profileEnergyCircle.style.background = `conic-gradient(#43A2A2 0% ${energy}%, #f0f0f0 ${energy}% 100%)`;
      
      localStorage.setItem('petSleep', sleep);
      localStorage.setItem('petEnergy', energy);
    }

    loadProfileData();
    loadProfileEvents();
    loadProfileStats();
  }

  // --- 6. SCHEDULE PAGE LOGIC ---
  if (document.body.classList.contains('schedule-page')) {
    
    const iconMap = {
      "Pill Medication": "images/Icons/pill.svg",
      "Walk": "images/Icons/paw.svg",
      "Groom Appointment": "images/Icons/groom.svg",
      "Veterinary Visit": "images/Icons/black-calender.svg",
      "Other": "images/Icons/bell.svg"
    };

    function addEventCard(event) {
      if (!upcomingList) return;
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

    if (addEventBtn) addEventBtn.addEventListener('click', () => showPanel(addEventPanel));
    if (closeEventPanelBtn) closeEventPanelBtn.addEventListener('click', hideAllPanels);
    
    if (eventNameSelect) {
      eventNameSelect.addEventListener('change', () => {
        if(customEventGroup) customEventGroup.style.display = (eventNameSelect.value === 'Other') ? 'block' : 'none';
      });
    }

    if (addEventForm) {
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

        let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        notifications.push({
          title: 'New Event Added',
          text: newEvent.name,
          time: '1m ago'
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
        localStorage.setItem('notificationsRead', 'false');

        addEventCard(newEvent);
        hideAllPanels();
        addEventForm.reset();
        if(customEventGroup) customEventGroup.style.display = 'none';
      });
    }
  }

  // --- 7. HEALTH PAGE LOGIC ---
  if (document.body.classList.contains('health-page')) {
    
    function loadMainHealthData() {
      const weight = localStorage.getItem('currentWeight');
      const allergy = localStorage.getItem('currentAllergy');
      const meds = JSON.parse(localStorage.getItem('medications')) || []; 
      
      if (currentWeightText) {
        if (weight) currentWeightText.textContent = `${weight} lbs`;
        else currentWeightText.textContent = '-- lbs';
      }
      if (currentAllergyText) {
        if (allergy) currentAllergyText.textContent = allergy;
        else currentAllergyText.textContent = 'No known allergies';
      }
      if (currentMedicationText) {
        if (meds.length > 0) currentMedicationText.textContent = meds[meds.length - 1].name; 
        else currentMedicationText.textContent = 'No medications logged.';
      }
    }
    loadMainHealthData();

    function loadWeightHistory() {
      const list = document.getElementById('weight-log-list');
      if (!list) return;
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
      if (!list) return;
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
      if (!list) return;
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
      if (!list) return;
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

    if (addHealthBtn) addHealthBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); showPanel(addHealthPanel); });
    allHealthCloseButtons.forEach(btn => btn.addEventListener('click', hideAllPanels));
    if (weightHistoryBtn) weightHistoryBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); loadWeightHistory(); showPanel(weightHistoryPanel); });
    if (medicationLogBtn) medicationLogBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); loadMedicationLog(); showPanel(medicationLogPanel); });
    if (vaccinationLogBtn) vaccinationLogBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); loadVaccinationLog(); showPanel(vaccinationLogPanel); });
    if (vetVisitsBtn) vetVisitsBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); loadVetVisitLog(); showPanel(vetVisitsPanel); });
    if (addWeightBtn) addWeightBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); showPanel(logWeightPanel); });
    if (addMedicationBtn) addMedicationBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); showPanel(logMedicationPanel); });
    if (addVaccinationBtn) addVaccinationBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); showPanel(logVaccinationPanel); });
    if (addVetVisitBtn) addVetVisitBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); showPanel(logVetVisitPanel); });
    if (addAllergyBtn) addAllergyBtn.addEventListener('click', (e) => { e.preventDefault(); hideAllPanels(); showPanel(logAllergyPanel); });

    if (allHealthForms[0]) {
      allHealthForms[0].addEventListener('submit', (e) => {
        e.preventDefault();
        const weight = document.getElementById('weight-input').value;
        const date = document.getElementById('weight-date-input').value;
        if (!weight || !date) return;
        let weights = JSON.parse(localStorage.getItem('weights')) || [];
        weights.push({ weight, date });
        localStorage.setItem('weights', JSON.stringify(weights));
        localStorage.setItem('currentWeight', weight);

        let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        notifications.push({
          title: 'Weight Logged',
          text: `${weight} lbs on ${date}`,
          time: '1m ago'
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
        localStorage.setItem('notificationsRead', 'false');

        loadMainHealthData();
        hideAllPanels();
        e.target.reset();
      });
    }

    if (allHealthForms[1]) {
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

        let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        notifications.push({
          title: 'Medication Logged',
          text: newMed.name,
          time: '1m ago'
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
        localStorage.setItem('notificationsRead', 'false');

        loadMainHealthData();
        hideAllPanels();
        e.target.reset();
      });
    }

    if (allHealthForms[2]) {
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

        let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        notifications.push({
          title: 'Vaccination Added',
          text: newVax.name,
          time: '1m ago'
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
        localStorage.setItem('notificationsRead', 'false');

        hideAllPanels();
        e.target.reset();
      });
    }
    
    if (allHealthForms[3]) {
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

        let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        notifications.push({
          title: 'Vet Visit Logged',
          text: newVisit.reason,
          time: '1m ago'
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
        localStorage.setItem('notificationsRead', 'false');

        hideAllPanels();
        e.target.reset();
      });
    }
    
    if (allHealthForms[4]) {
      allHealthForms[4].addEventListener('submit', (e) => {
        e.preventDefault();
        const allergy = document.getElementById('allergy-name-input').value;
        if (!allergy) return;
        localStorage.setItem('currentAllergy', allergy);

        let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        notifications.push({
          title: 'Allergy Added',
          text: allergy,
          time: '1m ago'
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
        localStorage.setItem('notificationsRead', 'false');

        loadMainHealthData();
        hideAllPanels();
        e.target.reset();
      });
    }
  }

  // --- 8. PET "CREATE" AND "EDIT" LOGIC ---
  
  if (createPetGenderSelect) {
    createPetGenderSelect.addEventListener('change', (e) => {
      const selection = e.target.value;
      if (selection === 'Male') {
        if (createNeuterGroup) createNeuterGroup.style.display = 'block';
        if (createSpayGroup) createSpayGroup.style.display = 'none';
      } else if (selection === 'Female') {
        if (createNeuterGroup) createNeuterGroup.style.display = 'none';
        if (createSpayGroup) createSpayGroup.style.display = 'block';
      } else {
        if (createNeuterGroup) createNeuterGroup.style.display = 'none';
        if (createSpayGroup) createSpayGroup.style.display = 'none';
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault(); 
      
      const petName = document.getElementById('create-pet-name').value;
      const petType = document.getElementById('create-pet-type').value;
      const petBreed = document.getElementById('create-pet-breed').value;
      const petDOB = document.getElementById('create-pet-dob').value;
      const petGender = document.getElementById('create-pet-gender').value;
      
      if (!petName || !petType || !petBreed || !petDOB || !petGender) {
        alert('Please fill out all fields before continuing.');
        return; 
      }
      
      let neuterStatus = '';
      if (petGender === 'Male') {
        neuterStatus = document.getElementById('create-pet-neuter').value;
      } else { 
        neuterStatus = document.getElementById('create-pet-spay').value;
      }
      
      if (!neuterStatus) {
        alert('Please select a Spay/Neuter status.');
        return; 
      }
      
      const pet = {
        name: petName,
        type: petType,
        breed: petBreed,
        dob: petDOB,
        gender: petGender,
        neuterStatus: neuterStatus
      };
      
      savePetProfile(pet);
      
      window.location.href = 'additional-info.html';
    });
  }
  
  if (doneBtn) {
    doneBtn.addEventListener('click', (e) => {
      e.preventDefault(); 
      
      const petWeight = document.getElementById('pet-weight').value;
      const petAllergies = document.getElementById('pet-allergies').value;
      const petMedication = document.getElementById('pet-medication').value;
      const petVet = document.getElementById('pet-vet').value; 
      
      const pet = getPetProfile();
      
      pet.weight = petWeight;
      pet.allergies = petAllergies;
      pet.medication = petMedication;
      pet.vet = petVet; 
      
      savePetProfile(pet);
      
      if (petWeight) localStorage.setItem('currentWeight', petWeight);
      if (petAllergies) localStorage.setItem('currentAllergy', petAllergies);
      
      if (petMedication) {
        const newMed = {
          name: petMedication,
          dose: 'As prescribed',
          date: new Date().toISOString().split('T')[0], 
          time: '00:00'
        };
        let meds = JSON.parse(localStorage.getItem('medications')) || [];
        meds.push(newMed);
        localStorage.setItem('medications', JSON.stringify(meds));
      }
      
      window.location.href = 'profile-created.html';
    });
  }
  
  if (saveEditPetBtn) {
    
    if (editPetGenderSelect) {
      editPetGenderSelect.addEventListener('change', (e) => {
        const selection = e.target.value;
        if (selection === 'Male') {
          if (editNeuterGroup) editNeuterGroup.style.display = 'block';
          if (editSpayGroup) editSpayGroup.style.display = 'none';
        } else if (selection === 'Female') {
          if (editNeuterGroup) editNeuterGroup.style.display = 'none';
          if (editSpayGroup) editSpayGroup.style.display = 'block';
        } else {
          if (editNeuterGroup) editNeuterGroup.style.display = 'none';
          if (editSpayGroup) editSpayGroup.style.display = 'none';
        }
      });
    }

    function loadPetDataForEdit() {
      const pet = getPetProfile();
      
      if(document.getElementById('edit-pet-name')) document.getElementById('edit-pet-name').value = pet.name || '';
      if(document.getElementById('edit-pet-type')) document.getElementById('edit-pet-type').value = pet.type || '';
      if(document.getElementById('edit-pet-breed')) document.getElementById('edit-pet-breed').value = pet.breed || '';
      if(document.getElementById('edit-pet-dob')) document.getElementById('edit-pet-dob').value = pet.dob || '';
      
      if (editPetGenderSelect) {
        editPetGenderSelect.value = pet.gender || '';
        editPetGenderSelect.dispatchEvent(new Event('change'));
      }
      
      if (pet.gender === 'Male' && document.getElementById('edit-pet-neuter')) {
        document.getElementById('edit-pet-neuter').value = pet.neuterStatus || '';
      } else if (pet.gender === 'Female' && document.getElementById('edit-pet-spay')) {
        document.getElementById('edit-pet-spay').value = pet.neuterStatus || '';
      }
    }
    
    loadPetDataForEdit();
    
    saveEditPetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const petName = document.getElementById('edit-pet-name').value;
      const petType = document.getElementById('edit-pet-type').value;
      const petBreed = document.getElementById('edit-pet-breed').value;
      const petDOB = document.getElementById('edit-pet-dob').value;
      const petGender = document.getElementById('edit-pet-gender').value;

      let neuterStatus = '';
      if (petGender === 'Male') {
        neuterStatus = document.getElementById('edit-pet-neuter').value;
      } else { 
        neuterStatus = document.getElementById('edit-pet-spay').value;
      }
      
      const updatedPet = getPetProfile();
      
      updatedPet.name = petName;
      updatedPet.type = petType;
      updatedPet.breed = petBreed;
      updatedPet.dob = petDOB;
      updatedPet.gender = petGender;
      updatedPet.neuterStatus = neuterStatus;
      
      savePetProfile(updatedPet);
      
      alert('Profile Updated!');
      window.location.href = 'pet-profile.html'; 
    });
  }

  // --- 9. NEW: USER "CREATE" AND "EDIT" LOGIC ---
  
  // -- LOGIC FOR: signup.html --
  if (signupForm) { 
    signupForm.addEventListener('submit', (e) => { 
      e.preventDefault(); // Stop the form from refreshing
      
      // 1. Get all values
      const firstName = document.getElementById('signup-first-name').value;
      const lastName = document.getElementById('signup-last-name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const passwordConfirm = document.getElementById('signup-password-confirm').value;
      
      // 2. Validation
      // HTML 'required' handles empty fields, so we only check passwords
      
      if (password !== passwordConfirm) {
        alert('Passwords do not match. Please re-type your password.');
        return; // Stop
      }
      
      // 3. Create the user object
      const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password // In a real app, you would hash this
      };
      
      // 4. Save to localStorage
      saveUserProfile(user);
      
      // 5. Go to the next page
      alert('Sign-up successful!');
      window.location.href = 'verify-email.html';
    });
  }
  
  // -- LOGIC FOR: usersettings.html --
  if (saveUserSettingsBtn) {
    
    // 1. Load the user's data into the form
    function loadUserDataForEdit() {
      const user = getUserProfile();
      
      if (document.getElementById('user-first-name')) {
        document.getElementById('user-first-name').value = user.firstName || '';
      }
      if (document.getElementById('user-last-name')) {
        document.getElementById('user-last-name').value = user.lastName || '';
      }
      if (document.getElementById('user-email')) {
        document.getElementById('user-email').value = user.email || '';
      }
      // We don't load the password, for security.
    }
    
    // Run this function immediately when the page loads
    loadUserDataForEdit();
    
    // 2. Save changes when "Save" is clicked
    saveUserSettingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 1. Get the current user data
      const user = getUserProfile();
      
      // 2. Get the new values from the form
      const firstName = document.getElementById('user-first-name').value;
      const lastName = document.getElementById('user-last-name').value;
      const email = document.getElementById('user-email').value;
      const newPassword = document.getElementById('user-password').value;
      
      // 3. Update the user object
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      
      // 4. Only update the password if a new one was typed
      if (newPassword.trim() !== '') {
        user.password = newPassword;
      }
      
      // 5. Save the updated object
      saveUserProfile(user);
      
      alert('User settings updated!');
      // Clear the password field
      document.getElementById('user-password').value = '';
    });
  }


  // --- 10. CONTACT US PAGE LOGIC ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'contact-confirmation.html';
    });
  }

  // --- 11. SETTINGS TOGGLE-SWITCH LOGIC ---
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