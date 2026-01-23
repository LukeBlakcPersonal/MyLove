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

  // ===== MÚSICA INTERACTIVA =====
  let currentAudio = null;

  function renderMusicList(songs = playlist) {
    const container = document.getElementById('musicList');
    if (!container) return;

    container.innerHTML = songs.map((song, index) => `
    <div class="music-track" data-index="${index}" data-color="${song.color}">
      <div class="track-info">
        <div class="track-title">“${song.title}”</div>
        <div class="track-artist">${song.artist}</div>
      </div>
      <button class="play-btn" aria-label="Play">
        <i class="bi bi-play-fill"></i>
      </button>
    </div>
  `).join('');

    // Añadir eventos a los botones
    container.querySelectorAll('.play-btn').forEach(btn => {
      btn.addEventListener('click', handlePlayClick);
    });

    // Añadir evento de búsqueda
    const searchInput = document.getElementById('musicSearch');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase();
        const filtered = playlist.filter(song =>
          song.title.toLowerCase().includes(term) ||
          song.artist.toLowerCase().includes(term)
        );
        renderMusicList(filtered);
      });
    }
  }

  function handlePlayClick(e) {
    const btn = e.currentTarget;
    const track = btn.closest('.music-track');
    const index = parseInt(track.dataset.index);
    const song = playlist[index];

    // Si ya hay una canción reproduciéndose, detenerla
    if (currentAudio && currentAudio !== btn) {
      stopCurrentTrack();
    }

    // Alternar play/pause
    if (btn.classList.contains('playing')) {
      // Pausar
      btn.querySelector('i').className = 'bi bi-play-fill';
      btn.classList.remove('playing');
      if (window.activeAudio) {
        window.activeAudio.pause();
        window.activeAudio = null;
      }
    } else {
      // Reproducir
      if (window.activeAudio) {
        window.activeAudio.pause();
      }
      const audio = new Audio(song.file);
      audio.play().catch(e => console.log("Audio blocked:", e));
      window.activeAudio = audio;

      // Actualizar UI
      document.querySelectorAll('.play-btn').forEach(b => {
        b.classList.remove('playing');
        b.querySelector('i').className = 'bi bi-play-fill';
      });
      btn.classList.add('playing');
      btn.querySelector('i').className = 'bi bi-pause-fill';

      // Detener al final
      audio.onended = () => {
        btn.classList.remove('playing');
        btn.querySelector('i').className = 'bi bi-play-fill';
        window.activeAudio = null;
      };
    }
  }

  function stopCurrentTrack() {
    if (window.activeAudio) {
      window.activeAudio.pause();
      window.activeAudio = null;
    }
    document.querySelectorAll('.play-btn').forEach(btn => {
      btn.classList.remove('playing');
      btn.querySelector('i').className = 'bi bi-play-fill';
    });
  }

  // Inicializar
  renderMusicList();
});

const playlist = [
  {
    title: "Freaks",
    artist: "Surf Curse",
    file: "assets/music/Surf Curse - Freaks [Official Audio].mp3",
    color: "green"
  },
  {
    title: "Dynamite",
    artist: "BTS",
    file: "assets/music/BTS (방탄소년단) 'Dynamite' Official MV.mp3",
    color: "purple"
  },
  {
    title: "Pied Piper",
    artist: "BTS",
    file: "assets/music/Pied Piper.mp3",
    color: "orange"
  },
  {
    title: "Atlantis",
    artist: "Seafret",
    file: "assets/music/Seafret - Atlantis (Official Video).mp3",
    color: "purple"
  },
  {
    title: "Greedy",
    artist: "Tate McRae",
    file: "assets/music/Tate McRae - greedy (Official Video).mp3",
    color: "orange"
  },
  {
    title: "Young and Beatiful",
    artist: "Lana del Rey",
    file: "assets/music/Lana Del Rey - Young and Beautiful.mp3",
    color: "green"
  },
  {
    title: "Complicated",
    artist: "Avril Lavigne",
    file: "assets/music/Avril Lavigne - Complicated (Official Video).mp3",
    color: "orange"
  },
  {
    title: "River",
    artist: "Bishop Briggs",
    file: "assets/music/Bishop Briggs - River.mp3",
    color: "purple"
  },
  {
    title: "BAILE INoLVIDABLE",
    artist: "BAD BUNNY",
    file: "assets/music/BAD BUNNY - BAILE INoLVIDABLE (Video Oficial) ｜ DeBÍ TiRAR MáS FOToS.mp3",
    color: "green"
  },
  {
    title: "FRIENDS",
    artist: "Chase Atlantic",
    file: "assets/music/Chase Atlantic - FRIENDS (Official Lyric Video).mp3",
    color: "orange"
  },
  {
    title: "Clocks",
    artist: "Coldplay",
    file: "assets/music/Coldplay - Clocks (Official Video).mp3",
    color: "purple"
  },
  {
    title: "SWIM",
    artist: "Chase Atlantic",
    file: "assets/music/Chase Atlantic - SWIM (Official Music Video).mp3",
    color: "green"
  },
  {
    title: "Scream & Shout",
    artist: "Will.i.am ft Britney Spears",
    file: "assets/music/will.i.am - Scream & Shout ft. Britney Spears.mp3",
    color: "orange"
  },
  {
    title: "Riptide",
    artist: "Vance Joy",
    file: "assets/music/Vance Joy - Riptide (Lyrics).mp3",
    color: "purple"
  },
  {
    title: "The Beach",
    artist: "The Neighbourhood",
    file: "assets/music/The Neighbourhood - The Beach (Audio).mp3",
    color: "green"
  },
  {
    title: "Rock That Body",
    artist: "The Black Eyed Peas",
    file: "assets/music/The Black Eyed Peas - Rock That Body (Official Music Video).mp3",
    color: "orange"
  },
  {
    title: "Sweater Weather",
    artist: "The Neighbourhood",
    file: "assets/music/Sweater Weather.mp3",
    color: "purple"
  },
  {
    title: "MG",
    artist: "Stuffers",
    file: "assets/music/Stuffers - MG.mp3",
    color: "green"
  },
  {
    title: "Wonderwall",
    artist: "Oasis",
    file: "assets/music/Oasis - Wonderwall (Official Video).mp3",
    color: "orange"
  },
  {
    title: "Paro",
    artist: "NEJ'",
    file: "assets/music/NEJ' - Paro (Clip Officiel).mp3",
    color: "purple"
  },
  {
    title: "Naughty Boy",
    artist: "La la la ft. Sam Smith",
    file: "assets/music/Naughty Boy - La la la ft. Sam Smith (Official Video).mp3",
    color: "green"
  },
  {
    title: "L-O-V-E",
    artist: "Nat King Cole",
    file: "assets/music/Oasis - Wonderwall (Official Video).mp3",
    color: "orange"
  },
  {
    title: "Moonlight",
    artist: "Chase Atlantic",
    file: "assets/music/Moonlight.mp3",
    color: "purple"
  },
  {
    title: "Animals",
    artist: "Maroon 5",
    file: "assets/music/Naughty Boy - La la la ft. Sam Smith (Official Video).mp3",
    color: "green"
  },
  {
    title: "Magic",
    artist: "Jhon Michael Howell",
    file: "assets/music/Oasis - Wonderwall (Official Video).mp3",
    color: "orange"
  },
  {
    title: "Empire State of Mind",
    artist: "JAY-Z ft. Alicia Key",
    file: "assets/music/JAY-Z - Empire State Of Mind ft. Alicia Keys.mp3",
    color: "purple"
  },
  {
    title: "That's My Girl",
    artist: "Fifth Harmny",
    file: "assets/music/Fifth Harmony - That's My Girl (Official Video).mp3",
    color: "green"
  },
  {
    title: "MIDDLE OF THE NIGHT",
    artist: "Elley Duhé",
    file: "assets/music/Elley Duhé - MIDDLE OF THE NIGHT (Official Video).mp3",
    color: "orange"
  },
  {
    title: "Completamente Enamorados",
    artist: "Chayanne",
    file: "assets/music/Chayanne - Completamente Enamorados (Audio).mp3",
    color: "purple"
  },
  {
    title: "Get Lucky",
    artist: "Daft Punk ft. Pharrell Williams, Nile Rodgers",
    file: "assets/music/Daft Punk - Get Lucky (Official Audio) ft. Pharrell Williams, Nile Rodgers.mp3",
    color: "green"
  },
  {
    title: "Te voy a amar",
    artist: "Axel",
    file: "assets/music/Axel - Te Voy A Amar.mp3",
    color: "purple"
  },
  {
    title: "To You, From Me",
    artist: "Naethan Apollo",
    file: "assets/music/To You, From Me.mp3",
    color: "green"
  },
  {
    title: "RUN 달려라 방탄",
    artist: "BTS",
    file: "assets/music/달려라 방탄.mp3",
    color: "green"
  },

  // 👉 Añade más canciones aquí:
  /*
  {
    title: "Tu Canción",
    artist: "Artista",
    file: "assets/music/tu_cancion.mp3",
    color: "orange" // green, orange o purple
  }
  */
];