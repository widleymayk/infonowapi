// script.js

// 1) CLIMA
function buscarClimaPrompt() {
  const cidade = prompt("Digite o nome da cidade ou país:");
  if (cidade) buscarClima(cidade);
}

function buscarClima(cidade) {
  const urlGeo = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cidade)}&format=json&limit=1`;

  fetch(urlGeo)
    .then(r => r.json())
    .then(geo => {
      if (!geo.length) throw new Error("Local não encontrado");
      const { lat, lon, display_name } = geo[0];
      return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(r => r.json())
        .then(dados => ({ dados, label: display_name }));
    })
    .then(({ dados, label }) => {
      const t = dados.current_weather.temperature;
      const vento = dados.current_weather.windspeed;
      const code = dados.current_weather.weathercode;

      const codigos = {
        0: "Céu limpo",
        1: "Principalmente limpo",
        2: "Parcialmente nublado",
        3: "Nublado",
        45: "Nevoeiro",
        48: "Nevoeiro denso",
        51: "Garoa fraca",
        53: "Garoa moderada",
        55: "Garoa intensa",
        61: "Chuva leve",
        63: "Chuva moderada",
        65: "Chuva intensa",
        71: "Neve fraca",
        80: "Pancadas de chuva",
        95: "Tempestade",
      };

      const descricao = codigos[code] || "Condição desconhecida";
      const icone = escolherIconeClima(code);

      document.getElementById("painel").innerHTML = `
        <div class="card">
          <img src="${icone}" alt="Ícone do clima" width="64" height="64">
          <h2>Clima em ${label}</h2>
          <p><strong>Temperatura:</strong> ${t}°C</p>
          <p><strong>Condição:</strong> ${descricao}</p>
          <p><strong>Vento:</strong> ${vento} km/h</p>
          <span class="badge">Atualizado agora</span>
        </div>
      `;
    })
    .catch(err => alert(err.message));
}


// 2) FILMES
function buscarFilmes() {
  const url = "https://api.themoviedb.org/3/movie/popular?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&language=pt-BR&page=1";
  fetch(url)
    .then(r => r.json())
    .then(dados => mostrarFilmes(dados.results))
    .catch(err => console.error(err));
}

function mostrarFilmes(filmes) {
  const cards = filmes.slice(0, 5).map(f => `
    <div class="card">
      <img src="https://image.tmdb.org/t/p/w200${f.poster_path}" alt="${f.title}">
      <h3>${f.title}</h3>
      <p>Nota: ${f.vote_average.toFixed(1)}</p>
    </div>
  `).join("");
  document.getElementById("painel").innerHTML = cards;
}


// 3) PIADA
function buscarPiada() {
  fetch("https://v2.jokeapi.dev/joke/Any?lang=pt&type=single")
    .then(r => r.json())
    .then(d => mostrarPiada(d.joke))
    .catch(err => console.error(err));
}

function mostrarPiada(texto) {
  document.getElementById("painel").innerHTML = `
    <div class="card">
      <h2>Piada do Dia</h2>
      <p>${texto}</p>
    </div>
  `;
}

// 4) PAÍS
function buscarPaisAleatorio() {
  fetch("https://restcountries.com/v3.1/all")
    .then(r => r.json())
    .then(paises => {
      const p = paises[Math.floor(Math.random()*paises.length)];
      return {
        nome: p.name.common,
        cap: p.capital?.[0] || "–",
        pop: p.population.toLocaleString(),
        img: p.flags.png
      };
    })
    .then(({nome,cap,pop,img}) => {
      document.getElementById("painel").innerHTML = `
        <div class="card">
          <h2>${nome}</h2>
          <img src="${img}" alt="Bandeira de ${nome}">
          <p>Capital: ${cap}</p>
          <p>População: ${pop}</p>
        </div>
      `;
    })
    .catch(err => console.error(err));
}

// 5) NOTÍCIAS
function buscarNoticias() {
  fetch("https://newsapi.org/v2/top-headlines?country=br&apiKey=9e0e6a1c1e3e4c8e9e0e6a1c1e3e4c8e")
    .then(r => r.json())
    .then(d => mostrarNoticias(d.articles.slice(0,5)))
    .catch(err => console.error(err));
}

function mostrarNoticias(articles) {
  const lista = articles.map(noticia => `
    <div class="card">
      <h3>${noticia.title}</h3>
      ${noticia.description ? `<p>${noticia.description}</p>` : ""}
      <a href="${noticia.url}" target="_blank">Ler mais</a>
    </div>
  `).join("");

  document.getElementById("painel").innerHTML = `
    <h2 style="grid-column: 1 / -1; text-align: center;">Notícias do Brasil</h2>
    ${lista}
  `;
}


// 6) FATO INÚTIL
function buscarFato() {
  fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=pt")
    .then(r => r.json())
    .then(d => {
      document.getElementById("painel").innerHTML = `
        <div class="card">
          <h2>Curiosidade Aleatória</h2>
          <p>${d.text}</p>
        </div>
      `;
    })
    .catch(err => console.error(err));
}




function escolherIconeClima(code) {
  if (code === 0) return "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // Sol
  if (code === 1 || code === 2) return "https://cdn-icons-png.flaticon.com/512/1163/1163661.png"; // Parcialmente nublado
  if (code === 3) return "https://cdn-icons-png.flaticon.com/512/414/414825.png"; // Nublado
  if (code >= 45 && code < 50) return "https://cdn-icons-png.flaticon.com/512/4005/4005901.png"; // Nevoeiro
  if (code >= 51 && code <= 67) return "https://cdn-icons-png.flaticon.com/512/4150/4150897.png"; // Garoa
  if (code >= 61 && code <= 65) return "https://cdn-icons-png.flaticon.com/512/3076/3076129.png"; // Chuva
  if (code === 80) return "https://cdn-icons-png.flaticon.com/512/1779/1779940.png"; // Pancadas
  if (code === 95) return "https://cdn-icons-png.flaticon.com/512/1146/1146869.png"; // Tempestade
  return "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // Padrão: sol
}

