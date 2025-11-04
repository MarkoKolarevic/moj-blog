function openNav() {
  document.getElementById("sidebar").classList.add("open");
  if (window.innerWidth <= 768) { // samo za telefon/tablet
    document.body.style.overflow = "hidden";
  }
}

function closeNav() {
  document.getElementById("sidebar").classList.remove("open");
  document.body.style.overflow = "auto";
}


// Samo na index.html automatski otvori sidebar (osim na telefonu)
window.addEventListener("load", function() {
  const sidebar = document.getElementById("sidebar");
  const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";
  const isAbout = window.location.pathname.endsWith("about.html") || window.location.pathname === "/";

  if (isIndex && window.innerWidth > 768) {
    sidebar.classList.add("open");
  }

  if (isAbout && window.innerWidth > 768) {
    sidebar.classList.add("open");
  }
});


    // Funkcija koja ažurira progres bar
function updateProgressBar() {
    // Izračunavanje koliko je stranica skrolovana
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    var winHeight = window.innerHeight;
    
    var scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
    
    // Postavljanje širine progress bar-a
    document.getElementById("progress-bar").style.width = scrollPercent + "%";
}

// Selektuj dugme za skrolovanje na vrh
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Događaj za skrolovanje
window.onscroll = function() {
    // Ažuriraj progres bar
    updateProgressBar();
    
    // Prikazivanje dugmeta za skrolovanje na vrh
    if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

// Kada korisnik klikne na dugme, vrati ga na vrh stranice
scrollToTopBtn.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Dodaje glatko pomeranje prema vrhu
    });
});


function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i=0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let savedTheme = getCookie("theme") || "light";
  applyTheme(savedTheme);

  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      let newTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
      setCookie("theme", newTheme, 30);
      applyTheme(newTheme);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href^="http"]');
  const currentHost = window.location.hostname.replace(/^www\./, ''); // bez www

  links.forEach(link => {
    try {
      const linkHost = new URL(link.href).hostname.replace(/^www\./, '');
      if (linkHost !== currentHost) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    } catch (e) {
      // ako URL nije validan, preskoči
      console.warn("Nevalidan link:", link.href);
    }
  });
});

function animateEmoji(src, button, count = 1){ // count=1 za jedan emoji po kliku
  const rect = button.getBoundingClientRect();
  const startX = rect.left + rect.width/2;
  const startY = rect.top + rect.height/2;

  for(let i=0;i<count;i++){
    const el = document.createElement('img');
    el.src = src;
    el.style.position = 'fixed';
    el.style.left = startX + 'px';
    el.style.top = startY + 'px';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.pointerEvents = 'none';
    el.style.opacity = 1;
    el.style.transform = 'translate(0,0)';
    el.style.transition = 'transform 4s ease-out, opacity 4s ease-out';
    document.body.appendChild(el);

    const distanceY = Math.random()*120 + 150; // koliko ide gore
    const maxSwing = 150; // koliko “gega” levo-desno

    setTimeout(() => {
      // animacija gore sa laganim geganjem
      el.style.transform = `translate(${(Math.random() - 0.5) * maxSwing}px, ${-distanceY}px)`;
      el.style.opacity = 0;
    }, 50);

    setTimeout(() => el.remove(), 4100);
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const BACKEND_URL = 'https://moj-blog-ie60.onrender.com';

  // Povezivanje svih tekstova
  document.querySelectorAll('.tekst').forEach(tekst => {
    const textId = tekst.dataset.id; // data-id iz HTML-a
    const likeBtn = tekst.querySelector('.likeBtn');
    const dislikeBtn = tekst.querySelector('.dislikeBtn');
    const likeCountDiv = likeBtn.querySelector('.count');
    const dislikeCountDiv = dislikeBtn.querySelector('.count');

    // Fetchuje brojače i update-uje UI
    async function fetchCounts(){
      const res = await fetch(`${BACKEND_URL}/get_counts/${textId}`);
      const data = await res.json();
      likeCountDiv.textContent = data.like;
      dislikeCountDiv.textContent = data.dislike;
    }

    // Šalje reakciju serveru
    async function sendReaction(type){
      await fetch(`${BACKEND_URL}/update_count`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({textId, type})
      });
      fetchCounts();
    }

    // Event listener-i
    tekst.querySelector('.likeBtn').addEventListener('click', (e) => {
      animateEmoji('/slike/like.png', e.currentTarget);
      sendReaction('like');
    });

    tekst.querySelector('.dislikeBtn').addEventListener('click', (e) => {
      animateEmoji('/slike/dislike.png', e.currentTarget);
      sendReaction('dislike');
    });

    // Inicijalno stanje
    fetchCounts();
  });

  // Share dugmići
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);
  // ...ostatak koda za share dugmiće
});
// Share dugmići
document.addEventListener("DOMContentLoaded", () => {
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);

  // Facebook
  document.querySelector(".share-facebook")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
      "facebook-share-dialog",
      "width=626,height=436"
    );
  });

  // Twitter
  document.querySelector(".share-twitter")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.open(
      `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`,
      "twitter-share-dialog",
      "width=626,height=436"
    );
  });

  // LinkedIn
  document.querySelector(".share-linkedin")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
      "linkedin-share-dialog",
      "width=626,height=436"
    );
  });
});