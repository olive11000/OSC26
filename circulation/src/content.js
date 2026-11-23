// Contenu pédagogique — fidèle au cours EISPN « Principle of general circulation » (050-02-03-01)
// cam : lat, lon (°), dist (rayons terrestres) · L : couches affichées
export const STEPS = [
  {
    title: 'La circulation générale',
    en: ['General circulation'],
    body: `<p>C'est l'ensemble des <b>grands courants d'air dominants</b>, presque horizontaux, qui font le tour de la planète.</p>
<p>On regarde à <b>très grande échelle</b> : des ensembles nuageux de plus de <b>1 000 km</b> qui vivent plusieurs semaines, voire plusieurs mois. Le temps de réaction du système est d'environ <b>un mois</b>.</p>
<p>L'atmosphère est très fine : quelques dizaines de km d'épaisseur pour une Terre de 12 700 km, comme la peau d'une pomme. Les mouvements <b>horizontaux dominent</b>, mais les mouvements <b>verticaux sont essentiels</b> : ce sont eux qui fabriquent les nuages et les cellules.</p>`,
    keep: ['Courants horizontaux dominants, à grande échelle', 'Échelle de temps ≈ 1 mois', 'Ensembles nuageux > 1 000 km, plusieurs semaines à mois', 'Atmosphère mince : horizontal prédominant, vertical essentiel'],
    cam: { lat: 18, lon: -25, dist: 3.8 }, auto: true,
    L: { clouds: 0.95, grid: 0 },
  },
  {
    title: 'Ce que montrent les satellites',
    en: ['Cloud organisation', 'ITCZ'],
    body: `<p>Vue de l'espace, la Terre est rangée en <b>bandes</b>, toujours dans le même ordre :</p>
<ul><li><b>Équateur météo (ZCIT)</b> : nuages épais et denses, une couronne d'énormes cumulonimbus.</li>
<li><b>Subtropiques (~20-35°)</b> : ciel clair ou nuages fins. C'est là que sont les grands déserts.</li>
<li><b>Latitudes moyennes</b> : nuages en <b>tourbillons</b>, souvent bien développés : ce sont les perturbations.</li>
<li><b>Pôles</b> : ciel clair ou nuages bas.</li></ul>
<p>Fais tourner le globe : les bandes font tout le tour de la planète.</p>`,
    keep: ['ZCIT : nuages épais et denses (gros CB)', 'Subtropiques : ciel clair ou nuages fins', 'Moyennes latitudes : nuages en tourbillons', 'Pôles : ciel clair ou nuages bas'],
    cam: { lat: 10, lon: -30, dist: 3.25 },
    L: { clouds: 1, grid: 1, labels: 'clouds' },
  },
  {
    title: 'Le moteur : le déséquilibre thermique',
    en: ['Thermal imbalance', 'Surplus', 'Deficit'],
    body: `<p>Le Soleil frappe l'<b>équateur</b> presque à la verticale : beaucoup d'énergie sur une petite surface. Aux <b>pôles</b>, les rayons arrivent <b>rasants</b> et l'énergie s'étale sur une grande surface.</p>
<p>L'axe de la Terre est incliné de <b>23°26'</b> : c'est ce qui crée les saisons.</p>
<p>Entre environ <b>35-40°N et 35-40°S</b>, la Terre reçoit plus qu'elle ne perd : <b style="color:#ff7a5c">EXCÉDENT</b>. Vers les pôles, elle perd plus qu'elle ne reçoit : <b style="color:#6aa8ff">DÉFICIT</b>.</p>
<p>Pour rééquilibrer, la nature fait deux choses :</p>
<ul><li>des <b>transferts méridiens</b> : courants océaniques et atmosphériques vers les pôles ;</li>
<li>des <b>transferts verticaux</b> : convection, évaporation, condensation.</li></ul>`,
    keep: ['Excédent aux basses latitudes, déficit aux hautes latitudes', 'Inclinaison de l’axe : 23°26’ → saisons', 'Rééquilibrage : transferts méridiens (océan + atmosphère) et verticaux (convection, évaporation, condensation)'],
    cam: { lat: 8, lon: 10, dist: 3.75 },
    L: { clouds: 0, rad: 1, rays: 1, grid: 1, chart: 1, labels: 'rad' },
  },
  {
    title: "À l'équateur : la ZCIT",
    en: ['ITCZ (doldrums)', 'Convergence', 'Instability'],
    body: `<p>À l'équateur, <b>tout est réuni</b> pour une convection très forte :</p>
<ul><li>de la <b>chaleur</b> (énergie) ;</li><li>beaucoup d'<b>humidité</b> (absolue et relative) ;</li>
<li>la <b>chaleur latente</b> libérée quand la vapeur se condense ;</li><li>une troposphère <b>très épaisse</b> : la tropopause est haute, vers 16-17 km ;</li>
<li>de la <b>convergence</b> en basses couches : les alizés des deux hémisphères se rencontrent.</li></ul>
<p>L'air monte dans d'énormes cumulonimbus, puis <b>diverge</b> en altitude. Les marins l'appellent le <b>pot au noir</b> (<i>doldrums</i>) : des calmes plats et des orages.</p>
<p>Sur la coupe, la ligne jaune est la <b>tropopause</b> : regarde comme elle est haute à l'équateur.</p>`,
    keep: ['Convection forte : chaleur, humidité, chaleur latente, tropopause haute, convergence basse couche', 'Divergence en altitude', 'Équateur météorologique = ZCIT = pot au noir'],
    cam: { lat: 0, lon: -20, dist: 4.25 },
    L: { clouds: 0.55, section: 1, surf: 1, labels: 'cells' },
  },
  {
    title: 'Si la Terre ne tournait pas',
    en: ['Rebalancing without earth rotation'],
    body: `<p>Imagine une Terre <b>immobile</b>, qui ne tourne pas sur elle-même :</p>
<ol><li>l'air chaud de l'équateur <b>monte</b> ;</li><li>il part vers les <b>pôles en altitude</b> ;</li><li>il refroidit et <b>redescend aux pôles</b> ;</li><li>il revient vers l'équateur <b>au sol</b>.</li></ol>
<p>Résultat : <b>une seule grande boucle par hémisphère</b>, avec une dépression (D) à l'équateur et des anticyclones (A) aux pôles. Le globe est coupé en deux hémisphères météo.</p>
<p>Au sol, le vent soufflerait tout droit du nord dans l'hémisphère Nord. Lâche une bulle d'air dans l'onglet Explorer pour le voir.</p>
<p><b>Mais la Terre tourne…</b> et ça change tout (étape suivante).</p>`,
    keep: ['Sans rotation : 1 cellule méridienne par hémisphère', 'Ascendance à l’équateur (D), subsidence aux pôles (A)', 'Coupure du globe en deux hémisphères météorologiques'],
    cam: { lat: 0, lon: -20, dist: 4.4 },
    rot: 0,
    L: { clouds: 0, section: 1, surf: 1, press: 1, labels: 'cells' },
  },
  {
    title: 'La patineuse : le moment cinétique',
    en: ['Conservation of kinetic momentum'],
    body: `<p>Une patineuse qui <b>ramène ses bras</b> se met à tourner <b>plus vite</b>. L'air fait pareil.</p>
<p>En allant de l'équateur vers le pôle, l'anneau d'air se <b>rapproche de l'axe</b> de la Terre (son rayon r diminue). Pour garder le même moment cinétique, il tourne plus vite que le sol : pour nous, c'est un <b>vent d'ouest</b>.</p>
<p class="formula">m·R²·Ω = m·r²·ω &nbsp;→&nbsp; r ↓ donc ω ↑</p>
<p>Le calcul donne environ <b>250 kt de vent d'ouest vers 30° de latitude et 35 000 ft</b>. C'est beaucoup trop fort, donc instable : l'air <b>ne peut pas aller plus loin d'une traite</b>. C'est ce qui limite la cellule de Hadley à 30°.</p>`,
    keep: ['Conservation du moment cinétique : r ↓ → ω ↑', 'Air parti de l’équateur : ~250 kt d’ouest à 30° et 35 000 ft', 'Limite du déplacement équateur → pôle'],
    cam: { lat: 22, lon: -20, dist: 4.3 },
    L: { clouds: 0, ring: 1, grid: 1 },
  },
  {
    title: 'Les cellules de Hadley',
    en: ['Hadley cells', 'Westerly tropical jet (WTJ)', 'Horse latitudes'],
    body: `<p>Avec la rotation, la grande boucle se casse. Entre l'équateur et 30°, on obtient la <b>cellule de Hadley</b> :</p>
<ol><li>l'air <b>monte</b> à la ZCIT ;</li><li>il part vers les pôles en altitude et il est <b>dévié vers l'est</b> (Coriolis + moment cinétique) : c'est le <b>courant-jet d'ouest subtropical (WTJ)</b>, vers <b>30° et 35 000 ft</b> ;</li>
<li>il <b>redescend vers 30°</b> (subsidence) : zone des <b>anticyclones subtropicaux</b> et des <b>latitudes des chevaux</b> (calmes) ;</li><li>il revient vers l'équateur <b>au sol</b> : ce sont les <b>alizés</b>.</li></ol>
<p class="def"><b>JET</b> = courant en forme de tube aplati, presque horizontal, rapide, instable, avec un vent &gt; 60 kt (<b>80 kt en aéronautique</b>).</p>`,
    keep: ['Ascendance ZCIT → altitude vers les pôles → subsidence à 30° → alizés au sol', 'WTJ : ~30°, ~35 000 ft (Coriolis + moment cinétique)', 'Subsidence = anticyclones subtropicaux = latitudes des chevaux', 'JET : > 60 kt (80 kt en aéronautique)'],
    cam: { lat: 12, lon: -20, dist: 4.45 },
    L: { clouds: 0, section: 1, surf: 1, upper: 0.55, labels: 'cells' },
  },
  {
    title: 'Les 5 anticyclones subtropicaux',
    en: ['Subtropical dynamic high'],
    body: `<p>L'air qui <b>redescend</b> dans les cellules de Hadley comprime le bas de l'atmosphère : il fabrique <b>cinq grands anticyclones</b> posés sur les océans.</p>
<ul><li><b>Hémisphère Nord</b> : les <b>Açores</b> et <b>Hawaï</b>.</li>
<li><b>Hémisphère Sud</b> : l'<b>île de Pâques</b>, <b>Sainte-Hélène</b> et les <b>Mascareignes</b>.</li></ul>
<p>Ce sont des anticyclones <b>dynamiques</b> : créés par l'air qui descend, pas par le froid.</p>
<p>Ils se déplacent avec les saisons : regarde l'anticyclone des Açores remonter en été avec le curseur du mois (onglet Explorer).</p>`,
    keep: ['Subsidence de Hadley → 5 anticyclones subtropicaux', 'HN : Açores, Hawaï', 'HS : île de Pâques, Sainte-Hélène, Mascareignes', 'Anticyclones dynamiques'],
    cam: { lat: 4, lon: -40, dist: 3.5 }, auto: true,
    L: { clouds: 0.25, press: 1, highs: 1, grid: 1 },
  },
  {
    title: 'Tropiques : en altitude et au sol',
    en: ['Trade winds', 'Westerly current'],
    body: `<p>Pour un observateur <b>lié à la Terre</b> (nous) :</p>
<ul><li><b>En altitude</b>, l'air qui va vers les pôles est dévié vers l'<b>EST</b>. Il donne un <b>courant d'ouest</b>, très fort à la limite polaire des cellules de Hadley (le jet).</li>
<li><b>Au sol</b>, l'air qui revient vers l'équateur est dévié vers l'<b>OUEST</b>. Il donne les <b>alizés</b> : de <b>nord-est</b> dans l'hémisphère Nord, de <b>sud-est</b> dans l'hémisphère Sud.</li></ul>
<p>Astuce : dans l'hémisphère Nord, l'air en mouvement est dévié vers <b>sa droite</b>. Dans l'hémisphère Sud, vers <b>sa gauche</b>.</p>
<p>Les traînées jaunes sont les alizés au sol, les traînées bleues et roses les vents d'altitude. Les deux bulles blanches sont lâchées vers 25° : suis-les.</p>`,
    keep: ['Altitude : mouvement vers les pôles dévié vers l’est → courant d’ouest', 'Surface : mouvement vers l’équateur dévié vers l’ouest → alizés', 'Alizés de NE (HN) et de SE (HS)'],
    cam: { lat: 10, lon: -40, dist: 3.6 },
    water: 1,
    parcels: [{ lat: 26, lon: -52, z: 0.04 }, { lat: -26, lon: -38, z: 0.04 }],
    L: { clouds: 0, surf: 1, upper: 0.7, labels: 'winds', grid: 1 },
  },
  {
    title: 'Les pôles : le drainage polaire',
    en: ['Polar draining', 'Thermal polar anticyclone'],
    body: `<p>Au pôle, l'air très froid et lourd s'écrase au sol :</p>
<ul><li><b>en surface</b> : un <b>anticyclone thermique polaire</b> ;</li><li><b>en altitude</b> : une <b>dépression</b> (le vortex polaire).</li></ul>
<p>L'air froid s'écoule du pôle vers l'extérieur, comme de l'eau qui déborde : c'est le <b>drainage polaire</b>. Comme les alizés, il est dévié vers l'ouest : il donne des <b>vents d'est polaires</b>, de <b>NE au Nord</b> et de <b>SE au Sud</b>.</p>
<p>La dépression d'altitude est <b>plus creuse en hiver</b> qu'en été, et <b>plus creuse au pôle Sud</b> qu'au pôle Nord.</p>`,
    keep: ['Pôle : anticyclone en surface, dépression en altitude', 'Drainage polaire → vents d’est polaires (NE / SE)', 'Dépression d’altitude plus creuse en hiver et au pôle Sud'],
    cam: { lat: 46, lon: -20, dist: 4.35 },
    L: { clouds: 0, section: 1, surf: 1, press: 0.8, labels: 'polar' },
  },
  {
    title: 'Le front polaire : ondes de Rossby',
    en: ['Polar front', 'Rossby waves', 'Travelling lows'],
    body: `<p>Vers <b>40-70°</b>, l'air froid du drainage polaire rencontre l'air chaud tropical : c'est le <b>front polaire</b>.</p>
<p>La frontière ne reste pas droite : elle <b>ondule</b> en grandes vagues autour du pôle. Ce sont les <b>ondes de Rossby</b> (4 à 6 vagues).</p>
<p>Dans ces ondulations naissent les <b>dépressions mobiles</b> (<i>travelling lows</i>), vers 60-70°. Elles défilent d'ouest en est : ce sont nos perturbations.</p>
<p>En altitude, en hiver, le courant se renforce en bordure polaire : c'est le <b>jet du front polaire</b> (jet arctique).</p>
<p>Dans les autres livres, cette zone entre 30 et 60° s'appelle aussi la <b>cellule de Ferrel</b>.</p>`,
    keep: ['Front polaire : air polaire / air tropical, vers 40-70°', 'Ondes de Rossby dans le courant d’ouest', 'Dépressions mobiles (travelling lows) vers 60-70°', 'En hiver : jet en bordure polaire (jet arctique)'],
    cam: { lat: 60, lon: -30, dist: 3.6 },
    L: { clouds: 0.5, upper: 1, labels: 'front' },
  },
  {
    title: 'Schéma idéal en altitude',
    en: ['Westerlies', 'Geopotential'],
    body: `<p>En altitude, le géopotentiel est <b>haut à l'équateur</b> (air chaud et dilaté) et <b>bas aux pôles</b> (air froid et tassé). L'air tourne autour de la Terre d'ouest en est : il y a des <b>vents d'ouest presque partout</b> (westerlies).</p>
<p>Le vent d'ouest d'altitude est <b>maximal dans l'hémisphère d'hiver</b>.</p>
<p>Tout le système <b>suit le Soleil</b> : il remonte vers le <b>nord en juillet</b> et descend vers le <b>sud en janvier</b>. Le mois défile tout seul pendant cette étape.</p>`,
    keep: ['Géopotentiel haut à l’équateur, bas aux pôles → vents d’ouest', 'Vent d’ouest maximal dans l’hémisphère d’hiver', 'Juillet : tout vers le nord · Janvier : tout vers le sud'],
    cam: { lat: 20, lon: -30, dist: 3.65 },
    water: 1, monthAnim: 1,
    L: { clouds: 0, upper: 1, grid: 1, labels: 'upper' },
  },
  {
    title: 'Schéma idéal en surface',
    en: ['Ideal diagram : surface'],
    body: `<p>Du pôle Nord au pôle Sud, retiens cet ordre :</p>
<ol class="tight"><li><b>Anticyclone thermique polaire</b></li><li>vents polaires de <b>NE</b></li><li><b>dépressions subpolaires</b> dynamiques (~60°)</li><li>vents de <b>SW</b> (westerlies)</li>
<li><b>anticyclones subtropicaux</b> dynamiques (~30°, divergence)</li><li><b>alizés de NE</b></li><li><b>ZCIT</b> : dépressions thermiques équatoriales</li><li><b>alizés de SE</b></li>
<li>anticyclones subtropicaux</li><li>vents de <b>NW</b></li><li>dépressions subpolaires</li><li>vents polaires de <b>SE</b></li></ol>
<p>Bilan : un <b>courant d'est</b> dans les tropiques et aux pôles, et un <b>courant d'ouest ondulant</b> aux latitudes moyennes.</p>`,
    keep: ['A polaire · D subpolaires (60°) · A subtropicaux (30°) · ZCIT (0°)', 'Alizés NE/SE · Westerlies SW/NW · Polaires NE/SE', 'Courant d’est (tropiques, pôles) · courant d’ouest ondulant (moyennes latitudes)'],
    cam: { lat: 12, lon: -30, dist: 3.7 },
    water: 1,
    L: { clouds: 0, press: 1, surf: 1, labels: 'belts' },
  },
  {
    title: 'Les mots-clés du cours',
    en: [],
    body: `<p>Voici les mots-clés à connaître. Touche-en un pour revoir l'étape qui l'explique :</p>
<div class="kw" id="kwlist"></div>
<p>Ensuite, passe à l'onglet <b>Quiz</b> pour vérifier, ou à l'onglet <b>Explorer</b> pour jouer : change le mois, arrête la rotation de la Terre, lâche des bulles d'air…</p>`,
    keep: [],
    cam: { lat: 18, lon: -25, dist: 3.8 }, auto: true,
    L: { clouds: 0.8, surf: 1 },
  },
];

export const KEYWORDS = [
  ['ITCZ (doldrums)', 'ZCIT, pot au noir', 3], ['Hadley cells', 'cellules de Hadley', 6], ['Westerly tropical jet', 'jet d’ouest subtropical', 6],
  ['Trade winds', 'alizés', 8], ['Subtropical dynamic high', 'anticyclone subtropical dynamique', 7], ['Horse latitudes', 'latitudes des chevaux', 6],
  ['Polar draining', 'drainage polaire', 9], ['Travelling lows', 'dépressions mobiles', 10], ['Rossby waves', 'ondes de Rossby', 10], ['Westerlies', 'vents d’ouest', 11],
];

export const QUIZ = [
  { q: "Où l'air monte-t-il massivement autour de la Terre ?", a: ['Vers 30° de latitude', 'À la ZCIT, l’équateur météorologique', 'Aux pôles', 'Vers 60° de latitude'], c: 1, e: "Chaleur, humidité, chaleur latente, tropopause haute et convergence des alizés : la convection est maximale à la ZCIT.", s: 3 },
  { q: 'Sans rotation de la Terre, la circulation serait…', a: ['Trois cellules par hémisphère', 'Une seule cellule par hémisphère', 'Aucune circulation', 'Des vents d’ouest partout'], c: 1, e: 'Ascendance à l’équateur, subsidence aux pôles : une grande boucle par hémisphère.', s: 4 },
  { q: "Pourquoi l'air parti de l'équateur ne va-t-il pas d'une traite jusqu'au pôle ?", a: ['Il est arrêté par les montagnes', 'Le moment cinétique lui donne un vent d’ouest énorme (~250 kt à 30°), instable', 'Il gèle en altitude', 'La force de Coriolis s’annule à 30°'], c: 1, e: 'En se rapprochant de l’axe, il tourne de plus en plus vite (patineuse) : ~250 kt à 30° et 35 000 ft, ce qui est instable.', s: 5 },
  { q: 'Le jet d’ouest subtropical (WTJ) se situe vers…', a: ['10° et 10 000 ft', '30° et 35 000 ft', '60° et 25 000 ft', '90° et 50 000 ft'], c: 1, e: 'À la limite polaire de la cellule de Hadley, vers 30° de latitude et 35 000 ft.', s: 6 },
  { q: 'En aéronautique, on parle de JET à partir de…', a: ['40 kt', '60 kt', '80 kt', '120 kt'], c: 2, e: 'Jet : vent > 60 kt en météo, 80 kt en aéronautique. Tube aplati, presque horizontal, rapide et instable.', s: 6 },
  { q: 'Les alizés de l’hémisphère Nord soufflent du…', a: ['sud-ouest', 'nord-est', 'nord-ouest', 'sud-est'], c: 1, e: 'L’air qui revient vers l’équateur est dévié vers l’ouest (vers sa droite au Nord) : alizés de NE. Au Sud : alizés de SE.', s: 8 },
  { q: 'Qu’est-ce qui crée les anticyclones subtropicaux ?', a: ['Le froid du sol', 'La subsidence (air qui redescend) des cellules de Hadley', 'La convection à l’équateur', 'Les ondes de Rossby'], c: 1, e: 'Ce sont des anticyclones dynamiques, créés par la subsidence vers 30°.', s: 7 },
  { q: 'Lequel n’est PAS un anticyclone subtropical de l’hémisphère Sud ?', a: ['Île de Pâques', 'Sainte-Hélène', 'Mascareignes', 'Açores'], c: 3, e: 'Les Açores (et Hawaï) sont dans l’hémisphère Nord.', s: 7 },
  { q: 'Les « latitudes des chevaux » (horse latitudes) correspondent…', a: ['aux calmes des anticyclones subtropicaux (~30°)', 'au pot au noir (0°)', 'au front polaire (~60°)', 'aux pôles'], c: 0, e: 'Sous la subsidence de Hadley, vers 30° : vents faibles et ciel clair.', s: 6 },
  { q: 'Au pôle, on trouve…', a: ['une dépression au sol et un anticyclone en altitude', 'un anticyclone thermique au sol et une dépression en altitude', 'un anticyclone dynamique au sol', 'la ZCIT'], c: 1, e: 'L’air froid et lourd fait un anticyclone thermique en surface ; en altitude, c’est une dépression (vortex polaire).', s: 9 },
  { q: 'Le drainage polaire donne en surface…', a: ['des vents d’ouest', 'des vents d’est (NE au Nord, SE au Sud)', 'des vents calmes', 'des vents du sud au Nord'], c: 1, e: 'L’air qui s’écoule du pôle est dévié vers l’ouest, comme les alizés : vents d’est polaires.', s: 9 },
  { q: 'Les ondes de Rossby et les dépressions mobiles se trouvent…', a: ['à la ZCIT', 'vers 30°', 'au front polaire, aux latitudes moyennes (40-70°)', 'au centre des anticyclones'], c: 2, e: 'Le courant d’ouest ondule au front polaire ; les dépressions mobiles défilent vers 60-70°.', s: 10 },
  { q: 'Le vent d’ouest d’altitude est le plus fort…', a: ['dans l’hémisphère d’été', 'dans l’hémisphère d’hiver', 'à l’équateur', 'pareil toute l’année'], c: 1, e: 'Le contraste de température équateur-pôle est maximal en hiver.', s: 11 },
  { q: 'En juillet, la ZCIT et toutes les ceintures se déplacent…', a: ['vers le sud', 'vers le nord', 'vers l’est', 'elles ne bougent pas'], c: 1, e: 'Le système suit le Soleil : vers le nord en juillet, vers le sud en janvier.', s: 11 },
  { q: 'Entre les anticyclones subtropicaux et les dépressions subpolaires, au sol, le vent de l’hémisphère Nord vient du…', a: ['nord-est', 'sud-ouest', 'sud-est', 'nord-ouest'], c: 1, e: 'Ce sont les westerlies : SW au Nord, NW au Sud.', s: 12 },
];
