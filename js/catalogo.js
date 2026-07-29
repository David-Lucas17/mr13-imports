async function carregarCatalogo() {
    const path = window.location.pathname;
    let marca = '';

    if (path.includes('nike')) marca = 'Nike';
    else if (path.includes('adidas')) marca = 'Adidas';
    else if (path.includes('puma')) marca = 'Puma';
    else if (path.includes('mizuno')) marca = 'Mizuno';

    if (!marca) return;

    const { data, error } = await window.supabaseClient
        .from('produtos')
        .select('*')
        .eq('marca', marca)
        .order('created_at', { ascending: false });

    if (error) return;

    const container = document.getElementById('produtos-container');
    container.innerHTML = data.map(prod => {
        const capa = prod.imagens && prod.imagens.length > 0 ? prod.imagens[0] : (prod.imagem || '');
        return `
            <article class="produto">
                <img src="${capa}" alt="${prod.nome}">
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