const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
        header.style.background = "rgba(11,11,11,.95)";
        header.style.boxShadow = "0 15px 35px rgba(0,0,0,.35)";
    } else {
        header.style.background = "rgba(11,11,11,.75)";
        header.style.boxShadow = "none";
    }
});

const revealElements = document.querySelectorAll(
    ".produto, .marca, .item, .cta, .sobre-home, .contato, .banner-marca, .produto-page, .sobre-page"
);

const reveal = () => {
    const trigger = window.innerHeight * 0.85;
    revealElements.forEach(element => {
        const top = element.getBoundingClientRect().top;
        if (top < trigger) {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        }
    });
};

revealElements.forEach(element => {
    element.style.opacity = "0";
    element.style.transform = "translateY(50px)";
    element.style.transition = ".7s ease";
});

window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);

const miniaturas = document.querySelectorAll(".miniaturas img");
const imagemPrincipal = document.querySelector(".galeria img");

miniaturas.forEach(img => {
    img.addEventListener("click", () => {
        imagemPrincipal.src = img.src;
    });
});

const botoesTamanho = document.querySelectorAll(".tamanhos button");

botoesTamanho.forEach(botao => {
    botao.addEventListener("click", () => {
        botoesTamanho.forEach(item => {
            item.style.background = "#181818";
            item.style.color = "#fff";
            item.style.borderColor = "rgba(255,255,255,.08)";
        });
        botao.style.background = "#C9962D";
        botao.style.color = "#000";
        botao.style.borderColor = "#C9962D";
    });
});

const cards = document.querySelectorAll(".produto");

cards.forEach(card => {
    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(224,182,74,.18), #171717 60%)`;
    });
    card.addEventListener("mouseleave", () => {
        card.style.background = "#171717";
    });
});

const links = document.querySelectorAll('a[href^="#"]');

links.forEach(link => {
    link.addEventListener("click", e => {
        const id = link.getAttribute("href");
        if (id.length > 1) {
            e.preventDefault();
            document.querySelector(id).scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

const ano = new Date().getFullYear();

document.querySelectorAll("footer p").forEach(item => {
    item.innerHTML = `© ${ano} MR13 Imports`;
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");
const closeMenu = document.querySelector(".close-menu");

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("active");
        menuToggle.innerHTML = nav.classList.contains("active") ? "✕" : "☰";
    });

    if (closeMenu) {
        closeMenu.addEventListener("click", () => {
            nav.classList.remove("active");
            menuToggle.innerHTML = "☰";
        });
    }

    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            menuToggle.innerHTML = "☰";
        });
    });

    window.addEventListener("click", e => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove("active");
            menuToggle.innerHTML = "☰";
        }
    });
}
let slideIndex = 0;
const slides = document.querySelectorAll(".carrossel-slide");
const dotsContainer = document.querySelector(".carrossel-dots");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

if (slides.length > 0) {

    // gera um dot para cada slide (o HTML tinha só 4 fixos, aqui criamos dinamicamente)
    dotsContainer.innerHTML = "";
    slides.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.className = "dot";
        dot.addEventListener("click", () => {
            slideIndex = index;
            layout();
        });
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll(".dot");

    // define largura de espaçamento e escala conforme tamanho da tela
    function getSettings() {
        const w = window.innerWidth;
        if (w <= 480) return { spacing: 130, scaleStep: 0.22, opacityStep: 0.45, maxVisible: 2, centerScale: 1.18 };
        if (w <= 900) return { spacing: 170, scaleStep: 0.18, opacityStep: 0.4, maxVisible: 3, centerScale: 1.08 };
        return { spacing: 230, scaleStep: 0.16, opacityStep: 0.35, maxVisible: 3, centerScale: 1 };
    }

    function layout() {
        const total = slides.length;
        const { spacing, scaleStep, opacityStep, maxVisible, centerScale } = getSettings();

        slides.forEach((slide, i) => {
            let offset = i - slideIndex;

            // pega o caminho mais curto (circular) para o efeito ficar contínuo
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const dist = Math.abs(offset);
            const scale = dist === 0 ? centerScale : Math.max(1 - dist * scaleStep, 0.55);
            let opacity = Math.max(1 - dist * opacityStep, 0);
            if (dist > maxVisible) opacity = 0;

            const translateX = offset * spacing;
            const brightness = Math.max(1 - dist * 0.18, 0.35);

            slide.style.transform = `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`;
            slide.style.opacity = opacity;
            slide.style.zIndex = 100 - dist;
            slide.style.filter = `brightness(${brightness})`;
            slide.style.pointerEvents = dist === 0 ? "auto" : "none";
        });

        dots.forEach(dot => dot.classList.remove("active"));
        dots[slideIndex].classList.add("active");
    }

    function goTo(n) {
        const total = slides.length;
        slideIndex = (n + total) % total;
        layout();
    }

    prevBtn.addEventListener("click", () => goTo(slideIndex - 1));
    nextBtn.addEventListener("click", () => goTo(slideIndex + 1));

    setInterval(() => goTo(slideIndex + 1), 4000);

    window.addEventListener("resize", layout);

    layout();
}