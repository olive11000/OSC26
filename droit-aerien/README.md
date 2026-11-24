# Mission DA — le droit aérien en jeu 3D

Jeu de révision du cours de droit aérien (REG 01 à 19, COM 01, 02, 04), autour d'un aérodrome en 3D
(piste 16/34, VOR, CTR, TMA, LTA, UTA, zones P, R, D, TSA, approche ILS 34, SID, attente, mer pour le SAR).

17 missions, chacune en 3 étapes avec une étoile par étape :

- **Briefing** : les fiches du cours en cartes, plus des compléments tirés des slides
  (sillage, délais SAR, vitesses d'attente et par catégorie, signaux au sol, noms des routes), et les questions d'exam à cocher.
- **Simu** : une simulation par mission (priorités et feux de nuit, signaux de la tour, PAPI et distances déclarées,
  pente de montée, espaces aériens en 3D, VMC, niveaux de croisière, ATIS, scope radar, interception en 3D,
  entrées d'attente volées en 3D, profil d'approche, OCH de circling, pannes radio, signaux SAR…).
- **Check** : 10 QCM tirés de la banque de 449 questions, 3 vies et des combos.

En plus : examen blanc (30 questions, 25 min, note sur 20), révision des erreurs, lexique de 131 sigles,
grades (élève pilote → général) et XP. La progression est enregistrée dans le navigateur.

Liens directs : `#attente` ouvre une mission, `?tab=sim#attente` ouvre directement sa simu.

## Modifier

Le code est dans `src/` : `world.js` (monde 3D), `main.js` (interface, progression), `missions.js`,
`engine.js` et `sims_a.js`, `sims_b.js`, `sims_c.js` (simulations), `lexique.js`,
`data_fiche.js` et `data_quiz.js` (générés depuis la fiche DA et les banques de QCM).
Après une modification, reconstruire `app.js` avec esbuild :

```sh
npm install esbuild three@0.187.0   # une fois, dans un dossier à part
NODE_PATH=chemin/vers/node_modules npx esbuild src/main.js --bundle --minify --format=esm --outfile=app.js
```
