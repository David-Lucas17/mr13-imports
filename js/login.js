document.getElementById('entrar-btn').addEventListener('click', async () => {
    const email = document.getElementById('usuario').value;
    const password = document.getElementById('senha').value;
    const erro = document.getElementById('erro');

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
        erro.textContent = 'E-mail ou senha inválidos.';
    } else {
        window.location.href = 'admin.html';
    }
});