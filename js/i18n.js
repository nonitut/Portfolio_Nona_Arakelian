(() => {
  const translations = {
    ru: {
      'page.title': 'NONA ARAKELIAN ® — Цифровая площадка',
      'meta.description': 'NONI — дизайн, разработка и цифровые продукты.',
      'brand.label': 'NONI — наверх',
      'nav.label': 'Основная навигация',
      'language.label': 'Выбрать язык',
      'nav.work': 'Работы',
      'nav.contact': 'Написать мне в тг',
      'hero.stage': 'Интерактивная трёхмерная абстрактная форма',
      'hero.title': 'Делаю <span style="color: #d8ed9c;">цифровое</span><br><em>интересным</em>',
      'hero.description': 'Дизайн, разработка и аналитика — соединяю идеи,<br> людей и технологии в цифровых продуктах.',
      'hero.bottom': 'Помогаю идеям обрести форму,<br>а продуктам — смысл.',
      'hero.projects': 'Перейти к проектам',
      'work.title': 'Избранные <em>проекты</em>',
      'project.one.stamp': '01 / Проекты, созданные под моим кураторством (45 проектов)',
      'project.one.title': 'Посмотреть спецпроекты',
      'project.two.stamp': '02 / Сайт маркетингового агентства',
      'project.two.title': 'Посмотреть сайт агентства',
      'project.three.stamp': '03 / Мобильное игровое приложение',
      'project.three.title': 'Посмотреть дизайн игры',
      'project.four.stamp': '04 / Ссылка на GitHub',
      'project.four.title': 'Посмотреть мои проекты на GitHub',
      'project.image.alt': 'Мокап браузера с интерфейсом сайта',
      'footer.title': '<br>Давай сделаем<span>что-то классное</span>',
      'footer.description': 'Соединяю дизайн, код и данные,<br>чтобы превращать идеи в работающие продукты',
      'footer.contact': 'Написать мне в тг',
      'footer.character': 'Персонаж NONI',
      'footer.links': 'Мои ссылки'
    },
    en: {
      'page.title': 'NONA ARAKELIAN ® — Digital playground',
      'meta.description': 'NONI — design, development, and digital products.',
      'brand.label': 'NONI — back to top',
      'nav.label': 'Main navigation',
      'language.label': 'Choose language',
      'nav.work': 'Work',
      'nav.contact': 'Message me on Telegram',
      'hero.stage': 'Interactive 3D abstract shape',
      'hero.title': 'Making <span style="color: #d8ed9c;">digital</span><br><em>interesting</em>',
      'hero.description': 'Design, development, and analytics — bringing ideas,<br> people, and technology together in digital products.',
      'hero.bottom': 'Giving ideas a shape,<br>and products a purpose.',
      'hero.projects': 'Explore projects',
      'work.title': 'Selected <em>projects</em>',
      'project.one.stamp': '01 / Projects created under my mentorship (45 projects)',
      'project.one.title': 'Explore special projects',
      'project.two.stamp': '02 / Marketing agency website',
      'project.two.title': 'Explore the agency website',
      'project.three.stamp': '03 / Mobile game app',
      'project.three.title': 'Explore the game design',
      'project.four.stamp': '04 / GitHub profile',
      'project.four.title': 'Explore my GitHub projects',
      'project.image.alt': 'Browser mockup showing a website interface',
      'footer.title': '<br>Let’s make<span>something great</span>',
      'footer.description': 'I bring design, code, and data together<br>to turn ideas into products that work.',
      'footer.contact': 'Message me on Telegram',
      'footer.character': 'NONI character illustration',
      'footer.links': 'My links'
    }
  };

  const languageStorageKey = 'noni-portfolio-language';
  const languageButtons = document.querySelectorAll('[data-language]');
  let language = 'ru';

  try {
    const savedLanguage = localStorage.getItem(languageStorageKey);
    if (typeof savedLanguage === 'string' && savedLanguage in translations) {
      language = savedLanguage;
    }
  } catch (error) {
    console.warn('Could not read the saved language preference:', error);
  }

  function applyLanguage(nextLanguage) {
    language = nextLanguage;
    document.documentElement.lang = language;
    document.title = translations[language]['page.title'];

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      const translation = translations[language][key];
      if (translation === undefined) {
        console.error(`Missing "${language}" translation for "${key}".`);
        return;
      }

      const attribute = element.dataset.i18nAttr;
      if (attribute) {
        element.setAttribute(attribute, translation);
      } else {
        element.innerHTML = translation;
      }
    });

    languageButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });
  }

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextLanguage = button.dataset.language;
      if (nextLanguage === language || !(nextLanguage in translations)) return;

      const main = document.querySelector('main');
      main.classList.add('language-switching');
      requestAnimationFrame(() => {
        applyLanguage(nextLanguage);
        try {
          localStorage.setItem(languageStorageKey, language);
        } catch (error) {
          console.warn('Could not save the language preference:', error);
        }
        requestAnimationFrame(() => main.classList.remove('language-switching'));
      });
    });
  });

  applyLanguage(language);
})();
