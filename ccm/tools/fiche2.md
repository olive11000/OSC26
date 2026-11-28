@@ hydraulique
## Les lois de base
- **Hydromécanique** : l'étude des liquides au repos (hydrostatique) ou en mouvement (hydrodynamique). En avion, on utilise un liquide **incompressible** pour transmettre une puissance (freins, train, commandes).
- **Pression hydrostatique** : P = ρ × g × h. Elle augmente avec la profondeur et **ne dépend pas de la forme du récipient**.
- **Loi de Pascal** : une pression appliquée à un liquide enfermé se transmet **intégralement et dans toutes les directions**. C'est ce qui permet d'agir à distance.
- **P = F / A**, donc **F = P × A** et A = F / P. Unité : le pascal (Pa = N/m²).

## Multiplier une force
- Une **petite force** sur un **petit piston** crée une pression. Cette même pression sur un **grand piston** donne une **grande force**.
- **Contrepartie** : le volume de liquide est conservé. Le petit piston fait une longue course, le grand une **petite course**. Travail entrant = travail sortant (hors pertes) : on ne crée pas d'énergie.

**Exemple** : 100 N sur un piston de 1 cm² créent une pression de 100 N/cm². Sur un piston de 10 cm², cette même pression donne **1 000 N**. Mais si le petit piston descend de 10 cm, le grand ne monte que de **1 cm**.

## Le liquide hydraulique
- **Qualités recherchées** : stabilité thermique (pas de vernis ni de boues), non corrosif, **point éclair élevé (≈ 200 °C)**, faible volatilité, **viscosité stable** avec la température (pour l'étanchéité et le rendement des pompes).
- **Types** : **synthétique** (ester phosphate, **Skydrol**) ou **minéral** (dérivé du pétrole). **Jamais de mélange** : mousse, gel.
- Irritant pour la peau et les yeux : gants et lunettes. Incompressible à 3 000 psi et plus.

## Principes d'un circuit
- **Principe** : pompe → conduites → vérins → retour au réservoir.
- **Pression constante** (toujours pressurisé : commandes de vol, gros avions) **ou à la demande** (pressurisé seulement si besoin : train d'un petit avion, portes cargo ; économise la puissance).
- **Actif** (une pompe maintient la pression) **ou passif** (énergie stockée : ressort, gaz). Actif en principal, passif en secours.
- **Usages** : commandes de vol, train, freins, inverseurs de poussée.
- **Pressions** : basse ≤ 2 000 psi ; haute **3 000 psi** en général, 4 000 à 5 000 psi sur A350. La haute pression donne des vérins et des tuyaux plus petits, plus légers et plus réactifs, mais plus de contraintes, de fuites et des joints complexes.

## Les sources de pression
- **Pompes** : à **plateau inclinable** (cylindrée variable, garde une **pression constante**) ; à **engrenages** (cylindrée fixe, débit lié au régime).
- **Manuelle** (secours, lente et peu puissante) ; **moteur ou boîtier d'accessoires** (principale ; perdue si le moteur s'arrête) ; **électrique** (secours, petits circuits).
- **Pneumatique** (air prélevé) ou **RAT** (éolienne de secours : **dépend de la vitesse**).
- **PTU** (unité de transfert) : un circuit en entraîne un autre. Elle **transfère de la puissance, pas du liquide** : inutile si le circuit fuit.
- **APU** ou groupe de parc. **Pompe de demande** : pompe d'appoint pour les gros débits (rentrée du train, volets).
- **Redondance** : plusieurs sources, plusieurs circuits, plusieurs vérins par gouverne.

## Les composants
| Composant | Rôle |
| --- | --- |
| **Réservoir** | Stocke le liquide (pressurisé ou non) |
| **Accumulateur** | Stocke de la **pression**, amortit les à-coups, sert de secours |
| **Filtre** | Retient les particules ; **by-pass** s'il est colmaté |
| **Clapet anti-retour** | Passage dans **un seul sens**, comme une diode |
| **Soupape de sûreté** (relief) | Renvoie au réservoir en cas de surpression |
| **Restricteur** | Limite le débit, donc la **vitesse** du vérin |
| **Servovalve (EHSV)** | Commande électrique précise de position, vitesse, effort |
| **Vanne by-pass** | Chemin de contournement (isolement pour la maintenance) |
| **Valve navette** (shuttle) | Reçoit le liquide de l'**une de deux sources** |
| **Vanne coupe-feu** | Fusible thermique : se ferme à une température donnée |
| **Vanne de priorité** | Sert d'abord l'utilisateur prioritaire, le reste ensuite |
| **Fusible hydraulique** | Coupe une branche qui fuit au-delà d'un débit seuil, protège le reste |
| **Vérin** | Simple effet (retour par ressort) ou double effet |
| **Moteur hydraulique** | Transforme la pression en rotation (parfois réversible) |

Conduites de pression en acier ou titane ; conduites de retour basse pression, plus grosses. **Case drain** : récupère les fuites internes d'une pompe ou d'un moteur.

## Les pannes
- **Fuite ou niveau bas** : lente ou rapide ; surchauffe, perte des gros consommateurs, **risque de feu**. Surveillée par la **jauge de niveau** du réservoir.
- **Pression basse** : mouvements lents, séquence incomplète (le vérin manque de force). Surveillée par le **manomètre**.
- **Température haute** : liquide dégradé, composants abîmés, fuites, feu. Surveillée par le **thermomètre**.

## !Les pièges
- L'**accumulateur** stocke de la **pression** ; c'est le **réservoir** qui stocke le **liquide**.
- La **PTU** ne rajoute pas de liquide : elle ne sauve pas un circuit qui fuit.
- La **RAT** dépend de la vitesse.
- Pompe à **plateau** = pression constante ; pompe à **engrenages** = débit fixe lié au régime.
- Le grand piston gagne en **force** mais perd en **course** : le travail est conservé.

## ?Questions d'exam
- Énonce la loi de Pascal et explique comment un circuit hydraulique multiplie une force.
- Quelles qualités doit avoir un liquide hydraulique ? Pourquoi ne mélange-t-on jamais deux types ?
- Compare un circuit à pression constante et un circuit à la demande, un circuit actif et un circuit passif.
- Cite les sources de pression hydraulique et la limite de chacune (RAT, PTU, pompe manuelle).
- Donne le rôle de l'accumulateur, du clapet anti-retour, de la soupape de sûreté, de la valve navette et du fusible hydraulique.
- Quelles sont les pannes typiques et comment les surveille-t-on ?

@@ train
## Tricycle ou train classique
| Train | Avantages | Inconvénients |
| --- | --- | --- |
| **Tricycle** (roue avant) | Fuselage horizontal (chargement facile), bon freinage et contrôle au sol, stable à l'atterrissage, bonne visibilité, moins de traînée au début du roulage | Garde au sol de l'hélice réduite, plus de traînée en train fixe |
| **Classique** (roulette de queue) | Roulette légère (loin du CG, peu chargée), bon sur terrain sommaire, bonne garde d'hélice | **Capotage**, mauvaise visibilité vers l'avant au roulage, **cheval de bois** |

## Les pièces du train
- **Amortisseur oléopneumatique** : l'**huile** passe par un orifice et un pointeau dosé (elle amortit), l'**azote** se comprime (il fait ressort). L'énergie verticale de l'atterrissage devient de la **chaleur**.
- **Essieu, bogie** : porte une ou plusieurs roues (A380 : bogies à 4 roues).
- **Contrefiche** (avant-arrière), **contrefiche latérale** (qui se replie), **compas** (torsion links) : garde la roue alignée et empêche la tige de tourner.
- **Verrou bas** : la contrefiche passe **au-delà du point mort** (over-center) en fin de course du vérin. **Verrou haut** : crochet à ressort et vérin.
- **Trappes** : liées au train ou autonomes, à commande mécanique, hydraulique ou pneumatique.

## Séquences et voyants
- **Rentrée** : levier UP → trappes ouvertes → déverrouillage bas → le vérin rentre le train → trappes fermées.
- **Sortie** : levier DOWN → trappes ouvertes → déverrouillage haut → le train sort (chute ou vérin) → verrou bas → trappes fermées.
- **Voyants** : **3 verts** = sorti et verrouillé ; **rouge** = en transit ou non verrouillé ; **aucun voyant** = désaccord ou ampoule grillée.
- **Klaxon** si le train est rentré avec la puissance réduite (ou les volets sortis).
- **Au sol, contre une rentrée accidentelle** : goupilles à flamme rouge, **contacteur train comprimé** (WOW, squat switch) qui bloque le levier, verrou mécanique dans le vérin.
- **VLO** = vitesse max pour manœuvrer le train ; **VLE** = vitesse max train sorti. VLO ≤ VLE.

## Sortie de secours
1. **Déverrouiller** les verrous hauts (câble ou levier).
2. **Faire sortir** le train : **par gravité** (le plus courant), aidée par un ressort, ou par une bouteille d'**azote**, ou par une **manivelle** ou une pompe à main.
3. Le **verrou bas** s'enclenche tout seul.

Certains avions combinent deux méthodes.

## Direction au sol
- **Freinage différentiel + roulette folle** (avions légers) : simple et léger, mais lent et use freins et pneus.
- **Tiller** (petit volant) : **grand débattement (±70 à 85°)**, pour les virages serrés à basse vitesse.
- **Palonnier** : **petit débattement (±6 à 15°)**, pour le roulage rapide et le décollage ; au-delà de ~40 à 60 kt, la gouverne de direction prend le relais.
- **Centrage** de la roue avant **obligatoire avant la rentrée** (came, vérin de centrage, ressorts), sinon elle n'entre pas dans sa case.
- **Shimmy** : oscillation violente et rapide de la roue (flexion du pneu + inertie + jeu). Usure, fatigue, perte de contrôle. Parade : **amortisseur de shimmy** + compas.
- **Body steering** (A380, 747-8) : les bogies arrière s'orientent. Moins d'usure des pneus, virage plus serré (demi-tour sur 50 à 55 m) ; coupé au-dessus de ~20 kt.

## Roues et pneus
| Pneu | Avantages | Inconvénients |
| --- | --- | --- |
| **Tubeless** (standard) | Plus léger, dégonfle lentement en cas de crevaison, refroidit mieux | Exige une jante parfaitement étanche |
| **Diagonal** (nappes croisées à ~45°) | Robuste, flancs solides, résiste aux coupures | Lourd, chauffe, raide |
| **Radial** (nappes à 90° + ceintures) | Léger, chauffe moins, meilleure adhérence et usure, vitesse plus haute | Flancs vulnérables aux coupures |

- **Ply rating** = indice de résistance (charge), **pas** le nombre réel de nappes. **Rechapage** : nouvelle bande sur une carcasse usée.
- **Creep** : le pneu tourne lentement sur la jante → on vérifie l'alignement des repères peints.
- **Bouchons fusibles** dans la jante : ils fondent vers **180 à 300 °C** et dégonflent le pneu **avant qu'il explose** (après un décollage interrompu ou un freinage fort).
- **Vitesse limite du pneu** : la force centrifuge croît avec V². Radial ≈ 220 à 250 kt. On peut la dépasser au décollage **vent arrière** (vitesse sol plus grande).
- **Prévol** : coupures et hernies (corps étrangers, atterrissage dur), **méplats** (roue bloquée qui a ripé), gonflage, repères de creep, usure.

## Les freins
- **Freins à disques** : disques (rotors) entraînés par la roue, plaquettes fixes qui serrent. L'énergie cinétique devient de la **chaleur**. Plusieurs disques empilés.

| Matériau | Masse | Température max | Frottement | Usure et coût |
| --- | --- | --- | --- | --- |
| **Acier** | Lourd | ~800 à 1 000 °C | Élevé, constant | Correcte ; moins cher, simple |
| **Carbone** | 40 à 50 % plus léger | > 1 600 °C | Faible à froid, **augmente avec la température** | 2 à 4 fois meilleure ; cher, mauvais au roulage |

- **Énergie limite** des freins : au-delà, fading, feu, fusion des bouchons → c'est une limite du décollage interrompu.
- **Commande** : hydraulique non assistée (pédale → maître-cylindre, petits avions) ; assistée (servo) ; électrique (brake-by-wire).
- **Freinage des roues pendant la rentrée** : évite les vibrations et les projections dans la case.
- **Accumulateur de freins** : plusieurs freinages sans pompe. **Frein de parc** : garde la pression.
- **Témoins d'usure** : quand la tige ne dépasse plus, on change. **Température** surveillée : un **feu de freins chauds peut se déclarer longtemps après** l'arrêt.

## Anti-skid et autobrake
- **Anti-skid** : empêche le blocage des roues en relâchant la pression. Il compare chaque roue à une vitesse de référence (inertielle ou roue la plus rapide) et vise **10 à 15 % de glissement**, là où l'adhérence est **maximale**.
- **Protections** : **roue bloquée** (une roue presque arrêtée alors que les autres tournent → on relâche) ; **toucher des roues** (pas de freinage avant WOW + mise en rotation) ; **aquaplaning** (décélération trop faible malgré la pression → on relâche pour que la roue reprenne sa rotation).
- **Vitesse d'aquaplaning (kt) = 9 × √P**, P = pression du pneu en psi. Exemple : 100 psi → 90 kt ; 200 psi → ≈ 127 kt.
- **Autobrake** : freine seul après le toucher (ou en RTO) à **décélération constante**. **Impossible sans anti-skid**. Modes : OFF, ARMED, actif, désactivé par action sur les pédales.
- **A320neo** : **MAX** = décollage seulement (RTO, pression max) ; **MED** = 3 m/s² (piste courte ou mouillée) ; **LO** = 2 m/s². Freinage 2 s après la sortie des spoilers. Voyant DECEL = 80 % de la décélération visée ; il peut rester éteint sur piste glissante sans que l'autobrake soit en panne.
- Les inverseurs réduisent le travail des freins ; une piste glissante réduit la décélération obtenue.

## !Les pièges
- **3 verts** = sorti verrouillé ; **rouge** = transit ; **rien** = désaccord ou ampoule.
- Palonnier = **petit** débattement ; tiller = **grand** débattement.
- Le carbone freine **mieux à chaud** et mal au roulage.
- Ply rating ≠ nombre de plis.
- Le voyant DECEL éteint sur piste glissante ne veut pas dire que l'autobrake est en panne.
- La vitesse pneu peut être dépassée **vent arrière**.

## ?Questions d'exam
- Compare le train tricycle et le train classique.
- Décris le fonctionnement d'un amortisseur oléopneumatique et le rôle du compas.
- Donne les séquences de rentrée et de sortie du train, les voyants et les protections au sol.
- Comment fait-on une sortie de secours du train ?
- Qu'est-ce que le shimmy et comment l'évite-t-on ? Pourquoi centre-t-on la roue avant ?
- Compare freins acier et carbone. À quoi servent les bouchons fusibles ?
- Explique le principe de l'anti-skid et ses trois protections. Calcule la vitesse d'aquaplaning d'un pneu à 144 psi.

@@ commandes
## Primaires et secondaires
- **Commandes primaires** : tangage, roulis, lacet. Elles sont indispensables au vol.
    - **Profondeur** : tangage.
    - **Ailerons**, **spoilers de roulis**, **flaperons** : roulis.
    - **Direction** : lacet, et contre la poussée dissymétrique.
- **Commandes secondaires** : elles modifient portance, traînée ou trim, sans être indispensables au contrôle d'attitude : volets, becs, aérofreins, spoilers, trims.

## Manuelle, assistée, asservie
| Commande | Principe | Ressenti |
| --- | --- | --- |
| **Manuelle** | Câbles, bielles, guignols | **Réversible** : le pilote sent les efforts ; simple, léger, fiable ; trop dur à grande vitesse |
| **Assistée** (partiellement) | Servocommande hydraulique + liaison mécanique gardée | **Réversible** : pas besoin de sensation artificielle ; pilotage manuel possible si l'assistance lâche |
| **Totalement asservie** | Vérins hydrauliques ou électriques, sans retour | **Irréversible** : il faut une **sensation artificielle** |

- **Irréversibilité** : les efforts aérodynamiques ne remontent pas au manche (transmission à sens unique), ce qui protège aussi du flutter.
- **Q-feel** : effort au manche proportionnel à la **pression dynamique q**, donc à la vitesse → évite la sur-commande à grande vitesse.
- **Trims en commandes asservies** : plan horizontal réglable (**THS**) par vérin à vis ; les trims de direction et d'ailerons **déplacent le neutre de l'unité de sensation**. Pas besoin de tab aérodynamique.

## Sécurités des commandes primaires
- **Composants** : vérins, servovalves, câbles (sensibles au mou et à la tension), câblage, capteurs de position.
- **Redondance** : 2 à 4 circuits indépendants, gouvernes divisées (intérieure et extérieure), modes de secours.
- **Blocage** (câble cassé, corps étranger, fuite) : manches **découplables** (ATR 72 : découplage en tangage), câbles doublés, vérins séparés.
- **Blocages au sol** (gust locks) contre le vent ; voyants et flammes ; à retirer avant le vol.
- **Limiteur de direction** : réduit le débattement à grande vitesse pour protéger la dérive :
    - **rapport variable** : la gouverne bat moins, le palonnier garde sa course ;
    - **butées variables** : la course du palonnier est limitée ;
    - **blow-back** : l'effort aérodynamique limite lui-même le débattement.

## Les commandes secondaires
- **Volets** (bord de fuite) : plus de courbure, plus de portance. **Becs** (bord d'attaque) : retardent le décrochage, autorisent une incidence plus forte.
- **Aérofreins** : traînée en descente. **Spoilers en vol** : aident le roulis + traînée. **Spoilers sol** : détruisent la portance au toucher.
- **Trims** : tabs sur les gouvernes, ou plan horizontal réglable entier (THS).
- **Commande** : hydraulique (le plus courant), pneumatique, électrique, mécanique, ou par l'écoulement (becs automatiques). Souvent irréversible, plus lente que les primaires.
- **Frein mécanique** sur moteur hydraulique : bloque le vérin à vis sans pression (les volets ne glissent pas).
- **VFE** = vitesse max volets sortis, une par cran.
- **Load relief** : au-delà de VFE + marge, les volets **remontent** d'un cran tout seuls.
- **Protection dissymétrie** : capteurs sur l'arbre de transmission ; si les volets sortent de façon inégale, le système **se fige** (sinon embardée en roulis et torsion de structure).
- **Becs automatiques** : sortent seuls à forte incidence (ressort ou capteur d'incidence).
- **Blow-back** : à grande vitesse, l'effort aéro dépasse celui du vérin et la surface rentre un peu. Protection naturelle.

## Les commandes électriques (FBW)
- **Chaîne** : manche ou mini-manche → capteurs → **calculateurs** → vérins → gouvernes, avec un retour des capteurs (anémométrie, centrale inertielle, positions) en **boucle fermée**.
- **Avantages** : moins de travail (trim automatique, stabilité augmentée), **protection du domaine de vol** (décrochage, facteur de charge, assiette, inclinaison), gain de masse, permet un avion **instable** (moins de traînée, moins de carburant).
- **Irréversible** : sensation artificielle par ressorts dans le mini-manche.

| Loi | Protections | Charge pilote |
| --- | --- | --- |
| **Normale** | Toutes | La plus faible |
| **Alternate** | Partielles (par exemple plus de protection contre le décrochage), stabilité en partie gardée | Plus forte |
| **Directe** | Aucune : le manche commande la gouverne proportionnellement | Maximale, dernier recours |

- Passage en loi dégradée = alerte ECAM/EICAS ; risque de sortir du domaine de vol.

## Mini-manches, calculateurs, capteurs
- **Double action** sur les mini-manches : les ordres sont **additionnés** (avec limite) + annonce « **DUAL INPUT** ».
- **Bouton de priorité** : annule l'autre mini-manche + annonce « **PRIORITY LEFT / RIGHT** ».
- **Calculateurs dissemblables** (matériels et logiciels différents) : un même bug ne touche pas tout ; logique de vote.
- **Capteurs critiques au moins triplés** (incidence, vitesse, attitude), indépendants physiquement et électriquement ; le vote élimine le capteur faux.
- **Plusieurs gouvernes par axe** : le contrôle reste possible si un vérin lâche, et les efforts sont répartis.

## !Les pièges
- Volets, becs et trims sont **secondaires**.
- **Assistée** = réversible, pas besoin de sensation artificielle. **Asservie** = irréversible, sensation artificielle obligatoire.
- Le **load relief** rentre les volets ; il ne les bloque pas.
- En **loi directe**, il n'y a **plus aucune protection**.
- Double action = ordres **additionnés**, pas annulés.

## ?Questions d'exam
- Définis commandes primaires et secondaires et cite les gouvernes de chaque axe.
- Compare commandes manuelles, assistées et asservies. Pourquoi une sensation artificielle est-elle nécessaire ?
- Comment fonctionne le trim sur une commande asservie ?
- Cite les protections des commandes secondaires (load relief, dissymétrie, becs automatiques, blow-back).
- Décris la chaîne d'une commande électrique et ses avantages.
- Compare les lois normale, alternate et directe.
- Pourquoi utilise-t-on des calculateurs dissemblables et des capteurs triplés ?

@@ pressu
## L'air sur un avion à pistons
- **Compresseur** (pression positive) : gonfle les **boudins de dégivrage**, peut alimenter les gyros. Meilleur en altitude. Risque : **contamination des instruments par l'huile** de la pompe (les systèmes récents ont des pompes sèches).
- **Pompe à vide** (à palettes, aspiration) : alimente les **gyroscopes** (horizon, conservateur de cap) avec de l'air propre. **Moins efficace en altitude**.
- **Chauffage cabine** : par un **échangeur autour du pot d'échappement**, pas par l'air pneumatique. Risque : **monoxyde de carbone**.

## L'air prélevé sur un réacteur (bleed)
- **Sources** : étages **HP** et **IP** du compresseur, **APU**, groupe de parc.
- **Usages** : antigivrage de la voilure et des entrées d'air, **démarreur pneumatique**, pressurisation des réservoirs hydrauliques, pompes hydrauliques à air, **pressurisation et climatisation**.
- **Composants** : conduites, **vanne d'intercommunication** (cross-bleed), vanne de régulation de pression, vanne de prélèvement (choix HP ou IP selon N1), **prérefroidisseur** (échangeur avec l'air de soufflante), capteurs de pression et de température.
- **Règle** : **HP à bas régime**, **IP à fort régime** (pour limiter la pénalité sur le moteur).
- **Indications** : pression et température bleed, positions des vannes, page ECAM, alarmes OVERPRESS, BLEED LEAK.
- **Pannes** : surchauffe (feu), surpression (conduite qui éclate), pression basse (plus d'antigivrage), **fuite** → feu de compartiment, perte de pressurisation. Action : **isoler** le prélèvement.

## Le principe de la pressurisation
- **Trois paramètres** sont réglés : **ventilation** (air frais + recirculation), **température**, **pression** (altitude cabine compatible avec la physiologie).
- L'**humidité** n'est pas régulée : 2 à 15 % en croisière (air de prélèvement très sec), sauf humidification sur A350 et 787. Le séparateur d'eau du bootstrap retire l'eau condensée.
- **Principe** : le débit d'air **entrant** est à peu près **constant** ; la **vanne de décharge** (outflow valve) règle la sortie. **Pression cabine = équilibre entre ce qui entre et ce qui sort.** Fermer la vanne → la cabine « descend ».
- **Régulateur** (souvent 2, électroniques) : reçoit l'altitude avion, la vitesse verticale et **l'altitude du terrain de destination** ; il calcule un programme et commande le moteur de la vanne. Vario cabine typique : **500 à 1 000 ft/min**.
- **Soupapes de sécurité** (passives, indépendantes du régulateur) : **surpression** (ΔP trop fort, limite structurale) et **dépression** (cabine plus basse que l'extérieur : évite l'implosion).

## Les chiffres de la cabine
- **Altitude cabine** = altitude équivalente de la pression dans la cabine. **Vario cabine** = vitesse de variation de cette altitude.
- **ΔP = pression cabine − pression extérieure**. **Pressurisation au sol** : avant le décollage.
- Altitude cabine ≤ **8 000 ft** en croisière (6 000 à 8 000 ft) ; 10 000 ft en secours.
- **Alarme à 10 000 ft cabine** (Master Caution, alarme sonore, ECAM CAB ALT).
- **Masques passagers vers 14 000 ft**.
- **ΔP max** : 8,6 à 9,1 psi sur les gros jets. Le **plafond de l'avion** est limité par ce ΔP structural (ex. 8,6 psi → FL410 à 430).
- **Secours** : commande **manuelle** de la vanne de décharge (QRH), en surveillant altitude cabine et ΔP.
- **Indications** : altitude cabine, vario cabine, ΔP, température, état des packs, position de la vanne.

## Le cycle à air bootstrap
Le froid vient de la **détente** d'un air comprimé, sans fluide frigorigène (plus léger et fiable).
1. Air de prélèvement **chaud et comprimé**.
2. **Prérefroidisseur** (air de soufflante).
3. **Compresseur** de l'ACM : l'air est encore comprimé et réchauffé.
4. **Échangeur principal**, refroidi par l'air dynamique (ram air).
5. **Turbine** de l'ACM : **détente**, l'air devient très froid. La turbine entraîne le compresseur.
6. **Séparateur d'eau** (cyclone).
7. Vers la cabine.

**Pourquoi recomprimer l'air avant l'échangeur ?** Plus l'air est chaud, mieux l'échangeur évacue la chaleur vers l'air extérieur ; ensuite la détente dans la turbine fait chuter la température bien plus bas.

## Autour du pack
- **Ventilateur** du pack : fournit l'air de refroidissement au sol. **Volet d'air dynamique** : règle l'entrée d'air extérieur. **Vanne de débit** : règle l'air de prélèvement qui entre. Chaque pack est indépendant.
- **Vannes de mélange** : mélangent l'air froid du pack et l'air chaud. **Vannes d'isolement** : coupent un pack en panne.
- **Recirculation** : ~**50 %** de l'air, par des ventilateurs et des filtres HEPA (économie d'énergie, confort).
- **Hot trim air** : air chaud qui **contourne le pack**, injecté zone par zone (cockpit, cabine avant, cabine arrière) pour régler chaque température.
- **Clim électrique** (787, A350) : compresseurs électriques, **pas de prélèvement** → meilleure consommation, mais gros moteurs électriques et refroidissement plus complexes.

## !Les pièges
- La vanne de décharge est en **sortie** : le débit entrant reste à peu près constant.
- **Alarme 10 000 ft**, masques **14 000 ft**, croisière **≤ 8 000 ft**.
- Le froid du bootstrap vient de la **turbine** (détente), pas du compresseur.
- Hot trim air : il **contourne** le pack.
- HP à **bas** régime, IP à **fort** régime.
- La pompe à vide perd en efficacité en **altitude** ; le compresseur, lui, y est meilleur.

## ?Questions d'exam
- Compare compresseur et pompe à vide sur un avion à pistons. Quel est le risque du chauffage cabine ?
- Cite les sources et les usages de l'air prélevé. Pourquoi prélève-t-on en HP à bas régime ?
- Explique le principe de la pressurisation et le rôle du régulateur et des soupapes de sécurité.
- Définis altitude cabine, vario cabine et pression différentielle. Donne les valeurs limites et les alarmes.
- Décris les étapes du cycle bootstrap et explique d'où vient le froid.
- À quoi sert le hot trim air ? Quel est l'intérêt d'une climatisation électrique ?

@@ oxygivre
## L'oxygène équipage
Un régulateur **diluteur à la demande** relié à une bouteille haute pression (ou un générateur chimique). Objectif : éviter l'**hypoxie**.

| Mode | Fonction | Quand |
| --- | --- | --- |
| **Normal** (dilution) | Mélange air cabine + O₂ ; plus d'O₂ en montant | Altitude cabine > 10 000 ft ; le plus économe |
| **100 %** | O₂ pur | **Fumée**, ou au-dessus de ~25 000 à 30 000 ft cabine |
| **Emergency** | O₂ en **surpression** : poussé dans les poumons | Décompression rapide, très haute altitude cabine (35 000 à 40 000 ft) |

## L'oxygène portable et passagers
- **Cagoule anti-fumée (PBE)** : générateur chimique intégré, **15 à 20 min**, protège les yeux et les voies respiratoires.
- **Bouteille portable** : O₂ gazeux, à la demande ou en continu, **10 à 30 min** selon la taille et le débit.
- **Passagers, système fixe** : surtout des **générateurs chimiques** (chlorate de sodium + un peu de peroxyde de baryum et de perchlorate de potassium), **12 à 20 min**, **débit continu**. Une fois lancé, il ne s'arrête plus. Certains avions ont un système gazeux central.
- **Chute des masques** : automatique vers **14 000 ft cabine** (capsule anévroïde), ou manuelle (bouton MAN DROP). L'oxygène coule quand le passager **tire le masque**.
- **Danger** : **graisse ou huile + O₂ sous pression = inflammation spontanée**, voire explosion. Jamais de produit pétrolier : seulement des lubrifiants compatibles oxygène, et des procédures de nettoyage strictes.

## Antigivrage ou dégivrage
- **Antigivrage** : empêche la glace de se former (surface chaude ou glace qui n'adhère pas). Protection **continue**. Préféré sur les surfaces critiques.
- **Dégivrage** : laisse la glace se former, puis l'enlève par **cycles**.
- **Zones protégées** : bords d'attaque des ailes et des empennages, entrées d'air moteur, hélices, pare-brise, sondes (Pitot, statiques, incidence, TAT), antennes critiques.
- **Empennage non protégé** sur beaucoup de jets : il travaille dans un air plus « propre » derrière l'aile et l'avion est certifié ainsi. Risque : **décrochage de l'empennage**, surtout avec les volets sortis. Éviter les grosses variations de trim, la forte incidence et le givrage prolongé.

## Les systèmes de protection
| Système | Principe | Type | Usage |
| --- | --- | --- | --- |
| **Air chaud** | Air prélevé à 200 à 350 °C, réparti par des **tubes piccolo** au bord d'attaque | Anti (continu) | Jets : voilure, nacelles |
| **Électrique** | Résistances noyées : faible puissance continue = anti ; impulsions fortes = dé | Anti ou dé | Hélices, pare-brise, sondes, petits bords d'attaque |
| **Fluide** | Liquide glycolé par un bord d'attaque poreux ou une bague d'hélice : abaisse le point de congélation | Anti | Petits turbopropulseurs, aviation légère |
| **Boudins** | Caoutchouc gonflé puis dégonflé : la glace casse et part. Cycles de 6 à 60 s ; laisser 6 à 13 mm de glace | **Dé seulement** | Turbopropulseurs, avions à pistons |

- **Pare-brise** : désembuage par air chaud à l'intérieur sur la plupart des avions ; pare-brise **chauffant** (fils ou film conducteur) maintenu entre **18 et 35 °C**, alimenté en **AC triphasé 400 Hz**.
- **Limites** : air chaud = pénalité moteur (régime mini) ; boudins limités par la pompe ; fluide limité en quantité ; température mini et TAT max d'efficacité.

## L'exemple A320
- **Conditions givrantes** : OAT (au sol, au décollage) ou TAT (en vol) **≤ 10 °C** **+ humidité visible** (nuages, brouillard ≤ 1 mile, pluie, neige, grésil, cristaux de glace). Aussi au sol avec OAT ≤ 10 °C sur une piste avec neige, eau ou slush.
- **Antigivrage moteur** : ON dès qu'il y a ou qu'on prévoit des conditions givrantes, **sauf en montée et en croisière avec SAT < −40 °C**. Mais **toujours ON en descente** dans le givrage, même sous −40 °C.
- **Antigivrage voilure** : pour prévenir ou enlever la glace ; ON dès qu'il y a du givre sur l'**indicateur visuel** (entre les deux pare-brise) ou sur les essuie-glaces.

## Les détecteurs de givre
Ils détectent le **début** du givrage, pas une épaisseur. Placés à l'avant du fuselage ou au bord d'attaque.

| Détecteur | Principe |
| --- | --- |
| **Pneumatique** (Smiths) | Trous face au vent ; la glace les bouche → le capteur voit la statique → **chute de pression** → manocontact. Un réchauffeur dégage d'abord les trous et éteint l'alarme |
| **Rotatif** | Rotor tournant contre un couteau (jeu 0,05 mm). La glace bloque le jeu → **couple** qui fait pivoter le moteur sur ses silentblocs → microcontact |
| **À résonance** (Rosemount, le plus courant) | Sonde magnétostrictive vibrant vers **40 kHz**. La masse de glace **fait baisser la fréquence**. Un bref chauffage confirme que c'est de la glace et pas de l'eau (voyant ICE qui clignote) |

**L'alarme** : voyant ICE ambre, message ECAM, parfois un son, parfois l'activation automatique de l'antigivrage. Elle reste tant que la sonde n'est pas dégagée.

## !Les pièges
- Une alarme **ICE** veut dire « **de la glace se forme** », **pas** « la protection est en marche » : l'équipage doit agir.
- Les **boudins** font **seulement du dégivrage**.
- À résonance : la glace **baisse** la fréquence.
- Masques passagers : **débit continu**, générateur qui ne s'arrête plus. Masque équipage : **à la demande**.
- Mode **100 %** contre la **fumée** ; mode **Emergency** = surpression.
- A320 : sous −40 °C de SAT, l'antigivrage moteur n'est pas obligatoire en **montée et croisière**, mais il l'est **en descente**.

## ?Questions d'exam
- Décris les trois modes du masque équipage et leur usage.
- Comment fonctionne l'oxygène passagers ? Pourquoi la graisse est-elle interdite sur un circuit oxygène ?
- Différencie antigivrage et dégivrage. Quelles zones protège-t-on ? Pourquoi certains empennages ne le sont pas ?
- Compare les protections par air chaud, électrique, fluide et boudins.
- Donne la définition A320 des conditions givrantes et les règles d'usage de l'antigivrage moteur.
- Explique le principe des trois types de détecteurs de givre.

@@ carburant
## Les carburants
| Carburant | Point éclair | Congélation | Densité (kg/L) | Remarques |
| --- | --- | --- | --- | --- |
| **AVGAS 100LL** | ≈ −40 °C | ≈ −58 °C | 0,68 à 0,72 | Allumage commandé ; octane élevé contre le cliquetis ; risque de **vapour lock** |
| **MOGAS** | ≈ −45 à −38 °C | −50 à −60 °C | 0,73 à 0,77 | Seulement si approuvé ; éthanol corrosif, vapour lock, givrage carbu plus probable |
| **JET A** | ≥ 38 °C | ≤ −40 °C | 0,775 à 0,84 | Kérosène, surtout aux États-Unis |
| **JET A-1** | ≥ 38 °C | **≤ −47 °C** | 0,775 à 0,84 | Standard mondial ; additifs antistatique et anticorrosion ; aussi pour les **diesels** d'avion |
| **JET B** | ≈ −20 à −10 °C | ≤ −50 à −60 °C | ≈ 0,78 | 30 % essence + 70 % kérosène ; grand froid ; **très volatil** |

- **FSII** (DiEGME, Prist) : empêche les cristaux de glace de l'eau contenue dans le carburant ; 0,10 à 0,15 % en volume ; aussi antibactérien. **JP-8 = Jet A-1 + FSII**.
- **Jet A-1 dans un diesel** (Austro AE300, Continental CD-155) : peu volatil → démarrage à froid difficile.
- La **densité** sert à convertir litres et kilos (masse et centrage, autonomie).

## Le circuit carburant d'un avion léger
- **Missions** : stocker assez de carburant ; alimenter le moteur en carburant **propre et continu** dans toutes les attitudes ; permettre l'équilibrage ; indiquer la quantité ; éviter contamination et vapour lock ; permettre purge et prélèvement.
- **Composants** :
    - conduites rigides (alu) et flexibles ;
    - **pompe de gavage** électrique (boost) : pression positive vers la pompe moteur ; indispensable au démarrage, par temps chaud, en secours ;
    - clapets anti-retour, soupapes ; filtres (by-pass s'ils se bouchent) ;
    - **mise à l'air libre** : laisse entrer et sortir l'air (évite dépression et surpression) ;
    - **puisard** (point bas : eau et dépôts) et **purge** (contrôle d'eau quotidien par le pilote) ;
    - jauges (flotteur, capacitive, ultrasons) et sonde de température.
- **Alimentation par gravité** : réservoir au-dessus du moteur, sans pompe (aile haute). Simple et fiable.
- **Alimentation sous pression** : pompe de gavage + pompe moteur. Marche en altitude, par temps chaud, sur le dos ; mais dépend de l'électricité et de la mécanique.

## Réservoirs, cross-feed, carburant inutilisable
- **Réservoirs** : rigides (inspectables), **souples** (bladder, étanches ; mais des plis au fond peuvent piéger de l'eau et du carburant inutilisable), **structuraux** (l'aile elle-même : légers et efficaces).
- **Intercommunication** (cross-feed) : alimenter un moteur avec le réservoir **opposé**, pour équilibrer, en monomoteur, ou après une panne moteur. En général manuelle : vérifier la symétrie après.
- **Carburant inutilisable** : la quantité qui ne peut pas atteindre le moteur dans le pire cas (dans les puisards, les tuyaux, au-dessus de la crépine en montée forte). Donnée par le manuel de vol, **pas affichée par la jauge**, à retirer pour l'autonomie.
- **Surveillance** : quantité + **alarme niveau bas** (vers 30 à 60 min restantes, souvent par un capteur séparé) ; température (gel du Jet A-1, vapour lock) ; **débitmètre** (le massique est plus fiable que le volumique, car la densité varie).

## Le circuit carburant d'un avion à turbines
- **Missions** en plus : grandes quantités, avitaillement et vidange, **équilibrage** (réservoir de trim, cross-feed), alimentation de l'APU.
- **Pompes de gavage centrifuges** immergées (refroidies par le carburant), doublées par réservoir ; **vanne coupe-feu** sur la cloison pare-feu ; filtres BP et HP.
- **Réservoirs** : ailes (principaux), centre, saumons, **queue (trim tank, pour le centrage)**. **Cloisons anti-ballottement** avec clapets, pour garder le carburant aux points d'aspiration ; puisards, purges et pompes à jet qui aspirent l'eau ; mises à l'air libre avec réservoirs de surpression.
- **Jauges capacitives**, indication en **masse** (corrige la variation de densité). Une sonde en panne affiche **vide**.
- **Perte des pompes de gavage** : la pompe moteur cavite, risque d'**extinction en altitude** → **descendre**, réduire la puissance, gravité si possible. Alarme LOW FUEL PRESS.
- **Jaugeurs à tige magnétique** (drip sticks) sous l'aile : un flotteur aimanté, on lit la tige → vérifier les jauges au sol.
- **Vidange en vol** (dump) : seulement si la **MTOM dépasse largement la MLM** (long-courriers). Jusqu'à 2 à 3 t/min, au-dessus de 6 000 ft, loin des zones habitées, arrêt automatique à une masse préréglée.

## !Les pièges
- Point éclair : AVGAS **≈ −40 °C** (très inflammable), Jet A-1 **≥ 38 °C**.
- Jet A-1 gèle à **−47 °C**, Jet A à **−40 °C**.
- Le carburant inutilisable **n'est pas affiché** par la jauge.
- Jauge capacitive en panne = affiche **vide**.
- Perte des pompes de gavage → **descendre** (air plus dense, moins de cavitation).
- Le dump n'existe que si MTOM ≫ MLM.

## ?Questions d'exam
- Compare AVGAS, MOGAS, Jet A, Jet A-1 et Jet B (point éclair, congélation, densité, limites).
- Quelles sont les missions d'un circuit carburant ? Cite ses composants et leur rôle.
- Compare l'alimentation par gravité et sous pression.
- Qu'est-ce que le carburant inutilisable ? À quoi sert l'intercommunication ?
- Que se passe-t-il si les pompes de gavage tombent en panne en altitude, et que faut-il faire ?
- Quand un avion est-il équipé d'une vidange en vol ? Quelles précautions ?
