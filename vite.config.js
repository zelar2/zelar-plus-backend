import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Raiz do app (telas reais do ZELAR+)
const appRoot = resolve(__dirname, 'frontend/cliente/app');

const pagina = (caminho) => resolve(appRoot, caminho);

export default defineConfig({
  root: appRoot,
  base: './',
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: pagina('index.html'),

        // 1 - Login
        login: pagina('1-login/index.html'),
        cadastro: pagina('1-login/cadastro.html'),
        recuperarSenha: pagina('1-login/recuperar-senha.html'),

        // 2 - Explicação
        explicacao: pagina('2-explicacao/index.html'),

        // 3 - Selecionar atendimento
        selecionarAtendimento: pagina('3-selecionar-atendimento/index.html'),
        auxiliarEnfermagem: pagina('3-selecionar-atendimento/auxiliar-enfermagem.html'),
        cuidador: pagina('3-selecionar-atendimento/cuidador.html'),
        enfermeiro: pagina('3-selecionar-atendimento/enfermeiro.html'),
        fisioterapeuta: pagina('3-selecionar-atendimento/fisioterapeuta.html'),
        fonoaudiologo: pagina('3-selecionar-atendimento/fonoaudiologo.html'),
        medico: pagina('3-selecionar-atendimento/medico.html'),
        nutricionista: pagina('3-selecionar-atendimento/nutricionista.html'),
        psicologo: pagina('3-selecionar-atendimento/psicologo.html'),
        tecnicoEnfermagem: pagina('3-selecionar-atendimento/tecnico-enfermagem.html'),
        terapiaOcupacional: pagina('3-selecionar-atendimento/terapia-ocupacional.html'),

        // 4 - Cadastro profissional
        cadastroProfissional: pagina('4-cadastro-profissional/index.html'),
        categorias: pagina('4-cadastro-profissional/categorias.html'),
        dados: pagina('4-cadastro-profissional/dados.html'),
        documentos: pagina('4-cadastro-profissional/documentos.html'),
        termo: pagina('4-cadastro-profissional/termo.html'),
        repasse: pagina('4-cadastro-profissional/repasse.html'),
        foto: pagina('4-cadastro-profissional/foto.html'),
        enviado: pagina('4-cadastro-profissional/enviado.html'),

        // Mapa
        mapa: pagina('mapa/mapa.html')
      }
    }
  }
});