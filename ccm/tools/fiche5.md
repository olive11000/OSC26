@@ reacteur
## Produire de la poussée
- **Principe** (3e loi de Newton) : on **accélère une masse d'air vers l'arrière**, la réaction pousse l'avion vers l'avant.
- **Le trajet de l'air** : entrée d'air → **compresseur** (haute pression) → **chambre** (on brûle le carburant, le gaz se dilate) → **turbine** (elle prélève de l'énergie pour entraîner le compresseur) → **tuyère** (le gaz sort très vite).
- **Formule** : **F = ṁ × (Ve − V0) + (Pe − P0) × Ae**
    - ṁ = débit massique (kg/s) ; Ve = vitesse d'éjection ; V0 = vitesse de l'avion ;
    - Pe − P0 = surpression à la sortie de la tuyère ; Ae = section de sortie.
    - Première partie = **poussée de quantité de mouvement** ; seconde = **poussée de pression**.

**Exemple du cours** : ṁ = 50 kg/s, Ve = 600 m/s, V0 = 100 m/s → 50 × 500 = 25 000 N. Surpression 20 000 Pa sur 0,3 m² → 6 000 N. **Total : 31 000 N ≈ 31 kN.** En subsonique, la poussée de pression est souvent petite : c'est la quantité de mouvement qui domine.

## La poussée et la vitesse
- Pour un turboréacteur simple flux, **la poussée reste à peu près constante** de l'arrêt jusqu'à ~**M0,8 à 0,9**.
- **Pourquoi** : deux effets s'opposent. L'**effet de vitesse** : plus V0 augmente, plus Ve − V0 diminue (−). L'**effet de compression dynamique** (bélier) : l'air s'entasse dans l'entrée d'air, la pression et le débit montent (+). Les deux s'équilibrent.
- Donc : poussée au décollage ≈ en montée ≈ en croisière, jusqu'aux effets transsoniques.
- **Cycle continu** : admission, compression, combustion et détente ont lieu **en même temps** à des endroits différents (le moteur à pistons, lui, est intermittent).
- **Vitesses dans le compresseur** : vitesse absolue = composante **axiale** (le long de l'axe) + composante **tangentielle** (autour de l'axe, le tourbillon). Le rotor du compresseur **augmente** la vitesse tangentielle ; la turbine la **diminue** en prélevant l'énergie.

## Les types de turbines à gaz
| Type | Principe | Point fort | Point faible |
| --- | --- | --- | --- |
| **Simple flux** (turbojet) | Tout l'air passe par le cœur ; jet très rapide | Grande vitesse (M0,8 et +) | Consomme, bruyant |
| **Double flux faible taux** (0,3 à 2:1 ; M88 du Rafale 0,3:1) | Petite soufflante, jet rapide | Poussée spécifique élevée, petit maître-couple, léger : militaire | Consomme plus, bruyant |
| **Double flux fort taux** (5 à 12:1 ; A320neo 11:1, A350 9,6:1, 787 9,3:1) | Grosse soufflante, la majorité de la poussée vient du flux froid | Très économe, silencieux, bon rendement propulsif | Gros diamètre (traînée), lourd, pas supersonique |
| **Turbopropulseur** | Turbine → réducteur → hélice ; **80 à 99 %** de la poussée par l'hélice, le reste par le jet résiduel | Meilleur rendement propulsif à basse vitesse (< ~400 kt) | Limité en vitesse |

- **Taux de dilution (BPR)** = débit d'air **secondaire** (froid, qui contourne le cœur) / débit d'air **primaire** (chaud, qui traverse le cœur).
- Turbofan : poussée = jet chaud du cœur + jet froid de la soufflante.

## Corps, turbine liée, turbine libre
- **Mono-corps** : un seul arbre relie compresseur et turbine. Simple, léger, peu efficace.
- **Multi-corps** (2 ou 3 arbres) : le corps **BP** (soufflante + turbine BP) tourne lentement, le corps **HP** (compresseur HP + turbine HP) tourne vite. Meilleur rendement sur toute la plage, **moins de pompage**, mais plus complexe et cher.
- **Puissance équivalente (EHP)** d'un turbopropulseur = puissance sur l'arbre (**SHP**) + puissance due au jet résiduel. Exemple : 1 000 SHP + 200 = 1 200 EHP. On l'utilise car la poussée dépend de l'hélice choisie.
- **Turbine liée** (coupled) : la turbine de puissance est **sur le même arbre** que le générateur de gaz ; tout le moteur tourne au même régime N.
- **Turbine libre** : le générateur de gaz (**N1**) et la turbine de puissance (**N2**) sont sur des **arbres indépendants**, sans lien mécanique. Le compresseur tourne à son régime optimal, le **démarrage est plus facile** (moins de charge pour le démarreur), large plage de puissance **sans pompage**.

## Rendements, consommation, limites
- **Rendement propulsif** ηp : bon quand **Ve est proche de la vitesse de l'avion**. D'où : hélice et double flux meilleurs que le simple flux à vitesse modérée.
- **Rendement thermique** ηth : augmente avec le **taux de compression** (anciens moteurs 10 à 20:1 ; double flux modernes 30 à 50:1).
- **Rendement global = ηp × ηth**.
- **Consommation spécifique** : réacteur = débit / **poussée** (turbojet 0,9 à 1,2 ; double flux fort taux 0,5 à 0,6 lb/lb/h) ; turbopropulseur = débit / **puissance sur l'arbre** (0,45 à 0,55 lb/hp/h).
- **Limites matériaux** : la **température turbine** (ITT, TIT ; aubes en superalliages de nickel, 850 à 1 050 °C en continu sur une turbine liée) et le **couple** (réducteur, arbres).
- **Dépassement** : fluage, oxydation, fissures, fusion des aubes ; dents de pignons arrachées, arbre tordu ou cisaillé, moyeu d'hélice abîmé.
- **Tout dépassement se déclare** immédiatement, au carnet de route : il peut cacher des dégâts (endoscopie, maintenance, dépose).

## L'entrée d'air
- **Rôles** : donner au compresseur un **flux régulier et homogène**, **ralentir l'air** pour augmenter sa pression statique (effet bélier), protéger des corps étrangers, limiter la turbulence, permettre l'antigivrage.
- **Entrée pitot subsonique** : face au vent, elle transforme la pression dynamique en pression statique. Simple et efficace en subsonique.
- **Problèmes** :
    - **décollement** à forte incidence (lèvre) → décrochage compresseur, pompage, extinction, vibrations ;
    - **ingestion** (oiseau, grêle, débris) → aubes abîmées, balourd, pompage, panne ;
    - **givrage** → flux perturbé, pompage, perte de débit et de puissance, extinction possible ;
    - **forte turbulence** → incidence et vitesse qui varient, petits pompages (risque d'extinction faible).

## Le compresseur
| | Centrifuge | Axial |
| --- | --- | --- |
| **Principe** | Un **rouet** accélère l'air vers l'extérieur ; le **diffuseur** fixe transforme la vitesse en pression | Les **rotors** accélèrent l'air et lui donnent du tourbillon ; les **stators** le redressent et le transforment en pression |
| **Taux par étage** | **4 à 6:1** | **1,2 à 1,5:1**, mais beaucoup d'étages |
| **Corps étrangers** | **Peu sensible** (les particules sont rejetées vers l'extérieur) | **Très sensible** (grande entrée, aubes fines) |
| **Usage** | Petits moteurs, APU | Gros réacteurs |

- Dans le compresseur : vitesse axiale à peu près constante (légère baisse), **pression et température montent**.
- **Veine convergente** : la section **diminue** vers l'arrière pour garder une vitesse axiale constante malgré la compression (sinon les aubes décrochent).
- **Vrillage des aubes** : le pied tourne moins vite que le bout ; on vrille l'aube pour garder la **même incidence** sur toute sa longueur.
- **Aubes directrices d'entrée (IGV)** : orientent l'air sur le premier rotor ; variables, elles gardent la marge au pompage hors du point de conception.
- **Plus d'étages centrifuges** : taux plus élevé, mais plus lourd, plus cher, plus dur à refroidir, plus de risque de pompage.
- **Pertes en bout d'aube** : carénages de bout, joints labyrinthe, rainures dans le carter, aubes allongées. **Flexion et flottement des aubes** : aubes vrillées et effilées, matériaux rigides (titane, composites), amortisseurs.
- **Cliquetis au sol** quand le fan tourne lentement (arrêt, moulinet) : les aubes bougent dans leur logement faute de force centrifuge. **Normal.**

## Décrochage compresseur et pompage
- **Décrochage compresseur** : un **décollement local** sur une aube dont l'incidence est trop forte → l'étage comprime moins.
- **Pompage** (surge) : l'écoulement **s'arrête ou s'inverse** dans tout le compresseur → oscillations violentes de pression.
- **Signes** : **détonation forte** ou grondement, **flammes** à l'entrée ou à l'échappement, vibrations, **chute rapide de N1/N2**, **pic d'EGT/ITT**, perte de poussée ou de couple.
- **Causes** : faible vitesse + régime élevé, **accélération brutale** de la manette, forte incidence ou turbulence, aubes abîmées, givrage ou obstruction.
- **Parades** : **IGV et stators à calage variable** (moins d'incidence à bas régime), **vannes de décharge** (on évacue de l'air entre deux étages), **multi-corps**.
- **Champ compresseur** : débit massique en abscisse, taux de compression en ordonnée. La **ligne de pompage** est la limite ; la **marge au pompage** est l'écart entre la ligne de fonctionnement et la ligne de pompage.
- **Diffuseur** (en sortie du compresseur centrifuge) : ralentit l'air rapide et le transforme en pression ; à aubes (fixes ou variables) ou lisse.

## La chambre de combustion
- **Rôle** : ajouter de l'énergie en brûlant le carburant, monter la température au maximum que la turbine supporte, avec **peu de perte de pression** et une combustion complète.
- **Exigences** : bonne richesse, bon mélange, temps de séjour suffisant, allumeurs au démarrage, flamme stable (ni soufflée ni remontée), perte de charge < 5 à 7 %, peu d'émissions, température homogène à l'entrée turbine.
- **Ralentir l'air** : il sort du compresseur à 150 à 200 m/s, il faut **20 à 50 m/s** pour que la flamme tienne. Un **diffuseur** (snout) élargit la veine et crée une zone de recirculation.
- **Vrille d'entrée** (swirler) : donne un tourbillon à l'air primaire → **recirculation qui accroche la flamme**, meilleur mélange, flamme stable, chambre compacte.
- **Air primaire** (20 à 30 %) : par la vrille, il brûle avec le carburant à richesse **stœchiométrique** (14,7 à 18:1). **Air secondaire** (70 à 80 %) : par des trous de dilution, il **refroidit** les gaz et répartit la température. **Richesse globale très pauvre : 40 à 60:1**.
- Dans la chambre : **pression statique presque constante** (perte 3 à 7 %), **température qui monte fortement** (400-600 °C → 1 200-1 600 °C), vitesse axiale faible.
- **Vannes de purge** au point bas : vidangent le carburant après un arrêt ou un démarrage raté (sinon feu au démarrage suivant).
- **Types** : **tubulaire** (6 à 12 tubes, simple, points chauds) → **tubo-annulaire** (meilleure répartition, anciens moteurs) → **annulaire** (une seule chambre en anneau : température homogène, moins de pertes, **standard moderne**) → **annulaire à flux inversé** (compact : petits moteurs, APU).

## La turbine
- **Rôle** : prélever l'énergie des gaz pour entraîner le compresseur (et l'hélice ou la turbine libre). Le reste de l'énergie part dans la tuyère.
- **Action** (impulse) : toute la détente se fait dans le **distributeur** (stator) ; le rotor ne fait que dévier le jet rapide. Simple, robuste.
- **Réaction** : la détente se fait aussi **dans le rotor** (profil d'aile), le gaz accélère et pousse par réaction. Meilleur rendement.
- **Action-réaction** : le mélange des deux, **le plus courant**.
- **Un étage** = **distributeur** fixe (accélère et oriente le gaz, transforme pression en vitesse) + **aubes mobiles** (prennent l'énergie, donnent du couple) + **disque** (transmet le couple à l'arbre).
- Dans la turbine : **pression et température baissent**.
- **Pertes en bout d'aube** (2 à 5 %) : carénages de bout, joints labyrinthe, rainures, **contrôle actif du jeu** (de l'air du compresseur refroidit le carter pour qu'il se contracte à forte puissance).
- **La poussée est limitée par la TIT**, le point le plus chaud du moteur (1 400 à 1 700 °C avec refroidissement).
- **Contraintes** : thermiques (gaz à 1 400 °C, pied d'aube plus froid) et mécaniques (**force centrifuge**, flexion due au gaz, disques très tendus). Solutions : refroidissement interne, **aubes monocristallines**, barrières thermiques, refroidissement des disques.

## La tuyère et le bruit
- **Cône d'échappement** : flux régulier en sortie de turbine. **Tuyau d'éjection** : amène les gaz à la tuyère avec peu de pertes (mélangeurs, silencieux). **Tuyère** convergente ou convergente-divergente : **accélère** les gaz → poussée.
- Dans l'échappement : pression et température baissent, **vitesse qui augmente** fortement.
- **Tuyère bloquée** (choked) : la vitesse atteint **Mach 1 au col** ; baisser encore la pression en aval n'accélère plus le gaz, le **débit est maximal**. Pour un jet supersonique, il faut une tuyère **convergente-divergente** (moteurs à post-combustion, fusées).
- **Sources de bruit** : le jet (mélange turbulent avec l'air), la soufflante (interaction rotor-stator), turbine et compresseur (aigu), combustion.
- **Réduction** : mélangeurs et **chevrons**, tuyères multitubes, **revêtements acoustiques**, **fort taux de dilution** (le flux froid entoure le jet chaud, moins d'écart de vitesse), et en exploitation puissance réduite et procédures antibruit.

## !Les pièges
- La **turbine** entraîne le compresseur ; c'est la **tuyère** qui accélère les gaz.
- En subsonique, la poussée d'un turboréacteur est **à peu près constante** avec la vitesse.
- BPR = flux **froid** / flux **chaud**.
- **Centrifuge** : gros taux par étage, peu sensible aux corps étrangers. **Axial** : petit taux par étage, sensible.
- Dans la chambre, la **pression reste presque constante** ; la température monte.
- La poussée max est limitée par la **TIT**.
- Cliquetis du fan à l'arrêt : **normal**.

## ?Questions d'exam
- Énonce la formule de la poussée et calcule-la pour ṁ = 80 kg/s, Ve = 500 m/s, V0 = 150 m/s, sans poussée de pression.
- Pourquoi la poussée d'un turboréacteur reste-t-elle à peu près constante en subsonique ?
- Compare turboréacteur, double flux faible et fort taux, et turbopropulseur. Définis le taux de dilution.
- Différencie turbine liée et turbine libre. Avantages de la turbine libre ?
- Définis les rendements propulsif, thermique et global.
- Compare les compresseurs centrifuge et axial. Pourquoi la veine est-elle convergente et les aubes vrillées ?
- Différencie décrochage compresseur et pompage : causes, signes, parades.
- Décris le fonctionnement de la chambre de combustion (air primaire, secondaire, vrille, richesse).
- Compare turbines à action et à réaction. Qu'est-ce qui limite la poussée maximale ?
- Qu'est-ce qu'une tuyère bloquée ? Comment réduit-on le bruit d'un turboréacteur ?

@@ demarrage
## Le circuit carburant du moteur
- **Filtres** : retirent impuretés et eau.
- **Pompe BP** : gave la pompe HP (pression positive), **évite la cavitation**.
- **Pompe HP** : envoie le carburant haute pression au régulateur et aux injecteurs.
    - **à engrenages** : simple, fiable, cylindrée fixe (petits moteurs) ;
    - **à plateau inclinable** : cylindrée variable, plus efficace et précise (gros moteurs).
- **Rampe** : distribue le carburant aux injecteurs. **Injecteurs** : pulvérisent finement le carburant.
- **Robinet HP** : coupe l'alimentation du moteur (poignée feu, urgence).
- **Régulateur (FCU)** ou bloc hydromécanique : dose exactement le carburant.

## Le régulateur carburant (FCU)
- **Tâches** :
    - doser le carburant pour la poussée demandée ;
    - garder la bonne richesse dans toutes les conditions ;
    - **limiter le débit pendant l'accélération pour éviter le pompage** ;
    - protéger automatiquement (surchauffe, survitesse) ;
    - corriger selon l'altitude, la température et la vitesse.
- **Entrées** : position de la manette (**TLA**), régimes **N1/N2**, température et pression d'entrée compresseur (**T2, P2**), **EGT/ITT**, pression et température extérieures, état des prélèvements d'air, vitesse.

## La régulation et le FADEC
- **Évolution** : hydromécanique (ancien) → hydromécanique + superviseur électronique à autorité limitée → FADEC simple canal avec secours hydromécanique → **FADEC double canal sans secours** (standard actuel).
- **Tâches** : régler le débit pour la poussée voulue, rester dans les limites (température, régime, pression), protéger, accélérer et décélérer en douceur, optimiser la consommation, dialoguer avec l'avion (automanette).
- **FADEC** = calculateur moteur à **pleine autorité**, avec **deux canaux indépendants A et B**. Son cœur est l'**EEC** : loi carburant, démarrage, gestion de la poussée, protections, géométrie variable et vannes de décharge, détection de panne et changement de canal.
- La manette envoie un **signal électrique** (capteurs **TLA**) ; le FADEC calcule la poussée ou le régime cible.
- **Capteurs** : N1, N2, EGT, pressions compresseur (P2, P3), température d'entrée, pression carburant, conditions extérieures.
- **Actionneurs** : doseur (**FMU**), **stators variables** (VSV : stabilité, anti-pompage), **vannes de décharge** (stabiliser au démarrage et en accélération, fournir l'air à l'avion), **contrôle actif du jeu**.
- **Protections automatiques**, non contournables en temps normal : **EGT** (réduit le débit, limite l'accélération) ; **survitesse N1/N2** (réduit le débit, et au pire **coupe le moteur**).
- **Redondance** : chaque canal a sa propre alimentation (**PMA**, alternateur à aimant permanent, + batterie de secours) ; capteurs et faisceaux doublés ; les canaux comparent en permanence leurs données. Un capteur en panne : la donnée fausse est **rejetée**, l'autre canal la fournit. **Pas de perte de contrôle.**

## Lubrification et boîtier d'accessoires
- **Rôles** : graisser roulements et pignons, refroidir, nettoyer, protéger de la corrosion, amortir.
- **Composants** : réservoir avec **déshuileur centrifuge** (sépare l'air), **pompe de pression**, **pompes de récupération**, filtres avec by-pass, puisards, **détecteurs de limaille** (bouchons magnétiques : **alerte précoce d'usure**), radiateurs **air/huile ou carburant/huile**.
- **Roulements** : chaque attelage a au moins **un roulement à billes** (charges **axiales et radiales**) et **deux à rouleaux** ou plus (charges radiales seulement).
- **Étanchéité** : **joints labyrinthe pressurisés par l'air du compresseur** → l'huile ne fuit pas dans la veine, les gaz n'entrent pas dans l'huile.
- **Boîtier d'accessoires** : entraîné par le **corps HP** par un arbre de renvoi, lubrifié par le circuit d'huile du moteur. Il entraîne pompe carburant, pompes à huile, pompe hydraulique, génératrices, démarreur.

## L'allumage et le démarreur
- **Allumage** : une étincelle très énergétique pour allumer le mélange au démarrage, parfois en continu. **Excitateurs** (condensateurs haute énergie) + **allumeurs** à décharge de surface dans la chambre. **Deux systèmes indépendants** : on peut démarrer sur un seul.
- **Modes** : **démarrage** (les deux allumeurs) ; **allumage continu** (risque d'extinction : givrage, forte pluie, turbulence ; manuel ou auto) ; **rallumage automatique** par le FADEC s'il détecte une extinction.
- **Démarreur** : **électrique** (moteur DC ou AC à fort couple, batterie ou groupe de parc) ou **pneumatique** (turbine à air alimentée par l'**APU**, le groupe de parc ou le **cross-bleed**).
- **Principe** : le démarreur fait tourner le compresseur → l'air circule → carburant + allumage → **allumage** (light-off) → le moteur accélère jusqu'au **régime autonome** → coupure du démarreur.

## La séquence de démarrage
1. Démarreur ON (ou APU en marche, puis lancement de la séquence).
2. **Carburant ouvert vers 15 à 20 % de N2.**
3. **Allumage** : l'**EGT monte** (light-off).
4. Le moteur accélère jusqu'au **régime autonome**.
5. Coupure du démarreur.

- **En vol** (rallumage) : le **moulinet** remplace le démarreur, dans l'**enveloppe de rallumage** (selon vitesse et altitude).
- **Régime autonome** (self-sustaining) : le régime minimum où le moteur produit assez d'énergie pour **accélérer seul**, sans démarreur.

## Les inverseurs de poussée
- **Principe** : renvoyer le flux vers l'avant pour freiner à l'atterrissage → distance plus courte, moins d'usure des freins.
- **Types** : **flux chaud** (coquilles ou clamshell qui se ferment derrière la tuyère : anciens jets) ; **flux froid** (portes de blocage qui ferment le canal de soufflante + **grilles en cascade** qui renvoient l'air vers l'avant : double flux modernes, le plus courant).
- **Composants** : manette de reverse, puissance hydraulique ou pneumatique, vérins, portes ou grilles, voyants REV.
- **Inconvénients** : masse, complexité, **réingestion** de l'air renvoyé (corps étrangers).
- **Protections** contre un déploiement en vol : **contacteur train** (au sol seulement), verrou sur la manette, logique **FADEC** (inhibé au-dessus d'une vitesse ou en vol), **retour automatique** (auto-stow).
- **Voyants** : **REV ambre = en transit** ; **REV vert = déployé** et en fonctionnement.

## Les régimes certifiés
- **MTO** (décollage) : poussée max pour le décollage et la montée initiale, **limitée en temps** (en général **5 min**), trait rouge.
- **MCT** (max continu) : sans limite de temps ; montée, croisière, **vol sur un moteur**.
- **MCL** (max montée) : égal ou un peu sous MTO/MCT ; pour la montée prolongée, limité selon N1/N2, EGT, ITT ; optimisé pour la consommation et la durée de vie.
- **Temps d'accélération** (spool-up, ralenti → poussée décollage) : **2 à 8 s**. Critique en **remise de gaz**. Le FADEC accélère au plus vite sans pompage ; un ralenti vol plus haut le raccourcit.

## Ralentis et paramètres
| Ralenti | N1 | Pourquoi |
| --- | --- | --- |
| **Sol** | ~40 à 60 % | Moins de bruit, de carburant et de souffle |
| **Vol** | ~60 à 75 % | **Accélération rapide** pour la remise de gaz ; assez d'air pour l'antigivrage, l'électricité, l'hydraulique. **Plus haut avec l'antigivrage ON** |

- Séparation ralenti sol / vol : butée mécanique sur la manette (levée à la main ou par le contacteur train) ou logique d'automanette.
- **Paramètres de poussée** : **N1** (référence principale des double flux, en % ) ; N2 ; **EPR** (anciens moteurs) ; **couple** (référence des turbopropulseurs) ; **ITT/TIT ou EGT** (paramètre **limitant**) ; débit carburant.

## Turbopropulseur : alpha, bêta, reverse
- **Plage alpha** : vol normal ; le **régulateur** gère le pas (vitesse constante) ; la manette dose le carburant.
- **Plage bêta** : au sol, sous le ralenti, jusqu'au reverse max ; **la manette commande directement le pas** (sans régulateur). Pour le roulage.
- **Reverse** : pas négatif, freinage ; verrou de sécurité au sol (contacteur train).
- **Bêta par erreur en vol** : **traînée brutale**, perte de vitesse (décrochage), **lacet et roulis violents** si un seul moteur passe en bêta, survitesse ou rupture d'hélice possible. Protections : verrous (contacteur train, contacteur de vitesse), FADEC. (Certains avions autorisent un peu de bêta en approche comme aérofrein.)

## Surveiller le moteur
- **Engine trending** : un moteur se dégrade **progressivement**, il dérive. On suit EGT, N1, N2, débit, vibrations, huile et on compare à une référence (moteur neuf ou sortant de maintenance) → anticiper la maintenance, moins de déposes imprévues.
- **EGT**, mesurée **après la turbine BP** : l'image de la **contrainte thermique** de la turbine. Trait rouge = maximum.
    - **Accélération** : le carburant augmente plus vite que l'air → mélange riche → **pic d'EGT normal** (le FADEC limite).
    - **Décélération** : mélange pauvre → l'EGT baisse puis se stabilise.
    - **Dépassement** : fluage, frottement en bout d'aube, oxydation, fissures, fusion, rupture non confinée. Action : réduire la puissance, chercher une fuite de prélèvement ou un capteur faux. **Toujours déclarer** (valeur et durée).
- **Inverseurs à basse vitesse** : ingestion de débris, instabilité directionnelle, pompage → inhibés sous **~60 à 80 kt**.

## Les pannes mécaniques
- **Grippage** : blocage soudain des pièces tournantes. Causes : manque d'huile, roulement qui lâche (surchauffe, pollution), corps étranger, boîtier d'accessoires, surcouple ou survitesse.
- **Fuite de l'échangeur carburant/huile** :
    - pression **huile > carburant** → l'huile pollue le carburant → combustion perturbée, moteur rugueux, extinction possible ;
    - pression **carburant > huile** → le carburant **dilue l'huile** → **risque de feu**, viscosité trop basse, roulements qui lâchent.
- **Filtre à huile colmaté** : le by-pass s'ouvre, l'huile n'est plus filtrée, usure accélérée ; alarme de pression basse ; dégâts si le by-pass ne s'ouvre pas.
- **Diagnostic** :
    - vibrations fortes → roulement ou aube ;
    - **EGT haute + N1 bas** → turbine endommagée ;
    - pression d'huile basse + température haute → lubrification ;
    - chute brutale de couple → réducteur ou arbre ;
    - débit plus fort pour la même poussée → rendement dégradé (fuites compresseur ou turbine).

## Les démarrages ratés
| Cas | Signes | Cause probable |
| --- | --- | --- |
| **Faux démarrage** (sec ou humide) | **Pas d'allumage**, EGT qui reste basse, N1 qui ne monte pas | Pas de carburant ou pas d'allumage, mauvaise loi carburant |
| **Feu de tuyère** (torching) | **Flammes à l'échappement**, EGT haute, N1 qui ne monte pas | Trop de carburant, qui brûle dans l'échappement |
| **Démarrage chaud** (hot start) | **EGT qui monte très vite** et dépasse le trait rouge | Trop de carburant, pas assez d'air |
| **Démarrage bloqué** (hung) | N1 qui se stabilise **sous le régime autonome** | Démarreur trop faible, régulation carburant |
| **N1 à zéro** | N1 ne tourne pas alors que N2 tourne | Moteur grippé, panne électrique |
| **Pas d'indications FADEC** | Plus de données moteur à l'ECAM/EICAS | FADEC non alimenté, capteur ou câblage |

**Enveloppe de rallumage** : la plage altitude/vitesse où l'on peut rallumer en vol. Elle dépend du débit d'air (combustion), du régime de moulinet et des limites de température. **Limite basse** = vitesse mini pour un moulinet suffisant ; **limite haute** = altitude max (air assez dense).

## !Les pièges
- La pompe **BP** évite la **cavitation** de la pompe HP.
- Le FCU **limite** le débit en accélération : c'est une protection anti-pompage.
- FADEC moderne = **double canal sans secours** hydromécanique.
- Boîtier d'accessoires entraîné par le corps **HP**.
- **REV ambre** = transit ; **REV vert** = déployé.
- **Hot start** = EGT qui s'emballe ; **hung start** = régime bloqué sous l'autonome ; **faux démarrage** = pas d'allumage.
- Fuite d'échangeur avec carburant > huile : **feu** et huile diluée.
- Un pic d'EGT pendant une **accélération** est **normal**.

## ?Questions d'exam
- Décris le circuit carburant d'un turboréacteur et le rôle de chaque pompe.
- Quelles sont les tâches du FCU et ses paramètres d'entrée ?
- Qu'est-ce qu'un FADEC ? Décris ses fonctions, ses protections et sa redondance.
- Décris le circuit de lubrification et l'étanchéité des paliers. Quel corps entraîne le boîtier d'accessoires ?
- Décris le système d'allumage et ses modes.
- Donne la séquence de démarrage d'un turbofan. Qu'est-ce que le régime autonome ?
- Décris les deux types d'inverseurs et leurs protections contre un déploiement en vol.
- Pourquoi le ralenti vol est-il plus élevé que le ralenti sol ?
- Décris les plages alpha, bêta et reverse d'un turbopropulseur et le danger du bêta en vol.
- Cite les démarrages ratés avec leurs signes et leurs causes.

@@ perfs
## La poussée et l'altitude
- **Altitude qui monte, TAS constante** : l'air est moins dense → **le débit massique baisse** → **la poussée baisse** (~3 à 4 % par 1 000 ft jusqu'à ~25 000 ft, puis plus lentement).
- **La consommation spécifique augmente** avec l'altitude (~5 à 10 % par 10 000 ft selon le cours) : il faut brûler relativement plus de carburant pour la même poussée.

## La poussée et la vitesse
- **TAS qui monte, altitude constante** (subsonique) : la poussée reste **à peu près constante** ou baisse légèrement. L'effet bélier augmente un peu le débit (+), mais l'écart Ve − V0 diminue (−).
- **La consommation spécifique baisse légèrement** quand la TAS augmente : le rendement propulsif s'améliore quand la vitesse de l'avion se rapproche de la vitesse d'éjection.

## Le moteur à poussée plate (flat-rated)
- **Définition** : la poussée de décollage reste **constante jusqu'à une température extérieure donnée** (la température de flat rating), puis elle baisse.
- **Sous cette température** : poussée = valeur nominale ; quand l'OAT monte, la **TIT augmente** (le moteur travaille plus pour garder la poussée), le régime peut monter un peu.
- **À cette température** : la TIT atteint sa **limite**.
- **Au-dessus** : la TIT est **figée** à sa limite → **la poussée baisse**.

**Pour comprendre** : le moteur pourrait donner plus de poussée par temps froid, mais on la plafonne. Par temps chaud, c'est la température turbine qui devient la limite.

## L'EPR
- **EPR** (engine pressure ratio) = **pression en sortie de turbine / pression en entrée de compresseur**.
- Paramètre principal de poussée sur beaucoup d'anciens turboréacteurs et de double flux à faible taux. Plus d'EPR = plus de poussée.

## Poussée réduite (FLEX) ou détarée (DERATE)
| | Poussée réduite (FLEX) | Poussée détarée (DERATE) |
| --- | --- | --- |
| **Principe** | On entre une **température supposée** plus haute que la réelle (assumed temperature) : on « trompe » la loi de régulation | Une **réduction fixe et certifiée** de la poussée max (TO1 = −10 %, TO2 = −20 %) : le FADEC **plafonne** la poussée |
| **Réglage** | **Continu**, optimisé à chaque départ | **Par paliers** |
| **Avantages** | Durée de vie du moteur (marge d'EGT), maintenance, carburant au décollage, bruit | Robuste, simple, moins de calculs, performances prévisibles |
| **Limites** | Calcul précis indispensable (risque d'erreur), sensible aux changements (vent, contamination) ; **interdit sur piste contaminée, avec risque de cisaillement de vent**, parfois avec l'antigivrage ON | Moins optimisé, marge parfois inutilisée ; il faut quand même choisir le bon palier |

**La différence clé** : en FLEX, le moteur garde **toute sa capacité** (le pilote peut pousser les manettes à fond) ; en DERATE, la poussée max est **réellement plafonnée** (c'est une limite certifiée).

## L'effet des prélèvements d'air
Quand on prélève de l'air au compresseur (bleed pour la clim, l'antigivrage) :
- **régime** : légère baisse (moins de débit dans le cœur) ;
- **EGT / TIT** : **en hausse** (il faut plus de carburant pour garder la poussée) ;
- **poussée** : **en baisse** (moins de débit, moins de quantité de mouvement) ;
- **consommation spécifique** : **en hausse** (plus de carburant pour moins de poussée).

## L'APU
- **APU** (groupe auxiliaire de puissance) : une **petite turbine à gaz**, en général dans la **queue** des jets.
- **Rôles** :
    - **électricité au sol** quand les moteurs sont arrêtés ;
    - **air de prélèvement pour démarrer les moteurs** ;
    - secours électrique et pneumatique **en vol** ;
    - **climatisation et pressurisation au sol**.
- **Entrées d'air** : **affleurante** (flush, la plus courante : peu de traînée, mais il faut une **porte** qui s'ouvre) ou **écope** (scoop, anciens modèles : plus de traînée, plus simple, sans porte).
- **Altitudes** : **altitude max de fonctionnement** (FL350 à FL410 selon le modèle) **> altitude max de démarrage** (FL250 à FL300), car le démarrage demande plus de couple et plus d'air.
- **Commandes et indications** : bouton start/stop, générateur, bleed ; régime, EGT, pression et température d'huile, charge du générateur, pression bleed ; alarmes feu, panne, huile, EGT haute.
- **Arrêts automatiques** (non contournables dans la plupart des cas) : **EGT haute**, **pression d'huile basse**, température d'huile haute, **survitesse**, sous-vitesse (extinction), **inversion du flux bleed**, **feu**. Après un arrêt automatique, il faut en général une **action de maintenance** avant de redémarrer.

## !Les pièges
- À TAS constante, quand on monte : poussée **en baisse**, consommation spécifique **en hausse**.
- Flat rating : sous la température de flat rating, la poussée est **constante** et c'est la **TIT** qui monte.
- **FLEX** = température supposée, réglage continu, moteur pas limité. **DERATE** = paliers certifiés, poussée vraiment plafonnée.
- FLEX interdit sur piste **contaminée** et avec risque de **cisaillement de vent**.
- Prélever de l'air : poussée **en baisse**, EGT et SFC **en hausse**.
- APU : on peut le faire **fonctionner plus haut** qu'on ne peut le **démarrer**.

## ?Questions d'exam
- Comment évoluent la poussée et la consommation spécifique avec l'altitude à TAS constante ? Et avec la TAS à altitude constante ?
- Qu'est-ce qu'un moteur flat-rated ? Décris l'évolution de la poussée et de la TIT avec l'OAT.
- Définis l'EPR.
- Compare la poussée réduite (FLEX) et la poussée détarée (DERATE) : principe, avantages, limites.
- Quel est l'effet d'un prélèvement d'air sur le régime, l'EGT, la poussée et la consommation ?
- Quelles sont les tâches d'un APU ? Pourquoi son altitude max de démarrage est-elle plus basse que son altitude max d'utilisation ?
- Cite les causes d'arrêt automatique d'un APU.
