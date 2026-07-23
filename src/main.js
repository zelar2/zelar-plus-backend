// ZELAR+ — entrada da sandbox Vite (desenvolvimento)
import './style.css';

const app = document.querySelector('#app');
if (app) {
  app.innerHTML = `
    <main style="text-align:center">
      <h1>ZELAR+</h1>
      <p>Cuidado profissional na sua casa</p>
      <p><a href="/frontend/cliente/app/index.html">Abrir o aplicativo</a></p>
    </main>
  `;
}