async function carregarCatalogo() {
    const path = window.location.pathname;
    let marca = '';

    if (path.includes('nike')) marca = 'Nike';
    else if (path.includes('adidas')) marca = 'Adidas';
    else if (path.includes('puma')) marca = 'Puma';
    else if (path.includes('mizuno')) marca = 'Mizuno';
    else if (path.includes('joma')) marca = 'Joma';

    if (!marca) return;

    const { data, error } = await window.supabaseClient
        .from('produtos')
        .select('*')
        .eq('marca', marca)
        .order('created_at', { ascending: false });

    const container = document.getElementById('produtos-container');
    if (!container) return;

    if (error) {
        container.innerHTML = `<p class="catalogo-aviso">Não foi possível carregar o catálogo. Tente novamente em instantes.</p>`;
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = `<p class="catalogo-aviso">Novidades ${marca} chegando em breve. Fale com a gente no WhatsApp para consultar disponibilidade.</p>`;
        return;
    }

    container.innerHTML = data.map((prod, index) => {
        const capa = prod.imagens && prod.imagens.length > 0 ? prod.imagens[0] : (prod.imagem || '');
        return `
            <article class="produto">
                <img 
                    src="${capa}" 
                    alt="${prod.nome}" 
                    loading="${index < 4 ? 'eager' : 'lazy'}"
                >
                <div class="info">
                    <h3>${prod.nome}</h3>
                    <span>${prod.categoria}</span>
                    <a href="produto.html?id=${prod.id}">Ver detalhes</a>
                </div>
            </article>
        `;
    }).join('');
}

carregarCatalogo();