if (!window.supabaseClient) {
    const SUPABASE_URL = 'https://jdhqcptooihtdvsjzcle.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_0SLFPLmZNF0NOq0ykbBUgQ_Awxp10He';
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}