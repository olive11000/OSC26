# Mission CCM — la cellule et les moteurs en jeu 3D

Jeu de révision du cours CCM 021 de la BA701 (cellule, systèmes, électricité, moteur à pistons, turboréacteur),
dans un hangar en 3D : un avion de ligne (type A320), un avion léger (type SR20), un réacteur en coupe sur son banc
et un cylindre de moteur à pistons en coupe. On peut toucher les pièces pour les découvrir (66 pièces).

20 missions, chacune en 3 étapes avec une étoile par étape :

- **Briefing** : les fiches du cours en cartes, les pièges, et les questions d'exam (questions ouvertes) à cocher.
- **Simu** : des manips en direct mêlées à des questions. Exemples : trouver la MZFM en chargeant l'avion,
  repousser le flottement, détecteurs de fumée optique et ionique, procédure feu moteur, loi de Pascal, anti-skid,
  mini-manche qui bouge les gouvernes 3D, pressurisation manuelle pendant toute la montée, boudins de dégivrage,
  rééquilibrage carburant avec les réservoirs en 3D, loi d'Ohm, portes logiques qui sortent les spoilers,
  400 Hz et IDG, réseau électrique dessiné sur l'avion, synchronoscope, cycle à 4 temps sur le cylindre 3D,
  givrage carburateur, mixture à l'EGT, essai magnétos, hélice à vitesse constante, traversée du réacteur,
  démarrage manuel (démarrage chaud, bloqué), inverseurs, flat rating et FLEX.
- **Check** : 10 QCM tirés de la banque de 417 questions CCM (`qcm/data/ccm.json`), 3 vies et des combos.

En plus : examen blanc (30 questions, 25 min, note sur 20 et missions à revoir), révision des erreurs,
lexique de plus de 100 sigles, grades (élève pilote → général) et XP. La progression est enregistrée dans le navigateur.

Liens directs : `#reacteur` ouvre une mission, `?tab=sim#reacteur` ouvre directement sa simu.

## Modifier

Le code est dans `src/` : `models.js` (modèles 3D procéduraux), `world.js` (hangar, animations, réseau électrique,
fiches des pièces), `views.js` (caméra et étiquettes de chaque mission), `main.js` (interface, progression),
`missions.js`, `engine.js` et `sims_a.js`, `sims_b.js`, `sims_c.js` (simulations), `lexique.js`.

`data_fiche.js` et `data_quiz.js` sont générés par `tools/gen_data.py` depuis les fiches `tools/fiche1.md` à
`fiche5.md` et la banque `qcm/data/ccm.json` :

```sh
python3 tools/gen_data.py
```

Après une modification, reconstruire `app.js` avec esbuild :

```sh
npm install esbuild three@0.187.0   # une fois, dans un dossier à part
NODE_PATH=chemin/vers/node_modules npx esbuild src/main.js --bundle --minify --format=esm --outfile=app.js
```
