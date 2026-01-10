document.addEventListener('DOMContentLoaded', () => {
  // Mostrar mensaje de bienvenida si ya ha visitado
  if (localStorage.getItem('visitedBefore') === 'true') {
    document.getElementById('welcomeBack').classList.remove('d-none');
  } else {
    localStorage.setItem('visitedBefore', 'true');
  }

  // Interacción con las hojas (secretos)
  const leaves = document.querySelectorAll('.leaf-button');
  leaves.forEach(leaf => {
    leaf.addEventListener('click', () => {
      const secret = leaf.getAttribute('data-secret');
      const textEl = leaf.closest('.secret-item').querySelector('.secret-text');

      // Solo revelar si no se ha mostrado antes
      if (!textEl.textContent) {
        // Mostrar texto secreto con animación
        textEl.textContent = secret;
        textEl.classList.add('show');

        // Reproducir sonido
        const sound = document.getElementById('secretSound');
        if (sound) {
          sound.currentTime = 0;
          sound.play().catch(e => {
            console.log("Audio bloqueado por el navegador. Requiere interacción previa.");
          });
        }

        // Cambiar ícono a rosa 🌹 y aplicar estilo de la nueva paleta
        const icon = leaf.querySelector('.leaf-icon');
        if (icon) {
          icon.textContent = '🌹';
          icon.style.color = '#AB47BC'; // Morado principal
          icon.style.textShadow = '0 0 10px rgba(171, 71, 188, 0.6)';
          icon.style.fontSize = '2.2rem';
          icon.style.animation = 'bloom 0.8s ease-out';
        }

        // Estilo del botón: gradiente morado
        leaf.classList.add('revealed');
        leaf.style.background = 'linear-gradient(135deg, #AB47BC, #8E24AA)';
        leaf.style.borderColor = '#AB47BC';
        leaf.style.boxShadow = '0 0 15px rgba(171, 71, 188, 0.4)';
      }
    });
  });

  // Cerrar sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('visitedBefore');
      window.location.href = 'login.html';
    });
  }
});

// ===== ANIMACIÓN AL SCROLL =====
document.addEventListener('DOMContentLoaded', () => {
  // ... (tu código existente: welcomeBack, leaves, logout) ...

  // Observador de intersección para animar secciones
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
      }
    });
  }, {
    threshold: 0.1, // Aparece cuando el 10% de la sección es visible
    rootMargin: "0px 0px -50px 0px" // Empieza un poco antes
  });

  // Aplicar a todas las secciones principales
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });
});