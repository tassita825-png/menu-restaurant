    async function chargerMenu() {
  const maintenant = new Date();
  const jourActuel = maintenant.toLocaleDateString('fr-FR', { weekday: 'long' });
  const dateActuelle = maintenant.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const heure = maintenant.getHours();
  const minutes = maintenant.getMinutes().toString().padStart(2, '0');

  // Horaires
  const horaires = {
    petitDejeuner: { debut: "07:00", fin: "10:30" },
    dejeuner: { debut: "12:00", fin: "15:00" },
    fermeture: "22:00"
  };

  const reponse = await fetch('data.json');
  const data = await reponse.json();
  const zoneMenu = document.getElementById('menu');

  const jourNom = jourActuel.charAt(0).toUpperCase() + jourActuel.slice(1);
  const menuJour = data[jourNom];

  if (!menuJour) {
    zoneMenu.innerHTML = `
      <h2>${jourNom.toUpperCase()}</h2>
      <p>Aucun menu pour ce jour (le restaurant est fermé le week-end).</p>
    `;
    return;
  }

  let periode = "";
  let contenu = "";

  if (heure < 12) {
    // MATIN
    periode = "Matin - Petit Déjeuner (Gratuit)";
    contenu += `
      <div class="info">
        <p><strong>Horaires :</strong> ${horaires.petitDejeuner.debut} → ${horaires.petitDejeuner.fin}</p>
      </div>
      <h3>Petit Déjeuner</h3>
    `;
    menuJour.matin.petitDejeuner.forEach(item => {
      contenu += `<div class="item">${item.nom} - Gratuit</div>`;
    });
  } else {
    // MIDI
    periode = "Midi - Déjeuner";
    contenu += `
      <div class="info">
        <p><strong>Horaires :</strong> ${horaires.dejeuner.debut} → ${horaires.dejeuner.fin}</p>
      </div>

      <h3>Entrée</h3>
      <div class="item">${menuJour.midi.entree.nom} - ${menuJour.midi.entree.prix} FCFA</div>

      <h3>Plats de résistance (3 choix possibles)</h3>
    `;
    menuJour.midi.platResistance.forEach(p => {
      contenu += `<div class="item">${p.nom} - ${p.prix} FCFA</div>`;
    });

    contenu += `<h3>Desserts (2 choix possibles)</h3>`;
    menuJour.midi.desserts.forEach(d => {
      contenu += `<div class="item">${d.nom} - ${d.prix} FCFA</div>`;
    });

    contenu += `<h3>Boissons</h3>`;
    menuJour.midi.boissons.forEach(b => {
      contenu += `<div class="item">${b.nom} - ${b.prix} FCFA</div>`;
    });
  }

  zoneMenu.innerHTML = `
    <h2>${jourNom.toUpperCase()} - ${periode}</h2>
    <p><strong>Date :</strong> ${dateActuelle}</p>
    <p><strong>Heure actuelle :</strong> ${heure}:${minutes}</p>
    ${contenu}
    <div class="info">
      <p><strong>Fermeture du restaurant :</strong> ${horaires.fermeture}</p>
    </div>
  `;
}

chargerMenu();
