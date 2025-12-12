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
