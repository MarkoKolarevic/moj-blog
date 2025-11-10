function openNav() {
  document.getElementById("sidebar").classList.add("open");
}

function closeNav() {
  document.getElementById("sidebar").classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname;
  const isIndex = path === "/" || path.endsWith("/index.html");
  const isAbout = path.endsWith("/about.html");

  // Sidebar auto-open samo na index/about i samo na desktopu
  const sidebar = document.getElementById("sidebar");
  if (sidebar && (isIndex || isAbout) && window.innerWidth > 768) {
    sidebar.classList.add("open");
  }

  // Citat radi SAMO na indexu (i samo ako postoji #quote-text)
  const quoteText = document.getElementById("quote-text");
  if (isIndex && quoteText) {
    const quotes = [
      'Za zlo doba nisu krivi zli ljudi, već dobri koji ne čine ništa da se to promeni.',
      'Poslednje što žednom čoveku treba je da se izgubi na putu do izvora. ',
      'Ptica ostarela u kavezu ne može da leti pod otvorenim nebom.',
      'Nemati drugog izbora je najbolji izbor.',
      'Najčešće nismo svesni koliko volimo svoje blato.',
      'Nije do krompira, već do bašte na kojoj ga sadiš.',
      'Vrednost je u stvarima o kojima imaš svest.',
      'Svest da u svojim rukama držiš nešto dragoceno – vrednija je od dragocenosti koja ti je u rukama.',
      'Sistem ne gura čoveka sa litice, samo ga primorava da skoči. Rezultat je isti – izgubili smo čoveka.',
      'Ne „možeš“ kao reč, nego "evo" kao dokaz. ',
      'Nada je velika, ali je veće iskustvo koje razuverava. '
    ];

    let current = 0;
    function changeQuote() {
      quoteText.style.opacity = 0;
      setTimeout(() => {
        current = (current + 1) % quotes.length;
        quoteText.textContent = quotes[current];
        quoteText.style.opacity = 1;
      }, 400);
    }
    setInterval(changeQuote, 10000);
  }
});


// Funkcija koja ažurira progres bar
function updateProgressBar() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  const winHeight = window.innerHeight;
  const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
  document.getElementById("progress-bar").style.width = scrollPercent + "%";
}

const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const header = document.querySelector("header");

let lastScrollTop = 0; // prati smer skrolovanja

window.onscroll = function() {
  updateProgressBar();
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

  // 1) dugme za vrh
  scrollToTopBtn.style.display = scrollTop > 1000 ? "block" : "none";

  // 2) smanji header
  if (scrollTop > 10) header.classList.add("shrink");
  else header.classList.remove("shrink");

  // 3) pametno sakrivanje headera
  if (scrollTop > lastScrollTop && scrollTop > 120) {
    // skroluješ NA DOLE
    header.classList.add("hide");
  } else {
    // skroluješ NA GORE
    header.classList.remove("hide");
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // reset da ne ide u minus
};

// klik na vrh
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
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