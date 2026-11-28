@@ elecbase
## L'électricité statique
- **Origine** : le frottement de l'avion contre l'air, les cristaux de glace, la poussière, la pluie, la neige (effet **triboélectrique**). La charge peut atteindre des dizaines à des centaines de kV.
- **Conditions les pires** : haute altitude (FL250 à FL410), **cristaux de glace et neige** (cirrus, enclumes), précipitations, air sec, **grande vitesse vraie**, sommets d'orage.
- **Déperditeurs statiques** (static wicks) : ils déchargent l'électricité par **effet couronne** contrôlé, à basse tension. Placés aux **bords de fuite** des ailes et des empennages (6 à 12 par avion), en fibre de carbone ou en fils résistifs.
- **Ils évitent** : les parasites radio (P-static), les étincelles aux mises à l'air libre ou pendant l'avitaillement, les dégâts aux antennes et à l'avionique, et au pire le soudage des articulations de gouvernes.
- **Prévol** : tous présents, intacts, propres. Il en manque un → risque de parasites radio.

## Mise à la terre et métallisation
- **Avant l'avitaillement** : l'avion peut être encore chargé, et le carburant qui coule dans les tuyaux se charge aussi. Une différence de potentiel = une étincelle = les vapeurs s'enflamment.
- **Ordre** : **1. câble de masse**, **2. pistolet ou tuyau**, **3. avitaillement**.
- **Métallisation** (bonding) : toutes les pièces conductrices sont reliées pour être au **même potentiel** (structure, réservoirs, tuyaux, antennes, sondes). Elle évite les étincelles à l'intérieur des réservoirs et aux jonctions.
- Métallisation + déperditeurs = protection complète contre la statique.

## Le courant continu
- **Continu** = le courant circule **dans un seul sens**, la polarité ne change pas. Il ne passe que dans un **circuit fermé**. Sources : batteries, génératrices, alternatif redressé.
- **Conducteurs** (électrons libres : cuivre, aluminium), **semi-conducteurs** (silicium), **isolants** (PVC).
- **Tension** U en **volts** : la « pression » qui pousse les électrons. **Intensité** I en **ampères** : le « débit ».
- **Loi d'Ohm** : **U = R × I**. Plus de tension → plus de courant ; plus de résistance → moins de courant.
- **Puissance** : **P = U × I = R × I² = U² / R**, en watts. Elle sert à dimensionner les fils, les fusibles, les disjoncteurs et les batteries.

**Exemple** : 28 V sur une résistance de 14 Ω → I = 28 / 14 = **2 A**, et P = 28 × 2 = **56 W**.

## Série, parallèle, CTP et CTN
- **En série** : R totale = R1 + R2 + R3. Le **même courant** traverse tout, la **tension se partage**.
- **En parallèle** : 1/R = 1/R1 + 1/R2 + 1/R3. La R totale **diminue**, la **même tension** est aux bornes de chaque branche, le **courant se partage** et le courant total **augmente**.
- **Exemples** : deux 10 Ω en série = 20 Ω ; en parallèle = **5 Ω**.
- **CTP** (PTC) : la résistance **augmente** avec la température → fusibles réarmables, capteurs.
- **CTN** (NTC) : la résistance **diminue** avec la température → limiteur de courant d'appel, thermistance de mesure.
- **Interrupteurs** : à levier, à bascule, poussoir, rotatif. Les **interrupteurs protégés** par un capot évitent une action par erreur sur un système critique (pompes, extincteurs, démarrage).

## Le courant alternatif
- **Alternatif** = le courant change de sens régulièrement, en forme de **sinusoïde**. Produit par des alternateurs ou des onduleurs. Plus complexe à bord que le continu, mais bien meilleur pour produire et distribuer de fortes puissances.
- **Phase** = la position dans le cycle (0 à 360°). **Déphasage** = l'écart angulaire entre deux signaux de même fréquence : 0° en phase, **120°** en triphasé, 180° en opposition.
- **Triphasé** : 3 tensions décalées de 120° → **puissance constante**, moteurs plus simples, plus légers et plus efficaces, câbles mieux utilisés.
- **Standard avion** : **115/200 V, 400 Hz**. 115 V entre une phase et le neutre, 200 V entre deux phases. Monophasé 115 V pour les petites charges.
- **Fréquence** = nombre de cycles par seconde, en **hertz**. **Pourquoi 400 Hz ?** Transformateurs et moteurs **beaucoup plus petits et légers**.
- Pour coupler deux alternateurs, le déphasage doit être **nul**, sinon courants de circulation énormes et dégâts.

## L'électromagnétisme
- Tout courant crée un **champ magnétique** autour du fil (règle de la main droite). Le champ est **proportionnel au courant**, et au **nombre de spires** pour une bobine ; il diminue avec la distance.
- **Solénoïde** : bobine + noyau mobile attiré dans la bobine → **mouvement linéaire** ; un ressort le ramène. Usage : vannes carburant, sélecteurs hydrauliques.
- **Relais** : une petite bobine (petit courant) attire une palette qui ferme de **gros contacts** → on commande un circuit de puissance à distance, avec deux circuits isolés. Usage : bus tie, contrôle des génératrices.
- **Induction** (loi de Faraday) : un **flux magnétique variable** induit une tension, proportionnelle à la vitesse de variation. Deux cas : un conducteur qui tourne dans un champ (**génératrice**), ou un courant variable dans une bobine qui induit une tension dans une bobine voisine (**transformateur**, induction mutuelle, sans contact).

## !Les pièges
- En **parallèle**, la résistance totale **baisse** et le courant total **augmente**.
- **CTP** : la résistance monte avec la chaleur ; **CTN** : elle baisse.
- Avitaillement : **masse d'abord**.
- Déperditeurs aux **bords de fuite**, pas aux bords d'attaque.
- Triphasé : **120°** entre phases. 115 V phase-neutre, **200 V** entre phases.

## ?Questions d'exam
- D'où vient l'électricité statique ? Dans quelles conditions est-elle maximale ? À quoi servent les déperditeurs ?
- Pourquoi met-on l'avion à la masse avant l'avitaillement ? À quoi sert la métallisation ?
- Énonce la loi d'Ohm et la formule de la puissance. Calcule I et P pour 28 V sur 7 Ω.
- Compare un montage en série et en parallèle.
- Qu'est-ce qu'une résistance CTP et une CTN ? Donne un usage de chacune.
- Définis phase, déphasage et fréquence. Pourquoi les avions utilisent-ils du triphasé 400 Hz ?
- Explique le principe du solénoïde, du relais et de l'induction.

@@ protections
## Fusibles et disjoncteurs
- **Fusible** : un fil fin qui **fond** quand le courant dépasse son calibre → circuit ouvert. À remplacer.
- **Disjoncteur** (CB) : un interrupteur automatique qui **s'ouvre** en surintensité, et qui **se réarme**. Préféré en avion.
- Les deux protègent **contre l'échauffement et le feu** : ils protègent le **câble**.
- **Calibre** en ampères. Fusible **rapide** (réagit vite au court-circuit) ou **temporisé** (tolère les pointes). Exemple : un fusible de 5 A saute vers 7 à 10 A selon la durée.
- **Jamais un calibre plus fort** : le fil chaufferait et brûlerait **avant** que le fusible saute.

## Thermique ou magnétique
| Disjoncteur | Déclenchement | Vitesse | Contre |
| --- | --- | --- | --- |
| **Thermique** | Un **bilame** chauffe et se tord | **Lent**, dépend de la durée | La **surcharge** |
| **Magnétique** | Une **force électromagnétique** | **Très rapide** | Le **court-circuit** |

En avion, on combine souvent les deux (magnéto-thermique) : le magnétique coupe vite les courts-circuits, le thermique coupe les surcharges qui durent.

## Le court-circuit et les surintensités
- **Court-circuit** : un chemin de résistance presque nulle entre le + et le −. Loi d'Ohm : **I = U / R** → si R ≈ 0, le courant devient énorme. Puissance : **P = R × I²** → même une petite résistance dégage une chaleur massive → fils qui chauffent, isolant qui fond, **feu**. C'est le principal risque de feu électrique.
- **Surintensité transitoire** : un pic court et normal (démarrage d'un moteur électrique, foudre, coupure d'une charge inductive). Les fusibles temporisés et les thermiques la tolèrent ; les magnétiques coupent les vrais défauts. La protection doit faire la différence.

## Réarmer un disjoncteur
- Beaucoup de procédures (QRH, ECAM) demandent de **réarmer** un disjoncteur pour relancer un calculateur, une pompe, un capteur après un défaut passager.
- **Séquence typique** : tirer le disjoncteur, attendre **10 à 30 s**, le repousser.
- **Une seule fois**, sauf procédure contraire. Réarmer plusieurs fois peut provoquer des arcs et de la surchauffe, et **cacher un vrai défaut** (un fil dénudé qui frotte).
- **Jamais de shunt** (trombone, fusible ponté) : risque catastrophique.
- Le réarmement est une étape de dépannage, pas une réparation.

## Les semi-conducteurs et la chaleur
- Les semi-conducteurs (silicium, germanium) **conduisent mieux quand ils chauffent** (comportement CTN).
- **Trop chaud** : courants de fuite, faux basculements, gain réduit, **emballement thermique** (destruction), vieillissement accéléré.
- **Trop froid** : commutation plus lente, chute de tension plus forte.
- D'où les ailettes, les dissipateurs, la **ventilation des baies avioniques** et la climatisation.

## Les portes logiques
| Porte | Sortie = 1 quand… | Symbole |
| --- | --- | --- |
| **ET** (AND) | **toutes** les entrées = 1 | Forme en D à dos plat |
| **OU** (OR) | **au moins une** entrée = 1 | Dos courbe |
| **NON** (NOT) | l'entrée = 0 (elle inverse) | Triangle + petit rond |
| **NON-OU** (NOR) | **toutes** les entrées = 0 | OU + petit rond |
| **NON-ET** (NAND) | **pas toutes** à 1 (sortie 0 seulement si toutes = 1) | ET + petit rond |

- Le **petit rond** (bulle) = une **inversion**.
- On lit un schéma de FCOM **de gauche (entrées) à droite (sortie)**.
- **Exemple** : « SI train comprimé (WOW) **ET** manettes au ralenti → sortie des spoilers sol » : une porte ET avec deux entrées.

## !Les pièges
- **Thermique** = lent, surcharge ; **magnétique** = rapide, court-circuit.
- Le disjoncteur protège le **câble**, pas l'équipement.
- **Un seul** réarmement, sauf procédure.
- **NAND** : sortie à 0 **seulement** si toutes les entrées sont à 1. **NOR** : sortie à 1 **seulement** si toutes sont à 0.
- Un semi-conducteur chaud conduit **plus** (comme une CTN).

## ?Questions d'exam
- Compare fusible et disjoncteur. Pourquoi ne faut-il jamais monter un fusible de calibre supérieur ?
- Compare disjoncteur thermique et magnétique.
- Explique avec la loi d'Ohm et la formule de puissance pourquoi un court-circuit provoque un feu.
- Pourquoi ne réarme-t-on un disjoncteur qu'une seule fois ?
- Quel est l'effet de la température sur les semi-conducteurs ?
- Donne la table de vérité des portes ET, OU, NON, NON-ET et NON-OU.

@@ generation
## La batterie de bord
- **Rôles** : **démarrer** les moteurs et l'APU (gros courant) ; **secours** quand toutes les génératrices lâchent ; stabiliser la tension et absorber les pointes ; alimenter au sol sans groupe ; garder les mémoires et les horloges.
- **Types** : **plomb-acide** (ancien), **nickel-cadmium (Ni-Cd)** (jets et turbopropulseurs anciens), **lithium-ion** (A350, 787, jets d'affaires : légère et dense en énergie), lithium-polymère (très rare en avion certifié).
- **C-rate** : vitesse de charge ou de décharge par rapport à la capacité. **1C** = charge ou décharge complète en **1 heure**.

## Éléments, tension, capacité
| Type | Tension d'un élément | Pour 28 V |
| --- | --- | --- |
| Plomb-acide | **2,0 V** (2,1 à 2,2 V chargé) | — |
| **Ni-Cd** | **1,2 V** | **24 éléments** (24 × 1,2 V) |
| **Lithium-ion** | **3,6 à 3,7 V** (4,2 V chargé) | **7 à 8 éléments** |

- **En série** : la **tension** s'additionne. **En parallèle** : la **capacité** s'additionne. La batterie correspond à la tension du bus 28 V DC.
- **Tension de charge toujours plus haute** que la tension de la batterie, pour vaincre la résistance interne : plomb 28,5 à 28,8 V ; Ni-Cd 28 à 30 V (corrigée selon la température) ; lithium 4,2 V max par élément.
- **Capacité** en **ampères-heures (Ah)** (parfois en Wh) : 40 Ah = 40 A pendant 1 h ou 4 A pendant 10 h, en théorie. 15 à 80 Ah selon l'avion. Réduite par un fort courant et par le froid.

## Température et autonomie
- **Froid** (< 0 °C) : la chimie ralentit, **40 à 60 % de capacité à −20 °C**, résistance interne plus forte, la tension chute en charge. Démarrage à froid difficile : préchauffage ou groupe de parc.
- **Chaud** (> 40 °C) : un peu plus de capacité mais vieillissement accéléré, autodécharge, risque d'**emballement thermique** (surtout lithium).
- **Plage idéale** : +15 à +30 °C.
- **Batterie seule** (plus aucune génératrice) : autonomie **limitée, 30 min à 2 h** selon la charge. On ne garde que l'**essential bus**, on prévoit un **déroutement** (la QRH donne la durée).

## Le danger des batteries lithium
- **Menace principale** : l'**emballement thermique** → feu, dégazage, explosion.
- **Facteurs** : le **nombre** de batteries (avion + appareils des passagers), la **température**, l'**état physique** (choc, perforation, écrasement → court-circuit interne), la **charge** (surcharge, charge rapide, chargeur défectueux).
- **Propagation** : un élément surchauffe et déclenche ses voisins.
- **Confinement** : boîtier en acier inoxydable ou titane, isolation thermique (sacs, boîtes anti-feu), évacuation des gaz vers l'extérieur, parfois un extincteur.
- **En vol** : impossible de **larguer** la batterie, fumées toxiques en cabine, accès difficile, dommages possibles à la structure pressurisée.

## Produire du continu
- **Vocabulaire** : **génératrice DC** (sort du continu) ; **alternateur DC** (produit de l'alternatif redressé en interne par diodes) ; **génératrice AC** ; **démarreur-génératrice** ; alternateur à aimant permanent (auto-excité).
- **Génératrice** : une bobine tourne dans un champ → une tension **alternative** est induite (Faraday) → le **collecteur + balais** la redresse mécaniquement → continu **pulsé**. L'alternateur DC redresse par **diodes** : plus lisse.
- **Régulateur de tension** : la tension varie avec le régime et la charge ; il agit sur le **courant d'excitation** (inducteur). Plus d'excitation = champ plus fort = tension plus haute. Bus tenu entre **26 et 30 V** (28 V nominal).
- **Protection contre le courant inverse** (diode ou relais) : sans elle, quand la génératrice ne produit plus, la batterie se vide dedans et la fait **tourner en moteur**. Obligatoire.
- **Démarreur-génératrice** : moteur au démarrage (500 à 1 500 A), génératrice ensuite. Gain de masse ; petits jets, turbopropulseurs, APU.

## Produire de l'alternatif
- **Alternateur triphasé sans balais** (standard) : une petite **excitatrice** sur le même arbre produit de l'alternatif, redressé par des **diodes tournantes**, qui alimente l'inducteur du rotor ; le **stator fixe** sort 3 phases à 120° : **115/200 V 400 Hz**. Pas de balais : fiable, pas d'usure, pas d'étincelle.
- La **GCU** règle la tension par le courant d'excitation.
- **f (Hz) = tr/min × nombre de pôles / 120**. Exemples : 4 pôles à 12 000 tr/min = 400 Hz ; 12 pôles à 4 000 tr/min = 400 Hz. Donc, pour un 400 Hz fixe, l'alternateur doit tourner à **vitesse constante**.
- **Fréquence sauvage** (frequency wild, ATR 72) : entraîné directement, sans CSD → 300 à 800 Hz. Simple et léger ; bon pour le dégivrage, le chauffage, les petits moteurs ; **pas pour les calculateurs**.
- **Entraînement** : moteur (direct ou par CSD/IDG), APU, **RAT** (ultime secours), moteur hydraulique (rare).

## CSD, IDG et convertisseurs
- **CSD** (entraînement à vitesse constante, hydromécanique : pompe et moteur variables) : régime moteur variable en entrée, vitesse **fixe** en sortie (400 Hz).
- **IDG = CSD + alternateur** en un seul bloc, plus léger et compact. Standard sur les gros avions.
- **Surveillé** : température et pression d'huile, niveau, vitesse de sortie (fréquence), état de désaccouplement. **Désaccouplement automatique** si surchauffe ou pression basse.
- **Désaccouplement en vol = définitif** : réaccouplement **au sol** seulement. Le bus passe sur une autre source.
- **Circuit d'huile propre**, séparé du moteur : une fuite d'IDG peut **ressembler à une fuite d'huile moteur**.
- **Transformateur** : change la **tension** alternative **sans changer la fréquence** (induction mutuelle, sans pièce mobile) : 200 V → 115 V ou 26 V.
- **TRU** (transfo-redresseur) : 115/200 V AC → **28 V DC**. Principale source de continu, 2 ou 3 en parallèle.
- **Onduleur statique** : 28 V DC → **115 V AC** monophasé 400 Hz, en **secours**.

## !Les pièges
- Ni-Cd : **1,2 V** par élément, **24** éléments pour 28 V.
- Série = **tension** ; parallèle = **capacité**.
- **TRU** : AC → DC. **Onduleur** : DC → AC.
- Le transformateur change la tension, **pas la fréquence**.
- IDG déconnecté en vol : **on ne le récupère pas** avant le sol.
- La fréquence dépend du **régime** : sans CSD, elle varie (frequency wild).

## ?Questions d'exam
- Quels sont les rôles de la batterie de bord ? Cite les types utilisés.
- Combien d'éléments Ni-Cd faut-il pour 28 V ? Pourquoi la tension de charge est-elle plus élevée ?
- Définis la capacité. Quel est l'effet de la température ? Quelle autonomie reste-t-il sur batterie seule ?
- Quels sont les risques des batteries lithium et comment contient-on un emballement thermique ?
- Explique le fonctionnement d'une génératrice continue, du régulateur de tension et de la protection contre le courant inverse.
- Décris l'alternateur triphasé sans balais. Donne la relation entre fréquence, régime et nombre de pôles.
- Rôle du CSD et de l'IDG ? Que se passe-t-il après un désaccouplement en vol ?
- Rôle du transformateur, du TRU et de l'onduleur statique.

@@ distribution
## Les barres (bus)
- **Barre** (busbar) : le point central du réseau. Elle **reçoit** le courant de toutes les sources (génératrices, batteries, groupe de parc) et le **distribue** aux consommateurs à travers leurs disjoncteurs. Elle permet de coupler des sources et de basculer automatiquement.

| Bus | Alimentation | Usage |
| --- | --- | --- |
| **AC** | 115/200 V 400 Hz triphasé | Fortes charges |
| **DC** | 28 V | Avionique, éclairage, commandes |
| **Essential** | Sources normales + secours | Systèmes essentiels |
| **Emergency** | Batterie ou RAT | Instruments vitaux |
| **Battery bus** | Directement la batterie, toujours sous tension | — |
| **Hot / ground bus** | Toujours relié à la batterie, utilisé au sol | Entretien, servicing |

Les bus sont séparés pour la redondance et les priorités.

## Masse commune et sources
- **La structure sert de masse commune** (retour du courant) : moins de fils, donc moins de masse.
- Conséquence : **la métallisation est vitale**. Toutes les pièces au même potentiel, tresses aux jonctions (aile-fuselage). Mauvaise métallisation = parasites, corrosion, fausses alarmes.
- **Groupe de parc** : 115/200 V 400 Hz ou 28 V DC, au sol, moteurs et APU arrêtés.
- **Priorité des sources** : **au sol** : parc > APU > génératrices moteur ; **en vol** : génératrices moteur > APU > RAT > batterie. Le transfert est automatique et évite de coupler des sources différentes.

## Partage, délestage, pannes
- **Partage de charge** (load sharing) : plusieurs génératrices se partagent la charge à parts égales, via les GCU.
- **Délestage** (load shedding) : on coupe automatiquement ou à la main les **non-essentiels** quand la puissance manque (offices, divertissement) pour garder l'essential bus.
- **Panne de source** (génératrice, TRU, APU) : la source est perdue, on **transfère** vers une autre (bus tie), avec parfois du délestage. **Récupérable.**
- **Panne de barre** (court-circuit sur la barre, disjoncteur ouvert) : **tous les consommateurs de cette barre** sont perdus, la barre est isolée (BUS FAULT). **Plus grave.**

## Les réseaux continus
- **Monomoteur CS-23** : batterie (par un relais) et alternateur (par son régulateur) sur une ou deux barres. Perte de l'alternateur → **batterie seule, temps limité**. Certains, comme le SR20, ont 2 batteries, 2 alternateurs et plusieurs barres.
- **Bimoteur CS-23** (exemple DA42) : une génératrice et une barre par moteur ; un **bus tie** les relie si besoin ; batterie + barre de secours. Une génératrice en panne → l'autre alimente les deux côtés. Les deux en panne → batterie seule.
- **CS-25** : le continu vient des **TRU** branchés sur l'alternatif ; barres DC gauche et droite + essential + emergency ; batterie + onduleur statique pour l'alternatif de secours. Un TRU en panne → les autres prennent le relais.
- **Consommateurs DC** : avionique, navigation, calculateurs de commandes de vol, détection feu, éclairage, pompes de secours, anti-skid, réchauffage des sondes, vannes carburant et hydrauliques, charge batterie. Les systèmes critiques sont souvent alimentés en AC **et** en DC.

## Les réseaux alternatifs
- **Séparé** (split) : côtés gauche et droit indépendants, ils peuvent être déphasés. Simple, pas de synchronisation, mais **pas de secours automatique** si un côté tombe.
- **Parallèle** : les génératrices sont couplées sur une barre commune. Partage de charge, transfert automatique, mais il faut **synchroniser** et protéger. C'est le standard CS-25.
- **Transferts** : au démarrage, l'APU puis les génératrices moteur prennent le relais. Une génératrice en panne → le bus tie se ferme, l'autre alimente tout. Perte de tout l'AC normal → **RAT** + essential AC + onduleur. Transfert en moins de 50 ms.
- **Conditions de couplage** (vérifiées par la GCU) : **tension égale** (à quelques % près), **fréquence égale** (±0,1 Hz), **même ordre des phases**, **déphasage proche de zéro** (< 10 à 20°). Sinon, courants de circulation énormes.
- **Puissance apparente** en **VA** : VA = U × I (monophasé) ou √3 × U × I (triphasé). Les génératrices sont données en **kVA** (ex. 90 kVA). Puissance réelle (W) = VA × facteur de puissance.
- **Consommateurs AC** : pompes (carburant, hydrauliques), ventilateurs, feux extérieurs, pare-brise chauffant.

## Les moteurs électriques
- **Rôle** : transformer l'énergie électrique en **énergie mécanique** (rotation ou mouvement linéaire) : pompes carburant et hydrauliques, ventilateurs, vérins (trims, parfois volets), démarreur. C'est la fonction inverse de la génératrice.
- **Même construction** (rotor + stator + champs) : un courant dans les bobines fait tourner (moteur) ; faire tourner les bobines dans un champ produit du courant (génératrice). D'où le **démarreur-génératrice**.
- **Couple** : interaction entre le champ du stator (fixe) et celui du rotor ; il augmente avec la **tension** et le **courant**.
- **Démarrage** : petits moteurs (CS-23) = la batterie suffit, mais **2 à 3 essais** max (batterie vide, démarreur qui chauffe) ; gros réacteurs (CS-25) = couple énorme, **batterie insuffisante** : il faut un **groupe de parc ou l'APU**.
- **Rotor bloqué** (roulement grippé, corps étranger) : le moteur reste alimenté, courant **5 à 10 fois** le normal → bobinages qui chauffent, isolant qui fond, court-circuit, **feu**. Le disjoncteur doit sauter vite.
- **Emballement** (perte de la charge sur l'arbre) : le moteur accélère sans contrôle → survitesse, roulements et arbre cassés, rotor qui se désintègre. Le **courant et le couple baissent**.

## !Les pièges
- Priorité **au sol** : parc d'abord ; **en vol** : génératrices moteur d'abord.
- Panne de **barre** = plus grave qu'une panne de **source**.
- Couplage : tension, fréquence, **ordre des phases** et **phase** identiques.
- Puissance des génératrices en **kVA**, pas en kW.
- Rotor bloqué = courant **très élevé** ; emballement = courant **en baisse**.
- Gros réacteur : la batterie seule **ne suffit pas** à le démarrer.

## ?Questions d'exam
- Qu'est-ce qu'une barre ? Cite les différents types de bus.
- Pourquoi la structure sert-elle de masse commune, et quelle conséquence pour la métallisation ?
- Donne l'ordre de priorité des sources au sol et en vol.
- Différencie partage de charge et délestage, panne de source et panne de barre.
- Décris le réseau continu d'un monomoteur, d'un bimoteur CS-23 et d'un avion CS-25.
- Compare les réseaux alternatifs séparé et parallèle. Quelles conditions faut-il pour coupler deux alternateurs ?
- Que se passe-t-il si le rotor d'un moteur électrique se bloque ? Et s'il s'emballe ?
