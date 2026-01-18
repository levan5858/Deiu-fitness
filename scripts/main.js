// Deiu Fitness - shared behavior
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".menu-toggle");
  const navList = document.querySelector("nav ul");
  const yearEl = document.querySelector(".js-year");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const filterItems = document.querySelectorAll("[data-type]");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      navList.classList.toggle("open");
    });
  }

  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navList && navList.classList.contains("open")) {
        navList.classList.remove("open");
      }
    });
  });

  // Active link highlighting for GitHub Pages (relative links)
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const linkPath = href.split("/").pop() || "index.html";
    if (currentPath === linkPath) {
      link.classList.add("active");
    }
  });

  // Reveal on scroll with staggered animations
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Staggered animations for grid items
  const gridItems = document.querySelectorAll(".gallery-item, .merch-card, .grid .card");
  if ("IntersectionObserver" in window && gridItems.length) {
    const gridObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("is-visible");
            }, index * 50);
            gridObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    gridItems.forEach((el) => gridObserver.observe(el));
  } else {
    gridItems.forEach((el) => el.classList.add("is-visible"));
  }

  // Header scroll effect
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  });

  // Filters (media gallery)
  if (filterButtons.length && filterItems.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        filterButtons.forEach((b) => b.classList.toggle("active", b === btn));
        filterItems.forEach((item) => {
          const type = item.dataset.type;
          const match = filter === "all" || type === filter;
          item.style.display = match ? "block" : "none";
        });
      });
    });
  }

  // Media lightbox (photos + videos)
  if (galleryItems.length) {
    galleryItems.forEach((item) => {
      item.addEventListener("click", () => openLightbox(item));
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });
  }

  function openLightbox(item) {
    const imageSrc = item.dataset.lightbox || item.querySelector("img")?.src;
    const videoSrc = item.dataset.video;
    const caption = item.dataset.caption || item.querySelector("img")?.alt || "";
    if (!imageSrc && !videoSrc) return;

    closeLightbox();

    const overlay = document.createElement("div");
    overlay.className = "lightbox";

    const isLocalVideo = videoSrc && (videoSrc.endsWith(".mp4") || videoSrc.endsWith(".webm") || videoSrc.endsWith(".mov"));

    overlay.innerHTML = `
      <div class="lightbox-inner">
        <button class="lightbox-close" aria-label="Close" data-close="true">×</button>
        <div class="lightbox-media">
          ${
            videoSrc
              ? isLocalVideo
                ? `<video controls autoplay><source src="${videoSrc}" type="video/mp4">Your browser does not support the video tag.</video>`
                : `<iframe src="${videoSrc}" allowfullscreen title="${caption || "Deiu Fitness media"}"></iframe>`
              : `<img src="${imageSrc}" alt="${caption || "Deiu Fitness media"}" />`
          }
        </div>
        <div class="lightbox-caption">${caption}</div>
      </div>
    `;

    overlay.addEventListener("click", (e) => {
      if (e.target.dataset.close === "true" || e.target === overlay) {
        closeLightbox();
      }
    });

    document.body.appendChild(overlay);
    document.addEventListener("keydown", handleLightboxEscape);
  }

  function handleLightboxEscape(e) {
    if (e.key === "Escape") {
      closeLightbox();
    }
  }

  function closeLightbox() {
    const existing = document.querySelector(".lightbox");
    if (existing) {
      existing.remove();
      document.removeEventListener("keydown", handleLightboxEscape);
    }
  }
});
