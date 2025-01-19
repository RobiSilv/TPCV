document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("competenceForm");
  const listeCompetences = document.getElementById("listeCompetences");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nom = document.getElementById("nomCompetence").value;
    const description = document.getElementById("descriptionCompetence").value;
    const niveau = document.getElementById("niveauCompetence").value;

    const competence = { nom, description, niveau };

    const submitButton = e.target.querySelector('button[type="submit"]');
    if (submitButton.dataset.mode === "edit") {
      const index = parseInt(submitButton.dataset.index);
      modifierCompetenceDansLocalStorage(competence, index);
    } else {
      ajouterCompetenceAuLocalStorage(competence);
    }

    form.reset();
    submitButton.textContent = "Ajouter la compétence";
    submitButton.dataset.mode = "add";
    delete submitButton.dataset.index;
    chargerCompetences();
  });

  function ajouterCompetenceALaListe(competence, index) {
    const div = document.createElement("div");
    div.className = "competence";
    div.style.backgroundColor = getRandomColor();
    div.innerHTML = `
      <h3>${competence.nom}</h3>
      <p><strong>Niveau :</strong> ${competence.niveau}</p>
      ${
        competence.description
          ? `<p><strong>Description :</strong> ${competence.description}</p>`
          : ""
      }
      <button class="modifier" data-index="${index}">Modifier</button>
      <button class="supprimer" data-index="${index}">Supprimer</button>
    `;
    listeCompetences.appendChild(div);

    div
      .querySelector(".modifier")
      .addEventListener("click", () => modifierCompetence(index));
    div
      .querySelector(".supprimer")
      .addEventListener("click", () => supprimerCompetence(index));
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  }

  function ajouterCompetenceAuLocalStorage(competence) {
    let competences = JSON.parse(localStorage.getItem("competences")) || [];
    competences.push(competence);
    localStorage.setItem("competences", JSON.stringify(competences));
  }

  function chargerCompetences() {
    const competences = JSON.parse(localStorage.getItem("competences")) || [];
    listeCompetences.innerHTML = "";
    competences.forEach((competence, index) =>
      ajouterCompetenceALaListe(competence, index)
    );
  }

  chargerCompetences();
});

function modifierCompetence(index) {
  const competences = JSON.parse(localStorage.getItem("competences")) || [];
  const competence = competences[index];

  document.getElementById("nomCompetence").value = competence.nom;
  document.getElementById("descriptionCompetence").value =
    competence.description || "";
  document.getElementById("niveauCompetence").value = competence.niveau;

  const submitButton = document.querySelector(
    '#competenceForm button[type="submit"]'
  );
  submitButton.textContent = "Modifier la compétence";
  submitButton.dataset.mode = "edit";
  submitButton.dataset.index = index;
}

function modifierCompetenceDansLocalStorage(competence, index) {
  let competences = JSON.parse(localStorage.getItem("competences")) || [];
  competences[index] = competence;
  localStorage.setItem("competences", JSON.stringify(competences));
}

function supprimerCompetence(index) {
  let competences = JSON.parse(localStorage.getItem("competences")) || [];
  competences.splice(index, 1);
  localStorage.setItem("competences", JSON.stringify(competences));

  const competenceElement = document.querySelector(
    `.competence[data-index="${index}"]`
  );
  if (competenceElement) {
    competenceElement.remove();
  }

  mettreAJourIndices();
}

function mettreAJourIndices() {
  const competenceElements = document.querySelectorAll(".competence");
  competenceElements.forEach((element, newIndex) => {
    element.dataset.index = newIndex;
    element.querySelector(".modifier").dataset.index = newIndex;
    element.querySelector(".supprimer").dataset.index = newIndex;
  });
}

const textarea = document.getElementById("descriptionCompetence");

textarea.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});
