@@ conception
## Trois façons de concevoir une structure
| Philosophie | L'idée | À retenir |
| --- | --- | --- |
| **Safe-life** | La pièce a une **durée de vie fixée** (heures ou cycles). On la retire avant, même si elle a l'air neuve. | Basée sur des essais de fatigue. |
| **Fail-safe** | **Plusieurs chemins d'effort** : si une pièce casse, les autres reprennent la charge. | On peut finir le vol et atterrir après une rupture partielle. |
| **Damage-tolerant** | On **suppose que des fissures existent**. On les trouve aux inspections avant qu'elles deviennent dangereuses. | Mécanique de la rupture + inspections programmées. |

**Pour comprendre** : safe-life = « je jette avant que ça casse », fail-safe = « si ça casse, autre chose tient », damage-tolerant = « je sais que ça fissure, je surveille ».

## Redondance et certification
- **Redondance** : doubler ou tripler ce qui est vital, pour qu'une seule panne ne fasse pas tout tomber. Exemples : 2 génératrices, 3 circuits hydrauliques, 3 canaux de pilote automatique, 2 moteurs.
- La redondance est indispensable aux conceptions fail-safe et damage-tolerant.
- **Certification EASA** : tout avion est certifié selon des spécifications (conception, matériaux, fabrication).
    - **CS-23** : avions normaux, utilitaires, de voltige et commuter.
    - **CS-25** : gros avions (avions de transport).

## Contraintes et charges
- **Contrainte** (stress) = force interne par unité de surface. **Déformation** (strain) = ce qu'elle produit (allongement, flexion). Elles sont **toujours présentes**, même au parking : le poids comprime le train et fait fléchir les ailes.
- En vol, la portance, la traînée et l'inertie (rafales, facteur de charge) donnent des contraintes **plus fortes** qu'au sol.

| Charge | Exemple | Ce que fait le pilote |
| --- | --- | --- |
| **Statique** | Masse, carburant, au parking ou en croisière | Gère le carburant et la répartition du chargement |
| **Dynamique** | Rafale, impact à l'atterrissage, facteur de charge | Commandes douces, vitesse adaptée en turbulence |
| **Cyclique** | Cycles de pressurisation, manœuvres répétées | Peut casser **sous** la résistance maximale : c'est la fatigue |

**Zones à surveiller en prévol** : emplanture d'aile, bâti moteur, jonctions du fuselage, attaches des gouvernes. Indices : fissures dans la peinture, bosses, corrosion. Une lampe et un miroir aident.

## Corrosion
- **Corrosion** = oxydation du métal. Elle affaiblit la structure et crée des points de concentration de contraintes.
- **À la visite prévol** : poudre blanche ou verdâtre (aluminium), rouille (acier), piqûres, exfoliation (le métal se délite en feuillets).
- **Milieux qui l'accélèrent** : eau salée (bord de mer), humidité, pollution, liquides de dégivrage. Parades : laver l'avion, revêtements protecteurs, hangar.
- **Fluides corrosifs à bord** : acide de batterie, liquide hydraulique (Skydrol), additifs carburant. Une fuite donne une corrosion locale : chercher les taches.

## Fatigue
- **Fatigue** = une fissure naît puis grandit sous des **charges répétées**, jusqu'à la rupture : **amorçage → propagation → rupture**.
- Elle réduit la durée de vie utile, même si chaque charge est bien sous la résistance maximale.
- **Ce qui l'aggrave** :
    - la **corrosion**, qui amorce les fissures ;
    - le **nombre de cycles** (décollages, pressurisations) ;
    - les manœuvres à **fort facteur de charge** ;
    - un **niveau de contrainte** élevé ;
    - une **mauvaise maintenance**, qui laisse passer les dommages.
- Pré-vol et maintenance protègent contre les deux : corrosion et fatigue.

## Trois types de maintenance
| Type | Principe | Exemple |
| --- | --- | --- |
| **Hard-time** (fixed time) | Révision ou remplacement à **intervalle fixe**, quel que soit l'état | TBO d'un moteur |
| **On-condition** | Inspection périodique ; on intervient **si une mesure sort des limites** | Témoins d'usure des freins, pneus |
| **Condition monitoring** | **Analyse de tendance** des données, **sans limite fixe**, sans démontage | Analyse d'huile, vibrations, suivi moteur (EHM) |

Les programmes modernes combinent les trois. Hard-time est prudent et prévisible ; on-condition économise les pièces en bon état ; condition monitoring sert aux systèmes complexes.

## !Les pièges
- **On-condition** = une **mesure comparée à une limite**. **Condition monitoring** = une **tendance statistique**, sans limite. Ne les confonds pas.
- Une charge **cyclique** peut casser une pièce **sous** sa résistance maximale : c'est la définition de la fatigue.
- **Fail-safe** n'est pas « ça ne casse jamais » : c'est « si ça casse, autre chose tient ».
- **CS-25** = gros avions, **CS-23** = petits. Pas l'inverse.

## ?Questions d'exam
- Définis et compare les philosophies safe-life, fail-safe et damage-tolerant.
- Pourquoi la redondance est-elle indispensable sur un avion de transport ? Donne trois exemples.
- Cite les trois types de charges, avec un exemple et l'action du pilote pour chacune.
- Qu'est-ce que la fatigue ? Donne ses trois étapes et cinq facteurs qui l'aggravent.
- Comment reconnaît-on la corrosion en visite prévol ? Quels milieux et quels fluides l'accélèrent ?
- Compare la maintenance hard-time, on-condition et condition monitoring, avec un exemple chacune.

@@ structure
## Les assemblages
| Méthode | Où | Point faible ou contrôle |
| --- | --- | --- |
| **Rivetage** (permanent) | Peau sur cadre | Fissures autour des trous ; forte résistance au cisaillement |
| **Soudage** | Bâtis métalliques, bâti moteur | Fissures ; rare en structure primaire |
| **Boulonnage** (démontable) | Attaches moteur, timonerie | Couple de serrage, repères de couple, fils à freiner |
| **Goupillage** | Charnières, pivots | Reprend le cisaillement ; goupille fendue de sécurité |
| **Collage** | Composites, nid d'abeille | Répartit bien les efforts, léger ; mais **défauts cachés** |
| **Vissage** | Trappes, carénages | Se desserre aux vibrations, filetage arraché |

**En prévol** : fixation manquante ou desserrée, jeu (on secoue), corrosion, fissures, traces de fuite, fil à freiner ou goupille absents.

## Les matériaux composites
- **Principe** : une **matrice** (résine) + un **renfort** (fibres). La résistance est **anisotrope** : on oriente les fibres dans le sens des efforts.
- **Fibres** : carbone (résistance et rigidité), verre (pas cher, isolant), Kevlar ou aramide (résistance aux chocs). **Résines** : époxy, polyester.
- **Avantages sur les alliages** : meilleur rapport résistance/masse, résistance orientable, rigidité comparable, excellente tenue à la **fatigue** et à la **corrosion**.
- **Inconvénients** : mauvaise **conductivité** électrique (foudre : on ajoute un grillage métallique), **coût**, **dégâts internes invisibles** (délaminage : il faut un contrôle non destructif, par ultrasons).
- On choisit selon la charge, la masse, l'environnement, le coût : alliages d'aluminium (fuselage), titane (zones chaudes), acier (train), composites (ailes).

## Aile haute ou basse, empennage classique ou en T
| Configuration | Avantages | Inconvénients |
| --- | --- | --- |
| **Aile haute** | Garde au sol de l'hélice, stabilité (effet dièdre), fuselage dégagé | CG plus haut, structure plus complexe |
| **Aile basse** | CG bas, accès facile, train simple, effet de sol | Risque de toucher le sol avec l'hélice, traînée d'interférence |
| **Empennage bas ou médian** | Structure simple ; médian = hors du souffle moteur | — |
| **Empennage en T** | Aéro propre, meilleur contrôle en tangage, effet de plaque sur la dérive | **Super-décrochage** (deep stall), dérive plus chargée, maintenance difficile |

## Les pièces de l'aile
- **Longeron** : la poutre principale, qui reprend **flexion et cisaillement**. L'**âme** (plaque verticale) prend le cisaillement ; les **semelles** (haut et bas) prennent traction et compression.
- **Nervure** : garde la **forme du profil**, transmet les efforts de la peau au longeron, cloisonne les réservoirs.
- **Lisse** (stringer) : raidisseur dans le sens de l'envergure, qui empêche la peau de **flamber**.
- **Revêtement** : prend cisaillement et torsion, et donne la surface aérodynamique. Avec les lisses : peau travaillante.
- **Caisson de torsion** : la boîte fermée longerons + nervures + peau, qui **résiste à la torsion** et contient souvent le **carburant**.

## Le flottement (flutter)
- **C'est quoi** : un couplage **aéroélastique flexion + torsion**. Quand la fréquence propre de l'aile ou d'une gouverne entre en **résonance** avec les forces aérodynamiques, l'oscillation s'amplifie. Il dépend de la **vitesse** et peut détruire l'aile en quelques secondes.
- **Les parades** :
    - des **masses** placées le long de la corde et de l'envergure (moteurs, carburant, **masses d'équilibrage des gouvernes**), pour décaler le centre de gravité et découpler les modes ;
    - une bonne **rigidité en torsion**, pour monter la fréquence propre ; un peu de souplesse en flexion absorbe l'énergie ;
    - l'**équilibrage du carburant**, pour éviter une masse dissymétrique.
- **Charges dissymétriques** : panne moteur sur bimoteur, glissade → gros efforts sur la dérive. Le pilote peut surcharger la structure avec trop de palonnier ou trop de vitesse.

## Le fuselage
- **Monocoque** : la peau porte tout. **Semi-monocoque** (le plus courant) : peau + structure interne.
- **Pièces** : cadres (forme), cloisons (compartiments, étanchéité), lisses et longerons (rigidité dans la longueur), doublures (renforts), plancher, **cloison pare-feu** (sépare le moteur).
- **Pressurisation** : traction **circonférentielle** dans la peau (comme un ballon) + effort longitudinal sur les cloisons → **fatigue cyclique** à chaque vol.
- **Sections** : circulaire = la meilleure en pression ; double bulle = plus de plancher ; ovale ; rectangulaire = cargo, angles très contraints, non pressurisée.
- **Portes « plug »** : plus grandes que leur ouverture, la pression les plaque sur leur cadre.
- **Atterrissage dur** sur la roue avant : forte flexion du fuselage. **Tail strike** : cloison arrière abîmée, fuite de pressurisation.

## Pare-brise et plancher
- **Pare-brise** : plusieurs couches (structurale, chauffante, antigivre). Le chauffage évite les fissures et le givre. Vue directe, claire et sans distorsion exigée (CS 25.773).
- **Ventilation du plancher** : la soute est pressurisée comme la cabine.
- **Panneaux blow-out** : en décompression, ils s'ouvrent tout seuls pour **égaliser la pression** entre cabine et soute. Sans eux, le plancher pourrait s'effondrer (et couper les câbles de commandes qui passent dessous).

## Les masses limites
| Masse | Définition | Pourquoi cette limite |
| --- | --- | --- |
| **MRM** (rampe) | Max pour rouler, carburant de mise en route compris | La plus élevée au sol |
| **MTOM** (décollage) | Max au lâcher des freins | Structure + performances |
| **MZFM** (sans carburant) | Max sans carburant utilisable | Le carburant dans l'aile **soulage la flexion** : sans lui, l'emplanture est la plus chargée |
| **MLM** (atterrissage) | Max à l'impact | Limite d'absorption d'énergie, plus basse que la MTOM |

**Pour comprendre la MZFM** : la portance tire l'aile vers le haut, le carburant dans l'aile pèse vers le bas au même endroit. Plus il y a de charge dans le fuselage et moins il y a de carburant dans les ailes, plus l'emplanture fléchit.

**Ordre** : MRM ≥ MTOM ≥ MLM. Exemple célèbre de fatigue + corrosion : Aloha Airlines 243 (1988), une partie du toit arrachée en vol.

## !Les pièges
- La **nervure** donne la forme ; c'est la **lisse** qui empêche le flambage de la peau.
- **Âme** du longeron = cisaillement ; **semelles** = traction/compression.
- La MZFM protège **l'emplanture de l'aile** (flexion), pas le train.
- Les composites résistent **bien** à la fatigue et à la corrosion ; leur problème, ce sont les **dégâts cachés**, la **foudre** et le **coût**.
- Empennage en T = risque de **super-décrochage** (deep stall).

## ?Questions d'exam
- Cite les méthodes d'assemblage et le point faible ou le contrôle de chacune.
- Qu'est-ce qu'un matériau composite ? Donne ses avantages et ses inconvénients face aux alliages.
- Décris le rôle du longeron, de la nervure, de la lisse, du revêtement et du caisson de torsion.
- Explique le flottement et les trois familles de contre-mesures.
- Pourquoi la section circulaire est-elle la meilleure pour la pressurisation ? À quoi servent les panneaux blow-out ?
- Définis MRM, MTOM, MZFM et MLM. Pourquoi existe-t-il une masse maximale sans carburant ?

@@ feu
## Détecteur de fumée optique
- **Principe** (effet Tyndall) : une LED infrarouge et une photodiode sont placées **en angle**. En air propre, la lumière passe tout droit et **n'atteint pas** le récepteur. Quand la fumée entre, les particules **diffusent** la lumière vers le récepteur → alarme.
- **Bon pour** : les grosses particules visibles, les **feux couvants** (câbles qui chauffent, isolants, batteries lithium). Stable dans les zones très ventilées (soutes, circuits de clim).
- **Limites** : plus lent sur un feu vif ; sensible à l'encrassement (poussière, lentille sale) → nettoyage et étalonnage.
- C'est le **standard dans les soutes**.

## Détecteur de fumée ionique
- **Principe** : un peu d'**américium 241** ionise l'air entre deux électrodes, un petit courant passe. La fumée **capte les ions**, ils bougent moins, **le courant chute** → alarme.
- **Bon pour** : les petites particules invisibles, les feux **rapides et chauds** (carburant, arcs électriques), les baies avioniques. Très sensible dès le début du feu.
- **Limite** : **fausses alarmes** avec la poussière, l'humidité, les vapeurs d'huile ou de liquide hydraulique.
- Les avions modernes utilisent des capteurs **doubles** (optique + ionique) ou **multicritères** (fumée + chaleur + CO) : moins de fausses alarmes, et les deux types de feu sont couverts.
- **Alarmes** : voyant SMOKE, message ECAM/EICAS avec le lieu (FWD CARGO SMOKE, LAV SMOKE), Master Caution ou Warning. **Test** avant chaque vol : bouton SMOKE TEST.

## Extinction incendie
- **Agent** : **Halon 1301** (ou HFC-125) sous pression. Il **casse la réaction chimique** de la combustion. Avantage : très rapide, abîme peu les équipements.
- **Composants** : bouteilles, vannes à **cartouche pyrotechnique** (squib) ou électriques, tuyauterie, buses ou tubes percés, manocontacts de charge, boutons ENG 1 FIRE, ENG 2 FIRE, CARGO FIRE.
- **Règle** (CS 25.1195(c)) : **2 décharges par moteur** (deux bouteilles, ou une double), pour un **second tir** si le feu persiste ou reprend.
- **Soute** : décharge forte, puis **débit dosé de longue durée** pour garder peu d'oxygène longtemps.

## Détection incendie
- Les détecteurs mesurent la **chaleur**, pas la flamme.
- **Principes** : un matériau dont la **résistance ou la capacité** change beaucoup avec la chaleur ; ou un **gaz** qui se dilate et pousse un manocontact.
- **Technologies** : **bilame** (détecteur ponctuel, simple) ; **boucle continue** le long du moteur (type résistance ou type pression) ; **boucle à gaz** (rapide et fiable).
- **Double boucle A + B** : redondance + **moins de fausses alarmes**, car il faut souvent que les **deux** boucles voient le feu (logique ET). Une boucle en panne = simple caution ; les deux détectent = alarme feu.
- **Le détecteur idéal** : aucune fausse alarme, alerte rapide et localisée, indique la fin du feu et sa reprise, alerte continue pendant le feu, testable depuis le cockpit, robuste (huile, eau, vibrations, températures).
- **Alarme** : voyant FIRE rouge, message ECAM (ENG 1 FIRE), Master Warning, alarme sonore. **Test** : bouton FIRE TEST (boucles + circuits de squibs).

## Protection contre la pluie
| Moyen | Principe | Limite |
| --- | --- | --- |
| **Essuie-glaces** | Bras électriques ou hydrauliques, 2 vitesses, position parking | Peu efficaces en forte pluie et à grande vitesse : les balais décollent |
| **Liquide anti-pluie** | Jet de liquide siliconé : l'eau perle et s'envole | Consommable, à refaire ; vue déformée si on en met trop. **Très efficace à grande vitesse** |
| **Revêtement hydrophobe** | Couche transparente permanente sur la vitre | Passif, sans action du pilote, mais s'use : à refaire en maintenance |

## !Les pièges
- **Optique** = la lumière diffusée **arrive** au récepteur. **Ionique** = le courant **diminue**.
- L'optique est le **standard en soute** (feux couvants, batteries lithium) ; l'ionique donne des **fausses alarmes**.
- Les détecteurs incendie sentent la **chaleur**, pas les flammes.
- **2 décharges** par moteur, pas 1.
- Double boucle en logique **ET** : moins de fausses alarmes. Une seule boucle en panne ne déclenche qu'une caution.

## ?Questions d'exam
- Explique le principe du détecteur de fumée optique et du détecteur ionique. Lequel est préféré en soute, et pourquoi ?
- Décris un système d'extinction moteur : agent, composants, nombre de décharges exigé.
- Pourquoi utilise-t-on deux boucles de détection ? Quelle est la logique d'alarme ?
- Cite les qualités d'un système de détection incendie idéal.
- Compare les trois moyens de protection contre la pluie.
