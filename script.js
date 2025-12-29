// Mobile menu toggle functionality
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenuOverlay = document.querySelector(".mobile-menu-overlay");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  mobileMenuOverlay.classList.toggle("active");

  // Prevent body scroll when menu is open
  if (mobileMenuOverlay.classList.contains("active")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

// Close menu when clicking on a link
const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");
mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    mobileMenuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// Close menu when clicking outside (on overlay)
mobileMenuOverlay.addEventListener("click", (e) => {
  if (e.target === mobileMenuOverlay) {
    menuToggle.classList.remove("active");
    mobileMenuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// Function to close the menu
function closeMenu() {
  menuToggle.classList.remove("active");
  mobileMenuOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// Close menu when screen size becomes larger than 900px
window.addEventListener("resize", () => {
  if (
    window.innerWidth > 900 &&
    mobileMenuOverlay.classList.contains("active")
  ) {
    closeMenu();
  }
});

// Mailing list popup
const mailingListPopup = document.getElementById("mailingListPopup");
const popupClose = document.querySelector(".popup-close");

// LocalStorage keys
const POPUP_CLOSE_COUNT_KEY = "popupCloseCount";
const POPUP_HIDDEN_UNTIL_KEY = "popupHiddenUntil";
const ALREADY_SUBSCRIBED_KEY = "alreadySubscribed";

// Get popup close count from localStorage
function getPopupCloseCount() {
  const count = localStorage.getItem(POPUP_CLOSE_COUNT_KEY);
  return count ? parseInt(count, 10) : 0;
}

// Increment popup close count
function incrementPopupCloseCount() {
  const currentCount = getPopupCloseCount();
  const newCount = currentCount + 1;
  localStorage.setItem(POPUP_CLOSE_COUNT_KEY, newCount.toString());
  
  // If closed twice, set hidden until timestamp (24 hours from now)
  if (newCount >= 2) {
    const hiddenUntil = Date.now() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    localStorage.setItem(POPUP_HIDDEN_UNTIL_KEY, hiddenUntil.toString());
  }
}

// Reset popup tracking (when subscribe button is clicked or form is submitted)
function resetPopupTracking() {
  localStorage.removeItem(POPUP_CLOSE_COUNT_KEY);
  localStorage.removeItem(POPUP_HIDDEN_UNTIL_KEY);
}

// Expose resetPopupTracking globally so it can be called from HTML form handlers
window.resetPopupTracking = resetPopupTracking;

// Check if user has marked themselves as already subscribed
function isAlreadySubscribed() {
  return localStorage.getItem(ALREADY_SUBSCRIBED_KEY) === "true";
}

// Set already subscribed preference
function setAlreadySubscribed(value) {
  if (value) {
    localStorage.setItem(ALREADY_SUBSCRIBED_KEY, "true");
  } else {
    localStorage.removeItem(ALREADY_SUBSCRIBED_KEY);
  }
}

// Check if popup should be shown
function shouldShowPopup() {
  // First check if user has marked themselves as already subscribed
  if (isAlreadySubscribed()) {
    return false;
  }
  
  // Check if popup is hidden until a certain time
  const hiddenUntil = localStorage.getItem(POPUP_HIDDEN_UNTIL_KEY);
  if (hiddenUntil) {
    const hiddenUntilTime = parseInt(hiddenUntil, 10);
    const now = Date.now();
    
    // If still within the hidden period, don't show
    if (now < hiddenUntilTime) {
      return false;
    } else {
      // Time has passed, reset the tracking
      resetPopupTracking();
    }
  }
  
  return true;
}

function closePopup() {
  if (mailingListPopup) {
    mailingListPopup.classList.remove("active");
    // Track the close action
    incrementPopupCloseCount();
  }
}

function openPopup() {
  if (mailingListPopup && shouldShowPopup()) {
    mailingListPopup.classList.add("active");
  }
}

// Show popup after 3 seconds (only on home page, only if it should be shown)
// Check if we're on the home page (not shows or merch)
const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
if (isHomePage) {
  setTimeout(() => {
    openPopup();
  }, 3000);
}

// Close popup when clicking close button
if (popupClose) {
  popupClose.addEventListener("click", closePopup);
}

// Close popup when clicking outside
if (mailingListPopup) {
  mailingListPopup.addEventListener("click", (e) => {
    if (e.target === mailingListPopup) {
      closePopup();
    }
  });
}

// Close popup when pressing ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mailingListPopup && mailingListPopup.classList.contains("active")) {
    closePopup();
  }
});

// Reopen popup when clicking Subscribe button
const contactButton = document.getElementById("contactButton");
const subscribeButtonMobile = document.querySelector(
  ".subscribe-button-mobile"
);

if (contactButton) {
  contactButton.addEventListener("click", (e) => {
    e.preventDefault();
    // Track subscribe button click
    if (window.plausible) {
      window.plausible("Subscribe Button Click");
    }
    // Remove "already subscribed" preference when subscribe button is clicked
    setAlreadySubscribed(false);
    // Update checkbox state if it exists
    if (alreadySubscribedCheckbox) {
      alreadySubscribedCheckbox.checked = false;
    }
    resetPopupTracking(); // Reset tracking when subscribe button is clicked
    openPopup(); // Always show popup when subscribe button is clicked
  });
}

if (subscribeButtonMobile) {
  subscribeButtonMobile.addEventListener("click", (e) => {
    e.preventDefault();
    // Track subscribe button click
    if (window.plausible) {
      window.plausible("Subscribe Button Click");
    }
    closeMenu(); // Close mobile menu first
    // Remove "already subscribed" preference when subscribe button is clicked
    setAlreadySubscribed(false);
    // Update checkbox state if it exists
    if (alreadySubscribedCheckbox) {
      alreadySubscribedCheckbox.checked = false;
    }
    resetPopupTracking(); // Reset tracking when subscribe button is clicked
    openPopup(); // Always show popup when subscribe button is clicked
  });
}

// Handle "Already subscribed?" checkbox
const alreadySubscribedCheckbox = document.getElementById("alreadySubscribedCheckbox");
if (alreadySubscribedCheckbox) {
  // Set initial state from localStorage
  alreadySubscribedCheckbox.checked = isAlreadySubscribed();
  
  // Handle checkbox change
  alreadySubscribedCheckbox.addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    setAlreadySubscribed(isChecked);
    
    // If checked, close the popup immediately
    if (isChecked && mailingListPopup) {
      closePopup();
    }
  });
}

// Ensure footer contact link works
const footerContact = document.getElementById("footerContact");
if (footerContact) {
  footerContact.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "mailto:wtf.crazier@gmail.com?subject=Contact";
  });
}

// Copy email to clipboard functionality
function setupCopyEmailButton(buttonId, feedbackId) {
  const copyEmailBtn = document.getElementById(buttonId);
  const copyFeedback = document.getElementById(feedbackId);

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const email = "wtf.crazier@gmail.com";
      
      try {
        await navigator.clipboard.writeText(email);
        
        // Show feedback
        if (copyFeedback) {
          copyFeedback.classList.add("show");
          setTimeout(() => {
            copyFeedback.classList.remove("show");
          }, 2000);
        }
        
        // Track copy action
        if (window.plausible) {
          window.plausible("Email Copied");
        }
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          if (copyFeedback) {
            copyFeedback.classList.add("show");
            setTimeout(() => {
              copyFeedback.classList.remove("show");
            }, 2000);
          }
        } catch (fallbackErr) {
          console.error("Failed to copy email:", fallbackErr);
        }
        document.body.removeChild(textArea);
      }
    });
  }
}

// Setup copy buttons for footer and forms
setupCopyEmailButton("copyEmailBtn", "copyFeedback");
setupCopyEmailButton("copyEmailBtnForm", "copyFeedbackForm");
