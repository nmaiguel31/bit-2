"use strict";

let estudiantesGlobal = []; // Guardamos los datos cargados

function renderTabla(estudiantes) {
  const tbody = document.querySelector('#tabla-estudiantes tbody');
  tbody.innerHTML = '';

  let mejores = [], peores = [];
  let sumaWebsite = 0, sumaBit1 = 0;
  let totalWebsite = 0, totalBit1 = 0;

  estudiantes.forEach(est => {
    const nombre = est.student;
    const intensidad = est.intensity;
    const github = est.usernameGithub;

    const website = est.projects.find(p => p.name === "bit-website");
    const bit1 = est.projects.find(p => p.name === "bit-1");

    const notaWebsite = website?.score?.[0] ?? 0;

    let notaBit1 = 0;
    if (bit1?.score?.length > 0) {
      notaBit1 = bit1.score.reduce((acc, val) => acc + val, 0);
    }

    const promedio = (notaWebsite + notaBit1) / 2;

    if (notaWebsite > 0) {
      sumaWebsite += notaWebsite;
      totalWebsite++;
    }

    if (notaBit1 > 0) {
      sumaBit1 += notaBit1;
      totalBit1++;
    }

    if (promedio >= 4) {
      mejores.push(nombre);
    } else if (promedio <= 2.9 && (notaWebsite !== 0 || notaBit1 !== 0)) {
      peores.push(nombre);
    }

    const githubLink = github
      ? `<a href="https://github.com/${github}" target="_blank">${github}</a>`
      : '—';

    const row = `
      <tr>
        <td>${nombre}</td>
        <td>${githubLink}</td>
        <td>${intensidad}</td>
        <td>${notaWebsite.toFixed(2)}</td>
        <td>${notaBit1.toFixed(2)}</td>
        <td>${promedio.toFixed(2)}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', row);
  });

const promedioClase = ((sumaWebsite + sumaBit1) / (totalWebsite + totalBit1) || 0).toFixed(2);
const resumen = `
  <p><strong>Promedio general de la clase:</strong> ${promedioClase}</p>
  <p><strong>Promedio bit-website:</strong> ${(sumaWebsite / totalWebsite || 0).toFixed(2)}</p>
  <p><strong>Promedio bit-1:</strong> ${(sumaBit1 / totalBit1 || 0).toFixed(2)}</p>
`;
  document.getElementById('resumen').innerHTML = resumen;
}

function aplicarOrden(estudiantes, criterio) {
  return estudiantes.slice().sort((a, b) => {
    const promA = (a.projects.find(p => p.name === "bit-website")?.score?.[0] ?? 0)
                + (a.projects.find(p => p.name === "bit-1")?.score?.reduce((acc, val) => acc + val, 0) ?? 0);

    const promB = (b.projects.find(p => p.name === "bit-website")?.score?.[0] ?? 0)
                + (b.projects.find(p => p.name === "bit-1")?.score?.reduce((acc, val) => acc + val, 0) ?? 0);

    switch (criterio) {
      case 'nombre-asc':
        return a.student.localeCompare(b.student);
      case 'nombre-desc':
        return b.student.localeCompare(a.student);
      case 'promedio-asc':
        return promA - promB;
      case 'promedio-desc':
        return promB - promA;
      default:
        return 0;
    }
  });
}

// Escuchar cambios del filtro
document.addEventListener('DOMContentLoaded', () => {
  fetch('data/file.json')
    .then(response => response.json())
    .then(data => {
      estudiantesGlobal = data;
      renderTabla(data);

      document.getElementById('orden').addEventListener('change', e => {
        const ordenado = aplicarOrden(estudiantesGlobal, e.target.value);
        renderTabla(ordenado);
      });
    })
    .catch(error => {
      console.error('Error al cargar el archivo JSON.', error);
      alert('Error al cargar el archivo JSON.');
    });
});
