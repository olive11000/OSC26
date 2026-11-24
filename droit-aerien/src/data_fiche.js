export const FICHE = [
{
"code": "REG 01-03",
"name": "Règles de l'air",
"cards": [
{
"t": "L’essentiel",
"html": "<p>Les règles de l&#39;air viennent de l&#39;<strong>Annexe 2 OACI</strong>, reprise en Europe par <strong>SERA</strong>, et pour les militaires par le <strong>RCAM</strong>. Le <strong>commandant de bord</strong> en est responsable, qu&#39;il tienne les commandes ou non.</p>\n",
"kind": "info"
},
{
"t": "Cadre",
"html": "<ul><li><strong>Article 12 de la convention de Chicago</strong> : chaque État fait respecter les règles sur son territoire et à ses avions partout ailleurs. <strong>Au-dessus de la haute mer, ce sont les règles OACI qui s&#39;appliquent.</strong></li><li><strong>Espace souverain</strong> : territoire + <strong>eaux territoriales (12 NM)</strong>. La ZEE (200 NM) n&#39;a <strong>aucun effet</strong> sur les aéronefs.</li><li>Le commandant de bord : respecte les règles sauf si la sécurité impose l&#39;inverse ; avant le vol, connaît la météo, le carburant et les solutions de repli ; ne vole pas sous l&#39;effet d&#39;une substance psychoactive.</li><li>Sanctions : <strong>professionnelle</strong> (licence), <strong>pénale</strong> (prison, amende), <strong>militaire</strong> (disciplinaire).</li></ul>\n",
"kind": "info"
},
{
"t": "Règles de vol",
"html": "<ul><li><strong>CAG</strong> (Circulation Aérienne Générale) : <strong>VFR</strong> (dont VFR spécial, on top, de nuit) et <strong>IFR</strong>.</li><li><strong>CAM</strong> (Circulation Aérienne Militaire) : <strong>CAM V</strong>, CAM V spéciale, <strong>CAM I</strong>, <strong>CAM T</strong>.</li><li>Calages : <strong>CAG IFR + VFR = QNH</strong>. <strong>CAM V, I, T = QNH régional, ou QFE au départ selon le cas.</strong></li></ul>\n",
"kind": "info"
},
{
"t": "Hauteurs minimales",
"html": "<table><thead><tr><th></th><th>Hauteur</th></tr></thead><tbody><tr><td>VFR, cas général</td><td><strong>500 ft</strong> au-dessus du sol ou de l&#39;eau</td></tr><tr><td>VFR, zones peuplées (villes)</td><td><strong>1 000 ft</strong> au-dessus de l&#39;obstacle le plus haut dans un rayon de <strong>600 m</strong></td></tr><tr><td>IFR</td><td><strong>1 000 ft</strong> dans un rayon de <strong>8 km (5 NM)</strong></td></tr><tr><td>IFR, région montagneuse</td><td><strong>2 000 ft</strong> dans un rayon de 8 km</td></tr></tbody></table>\n<p>Région montagneuse : relief variant de <strong>± 3 000 ft dans un rayon de 10 NM</strong>. En France, des hauteurs plus fortes s&#39;appliquent selon l&#39;avion et ce qu&#39;on survole (voir la fiche VFR).</p>\n",
"kind": "info"
},
{
"t": "Zones réglementées",
"html": "<table><thead><tr><th>Zone</th><th>Règle</th></tr></thead><tbody><tr><td><strong>P</strong> (prohibée)</td><td>Survol <strong>interdit en permanence</strong> (sauf QRA)</td></tr><tr><td><strong>R</strong> (réglementée)</td><td>Transit possible <strong>avec autorisation</strong></td></tr><tr><td><strong>D</strong> (dangereuse)</td><td>Pénétration possible <strong>à vos risques</strong>, évitement fortement recommandé</td></tr><tr><td><strong>M</strong></td><td>Survol <strong>interdit aux avions militaires</strong></td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Vols particuliers",
"html": "<ul><li><strong>Voltige</strong> et <strong>vol en formation</strong> : seulement avec l&#39;accord de l&#39;organisme de contrôle.</li><li><strong>Formation</strong> : elle compte comme <strong>un seul avion</strong>, le leader est responsable de la séparation. Chaque avion reste à <strong>0,5 NM latéralement et 100 ft verticalement</strong> maximum du leader.</li><li>Drones et ballons : sous autorisation ATS.</li></ul>\n",
"kind": "info"
},
{
"t": "Prévention des abordages",
"html": "<ul><li>Distance minimale entre aéronefs : <strong>150 m</strong>, même en interception.</li><li><strong>Priorité à droite</strong>, et <strong>priorité à l&#39;avion dépassé</strong>.</li><li><strong>Face à face</strong> : chacun dégage <strong>à droite</strong>.</li><li><strong>Dépassement</strong> : on arrive par l&#39;arrière dans un secteur de moins de <strong>70°</strong> par rapport à son axe. L&#39;avion dépassé est prioritaire, on le dépasse par la droite.</li><li><strong>Ordre de priorité entre catégories</strong> (le premier cède à tous les suivants) : <strong>avion motorisé → dirigeable → planeur → ballon</strong>. L&#39;avion motorisé cède aussi aux <strong>remorquages</strong>.</li><li><strong>Atterrissage</strong> : 1) avion en détresse ou en urgence ; 2) avion en finale.</li><li>Au sol : arrêt au point d&#39;attente (barre d&#39;arrêt rouge), alignement seulement sur autorisation de la tour.</li><li><strong>Vol aux instruments d&#39;entraînement</strong> : double commande + pilote de sécurité qualifié en place avant, avec une vue dégagée.</li><li>Près d&#39;un aérodrome : écouter la tour, éviter le circuit ou contacter la tour, <strong>virages à gauche</strong> sauf instruction contraire, décollage et atterrissage <strong>face au vent</strong>.</li></ul>\n",
"kind": "info"
},
{
"t": "Plan de vol",
"html": "<table><thead><tr><th></th><th>Dépôt</th><th>Retard → modifier ou annuler</th></tr></thead><tbody><tr><td><strong>CAM</strong> (I, T, V)</td><td><strong>60 min</strong> avant le départ block</td><td>Valide 60 min après l&#39;heure prévue</td></tr><tr><td><strong>IFR</strong></td><td><strong>60 min</strong> avant EOBT, ou <strong>AFIL</strong> (en vol) <strong>10 min</strong> avant l&#39;entrée en espace contrôlé</td><td>Contrôlé : <strong>&gt; 30 min</strong>. Non contrôlé : <strong>&gt; 1 h</strong></td></tr><tr><td><strong>VFR (France)</strong></td><td><strong>30 min</strong> avant EOBT</td><td><strong>&gt; 1 h</strong></td></tr></tbody></table>\n<ul><li><strong>Plan de vol obligatoire</strong> (SERA) : tout vol contrôlé (IFR ou VFR en espace contrôlé), IFR en service consultatif, passage de frontière, nuit (sauf vol local), zones désignées.</li><li><strong>France, VFR</strong> : obligatoire au-dessus de la <strong>mer</strong>, en <strong>passage de frontière</strong> (pas d&#39;AFIL), en <strong>nuit</strong>, en <strong>région inhospitalière</strong>, et pour la coordination civil-militaire.</li><li><strong>Activation</strong> : par l&#39;organisme ATS au décollage, ou <strong>par le pilote</strong> s&#39;il part d&#39;un terrain sans ATS ni AFIS. Toute modification (niveau, route, destination) est signalée dès que possible.</li></ul>\n",
"kind": "info"
},
{
"t": "Signaux de détresse et d'urgence",
"html": "<table><thead><tr><th></th><th>Signaux</th></tr></thead><tbody><tr><td><strong>Détresse</strong></td><td>SOS (… — — — …), <strong>MAYDAY ×3</strong>, fusée rouge (avec ou sans parachute), transpondeur <strong>7700</strong></td></tr><tr><td><strong>Urgence</strong></td><td><strong>PAN PAN ×3</strong>, phares d&#39;atterrissage ou feux de navigation allumés puis éteints, XXX en morse</td></tr></tbody></table>\n<p><strong>Fréquences de détresse</strong> : <strong>121,5 MHz</strong> (VHF), <strong>243,0 MHz</strong> (UHF), <strong>2 182 kHz</strong> (HF maritime), <strong>406 MHz</strong> (balise ELT, SARSAT).</p>\n",
"kind": "info"
},
{
"t": "Signaux lumineux de la tour (OACI)",
"html": "<table><thead><tr><th>Signal</th><th>En vol</th><th>Au sol</th></tr></thead><tbody><tr><td><strong>Vert continu</strong></td><td>Autorisé à atterrir</td><td>Autorisé à décoller</td></tr><tr><td><strong>Rouge continu</strong></td><td>Cédez le passage, restez dans le circuit</td><td>Arrêtez</td></tr><tr><td><strong>Éclats verts</strong></td><td>Revenez pour atterrir</td><td>Autorisé à rouler</td></tr><tr><td><strong>Éclats rouges</strong></td><td>Aérodrome dangereux, n&#39;atterrissez pas</td><td>Dégagez l&#39;aire d&#39;atterrissage</td></tr><tr><td><strong>Éclats blancs</strong></td><td>Atterrissez ici et gagnez l&#39;aire de trafic</td><td>Retournez au point de départ</td></tr><tr><td><strong>Fusée rouge</strong></td><td>Quelles que soient les instructions précédentes, n&#39;atterrissez pas pour le moment</td><td>—</td></tr></tbody></table>\n<p><strong>Heure</strong> : <strong>UTC</strong>, à <strong>30 s</strong> près (à <strong>1 s</strong> près en liaison de données).</p>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li><strong>D</strong> ne veut pas dire interdite : on peut y entrer, à ses risques.</li><li><strong>M</strong> concerne seulement les <strong>militaires</strong>.</li><li>Retard de plan de vol : <strong>30 min si contrôlé, 1 h sinon</strong>.</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Que dit l'article 12 de la convention de Chicago ? Quelles règles s'appliquent au-dessus de la haute mer ?",
"Donnez les hauteurs minimales VFR et IFR, y compris en ville et en région montagneuse.",
"Définissez les zones P, R, D et M.",
"Règles de priorité : face à face, convergence, dépassement, catégories d'aéronefs, atterrissage.",
"Délais de dépôt d'un plan de vol IFR, VFR et CAM. Que se passe-t-il en cas de retard ?",
"Signaux et fréquences de détresse et d'urgence.",
"Signification des signaux lumineux en vol et au sol."
]
},
{
"code": "REG 04",
"name": "VFR",
"cards": [
{
"t": "L’essentiel",
"html": "<p>Le <strong>VFR</strong> se vole en <strong>VMC</strong> : une visibilité minimale et une distance minimale aux nuages. Il existe 4 formes : <strong>VFR</strong>, <strong>VFR de nuit</strong>, <strong>VFR on top</strong> et <strong>VFR spécial</strong>.</p>\n",
"kind": "info"
},
{
"t": "Plafond du VFR",
"html": "<ul><li>France : <strong>pas au-dessus du FL195</strong>. Jusqu&#39;au <strong>FL285</strong> avec une autorisation spéciale publiée à l&#39;AIP.</li><li><strong>Interdit</strong> en vol transsonique ou supersonique, en espace <strong>RVSM</strong>, et au-dessus du <strong>FL285</strong> en Europe.</li><li>Passer en IFR : déposer un plan de vol, puis demander et obtenir une clairance IFR (qualification IFR requise).</li></ul>\n",
"kind": "info"
},
{
"t": "Minima VMC (SERA)",
"html": "<table><thead><tr><th>Où</th><th>Visibilité</th><th>Distance aux nuages</th></tr></thead><tbody><tr><td><strong>Au-dessus du FL100</strong> (toutes classes)</td><td><strong>8 km</strong></td><td><strong>1 500 m</strong> horizontalement, <strong>1 000 ft (300 m)</strong> verticalement</td></tr><tr><td><strong>Sous le FL100</strong>, classes A à E</td><td><strong>5 km</strong></td><td><strong>1 500 m</strong> horizontalement, <strong>1 000 ft (300 m)</strong> verticalement</td></tr><tr><td>Classes <strong>F et G</strong>, au plus haut de <strong>3 000 ft AMSL ou 1 000 ft AGL</strong></td><td><strong>5 km</strong> (France : jusqu&#39;à <strong>1 500 m</strong> si IAS ≤ <strong>140 kt</strong>)</td><td><strong>Hors nuages et sol en vue</strong></td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Hauteurs minimales (SERA)",
"html": "<ul><li><strong>500 ft</strong> au-dessus du sol, de l&#39;eau ou de l&#39;obstacle le plus haut dans un rayon de <strong>150 m</strong>.</li><li>Villes et rassemblements : <strong>1 000 ft</strong> au-dessus de l&#39;obstacle le plus haut dans un rayon de <strong>600 m</strong>.</li><li>Entraînement à l&#39;atterrissage forcé : jusqu&#39;à <strong>150 ft (50 m)</strong>, en restant à plus de 150 m de toute personne ou véhicule.</li></ul>\n<p><strong>Hauteurs minimales en France</strong> (selon ce qu&#39;on survole)</p>\n<table><thead><tr><th>Survol</th><th>Monomoteur</th><th>Multimoteur, réacteur</th></tr></thead><tbody><tr><td>Autoroute</td><td>1 000 ft</td><td>3 300 ft</td></tr><tr><td>Ville de moins de 1 200 m de large</td><td>1 700 ft</td><td>3 300 ft</td></tr><tr><td>Ville de 1 200 à 3 600 m</td><td>3 300 ft</td><td>3 300 ft</td></tr><tr><td>Ville de plus de 3 600 m</td><td>5 000 ft</td><td>5 000 ft</td></tr><tr><td><strong>Paris (P23)</strong></td><td><strong>6 500 ft</strong></td><td><strong>6 500 ft</strong></td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Niveaux de croisière",
"html": "<ul><li>Au-dessus de <strong>3 000 ft AMSL ou AGL</strong> en espace non contrôlé, ou de l&#39;<strong>altitude de transition</strong> en espace contrôlé, le VFR vole en <strong>niveaux de vol</strong> selon la <strong>règle semi-circulaire</strong>.</li><li>Repère : de <strong>000 à 179°</strong>, niveaux <strong>impairs + 500</strong> (FL35, 55, 75…) ; de <strong>180 à 359°</strong>, niveaux <strong>pairs + 500</strong> (FL45, 65, 85…).</li></ul>\n",
"kind": "info"
},
{
"t": "Espaces et services",
"html": "<ul><li>Clairance et contact radio <strong>obligatoires en classes B, C, D</strong> et dans les circuits d&#39;aérodrome. <strong>Pas de classe B en France.</strong></li><li>3 services ATS : <strong>contrôle</strong>, <strong>information de vol</strong>, <strong>alerte</strong>.</p><ul><li>Contrôle : en B, séparation de tous ; en C, séparation des IFR et information de trafic aux VFR ; en D, information de trafic pour tous.</li><li>Information de vol : de B à G, selon le contact radio.</li><li>Alerte : selon le contact radio et le plan de vol.</li></ul>\n<p><strong>VFR spécial</strong> (dans une CTR, quand la visibilité est sous 5 km et le plafond sous 1 500 ft)</p>\n<ul><li>Visibilité mini <strong>1 500 m</strong>.</li><li><strong>Clairance obligatoire</strong>, plan de vol non obligatoire.</li><li>Routes publiées, <strong>de jour seulement</strong>.</li></ul>\n",
"kind": "info"
},
{
"t": "VFR de nuit (SERA)",
"html": "<ul><li>Contact radio bilatéral avec l&#39;ATS.</li><li><strong>Plafond ≥ 1 500 ft</strong>. Les visibilités réduites du VFR spécial ne s&#39;appliquent pas.</li><li>Sous <strong>3 000 ft AMSL ou 1 000 ft AGL</strong> (le plus haut), <strong>sol en vue</strong>.</li><li>Altitude minimale : <strong>2 000 ft</strong> au-dessus de l&#39;obstacle le plus haut dans un rayon de <strong>8 km</strong> en montagne, <strong>1 000 ft</strong> ailleurs.</li></ul>\n",
"kind": "info"
},
{
"t": "VFR de nuit en France (AIP)",
"html": "<table><thead><tr><th></th><th>Conditions</th></tr></thead><tbody><tr><td><strong>Vol local</strong> (dans la CTR ou à 12 km, 6,5 NM, du terrain)</td><td>VMC</td></tr><tr><td><strong>Autres vols</strong></td><td>Sol en vue, <strong>plafond ≥ 1 500 ft au-dessus du niveau de croisière</strong>, <strong>visibilité ≥ 8 km</strong></td></tr></tbody></table>\n<ul><li>Aérodromes autorisés, routes publiées.</li><li><strong>Plan de vol obligatoire pour un vol non local</strong>, déposé 30 min avant l&#39;EOBT (ou 30 min avant le coucher du soleil à destination).</li></ul>\n<p><strong>VFR on top (AIP France)</strong> : conditions météo selon la classe d&#39;espace, <strong>radio obligatoire</strong>, équipements de radionavigation. De nuit, au-dessus de 3 000 ft AMSL ou 1 000 ft AGL.</p>\n",
"kind": "info"
},
{
"t": "Vols particuliers",
"html": "<ul><li><strong>Passage de frontière</strong> : plan de vol obligatoire <strong>60 min avant l&#39;EOBT</strong>, avec le point de passage et l&#39;heure estimée. Contact radio.</li><li><strong>Survol maritime</strong> : plan de vol obligatoire 60 min avant, routes publiées, radio obligatoire, rester à une distance de la côte qui permette de la rejoindre en plané.</li></ul>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li>Classes F et G : la règle « hors nuages, sol en vue » ne vaut que <strong>sous 3 000 ft AMSL ou 1 000 ft AGL, le plus haut des deux</strong>. Au-dessus, ce sont les minima normaux.</li><li>En VFR de nuit, la visibilité ne descend <strong>jamais</strong> aux valeurs du VFR spécial.</li><li>VFR spécial : <strong>de jour seulement</strong>, et toujours avec clairance.</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Donnez les minima VMC au-dessus et en dessous du FL100, et en classes F et G près du sol.",
"Quel est le plafond du VFR en France ? Dans quels cas le VFR est-il interdit ?",
"Expliquez la règle semi-circulaire en VFR. À partir de quand s'applique-t-elle ?",
"Conditions du VFR spécial.",
"Conditions du VFR de nuit (SERA et France). Quand le plan de vol est-il obligatoire ?",
"Hauteurs minimales de survol en France : autoroute, villes, Paris."
]
},
{
"code": "REG 05",
"name": "IFR",
"cards": [
{
"t": "L’essentiel",
"html": "<p>L&#39;<strong>IFR</strong> permet de voler en <strong>IMC comme en VMC</strong>. Il faut un avion équipé des instruments adaptés et une <strong>qualification IR</strong>. Le contact radio avec l&#39;ATS est obligatoire, ainsi que le plan de vol.</p>\n",
"kind": "info"
},
{
"t": "Niveau minimal en espace non contrôlé",
"html": "<ul><li><strong>1 000 ft (300 m)</strong> au-dessus de l&#39;obstacle le plus haut dans un rayon de <strong>8 km</strong>.</li><li><strong>2 000 ft (600 m)</strong> en région montagneuse (± 3 000 ft dans un rayon de 10 NM).</li></ul>\n",
"kind": "info"
},
{
"t": "Choix du niveau",
"html": "<ul><li><strong>Non contrôlé</strong> : niveaux de vol (1013), sauf sous <strong>3 000 ft AMSL</strong> où l&#39;on vole en altitude (QNH). France : 3 000 ft AMSL ou 1 000 ft AGL.</li><li><strong>Contrôlé</strong> : niveaux de vol, sauf sous l&#39;<strong>altitude de transition</strong> (TA, jamais sous 3 000 ft ; France : jamais sous <strong>5 000 ft</strong>).</li><li><strong>Règle semi-circulaire IFR</strong> : de <strong>000 à 179°</strong>, niveaux <strong>impairs</strong> (FL50, 70, 90…) ; de <strong>180 à 359°</strong>, niveaux <strong>pairs</strong> (FL60, 80, 100…). Le VFR prend les mêmes niveaux + 500 ft.</li><li><strong>Séparation verticale</strong> : <strong>1 000 ft</strong> jusqu&#39;au FL290 ; <strong>2 000 ft au-dessus du FL290</strong> hors RVSM. En <strong>RVSM</strong>, <strong>1 000 ft entre le FL290 et le FL410</strong>.</li></ul>\n<p><strong>Passer d&#39;IFR à VFR</strong> : annoncer « <strong>CANCELLING MY IFR FLIGHT</strong> » à l&#39;ATS. Déposer un plan de vol VFR n&#39;est pas obligatoire.</p>\n",
"kind": "info"
},
{
"t": "Plan de vol IFR",
"html": "<ul><li>Dépôt <strong>1 h avant l&#39;EOBT</strong> (jusqu&#39;à <strong>3 h</strong> en zone Eurocontrol en cas de régulation). <strong>Jamais plus de 120 h (5 jours)</strong> avant.</li><li><strong>AFIL</strong> (déposé en vol) : activé en <strong>10 min</strong>, AFIL remplace l&#39;aérodrome de départ.</li><li>Activé et clôturé par l&#39;ATS. Sans ATS au départ ou à l&#39;arrivée, c&#39;est au <strong>commandant de bord</strong> de le faire, par radio avec un autre organisme ou par téléphone.</li><li><strong>Retard</strong> : vol contrôlé <strong>&gt; 30 min</strong>, ou non contrôlé <strong>&gt; 1 h</strong> → modifier, ou annuler et redéposer.</li><li><strong>Créneau (slot)</strong> Eurocontrol : décollage autorisé de <strong>CTOT − 5 min à CTOT + 10 min</strong> (fenêtre de 15 min).</li><li><strong>Modification</strong> par message <strong>CHG</strong>, sauf pour : aérodrome de départ ou de destination, indicatif, EOBT avancée, équipement RNAV. Dans ces cas, il faut un nouveau plan de vol.</li></ul>\n",
"kind": "info"
},
{
"t": "Services rendus à l'IFR",
"html": "<ul><li><strong>Contrôle</strong> : séparation IFR/IFR en classes <strong>A à E</strong>. Séparation IFR/VFR en <strong>B et C</strong>. Information de trafic IFR/VFR en <strong>D</strong>.</li><li><strong>Information de vol</strong> et <strong>alerte</strong> : tout le temps, grâce au contact radio et au plan de vol obligatoires.</li></ul>\n<p><strong>Autoprotection en VMC</strong> (le pilote assure lui-même sa séparation avec un autre avion)</p>\n<ul><li>Sur demande du pilote, avec <strong>clairance ATC</strong>.</li><li><strong>Classes D ou E</strong>, <strong>de jour</strong>, en <strong>VMC</strong>, <strong>en montée ou descente sous le FL100</strong>.</li><li><strong>Accord de l&#39;autre avion obligatoire</strong>.</li><li>L&#39;ATC reste responsable de l&#39;espacement avec les autres trafics.</li></ul>\n<p><strong>Approche à vue</strong> (à la demande du pilote ou proposée par l&#39;approche)</p>\n<ul><li>Le pilote a le <strong>terrain en vue</strong> et peut garder le <strong>sol en vue</strong>.</li><li>Il décide d&#39;atterrir selon sa propre estimation du plafond et de la visibilité.</li><li>De nuit, le plafond doit être au moins au niveau de la route suivie.</li><li><strong>Clairance obligatoire</strong> en espace contrôlé. L&#39;ATC garde l&#39;espacement avec les autres trafics.</li></ul>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li>Altitude de transition : <strong>3 000 ft minimum en OACI, 5 000 ft minimum en France</strong>.</li><li>Retard de plan de vol : 30 min si contrôlé, 1 h sinon. C&#39;est la même règle qu&#39;en REG 01.</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Niveau minimal IFR en espace non contrôlé, en plaine et en montagne.",
"Expliquez la règle semi-circulaire IFR et la séparation verticale, avec et sans RVSM.",
"Délais du plan de vol IFR : dépôt, AFIL, retard, slot.",
"Conditions de l'autoprotection en VMC.",
"Conditions d'une approche à vue."
]
},
{
"code": "REG 06",
"name": "Interception",
"cards": [
{
"t": "L’essentiel",
"html": "<p>L&#39;interception d&#39;un avion civil est un <strong>dernier recours</strong>. Avant d&#39;en arriver là, la défense aérienne identifie et classe chaque avion qui entre dans l&#39;espace national : <strong>ami, douteux, inconnu ou hostile</strong>. On n&#39;intercepte que les inconnus et les hostiles.</p>\n",
"kind": "info"
},
{
"t": "La défense aérienne française",
"html": "<ul><li><strong>3 CDC</strong> (Centres de Détection et de Contrôle) : <strong>Cinq-Mars-la-Pile</strong> (RAKI), <strong>Mont-de-Marsan</strong> (MARINA), <strong>Lyon Mont-Verdun</strong> (RAMBERT).</li><li><strong>LCP</strong> : Ligne de Classification Périphérique.</li><li>Délais d&#39;alerte : <strong>2 / 7 / 15 min</strong> (Alpha Scramble, Tango Scramble).</li></ul>\n",
"kind": "info"
},
{
"t": "Buts d'une interception",
"html": "<ul><li>Identifier l&#39;avion (à vue ou par radio).</li><li>Le ramener sur sa route prévue.</li><li>Le faire sortir de l&#39;espace national.</li><li>L&#39;éloigner d&#39;une zone P, R ou D.</li><li>Le faire atterrir sur un terrain désigné, adapté à son type d&#39;avion : en pratique un <strong>terrain militaire</strong> avec du personnel de sécurité.</li></ul>\n<p><strong>Règles</strong> : l&#39;interception d&#39;entraînement d&#39;avions civils est <strong>interdite</strong>. La <strong>destruction</strong> n&#39;est possible que si les autorités ont la preuve que l&#39;avion va être utilisé <strong>comme une arme</strong>.</p>\n",
"kind": "info"
},
{
"t": "Ce que fait immédiatement l'avion intercepté",
"html": "<ol><li><strong>Suivre les instructions</strong> de l&#39;intercepteur et répondre à ses signaux visuels.</li><li><strong>Prévenir l&#39;organisme ATS</strong>.</li><li><strong>Appeler l&#39;intercepteur sur 121,5 MHz ou 243 MHz</strong>.</li><li><strong>Afficher 7700</strong> au transpondeur.</li></ol>\n",
"kind": "info"
},
{
"t": "Les 3 phases de l'interception",
"html": "<table><thead><tr><th>Phase</th><th>Ce que fait le leader de l&#39;interception</th></tr></thead><tbody><tr><td><strong>1</strong></td><td>Arrive <strong>par l&#39;arrière</strong>, se place <strong>à gauche</strong>, sur une route parallèle, à <strong>plus de 300 m</strong>, légèrement au-dessus et en avant pour être bien vu</td></tr><tr><td><strong>2</strong></td><td>Se rapproche pour relever l&#39;identité de l&#39;avion : <strong>150 m minimum</strong>, au même niveau</td></tr><tr><td><strong>3</strong></td><td>S&#39;écarte de l&#39;avion intercepté</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Phraséologie",
"html": "<table><thead><tr><th>Intercepteur</th><th>Sens</th><th>Intercepté</th><th>Sens</th></tr></thead><tbody><tr><td>CALL SIGN</td><td>Quel est votre indicatif ?</td><td>CALL SIGN</td><td>Mon indicatif est…</td></tr><tr><td>FOLLOW</td><td>Suivez-moi</td><td>WILCO</td><td>Compris, j&#39;exécute</td></tr><tr><td>DESCEND</td><td>Descendez pour atterrir</td><td>CAN NOT</td><td>Je ne peux pas</td></tr><tr><td>YOU LAND</td><td>Atterrissez sur ce terrain</td><td>REPEAT</td><td>Répétez</td></tr><tr><td>PROCEED</td><td>Reprenez votre navigation</td><td>AM LOST</td><td>Je ne connais pas ma position</td></tr><tr><td></td><td></td><td>MAYDAY</td><td>Je suis en détresse</td></tr><tr><td></td><td></td><td>HIJACK</td><td>Je subis une intervention illicite</td></tr><tr><td></td><td></td><td>LAND / DESCEND</td><td>Je demande à atterrir / à descendre</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Signaux visuels (sans radio)",
"html": "<table><thead><tr><th>Message</th><th>Signal</th></tr></thead><tbody><tr><td>Intercepteur : <strong>« Vous êtes intercepté, suivez-moi »</strong></td><td><strong>Battements d&#39;ailes</strong>, puis virage lent en palier, en général <strong>à gauche</strong>, sans couper la route de l&#39;intercepté. De nuit, en plus, feux de navigation clignotant irrégulièrement</td></tr><tr><td>Intercepté : <strong>« Compris, j&#39;obéis »</strong></td><td><strong>Battements d&#39;ailes</strong> et il suit. De nuit, en plus, feux de navigation clignotants</td></tr><tr><td>Intercepteur : <strong>« Atterrissez ici »</strong></td><td>Tourne autour du terrain, <strong>train sorti</strong>, survole la piste dans le sens d&#39;atterrissage. De nuit, phares d&#39;atterrissage allumés fixes</td></tr><tr><td>Intercepté : <strong>« Compris »</strong></td><td>Sort le train, allume les phares, suit l&#39;intercepteur, et atterrit après le survol de la piste si c&#39;est sûr</td></tr><tr><td>Intercepté : <strong>« Ce terrain ne convient pas »</strong></td><td><strong>Rentre le train</strong> et fait clignoter les phares en passant entre <strong>1 000 et 2 000 ft</strong>, en continuant à tourner</td></tr><tr><td>Intercepteur : <strong>« Vous pouvez continuer »</strong></td><td><strong>Dégagement brusque par la gauche</strong> : virage en montée de <strong>90° ou plus</strong>, sans couper la route de l&#39;intercepté</td></tr><tr><td>Intercepté : <strong>« Je ne peux pas obéir »</strong></td><td>Allume et éteint <strong>régulièrement</strong> tous ses feux</td></tr><tr><td>Intercepté : <strong>« Je suis en détresse »</strong></td><td>Fait clignoter <strong>irrégulièrement</strong> tous ses feux</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li><strong>Régulièrement</strong> = je ne peux pas obéir. <strong>Irrégulièrement</strong> = détresse.</li><li>L&#39;intercepteur se place <strong>à gauche</strong> et dégage <strong>par la gauche</strong>.</li><li>Distance : <strong>300 m</strong> en phase 1, <strong>150 m</strong> minimum en phase 2.</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Quand intercepte-t-on un avion civil ? Quels sont les buts possibles ?",
"Que doit faire immédiatement un avion intercepté ?",
"Décrivez les 3 phases de l'interception, avec les distances.",
"Signaux : « suivez-moi », « atterrissez ici », « vous pouvez continuer », « je ne peux pas obéir », « détresse ».",
"Citez les 3 CDC français."
]
},
{
"code": "REG 07",
"name": "Organisation de l'espace et service du contrôle",
"cards": [
{
"t": "L’essentiel",
"html": "<p>L&#39;ATS rend <strong>3 services</strong> : <strong>contrôle</strong>, <strong>information de vol</strong> et <strong>alerte</strong>. Le contrôle est prioritaire sur les deux autres. En espace <strong>contrôlé</strong>, on a les 3 services ; en espace <strong>non contrôlé</strong>, seulement l&#39;information et l&#39;alerte.</p>\n",
"kind": "info"
},
{
"t": "Les 3 services",
"html": "<table><thead><tr><th>Service</th><th>But</th></tr></thead><tbody><tr><td><strong>Contrôle</strong></td><td>Éviter les collisions entre avions, avec les obstacles sur l&#39;aire de manoeuvre, et avec le sol pendant le guidage radar. Accélérer et ordonner le trafic</td></tr><tr><td><strong>Information de vol</strong></td><td>Donner les infos utiles à la sécurité et à l&#39;efficacité du vol</td></tr><tr><td><strong>Alerte</strong></td><td>Prévenir les organismes de recherche et sauvetage et les aider</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Les organismes",
"html": "<table><thead><tr><th>Organisme</th><th>Espace</th><th>Contrôleurs</th></tr></thead><tbody><tr><td><strong>Contrôle d&#39;aérodrome</strong></td><td>CTR, ATZ : aire de trafic, taxiways, piste, circuit</td><td>Tour (TWR) et sol (GND)</td></tr><tr><td><strong>Contrôle d&#39;approche</strong></td><td>TMA, CTA : arrivées et départs</td><td>APP</td></tr><tr><td><strong>Contrôle régional (ACC)</strong></td><td>En route : LTA, UTA, AWY, PDR, CDR. <strong>5 ACC en France : Paris, Reims, Brest, Bordeaux, Marseille</strong></td><td>CRNA</td></tr><tr><td><strong>AFIS</strong></td><td>Aérodrome non contrôlé</td><td>Information + alerte</td></tr><tr><td><strong>FIC</strong> (centre d&#39;information de vol)</td><td>FIR, UIR (non contrôlé)</td><td>Au même endroit que l&#39;ACC ou l&#39;approche</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Découpage vertical",
"html": "<ul><li><strong>Espace inférieur</strong> : du sol au <strong>FL195</strong>. <strong>FIR</strong> (région d&#39;information de vol). VFR et IFR.</li><li><strong>Espace supérieur</strong> : du <strong>FL195</strong> à l&#39;illimité. <strong>UIR</strong>. IFR seulement en principe.</li></ul>\n",
"kind": "info"
},
{
"t": "Les espaces contrôlés",
"html": "<ul><li><strong>CTR</strong> (zone de contrôle) ou <strong>ATZ</strong> : du <strong>sol</strong> à une limite supérieure d&#39;<strong>au moins 700 ft (200 m)</strong>. S&#39;étend à <strong>au moins 5 NM (9,3 km)</strong> du centre du terrain, dans les axes d&#39;approche.</li><li><strong>CTA</strong> : espace contrôlé qui commence à une certaine hauteur. <strong>TMA</strong> : CTA à la convergence des routes, autour d&#39;un ou plusieurs grands aéroports. Limite inférieure d&#39;<strong>au moins 700 ft (200 m)</strong>.</li><li><strong>AWY</strong> (voie aérienne) : CTA en forme de couloir, gérée par l&#39;ACC. Nom de <strong>6 caractères maximum</strong>. Exigence de navigation <strong>RNP 5</strong> (précision 5 NM, 95 % du temps).</li><li><strong>LTA</strong> (en France) : espace contrôlé de <strong>3 000 ft AGL ou FL115</strong> jusqu&#39;au <strong>FL195</strong>, géré par l&#39;ACC.</li><li><strong>UTA</strong> : au-dessus du <strong>FL195</strong>, jusqu&#39;au FL660, géré par l&#39;ACC.</li><li><strong>PDR</strong> : route permanente au-dessus du FL195, pour l&#39;IFR. <strong>CDR</strong> : route conditionnelle (temporaire), <strong>réservée 48 h à l&#39;avance</strong> auprès d&#39;Eurocontrol.</li></ul>\n",
"kind": "info"
},
{
"t": "Les espaces militaires",
"html": "<table><thead><tr><th>Zone</th><th>Règle</th></tr></thead><tbody><tr><td><strong>TSA</strong> (Temporary Segregated Area)</td><td>Réservée aux militaires sur un créneau. <strong>Active, elle est impénétrable</strong> pour le VFR et l&#39;IFR, sauf circonstances exceptionnelles</td></tr><tr><td><strong>TRA</strong> (Temporary Reserved Area)</td><td>Réservée aux militaires, mais <strong>d&#39;autres avions peuvent être autorisés à la traverser</strong></td></tr><tr><td><strong>CBA</strong> (Cross Border Area)</td><td>TSA à cheval sur une frontière, mêmes règles</td></tr></tbody></table>\n<ul><li>TSA, TRA et CBA sont <strong>réservées 48 h à l&#39;avance</strong> par les escadrons auprès d&#39;Eurocontrol, selon le principe <strong>FUA</strong> (Flexible Use of Airspace : utilisation flexible de l&#39;espace).</li><li><strong>3 centres de défense aérienne</strong> : Lyon Mont-Verdun, Mont-de-Marsan, Cinq-Mars-la-Pile.</li><li><strong>CMCC</strong> (Centre Militaire de Coordination et de Contrôle) : contrôleurs militaires (CAM I) installés dans les <strong>5 CRNA civils</strong>, pour mieux se coordonner avec l&#39;IFR.</li><li><strong>Zones P, R, D</strong> : nom = pays + type + numéro (ex. <strong>LF-R71</strong> de Salon, LF-P35 Mont-de-Marsan). La France peut créer des zones temporaires : <strong>ZIT</strong> (interdite), <strong>ZRT</strong> (réglementée), <strong>ZDT</strong> (dangereuse).</li></ul>\n<p><strong>Les classes d&#39;espace</strong> (de la plus à la moins restrictive)</p>\n<table><thead><tr><th>Classe</th><th>Vols</th><th>Séparation</th><th>Clairance</th><th>Particularité</th></tr></thead><tbody><tr><td><strong>A</strong></td><td><strong>IFR seul</strong></td><td>Tous</td><td>Oui</td><td>Ex. PDR, CDR</td></tr><tr><td><strong>B</strong></td><td>IFR + VFR</td><td><strong>Tous séparés</strong></td><td>Oui</td><td><strong>N&#39;existe pas en France</strong></td></tr><tr><td><strong>C</strong></td><td>IFR + VFR</td><td>IFR/IFR, <strong>IFR/VFR</strong>. Info de trafic VFR/VFR</td><td>Oui</td><td>Ex. TMA, UTA</td></tr><tr><td><strong>D</strong></td><td>IFR + VFR</td><td><strong>IFR/IFR seulement</strong>. Info de trafic pour le reste</td><td>Oui</td><td>Ex. CTR</td></tr><tr><td><strong>E</strong></td><td>IFR + VFR</td><td>IFR/IFR. Info de trafic si possible</td><td><strong>IFR seulement</strong></td><td>Radio obligatoire pour l&#39;IFR seulement</td></tr><tr><td><strong>F</strong></td><td>IFR + VFR</td><td>Séparation consultative IFR si possible</td><td>Non</td><td><strong>N&#39;existe pas en France</strong></td></tr><tr><td><strong>G</strong></td><td>IFR + VFR</td><td>Aucune, information de vol seulement</td><td>Non</td><td>Ex. FIR, UIR</td></tr></tbody></table>\n<ul><li>A, B, C, D, E sont <strong>contrôlées</strong>. F et G <strong>non contrôlées</strong>.</li><li><strong>France : 250 kt max sous le FL100, dans toutes les classes</strong>. Radio <strong>8,33 kHz</strong>.</li><li>Entre deux espaces voisins, on applique la règle de la classe <strong>la moins restrictive</strong>.</li><li><strong>RMZ</strong> : zone à radio obligatoire. <strong>TMZ</strong> : zone à transpondeur obligatoire (mode S, ou A/C pour le VFR).</li></ul>\n",
"kind": "info"
},
{
"t": "📎 Complément : noms des routes aériennes (slide)",
"html": "<p><strong>Préfixe</strong> : K = basse altitude pour hélicoptères ; U = espace supérieur ; S = supersonique.</p>\n<p><strong>Lettre</strong> : A, B, G, R (et H, J, V, W) = routes non RNAV ; L, M, N, P (et Q, T, Y, Z) = routes RNAV. Puis un numéro de 1 à 999.</p>\n<p><strong>Suffixe</strong> : Y = RNP 1 au-dessus du FL200 ; Z = RNP 1 au FL190 ou en dessous ; F = service consultatif ; G = information de vol seulement.</p>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li><strong>TSA active = impénétrable. TRA active = traversable avec accord.</strong></li><li><strong>Classes B et F : n&#39;existent pas en France.</strong></li><li><strong>Classe D : seul l&#39;IFR est séparé de l&#39;IFR.</strong> En C, l&#39;IFR est aussi séparé du VFR.</li><li>CTR : limite haute <strong>au moins 700 ft</strong>, et rayon <strong>au moins 5 NM</strong>.</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Quels sont les 3 services ATS et leurs buts ? Lequel est prioritaire ?",
"Quels organismes contrôlent quels espaces ? Citez les 5 ACC français.",
"Définissez CTR, TMA, AWY et LTA, avec leurs limites.",
"Différence entre TSA et TRA ? Qu'est-ce que la FUA ?",
"Décrivez les classes A à G : vols admis, séparation, clairance. Lesquelles n'existent pas en France ?"
]
},
{
"code": "REG 08",
"name": "Contrôle d'aérodrome",
"cards": [
{
"t": "L’essentiel",
"html": "<p>Le contrôle d&#39;aérodrome gère le <strong>trafic d&#39;aérodrome</strong> : tout ce qui circule sur l&#39;aire de manoeuvre et tout avion à proximité du terrain. Il <strong>ordonne le trafic</strong> et <strong>prévient les collisions</strong>, en séparant les avions <strong>sur la piste</strong> et en donnant de l&#39;<strong>information de trafic</strong> ailleurs.</p>\n",
"kind": "info"
},
{
"t": "Vocabulaire",
"html": "<table><thead><tr><th>Terme</th><th>Définition</th></tr></thead><tbody><tr><td><strong>Aire de trafic</strong> (apron)</td><td>Zone de chargement, déchargement, avitaillement, parking, entretien</td></tr><tr><td><strong>Aire de manoeuvre</strong></td><td>Pistes + taxiways, <strong>sans</strong> l&#39;aire de trafic</td></tr><tr><td><strong>Aire de mouvement</strong></td><td><strong>Aire de trafic + aire de manoeuvre</strong></td></tr><tr><td><strong>Proximité de l&#39;aérodrome</strong></td><td>Avions qui entrent dans le circuit ou en sortent</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Ce que fait la tour",
"html": "<ul><li><strong>Séparation sur la piste</strong> : pas de clairance de décollage s&#39;il y a du trafic sur la piste.</li><li><strong>Information de trafic</strong> dans le circuit et sur les taxiways : c&#39;est le pilote qui évite les autres. Ex. : « numéro 2, suivez le Cirrus en début de vent arrière ». Une fois le trafic en vue, le pilote reste derrière lui.</li><li><strong>Pas de prévention des collisions sur l&#39;aire de trafic</strong> : la radio n&#39;y est obligatoire que pour les avions, pas pour les véhicules.</li><li><strong>Trafic local essentiel</strong> : tout avion, véhicule ou personne sur l&#39;aire de manoeuvre ou près d&#39;elle.</li></ul>\n",
"kind": "info"
},
{
"t": "Les positions de contrôle",
"html": "<table><thead><tr><th>Position</th><th>Zone</th><th>Indicatif (Salon)</th></tr></thead><tbody><tr><td><strong>Tour</strong></td><td>Piste + circuit d&#39;aérodrome</td><td>SALON TOWER (130,30)</td></tr><tr><td><strong>Sol</strong></td><td>Taxiways + aire de trafic</td><td>SALON GROUND (122,10)</td></tr><tr><td><strong>Délivrance</strong></td><td>Mise en route et clairances IFR au départ</td><td>PROVENCE DELIVERY</td></tr></tbody></table>\n<p><strong>Les étapes d&#39;un vol</strong> : mise en route et roulage (sol) → point d&#39;attente, transfert à la tour → alignement → décollage (tour) → circuit → atterrissage (tour) → piste dégagée, roulage vers le parking (sol).</p>\n<ul><li><strong>Piste en service</strong> : normalement face au vent. La tour tient aussi compte du circuit, des aides à l&#39;atterrissage et du bruit.</li><li><strong>Alignement</strong> : interdit tant qu&#39;un avion qui atterrit n&#39;a pas dépassé le point d&#39;attente.</li><li><strong>« Piste dégagée »</strong> : se dit quand <strong>tout l&#39;avion</strong> a franchi le point d&#39;attente de la piste.</li></ul>\n<p><strong>Priorités à l&#39;atterrissage</strong> : avion en détresse ou en urgence ; avion sanitaire (malades, blessés graves) ; avion en mission de recherche et sauvetage ; autres désignés par l&#39;autorité.</p>\n",
"kind": "info"
},
{
"t": "Séparation sur la piste",
"html": "<ul><li>Un avion peut décoller ou atterrir quand celui qui le précède a <strong>dégagé la piste</strong>, <strong>survolé l&#39;extrémité opposée</strong> ou <strong>commencé son virage</strong>.</li><li><strong>Turbulence de sillage</strong> : <strong>2 min</strong> de séparation standard, sur la même piste, des pistes parallèles à moins de <strong>760 m</strong>, des pistes sécantes, ou des parallèles à 760 m ou plus si les trajectoires de départ se croisent.</li><li>À l&#39;arrivée, selon le cours : <strong>3 min</strong> pour un léger derrière un lourd ou un moyen, <strong>3 min</strong> pour un moyen derrière un A380, <strong>4 min</strong> pour un léger derrière un A380.</li><li>Un avion <strong>HEAVY</strong> ou <strong>SUPER</strong> ajoute ce mot après son indicatif au premier contact avec la tour au départ, et avec l&#39;approche à l&#39;arrivée.</li><li><strong>RECAT-EU</strong> (pionnier : Paris-CDG) : 6 catégories au lieu de 4, séparation en secondes, de <strong>80 s à 180 s</strong> selon le couple d&#39;avions. Plus l&#39;avion qui suit est léger par rapport à celui qui précède, plus la séparation est longue.</li></ul>\n",
"kind": "info"
},
{
"t": "Information de vol donnée par la tour",
"html": "<ul><li><strong>Avant le roulage</strong> : piste en service, vent de surface (en <strong>degrés magnétiques</strong>) avec ses variations, <strong>QNH</strong> (et QFE si demandé), température (pour les réacteurs), visibilité, heure, et <strong>CTOT</strong> s&#39;il y a un slot.</li><li><strong>Avant le décollage</strong> : phénomènes météo importants dans la zone de décollage et de montée.</li><li><strong>Avant d&#39;entrer dans le circuit</strong> : piste, vent, QNH (et QFE), changements importants de vent, température, visibilité ou RVR.</li><li>Aussi : travaux, surface dégradée, neige, glace ou eau, oiseaux, panne du balisage lumineux.</li></ul>\n",
"kind": "info"
},
{
"t": "VFR spécial en CTR",
"html": "<ul><li>La tour <strong>suspend le VFR</strong> en conditions IMC.</li><li>Le VFR spécial n&#39;est possible que <strong>pour entrer dans la CTR ou en sortir</strong>, avec <strong>clairance obligatoire</strong> de la tour.</li><li>Accordé quand le <strong>plafond est sous 1 500 ft</strong> ou la <strong>visibilité sous 5 km</strong>, mais <strong>jamais sous 1 500 m de visibilité</strong>.</li><li>Séparation <strong>IFR / VFR spécial</strong>, information de trafic entre VFR spéciaux.</li></ul>\n",
"kind": "info"
},
{
"t": "📎 Complément : turbulence de sillage (slides)",
"html": "<table><tr><th>Arrivée</th><th>Séparation</th></tr><tr><td>Léger derrière lourd ou moyen</td><td>3 min</td></tr><tr><td>Moyen derrière A380</td><td>3 min</td></tr><tr><td>Léger derrière A380</td><td>4 min</td></tr></table>\n<table><tr><th>Départ</th><th>Séparation</th></tr><tr><td>Standard : même piste, parallèles à moins de 760 m, pistes sécantes</td><td>2 min</td></tr><tr><td>Léger ou moyen derrière A380</td><td>3 min</td></tr><tr><td>Partie intermédiaire de piste : léger ou moyen derrière lourd, léger derrière moyen</td><td>3 min</td></tr><tr><td>Partie intermédiaire de piste : léger ou moyen derrière A380</td><td>4 min</td></tr></table>\n<p>Point d'attente : à <strong>50 m</strong> du bord de piste si la piste fait 900 m ou plus, <strong>30 m</strong> si elle est plus courte.</p>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li><strong>Aire de mouvement = trafic + manoeuvre.</strong> L&#39;aire de manoeuvre n&#39;inclut <strong>pas</strong> l&#39;aire de trafic.</li><li>La tour <strong>sépare sur la piste</strong>, mais donne seulement <strong>de l&#39;information de trafic dans le circuit</strong>.</li><li>Le vent donné par la tour est en <strong>degrés magnétiques</strong> (celui du METAR est en degrés vrais).</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Définissez aire de trafic, de manoeuvre et de mouvement.",
"Quelles sont les fonctions de la tour ? Que fait-elle sur la piste, dans le circuit, sur l'aire de trafic ?",
"Rôles des positions tour, sol et délivrance.",
"Quand un avion peut-il décoller derrière un autre ? Séparation de turbulence de sillage ?",
"Quelles informations reçoit un avion avant le roulage ? Avant d'entrer dans le circuit ?",
"Conditions du VFR spécial en CTR."
]
},
{
"code": "REG 09-10",
"name": "Service d'information de vol",
"cards": [
{
"t": "L’essentiel",
"html": "<p>Le <strong>FIS</strong> (Flight Information Service) donne des <strong>conseils et des informations utiles</strong> à la sécurité et à l&#39;efficacité du vol. Il est rendu à tout avion <strong>contrôlé</strong>, ou <strong>connu</strong> de l&#39;organisme (en espace non contrôlé mais en contact radio). Le contrôle reste <strong>prioritaire</strong> sur le FIS.</p>\n<p><strong>AFIS</strong> (Aerodrome Flight Information Service)</p>\n<ul><li>Sur un terrain où le contrôle n&#39;est pas justifié, ou pas 24 h sur 24.</li><li>Seulement <strong>information de vol et alerte</strong> : trafic, météo. <strong>Pas de clairance.</strong></li><li><strong>Le pilote assure lui-même sa séparation</strong> selon les règles de l&#39;air.</li></ul>\n",
"kind": "info"
},
{
"t": "Ce que contient le FIS",
"html": "<ul><li><strong>SIGMET</strong> : phénomènes météo en route dangereux pour tous les avions (jusqu&#39;à <strong>60 000 ft</strong>).</li><li><strong>AIRMET</strong> : phénomènes dangereux pour les <strong>vols à basse altitude</strong> (jusqu&#39;à <strong>24 000 ft</strong>), pas déjà prévus dans les prévisions basse altitude.</li><li>Activité volcanique.</li><li>État des aides radio (radar, balises en panne).</li><li>État des aérodromes (balisage, taxiways, aire de trafic).</li><li><strong>Risques de collision</strong> sur un terrain AFIS et en classes <strong>E, F et G</strong>.</li><li>Météo au départ, à destination et au dégagement.</li></ul>\n<p><strong>ATIS</strong> (message enregistré diffusé en boucle)</p>\n<ul><li>Sur une <strong>fréquence VHF dédiée</strong> (parfois celle d&#39;un VOR). Diffusion <strong>continue et répétée</strong>, pour <strong>un seul aérodrome</strong>, mise à jour immédiatement.</li><li>Identifié par une <strong>lettre de l&#39;alphabet OACI</strong>. Message de <strong>30 s maximum</strong> si possible.</li><li>Au premier contact, le pilote <strong>annonce la lettre reçue</strong> et <strong>collationne le QNH</strong>.</li><li>Contenu : nom du terrain, heure d&#39;observation, type d&#39;approche, piste en service, état de la piste (freinage), <strong>niveau de transition</strong>, <strong>vent (moyenne sur 2 min)</strong>, <strong>visibilité et RVR (moyenne sur 1 min)</strong>, temps présent, <strong>nuages sous 5 000 ft</strong> (ou sous la MSA la plus haute) et CB, température, point de rosée, QNH, tendance, phénomènes importants (cisaillement de vent).</li><li>Le <strong>D-ATIS</strong> est la version en liaison de données.</li></ul>\n<p><strong>Service consultatif</strong> (classe F, routes consultatives)</p>\n<ul><li>IFR et VFR admis. <strong>L&#39;IFR</strong> reçoit le <strong>service consultatif</strong> s&#39;il le demande, plus l&#39;information de vol et l&#39;alerte. <strong>Le VFR</strong> reçoit information de vol et alerte s&#39;il est en contact radio.</li><li>L&#39;ATS fait des <strong>suggestions</strong> d&#39;évitement à l&#39;IFR. <strong>Le pilote décide</strong> de les suivre ou non, et informe l&#39;ATS sans délai.</li><li>Pour l&#39;utiliser, il faut <strong>déposer un plan de vol</strong>.</li><li><strong>La classe F n&#39;existe pas en France.</strong> Au Royaume-Uni, ce sont des routes avec service consultatif (ex. vers l&#39;île de Man).</li></ul>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li><strong>AFIS = pas de contrôle</strong>, donc pas de clairance : le pilote se sépare lui-même.</li><li><strong>SIGMET : tous les avions, jusqu&#39;à 60 000 ft. AIRMET : basse altitude, jusqu&#39;à 24 000 ft.</strong></li><li>ATIS : on donne la <strong>lettre</strong> et on <strong>collationne le QNH</strong>.</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Définissez le FIS. À qui est-il rendu ?",
"Qu'est-ce qu'un AFIS ? Qui assure la séparation ?",
"Différence entre SIGMET et AIRMET.",
"Caractéristiques et contenu d'un ATIS. Que doit faire le pilote au premier contact ?",
"Qu'est-ce que le service consultatif ? Qui décide de suivre la suggestion ?"
]
},
{
"code": "REG 11",
"name": "Services radar",
"cards": [
{
"t": "L’essentiel",
"html": "<p>La surveillance radar donne à l&#39;ATS la <strong>position</strong> des avions et les infos de leur plan de vol. Elle permet de mieux utiliser l&#39;espace, de réduire les retards, de donner des routes directes, de <strong>guider</strong> (vectoring) et de <strong>séparer</strong>. Elle déclenche aussi des alarmes de <strong>conflit</strong> et d&#39;<strong>altitude minimale de sécurité</strong>. Le nombre d&#39;avions suivis ne doit pas dépasser ce que le contrôleur peut gérer.</p>\n",
"kind": "info"
},
{
"t": "Types de radar",
"html": "<table><thead><tr><th>Radar</th><th>Principe</th></tr></thead><tbody><tr><td><strong>PSR</strong> (primaire)</td><td><strong>Écho réfléchi</strong> par tous les avions, sans coopération de l&#39;avion</td></tr><tr><td><strong>SSR</strong> (secondaire)</td><td>Interroge le <strong>transpondeur</strong>. Mode <strong>A</strong> = code ; mode <strong>C</strong> = altitude ; mode <strong>S</strong> = position, immatriculation, vitesse, cap</td></tr><tr><td><strong>PAR / SPAR</strong> (approche de précision)</td><td>Radar primaire : écart <strong>latéral, vertical et distance</strong> au toucher, approche <strong>3D</strong></td></tr><tr><td><strong>SRA</strong> (approche de surveillance)</td><td>Approche <strong>classique</strong> (non de précision) : des caps, et seulement l&#39;altitude à laquelle l&#39;avion devrait être</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Les 3 fonctions radar",
"html": "<ol><li><strong>Surveillance</strong> : mieux connaître la position des avions contrôlés.</li><li><strong>Assistance</strong> : prévenir le pilote s&#39;il s&#39;écarte beaucoup de sa clairance.</li><li><strong>Guidage (vectoring)</strong> : donner des caps pour suivre la route voulue.</li></ol>\n",
"kind": "info"
},
{
"t": "Règles du guidage radar",
"html": "<ul><li>Pas à moins de <strong>2,5 NM</strong> de la limite de l&#39;espace (ou de la moitié de la séparation si elle dépasse 5 NM).</li><li><strong>Pas de guidage en espace non contrôlé</strong>, sauf urgence ou évitement météo.</li><li><strong>Pendant un guidage ou une route directe, le contrôleur est responsable de l&#39;anticollision avec le sol.</strong> Sur une voie aérienne, c&#39;est le pilote.</li><li><strong>Fin du guidage</strong> : « reprenez votre propre navigation », avec la position et des instructions. <strong>Le pilote redevient responsable</strong> de sa navigation, du trafic et du sol.</li></ul>\n<p><strong>Identification radar</strong> (avant tout service radar, et le pilote en est informé)</p>\n<ul><li><strong>SSR</strong> : reconnaître un <strong>code discret</strong> attribué (ex. 5661), ou demander d&#39;afficher un code ou de faire <strong>IDENT</strong>.</li><li><strong>PSR</strong> : faire correspondre l&#39;écho avec la position annoncée, faire virer de <strong>30° ou plus</strong>, ou repérer un avion qui vient de décoller (<strong>à moins de 1 NM</strong>).</li></ul>\n",
"kind": "info"
},
{
"t": "Codes transpondeur à connaître",
"html": "<table><thead><tr><th>Code</th><th>Signification</th></tr></thead><tbody><tr><td><strong>7700</strong></td><td><strong>Détresse</strong></td></tr><tr><td><strong>7600</strong></td><td><strong>Panne radio</strong></td></tr><tr><td><strong>7500</strong></td><td><strong>Détournement</strong></td></tr><tr><td><strong>7000</strong></td><td>VFR par défaut (France)</td></tr><tr><td>2000</td><td>Entrée dans l&#39;espace national sans instruction</td></tr><tr><td>0300 / 0400</td><td>CAM V / CAM V en LTA</td></tr><tr><td>7004</td><td>Voltige</td></tr><tr><td>707X</td><td>Largage de parachutistes</td></tr><tr><td>7777</td><td>Test du transpondeur au sol (France)</td></tr></tbody></table>\n<p>Astuce : <strong>75 = taxi (hijack), 76 = pas de radio, 77 = au secours</strong>.</p>\n<p><strong>Informer le pilote de sa position</strong> : à l&#39;identification (sauf si identifié à moins de 1 NM de la piste au départ), à sa demande, si son estimée diffère beaucoup, et à la fin du guidage. Sous forme de distance et relèvement par rapport à un point ou une balise, de distance au toucher en finale, d&#39;écart à l&#39;axe d&#39;une route, ou par rapport à un repère géographique connu.</p>\n",
"kind": "info"
},
{
"t": "Séparation radar",
"html": "<ul><li><strong>Standard : 5 NM.</strong> <strong>Réduite : 3 NM.</strong></li><li><strong>2,5 NM minimum en finale</strong> (dans les 10 NM du seuil), si : occupation de piste <strong>≤ 50 s</strong>, freinage bon, radar rafraîchi toutes les <strong>5 s</strong>, tour qui voit la piste, vitesse d&#39;approche ajustable, pilote averti de dégager vite, procédure publiée à l&#39;AIP.</li></ul>\n",
"kind": "info"
},
{
"t": "Approche PAR",
"html": "<ul><li>Le contrôleur radar prévient la tour au plus tard à <strong>8 NM</strong> du toucher.</li><li><strong>Clairance d&#39;atterrissage entre 8 et 2 NM</strong>, transmise par le contrôleur radar.</li><li><strong>Pas de changement de vitesse dans les 4 derniers NM</strong> (pas plus de 20 kt).</li><li>Le contrôleur donne les corrections de cap et la distance <strong>chaque NM</strong>.</li><li><strong>Remise de gaz ordonnée</strong> si : position dangereuse, conflit, instruction de la tour, <strong>pas d&#39;autorisation d&#39;atterrir avant 2 NM</strong>, doute sur la position, ou avion perdu à l&#39;écran dans les 2 derniers NM.</li></ul>\n",
"kind": "info"
},
{
"t": "ADS-B / ADS-C",
"html": "<ul><li><strong>ADS-B</strong> : l&#39;avion <strong>diffuse lui-même</strong> son identité et sa position (GNSS) par liaison de données. Plus précis que le radar, peu cher, équipe même planeurs et ballons. <strong>Obligatoire aux États-Unis depuis 2020</strong> en espace contrôlé.</li><li><strong>ADS-C</strong> : échange sous <strong>contrat</strong> entre l&#39;ATS et l&#39;avion (position, plan de vol).</li></ul>\n",
"kind": "info"
},
{
"t": "📎 Complément : sillage en séparation radar (slide)",
"html": "<table><tr><th>Devant ↓ / derrière →</th><th>Léger</th><th>Moyen</th><th>Lourd</th></tr><tr><td>Moyen</td><td>5 NM</td><td>3 NM</td><td>3 NM</td></tr><tr><td>Lourd</td><td>6 NM</td><td>5 NM</td><td>4 NM</td></tr><tr><td>A380</td><td>8 NM</td><td>7 NM</td><td>6 NM</td></tr></table>\n<p>Même niveau ou moins de 1 000 ft en dessous. Derrière un léger : minimum radar.</p>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li><strong>Guidage radar = le contrôleur gère le relief.</strong> À la fin du guidage, c&#39;est à nouveau le pilote.</li><li><strong>PSR = écho, sans coopération. SSR = transpondeur.</strong></li><li>Séparation : <strong>5 / 3 / 2,5 NM</strong>.</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Différence entre PSR, SSR, PAR et SRA.",
"Quelles sont les 3 fonctions radar ?",
"Qui est responsable de l'anticollision avec le sol pendant et après un guidage ?",
"Comment identifie-t-on un avion au radar secondaire et au radar primaire ?",
"Donnez les codes 7500, 7600, 7700 et 7000.",
"Séparations radar standard, réduite et en finale. Conditions des 2,5 NM ?",
"Quand une remise de gaz est-elle ordonnée en PAR ?"
]
},
{
"code": "REG 12",
"name": "Recherche et sauvetage (SAR)",
"cards": [
{
"t": "L’essentiel",
"html": "<p>Chaque État doit assurer un service de <strong>recherche et sauvetage 24 h sur 24</strong>, quelle que soit la nationalité des victimes ou de l&#39;avion. L&#39;espace est découpé en <strong>SRR</strong> (régions SAR), sans chevauchement, avec <strong>un RCC par SRR</strong>. Au-dessus de la haute mer, des accords régionaux OACI répartissent les zones.</p>\n",
"kind": "info"
},
{
"t": "Définitions",
"html": "<table><thead><tr><th>Sigle</th><th>Sens</th></tr></thead><tbody><tr><td><strong>RCC</strong> (Rescue Coordination Centre)</td><td>Organise et coordonne le SAR dans sa région</td></tr><tr><td><strong>SRC / RSC</strong> (centre secondaire)</td><td>Subordonné au RCC, couvre un secteur</td></tr><tr><td><strong>SRR</strong> (Search and Rescue Region)</td><td>La zone d&#39;un RCC</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "En France",
"html": "<ul><li><strong>1 RCC : Lyon</strong> (Armée de l&#39;Air et de l&#39;Espace, Mont-Verdun).</li><li><strong>3 centres secondaires : Cherbourg, Brest, Toulon</strong> (Marine nationale).</li><li>Les moyens aériens SAR sont sous la responsabilité du RCC, qui peut les faire décoller. <strong>Alerte : 1 h aux heures ouvrables, 2 h hors heures ouvrables.</strong></li><li>Exemples : <strong>Puma</strong> (Solenzara), <strong>Caracal</strong> (Cazaux, jusqu&#39;à 250 NM en mer), <strong>Fennec</strong> (Orange, Villacoublay). La Gendarmerie a aussi 56 hélicoptères.</li><li>Le RCC communique avec les centres secondaires, les moyens SAR, l&#39;ATS, les aéroclubs, les stations radiogoniométriques et le système satellite <strong>COSPAS-SARSAT</strong>.</li></ul>\n<p><strong>Les 3 phases d&#39;alerte</strong> (déclenchées par l&#39;ATS vers le RCC)</p>\n<table><thead><tr><th>Phase</th><th>Code</th><th>Situation</th></tr></thead><tbody><tr><td><strong>Incertitude</strong></td><td><strong>INCERFA</strong></td><td><strong>Doute</strong> sur la sécurité de l&#39;avion et de ses occupants</td></tr><tr><td><strong>Alerte</strong></td><td><strong>ALERFA</strong></td><td><strong>Inquiétude</strong> pour leur sécurité</td></tr><tr><td><strong>Détresse</strong></td><td><strong>DETRESFA</strong></td><td><strong>Danger grave et imminent</strong>, besoin d&#39;aide immédiate</td></tr></tbody></table>\n<p>Délais standard OACI (la slide des délais n&#39;était pas lisible, à vérifier en cours) : INCERFA si aucune nouvelle <strong>30 min</strong> après l&#39;heure attendue ou l&#39;heure d&#39;arrivée prévue ; ALERFA si les recherches de contact échouent, ou si un avion autorisé à atterrir ne l&#39;a pas fait <strong>5 min</strong> après l&#39;heure prévue ; DETRESFA si les recherches échouent encore, si le carburant est considéré épuisé, ou si un atterrissage forcé est probable.</p>\n",
"kind": "info"
},
{
"t": "Équipements",
"html": "<ul><li>Fréquences de détresse : <strong>121,5 MHz</strong>, <strong>243,0 MHz</strong>, <strong>2 182 kHz</strong>. Balise <strong>ELT : 406 MHz</strong> (détection satellite). <strong>Fréquence RCC : 123,1 MHz.</strong></li><li><strong>Conteneurs largués</strong>, par couleur : <strong>rouge</strong> = médical ; <strong>bleu</strong> = eau et nourriture ; <strong>jaune</strong> = couvertures et vêtements ; <strong>noir</strong> = matériel divers.</li></ul>\n",
"kind": "info"
},
{
"t": "Pilote non SAR qui voit un avion ou un navire en détresse",
"html": "<ul><li><strong>Le garder en vue</strong> tant que sa présence est utile.</li><li>Transmettre au RCC ou à l&#39;ATS : type, identification et état de l&#39;avion ou du navire, <strong>position</strong>, <strong>heure UTC</strong>, <strong>nombre de personnes vues</strong>, observations.</li></ul>\n",
"kind": "info"
},
{
"t": "Pilote non SAR qui capte un signal de détresse",
"html": "<ul><li>Noter la <strong>position</strong> et le <strong>relèvement</strong> de l&#39;émission.</li><li>Prévenir l&#39;ATS (RCC).</li><li>Se rendre sur place <strong>si on le lui demande</strong>. Il doit <strong>accepter</strong> la mission, sauf si la sécurité de son vol l&#39;en empêche (carburant, météo).</li></ul>\n",
"kind": "info"
},
{
"t": "Signaux air-sol",
"html": "<ul><li><strong>Urgence (ALERFA)</strong> : phares ou feux de position allumés et éteints de façon répétée, <strong>PAN PAN ×3</strong>.</li><li><strong>Détresse (DETRESFA)</strong> : fusée rouge, <strong>SOS</strong>, <strong>MAYDAY ×3</strong>, <strong>7700</strong>, appel sur 121,5, 243 ou 2 182 kHz.</li><li><strong>Accuser réception d&#39;un signal au sol</strong> : <strong>battements d&#39;ailes</strong> de jour ; de nuit, phares ou feux de navigation allumés et éteints <strong>deux fois</strong>.</li></ul>\n",
"kind": "info"
},
{
"t": "📎 Complément : délais d'alerte (slide du cours)",
"html": "<table><tr><th>Situation</th><th>Phases</th></tr><tr><td>MAYDAY ou 7700</td><td>DETRESFA à H+5</td></tr><tr><td>PAN PAN</td><td>ALERFA à H+5</td></tr><tr><td>7500 (détournement)</td><td>ALERFA à H+5</td></tr><tr><td>Perte du contact radio et radar</td><td>ALERFA H+5, DETRESFA H+10</td></tr><tr><td>Perte du contact radio avec APP ou TWR (sans radar)</td><td>ALERFA H+5, DETRESFA H+10</td></tr><tr><td>Perte du contact radio au départ d'un aérodrome</td><td>INCERFA H+10, ALERFA H+20, DETRESFA H+30</td></tr></table>\n<p>Ce tableau de la slide complète la mention « slide pas lisible » de la fiche.</p>\n",
"kind": "info"
},
{
"t": "📎 Complément : signaux au sol (slides)",
"html": "<p><strong>Survivants</strong> : V = besoin d'assistance ; X = assistance médicale ; N = non ; Y = oui ; ↑ = nous partons dans cette direction.</p>\n<p><strong>Équipes de secours</strong> : LLL = opération terminée ; LL = tout le monde retrouvé ; ++ = une partie seulement ; XX = impossible de continuer, retour à la base ; flèches séparées = groupe scindé en deux ; → = aéronef dans cette direction ; NN = rien trouvé, on continue.</p>\n",
"kind": "info"
},
{
"t": "📎 Complément : moyens SAR (slides)",
"html": "<p>Marine : Falcon 50, Falcon 200 Gardian, Caïman Marine, H160 / Dauphin N3, Dauphin, Panther.</p>\n<p>Gendarmerie : 56 hélicoptères (15 EC145, 15 EC135, 26 AS350).</p>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li><strong>INCERFA = doute, ALERFA = inquiétude, DETRESFA = danger imminent.</strong> L&#39;ordre suit l&#39;aggravation.</li><li><strong>1 RCC (Lyon, Air)</strong> et <strong>3 centres secondaires (Marine)</strong>.</li><li>Un pilote civil sollicité <strong>doit accepter</strong>, sauf si sa sécurité l&#39;interdit.</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Définissez RCC, SRC et SRR. Organisation du SAR en France ?",
"Décrivez les 3 phases d'alerte et leurs codes.",
"Que fait un pilote non SAR qui aperçoit un avion en détresse ? Qui capte un signal de détresse ?",
"Fréquences SAR et code couleur des conteneurs largués.",
"Comment accuser réception d'un signal sol-air, de jour et de nuit ?"
]
},
{
"code": "REG 13-14",
"name": "Départs IFR",
"cards": [
{
"t": "L’essentiel",
"html": "<p>Les procédures de départ IFR sont conçues selon le <strong>Doc 8168 (PANS-OPS)</strong> de l&#39;OACI. Elles servent à quitter le terrain en IMC jusqu&#39;au transfert à l&#39;ACC. Une fois publiées à l&#39;AIP, tout avion peut les suivre, et <strong>le commandant de bord est responsable de tenir la trajectoire</strong>.</p>\n",
"kind": "info"
},
{
"t": "Les 4 types de départ IFR",
"html": "<table><thead><tr><th>Type</th><th>Quand</th></tr></thead><tbody><tr><td><strong>SID</strong> (départ normalisé)</td><td>Terrain avec beaucoup d&#39;IFR et/ou d&#39;obstacles : trajectoire précise jusqu&#39;à la sortie de la CTA/TMA</td></tr><tr><td><strong>Départ omnidirectionnel</strong></td><td>Moins d&#39;obstacles et de trafic : trajectoire imposée jusqu&#39;à un point, puis libre jusqu&#39;au transfert à l&#39;ACC</td></tr><tr><td><strong>Sans route publiée</strong></td><td>Très peu d&#39;IFR et pas d&#39;obstacle : l&#39;ATC donne des instructions locales (point, niveau, sens de virage)</td></tr><tr><td><strong>Guidage radar</strong></td><td>Le contrôleur donne des caps</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "La SID",
"html": "<ul><li>Conçue <strong>tous moteurs en fonctionnement</strong>. Sa forme dépend des <strong>obstacles</strong> et des <strong>besoins de l&#39;ATC</strong>.</li><li>Limitée à certaines <strong>catégories d&#39;avions</strong>, publiées sur la carte. Les vitesses de catégorie sont celles de la remise de gaz finale <strong>+ 10 %</strong>.</li><li><strong>Nom</strong> : indicateur de base (le point de sortie) + <strong>numéro de validité (1 à 9)</strong> + <strong>lettre de route</strong>. Ex. : <strong>AVN 7D</strong> à Istres (AVN = point de transfert à l&#39;ACC).</li></ul>\n",
"kind": "info"
},
{
"t": "Construction",
"html": "<ul><li><strong>DER</strong> (Departure End of Runway) : la procédure commence en bout de piste, sur une largeur de <strong>300 m</strong>.</li><li><strong>OIS</strong> (surface d&#39;identification d&#39;obstacles) : surface imaginaire qui part à <strong>5 m (16 ft) au-dessus du DER</strong>. Tout obstacle qui la perce est publié.</li><li><strong>MOC</strong> (marge de franchissement d&#39;obstacles) : elle croît de <strong>0,8 %</strong> de la distance parcourue depuis le DER. <strong>MOC = 0,8 % × distance.</strong></li><li><strong>Pente standard (PDG) : 3,3 %.</strong> Si une pente supérieure est exigée, elle est publiée avec l&#39;altitude jusqu&#39;à laquelle elle s&#39;applique.</li></ul>\n<table><thead><tr><th>Départ</th><th>Critère</th></tr></thead><tbody><tr><td><strong>En ligne droite</strong></td><td>Divergence de <strong>15° max</strong> dans les <strong>10 km (5,4 NM)</strong></td></tr><tr><td><strong>Avec virage</strong></td><td>Divergence de plus de 15°. <strong>Ligne droite jusqu&#39;à 120 m (394 ft) au-dessus du DER</strong> minimum, puis virage au taux de <strong>3°/s</strong></td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Ce qui est publié",
"html": "<ul><li><strong>SID</strong> : obstacles qui percent l&#39;OIS, l&#39;obstacle le plus haut qui dimensionne la procédure, la pente si elle dépasse 3,3 %.</li><li><strong>Départ omnidirectionnel</strong> : secteurs à éviter, secteurs avec une altitude minimale, point ou altitude de virage, limitations par catégorie.</li><li><strong>Départ RNAV</strong> : pour les avions avec FMS (VOR/DME ou GNSS), en <strong>RNAV 1</strong>.</li></ul>\n",
"kind": "info"
},
{
"t": "📎 Complément : vitesses de départ par catégorie (slide)",
"html": "<table><tr><th>Cat.</th><th>Vitesse max</th></tr><tr><td>A</td><td>225 km/h (120 kt)</td></tr><tr><td>B</td><td>305 km/h (165 kt)</td></tr><tr><td>C</td><td>490 km/h (265 kt)</td></tr><tr><td>D</td><td>540 km/h (290 kt)</td></tr><tr><td>E</td><td>560 km/h (300 kt)</td></tr></table>\n<p>Ce sont les vitesses de l'approche interrompue finale + 10 %.</p>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li><strong>SID = tous moteurs en fonctionnement.</strong> La panne moteur n&#39;est pas couverte par la SID.</li><li><strong>Pente standard 3,3 %</strong> = pente de l&#39;OIS <strong>2,5 %</strong> + MOC <strong>0,8 %</strong>.</li><li>Le pilote, pas le contrôleur, est responsable de suivre la trajectoire publiée.</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Citez les 4 types de départs IFR et quand on les utilise.",
"Comment se lit le nom d'une SID ? Donnez un exemple.",
"Définissez DER, OIS et MOC. Quelle est la pente standard ?",
"Critères d'un départ en ligne droite et d'un départ avec virage.",
"Qu'est-ce qui est publié pour une SID ? Pour un départ omnidirectionnel ?"
]
},
{
"code": "REG 15",
"name": "Procédures d'approche IFR",
"cards": [
{
"t": "L’essentiel",
"html": "<p>Une procédure d&#39;approche aux instruments est une suite de manoeuvres publiées à l&#39;AIP, protégées des obstacles, de l&#39;<strong>IAF</strong> jusqu&#39;au point où l&#39;on peut atterrir, puis la remise de gaz. Elle compte <strong>5 segments</strong> : <strong>arrivée, initial, intermédiaire, final, approche interrompue</strong>.</p>\n",
"kind": "info"
},
{
"t": "Les segments et leurs marges (MOC)",
"html": "<table><thead><tr><th>Segment</th><th>De → à</th><th>MOC</th></tr></thead><tbody><tr><td><strong>Arrivée</strong> (STAR ou omnidirectionnelle)</td><td>Route → <strong>IAF</strong></td><td><strong>1 000 ft</strong> (2 000 ft en montagne)</td></tr><tr><td><strong>Initial</strong></td><td><strong>IAF → IF</strong></td><td><strong>1 000 ft</strong> (2 000 ft en montagne)</td></tr><tr><td><strong>Intermédiaire</strong></td><td><strong>IF → FAF/FAP</strong></td><td><strong>500 ft (150 m)</strong></td></tr><tr><td><strong>Final 2D (NPA)</strong></td><td>FAF → MAPt</td><td><strong>246 ft (75 m)</strong> avec FAF, <strong>295 ft (90 m)</strong> sans FAF</td></tr><tr><td><strong>Final 3D (PA)</strong></td><td>FAP → DA/DH</td><td>Variable selon la catégorie</td></tr><tr><td><strong>Approche interrompue</strong></td><td>MAPt → …</td><td><strong>164 ft (50 m)</strong>, puis 30 m mini</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Arrivée",
"html": "<ul><li><strong>Clairance d&#39;arrivée jusqu&#39;à l&#39;IAF seulement</strong>, donnée par l&#39;approche au premier contact après le transfert de l&#39;ACC.</li><li><strong>STAR</strong> : relie le dernier point en route à l&#39;IAF. Nom comme une SID : code + numéro de validité (1 à 9) + lettre. Protection de 10 NM de large, qui se réduit à 25 NM de l&#39;IAF.</li><li><strong>Arrivée omnidirectionnelle</strong> : pas de route publiée, on utilise la <strong>MSA</strong>.</li><li><strong>MSA (altitude minimale de secteur)</strong> : sur <strong>25 NM (46 km)</strong> autour de la balise (+ 5 NM de zone tampon), <strong>300 m (1 000 ft)</strong> au-dessus de l&#39;obstacle le plus haut du secteur, <strong>arrondie aux 100 ft supérieurs</strong>.</li></ul>\n",
"kind": "info"
},
{
"t": "Segment initial (IAF → IF)",
"html": "<ul><li><strong>Clairance d&#39;approche donnée par l&#39;ATC.</strong> Sans clairance, attente sur l&#39;<strong>IAF</strong>.</li><li>On rejoint directement le segment initial si l&#39;angle entre sa route et le segment est <strong>≤ 90° pour une approche de précision (3D)</strong>, <strong>≤ 120° pour une approche classique (2D)</strong>.</li><li>Sans IF ni IAF adaptés, on fait un <strong>demi-tour</strong> (reversal) : <strong>virage conventionnel</strong> 45°/180° ou 80°/260°, <strong>virage de base</strong>, ou <strong>hippodrome</strong> (racetrack). Inclinaison <strong>25° ou 3°/s</strong>, le moins incliné des deux. Entrée directe dans un secteur de <strong>± 30°</strong>.</li></ul>\n",
"kind": "info"
},
{
"t": "Segment intermédiaire (IF → FAF/FAP)",
"html": "<ul><li>On <strong>configure l&#39;avion</strong> pour la finale (volets, train sorti) et on ajuste la vitesse. Durée recommandée : <strong>30 s</strong>.</li><li><strong>Obligatoire</strong> en approche 3D et en approche 2D sur arc DME.</li><li>Même route que la finale en 3D, <strong>30° d&#39;écart max</strong> en 2D.</li></ul>\n",
"kind": "info"
},
{
"t": "Approche finale : 2D ou 3D",
"html": "<table><thead><tr><th></th><th><strong>NPA (2D)</strong> : guidage latéral</th><th><strong>PA (3D)</strong> : guidage latéral + vertical</th></tr></thead><tbody><tr><td>Moyens</td><td>VOR, NDB, ILS sans glide (LOC), RNAV LNAV</td><td>ILS, PAR, RNAV (GBAS)</td></tr><tr><td>Début</td><td><strong>FAF</strong>, à <strong>5-10 NM</strong> du seuil, <strong>1 000-3 000 ft AGL</strong></td><td><strong>FAP</strong>, à <strong>3-10 NM</strong>, 1 000-3 000 ft AGL</td></tr><tr><td>Fin</td><td><strong>MAPt</strong>, à la <strong>MDA/MDH</strong></td><td><strong>DA/DH</strong></td></tr><tr><td>Pente</td><td><strong>2,5° mini, 3° optimum, 3,8° maxi</strong> (selon le cours)</td><td><strong>2,5° mini, 3° optimum, 3,5° maxi</strong></td></tr><tr><td>Écart à l&#39;axe</td><td>30° max</td><td>—</td></tr></tbody></table>\n<ul><li><strong>OCA/OCH</strong> : obstacle le plus haut + MOC. La <strong>MDA</strong> ou la <strong>DA</strong> ne peut pas être sous l&#39;OCA.</li><li><strong>CDFA</strong> : finale 2D en descente continue, sans palier, comme une approche 3D.</li><li><strong>DA</strong> : altitude à laquelle on remet les gaz si on n&#39;a pas les références visuelles.</li></ul>\n",
"kind": "info"
},
{
"t": "Catégories ILS",
"html": "<table><thead><tr><th>Catégorie</th><th>DH</th><th>RVR</th></tr></thead><tbody><tr><td><strong>CAT I</strong></td><td><strong>≥ 200 ft</strong></td><td><strong>≥ 550 m</strong></td></tr><tr><td><strong>CAT II</strong></td><td><strong>100 à 200 ft</strong></td><td><strong>≥ 350 m</strong> (OACI)</td></tr><tr><td><strong>CAT IIIA</strong></td><td>&lt; 100 ft</td><td>≥ 200 m</td></tr><tr><td><strong>CAT IIIB</strong></td><td>&lt; 50 ft</td><td>≥ 50 m (OACI), 75 m (EASA)</td></tr><tr><td><strong>CAT IIIC</strong></td><td>Pas de DH</td><td>Pas de RVR</td></tr></tbody></table>\n<p><strong>Catégories d&#39;avions</strong> (selon la Vat, vitesse au seuil) : <strong>A &lt; 91 kt</strong>, <strong>B 91-120</strong>, <strong>C 121-140</strong>, <strong>D 141-165</strong>, <strong>E 166-210</strong>.</p>\n",
"kind": "info"
},
{
"t": "Approche interrompue : 3 phases",
"html": "<ol><li><strong>Initiale</strong> : du MAPt au début de la montée. <strong>Pas de virage.</strong></li><li><strong>Intermédiaire</strong> : jusqu&#39;à obtenir <strong>50 m (164 ft)</strong> de marge. Pente <strong>2,5 %</strong>, divergence <strong>15° max</strong>.</li><li><strong>Finale</strong> : dès qu&#39;on a 50 m de marge. <strong>Virages autorisés.</strong></li></ol>\n",
"kind": "info"
},
{
"t": "RNAV et RNP",
"html": "<ul><li><strong>RNAV</strong> : précision de navigation <strong>sans surveillance ni alerte</strong> à bord. <strong>RNP</strong> : <strong>avec surveillance et alerte</strong> à bord.</li><li><strong>RNAV 5</strong> : en route (5 NM, 95 % du temps). <strong>RNAV 1</strong> : SID, STAR, approche initiale. <strong>RNP APCH</strong> : approches.</li><li><strong>LNAV</strong> : approche 2D GNSS, sans guidage vertical.</li><li><strong>LNAV/VNAV</strong> : 3D, verticale par <strong>Baro-VNAV</strong> (le <strong>calage altimétrique est critique</strong>). <strong>LPV</strong> : 3D, verticale par <strong>SBAS</strong>. Minimum ~250-300 ft.</li><li>Classement OACI : <strong>type A</strong>, minima <strong>≥ 250 ft</strong> ; <strong>type B</strong>, minima <strong>&lt; 250 ft</strong>.</li></ul>\n",
"kind": "info"
},
{
"t": "📎 Complément : vitesses par catégorie (slide, en kt)",
"html": "<table><tr><th>Cat.</th><th>Vat</th><th>Initiale</th><th>Finale</th><th>Circling max</th><th>Interr. interm.</th><th>Interr. finale</th></tr><tr><td>A</td><td>&lt; 91</td><td>90-150 (110)</td><td>70-100</td><td>100</td><td>100</td><td>110</td></tr><tr><td>B</td><td>91-120</td><td>120-180 (140)</td><td>85-130</td><td>135</td><td>130</td><td>150</td></tr><tr><td>C</td><td>121-140</td><td>160-240</td><td>115-160</td><td>180</td><td>160</td><td>240</td></tr><tr><td>D</td><td>141-165</td><td>185-250</td><td>130-185</td><td>205</td><td>185</td><td>265</td></tr><tr><td>E</td><td>166-210</td><td>185-250</td><td>155-230</td><td>240</td><td>230</td><td>275</td></tr></table>\n<p>Taux de descente max en demi-tour : éloignement A/B 245 m/min (804 ft), C/D/E 365 m/min (1 197 ft) ; rapprochement A/B 150 m/min (492 ft), C/D/E 230 m/min (755 ft).</p>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li><strong>2D = FAF, MAPt, MDA. 3D = FAP, DA.</strong></li><li>MOC : <strong>1 000 / 1 000 / 500</strong> (arrivée, initial, intermédiaire), puis <strong>246 ou 295 ft</strong> en finale 2D.</li><li>La <strong>clairance d&#39;arrivée</strong> va jusqu&#39;à l&#39;IAF. Il faut ensuite une <strong>clairance d&#39;approche</strong>.</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Citez les 5 segments d'une approche, avec leurs points de début et de fin et leur MOC.",
"Qu'est-ce que la MSA ? Comment est-elle calculée ?",
"Différences entre approche de précision et classique : moyens, points, pentes, minima.",
"Donnez les catégories ILS (DH, RVR) et les catégories d'avions.",
"Décrivez les 3 phases d'une approche interrompue.",
"Différence entre RNAV et RNP. Qu'est-ce qu'une approche LPV ?"
]
},
{
"code": "REG 16",
"name": "Circling (MVL, manoeuvre à vue libre)",
"cards": [
{
"t": "L’essentiel",
"html": "<p>Le <strong>circling</strong> est la phase <strong>à vue</strong> qui suit une approche aux instruments, pour atterrir sur une piste <strong>mal orientée</strong> pour une approche directe. On tourne autour du terrain à vue, sous les nuages, jusqu&#39;à la piste.</p>\n<p><strong>La zone de circling</strong> : on trace un <strong>arc centré sur chaque seuil de piste</strong>, et on relie les arcs par des tangentes. Son rayon dépend de la <strong>catégorie de l&#39;avion</strong> (sa vitesse), d&#39;un <strong>vent de 25 kt</strong> pris en compte et d&#39;une <strong>inclinaison de 20° ou 3°/s</strong> (le moins incliné des deux).</p>\n",
"kind": "info"
},
{
"t": "Marges et minima",
"html": "<table><thead><tr><th>Catégorie</th><th>MOC</th><th>OCH minimale</th></tr></thead><tbody><tr><td><strong>A</strong></td><td><strong>90 m (295 ft)</strong></td><td><strong>120 m (394 ft)</strong></td></tr><tr><td><strong>B</strong></td><td>90 m (295 ft)</td><td>150 m (492 ft)</td></tr><tr><td><strong>C</strong></td><td><strong>120 m (394 ft)</strong></td><td>180 m (591 ft)</td></tr><tr><td><strong>D</strong></td><td>120 m (394 ft)</td><td>210 m (689 ft)</td></tr><tr><td><strong>E</strong></td><td><strong>150 m (492 ft)</strong></td><td>240 m (787 ft)</td></tr></tbody></table>\n<p>OCH = obstacle le plus haut de la zone de circling + MOC, mesurée depuis le seuil. La MDA/MDH ne peut pas être plus basse.</p>\n",
"kind": "info"
},
{
"t": "Descendre sous la MDA/MDH, seulement si :",
"html": "<ol><li>le <strong>seuil de piste est en vue</strong> ;</li><li>la marge d&#39;obstacles est maintenue et l&#39;avion est <strong>en position d&#39;atterrir</strong> ;</li><li>les <strong>références visuelles</strong> (piste ou balisage) sont acquises et peuvent être gardées.</li></ol>\n",
"kind": "info"
},
{
"t": "Perte des références visuelles en circling",
"html": "<ol><li><strong>Virage en montée vers la piste d&#39;atterrissage.</strong></li><li>Rejoindre la <strong>verticale du terrain</strong>.</li><li>De là, suivre la <strong>procédure d&#39;approche interrompue publiée</strong>.</li></ol>\n<p><strong>VPT (Visual Prescribed Track)</strong> : trajectoire à vue imposée en plus de la zone de circling, sur les terrains difficiles. Ex. : <strong>Ajaccio</strong>, où l&#39;approche aux instruments n&#39;existe que pour la piste 02. Pour atterrir en 20, on suit une VPT. La navigation se fait à vue, les moyens radio sont indicatifs. <strong>Minima élevés.</strong></p>\n",
"kind": "info"
},
{
"t": "Minima de décollage (militaire)",
"html": "<ul><li><strong>REAF, norme standard</strong> : minima de décollage = minima d&#39;atterrissage.</li><li><strong>Norme particulière</strong> : <strong>carte blanche</strong> → VIS/RVR <strong>≥ 1 600 m</strong> et plafond <strong>≥ 300 ft</strong> ; <strong>carte verte</strong> → VIS/RVR <strong>≥ 600 m</strong> et plafond <strong>≥ 100 ft</strong>.</li><li><strong>CPMRA</strong> : on ne décolle que s&#39;il existe <strong>au moins une possibilité d&#39;atterrissage</strong>, au départ comme à l&#39;arrivée.</li><li>Pour mémoire, en civil : <strong>RVR mini de décollage 400 m</strong>.</li></ul>\n",
"kind": "info"
},
{
"t": "Terrain de dégagement (REAF)",
"html": "<ul><li><strong>Norme standard</strong> : il faut <strong>2 possibilités d&#39;atterrissage</strong>, au départ comme à destination. Le dégagement est <strong>militaire si possible</strong>, et à <strong>30 min de vol en régime économique</strong> maximum.</li><li><strong>Norme particulière</strong> : <strong>1 seule possibilité</strong> suffit, ou un dégagement qui ne remplit pas ces conditions.</li></ul>\n",
"kind": "info"
},
{
"t": "📎 Complément : vitesses max en circling (slide)",
"html": "<p>A 100 kt · B 135 kt · C 180 kt · D 205 kt · E 240 kt.</p>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li>MOC : <strong>295 / 394 / 492 ft</strong> pour A-B / C-D / E.</li><li>Perte de vue en circling : on vire <strong>vers la piste</strong>, pas vers l&#39;extérieur.</li><li>Inclinaison en circling <strong>20°</strong> (contre 25° en attente et en demi-tour).</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Définissez le circling. Comment est construite la zone ?",
"Donnez les MOC et OCH minimales par catégorie.",
"À quelles conditions peut-on descendre sous la MDA en circling ?",
"Que faire en cas de perte des références visuelles ?",
"Qu'est-ce qu'une VPT ?",
"Minima de décollage et règles du terrain de dégagement en norme standard et particulière."
]
},
{
"code": "REG 16",
"name": "Attentes (holding)",
"cards": [
{
"t": "L’essentiel",
"html": "<p>Une <strong>attente</strong> est une manoeuvre publiée qui garde l&#39;avion dans un espace protégé (du trafic et du relief) en attendant une clairance, en général la <strong>clairance d&#39;approche</strong>. Elle sert à séparer les avions ou à attendre une amélioration météo, et se fait souvent sur l&#39;<strong>IAF</strong>. Le pilote doit rester dans la zone protégée et prévenir l&#39;ATC au plus tôt s&#39;il ne peut pas.</p>\n",
"kind": "info"
},
{
"t": "L'hippodrome",
"html": "<ul><li>Un <strong>point d&#39;attente</strong> (fix), une branche <strong>éloignement</strong> (outbound), une branche <strong>rapprochement</strong> (inbound), une zone de protection.</li><li><strong>Virages à droite en standard.</strong></li><li>Inclinaison <strong>25° ou 3°/s</strong>, le moins incliné des deux.</li><li><strong>Branche éloignement</strong> : <strong>1 min jusqu&#39;à 14 000 ft</strong> inclus, <strong>1 min 30 au-dessus</strong>. Ou une distance DME.</li><li>Le pilote corrige cap et temps selon le vent.</li></ul>\n<p><strong>Vitesses maximales en attente</strong> (standard OACI, la slide n&#39;était pas lisible) : <strong>230 kt jusqu&#39;au FL140</strong>, <strong>240 kt du FL140 au FL200</strong>, <strong>265 kt au-dessus du FL200</strong>, et <strong>Mach 0,83 au-dessus du FL340</strong>.</p>\n<p><strong>Les 3 entrées</strong> (secteurs séparés par une droite à <strong>70°</strong> de l&#39;axe, avec <strong>± 5°</strong> de tolérance)</p>\n<table><thead><tr><th>Entrée</th><th>Manoeuvre</th></tr></thead><tbody><tr><td><strong>Directe</strong></td><td>Arrivé sur le point, on vire à droite et on suit l&#39;attente</td></tr><tr><td><strong>Parallèle</strong></td><td>Sur le point, on vire pour voler <strong>parallèlement à l&#39;axe, côté non-attente</strong>, pendant 1 min (ou 1 min 30, ou DME). Puis virage <strong>à gauche</strong> vers le côté attente pour revenir sur le point</td></tr><tr><td><strong>Décalée (offset)</strong></td><td>Sur le point, on prend un cap à <strong>30°</strong> de l&#39;axe d&#39;éloignement, <strong>côté attente</strong>, pendant 1 min (max 1 min 30). Puis virage <strong>à droite</strong> pour intercepter le rapprochement</td></tr></tbody></table>\n<p>Attente VOR/DME : entrée possible par un point secondaire, <strong>seulement sur clairance ATC</strong>.</p>\n",
"kind": "info"
},
{
"t": "Protection",
"html": "<ul><li><strong>Zone d&#39;attente</strong> = l&#39;hippodrome + la zone d&#39;entrée. <strong>Zone tampon</strong> de <strong>5 NM</strong> autour.</li><li><strong>Niveau minimal d&#39;attente</strong> : <strong>300 m (984 ft)</strong> au-dessus des obstacles, <strong>600 m (1 969 ft)</strong> en montagne.</li></ul>\n",
"kind": "info"
},
{
"t": "Gestion de l'attente",
"html": "<ul><li><strong>Navette (shuttle)</strong> : descendre ou monter dans l&#39;attente.</li><li><strong>Un avion par niveau</strong>, séparés de <strong>1 000 ft</strong> (ou 2 000 ft, ou 5 min).</li><li><strong>Le premier arrivé est le plus bas</strong>, et c&#39;est <strong>le plus bas qui sort en premier</strong>. Utile en cas de panne radio.</li><li>Attente pour amélioration météo : <strong>en haut de la pile</strong>, pour ne pas gêner ceux qui font l&#39;approche.</li></ul>\n",
"kind": "info"
},
{
"t": "ETA et EAT",
"html": "<ul><li><strong>ETA</strong> : heure estimée <strong>par le pilote</strong> de son arrivée sur l&#39;IAF.</li><li><strong>EAT</strong> (Expected Approach Time) : heure à laquelle <strong>l&#39;ATC</strong> pense que l&#39;avion quittera l&#39;attente pour commencer son approche.</li><li>EAT calculée si le retard est de <strong>10 min ou plus</strong>. Transmise au plus vite si le retard est de <strong>30 min ou plus</strong>. Une EAT révisée est transmise si elle change de <strong>5 min ou plus</strong>.</li></ul>\n",
"kind": "info"
},
{
"t": "📎 Complément : vitesses max en attente (slide)",
"html": "<table><tr><th>Niveau</th><th>Normal</th><th>Turbulence</th></tr><tr><td>Jusqu'à 14 000 ft</td><td>230 kt (170 kt cat. A/B)</td><td>280 kt (170 kt cat. A/B)</td></tr><tr><td>14 000 à 20 000 ft</td><td>240 kt</td><td>280 kt ou M 0,83, le plus faible</td></tr><tr><td>20 000 à 34 000 ft</td><td>265 kt</td><td>280 kt ou M 0,83, le plus faible</td></tr><tr><td>Au-dessus de 34 000 ft</td><td>M 0,83</td><td>M 0,83</td></tr></table>\n<p>Entrée selon l'écart entre ton cap d'arrivée et l'axe de rapprochement (main droite) : de −70° à +110° → directe ; de +110° à 180° → décalée ; de −70° à −180° → parallèle.</p>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li><strong>Virages à droite</strong> par défaut.</li><li><strong>1 min sous 14 000 ft, 1 min 30 au-dessus.</strong></li><li><strong>ETA = pilote. EAT = ATC.</strong></li><li>Premier arrivé en bas, premier sorti.</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Définissez une attente et ses usages. Décrivez l'hippodrome.",
"Durée de la branche d'éloignement ? Inclinaison ?",
"Décrivez les 3 entrées en attente.",
"Niveau minimal d'attente et zone tampon.",
"Comment se gère une pile d'attente ? Qui sort en premier ?",
"Différence entre ETA et EAT. Quand l'EAT est-elle calculée, transmise, révisée ?"
]
},
{
"code": "REG 17",
"name": "Information aéronautique (AIS)",
"cards": [
{
"t": "L’essentiel",
"html": "<p>Le <strong>service d&#39;information aéronautique (AIS)</strong> (Annexe 15 OACI) transmet toute l&#39;information nécessaire à la sécurité, la régularité et l&#39;efficacité de la navigation aérienne. Chaque État reçoit, crée, publie et archive l&#39;information de sa zone. Le service fonctionne <strong>24 h/24</strong>, ou sinon pendant toute la durée d&#39;un vol dans sa zone, <strong>plus 2 h avant et après</strong>.</p>\n",
"kind": "info"
},
{
"t": "Les documents (I-AIP : Integrated Aeronautical Information Package)",
"html": "<table><thead><tr><th>Document</th><th>Durée</th><th>Contenu</th></tr></thead><tbody><tr><td><strong>AIP</strong> + amendements</td><td><strong>Permanent</strong></td><td>3 parties : <strong>GEN</strong> (généralités), <strong>ENR</strong> (en route), <strong>AD</strong> (aérodromes)</td></tr><tr><td><strong>SUP AIP</strong> (suppléments)</td><td><strong>Temporaire</strong></td><td>Ex. zones temporaires pour un exercice militaire</td></tr><tr><td><strong>NOTAM</strong>, ASHTAM, SNOWTAM, BIRDTAM</td><td><strong>Temporaire</strong>, court</td><td>Info urgente</td></tr><tr><td><strong>AIC</strong> (circulaires)</td><td>—</td><td>Explique un changement à venir de réglementation</td></tr><tr><td>Liste récapitulative</td><td>Mensuelle</td><td>NOTAM et SUP AIP en vigueur</td></tr></tbody></table>\n<p><strong>Le cycle AIRAC</strong> (pour les changements de l&#39;AIP)</p>\n<ul><li>Changements publiés à des dates communes, tous les <strong>28 jours</strong>.</li><li>Information diffusée <strong>au moins 42 jours</strong> avant la date d&#39;entrée en vigueur. <strong>Changements majeurs : 56 jours</strong> à l&#39;avance.</li><li>Concerne : règles et limites d&#39;espaces, pistes, procédures de départ, d&#39;attente et d&#39;approche, fréquences et indicatifs des moyens radio.</li></ul>\n",
"kind": "info"
},
{
"t": "Le NOTAM",
"html": "<ul><li>Pour une info <strong>temporaire et courte</strong> à diffuser vite, ou une info permanente qui doit être diffusée <strong>immédiatement</strong>.</li><li><strong>Numéroté par séries</strong> : A, B, D (aérodrome), C (région), <strong>M (militaire)</strong>. Le plus bref possible, en une seule transmission.</li><li><strong>Trigger NOTAM</strong> : annonce un amendement d&#39;AIP ou un nouveau SUP AIP. <strong>Validité : 14 jours max.</strong></li><li><strong>SNOWTAM</strong> : état de surface de la piste (neige, glace, eau, givre). <strong>Validité max 8 h.</strong> Chaque nouveau SNOWTAM annule le précédent. Unités métriques. Depuis le <strong>5 novembre 2020</strong>, il n&#39;est plus diffusé que par NOTAM (plus dans le METAR).</li><li><strong>ASHTAM</strong> : cendres volcaniques. <strong>BIRDTAM</strong> : oiseaux.</li></ul>\n",
"kind": "info"
},
{
"t": "Codes couleur des AIC",
"html": "<table><thead><tr><th>Couleur</th><th>Sujet</th></tr></thead><tbody><tr><td><strong>Blanc</strong></td><td>Administratif</td></tr><tr><td><strong>Jaune</strong></td><td>Services de la circulation aérienne</td></tr><tr><td><strong>Rose</strong></td><td>Sécurité</td></tr><tr><td><strong>Mauve</strong></td><td>Carte des zones dangereuses</td></tr><tr><td><strong>Vert</strong></td><td>Cartes</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Documentation militaire (DIRCAM)",
"html": "<ul><li><strong>MILAIP</strong>, <strong>MILNOTAM</strong> (série M), cartes en route France.</li><li><strong>MIAC 1</strong> : procédures aux instruments pour avions et hélicoptères <strong>militaires sur terrains civils</strong>.</li><li><strong>MIAC 2</strong> : avions de <strong>transport</strong> et hélicoptères sur <strong>terrains militaires</strong>.</li><li><strong>MIAC 4</strong> : <strong>avions de chasse</strong> sur terrains militaires.</li></ul>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li><strong>AIP = permanent. SUP AIP et NOTAM = temporaire.</strong></li><li>AIRAC : <strong>28 jours</strong> de cycle, <strong>42 jours</strong> de préavis, <strong>56 jours</strong> pour un changement majeur.</li><li><strong>SNOWTAM : 8 h max. Trigger NOTAM : 14 jours max.</strong></li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Rôle et horaires de l'AIS.",
"Composez l'I-AIP : quels documents, permanents ou temporaires ?",
"Quelles sont les 3 parties de l'AIP ?",
"Expliquez le cycle AIRAC et ses délais.",
"Qu'est-ce qu'un NOTAM, un trigger NOTAM, un SNOWTAM ? Leurs validités ?",
"Codes couleur des AIC. Que contiennent MIAC 1, 2 et 4 ?"
]
},
{
"code": "REG 18",
"name": "Aérodromes",
"cards": [
{
"t": "L’essentiel",
"html": "<p>L&#39;<strong>Annexe 14 OACI</strong> fixe les normes des aérodromes : largeur et pente des pistes et taxiways, longueur, résistance de la chaussée, freinage, secours incendie, balisage lumineux et marquages. Le <strong>point de référence (ARP)</strong> est le centre géométrique du terrain, publié à l&#39;AIS.</p>\n<p><strong>Code de référence = un chiffre + une lettre</strong></p>\n<ul><li><strong>Chiffre (1 à 4)</strong> : selon l&#39;<strong>ARFL</strong>, la distance de décollage de référence de l&#39;avion (à la masse max, au niveau de la mer, en ISA, sans vent ni pente). Repères OACI : 1 &lt; 800 m, 2 de 800 à 1 200 m, 3 de 1 200 à 1 800 m, 4 ≥ 1 800 m.</li><li><strong>Lettre (A à F)</strong> : selon l&#39;<strong>envergure</strong> et la <strong>voie du train principal</strong> (distance entre les roues extérieures).</li></ul>\n",
"kind": "info"
},
{
"t": "Taxiways",
"html": "<table><thead><tr><th>Lettre</th><th>Largeur</th><th>Marge roues-bord</th></tr></thead><tbody><tr><td>A</td><td>7,5 m</td><td>1,5 m</td></tr><tr><td>B</td><td>10,5 m</td><td>2,25 m</td></tr><tr><td>C</td><td>15 m (empattement &lt; 18 m) ou 18 m</td><td>3 m ou 4,5 m</td></tr><tr><td>D</td><td>18 m (voie &lt; 9 m) ou 23 m</td><td>4,5 m</td></tr><tr><td>E</td><td>23 m</td><td>4,5 m</td></tr><tr><td>F</td><td>25 m</td><td>4,5 m</td></tr></tbody></table>\n<p>Le <strong>cockpit</strong> reste sur l&#39;axe du taxiway.</p>\n",
"kind": "info"
},
{
"t": "Pentes maximales",
"html": "<ul><li><strong>Piste</strong> (entre son point le plus haut et le plus bas) : <strong>1 %</strong> pour les codes 3 et 4, <strong>2 %</strong> pour les codes 1 et 2.</li><li><strong>Taxiway</strong> : <strong>1,5 %</strong> pour les lettres C à F, <strong>3 %</strong> pour A et B.</li></ul>\n",
"kind": "info"
},
{
"t": "Les zones autour de la piste",
"html": "<table><thead><tr><th>Zone</th><th>Définition</th></tr></thead><tbody><tr><td><strong>Prolongement d&#39;arrêt (stopway)</strong></td><td>Au sol, en bout de piste, pour <strong>s&#39;arrêter</strong> après un décollage interrompu</td></tr><tr><td><strong>Prolongement dégagé (clearway)</strong></td><td>Au-dessus du sol ou de l&#39;eau, pour faire la <strong>montée initiale</strong>. Au plus la <strong>moitié de la TORA</strong></td></tr><tr><td><strong>Bande de piste (strip)</strong></td><td>Autour de la piste, pour limiter les dégâts en cas de sortie de piste. Obligatoire</td></tr><tr><td><strong>RESA</strong></td><td>Aire de sécurité d&#39;extrémité, après la bande, contre le dépassement de piste. <strong>Obligatoire</strong>, <strong>90 m mini</strong>, <strong>2 fois la largeur de la piste</strong>, <strong>pas incluse</strong> dans les distances déclarées</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Distances déclarées",
"html": "<table><thead><tr><th>Sigle</th><th>Définition</th></tr></thead><tbody><tr><td><strong>TORA</strong></td><td>Longueur utilisable pour le <strong>roulement</strong> au décollage</td></tr><tr><td><strong>TODA</strong></td><td><strong>TORA + clearway</strong></td></tr><tr><td><strong>ASDA</strong></td><td><strong>TORA + stopway</strong></td></tr><tr><td><strong>LDA</strong></td><td>Longueur utilisable pour l&#39;atterrissage</td></tr></tbody></table>\n<p><strong>Piste équilibrée</strong> : <strong>TODA = ASDA</strong>, c&#39;est-à-dire clearway = stopway.</p>\n<p><strong>Résistance de la chaussée</strong> : le <strong>PCN</strong> chiffre ce que la chaussée supporte, l&#39;<strong>ACN</strong> chiffre l&#39;effet de l&#39;avion. Il faut <strong>ACN ≤ PCN</strong>, sauf dérogation.</p>\n<p><strong>État de la piste</strong> (mesuré sur chaque tiers)</p>\n<ul><li><strong>Sèche</strong>, <strong>humide</strong> (changement de couleur), <strong>mouillée</strong> (trempée, sans flaques importantes), <strong>eau stagnante</strong> (flaques visibles).</li><li><strong>Piste contaminée</strong> : <strong>plus de 25 %</strong> de la surface utilisée couverte d&#39;<strong>eau ou de neige fondante de plus de 3 mm</strong>, de <strong>neige compactée</strong> ou de <strong>glace</strong>.</li><li>Neige : <strong>sèche</strong> (ne fait pas de boule), <strong>mouillée</strong> (fait une boule), <strong>compactée</strong> (bloc solide), <strong>fondante</strong> (slush : gorgée d&#39;eau, ça éclabousse).</li></ul>\n",
"kind": "info"
},
{
"t": "Sauvetage et lutte contre l'incendie (SSLIA / RFFS)",
"html": "<ul><li><strong>Catégories 1 à 10</strong>, selon la <strong>longueur</strong> et la <strong>largeur de fuselage</strong> du plus gros avion. Chaque catégorie impose une quantité d&#39;agent extincteur et 1 à 3 véhicules.</li><li>Moins de <strong>700 mouvements</strong> sur les 3 mois les plus chargés : une catégorie en dessous.</li><li><strong>Délai d&#39;intervention : 2 min</strong>, <strong>3 min max</strong>.</li></ul>\n<p><strong>Au sol</strong> : pendant l&#39;embarquement ou le débarquement, assez de sorties dégagées pour une évacuation rapide, du personnel formé et un extincteur contre un feu de carburant. Les <strong>véhicules cèdent toujours le passage aux avions</strong>. Le <strong>bureau de piste (ATC reporting office)</strong> est signalé par un <strong>C noir sur fond jaune</strong>.</p>\n",
"kind": "info"
},
{
"t": "Indicateurs de pente d'approche",
"html": "<ul><li><strong>VASIS</strong> (2 ou 3 barres), <strong>T-VASIS</strong>, <strong>PAPI</strong>. Visibles à <strong>8 km de jour</strong> et <strong>32 km de nuit</strong>.</li><li><strong>PAPI</strong> (à gauche de la piste) : <strong>2 blancs + 2 rouges = sur le plan</strong>. Plus de blancs = trop haut. Plus de rouges = trop bas.</li></ul>\n",
"kind": "info"
},
{
"t": "Balisage lumineux",
"html": "<table><thead><tr><th>Élément</th><th>Couleur</th></tr></thead><tbody><tr><td>Bords de piste</td><td><strong>Blanc</strong>, tous les <strong>60 m</strong> (piste aux instruments)</td></tr><tr><td>Seuil</td><td><strong>Vert</strong></td></tr><tr><td>Extrémité de piste</td><td><strong>Rouge</strong></td></tr><tr><td>Axe de piste (CAT II/III)</td><td><strong>Blanc</strong>, puis <strong>rouge et blanc alternés de 900 à 300 m</strong> de la fin, puis <strong>rouge sur les 300 derniers mètres</strong></td></tr><tr><td>Feux d&#39;identification de seuil</td><td><strong>Blancs à éclats</strong>, de part et d&#39;autre du seuil</td></tr><tr><td>Barres de flanc (wing bars)</td><td>2 barres de 5 feux de chaque côté du seuil</td></tr><tr><td>Axe de taxiway</td><td><strong>Vert</strong> (60 m max)</td></tr><tr><td>Bords de taxiway</td><td><strong>Bleu</strong> (60 m max)</td></tr></tbody></table>\n<ul><li>Rampe d&#39;approche surélevée : <strong>fragile</strong> sur les <strong>300 derniers mètres</strong>. Au-delà, seuls les 12 m supérieurs doivent l&#39;être.</li><li><strong>Barres d&#39;arrêt</strong> (stop bars) sur les pistes CAT II/III, et feux de protection de piste.</li><li><strong>Obstacles</strong> : <strong>rouge fixe</strong> basse intensité sous <strong>45 m</strong> ; <strong>rouge ou blanc à éclats</strong> moyenne intensité de <strong>45 à 150 m</strong> ; <strong>blanc à éclats</strong> haute intensité au-dessus de <strong>150 m</strong> (et câbles).</li><li><strong>Véhicules</strong> : secours <strong>bleu à éclats</strong>, service <strong>jaune à éclats</strong>, passerelles <strong>rouge fixe</strong>.</li><li><strong>Manche à air</strong> : au moins une <strong>éclairée la nuit</strong>.</li><li><strong>Projecteur de la tour</strong> : rouge, vert et blanc, orientable à la main, change vite de couleur, peut clignoter.</li></ul>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li><strong>TODA = TORA + clearway. ASDA = TORA + stopway.</strong> Le stopway sert à s&#39;arrêter, le clearway à monter.</li><li>La <strong>RESA n&#39;est pas</strong> dans les distances déclarées.</li><li><strong>Taxiway : axe vert, bords bleus. Piste : bords blancs, seuil vert, fin rouge.</strong></li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Comment est construit le code de référence d'un aérodrome ?",
"Définissez stopway, clearway, bande de piste et RESA.",
"Définissez TORA, TODA, ASDA et LDA. Qu'est-ce qu'une piste équilibrée ?",
"Quand une piste est-elle contaminée ?",
"Catégories et délai d'intervention du SSLIA.",
"Lecture d'un PAPI. Couleurs du balisage de piste, d'axe CAT II/III et de taxiway."
]
},
{
"code": "REG 19",
"name": "Situations d'urgence (contingencies)",
"cards": [
{
"t": "L’essentiel",
"html": "<p>Les <strong>contingencies</strong> sont les situations imprévues qui ont leurs propres procédures : panne radio, panne de transpondeur, intervention illicite, descente d&#39;urgence, panne radar ATS, détresse, urgence, avion égaré, vidange carburant, changement d&#39;indicatif. <strong>Première règle : piloter l&#39;avion.</strong></p>\n",
"kind": "info"
},
{
"t": "1. Panne radio",
"html": "<ul><li><strong>D&#39;abord vérifier</strong> : radio allumée, volume, casque branché, bonne fréquence, station ouverte et à portée. Réessayer 2 ou 3 fois, puis tenter d&#39;autres stations.</li><li>Si ça échoue : <strong>7600</strong>. Tenter le CPDLC si l&#39;avion l&#39;a. (IFR militaire : <strong>7601</strong>.)</li><li><strong>On émet tous ses messages deux fois</strong>, avec la mention <strong>« transmitting blind »</strong> (émission en l&#39;air).</li></ul>\n<table><thead><tr><th>Situation</th><th>Conduite</th></tr></thead><tbody><tr><td><strong>Panne d&#39;émetteur</strong> (on entend le trafic)</td><td>En <strong>VMC</strong> : rester VMC et <strong>atterrir sur le terrain convenable le plus proche</strong>. En <strong>IMC</strong> : le contrôleur peut donner des ordres et demander une réponse par changement de code, IDENT ou un cap</td></tr><tr><td><strong>Panne de récepteur</strong> (on n&#39;entend rien), en <strong>VMC</strong></td><td>Rester VMC et atterrir sur le terrain convenable le plus proche</td></tr><tr><td><strong>Panne de récepteur, en IMC</strong></td><td>Suivre la <strong>route du plan de vol</strong>. Garder niveau et vitesse <strong>20 min</strong> (ou <strong>7 min</strong> sous service radar), puis suivre le plan de vol déposé jusqu&#39;à destination</td></tr></tbody></table>\n<ul><li><strong>À l&#39;arrivée en IMC</strong> : attente sur l&#39;<strong>IAF</strong>, au <strong>niveau le plus haut publié</strong>, jusqu&#39;à la dernière <strong>EAT</strong> accusée, ou à défaut l&#39;<strong>ETA</strong>. Puis approche publiée pour panne radio. Atterrir si possible <strong>dans les 30 min</strong> suivant cette heure.</li><li><strong>Après l&#39;atterrissage</strong>, prévenir l&#39;ATC au plus vite.</li><li>Les signaux lumineux de la tour s&#39;appliquent (voir REG 01-03). En plus : <strong>rouge et vert alternés = extrême prudence</strong>.</li></ul>\n<p><strong>2. Panne de transpondeur</strong> (obligatoire en espace contrôlé)</p>\n<ul><li><strong>Avant le vol</strong> : prévenir l&#39;ATC, le vol peut être annulé. S&#39;il est impossible de réparer sur place, l&#39;avion peut être autorisé à rejoindre le terrain le plus proche où réparer.</li><li><strong>Après le départ, avant le 1er transfert</strong> : l&#39;ATC peut accepter de laisser l&#39;avion continuer ou non.</li><li><strong>Après le 1er transfert</strong> : l&#39;ATC peut refuser la suite du vol. Retour au départ ou atterrissage sur le terrain le plus proche.</li></ul>\n",
"kind": "info"
},
{
"t": "3. Intervention illicite (détournement)",
"html": "<ul><li>Codes <strong>7500</strong> (et 7700).</li><li>L&#39;ATS anticipe les demandes, transmet les infos utiles <strong>sans attendre de réponse</strong>, coordonne avec les centres voisins, prévient l&#39;exploitant et le RCC.</li><li>Le pilote signale l&#39;intervention s&#39;il le peut. Sinon, il vole à un niveau <strong>décalé de 500 ft</strong> (ou 1 000 ft) par rapport aux niveaux IFR normaux.</li></ul>\n<p><strong>4. Panne radar ATS</strong> : l&#39;ATS reporte les positions de tous les avions identifiés et passe en <strong>séparation aux procédures</strong>. En attendant, il peut temporairement séparer les avions de <strong>la moitié</strong> de la séparation verticale normale.</p>\n",
"kind": "info"
},
{
"t": "5. Détresse (MAYDAY)",
"html": "<ul><li><strong>Danger grave ou imminent, besoin d&#39;aide immédiate.</strong></li><li><strong>MAYDAY ×3</strong> + organisme appelé + indicatif + nature + intentions + position, niveau, cap. Sur la fréquence en cours, ou <strong>121,5 / 243,0 MHz</strong>. Transpondeur <strong>7700</strong>, message CPDLC, mode urgence ADS-B.</li><li>L&#39;ATS accuse réception immédiatement (<strong>« Roger Mayday »</strong>) et peut imposer le <strong>silence</strong> (« Stop transmitting Mayday »).</li><li>Fin : le pilote dit <strong>« Cancel Mayday »</strong>, l&#39;ATS « Distress traffic ended ».</li><li><strong>ELT</strong> : émet sur <strong>121,5 et 406 MHz</strong> (243 MHz autorisé).</li></ul>\n",
"kind": "info"
},
{
"t": "6. Urgence (PAN PAN)",
"html": "<ul><li>Concerne la sécurité d&#39;un avion ou d&#39;une personne à bord, <strong>sans besoin d&#39;aide immédiate</strong>.</li><li><strong>PAN PAN ×3</strong>, sur la fréquence en cours. L&#39;ATS accuse réception.</li><li><strong>PAN PAN MEDICAL</strong> (« MAY-DEE-CAL ») : transport sanitaire.</li></ul>\n<p><strong>7. Avion égaré ou non identifié</strong> : l&#39;ATS essaie de le contacter, cherche sa position par tous les moyens, prévient les centres voisins et <strong>les unités militaires</strong>, puis lui donne sa position et la correction à faire.</p>\n<p><strong>8. Vidange de carburant (fuel dumping)</strong> : pour réduire la masse à l&#39;atterrissage en urgence.</p>\n<ul><li>En espace contrôlé, le pilote coordonne avec l&#39;ATC la <strong>route</strong>, le <strong>niveau</strong> et la <strong>durée</strong>.</li><li>Séparation des autres trafics : <strong>10 NM</strong> latéralement (jusqu&#39;à 50 NM ou 15 min derrière selon le cas), <strong>1 000 ft au-dessus</strong> et <strong>3 000 ft en dessous</strong>.</li><li><strong>Hauteur minimale : 6 000 ft.</strong></li></ul>\n<p><strong>9. Changement d&#39;indicatif</strong> : l&#39;ATC peut faire changer temporairement d&#39;indicatif si deux indicatifs se ressemblent trop, seulement dans l&#39;espace concerné. Retour à l&#39;indicatif du plan de vol avant le transfert.</p>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li>Panne de récepteur en IMC : <strong>20 min</strong>, ou <strong>7 min</strong> sous radar, avant de changer de niveau.</li><li>On émet <strong>deux fois</strong> avec « transmitting blind ».</li><li>Vidange : <strong>1 000 ft au-dessus, 3 000 ft en dessous</strong> (le carburant descend).</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Que vérifier avant de déclarer une panne radio ? Quel code afficher ?",
"Conduite à tenir en panne d'émetteur, en panne de récepteur en VMC, puis en IMC jusqu'à l'atterrissage.",
"Que se passe-t-il en cas de panne de transpondeur avant ou après le 1er transfert ?",
"Intervention illicite : codes, rôle de l'ATS, conduite du pilote.",
"Différence entre détresse et urgence : messages, codes, fréquences.",
"Règles de la vidange carburant."
]
},
{
"code": "COM 01",
"name": "Service des télécommunications aéronautiques",
"cards": [
{
"t": "L’essentiel",
"html": "<p>Le service international des télécommunications aéronautiques regroupe <strong>4 services</strong> :</p>\n<table><thead><tr><th>Sigle</th><th>Service</th><th>Rôle</th></tr></thead><tbody><tr><td><strong>ARNS</strong></td><td>Radionavigation aéronautique</td><td>Toutes les aides radio (VOR, ADF…) et la radiogoniométrie</td></tr><tr><td><strong>AFS</strong></td><td>Service fixe</td><td>Communications <strong>sol-sol</strong> (réseau <strong>AFTN</strong>, par téléscripteur)</td></tr><tr><td><strong>AMS</strong></td><td>Service mobile</td><td>Communications <strong>air-sol</strong> (voir COM 02)</td></tr><tr><td><strong>ABS</strong></td><td>Radiodiffusion</td><td>Diffusions à tous (« ALL STATIONS, THIS IS… »), <strong>100 mots/min max</strong></td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Radiogoniométrie (ARNS)",
"html": "<ul><li>Une station seule donne seulement la <strong>direction</strong> de l&#39;avion par rapport à elle. Plusieurs stations ensemble donnent une <strong>position</strong>.</li><li>Position donnée par rapport à un aérodrome, un repère géographique ou une ville connue, ou en latitude-longitude (ex. 45°26&#39;N 006°39&#39;W).</li><li>Le pilote <strong>collationne</strong> tous les messages de radiogoniométrie, suivis de son indicatif.</li></ul>\n",
"kind": "info"
},
{
"t": "Code Q",
"html": "<table><thead><tr><th>Code</th><th>Sens</th></tr></thead><tbody><tr><td><strong>QDM</strong></td><td><strong>Cap magnétique pour rejoindre la station</strong> (sans vent)</td></tr><tr><td><strong>QDR</strong></td><td><strong>Relèvement magnétique depuis la station</strong></td></tr><tr><td><strong>QTE</strong></td><td>Relèvement <strong>vrai</strong> de l&#39;avion depuis la station</td></tr><tr><td><strong>QUJ</strong></td><td>Route <strong>vraie</strong> de l&#39;avion vers la station</td></tr><tr><td><strong>QDL</strong></td><td>Série de QDM</td></tr><tr><td><strong>QGE</strong></td><td><strong>Distance</strong> jusqu&#39;à la station</td></tr></tbody></table>\n<p><strong>QDR = QDM ± 180°.</strong></p>\n",
"kind": "info"
},
{
"t": "Classes de relèvement",
"html": "<table><thead><tr><th>Classe</th><th>Précision</th></tr></thead><tbody><tr><td><strong>A</strong></td><td>± 2° (position à 5 NM)</td></tr><tr><td><strong>B</strong></td><td>± 5° (20 NM)</td></tr><tr><td><strong>C</strong></td><td>± 10° (50 NM)</td></tr><tr><td><strong>D</strong></td><td>Moins précis que C</td></tr></tbody></table>\n<p>Ex. : « FRABC, Salon Approach, QDM 050, classe B ».</p>\n<p><strong>Indicateur d&#39;emplacement OACI</strong> : 4 lettres. Ex. <strong>LFBC</strong> = L (Europe du Sud) + F (France) + B (région de Bordeaux) + C (Cazaux).</p>\n",
"kind": "info"
},
{
"t": "Abréviations horaires",
"html": "<table><thead><tr><th></th><th>Estimée</th><th>Réelle</th></tr></thead><tbody><tr><td>Départ</td><td>ETD</td><td>ATD</td></tr><tr><td>Passage</td><td>ETO</td><td>ATO</td></tr><tr><td>Arrivée</td><td>ETA</td><td>ATA</td></tr></tbody></table>\n<ul><li><strong>EAT</strong> : heure d&#39;approche prévue. <strong>EET</strong> : durée estimée.</li><li><strong>HJ</strong> : du lever au coucher du soleil. <strong>HN</strong> : du coucher au lever. <strong>H24</strong> : jour et nuit. <strong>HO</strong> : selon les besoins opérationnels. <strong>HS</strong> : selon les horaires des vols réguliers. <strong>HX</strong> : sans horaire précis. <strong>SR / SS</strong> : lever / coucher du soleil.</li></ul>\n<p><strong>Abréviations à connaître par cœur</strong> (liste du cours) : ABM (travers), ADR (route à service consultatif), AFIL, AIP, AIS, ALTN (dégagement), ATIS, ATZ, CTA, CTR, FIC, FIR, FNA (approche finale), LMT (heure locale), LTA, LVP (procédures faible visibilité), MLS, MSL, O/R (sur demande), PPR (autorisation préalable requise), SAR, SR, SS, SSR, TIL (jusqu&#39;à), UFN (jusqu&#39;à nouvel avis), UTC, WIP (travaux en cours).</p>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li><strong>QDM = vers la station. QDR = depuis la station.</strong> Tous deux magnétiques. QTE et QUJ sont en <strong>vrai</strong>.</li><li><strong>Classe A = la plus précise</strong> (± 2°).</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Citez les 4 services de télécommunications aéronautiques et leurs rôles.",
"Définissez QDM, QDR, QTE, QUJ et QGE.",
"Donnez les classes de relèvement et leur précision.",
"Comment se lit un indicateur d'emplacement OACI ? Exemple.",
"Signification de HJ, HN, H24, HO, PPR, UFN, WIP."
]
},
{
"code": "COM 02",
"name": "AMS (service mobile aéronautique)",
"cards": [
{
"t": "L’essentiel",
"html": "<p>L&#39;<strong>AMS</strong> couvre les communications <strong>air-sol</strong>. Les messages ont un <strong>ordre de priorité</strong> strict.</p>\n",
"kind": "info"
},
{
"t": "Ordre de priorité des messages",
"html": "<ol><li><strong>Détresse</strong></li><li><strong>Urgence</strong></li><li>Radiogoniométrie</li><li>Sécurité des vols</li><li>Météo</li><li>Régularité des vols</li></ol>\n",
"kind": "info"
},
{
"t": "Détresse : MAYDAY",
"html": "<ul><li><strong>Danger grave et/ou imminent, besoin d&#39;aide immédiate.</strong></li><li>Message : <strong>MAYDAY ×3</strong>, station appelée, indicatif, nature de la détresse, intentions, position, niveau, cap. Ex. : « MAYDAY MAYDAY MAYDAY, Cazaux Approach, Riquet 21, panne d&#39;oxygène, demande descente FL80, 240° de la station à 30 NM, FL160, cap 040. »</li><li><strong>7700</strong>, sur la fréquence en cours ou <strong>121,5 MHz</strong>. Phraséologie française acceptée pour un pilote français.</li><li>La station qui reçoit : accusé de réception <strong>immédiat</strong> (« <strong>Roger Mayday</strong> »), puis <strong>imposition du silence</strong> aux autres (« <strong>Stop transmitting Mayday</strong> »).</li><li>Fin : l&#39;avion dit « <strong>Cancel Mayday</strong> », l&#39;ATS dit « <strong>Distress traffic ended</strong> ».</li><li><strong>ELT</strong> : 121,5 et 406 MHz (243 MHz autorisé).</li></ul>\n",
"kind": "info"
},
{
"t": "Urgence : PAN PAN",
"html": "<ul><li>Concerne la <strong>sécurité d&#39;un avion ou d&#39;une personne</strong> à bord, <strong>sans besoin d&#39;aide immédiate</strong>.</li><li>Message : <strong>PAN PAN ×3</strong>, station, indicatif, nature, demande, position. Ex. : passager inconscient, demande priorité à l&#39;atterrissage et assistance médicale.</li><li><strong>PAN PAN MEDICAL</strong> (prononcé « MAY-DEE-CAL ») : transport sanitaire.</li><li>Sur la fréquence en cours. Accusé de réception immédiat. <strong>Pas de phraséologie imposée</strong> pour l&#39;accusé, le silence ou la fin.</li></ul>\n",
"kind": "info"
},
{
"t": "Les autres messages",
"html": "<table><thead><tr><th>Type</th><th>Exemples</th></tr></thead><tbody><tr><td><strong>Sécurité des vols</strong></td><td>Échanges contrôleur-pilote de la mise en route à la fin du vol ; météo d&#39;intérêt immédiat pour un avion en vol ou au départ</td></tr><tr><td><strong>Météo</strong></td><td>Infos météo sans intérêt immédiat : <strong>VOLMET, ATIS, AIREP</strong></td></tr><tr><td><strong>Régularité des vols</strong></td><td>Maintenance, changements d&#39;équipage ou de passagers, d&#39;horaires</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li><strong>Détresse = aide immédiate. Urgence = pas d&#39;aide immédiate.</strong></li><li>Les <strong>phraséologies d&#39;accusé, de silence et de fin n&#39;existent qu&#39;en détresse</strong>, pas en urgence.</li><li>La météo d&#39;intérêt immédiat est un message de <strong>sécurité</strong>, pas un message météo.</li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Donnez l'ordre de priorité des messages.",
"Rédigez un message de détresse complet. Que fait la station qui le reçoit ?",
"Différence entre détresse et urgence. Qu'est-ce qu'un PAN PAN MEDICAL ?",
"Donnez un exemple de message de sécurité, de météo et de régularité."
]
},
{
"code": "COM 04",
"name": "Indicatifs et collationnement",
"cards": [
{
"t": "L’essentiel",
"html": "<p>L&#39;<strong>indicatif d&#39;une station</strong> = <strong>nom du lieu + suffixe du service</strong>. Le nom ou le suffixe peut être omis une fois la liaison établie, s&#39;il n&#39;y a pas de confusion possible.</p>\n",
"kind": "info"
},
{
"t": "Suffixes des stations",
"html": "<table><thead><tr><th>Suffixe</th><th>Service</th></tr></thead><tbody><tr><td><strong>CONTROL</strong></td><td>Contrôle régional (ACC)</td></tr><tr><td><strong>APPROACH</strong></td><td>Approche (sans radar)</td></tr><tr><td><strong>ARRIVAL / DEPARTURE</strong></td><td>Approche radar, arrivées / départs</td></tr><tr><td><strong>TOWER</strong></td><td>Contrôle d&#39;aérodrome</td></tr><tr><td><strong>GROUND</strong></td><td>Contrôle au sol</td></tr><tr><td><strong>RADAR</strong></td><td>Radar en général</td></tr><tr><td><strong>PRECISION</strong></td><td>Radar d&#39;approche de précision (PAR)</td></tr><tr><td><strong>HOMER</strong></td><td>Radiogoniomètre</td></tr><tr><td><strong>INFORMATION</strong></td><td>Information de vol</td></tr><tr><td><strong>DELIVERY</strong></td><td>Délivrance des clairances</td></tr><tr><td><strong>APRON</strong></td><td>Gestion de l&#39;aire de trafic</td></tr><tr><td><strong>DISPATCH</strong></td><td>Compagnie</td></tr><tr><td><strong>RADIO</strong></td><td>Station aéronautique</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "Indicatifs d'avion",
"html": "<table><thead><tr><th>Type</th><th>Complet</th><th>Abrégé</th></tr></thead><tbody><tr><td><strong>a</strong> : immatriculation</td><td>F-UAVC</td><td>1er caractère + au moins les 2 derniers : <strong>F-VC</strong> ou F-AVC</td></tr><tr><td><strong>b</strong> : compagnie + 4 derniers caractères de l&#39;immatriculation</td><td>AIR FRANCE UAVC</td><td>Compagnie + au moins les 2 derniers : AIR FRANCE VC</td></tr><tr><td><strong>c</strong> : compagnie + numéro de vol</td><td>AIR FRANCE 287</td><td><strong>Pas d&#39;abréviation</strong></td></tr></tbody></table>\n<ul><li>Avec un préfixe de type d&#39;avion : BOEING F-UAVC → BOEING VC.</li><li><strong>Premier contact : indicatif complet.</strong> Le pilote n&#39;utilise l&#39;indicatif abrégé <strong>qu&#39;après que le contrôleur l&#39;a utilisé</strong>.</li><li><strong>HEAVY</strong> (masse max au décollage <strong>≥ 136 t</strong>) ou <strong>SUPER</strong> (A380) : à ajouter juste après l&#39;indicatif au premier appel à l&#39;approche et à la tour, au départ comme à l&#39;arrivée.</li></ul>\n",
"kind": "info"
},
{
"t": "Essai radio",
"html": "<ul><li>Pilote : station appelée + indicatif + « <strong>RADIO CHECK</strong> » + fréquence. Ex. : « Salon Approach, Mistral 66, radio check on 122,10. »</li><li>Réponse : indicatif + station + lisibilité. Ex. : « Mistral 66, Salon Approach, I read you 5. »</li></ul>\n",
"kind": "info"
},
{
"t": "Échelle de lisibilité",
"html": "<table><thead><tr><th>Note</th><th>Sens</th></tr></thead><tbody><tr><td><strong>1</strong></td><td>Illisible</td></tr><tr><td><strong>2</strong></td><td>Lisible par moments</td></tr><tr><td><strong>3</strong></td><td>Lisible avec difficulté</td></tr><tr><td><strong>4</strong></td><td>Lisible</td></tr><tr><td><strong>5</strong></td><td>Parfaitement lisible</td></tr></tbody></table>\n",
"kind": "info"
},
{
"t": "À collationner obligatoirement",
"html": "<ul><li>Clairances de route ATC : niveau, cap, vitesse, taux, SID, STAR.</li><li>Infos de radiogoniométrie (VDF).</li><li><strong>Entrer, traverser, remonter une piste.</strong> <strong>Décoller, atterrir.</strong> <strong>Attendre avant une piste.</strong></li><li><strong>Piste en service</strong>, <strong>calages altimétriques</strong>, <strong>codes transpondeur</strong>.</li><li>Instructions de roulage et de remorquage, limite de clairance.</li><li><strong>CTOT</strong>, <strong>changements de fréquence</strong>, type de service radar, <strong>niveau de transition</strong>.</li><li><strong>Clairances conditionnelles</strong> (« derrière l&#39;avion qui atterrit, alignez-vous… »).</li></ul>\n",
"kind": "info"
},
{
"t": "Pièges",
"html": "<ul><li>L&#39;indicatif <strong>type c</strong> (compagnie + numéro de vol) <strong>ne s&#39;abrège jamais</strong>.</li><li>On n&#39;abrège <strong>jamais avant le contrôleur</strong>.</li><li><strong>HEAVY = 136 t et plus.</strong></li></ul>\n",
"kind": "trap"
}
],
"oral": [
"Comment est formé l'indicatif d'une station ? Donnez 6 suffixes.",
"Les 3 types d'indicatifs d'avion et leurs formes abrégées.",
"Quand peut-on utiliser l'indicatif abrégé ? Quand dit-on HEAVY ?",
"Rédigez un essai radio et sa réponse. Donnez l'échelle de lisibilité.",
"Quels éléments doit-on obligatoirement collationner ?"
]
}
];
