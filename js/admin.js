async function checkAuth() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
    }
}
checkAuth();

document.getElementById('logout-btn').addEventListener('click', async () => {
    await window.supabaseClient.auth.signOut();
    window.location.href = 'login.html';
});

const form = document.getElementById('product-form');
const prodId = document.getElementById('prod-id');
const nome = document.getElementById('nome');
const marca = document.getElementById('marca');
const categoria = document.getElementById('categoria');
const preco = document.getElementById('preco');
const descricao = document.getElementById('descricao');
const imagemInput = document.getElementById('imagem');
const cancelBtn = document.getElementById('cancel-edit');
const formTitle = document.getElementById('form-title');
const searchInput = document.getElementById('search');
const tbody = document.getElementById('products-tbody');
const previewContainer = document.getElementById('preview-container');
const existingImagesContainer = document.getElementById('existing-images');

let editingId = null;
let existingImages = [];
let newFiles = [];

cancelBtn.addEventListener('click', resetForm);

imagemInput.addEventListener('change', (e) => {
    newFiles = Array.from(e.target.files);
    renderPreviews();
});

function resetForm() {
    form.reset();
    prodId.value = '';
    editingId = null;
    existingImages = [];
    newFiles = [];
    formTitle.textContent = 'Cadastrar Produto';
    cancelBtn.style.display = 'none';
    imagemInput.value = '';
    previewContainer.innerHTML = '';
    if (existingImagesContainer) existingImagesContainer.innerHTML = '';
}

function renderPreviews() {
    previewContainer.innerHTML = '';
    newFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="remove-preview" data-index="${index}">✕</button>
            `;
            previewContainer.appendChild(div);
        };
        reader.readAsDataURL(file);
    });

    document.querySelectorAll('.remove-preview').forEach(btn => {
        btn.addEventListener('click', () => {
            newFiles.splice(btn.dataset.index, 1);
            renderPreviews();
        });
    });
}

function renderExistingImages() {
    if (!existingImagesContainer) return;
    existingImagesContainer.innerHTML = '';
    existingImages.forEach((url, index) => {
        const div = document.createElement('div');
        div.className = 'existing-item';
        div.innerHTML = `
            <img src="${url}" alt="Imagem existente">
            <button type="button" class="remove-existing" data-index="${index}">✕</button>
        `;
        existingImagesContainer.appendChild(div);
    });

    document.querySelectorAll('.remove-existing').forEach(btn => {
        btn.addEventListener('click', () => {
            existingImages.splice(btn.dataset.index, 1);
            renderExistingImages();
        });
    });
}

function comprimirImagem(file, maxLargura = 1200, qualidade = 0.75) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.onerror = reject;

        img.onload = () => {
            let largura = img.width;
            let altura = img.height;

            if (largura > maxLargura) {
                altura = Math.round((altura * maxLargura) / largura);
                largura = maxLargura;
            }

            const canvas = document.createElement('canvas');
            canvas.width = largura;
            canvas.height = altura;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, largura, altura);

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Falha ao comprimir imagem.'));
                    return;
                }
                const novoNome = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
                const novoArquivo = new File([blob], novoNome, { type: 'image/jpeg' });
                resolve(novoArquivo);
            }, 'image/jpeg', qualidade);
        };
        img.onerror = reject;

        reader.readAsDataURL(file);
    });
}

async function loadProducts(search = '') {
    let query = window.supabaseClient.from('produtos').select('*').order('created_at', { ascending: false });
    if (search) {
        query = query.ilike('nome', `%${search}%`);
    }
    const { data, error } = await query;
    if (error) {
        console.error(error);
        return;
    }
    tbody.innerHTML = '';
    data.forEach(prod => {
        const primeiraImagem = prod.imagens && prod.imagens.length > 0 ? prod.imagens[0] : (prod.imagem || '');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${primeiraImagem}" alt="${prod.nome}"></td>
            <td>${prod.nome}</td>
            <td>${prod.marca}</td>
            <td>${prod.categoria}</td>
            <td>R$ ${parseFloat(prod.preco).toFixed(2)}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${prod.id}">Editar</button>
                <button class="delete-btn" data-id="${prod.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editProduct(btn.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });
}

async function editProduct(id) {
    const { data, error } = await window.supabaseClient.from('produtos').select('*').eq('id', id).single();
    if (error) {
        alert('Erro ao carregar produto.');
        return;
    }
    editingId = data.id;
    existingImages = data.imagens || (data.imagem ? [data.imagem] : []);
    prodId.value = data.id;
    nome.value = data.nome;
    marca.value = data.marca;
    categoria.value = data.categoria;
    preco.value = data.preco;
    descricao.value = data.descricao || '';
    formTitle.textContent = 'Editar Produto';
    cancelBtn.style.display = 'inline-block';
    imagemInput.value = '';
    newFiles = [];
    previewContainer.innerHTML = '';
    renderExistingImages();
}

async function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    const { data: prod } = await window.supabaseClient.from('produtos').select('imagens').eq('id', id).single();
    if (prod && prod.imagens) {
        for (const url of prod.imagens) {
            const fileName = url.split('/').pop();
            await window.supabaseClient.storage.from('produtos').remove([fileName]);
        }
    }
    const { error } = await window.supabaseClient.from('produtos').delete().eq('id', id);
    if (error) {
        alert('Erro ao excluir: ' + error.message);
    } else {
        loadProducts(searchInput.value);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        nome: nome.value,
        marca: marca.value,
        categoria: categoria.value,
        preco: parseFloat(preco.value),
        descricao: descricao.value,
    };

    let imagensFinal = [...existingImages];

    if (newFiles.length > 0) {
        for (const file of newFiles) {
            let arquivoParaEnviar;
            try {
                arquivoParaEnviar = await comprimirImagem(file);
            } catch (err) {
                alert('Erro ao comprimir imagem: ' + err.message);
                return;
            }

            const fileName = `produto_${Date.now()}_${arquivoParaEnviar.name}`;
            const { error: uploadError } = await window.supabaseClient.storage
                .from('produtos')
                .upload(fileName, arquivoParaEnviar, {
                    cacheControl: '31536000',
                    upsert: false
                });
            if (uploadError) {
                alert('Erro no upload: ' + uploadError.message);
                return;
            }
            const { data: publicData } = window.supabaseClient.storage.from('produtos').getPublicUrl(fileName);
            imagensFinal.push(publicData.publicUrl);
        }
    }

    if (imagensFinal.length === 0) {
        alert('Adicione pelo menos uma imagem.');
        return;
    }

    dados.imagens = imagensFinal;
    dados.imagem = imagensFinal[0];

    let result;
    if (editingId) {
        const imagensAntigas = existingImages;
        const imagensRemovidas = imagensAntigas.filter(url => !imagensFinal.includes(url));
        for (const url of imagensRemovidas) {
            const fileName = url.split('/').pop();
            await window.supabaseClient.storage.from('produtos').remove([fileName]);
        }
        result = await window.supabaseClient.from('produtos').update(dados).eq('id', editingId);
    } else {
        result = await window.supabaseClient.from('produtos').insert(dados);
    }

    if (result.error) {
        alert('Erro ao salvar: ' + result.error.message);
    } else {
        resetForm();
        loadProducts(searchInput.value);
    }
});

searchInput.addEventListener('input', () => {
    loadProducts(searchInput.value);
});

loadProducts();