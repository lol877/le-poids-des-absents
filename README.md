# Le poids des absents

Les archives d’**Isao Kesuke** : un site narratif en français, conçu pour GitHub Pages.

- Accueil illustré par un paysage SVG original.
- Récit intégral dans une liseuse : taille du texte, fond clair ou sombre, progression de lecture.
- Mémorial des onze absents, avec lumières commémoratives.
- Quatre fragments à retrouver et une énigme donnant accès à un journal caché.
- Navigation adaptée aux téléphones, commandes au clavier et respect du réglage de mouvement réduit.

## Visiter

[Ouvrir les archives](https://lol877.github.io/le-poids-des-absents/)

## Hébergement gratuit

Ce projet utilise uniquement HTML, CSS, JavaScript et SVG. Il ne nécessite ni serveur payant, ni abonnement, ni installation de dépendances.

Dans **Settings → Pages**, choisir **Deploy from a branch**, puis **main** et **/ (root)**. Le dépôt doit rester public pour bénéficier de GitHub Pages avec GitHub Free.

[Documentation officielle de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## Modifier le site

| Fichier | Contenu |
| --- | --- |
| `index.html` | Rubriques, récit, noms du mémorial et pages du journal |
| `styles.css` | Couleurs, typographie, mise en page et affichage mobile |
| `script.js` | Énigme, fragments, mémorial et réglages de lecture |
| `assets/la-vallee.svg` | Illustration du paysage |
| `assets/sceau.svg` | Emblème et icône du navigateur |
| `RECIT.md` | Texte intégral dans un format lisible sans JavaScript |

Pour voir les modifications, ouvrir `index.html` dans un navigateur. Pour servir le site localement, lancer `python -m http.server 4173` depuis ce dossier et ouvrir `http://localhost:4173`.

La progression et les lumières sont conservées dans le navigateur du visiteur avec `localStorage`. Aucun compte visiteur, traqueur ou service externe n’est utilisé. Le stockage est facultatif : les interactions fonctionnent également quand il est désactivé.

Le journal est caché pour les besoins de l’énigme : son contenu reste accessible dans les fichiers publics. Ce mécanisme n’est pas une protection pour des données privées.

Le récit initial est fourni par son auteur. Les trois pages du journal et les phrases des indices sont des compléments de fiction imaginés pour le site. Le mémorial ne prétend pas ajouter de biographies aux personnages.

Aucune licence de réutilisation du récit n’est accordée par ce dépôt.
