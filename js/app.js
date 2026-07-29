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