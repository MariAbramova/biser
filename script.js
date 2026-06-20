// ===== 1. ЗВЁЗДНОЕ ПОЛЕ =====
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  let stars = [];
  let animationId = null;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    generateStars();
  }

  function generateStars() {
    stars = [];
    const isDark = localStorage.getItem('biserbags-theme') !== 'light';
    const color = isDark ? '192, 192, 192' : '0, 0, 0';
    
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
        color: color
      });
    }
    canvas._stars = stars;
  }

  function drawStars() {
    ctx.clearRect(0, 0, width, height);
    const isDark = localStorage.getItem('biserbags-theme') !== 'light';
    
    stars.forEach(star => {
      star.alpha += star.speed;
      const a = (Math.sin(star.alpha) + 1) / 2;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      const alpha = isDark ? (a * 0.8 + 0.2) : (a * 0.4 + 0.1);
      const color = isDark ? '192, 192, 192' : '0, 0, 0';
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.fill();
    });
    animationId = requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resize);
  resize();
  drawStars();

  // Обновляем звёзды при смене темы
  document.addEventListener('themeChanged', function() {
    generateStars();
  });
})();

// ===== 2. ПЛАВАЮЩИЕ ЧАСТИЦЫ =====
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  function createParticles() {
    container.innerHTML = '';
    const count = 20;
    const isDark = localStorage.getItem('biserbags-theme') !== 'light';
    const color = isDark ? '192, 192, 192' : '0, 0, 0';

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      const size = Math.random() * 12 + 4;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      const alpha = isDark ? (Math.random() * 0.3 + 0.1) : (Math.random() * 0.1 + 0.02);
      particle.style.background = `rgba(${color}, ${alpha})`;
      particle.style.boxShadow = `0 0 ${size * 1.5}px rgba(${color}, ${alpha * 0.5})`;
      particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
      particle.style.animationDelay = -(Math.random() * 20) + 's';
      container.appendChild(particle);
    }
  }

  createParticles();
  document.addEventListener('themeChanged', createParticles);
})();

// ===== 3. ХЕДЕР ПРИ СКРОЛЛЕ =====
(function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
})();

// ===== 4. КНОПКА "ПОКАЗАТЬ ЕЩЕ" =====
(function initLoadMore() {
  const loadMoreBtn = document.getElementById('loadMore');
  const grid = document.querySelector('.grid');
  
  if (!loadMoreBtn || !grid) return;

  const additionalItems = [
    {
      title: 'Серебряный блеск',
      category: 'Вечерняя',
      price: '5 500 ₽',
      description: 'Элегантная сумка из серебряного бисера с мерцающим эффектом',
      image: 'assets/images/bags/bag7.jpg'
    },
    {
      title: 'Чёрный жемчуг',
      category: 'Классика',
      price: '4 800 ₽',
      description: 'Изысканная сумка из чёрного бисера с жемчужным блеском',
      image: 'assets/images/bags/bag8.jpg'
    },
    {
      title: 'Белая лилия',
      category: 'Свадебная',
      price: '7 200 ₽',
      description: 'Нежная сумка из белого бисера с цветочным узором',
      image: 'assets/images/bags/bag9.jpg'
    },
    {
      title: 'Золотая осень',
      category: 'Повседневная',
      price: '4 200 ₽',
      description: 'Тёплая сумка из бисера осенних оттенков',
      image: 'assets/images/bags/bag10.jpg'
    }
  ];

  let currentIndex = 0;
  const itemsPerLoad = 2;

  function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animation = 'fadeIn 0.5s ease';
    
    card.innerHTML = `
      <img class="card-image" src="${item.image}" alt="${item.title}" 
           onerror="this.src='https://via.placeholder.com/400x500/1a1a1a/c0c0c0?text=BiserBags'">
      <div class="card-body">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">
          <span class="card-category">${item.category}</span>
          <span class="card-price">${item.price}</span>
        </div>
        <p class="card-description">${item.description}</p>
        <a href="catalog.html" class="btn-neon">Подробнее</a>
      </div>
    `;
    
    return card;
  }

  function loadMore() {
    const itemsToLoad = additionalItems.slice(currentIndex, currentIndex + itemsPerLoad);
    
    if (itemsToLoad.length === 0) {
      loadMoreBtn.textContent = 'Все загружены ✦';
      loadMoreBtn.disabled = true;
      loadMoreBtn.style.opacity = '0.5';
      loadMoreBtn.style.cursor = 'default';
      return;
    }

    itemsToLoad.forEach(item => {
      const card = createCard(item);
      grid.appendChild(card);
    });

    currentIndex += itemsToLoad.length;
    const total = additionalItems.length;
    const loaded = currentIndex;
    loadMoreBtn.textContent = `Показать еще (${loaded}/${total}) ✦`;

    if (currentIndex >= additionalItems.length) {
      loadMoreBtn.textContent = 'Все загружены ✦';
      loadMoreBtn.disabled = true;
      loadMoreBtn.style.opacity = '0.5';
      loadMoreBtn.style.cursor = 'default';
    }
  }

  const total = additionalItems.length;
  loadMoreBtn.textContent = `Показать еще (0/${total}) ✦`;
  loadMoreBtn.addEventListener('click', loadMore);
})();

// ===== 5. ФОРМА ОБРАТНОЙ СВЯЗИ =====
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const phoneInput = document.getElementById('phone');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    input.style.borderColor = '#ff4444';
    input.classList.add('error');
    const error = document.createElement('span');
    error.className = 'error-message';
    error.textContent = message;
    formGroup.appendChild(error);
  }

  function clearError(input) {
    input.style.borderColor = '';
    input.classList.remove('error');
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message');
    if (error) error.remove();
  }

  // Валидация в реальном времени
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      if (this.value && !validateEmail(this.value)) {
        showError(this, 'Пожалуйста, введите корректный email (example@domain.com)');
      } else {
        clearError(this);
      }
    });
    emailInput.addEventListener('input', function() {
      if (this.value && validateEmail(this.value)) {
        clearError(this);
      }
    });
  }

  if (nameInput) {
    nameInput.addEventListener('blur', function() {
      if (this.value && this.value.length < 2) {
        showError(this, 'Имя должно содержать минимум 2 символа');
      } else {
        clearError(this);
      }
    });
    nameInput.addEventListener('input', function() {
      if (this.value && this.value.length >= 2) {
        clearError(this);
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', function() {
      if (this.value && this.value.length < 5) {
        showError(this, 'Сообщение должно содержать минимум 5 символов');
      } else {
        clearError(this);
      }
    });
    messageInput.addEventListener('input', function() {
      if (this.value && this.value.length >= 5) {
        clearError(this);
      }
    });
  }

  // Обработка отправки
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';

    let isValid = true;

    if (!name || name.length < 2) {
      if (nameInput) showError(nameInput, 'Введите ваше имя (минимум 2 символа)');
      isValid = false;
    }

    if (!email) {
      if (emailInput) showError(emailInput, 'Введите ваш email');
      isValid = false;
    } else if (!validateEmail(email)) {
      if (emailInput) showError(emailInput, 'Введите корректный email (example@domain.com)');
      isValid = false;
    }

    if (!message || message.length < 5) {
      if (messageInput) showError(messageInput, 'Введите сообщение (минимум 5 символов)');
      isValid = false;
    }

    if (!isValid) return;

    const formData = {
      name: name,
      email: email,
      phone: phone || 'Не указан',
      message: message,
      date: new Date().toLocaleString('ru-RU'),
      userAgent: navigator.userAgent
    };

    console.log('📨 НОВОЕ СООБЩЕНИЕ:');
    console.log('─────────────────────────');
    console.log('👤 Имя:', formData.name);
    console.log('📧 Email:', formData.email);
    console.log('📱 Телефон:', formData.phone);
    console.log('💬 Сообщение:', formData.message);
    console.log('📅 Дата:', formData.date);
    console.log('🖥️ Устройство:', formData.userAgent);
    console.log('─────────────────────────');

    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = '✅ Сообщение отправлено! Я свяжусь с вами в ближайшее время.';
    
    const oldMessage = form.querySelector('.success-message');
    if (oldMessage) oldMessage.remove();
    form.appendChild(successMessage);
    form.reset();

    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
      el.style.borderColor = '';
      el.classList.remove('error');
    });

    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.remove();
      }
    }, 5000);
  });
})();

// ===== 6. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ =====
(function initThemeToggle() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTheme);
  } else {
    setupTheme();
  }

  function setupTheme() {
    let toggleBtn = document.getElementById('themeToggle');
    
    if (!toggleBtn) {
      const header = document.querySelector('.header');
      if (header) {
        const wrapper = document.createElement('div');
        wrapper.className = 'theme-toggle-wrapper';
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'themeToggle';
        toggleBtn.className = 'theme-toggle';
        toggleBtn.setAttribute('aria-label', 'Переключить тему');
        wrapper.appendChild(toggleBtn);
        header.appendChild(wrapper);
      } else {
        return;
      }
    }

    const savedTheme = localStorage.getItem('biserbags-theme') || 'dark';
    applyTheme(savedTheme);
    updateButtonText(savedTheme);

    toggleBtn.addEventListener('click', function() {
      const currentTheme = localStorage.getItem('biserbags-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('biserbags-theme', newTheme);
      updateButtonText(newTheme);
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    });
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.style.setProperty('--bg-primary', '#0a0a0a');
      root.style.setProperty('--bg-card', 'rgba(255, 255, 255, 0.02)');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#b0b0b0');
      root.style.setProperty('--border-color', 'rgba(192, 192, 192, 0.08)');
      root.style.setProperty('--silver-color', '#c0c0c0');
      document.body.style.backgroundColor = '#0a0a0a';
      document.body.style.color = '#ffffff';
    } else {
      root.style.setProperty('--bg-primary', '#f5f5f5');
      root.style.setProperty('--bg-card', 'rgba(0, 0, 0, 0.03)');
      root.style.setProperty('--text-primary', '#1a1a1a');
      root.style.setProperty('--text-secondary', '#555555');
      root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.08)');
      root.style.setProperty('--silver-color', '#888888');
      document.body.style.backgroundColor = '#f5f5f5';
      document.body.style.color = '#1a1a1a';
    }

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = theme === 'dark' ? '#0a0a0a' : '#f5f5f5';
    }
  }

  function updateButtonText(theme) {
    const button = document.getElementById('themeToggle');
    if (!button) return;
    button.textContent = theme === 'dark' ? '☽ Светлая' : '☀ Тёмная';
  }
})();