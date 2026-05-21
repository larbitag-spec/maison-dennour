# Note de reprise - Maison d'Ennour

Dernière sauvegarde locale : 21/05/2026

## État actuel

- Maquette locale disponible via `ouvrir-maquette.bat` ou `http://127.0.0.1:8080/`.
- Dépôt GitHub configuré : `https://github.com/larbitag-spec/maison-dennour.git`.
- Page d'accueil avec header, recherche, menu catalogue, slider, rayons, produits, avis et footer.
- Slider principal avec 4 images préparées en hauteur 500px depuis le dossier `Nouveau Livres`.
- Mini panier latéral fonctionnel : ajout au panier, compteur, quantité, total.
- Clic sur une carte livre : ouverture d'une fiche produit locale avec image, titre, prix, description, onglets et produits similaires.
- Menu mobile fonctionnel avec ouverture latérale.

## Menus mis à jour

- Menu `Livres` :
  - Tradition prophétique (Hadiths)
  - Jurisprudence (Fiqh)
  - Foi & Spiritualité
  - Biographie
  - Cuisines du monde
  - Economie
  - Essais
  - Histoire
  - Langues & Littérature
  - Dictionnaires
  - Livres numériques (eBooks)
  - Médecine & Santé
- Sous-menus ajoutés :
  - Tradition prophétique (Hadiths)
  - Jurisprudence (Fiqh)
  - Foi & Spiritualité
  - Biographie
  - Cuisines du monde
  - Essais
  - Langues & Littérature
- Menu `Famille` mis à jour.
- Menu `Espace enfants` mis à jour.

## Fichiers principaux

- `index.html` : structure de la page, slider, menus, fiche produit et panier.
- `styles.css` : design global, responsive, menus, slider, fiche produit et panier.
- `script.js` : slider automatique, menu mobile/catalogue, sous-menus, panier, fiche produit, onglets.
- `assets/` : images et couvertures utilisées dans la maquette.

## Commit GitHub

La version locale est prête. À lancer dans PowerShell si besoin :

```powershell
cd "C:\Users\user\Documents\Codex\2026-05-19\j-ai-la-freebox-pop-et\maison-dennour-maquette"
git add index.html script.js styles.css NOTE_REPRISE.md
git commit -m "Update catalog menu structure"
git push origin main
```

## À reprendre ensuite

- Finaliser la version mobile après contrôle visuel.
- Améliorer les fiches produit avec des textes réels, références, formats, auteurs et catégories.
- Ajouter une page ou section "Nos librairies" plus complète.
