const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function carregarProduto() {
    if (!id) {
        document.getElementById('detalhes').innerHTML = '<p>Produto não encontrado.</p>';
        return;
    }
    const { data, error } = await window.supabaseClient.from('produtos').select('*').eq('id', id).single();
    if (error || !data) {
        document.getElementById('detalhes').innerHTML = '<p>Produto não encontrado.</p>';
        return;
    }
    const produto = data;
    const imagens = produto.imagens && produto.imagens.length > 0 ? produto.imagens : (produto.imagem ? [produto.imagem] : []);
    const msg = encodeURIComponent(`Olá! Tenho interesse na chuteira ${produto.nome}.`);

    const temMultiplas = imagens.length > 1;
    const setas = temMultiplas ? `
        <button class="carrossel-seta seta-esquerda">&lt;</button>
        <button class="carrossel-seta seta-direita">&gt;</button>
    ` : '';

    document.getElementById('detalhes').innerHTML = `
        <div class="galeria carrossel">
            <div class="carrossel-imagens">
                ${imagens.map((img, i) => `
                    <img 
                        ${i === 0 ? `src="${img}"` : `data-src="${img}"`} 
                        alt="${produto.nome}" 
                        class="carrossel-item"
                    >`).join('')}
            </div>
            ${setas}
        </div>
        <div class="produto-info">
            <span class="titulo-pequeno">MR13 IMPORTS</span>
            <h1>${produto.nome}</h1>
            <h2>${produto.categoria}</h2>
            <p>${produto.descricao || ''}</p>
            <div class="preco">R$ ${parseFloat(produto.preco).toFixed(2)}</div>
            <div class="comprar">
                <a href="https://wa.me/5585921464656?text=${msg}" class="btn" target="_blank">
                    Comprar pelo WhatsApp
                </a>
                <a href="javascript:history.back()" class="btn-outline">
                    Voltar ao Catálogo
                </a>
            </div>
        </div>
    `;

    if (temMultiplas) {
        let indiceAtual = 0;
        const items = document.querySelectorAll('.carrossel-item');
        const total = items.length;

        function mostrarIndice(i) {
            items.forEach((item, idx) => {
                if (idx === i) {
                    if (item.dataset.src) {
                        item.src = item.dataset.src;
                        delete item.dataset.src;
                    }
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }
        mostrarIndice(0);

        document.querySelector('.seta-esquerda').addEventListener('click', () => {
            indiceAtual = (indiceAtual - 1 + total) % total;
            mostrarIndice(indiceAtual);
        });
        document.querySelector('.seta-direita').addEventListener('click', () => {
            indiceAtual = (indiceAtual + 1) % total;
            mostrarIndice(indiceAtual);
        });
    }
}

carregarProduto();