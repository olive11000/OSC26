@@ quatretemps
## Les grandeurs du moteur
- **Régime** (tr/min) : nombre de tours du vilebrequin par minute. Trait rouge = maximum ; arc vert = utilisation continue ; arcs jaune ou rouge = temps limité. Le régime seul **ne dit pas** la puissance.
- **Couple** (N·m ou lb·ft) : la force de rotation sur le vilebrequin. Un gros couple permet d'accélérer ou de porter une charge à bas régime ; il est maximal à régime moyen. Il peut limiter le réducteur d'hélice.
- **Puissance = couple × régime** (ch ou kW). Le pic de puissance arrive à un régime **plus haut** que le pic de couple. Elle dépend aussi de la MAP, de l'air, de l'âge du moteur.

## La pression d'admission (MAP)
- **MAP** = pression **absolue** dans le collecteur d'admission, **après le papillon**. Unité : pouces de mercure (inHg) ou hPa.
- **Faible MAP** = faible puissance (ralenti, descente). **Forte MAP** = pleine puissance (décollage, montée). On règle la puissance avec la MAP sur un moteur non suralimenté.
- **Moteur arrêté**, la MAP indique la **pression ambiante** (~30 inHg au niveau de la mer).
- **Moteur atmosphérique** : on perd **environ 1 inHg par 1 000 ft** à manette fixe, car l'air se raréfie.
- **MAP + régime = puissance réelle**.

## Consommation et volumes
- **Consommation spécifique** (SFC) : le carburant consommé par unité de puissance et par heure (lb/ch/h ou kg/kW/h). Plus elle est basse, plus le moteur est efficace. Essence 0,45 à 0,55 lb/ch/h ; diesel 0,35 à 0,45. Elle est **meilleure vers 65 à 75 %** de puissance.
- **Cylindrée** (volume balayé) : volume parcouru par le piston du PMB au PMH.
- **Volume mort** : ce qui reste dans la chambre au PMH.
- **Volume total** = cylindrée + volume mort.
- **Taux de compression = volume total / volume mort**. Essence 7:1 à 11:1 ; diesel 14:1 à 22:1. Plus il est élevé, **meilleur est le rendement thermique**.

**Exemple** : cylindrée 900 cm³, volume mort 100 cm³ → volume total 1 000 cm³ → taux = 1 000 / 100 = **10:1**.

## Le cycle à 4 temps
Le moteur transforme l'énergie chimique (air + carburant) en chaleur, puis en rotation du vilebrequin. Un cycle = 4 courses du piston = **2 tours de vilebrequin (720°)**. Combustion **intermittente**, à **volume constant** ; rendement thermique ≈ **30 %**.

| Temps | Piston | Soupapes | Vilebrequin |
| --- | --- | --- | --- |
| **1. Admission** | PMH → PMB | Admission **ouverte** | 0 → 180° |
| **2. Compression** | PMB → PMH | **Les deux fermées** | 180 → 360° |
| **3. Combustion-détente** | PMH → PMB | Fermées ; étincelle près du PMH | 360 → 540° : **le seul temps moteur** |
| **4. Échappement** | PMB → PMH | Échappement **ouverte** | 540 → 720° |

À l'admission, la pression dans le cylindre est **inférieure** à la pression atmosphérique : le mélange est aspiré.

## Les pièces du moteur
- **Carter** : le bâti, qui porte le vilebrequin.
- **Vilebrequin** : transforme le mouvement **linéaire** des pistons en **rotation**.
- **Bielle** : relie le piston au vilebrequin. **Axe de piston** : relie le piston à la bielle.
- **Piston** : comprime le mélange et transmet la force. **Segments** : assurent l'**étanchéité** de la chambre et **contrôlent l'huile**.
- **Cylindre** : le tube où coulisse le piston. **Culasse** : contient la chambre de combustion et les soupapes.
- **Soupapes** d'admission et d'échappement ; **ressorts** qui les referment.
- **Arbre à cames** : commande l'ouverture des soupapes ; il tourne **à la moitié du régime** du vilebrequin (entraîné par pignon, chaîne ou courroie).
- **Tiges de culbuteurs** (transmettent le mouvement de la came) et **culbuteurs** (pivotent pour ouvrir la soupape).
- **Paliers** : réduisent le frottement.

## Les architectures
| Type | Avantages | Inconvénients |
| --- | --- | --- |
| **À plat** (boxer : Lycoming O-320, IO-360, IO-540 ; Continental IO-550), le plus courant | Très bien équilibré (peu de vibrations), **CG bas**, peu haut, cylindres bien refroidis | Large ; cylindres arrière moins accessibles ; long vilebrequin sur les gros modèles |
| **En ligne** | Simple, petite surface frontale, accessible | CG haut (ou graissage complexe s'il est inversé), plus de vibrations, très long au-delà de 5 à 6 cylindres |
| **En étoile** | Très bien refroidi (tout dans le souffle de l'hélice), gros couple à bas régime, court | Diamètre énorme (traînée), distribution complexe, vibrations ; presque disparu |

## Deux temps et diesel
- **Deux temps** : 1 tour (360°) = 1 temps moteur. Meilleur rapport puissance/masse, simple (pas de soupapes ni d'arbre à cames), léger, pas cher. Mais consomme beaucoup, pollue (carburant et huile imbrûlés), **huile mélangée à l'essence** (graissage perdu). ULM, paramoteurs.
- **Diesel** (Austro AE300, Continental CD-155) : allumage **par compression**, au **Jet A-1**. Démarrage à froid avec des **bougies de préchauffage**. **Pas de givrage carburateur** (injection directe). Souvent **turbocompressé**. Moins puissant qu'un moteur essence de même cylindrée.
- **Émissions** : essence = surtout CO et hydrocarbures ; diesel = surtout suies et NOx.

## !Les pièges
- **2 tours** de vilebrequin par cycle, pas 4.
- Pendant la **compression**, les **deux** soupapes sont fermées.
- L'arbre à cames tourne **deux fois moins vite** que le vilebrequin.
- Taux de compression = **total / mort**, pas cylindrée / mort.
- Puissance = couple × **régime**.
- Moteur arrêté, la MAP montre la **pression ambiante**, pas zéro.

## ?Questions d'exam
- Définis régime, couple, puissance, MAP et consommation spécifique.
- Définis cylindrée, volume mort et taux de compression. Calcule le taux pour une cylindrée de 1 200 cm³ et un volume mort de 150 cm³.
- Décris les quatre temps : position du piston, des soupapes et angle du vilebrequin.
- Cite les pièces principales d'un moteur à pistons et leur rôle.
- Compare les moteurs à plat, en ligne et en étoile.
- Donne les avantages et les inconvénients du moteur deux temps et du diesel d'avion.

@@ carbu
## Carburants et indice d'octane
- **AVGAS 100LL** (bleue) : pour les moteurs à **allumage commandé**. Autres grades : UL91 et UL94 sans plomb, G100UL qui remplace le 100LL.
- **Jet A-1** : le **seul** carburant approuvé pour les **diesels d'avion** certifiés. Incolore, sans plomb, pas d'indice d'octane. Congélation ≤ −47 °C, point éclair ≥ 38 °C, densité 0,775 à 0,84 kg/L.
- **Indice d'octane** : la résistance du carburant à la **détonation**. On le mesure par comparaison avec un mélange d'iso-octane (100) et d'heptane (0). Plus il est haut, plus on peut **comprimer** sans détonation. 100LL ≈ 100.

## La détonation
- **C'est quoi** : une partie du mélange **explose** d'un coup, **avant l'arrivée du front de flamme** normal (après l'étincelle).
- **Causes** : taux de compression élevé, **MAP élevée**, cylindres trop chauds (CHT), avance à l'allumage trop grande, carburant à indice d'octane trop bas, **mélange pauvre**, forte puissance + air d'admission chaud.
- **Effets** : ondes de choc (piston et gorges de segments abîmés), surchauffe (soupapes et pistons brûlés), perte de puissance, vibrations, piston percé.
- **Signes** : cliquetis (difficile à entendre au casque), moteur rugueux, perte de puissance, **CHT et température d'huile qui montent**, régime qui peut baisser, EGT qui monte puis baisse.
- **Que faire** : **réduire la puissance**, **enrichir**, réduire le régime, **prendre de la vitesse** pour refroidir.
- **Diesel** : la combustion par compression est normale ; un « cognement » vient d'un mauvais calage d'injection ou d'injecteurs usés.

## L'auto-allumage (pré-allumage)
- **C'est quoi** : la combustion démarre **avant l'étincelle**, à cause d'un **point chaud** dans la chambre. Elle pousse contre le piston qui **remonte**.
- **Causes** : bougie surchauffée, **calamine** (dépôts qui rougissent), soupape d'échappement ou tête de piston trop chaude, mélange pauvre, CHT élevée.
- **Effets** : pression énorme, bielles tordues, pistons et soupapes fondus. **Plus destructeur que la détonation.**
- **Diesel** : rare (c'est l'injection qui décide du moment), sauf injecteur défectueux.

## Eau, densité, vapour lock
- **Contrôle d'eau** : on purge les puisards (ailes, nourrice) avec un godet. **L'eau, plus lourde, est au fond** ; elle forme des gouttes ou un dépôt trouble. Eau incolore, AVGAS bleue, Jet A-1 incolore.
- **Quand purger** : avant le premier vol du jour, après un avitaillement (surtout d'origine inconnue), après un long stockage ou de la pluie, si les réservoirs sont restés à moitié vides (condensation).
- **Densité** : AVGAS 0,68 à 0,72 kg/L ; Jet A-1 0,775 à 0,84 kg/L. Elle sert à passer des litres aux kilos (masse et centrage, autonomie). Le carburant se dilate à la chaleur.
- **Volatilité** : essence **très volatile** (bonne vaporisation) ; Jet A-1 **peu volatil** (démarrage à froid difficile mais plus sûr). **Viscosité** : Jet A-1 plus visqueux (bon filtrage, réchauffage au froid).
- **Vapour lock** (essence seulement) : le carburant se vaporise dans les tuyaux, des bulles privent le moteur de carburant. Causes : carburant chaud + basse pression (altitude, jour chaud, faible débit). Parades : **pompe de gavage**, tuyaux isolés, recirculation.

## Les pompes à carburant
- **Pompe mécanique entraînée par le moteur** : elle fournit une pression continue au carburateur ou à l'injection (3 à 30 psi). Elle marche **tant que le moteur tourne**, **sans électricité**.
- La **pompe électrique** (boost) seule ne donne que 2 à 10 psi : parfois insuffisant à pleine puissance.
- **Pompe électrique ON** : au **décollage** et à l'**atterrissage** (si la pompe moteur lâche, le moteur continue), en **urgence**, contre le **vapour lock**.

## Le carburateur
- **Rôle** : doser l'air et le carburant dans le bon rapport, avec une compensation automatique selon la puissance, l'altitude et la température, et un réglage par le pilote (mixture).
- **Rapports air/carburant** : **puissance max 12,6:1** ; **stœchiométrique 14,7:1** ; **économie max 15,4:1**.
- **Carburateur à cuve** :
    1. niveau constant dans la cuve (**flotteur + pointeau**) ;
    2. le carburant passe par le **gicleur** principal jusqu'au **venturi** ;
    3. l'air accélère dans le venturi → la pression baisse (**Bernoulli**) ;
    4. la dépression aspire le carburant, qui est pulvérisé ;
    5. le mélange passe le **papillon** puis va aux cylindres.
- **Circuit de ralenti** : papillon fermé, la dépression du venturi ne suffit plus, un passage spécial alimente le moteur.
- **Tube d'émulsion** (air bleed) : de l'air entre par des trous et émulsionne le carburant → débit régulier sur toute la plage.
- **Altitude** : l'air est moins dense, mais le carburateur est réglé pour le niveau de la mer → le mélange **s'enrichit** → le pilote **appauvrit** (au pic d'EGT, puis un peu plus riche). Rares carburateurs à capsule anévroïde automatique.
- **Pompe de reprise** : un jet de carburant quand on ouvre vite les gaz (évite le trou à l'accélération). **Enrichisseur** : plus de carburant à pleine puissance.
- **Primer** : pompe à main qui envoie un peu de carburant pur aux cylindres pour le démarrage à froid.

## Le feu de carburateur
- **Causes** : fuite de carburant sous le moteur + échappement chaud + **retour de flamme** au démarrage ; **trop de primer** (carburant liquide dans l'admission).
- **Signes** : flammes ou fumée à l'entrée d'air ou à l'échappement, odeur de brûlé.
- **Actions** :
    1. mélange sur **étouffoir** ;
    2. robinet carburant **OFF** ;
    3. magnétos **OFF** ;
    4. manette des gaz **plein ouvert** (un maximum d'air) ;
    5. **continuer à lancer** le démarreur pour aspirer et souffler le feu.

## Le givrage carburateur
| Type | Température | Où |
| --- | --- | --- |
| **Évaporation du carburant** (le plus fréquent) | **+4 à +27 °C** si humidité > 50 % (parfois plus chaud) | Zone du gicleur |
| **Givrage du papillon** | 0 à +3 °C | Derrière le papillon presque fermé |
| **Givrage d'impact** | −10 à 0 °C, humidité visible | Prises d'air, filtres, papillon |

- **Causes** : l'**effet venturi** (l'air accélère et se refroidit de 15 à 30 °C) + l'**évaporation** du carburant qui prend de la chaleur.
- **Conditions à risque** : **0 à +25 °C**, humidité > 60 %, humidité visible (nuages, brouillard, bruine), **faible puissance** (descente, approche, attente).
- **Effets** : moins d'air → perte de puissance progressive, mélange **trop riche**, moteur rugueux, bougies encrassées, arrêt possible.
- **Signes** : hélice à **calage fixe** → **le régime baisse** ; hélice à **vitesse constante** → **la MAP baisse** (le régulateur tient le régime). CHT et EGT montent un peu puis baissent.

## Le réchauffage carburateur
- **Principe** : de l'air chaud pris autour de l'**échappement** remplace l'air froid.
- **Effet** : l'air chaud est moins dense → **mélange plus riche** et **puissance −10 à 20 %**.
- **S'il y a du givre** : la puissance **baisse d'abord** (air chaud + eau de fonte), puis **remonte** après 30 s à 2 min, quand la glace a fondu.
- **S'il n'y a pas de givre** : la puissance baisse et **reste basse**, sans remontée.
- C'est le test classique : **baisse puis remontée = il y avait du givre**.

## L'injection
- **Différence** : pas de venturi. L'air passe par le papillon, le carburant est injecté dans la tubulure ou le cylindre. **Pas de chute de température, peu ou pas de givrage** (sauf le givrage d'admission : on a un **air alternatif**).
- **Avantages** : un injecteur par cylindre, **mélange égal** partout (moteur plus doux, meilleur réglage de la mixture), réponse plus franche (remise de gaz), **fonctionne dans toutes les positions** (voltige : le carburateur à cuve exige un facteur de charge positif), meilleure consommation.
- **Inconvénients** : **démarrage à chaud difficile** (vapour lock, il faut parfois noyer le moteur) ; **sans pression de carburant, le moteur s'arrête** (pompe de secours obligatoire ; un carburateur peut marcher par gravité).
- **Air alternatif** : une porte qui prend de l'air chaud dans le capot si l'entrée normale est bouchée (givre, filtre colmaté, oiseau). Comme le réchauffage carbu : mélange plus riche, perte de puissance.

## !Les pièges
- **Détonation** = explosion **après** l'étincelle, avant le front de flamme. **Auto-allumage** = combustion **avant** l'étincelle, par un point chaud. L'auto-allumage est le **plus destructeur**.
- Contre la détonation : **enrichir** et réduire la puissance (pas appauvrir).
- Givrage carbu possible jusqu'à **+27 °C**, et même plus : ce n'est pas un problème de froid.
- Hélice à vitesse constante : le givrage se voit sur la **MAP**, pas sur le régime.
- Réchauffage carbu = mélange **plus riche** et moins de puissance.
- Feu de carbu : manette des gaz **ouverte** et on **continue à lancer**.

## ?Questions d'exam
- Qu'est-ce que l'indice d'octane ? Pourquoi permet-il un taux de compression plus élevé ?
- Différencie détonation et auto-allumage : causes, effets, signes et actions.
- Pourquoi et quand purge-t-on les réservoirs ? Qu'est-ce que le vapour lock ?
- Pourquoi un moteur a-t-il une pompe entraînée et une pompe électrique ? Quand utilise-t-on la pompe électrique ?
- Décris le fonctionnement d'un carburateur à cuve et ses dispositifs annexes.
- Cite les trois types de givrage carburateur, leurs causes et leurs signes. Que se passe-t-il quand on tire le réchauffage, avec et sans givre ?
- Compare carburateur et injection.

@@ melange
## Pourquoi refroidir
- **Protéger** les pièces critiques : culasses, pistons, soupapes, sièges d'échappement. Les tolérances mécaniques sont prévues pour une plage de température.
- **Éviter la détonation et l'auto-allumage** (chaleur → cliquetis → dégâts).
- **Garder l'huile** sous ~120 à 130 °C (au-delà, elle se dégrade et se carbonise).
- **Contrôler la CHT** (limites continues typiques 400 à 500 °F).
- **Allonger la vie du moteur** : la surchauffe déforme les culasses, brûle les soupapes, fissure les cylindres.

## Refroidissement par air ou par liquide
- **Par air** : grandes **ailettes** sur les cylindres et les culasses ; flux rapide de l'hélice ; **déflecteurs** (baffles) qui guident l'air sur les zones chaudes ; capot étanche avec entrées contrôlées ; **volets de capot** ; sonde CHT sur le cylindre le plus chaud (souvent le n° 3 ou 5).
- **Volets de capot** (cowl flaps) :
    - **ouverts** au décollage, en montée, par forte chaleur, au sol (forte puissance, faible vitesse) ;
    - **fermés** en croisière : moins de traînée et de bruit.
- **Par liquide** : eau + antigel, pompe entraînée par le moteur, radiateur ; un **thermostat** s'ouvre vers **75 à 90 °C** (fermé à froid pour chauffer vite). Température **stable et indépendante de la vitesse**, mais plus lourd, plus complexe, risque de fuite.

## La CHT
| Arc | Plage typique | Signification |
| --- | --- | --- |
| Vert | 150 à 400 °F (65 à 204 °C) | Normal |
| Jaune | 400 à 500 °F (204 à 260 °C) | Prudence |
| Rouge | ~500 à 550 °F (260 à 288 °C) | Maximum |

**CHT trop haute** : réduire la puissance, **enrichir**, ouvrir les volets de capot, prendre de la vitesse.

## L'huile : viscosité et grades
- **Viscosité** = résistance à l'écoulement. Trop épaisse : circule mal, freine, lubrifie tard. Trop fluide : le film casse, métal contre métal, usure. Il faut assez épais pour séparer les pièces, assez fluide pour circuler vite.
- **Température** : **chaud = plus fluide**, **froid = plus épais**. Démarrage à froid : lancement dur, huile lente, usure. Moteur très chaud : film fragile, paliers en danger.
- **Grades SAE** : monogrades **SAE 40, 50** (plus le chiffre est grand, plus elle est épaisse à 100 °C). Multigrades **15W-50**, 20W-50 : le chiffre + **W** (winter) = comportement **à froid** ; le second = viscosité **à chaud**.
- Toujours l'huile approuvée par le manuel, et **pas de mélange** de grades.

## Le circuit de lubrification
- **6 rôles** : réduire le **frottement**, **refroidir** (pistons, cylindres, paliers), **nettoyer** (calamine, limaille vers le filtre), aider l'**étanchéité** des segments, **protéger** de la corrosion, **amortir** les chocs.

| Carter | Principe | Usage |
| --- | --- | --- |
| **Humide** (wet sump) | Huile stockée **dans le carter** ; une pompe de pression ; retour par gravité | Simple et léger ; petits moteurs (voltige avec circuit spécial vol dos) |
| **Sec** (dry sump) | **Réservoir séparé** ; pompe de pression + **pompes de récupération plus grosses** qui renvoient l'huile au réservoir | Huile disponible dans **toutes les attitudes** ; gros moteurs, réacteurs |

- **Réservoir** : **puits chaud** (hot well, au fond : une petite quantité d'huile circule et chauffe vite), **désaérateur** (sépare l'air par centrifugation, évite la mousse), mise à l'air, volume d'expansion.
- **Composants** : clapet anti-retour (pas de retour d'huile moteur arrêté) ; pompe de pression + **soupape de sûreté** (60 à 90 psi) ; pompe de récupération ; filtres d'aspiration, **de pression** (principal, avec by-pass au démarrage et s'il se bouche), de retour ; **radiateur d'huile** avec vanne thermostatique (court-circuite le radiateur quand l'huile est froide, vise 80 à 90 °C) ; capteurs de pression et de température.

## Pression, température, quantité
- **Température haute** → huile plus fluide → **pression basse**.
- **Quantité basse** → la pompe se désamorce → **pression qui chute** → surchauffe.
- **Pression basse** → mauvais refroidissement et graissage → **température qui monte** vite.
- **Trop d'huile** → le vilebrequin barbote → **mousse** → pression instable, température haute. **Ne jamais trop remplir.**
- **Consommation d'huile** augmentée par : huile trop fluide, usure des cylindres et pistons, **segments usés ou collés**, huile chaude, forte puissance. Une hausse brutale = maintenance.
- **Niveau** : selon le manuel. Carter sec = parfois faire tourner le moteur avant ; carter humide = attendre un peu après l'arrêt. Le niveau monte quand l'huile est chaude.

## L'allumage par magnéto
- **Magnéto** : générateur haute tension **autonome**, sans batterie, entraîné par le moteur.
- **Séquence** :
    1. un aimant tourne → champ variable dans la bobine ;
    2. le **rupteur** ouvre brutalement le circuit **primaire** ;
    3. le champ s'effondre → **15 à 30 kV** induits dans le **secondaire** (beaucoup de spires) ;
    4. le **distributeur** envoie la haute tension à la bonne bougie ;
    5. l'étincelle saute et enflamme le mélange.
- **Condensateur** : branché sur le rupteur, il évite l'arc et rend l'étincelle plus franche.
- **Contacteur** L / R / BOTH / OFF : sur **OFF**, il **met le primaire à la masse**.
- **Double allumage** obligatoire : **redondance** + **2 étincelles par cylindre** (combustion plus rapide et complète, plus de puissance, moteur plus doux, meilleur démarrage).

## Aides au démarrage et essai magnétos
- À bas régime de lancement, la magnéto donne une étincelle faible. Aides :
    - **vibreur** (booster coil) : fait des coupures rapides et donne des **étincelles continues**, coupé quand le moteur tourne ;
    - **accouplement à impulsion** : un ressort retient l'arbre de la magnéto puis le **lâche près du PMH** → étincelle forte, **retardée** ;
    - vibreur à rupteur retardé : transforme le continu de la batterie en courant pulsé → gerbe d'étincelles.
- **Essai magnétos** (vers 1 700 à 2 000 tr/min) : L → noter la chute → BOTH → R → BOTH.
    - **Normal** : petite chute de chaque côté, max **125 à 175 tr/min**, écart G/D < 50 à 100 tr/min.
    - **Grosse chute ou moteur rugueux** : magnéto ou bougie défectueuse.
    - **Aucune chute** : une magnéto ne fonctionne pas réellement.
    - Sur **OFF**, le moteur doit s'arrêter. **S'il ne s'arrête pas = mauvaise mise à la masse : magnéto toujours « chaude », hélice dangereuse.**
- **Diesel** : pas de magnéto, c'est la chaleur de compression qui enflamme le carburant.

## Le mélange
- **Richesse** = masse d'air / masse de carburant.

| Mélange | Rapport | Par rapport au pic d'EGT |
| --- | --- | --- |
| **Puissance max** | 12,5 à 13:1 | Côté **riche** |
| **Stœchiométrique** | **14,7:1** | Au **pic** d'EGT |
| **Économie max** | 15,5 à 16,5:1 | Côté **pauvre** |

- **EGT** = température des gaz d'échappement. Elle varie avec la richesse : c'est **l'outil pour régler la mixture** (on appauvrit jusqu'au pic, puis on se place côté riche ou pauvre).
- **Pauvre** : économie, combustion propre ; mais **CHT plus haute**, risque de **détonation** à forte puissance, moteur rugueux si trop pauvre.
- **Riche** : **refroidit** (le carburant en trop absorbe la chaleur), **marge contre la détonation**, moteur doux ; mais consomme plus, encrasse les bougies, plus de CO et d'imbrûlés.
- **Consommation spécifique** : haute côté riche, presque minimale au pic, **minimale un peu côté pauvre**, puis elle remonte si c'est trop pauvre (la puissance s'effondre).
- **Diesel** : pas de papillon, l'air entre librement ; la puissance se règle **par la quantité injectée** → **pas de commande de mélange**, une seule manette, pas de risque de détonation en appauvrissant.

## !Les pièges
- **Volets de capot ouverts** au décollage et en montée, fermés en croisière.
- Huile **chaude** → pression **basse**. **Trop d'huile** → mousse.
- Pompes de **récupération** plus grosses que la pompe de pression (l'huile de retour est chargée d'air).
- Essai magnétos : **aucune chute** = problème, pas un bon signe.
- Sur OFF, la magnéto est **mise à la masse** ; fil de masse coupé = moteur qui ne s'arrête pas.
- Le pic d'EGT est au mélange **stœchiométrique** ; la puissance max est **côté riche**.

## ?Questions d'exam
- Pourquoi refroidit-on un moteur à pistons ? Compare refroidissement par air et par liquide.
- Comment utilise-t-on les volets de capot ? Que faire si la CHT est trop haute ?
- Qu'est-ce que la viscosité ? Explique la signification d'une huile 15W-50.
- Cite les six rôles de l'huile. Compare carter humide et carter sec.
- Explique les liens entre pression, température et quantité d'huile.
- Décris le fonctionnement d'une magnéto. Pourquoi deux magnétos ?
- Décris l'essai magnétos et l'interprétation des résultats.
- Définis les mélanges de puissance max, stœchiométrique et d'économie max. Comment utilise-t-on l'EGT ?

@@ helice
## Les définitions
- **Hélice** : transforme la puissance (le couple) du moteur en traction.
- **Calage fixe** : angle des pales fixe (simple, léger). **Pas variable** : angle réglable en vol.
- **Vitesse constante** : l'angle s'ajuste **tout seul** pour garder le **régime choisi**.
- **Drapeau** : pales tournées vers ~90°, de profil : **traînée minimale** après une panne moteur.
- **Reverse** : au-delà, angle **négatif** → traction vers l'arrière (freinage).
- **Pas géométrique** : avance théorique par tour, sans glissement. **Recul** (slip) : écart entre pas géométrique et pas effectif.

## Le régulateur (governor)
- Un **régulateur à masselottes** (centrifuge) dose l'huile envoyée au moyeu.
- **Régime trop haut** → les masselottes s'écartent → **plus de pression d'huile** → **grand pas** → plus de charge → le régime **baisse**.
- **Régime trop bas** → moins de pression d'huile → la force centrifuge des pales ramène au **petit pas** → moins de charge → le régime **remonte**.
- **Simple effet** : l'huile sert à **diminuer** le pas ; sans huile, le moment de torsion centrifuge pousse les pales vers le **grand pas**. Simple et léger (avions légers).
- **Double effet** : l'huile agit **dans les deux sens** ; plus de pression, moyeu complexe, réponse plus rapide, plus de contrôle (gros avions, multimoteurs).

## Manettes et instruments
- Avec une hélice à vitesse constante : **la manette d'hélice règle le régime**, **la manette des gaz règle la puissance (MAP)**. Sans **manomètre de pression d'admission**, impossible de régler la puissance (le régime seul ne suffit plus).
- **Couplemètre** : mesure le couple transmis à l'hélice (en % ou N·m). Surtout sur les moteurs à réducteur et les turbopropulseurs. Il donne la **puissance réelle** et protège du **surcouple** (trait rouge).
- **Butée de petit pas / verrou centrifuge** : bloque les pales au **petit pas** à bas régime (arrêt, mise en drapeau) pour éviter traînée et survitesse au démarrage ; il se libère à haut régime.
- **Synchronisation** : toutes les hélices au **même régime** → moins de battements (vibrations, bruit). **Synchrophasage** : en plus, un **décalage angulaire** fixe entre les pales → encore moins de vibrations et de bruit en cabine.

## Drapeau, reverse, réducteur
- **Mise en drapeau automatique** : un capteur de **couple négatif** ou de **chute de pression d'huile** détecte la panne → une pompe ou un accumulateur envoie de l'huile haute pression → pales en drapeau.
- **Mise en drapeau manuelle** : manette d'hélice **tout en arrière au-delà du cran** + carburant coupé + allumage coupé.
- **Sortie du drapeau** : manette en avant, pression d'huile (accumulateur, pompe dédiée) + force centrifuge, aidée par le moulinet ou le démarreur. 10 à 60 s.
- **Reverse (plage bêta)** : pales à −10 à −20°, manette sous le ralenti sol ou manette dédiée. Un **contacteur train** l'interdit en vol (certains avions utilisent une partie de la plage bêta en vol comme aérofrein).
- **Réducteur** : un moteur rapide donne plus de puissance, mais l'hélice est efficace vers **2 000 à 2 700 tr/min** ; plus vite, les **bouts de pales deviennent supersoniques** (rendement en chute, bruit). Rapports 0,55 à 0,75. Régime hélice = régime moteur × rapport. Exemple du cours : 5 500 tr/min × 0,5 ≈ 2 750 tr/min.

## Utiliser l'hélice
- **Cyclage après le démarrage** : manette plein avant (grand régime), puis lentement tout en arrière (le régime baisse, la **pression d'huile monte**), puis plein avant. Il **purge l'air du moyeu** et vérifie le régulateur.
- **Basse vitesse** (décollage, montée) : manette plein avant → **petit pas**, régime haut → traction max.
- **La vitesse augmente** : le régulateur **augmente le pas** tout seul ; le **régime reste constant**.
- **Grande vitesse** : grand pas, régime toujours constant.
- **Survitesse** (gaz poussés d'un coup) : le régulateur passe au grand pas, la charge augmente, le régime revient.

## La puissance et l'air
- **Pression qui baisse** → air moins dense → moins d'oxygène → **~3 % de puissance en moins par 1 000 ft** (jusqu'à ~8 000 ft).
- **Contre-pression d'échappement** (échappement bouché ou trop long) → plus de travail de pompage, moins d'air frais → moins de puissance.
- **Température qui monte** → **~1 % de moins par 3 °C au-dessus d'ISA**. Essence : plus de risque de détonation, il faut enrichir. Diesel : la quantité injectée est limitée.
- **Altitude densité** (altitude pression corrigée de la température) : **le facteur le plus pénalisant**. Exemple : terrain à 2 000 ft par 30 °C → ~5 000 ft densité → 85 à 90 % de la puissance.
- **Humidité** : effet faible (1 à 3 %).
- **Classement** : 1. altitude densité ; 2. température ; 3. pression ; 4. contre-pression d'échappement ; 5. humidité.

## La suralimentation
- **Turbocompresseur** : une **turbine** entraînée par les gaz d'échappement fait tourner un **compresseur** sur le même arbre → MAP plus haute, puissance du niveau de la mer gardée en altitude.
- **Waste gate** : une vanne qui fait **contourner la turbine** par les gaz → elle règle la vitesse du turbo et évite la surpression. Elle se **ferme** quand on monte.
- **Altitude-boosted** (le plus courant) : MAP **constante jusqu'à l'altitude critique**, puis elle baisse. **Ground-boosted** (rare) : suralimentation max dès le sol, baisse immédiate avec l'altitude, beaucoup de chaleur.
- **Altitude critique** : l'altitude max où le turbo tient la MAP nominale ; au-dessus, waste gate **fermée**, la MAP baisse.
- **Intercooler** : refroidit l'air comprimé → plus dense (plus de puissance) et **moins de détonation**.
- **Temps de réponse** (turbo lag) : la turbine met du temps à accélérer → réponse lente puis à-coup.
- **Compresseur mécanique** (supercharger) : entraîné par le vilebrequin → **pas de temps de réponse**, bon à bas régime, mais il prend **10 à 30 %** de la puissance et perd en altitude. Le turbo récupère l'énergie perdue à l'échappement : meilleur rendement.

## Conduire le moteur
- **Augmenter la puissance** : **mélange enrichi d'abord, puis les gaz** (évite la détonation). Gestes souples (efforts de torsion sur le vilebrequin).
- **Réduire** : le diapo écrit aussi « mélange d'abord » ; la règle classique est **gaz, puis hélice, puis mélange**. À confirmer avec ton instructeur.
- **Puissance décollage** : la max autorisée, limitée en temps (souvent **5 min**) ; plein gaz, plein riche, régime max. **Puissance max continue** : sans limite de temps, 75 à 85 % de la puissance décollage.
- **Grand froid** : huile épaisse, batterie faible, mauvaise vaporisation, Jet A-1 visqueux → lancement lent, étincelle faible. Parades : préchauffage, GPU, primer, mélange riche, hélice petit pas.
- **FADEC** : une seule manette. Il gère débit, avance à l'allumage, régulateur d'hélice, mélange et protections (survitesse, surpression, surchauffe). **Plus de manette de mélange ni de magnétos.** Double canal, alimentations redondantes (alternateurs à aimant permanent + batterie), capteurs doublés, vote → **une panne simple ne fait pas perdre le contrôle du moteur**.

## !Les pièges
- Régime trop haut → **grand pas**. La TAS monte → **le pas augmente**, le régime ne bouge pas.
- Simple effet : perte d'huile → **grand pas** (pas drapeau automatique).
- Hélice à vitesse constante : manette d'hélice = **régime**, manette des gaz = **MAP**.
- Synchrophasage = synchronisation **+ décalage angulaire**.
- Altitude critique : waste gate **fermée**.
- Le facteur le plus pénalisant est l'**altitude densité**.

## ?Questions d'exam
- Définis hélice à calage fixe, à vitesse constante, drapeau, reverse, pas géométrique et recul.
- Explique le fonctionnement du régulateur quand le régime est trop haut, puis trop bas.
- Compare une hélice à simple effet et à double effet.
- Pourquoi faut-il un manomètre de MAP avec une hélice à vitesse constante ? À quoi sert le couplemètre ?
- Comment se fait la mise en drapeau automatique ? À quoi sert le réducteur ?
- Quels paramètres font baisser la puissance d'un moteur atmosphérique ? Classe-les.
- Explique le turbocompresseur, la waste gate, l'altitude critique et l'intercooler. Compare turbo et compresseur mécanique.
- Qu'apporte un FADEC sur un moteur à pistons ?
