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

function closePopup() {
  if (mailingListPopup) {
    mailingListPopup.classList.remove("active");
  }
}

function openPopup() {
  if (mailingListPopup) {
    mailingListPopup.classList.add("active");
  }
}

// Show popup after 3 seconds
setTimeout(() => {
  openPopup();
}, 3000);

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
    openPopup();
  });
}

if (subscribeButtonMobile) {
  subscribeButtonMobile.addEventListener("click", (e) => {
    e.preventDefault();
    closeMenu(); // Close mobile menu first
    openPopup();
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
