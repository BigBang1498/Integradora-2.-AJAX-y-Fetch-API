/* ========= Referencias DOM ========= */
const form     = document.getElementById('formulario');
const txtSearch= document.getElementById('busqueda');
const selCity  = document.getElementById('ciudad');
const tbody    = document.getElementById('contenidoTabla');
const status   = document.getElementById('mensajeEstado');

/* ========= Cache de usuarios ========= */
let usuariosCache = null;

/* ========= Obtener usuarios de la API (con cache) ========= */
const getUsuarios = async () => {
  if (usuariosCache) return usuariosCache;         // evita múltiple fetch
  const res  = await fetch('https://jsonplaceholder.typicode.com/users');
  usuariosCache = await res.json();
  return usuariosCache;
};

/* ========= Rellenar desplegable de ciudades ========= */
(async () => {
  const users  = await getUsuarios();
  const cities = [...new Set(users.map(u => u.address.city))].sort();
  cities.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    selCity.appendChild(opt);
  });
})();

/* ========= Renderizar tabla ========= */
const renderTabla = datos => {
  tbody.innerHTML = '';                          // limpia tabla
  if (!datos.length) {
    tbody.innerHTML = '<tr><td colspan="5">Sin resultados</td></tr>';
    return;
  }
  const frag = document.createDocumentFragment();
  datos.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.username}</td>
      <td>${u.email}</td>
      <td>${u.address.city}</td>`;
    frag.appendChild(tr);
  });
  tbody.appendChild(frag);
};

/* ========= Buscar + filtrar ========= */
form.addEventListener('submit', async e => {
  e.preventDefault();
  status.textContent = 'Buscando…';

  const texto  = txtSearch.value.trim().toLowerCase();
  const ciudad = selCity.value;

  const usuarios = await getUsuarios();

  let resultado = usuarios;

  /* Filtro por ciudad si se escogió una */
  if (ciudad) {
    resultado = resultado.filter(u => u.address.city === ciudad);
  }

  /* Búsqueda por nombre o username */
  if (texto) {
    resultado = resultado.filter(u =>
      u.name.toLowerCase().includes(texto) ||
      u.username.toLowerCase().includes(texto)
    );
  }

  renderTabla(resultado);
  status.textContent = `Mostrando ${resultado.length} usuario(s)`;
});
