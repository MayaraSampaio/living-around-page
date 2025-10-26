const citiesByCountry = {
  PT: ['Lisboa', 'Porto', 'Braga'],
};
let map;
let marker;

const mapDiv = document.getElementById('map');
const localizacaoDiv = document.getElementById('localizacao');
const form = document.getElementById('mapForm');

mapDiv.classList.add('hidden');
localizacaoDiv.classList.add('hidden');

document.getElementById('country').addEventListener('change', function () {
  const country = this.value;
  const citySelect = document.getElementById('city');

  citySelect.innerHTML = '<option value="">Selecione a cidade...</option>';

  if (country && citiesByCountry[country]) {
    citiesByCountry[country].forEach((city) => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }
});

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const country = document.getElementById('country').value;
  const city = document.getElementById('city').value;

  if (!country || !city) {
    alert('Por favor, selecione país e cidade');
    return;
  }

  mapDiv.classList.remove('hidden');
  localizacaoDiv.classList.remove('hidden');

  if (!map) {
    map = L.map('map').setView([38.7223, -9.1393], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
  }

  const url = `https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json&limit=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      const lat = data[0].lat;
      const lon = data[0].lon;
      const displayName = data[0].display_name;

      map.setView([lat, lon], 13);

      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`<b>${city}</b><br>${displayName}`)
        .openPopup();

      localizacaoDiv.innerHTML = `
        <p class="mb-1 fw-bold">LIVING AROUND - ${city}</p>
        <p class="mb-1">${displayName}</p>
        <p class="mb-0">livingaround_${city.toLowerCase()}@living.com</p>
      `;
    } else {
      alert('Cidade não encontrada!');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao buscar localização. Tente novamente.');
  }
});
