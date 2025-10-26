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
    
    // Get all the buttons and panels
    const addEventBtn = document.getElementById('schedule-add-btn');
    const addEventPanel = document.getElementById('schedule-add-event-panel');
    const closeEventPanelBtn = document.getElementById('schedule-close-btn');
    const addEventForm = document.getElementById('schedule-event-form');
    const upcomingList = document.getElementById('upcoming-list');
    const pageOverlay = document.getElementById('page-overlay');

    // --- Function to show the event panel ---
    function showEventPanel() {
      pageOverlay.classList.add('overlay-visible');
      addEventPanel.style.display = 'block';
    }

    // --- Function to hide the event panel ---
    function hideEventPanel() {
      pageOverlay.classList.remove('overlay-visible');
      addEventPanel.style.display = 'none';
    }
    
    // --- Function to add a new event card to the list ---
    function addEventCard(event) {
      // First, remove the "empty state" message if it's there
      const emptyState = upcomingList.querySelector('.empty-state');
      if (emptyState) {
        emptyState.remove();
      }

      // Create the new event card HTML
      const eventHTML = `
        <div class="event-card">
          <div class="event-card-icon">
            <img src="images/Icons/bell.svg" alt="Event">
          </div>
          <div class="event-card-text">
            <h4>${event.name}</h4>
            <p>${event.time} - ${event.date}</p>
          </div>
        </div>
      `;
      // Add the new card to the top of the list
      upcomingList.insertAdjacentHTML('afterbegin', eventHTML);
    }
    
    // --- 1. Load existing events from Local Storage ---
    function loadEvents() {
      const events = JSON.parse(localStorage.getItem('events')) || [];
      if (events.length > 0) {
        events.forEach(event => {
          addEventCard(event);
        });
      }
    }
    loadEvents(); // Run this function when the page loads

    // --- 2. Listen for "Add Event" button click ---
    addEventBtn.addEventListener('click', showEventPanel);

    // --- 3. Listen for "Close" button click ---
    closeEventPanelBtn.addEventListener('click', hideEventPanel);
    // Also hide panel if user clicks the gray overlay
    pageOverlay.addEventListener('click', () => {
      if (addEventPanel.style.display === 'block') {
        hideEventPanel();
      }
    });

    // --- 4. Listen for "Save" form submission ---
    addEventForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get values from the form
      const newEvent = {
        name: document.getElementById('event-name-schedule').value,
        date: document.getElementById('event-date-schedule').value,
        time: document.getElementById('event-time-schedule').value
      };

      // Get existing events, add new one, save back to storage
      let events = JSON.parse(localStorage.getItem('events')) || [];
      events.push(newEvent);
      localStorage.setItem('events', JSON.stringify(events));

      // Add the new event card to the list right away
      addEventCard(newEvent);

      // Hide the form and reset it
      hideEventPanel();
      addEventForm.reset();
    });
  }
});