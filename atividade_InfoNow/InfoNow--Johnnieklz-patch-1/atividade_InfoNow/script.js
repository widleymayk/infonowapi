// script.js

// ------------------------------
// 1) MÚSICA (apenas placeholder estático, não há API definidia)
//    Se quiser adicionar fundo dinâmico, pode conectar uma API de música.
//    Por enquanto, este botão só recarrega o texto padrão.
// ------------------------------
function atualizarMusica() {
  const mensagens = [
    "Novo hit do verão domina as paradas!",
    "Artista brasileiro conquista o top 1 global!",
    "Música eletrônica em alta nas pistas!",
    "Nova colaboração agita o cenário pop!"
  ];
  const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
  document.getElementById("content-music").innerHTML = `<p>${mensagem}</p>`;
}

// ------------------------------
// 2) CLIMA
// ------------------------------
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
      // Remove todos os textos do clima
      document.getElementById("content-weather").innerHTML = "";
    })
    .catch(err => alert(err.message));
}

// ------------------------------
// 3) FILMES
// ------------------------------
function buscarFilmes() {
  fetch("https://api.themoviedb.org/3/movie/popular?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&language=pt-BR&page=1")
    .then(r => r.json())
    .then(dados => mostrarFilmes(dados.results))
    .catch(() => {
      document.getElementById("carousel-films").innerHTML = `<p>Erro ao carregar filmes.</p>`;
    });
}

function mostrarFilmes(filmes) {
  const container = document.getElementById("carousel-films");
  container.innerHTML = "";
  filmes.slice(0, 10).forEach(f => {
    const item = document.createElement("div");
    item.className = "carousel-item";
    item.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w154${f.poster_path}" alt="${f.title}" />
      <span>${f.title}</span>
    `;
    container.appendChild(item);
  });
}

function scrollCarousel(direction) {
  const carousel = document.getElementById("carousel-films");
  const scrollAmount = 160;
  carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// ------------------------------
// 4) PIADA
// ------------------------------
function buscarPiada() {
  fetch("https://v2.jokeapi.dev/joke/Any?lang=pt&type=single")
    .then(r => r.json())
    .then(d => {
      document.getElementById("content-jokes").innerHTML = `<p>${d.joke}</p>`;
    })
    .catch(() => {
      document.getElementById("content-jokes").innerHTML = `<p>Não foi possível carregar a piada.</p>`;
    });
}

// ------------------------------
// 5) PIADAS BOBAS (reaproveita buscarPiada)
// ------------------------------
 // O mesmo endpoint retorna piadas aleatórias de qualquer categoria, então
 // usamos a mesma função buscarPiada() e alteramos somente o título localmente.
function buscarPiadasBobas() {
  fetch("https://v2.jokeapi.dev/joke/Any?lang=pt&type=single")
    .then(r => r.json())
    .then(d => {
      document.getElementById("content-silly-jokes").innerHTML = `
        <h2>Piadas Bobas</h2>
        <p>${d.joke}</p>
      `;
    })
    .catch(err => {
      console.error(err);
      document.getElementById("content-silly-jokes").innerHTML = `
        <h2>Piadas Bobas</h2>
        <p>Não foi possível buscar as piadas bobas.</p>
      `;
    });
}

// ------------------------------
// 6) PAÍS ALEATÓRIO
// ------------------------------
function buscarPaisAleatorio() {
  fetch("https://restcountries.com/v3.1/all")
    .then(r => r.json())
    .then(paises => {
      const p = paises[Math.floor(Math.random() * paises.length)];
      return {
        nome: p.name.common,
        cap: p.capital?.[0] || "–",
        pop: p.population.toLocaleString(),
        img: p.flags.png
      };
    })
    .then(({ nome, cap, pop, img }) => {
      document.getElementById("content-countries").innerHTML = `
        <h2>${nome}</h2>
        <img src="${img}" alt="Bandeira de ${nome}" class="flag" />
        <p>Capital: ${cap}</p>
        <p>População: ${pop}</p>
      `;
    })
    .catch(err => {
      console.error(err);
      document.getElementById("content-countries").innerHTML = `
        <h2>Países</h2>
        <p>Não foi possível buscar o país agora.</p>
      `;
    });
}

// ------------------------------
// GERA ÍCONES DO CLIMA
// ------------------------------
function escolherIconeClima(code) {
  if (code === 0) return "https://cdn-icons-png.flaticon.com/512/869/869869.png";         // Sol
  if (code === 1 || code === 2) return "https://cdn-icons-png.flaticon.com/512/1163/1163661.png"; // Parcialmente nublado
  if (code === 3) return "https://cdn-icons-png.flaticon.com/512/414/414825.png";        // Nublado
  if (code >= 45 && code < 50) return "https://cdn-icons-png.flaticon.com/512/4005/4005901.png"; // Nevoeiro
  if (code >= 51 && code <= 67) return "https://cdn-icons-png.flaticon.com/512/4150/4150897.png"; // Garoa
  if (code >= 61 && code <= 65) return "https://cdn-icons-png.flaticon.com/512/3076/3076129.png"; // Chuva
  if (code === 80) return "https://cdn-icons-png.flaticon.com/512/1779/1779940.png";        // Pancadas
  if (code === 95) return "https://cdn-icons-png.flaticon.com/512/1146/1146869.png";        // Tempestade
  return "https://cdn-icons-png.flaticon.com/512/869/869869.png";                           // Padrão: sol
}

// ------------------------------
// OPCIONAL: Ao carregar a página:
// - Já buscar os filmes para preencher o card de Filmes
// - (ou você pode deixar em branco e só preencher ao clicar no botão)
// ------------------------------
window.addEventListener("DOMContentLoaded", () => {
  // Preenche o card de Filmes automaticamente
  buscarFilmes();

  // Opcional: você pode também botar uma piada inicial:
  // buscarPiada();
  // buscarPiadasBobas();
  // E até carregar um país inicial:
  // buscarPaisAleatorio();
});

// === NOVO: Carrossel de Filmes ===
function mostrarFilmes(filmes) {
  const container = document.getElementById("carousel-films");
  container.innerHTML = "";

  filmes.slice(0, 10).forEach(f => {
    const item = document.createElement("div");
    item.className = "carousel-item";
    item.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w154${f.poster_path}" alt="${f.title}" />
      <span>${f.title}</span>
    `;
    container.appendChild(item);
  });
}

// === SIMPLIFICADO: Clima ===
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
      const { temperature, windspeed, weathercode } = dados.current_weather;
      const descricao = {
        0: "Céu limpo", 1: "Limpo", 2: "Parcial nublado", 3: "Nublado",
        45: "Nevoeiro", 51: "Garoa", 61: "Chuva", 80: "Pancadas", 95: "Tempestade"
      }[weathercode] || "Desconhecido";

      document.getElementById("content-weather").innerHTML = `
        <p><strong>Local:</strong> ${label}</p>
        <p><strong>Temperatura:</strong> ${temperature}°C</p>
        <p><strong>Condição:</strong> ${descricao}</p>
        <p><strong>Vento:</strong> ${windspeed} km/h</p>
      `;
    })
    .catch(err => alert(err.message));
}

// === NOVO: Notícias ===
function buscarNoticias() {
  fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=3")
    .then(r => r.json())
    .then(d => {
      const html = d.results.map(n => `<p><strong>${n.title}</strong><br>${n.summary.slice(0, 100)}...</p>`).join("");
      document.getElementById("content-news").innerHTML = html;
    })
    .catch(() => {
      document.getElementById("content-news").innerHTML = `<p>Erro ao carregar notícias.</p>`;
    });
}

// === NOVO: Curiosidades ===
function buscarCuriosidade() {
  fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=pt")
    .then(r => r.json())
    .then(d => {
      document.getElementById("content-trivia").innerHTML = `<p>${d.text}</p>`;
    })
    .catch(() => {
      document.getElementById("content-trivia").innerHTML = `<p>Não foi possível carregar a curiosidade.</p>`;
    });
}

// MÚSICA COM FRASES ALEATÓRIAS
function atualizarMusica() {
  const mensagens = [
    "Novo hit do verão domina as paradas!",
    "Artista brasileiro conquista o top 1 global!",
    "Música eletrônica em alta nas pistas!",
    "Nova colaboração agita o cenário pop!"
  ];
  const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
  document.getElementById("content-music").innerHTML = `<p>${mensagem}</p>`;
}

// CLIMA SIMPLIFICADO
function buscarClima(cidade) {
  const urlGeo = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cidade)}&format=json&limit=1`;

  fetch(urlGeo)
    .then(r => r.json())
    .then(geo => {
      if (!geo.length) throw new Error("Local não encontrado");
      const { lat, lon } = geo[0];
      return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(r => r.json());
    })
    .then(dados => {
      const w = dados.current_weather;
      const desc = {
        0: "Céu limpo", 1: "Limpo", 2: "Parcial nublado", 3: "Nublado",
        45: "Nevoeiro", 51: "Garoa", 61: "Chuva", 80: "Pancadas", 95: "Tempestade"
      }[w.weathercode] || "Desconhecido";
      document.getElementById("content-weather").innerHTML = `
        <p>Temperatura: ${w.temperature}°C</p>
        <p>Condição: ${desc}</p>
        <p>Vento: ${w.windspeed} km/h</p>
      `;
    })
    .catch(err => alert(err.message));
}

// CURIOSIDADE
function buscarCuriosidade() {
  fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=pt")
    .then(r => r.json())
    .then(d => {
      document.getElementById("content-trivia").innerHTML = `<p>${d.text}</p>`;
    })
    .catch(() => {
      document.getElementById("content-trivia").innerHTML = `<p>Não foi possível carregar a curiosidade.</p>`;
    });
}

// PIADA COM BACKUP
function buscarPiada() {
  fetch("https://v2.jokeapi.dev/joke/Any?lang=pt&type=single")
    .then(r => r.json())
    .then(d => {
      document.getElementById("content-jokes").innerHTML = `<p>${d.joke}</p>`;
    })
    .catch(() => {
      document.getElementById("content-jokes").innerHTML = `<p>Não foi possível carregar a piada.</p>`;
    });
}

// FILMES
function buscarFilmes() {
  fetch("https://api.themoviedb.org/3/movie/popular?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&language=pt-BR&page=1")
    .then(r => r.json())
    .then(dados => mostrarFilmes(dados.results))
    .catch(() => {
      document.getElementById("carousel-films").innerHTML = `<p>Erro ao carregar filmes.</p>`;
    });
}

// Books


function mostrarFilmes(filmes) {
  const container = document.getElementById("carousel-films");
  container.innerHTML = "";
  filmes.slice(0, 10).forEach(f => {
    const item = document.createElement("div");
    item.className = "carousel-item";
    item.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w154${f.poster_path}" alt="${f.title}" />
      <span>${f.title}</span>
    `;
    container.appendChild(item);
  });
}

// SETAS DO CARROSSEL
function scrollCarousel(direction) {
  const carousel = document.getElementById("carousel-films");
  const scrollAmount = 160;
  carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

