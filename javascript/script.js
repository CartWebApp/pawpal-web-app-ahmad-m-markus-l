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