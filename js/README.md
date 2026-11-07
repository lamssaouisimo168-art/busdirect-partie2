# BusDirect Réseau - Partie 2

Application web de gestion des réservations de places pour le réseau de bus BusDirect (20 trajets). L'agent consulte les trajets, ouvre la cabine de chacun pour gérer les réservations et inscrit les passagers en liste d'attente quand le trajet est complet.

## Liens

- Site déployé (Vercel) : **À COMPLÉTER**
- Dépôt GitHub : https://github.com/lamssaouisimo168-art/busdirect-partie2

## Pages

- `index.html` : liste des trajets (cartes, statistiques, recherche, filtre par statut, pagination de 6).
- `cabine.html?id=…` : cabine d'un trajet (plan des 20 sièges, réservation, modification, annulation, liste d'attente).

## Fonctionnalités

- Chargement des trajets avec `fetch` et `async/await`, puis sauvegarde dans le `localStorage`.
- Cartes de trajets : villes, horaires, prix, places libres, passagers en attente, badge Disponible / Complet.
- Statistiques du réseau : nombre de passagers et recette totale (calculés avec `reduce`).
- Recherche par ville, filtre par statut (combinés) et pagination.
- Plan de la cabine : 2 sièges, une allée, 2 sièges ; sièges 01 à 04 en VIP (prix +10 %).
- Réservation avec validations : nom obligatoire et unique, téléphone `06` ou `07` suivi de 8 chiffres et unique sur le trajet. Sans siège choisi, le premier siège libre non VIP est attribué.
- Modification et annulation d'une réservation.
- Liste d'attente : inscription quand le trajet est complet, position affichée, retrait d'un passager, attribution automatique du siège libéré au premier en attente.
- Messages de confirmation masqués au bout de 3 secondes.
- Données conservées après actualisation.

## Technologies

HTML5, Tailwind CSS (CDN), JavaScript (modules ES), `fetch`, `localStorage`, Git / GitHub, Vercel.

## Organisation des modules

| Fichier | Rôle |
|---|---|
| `js/store.js` | Chargement (`fetch`) et sauvegarde (`localStorage`) des données |
| `js/validators.js` | Validations du nom et du téléphone (regex, unicité sur le trajet) |
| `js/reservations.js` | Logique métier : places libres, VIP, prix, recette, annulation et attribution |
| `js/render.js` | Fonctions d'affichage (cartes, plan des sièges, listes) |
| `js/main-trajets.js` | Point d'entrée de `index.html` |
| `js/main-cabine.js` | Point d'entrée de `cabine.html` |

Règle du projet : modifier les données, sauvegarder, puis réafficher. Le fichier `data/trips.json` est lu une seule fois (lecture seule) ; ensuite, tout vient du `localStorage`.

## Lancer le projet en local

Ouvrir le dossier dans VS Code et lancer **Live Server** sur `index.html`. Il ne faut pas double-cliquer sur le fichier, car `fetch` et les modules ES ne fonctionnent pas en `file://`.

## Organisation Git

- `main` : version finale.
- `partie-2` : branche de travail de la partie 2.
- `feature/...` : une branche par fonctionnalité, fusionnée dans `partie-2` par Pull Request.

## Planification des tâches

| Jour | Tâches |
|---|---|
| 1 | Dépôt GitHub, branches, HTML / Tailwind des deux pages, modules JS |
| 2 | `fetch` + `localStorage` |
| 3 | Cartes de trajets et statistiques |
| 4 | Recherche, filtre par statut et pagination |
| 5 | Cabine : plan des sièges et sièges VIP |
| 6 | Réservation et validations (regex, unicité) |
| 7 | Modification, annulation, liste d'attente |
| 8 | Tests, responsive, nettoyage, README, déploiement Vercel |

## Accessibilité

Chaque champ a un `<label>` associé, les erreurs s'affichent sous le champ et les messages utilisent `role="status"`. Les pages sont adaptées au mobile, à la tablette et à l'ordinateur grâce à la grille Tailwind.