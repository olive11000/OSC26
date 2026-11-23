# Circulation générale — la Terre en 3D

Page interactive pour comprendre la circulation générale de l'atmosphère (cours EISPN 050-02-03-01) :
ZCIT, cellules de Hadley, jet d'ouest subtropical, alizés, anticyclones subtropicaux, drainage polaire,
front polaire et ondes de Rossby, schémas idéaux en altitude et en surface.

- **Cours** : 14 étapes guidées, la caméra et les couches changent à chaque étape.
- **Explorer** : couches à la carte, curseur du mois (la ZCIT suit le Soleil), curseur de rotation de la Terre
  (0 % = une seule cellule par hémisphère), bulles d'air à lâcher au sol ou en altitude.
- **Quiz** : 15 questions avec correction et renvoi vers l'étape du cours.

Liens directs : `?step=7` ouvre l'étape 7, `?tab=quiz` ouvre le quiz.

## Modifier

Le code est dans `src/` (modèle de vents : `model.js`, textes : `content.js`, rendu : `main.js`, shaders : `shaders.js`).
Après une modification, reconstruire `app.js` avec esbuild :

```sh
npm install esbuild three@0.187.0   # une fois, dans un dossier à part
NODE_PATH=chemin/vers/node_modules npx esbuild src/main.js --bundle --minify --format=esm --outfile=app.js
```

Textures : NASA Blue Marble / Black Marble (domaine public), via le dépôt three-globe.
