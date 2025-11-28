// ============================================
// DEEPXPERIENCE - OPTIMIZADO
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("DeepXperience cargado");

  // ============================================
  // MENÚ MÓVIL
  // ============================================
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  function closeMenu() {
    if (navLinks) {
      navLinks.classList.remove("active");
      document.body.style.overflow = "auto";
    }
    if (menuToggle) {
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  }

  function openMenu() {
    if (navLinks) {
      navLinks.classList.add("active");
      document.body.style.overflow = "hidden";
      createMobileLangSelector();
    }
    if (menuToggle) {
      menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    }
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.contains("active") ? closeMenu() : openMenu();
    });
  }

  // Cerrar menú al hacer clic en enlaces
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 768) setTimeout(closeMenu, 300);
    });
  });

  // Selector de idioma móvil
  function createMobileLangSelector() {
    if (
      window.innerWidth <= 768 &&
      !document.querySelector(".mobile-lang-selector")
    ) {
      const mobileLangSelector = document.createElement("div");
      mobileLangSelector.className = "mobile-lang-selector";
      mobileLangSelector.innerHTML =
        '<a href="#" data-lang="es" class="mobile-lang-btn active">Español</a><a href="#" data-lang="en" class="mobile-lang-btn">English</a>';
      navLinks.appendChild(mobileLangSelector);

      mobileLangSelector
        .querySelectorAll(".mobile-lang-btn")
        .forEach(function (btn) {
          btn.addEventListener("click", function (e) {
            e.preventDefault();
            setLanguage(btn.getAttribute("data-lang"));
            mobileLangSelector
              .querySelectorAll(".mobile-lang-btn")
              .forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            setTimeout(closeMenu, 300);
          });
        });
    }
  }

  // ============================================
  // SCROLL SUAVE
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = window.innerWidth <= 768 ? 70 : 100;
        window.scrollTo({
          top:
            target.getBoundingClientRect().top + window.pageYOffset - navHeight,
          behavior: "smooth",
        });
      }
    });
  });

  // ============================================
  // CARRUSEL 3D
  // ============================================
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  const prevBtn = document.querySelector(".carousel-arrow.prev");
  const nextBtn = document.querySelector(".carousel-arrow.next");

  let currentSlide = 0;
  let autoPlayInterval;
  const totalSlides = slides.length;

  function updateCarousel() {
    if (!slides.length) return;

    slides.forEach(function (slide, index) {
      let position = index - currentSlide;
      if (position > totalSlides / 2) position -= totalSlides;
      else if (position < -totalSlides / 2) position += totalSlides;
      slide.setAttribute("data-position", position);
    });

    dots.forEach((dot, i) =>
      dot.classList.toggle("active", i === currentSlide)
    );
  }

  function goToSlide(index) {
    if (!totalSlides) return;
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    updateCarousel();
  }

  function startAutoPlay() {
    stopAutoPlay();
    const interval = window.innerWidth <= 768 ? 5000 : 4000;
    autoPlayInterval = setInterval(() => goToSlide(currentSlide + 1), interval);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      goToSlide(currentSlide - 1);
      startAutoPlay();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      goToSlide(currentSlide + 1);
      startAutoPlay();
    });

  dots.forEach((dot, i) =>
    dot.addEventListener("click", () => {
      goToSlide(i);
      startAutoPlay();
    })
  );

  // Touch/Swipe
  let touchStartX = 0;
  const carouselContainer = document.querySelector(".carousel-container");

  if (carouselContainer) {
    carouselContainer.addEventListener(
      "touchstart",
      (e) => (touchStartX = e.changedTouches[0].screenX),
      { passive: true }
    );
    carouselContainer.addEventListener("touchend", function (e) {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) {
        goToSlide(currentSlide + 1);
        startAutoPlay();
      }
      if (touchEndX > touchStartX + 50) {
        goToSlide(currentSlide - 1);
        startAutoPlay();
      }
    });
    carouselContainer.addEventListener("mouseenter", stopAutoPlay);
    carouselContainer.addEventListener("mouseleave", startAutoPlay);
  }

  if (slides.length) {
    updateCarousel();
    startAutoPlay();
  }

  // ============================================
  // CARRUSEL DE EXPERIENCIAS
  // ============================================
  function initExperienceCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const slides = carousel.querySelectorAll(".experience-carousel-slide");
    const dots = carousel.querySelectorAll(".experience-carousel-dot");
    const prevBtn = carousel.querySelector(".experience-carousel-arrow.prev");
    const nextBtn = carousel.querySelector(".experience-carousel-arrow.next");

    let currentIndex = 0;
    let autoInterval;

    function showSlide(index) {
      slides.forEach((s) => s.classList.remove("active"));
      dots.forEach((d) => d.classList.remove("active"));
      currentIndex = ((index % slides.length) + slides.length) % slides.length;
      slides[currentIndex].classList.add("active");
      dots[currentIndex].classList.add("active");
    }

    function startAuto() {
      clearInterval(autoInterval);
      const interval = window.innerWidth <= 768 ? 4000 : 3500;
      autoInterval = setInterval(() => showSlide(currentIndex + 1), interval);
    }

    if (prevBtn)
      prevBtn.addEventListener("click", () => {
        showSlide(currentIndex - 1);
        startAuto();
      });
    if (nextBtn)
      nextBtn.addEventListener("click", () => {
        showSlide(currentIndex + 1);
        startAuto();
      });
    dots.forEach((dot, idx) =>
      dot.addEventListener("click", () => {
        showSlide(idx);
        startAuto();
      })
    );

    // Touch
    let touchStart = 0;
    carousel.addEventListener(
      "touchstart",
      (e) => (touchStart = e.changedTouches[0].screenX),
      { passive: true }
    );
    carousel.addEventListener("touchend", function (e) {
      const touchEnd = e.changedTouches[0].screenX;
      if (touchEnd < touchStart - 50) showSlide(currentIndex + 1);
      if (touchEnd > touchStart + 50) showSlide(currentIndex - 1);
    });

    carousel.addEventListener("mouseenter", () => clearInterval(autoInterval));
    carousel.addEventListener("mouseleave", startAuto);

    showSlide(0);
    startAuto();
  }

  initExperienceCarousel("torres-paine-carousel");

  // ============================================
  // MODALES
  // ============================================
  function setupModal(linkId, modalId, closeId) {
    const link = document.getElementById(linkId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);

    if (link)
      link.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(modal);
      });
    if (closeBtn) closeBtn.addEventListener("click", () => closeModal(modal));
    if (modal)
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal(modal);
      });
  }

  function openModal(modal) {
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  }

  setupModal("open-torres-paine", "modal-torres-paine", "close-torres-paine");
  setupModal("open-quienes-somos", "modal-quienes-somos", "close-modal");

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal(document.getElementById("modal-torres-paine"));
      closeModal(document.getElementById("modal-quienes-somos"));
    }
  });

  // ============================================
  // PARALLAX HERO (Solo desktop)
  // ============================================
  if (window.innerWidth > 768) {
    let ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const heroBackground = document.querySelector(".hero-bg");
          if (heroBackground) {
            heroBackground.style.transform = `translateY(${
              window.pageYOffset * 0.5
            }px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ============================================
  // ANIMACIONES SCROLL
  // ============================================
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  document
    .querySelectorAll(".experience-row, .host-card, .azores-card, .about-text")
    .forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "all 0.8s ease";
      observer.observe(el);
    });

  // ============================================
  // SELECTOR DE IDIOMA DESKTOP
  // ============================================
  const langSelector = document.querySelector(".lang-selector");
  const langSelected = document.querySelector(".lang-selected");
  const langOptions = document.querySelector(".lang-options");

  if (langSelected && langOptions) {
    langSelected.addEventListener("click", function () {
      const isOpen = langOptions.style.display === "flex";
      langOptions.style.display = isOpen ? "none" : "flex";
      const chevron = langSelected.querySelector(".fa-chevron-down");
      if (chevron)
        chevron.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
    });

    langOptions.addEventListener("click", function (e) {
      e.preventDefault();
      if (e.target.tagName === "A") {
        setLanguage(e.target.getAttribute("data-lang"));
        langOptions.style.display = "none";
        const chevron = langSelected.querySelector(".fa-chevron-down");
        if (chevron) chevron.style.transform = "rotate(0deg)";
      }
    });

    document.addEventListener("click", function (e) {
      if (langSelector && !langSelector.contains(e.target)) {
        langOptions.style.display = "none";
        const chevron = langSelected.querySelector(".fa-chevron-down");
        if (chevron) chevron.style.transform = "rotate(0deg)";
      }
    });
  }

  // ============================================
  // NAVBAR SCROLL
  // ============================================
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;
  let navbarTicking = false;

  window.addEventListener("scroll", function () {
    if (!navbarTicking) {
      window.requestAnimationFrame(function () {
        const currentScroll = window.pageYOffset;
        if (navbar) {
          navbar.classList.toggle("scrolled", currentScroll > 100);
        }
        lastScroll = currentScroll;
        navbarTicking = false;
      });
      navbarTicking = true;
    }
  });

  // ============================================
  // ACORDEÓN FOOTER MÓVIL
  // ============================================
  if (window.innerWidth <= 768) {
    document.querySelectorAll(".footer-column h3").forEach(function (header) {
      header.addEventListener("click", function () {
        const column = this.parentElement;
        const isActive = column.classList.contains("active");

        // Cerrar todos
        document
          .querySelectorAll(".footer-column")
          .forEach((col) => col.classList.remove("active"));

        // Abrir el clickeado si no estaba activo
        if (!isActive) column.classList.add("active");
      });
    });
  }

  // ============================================
  // LOADING FINAL
  // ============================================
  document.body.style.opacity = "1";
});

// ============================================
// TRADUCCIONES
// ============================================
const translations = {
  en: {
    "nav-home": "Home",
    "nav-about": "About Us",
    "nav-experiences": "Experiences",
    "nav-contact": "Contact",
    "hero-title": "EXPLORE. DISCOVER. CONNECT.",
    "hero-subtitle":
      "Explore unique experiences in nature, culture, and adventure. Personalized, authentic, and with purpose.",
    "hero-cta": "Your Next Xperience",
    "about-title": "WHY CHOOSE",
    "about-p1":
      "Deep Xperiences was born from the idea of exploring differently: not just seeing landscapes, but understanding and feeling them. We want to take you to powerful natural environments—be it jungle, sea, or mountains—but with a respectful and responsible approach.",
    "experiences-title":
      "LEARN <span class='highlight'>WHILE YOU TRAVEL.</span><br> BUILD YOUR SKILLS <span class='highlight'>AND EXPLORE</span>",
    "patagonia-title": "NORTHERN PATAGONIA",
    "patagonia-desc":
      "A journey that combines navigation, nature, and diving in northern Patagonia, the gateway to the fjords of southern Chile. Aboard local vessels, you will travel the imposing Comau Fjord, exploring its unique marine ecosystems.",
    "patagonia-cta": "View Full Itinerary →",
    "more-experiences-title":
      "MORE <span class='highlight'>UNIQUE EXPERIENCES</span> ON THE WAY",
    "more-experiences-subtitle": "ANOTHER CORNER OF THE WORLD AWAITS YOU",
    "azores-card1-title": "MYSTICAL VOLCANOES",
    "azores-card1-desc": "Explore impressive volcanoes and crystal-clear lakes",
    "azores-card2-title": "ATLANTIC COAST",
    "azores-card2-desc": "Discover dramatic cliffs and pristine beaches",
    "azores-card3-title": "UNDERWATER HISTORY",
    "azores-card3-desc":
      "Connect with the unique flora and fauna of the Atlantic",
    "hosts-title":
      "Join the journey and take your<br><span class='highlight'>creative career</span> to the next level.",
    "hosts-cta": "Join the waiting list",
    "host1-bio":
      '"Exploring is my way of creating. From the mountains or under the sea, every journey teaches me something new about the world and myself. That\'s what I try to convey in each experience."',
    "host2-bio":
      '"Every trip is an opportunity to reconnect with the essential. My mission is for each person to live their own experience, discovering the beauty of nature and the value of protecting it through education."',
    "who-we-are-cta": "Who We Are",
    "footer-desc":
      "We explore the world differently. Unique experiences in nature, culture, and adventure with a responsible and authentic approach.",
    "footer-experiences-title": "Experiences",
    "footer-exp-patagonia": "Northern Patagonia",
    "footer-exp-azores": "Azores",
    "footer-exp-soon": "Coming Soon",
    "footer-exp-waitlist": "Waiting List",
    "footer-info-title": "Information",
    "footer-info-about": "About Us",
    "footer-info-team": "Our Team",
    "footer-info-sustainability": "Sustainability",
    "footer-info-blog": "Blog",
    "footer-info-faq": "FAQ",
    "footer-contact-title": "Contact",
    "footer-contact-location": "Santiago, Chile",
    "footer-newsletter-placeholder": "Your email",
    "footer-newsletter-submit": "Subscribe",
    "footer-rights": "All rights reserved.",
    "footer-made-in": "Designed with ❤️ in Chile",
    "footer-terms": "Terms and Conditions",
    "footer-privacy": "Privacy Policy",
    "footer-cookies": "Cookie Policy",
    "footer-cancellation": "Cancellation Policy",
    "modal-patagonia-title": "NORTHERN PATAGONIA",
    "modal-patagonia-p1":
      "A unique experience in one of the world's most spectacular national parks. This journey combines world-class trekking, postcard-perfect landscapes, and a deep connection with Patagonian nature.",
    "modal-patagonia-highlights-title": "Tour Highlights",
    "modal-patagonia-highlight1":
      "Trekking to the Base of the Towers viewpoint",
    "modal-patagonia-highlight2": "Sailing on Grey Lake among icebergs",
    "modal-patagonia-highlight3":
      "Wildlife spotting: guanacos, condors, and pumas",
    "modal-patagonia-highlight4":
      "Premium accommodation with views of the massif",
    "modal-patagonia-highlight5": "Certified expert guides",
    "modal-patagonia-highlight6": "Gourmet meals with local products",
    "modal-patagonia-duration-title": "Duration",
    "modal-patagonia-duration-desc": "5 days / 4 nights of intensive adventure",
    "modal-patagonia-level-title": "Level",
    "modal-patagonia-level-desc":
      "Intermediate-Advanced (good physical condition required)",
    "modal-patagonia-includes-title": "Includes",
    "modal-patagonia-include1": "Transport from Punta Arenas",
    "modal-patagonia-include2": "Accommodation in premium refuges",
    "modal-patagonia-include3": "All meals and snacks",
    "modal-patagonia-include4": "Technical equipment",
    "modal-patagonia-include5": "Park entrance fees",
    "modal-patagonia-include6": "Travel insurance",
    "modal-patagonia-download-cta": "Download Full Itinerary",
    "modal-about-title": "ABOUT US",
    "modal-about-p1":
      "We chose this path because we believe that traveling is much more than checking destinations off a map. <strong>It's about connecting, discovering, transforming.</strong> And that's exactly what we do every day.",
    "modal-about-p2":
      "Every sunrise on a <strong>peak</strong>, every conversation with locals, every challenging route we design carries our <strong>imprint.</strong> We demand more from ourselves because we know you are trusting us with your days off, your investment, your desire to <strong>feel alive.</strong> And we don't take that lightly. At Deep Xperience, we transform trips into <strong>unforgettable</strong> moments. Because every great story begins with us.",
    "modal-about-team": "DeepXperience Team",
  },
  es: {
    "nav-home": "Inicio",
    "nav-about": "Nosotros",
    "nav-experiences": "Experiencias",
    "nav-contact": "Contacto",
    "hero-title": "EXPLORA. DESCUBRE. CONECTA.",
    "hero-subtitle":
      "Explora experiencias únicas en la naturaleza, cultura y aventura. Personalizadas, auténticas y con propósito.",
    "hero-cta": "Tu Próxima Xperience",
    "about-title": "PORQUE ELEGIR",
    "about-p1":
      "Deep Xperiences nace de la idea de explorar distinto: no solo ver paisajes, sino entenderlos y sentirlos. Queremos llevarte a entornos naturales potentes, ya sea selva, mar, montañas— pero con una mirada respetuosa y responsable.",
    "experiences-title":
      "APRENDE <span class='highlight'>MIENTRAS VIAJAS.</span><br> CONSTRUYE TUS HABILIDADES <span class='highlight'>Y EXPLORA</span>",
    "patagonia-title": "PATAGONIA NORTE",
    "patagonia-desc":
      "Un viaje que combina navegación, naturaleza y buceo en la Patagonia norte, puerta de entrada a los fiordos del sur de Chile. A bordo de embarcaciones locales recorrerás el imponente fiordo Comau, explorando sus ecosistemas marinos únicos.",
    "patagonia-cta": "Ver Itinerario Completo →",
    "more-experiences-title":
      "MAS <span class='highlight'>EXPERIENCIAS</span> UNICAS EN CAMINO",
    "more-experiences-subtitle": "OTRO RINCON DEL MUNDO TE ESPERA",
    "azores-card1-title": "VOLCANES MÍSTICOS",
    "azores-card1-desc":
      "Explora los impresionantes volcanes y lagos de aguas cristalinas",
    "azores-card2-title": "COSTA ATLÁNTICA",
    "azores-card2-desc": "Descubre acantilados dramáticos y playas vírgenes",
    "azores-card3-title": "HISTORIA SUBMARINA",
    "azores-card3-desc": "Conecta con la flora y fauna única del Atlántico",
    "hosts-title":
      "Súmate al viaje y lleva tu<br><span class='highlight'>carrera creativa</span> al siguiente nivel.",
    "hosts-cta": "Súmate a la lista de espera",
    "host1-bio":
      '"Explorar es mi forma de crear. Desde la montaña o bajo el mar, cada viaje me enseña algo nuevo sobre el mundo y sobre mí mismo. Eso es lo que intento transmitir en cada experiencia"',
    "host2-bio":
      '"Cada viaje es una oportunidad para reconectarnos con lo esencial. Mi misión es que cada persona viva su propia experiencia, descubriendo la belleza de la naturaleza y el valor de protegerla a través de la educación"',
    "who-we-are-cta": "Quiénes Somos",
    "footer-desc":
      "Exploramos el mundo de manera diferente. Experiencias únicas en naturaleza, cultura y aventura con un enfoque responsable y auténtico.",
    "footer-experiences-title": "Experiencias",
    "footer-exp-patagonia": "Patagonia Norte",
    "footer-exp-azores": "Azores",
    "footer-exp-soon": "Próximamente",
    "footer-exp-waitlist": "Lista de Espera",
    "footer-info-title": "Información",
    "footer-info-about": "Sobre Nosotros",
    "footer-info-team": "Nuestro Equipo",
    "footer-info-sustainability": "Sostenibilidad",
    "footer-info-blog": "Blog",
    "footer-info-faq": "Preguntas Frecuentes",
    "footer-contact-title": "Contacto",
    "footer-contact-location": "Santiago, Chile",
    "footer-newsletter-placeholder": "Tu email",
    "footer-newsletter-submit": "Suscribir",
    "footer-rights": "Todos los derechos reservados.",
    "footer-made-in": "Diseñado con ❤️ en Chile",
    "footer-terms": "Términos y Condiciones",
    "footer-privacy": "Política de Privacidad",
    "footer-cookies": "Política de Cookies",
    "footer-cancellation": "Política de Cancelación",
    "modal-patagonia-title": "PATAGONIA NORTE",
    "modal-patagonia-p1":
      "Una experiencia única en uno de los parques nacionales más espectaculares del mundo. Este viaje combina trekking de clase mundial, paisajes de postal y conexión profunda con la naturaleza patagónica.",
    "modal-patagonia-highlights-title": "Highlights del Tour",
    "modal-patagonia-highlight1":
      "Trekking hacia el mirador Base de las Torres",
    "modal-patagonia-highlight2": "Navegación por el Lago Grey entre témpanos",
    "modal-patagonia-highlight3":
      "Avistamiento de fauna: guanacos, cóndores y pumas",
    "modal-patagonia-highlight4": "Alojamiento premium con vistas al macizo",
    "modal-patagonia-highlight5": "Guías expertos certificados",
    "modal-patagonia-highlight6": "Comidas gourmet con productos locales",
    "modal-patagonia-duration-title": "Duración",
    "modal-patagonia-duration-desc": "5 días / 4 noches de aventura intensiva",
    "modal-patagonia-level-title": "Nivel",
    "modal-patagonia-level-desc":
      "Intermedio-Avanzado (buena condición física requerida)",
    "modal-patagonia-includes-title": "Incluye",
    "modal-patagonia-include1": "Transporte desde Punta Arenas",
    "modal-patagonia-include2": "Alojamiento en refugios premium",
    "modal-patagonia-include3": "Todas las comidas y snacks",
    "modal-patagonia-include4": "Equipamiento técnico",
    "modal-patagonia-include5": "Entradas al parque",
    "modal-patagonia-include6": "Seguro de viaje",
    "modal-patagonia-download-cta": "Descargar Itinerario Completo",
    "modal-about-title": "NOSOTROS",
    "modal-about-p1":
      "Elegimos este camino porque creemos que viajar es mucho más que marcar destinos en un mapa. <strong>Es conectar, descubrir, transformarse. </strong>Y eso es exactamente lo que hacemos cada día.",
    "modal-about-p2":
      "Cada amanecer en una <strong>cima</strong> cada conversación con locales, cada ruta desafiante que diseñamos lleva nuestra <strong>huella.</strong> Nos exigimos más porque sabemos que estás confiando en nosotros tus días libres, tu inversión, tus ganas de <strong>sentirte vivo.</strong> Y eso no lo tomamos a la ligera. En Deep Experience, transformamos viajes en momentos <strong>inolvidables.</strong> Porque cada gran historia comienza con nosotros.",
    "modal-about-team": "Equipo DeepXperience",
  },
};

function setLanguage(lang) {
  const langData = translations[lang];
  if (!langData) return;

  document.querySelectorAll("[data-lang-key]").forEach(function (el) {
    const key = el.getAttribute("data-lang-key");
    if (langData[key]) el.innerHTML = langData[key];
  });

  const currentLangSpan = document.getElementById("current-lang");
  if (currentLangSpan)
    currentLangSpan.textContent = lang === "en" ? "English" : "Español";
  document.documentElement.lang = lang;
}
