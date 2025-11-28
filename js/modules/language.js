/**
 * Gestor de internacionalización (i18n)
 * Maneja el cambio de idioma entre Español e Inglés
 */

import { translations } from './translations.js';

export class LanguageManager {
  constructor() {
    this.currentLang = 'es';
    this.langSelector = document.querySelector('.lang-selector');
    this.langSelected = document.querySelector('.lang-selected');
    this.langOptions = document.querySelector('.lang-options');
    this.currentLangSpan = document.getElementById('current-lang');

    this.init();
  }

  init() {
    this.attachDesktopListeners();
    this.setLanguage('es'); // Default language
  }

  setLanguage(lang) {
    try {
      const langData = translations[lang];
      if (!langData) {
        console.warn(`Language data not found: ${lang}`);
        return;
      }

      // Update all elements with data-lang-key
      document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.getAttribute('data-lang-key');
        if (langData[key]) {
          el.innerHTML = langData[key];
        }
      });

      // Update current language display
      if (this.currentLangSpan) {
        this.currentLangSpan.textContent = lang === 'en' ? 'English' : 'Español';
      }

      // Update HTML lang attribute
      document.documentElement.lang = lang;
      this.currentLang = lang;

      // Store preference
      localStorage.setItem('preferred-lang', lang);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  }

  attachDesktopListeners() {
    if (!this.langSelected || !this.langOptions) return;

    // Toggle dropdown
    this.langSelected.addEventListener('click', () => {
      const isOpen = this.langOptions.style.display === 'flex';
      this.langOptions.style.display = isOpen ? 'none' : 'flex';

      const chevron = this.langSelected.querySelector('.fa-chevron-down');
      if (chevron) {
        chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });

    // Language selection
    this.langOptions.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.tagName === 'A') {
        const lang = e.target.getAttribute('data-lang');
        this.setLanguage(lang);
        this.langOptions.style.display = 'none';

        const chevron = this.langSelected.querySelector('.fa-chevron-down');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.langSelector && !this.langSelector.contains(e.target)) {
        this.langOptions.style.display = 'none';
        const chevron = this.langSelected.querySelector('.fa-chevron-down');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      }
    });
  }

  createMobileLangSelector(navLinks) {
    if (window.innerWidth > 768 || document.querySelector('.mobile-lang-selector')) {
      return;
    }

    const mobileLangSelector = document.createElement('div');
    mobileLangSelector.className = 'mobile-lang-selector';
    mobileLangSelector.innerHTML = `
      <a href="#" data-lang="es" class="mobile-lang-btn ${this.currentLang === 'es' ? 'active' : ''}">Español</a>
      <a href="#" data-lang="en" class="mobile-lang-btn ${this.currentLang === 'en' ? 'active' : ''}">English</a>
    `;
    navLinks.appendChild(mobileLangSelector);

    mobileLangSelector.querySelectorAll('.mobile-lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang');
        this.setLanguage(lang);

        mobileLangSelector.querySelectorAll('.mobile-lang-btn').forEach(b =>
          b.classList.remove('active')
        );
        btn.classList.add('active');
      });
    });
  }

  getPreferredLanguage() {
    return localStorage.getItem('preferred-lang') || 'es';
  }
}
