// Genera RESUMEN_DIGITAL_SESION_14_HEPATITIS_ALERGIAS.docx
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat, SectionType, Footer,
  PageNumber, BorderStyle, VerticalAlign,
} = require('docx');
const L = require('./lib');
const { C, ACC, G, PX, P, B, H1, H2, H3, CAP, FIG, TABLE, BOX, FIGROW, FLOW, SP, runs } = L;

const ROOT = process.argv[2];           // carpeta con zip_in/, fig_es/, fig_crop/
const OUT = process.argv[3];
const ORI = (f) => path.join(ROOT, 'zip_in/Ilustraciones_Sesion_14', f);
const ES = (f) => path.join(ROOT, 'fig_es', f);
const CR = (f) => path.join(ROOT, 'fig_crop', f);
const CWPX = PX(G.CW);   // ancho de columna en px (≈365)
const TWPX = PX(G.TW);   // ancho de página útil en px (≈778)
const CW = G.CW, TW = G.TW;

let figN = 0;
const fig = (txt) => `**Figura ${++figN}.** ${txt}`;
const tr = ' __Rótulos en inglés traducidos al español.__';

// ---------------------------------------------------------------- SECCIONES
const S = []; // [{cols, children}]
const { Table } = require('docx');
// Inserta un separador entre tablas consecutivas (Word fusionaría tablas contiguas)
const sec = (cols, children) => {
  const out = [];
  children.forEach((c, i) => {
    out.push(c);
    if (c instanceof Table && children[i + 1] instanceof Table) out.push(SP(50));
  });
  S.push({ cols, children: out });
};

// ===== Encabezado compacto (ancho completo)
sec(1, [
  new Paragraph({ style: 'TituloPrincipal', children: [new TextRun('SESIÓN 14 · HEPATITIS VIRAL Y ALERGIAS ALIMENTARIAS')] }),
  P('Resumen digital · Mecanismos de Agresión y Defensa III · Programa Académico de Medicina Humana · Elaborado a partir de las 34 diapositivas de la clase teórica', { style: 'Subtitulo' }),
  TABLE([1945, 1945, 1945, 1945, 1946, 1946], null, [[
    { md: '**Tema**', fill: C.topic, align: AlignmentType.CENTER },
    { md: '**Subtítulo**', fill: C.sub, align: AlignmentType.CENTER },
    { md: '**Subdivisión**', fill: C.pink, align: AlignmentType.CENTER },
    { md: '**Clave / dato importante**', fill: C.key, align: AlignmentType.CENTER },
    { md: '**Inmunología**', fill: C.mint, align: AlignmentType.CENTER },
    { md: '**Complemento / actualización**', fill: C.peach, align: AlignmentType.CENTER },
  ]]),
  SP(40),
  H1('UNIDAD I · HEPATITIS VIRAL'),
]);

// ===== UNIDAD I — dos columnas
sec(2, [
  H2('1. Definición y clasificación de los virus hepatotropos'),
  P('La **hepatitis viral aguda** es la lesión inflamatoria del hígado producida por virus. La clase agrupa a sus agentes según su tropismo (diap. 3):'),
  B('{{Virus hepatotropos primarios}}: el hígado es su blanco principal → [[VHA, VHB, VHC, VHD y VHE]].'),
  B('{{Virus hepatotropos secundarios}}: afectan al hígado en el curso de una infección sistémica → **VEB** (Epstein-Barr), **CMV** (citomegalovirus) y **VHS** (herpes simple).'),
  ...FIG(ORI('01_Virus_hepatotropicos_primarios_y_secundarios.png'), 205, fig('Virus hepatotropos primarios y secundarios como agentes de hepatitis viral aguda (diap. 3). Siglas internacionales: HAV = VHA, HBV = VHB, HCV = VHC, HDV = VHD, HEV = VHE; EBV = VEB; HSV = VHS.')),
  BOX('peach', 'NOMENCLATURA', ['Las figuras conservan las siglas internacionales (HAV, HBV, HDV, HEV, anti-HDV, anti-HEV, HBsAg, HDAg…), porque son nomenclatura científica; en el texto se usan las formas españolas (VHA, VHB, VHC, VHD, VHE).'], CW),

  H2('2. Hepatitis A (VHA)'),
  H3('Epidemiología y transmisión (diap. 4)'),
  B('Transmisión [[fecal-oral]]: de persona a persona o por **agua o alimentos contaminados**.'),
  B('Gran resistencia ambiental: permanece infeccioso **horas** en las manos, **días** en los alimentos y **meses** en alimentos congelados, superficies y heces.'),
  B('Enfermedad sintomática en [[> 70 % de los adultos]]; los síntomas son poco comunes en niños < 6 años.'),
  B('Incubación promedio de [[28 días]] (rango: 15–50 días).'),
  B('**Insuficiencia hepática fulminante** en < 1 %; factores de riesgo: edad > 50 años y hepatopatía subyacente (sobre todo hepatitis C crónica).'),
  ...FIG(ORI('02_VHA_mapa_epidemiologico.png'), 300, fig('Seroprevalencia de la infección por VHA: azul = baja, gris = intermedia y rosado = alta prevalencia (diap. 4).')),
  H3('Patogenia (diap. 5)'),
  BOX('mint', 'INMUNOPATOGENIA DEL VHA', [
    '• La lesión hepática resulta de la [[respuesta inmune del huésped]] frente al VHA.',
    '• La replicación viral ocurre en el **citoplasma del hepatocito**.',
    '• El daño y la destrucción de los hepatocitos infectados están mediados por ~~linfocitos T CD8+~~ específicos del VHA, **restringidos por el antígeno leucocitario humano (HLA)**, y por ~~células NK~~.',
    '• El ~~interferón gamma (IFN-γ)~~ tiene un papel central en la eliminación de los hepatocitos infectados.',
  ], CW),
  ...FIG(ORI('03_VHA_transmision_fecal_oral.png'), 255, fig('Ruta del VHA: acceso oral → atraviesa el tubo digestivo → sangre → hígado → bilis → heces (diap. 5).')),
  H3('Cuadro clínico (diap. 5)'),
  P('{{Pródromo}} náuseas, vómitos, anorexia, fiebre, malestar y dolor abdominal.'),
  P('{{Fase ictérica}} a los pocos días o una semana aparece **coluria** y puede observarse **acolia**; luego, **ictericia y prurito** (40–70 % de los casos). Los síntomas iniciales suelen disminuir al aparecer la ictericia, que alcanza su máximo en **2 semanas**.'),
  P('{{Examen físico}} ictericia, ictericia escleral, [[hepatomegalia (80 %)]] y dolor a la palpación en el cuadrante superior derecho. Menos frecuentes: esplenomegalia y manifestaciones extrahepáticas (erupción cutánea, artralgias).'),
  P('{{Embarazo}} la infección aguda se asocia con mayor riesgo de **parto prematuro** y complicaciones gestacionales.'),
  ...FIG(ES('04_VHA_curso_serologico_ES.png'), 320, fig('Curso de la hepatitis A: la viremia y la excreción del virus en heces preceden a la enfermedad clínica; la IgM se eleva con la ALT y la IgG asciende después y persiste (diap. 5).' + tr)),
  H3('Diagnóstico (diap. 6)'),
  B('Evolución cronológica de los síntomas e identificación de una **fuente de infección** conocida.'),
  B('Detección de [[IgM anti-VHA mediante ELISA]].'),
  B('**PCR** para ARN viral en sangre.'),
  B('{{Diagnóstico diferencial}} hepatitis B, C, D y E; virus de Epstein-Barr y citomegalovirus; virus de la fiebre amarilla.'),
  H3('Tratamiento y prevención (diap. 6)'),
  B('Tratamiento: **cuidados de apoyo**. Recuperación clínica y bioquímica completa a los **3 meses en el 85 %** y recuperación completa a los **6 meses en casi todos** los pacientes.'),
  B('[[Vacuna contra la hepatitis A]] (inactivada): **2 dosis** en niños y adultos.'),
  B('**Lavado de manos**; evitar agua o alimentos crudos en zonas con malas condiciones sanitarias.'),
  B('Calentar los alimentos: el virus se inactiva a [[> 85 °C (> 185 °F) durante 1 minuto]].'),
  B('Cloro, yodo y soluciones desinfectantes (lejía doméstica, dilución 1:1000) inactivan el VHA.'),
  BOX('key', 'CLAVE DE EXAMEN · VHA', [
    '• Fecal-oral; incubación ≈ 28 días; síntomas en > 70 % de adultos y raros en < 6 años.',
    '• Daño hepático **inmunomediado** (CD8+ restringidos por HLA, NK, IFN-γ).',
    '• Infección aguda = **IgM anti-VHA**; la IgG aparece después y persiste (Fig. 4).',
    '• Fulminante < 1 %: > 50 años y hepatopatía previa (VHC crónica).',
  ], CW),

  H2('3. Hepatitis B (VHB)'),
  P('Es el [[mayor causante de hepatitis aguda y crónica en el mundo]]. El espectro clínico varía tanto en la forma aguda como en la crónica; el **15–25 %** de las personas con infección crónica morirá prematuramente por falla hepática, cirrosis o carcinoma hepatocelular (diap. 7).'),
  H3('Estructura y taxonomía (diap. 7)'),
  ...FIGROW([
    { file: ORI('05_VHB_particula_Dane_estructura.png'), w: 150, cw: 2350, valign: VerticalAlign.CENTER },
    { cw: CW - 2350, valign: VerticalAlign.CENTER, children: [
      P('**Partícula de Dane** (virión, 42 nm):', { style: 'TablaTexto' }),
      ...['HBsAg: antígeno de superficie', 'ADN polimerasa', 'ADN mayoritariamente bicatenario, 3.200 pb', 'Antígenos del núcleo (core): HBc, HBe', 'Proteína cinasa'].map((t) => new Paragraph({ children: runs(t), style: 'TablaTexto', numbering: { reference: 'vinetasTabla', level: 0 } })),
      P('**Partículas de HBsAg** (sin genoma): esféricas de 22 nm (forma S con algo de M) y filamentosas de 22 nm × 100–700 nm (formas S, M y L). L = gp42; M = gp36; S = gp27.', { style: 'TablaTexto' }),
    ] },
  ], CW, fig('Virus de la hepatitis B (partícula de Dane) y partículas del antígeno de superficie (HBsAg) (diap. 7).')),
  TABLE([1700, CW - 1700], ['Característica', 'Virus de la hepatitis B'], [
    ['Familia / género', 'Hepadnaviridae / Orthohepadnavirus (especie: hepatitis B)'],
    ['Envoltura', 'Virus **cubierto** (envoltura con HBsAg)'],
    ['Cápside', '**Icosaédrica** (antígeno core)'],
    ['Genoma', '[[ADN circular de doble cadena incompleta]] (≈ 3.200 pb)'],
    ['Replicación', 'Codifica una **transcriptasa inversa (TI)** y se replica mediante un **intermediario de ARN**'],
  ], { firstColFill: C.sub }),
  SP(),
  BOX('peach', 'COMPLEMENTO · ESQUEMA DE REPLICACIÓN DEL VHB', [
    'La clase menciona la transcriptasa inversa, el intermediario de ARN y el ADNccc; los pasos se detallan como apoyo:',
    FLOW([
      '**1. Entrada** al hepatocito y liberación del genoma (ADN parcialmente bicatenario).',
      '**2. Núcleo:** el genoma se completa y forma ~~ADNccc~~ (circular covalentemente cerrado), molde estable.',
      '**3. Transcripción:** ARNm virales y **ARN pregenómico** (intermediario de ARN).',
      '**4. Transcripción inversa** del ARN pregenómico a ADN por la polimerasa viral, dentro de la cápside.',
      '**5. Envoltura con HBsAg** y salida de viriones (más partículas de HBsAg en exceso).',
    ], CW - 260, { vertical: true, fill: 'FBEFE2', acc: ACC.peach }),
  ], CW),
  H3('Cuadro clínico general (diap. 8)'),
  P('Amplia gama de presentaciones:', { keepNext: true }),
  B('Infección asintomática · enfermedad aguda autolimitada · **hepatitis crónica** que progresa a falla hepática y cirrosis · **hepatitis fulminante** · estado de **portador crónico asintomático**.'),
  P('Solo un pequeño número de infecciones agudas se diagnostica: presentan cuadro sintomático con ictericia el **10 % de los niños** y el **30–50 % de los adultos**.'),
  P('[[El riesgo de hepatitis crónica es inversamente proporcional a la edad a la que se adquiere la infección.]]'),
  ...FIGROW([
    { file: ORI('06_VHB_higado_sano.png'), w: 150, sub: 'Hígado sano' },
    { file: ORI('07_VHB_higado_cirrotico.png'), w: 150, sub: 'Cirrosis' },
  ], CW, fig('Hígado sano frente a hígado cirrótico, posible evolución de la hepatitis B crónica (diap. 8).')),
  H3('Hepatitis B aguda: cuatro fases (diap. 9)'),
  TABLE([1350, CW - 1350], ['Fase', 'Características'], [
    [{ md: '**1. Incubación**', fill: C.pink }, 'Variable: **30–180 días**.'],
    [{ md: '**2. Prodrómica o preictérica**', fill: C.pink }, 'Fiebre, fatigabilidad, malestar, mialgia y alteraciones gastrointestinales (hiporexia, náusea, vómito, dolor en el cuadrante superior derecho). Síntomas mediados por la ~~liberación de interferón~~.'],
    [{ md: '**3. Sintomática o ictérica**', fill: C.pink }, ['Orinas **colúricas** → heces **acólicas** → tinte ictérico en conjuntivas, escleras y piel.', 'Ictericia con bilirrubina [[> 2–4 mg/dL]], con predominio de la **directa**; en general no supera 15 mg/dL.', 'Dolor a la palpación hepática; altura hepática por percusión de 16 cm; esplenomegalia en 5–15 %. La fiebre remite en las primeras semanas y, en general, el paciente mejora tras esta fase.']],
    [{ md: '**4. Convalecencia**', fill: C.pink }, 'Astenia, adinamia y fatigabilidad intensas.'],
  ]),
  SP(),
  ...FIGROW([
    { file: ORI('08_VHB_coluria.png'), w: 92, sub: 'Coluria' },
    { file: ORI('09_VHB_acolia.png'), w: 112, sub: 'Acolia' },
    { file: ORI('10_VHB_ictericia.png'), w: 112, sub: 'Ictericia escleral' },
  ], CW, fig('Signos de la fase ictérica: coluria (tira reactiva con las casillas BIL y UBG resaltadas), acolia e ictericia (diap. 9).')),
  H3('Hepatitis B crónica (diap. 10)'),
  BOX('mint', '¿POR QUÉ SE CRONIFICA?', [
    'Mecanismos patogénicos múltiples: ~~respuesta inmune celular deficiente~~, propiedades **inmunosupresoras del VHB** y presencia de [[ADNccc estable]] en las células → el virus no se elimina del hospedero.',
  ], CW),
  B('Muchos pacientes son **asintomáticos** (salvo cirrosis descompensada o manifestaciones extrahepáticas); otros refieren síntomas inespecíficos como **fatiga**.'),
  B('**Exacerbaciones**: asintomáticas, semejantes a una hepatitis aguda o como insuficiencia hepática; la ALT puede llegar a [[50 veces el límite superior normal]] y la alfafetoproteína (AFP) a 1000 ng/mL.'),
  B('Examen físico normal o con estigmas de hepatopatía crónica. **Cirrosis descompensada**: ictericia, esplenomegalia, ascitis, edema periférico y encefalopatía.'),
  B('Laboratorio: puede ser normal; la mayoría presenta elevación **leve a moderada de AST y ALT**.'),
  B('Sospechar **progresión a cirrosis** ante hiperesplenismo (↓ leucocitos y plaquetas) o alteración de la función de síntesis (hipoalbuminemia, tiempo de protrombina prolongado, hiperbilirrubinemia).'),
]);

// ===== Serología VHB — ancho completo
sec(1, [
  H3('Marcadores serológicos del VHB: infección aguda y crónica (diap. 11)'),
  ...FIGROW([
    { file: ES('11_VHB_serologia_aguda_ES.png'), w: 350 },
    { file: ES('12_VHB_serologia_cronica_ES.png'), w: 350 },
  ], TW, fig('Representación esquemática de la respuesta serológica a la infección aguda (izq.) y crónica (der.) por VHB en relación con la ALT sérica (diap. 11). Se conserva la nomenclatura de antígenos y anticuerpos.' + tr)),
  TABLE([1500, 2700, 3736, 3736], ['Marcador', 'Qué es', 'Infección aguda', 'Infección crónica'], [
    ['**HBsAg**', 'Antígeno de superficie de la hepatitis B', 'Presente desde la fase preclínica; desaparece con la seroconversión a anti-HBs.', 'Persiste. [[HBsAg > 6 meses tras la infección aguda = infección crónica]].'],
    ['**Anti-HBs**', 'Anticuerpo contra el antígeno de superficie', 'Aparece en la recuperación (seroconversión HBsAg → anti-HBs).', 'No se observa (≈ 20 % tiene una forma **no neutralizante** detectable).'],
    ['**HBeAg**', 'Antígeno e de la hepatitis B', 'Presente desde la fase preclínica.', 'Persiste durante un período variable.'],
    ['**Anti-HBe**', 'Anticuerpo contra el antígeno e', 'Seroconversión HBeAg → anti-HBe en la recuperación.', 'Aparece tras la desaparición del HBeAg (Fig. 8, der.).'],
    ['**IgM anti-HBc**', 'Anticuerpo IgM contra el antígeno central (core)', 'Aparece temprano en la fase clínica: [[IgM anti-HBc + HBsAg = diagnóstico de infección aguda]].', 'Solo transitoria al inicio (Fig. 8, der.).'],
    ['**IgG anti-HBc**', 'Anticuerpo IgG contra el antígeno central', 'Sustituye a la IgM (cambio IgM → IgG) en la recuperación.', 'Persiste.'],
    ['**ADN-VHB**', 'Genoma viral circulante (replicación)', 'Presente desde la fase preclínica; desaparece en la recuperación.', 'Persiste en la circulación.'],
    ['**ALT**', 'Alanina aminotransferasa (lesión hepatocelular)', 'Se eleva y se normaliza con la recuperación.', 'Fluctúa; elevación leve-moderada; hasta 50 × LSN en exacerbaciones (diap. 10).'],
  ], { firstColFill: C.sub, zebra: true, keepTogether: true }),
  SP(),
  TABLE([4300, 3836, 3536], ['Patrón serológico', 'Interpretación', 'Origen'], [
    ['HBsAg (+) e IgM anti-HBc (+)', '[[Infección aguda]]', 'Diap. 11'],
    ['Anti-HBs (+) e IgG anti-HBc (+)', '**Infección previa por VHB** (resuelta)', 'Diap. 11'],
    ['HBsAg (+) > 6 meses ± HBeAg, ADN-VHB, IgG anti-HBc; anti-HBs (−)', '**Infección crónica**', 'Diap. 11'],
    [{ md: 'Anti-HBs (+) aislado con anti-HBc (−)', fill: C.peach }, { md: 'Inmunidad por **vacunación**', fill: C.peach }, { md: 'Complemento (no figura en la clase)', fill: C.peach }],
  ], { firstColFill: C.sub, keepTogether: true }),
  SP(40),
]);

// ===== Vacunación VHB + Hepatitis C — dos columnas
sec(2, [
  H3('Vacunación contra el VHB (diap. 12)'),
  B('Se recomienda en **lactantes, niños** y especialmente en personas de **grupos de riesgo**.'),
  B('Se administra en una **serie de tres inyecciones**.'),
  B('**Precauciones universales** con sangre y líquidos corporales.'),
  TABLE([1300, CW - 1300], ['Grupo', 'Esquema presentado en clase'], [
    [{ md: '**RN**', fill: C.sub }, 'Al nacer, a los 2 meses y a los 6 meses.'],
    [{ md: '**RN < 2 kg**', fill: C.sub }, 'Al nacer, a los 2, 4 y 6 meses.'],
    [{ md: '**> 11 años**', fill: C.sub }, '2 dosis de 20 mcg con 1 mes de intervalo, **o** 3 dosis de 10 mcg: dosis inicial, a 1 y 6 meses después.'],
  ]),
  SP(),
  BOX('peach', 'ACTUALIZACIÓN · VACUNA CONTRA LA HEPATITIS B', [
    '• La diapositiva indica que la vacuna está «hecha de un virus inactivado (muerto)». Las vacunas actuales son de **subunidad recombinante**: contienen **HBsAg** producido en levaduras u otras células, sin virus completo; por eso inducen solo anti-HBs.',
    '• Los esquemas y dosis dependen del producto y del calendario nacional (en el esquema peruano vigente, la dosis del recién nacido se complementa con la vacuna pentavalente a los 2, 4 y 6 meses). Verificar la norma técnica vigente: este cuadro no es una indicación médica.',
  ], CW),
  BOX('key', 'CLAVE DE EXAMEN · VHB', [
    '• Partícula de Dane = virión completo (42 nm); el HBsAg sobra en partículas de 22 nm.',
    '• Aguda: **HBsAg + IgM anti-HBc**. Crónica: **HBsAg > 6 meses**. Infección previa: **anti-HBs + IgG anti-HBc**.',
    '• Cronicidad mayor cuanto menor es la edad de infección; el **ADNccc** explica la persistencia.',
    '• Fase ictérica: coluria → acolia → ictericia (bilirrubina > 2–4 mg/dL, predominio directo).',
  ], CW),

  H2('4. Hepatitis C (VHC)'),
  H3('Estructura (diap. 13)'),
  B('Familia **Flaviviridae**; tamaño ≈ **60 nm**.'),
  B('Genoma de [[ARN monocatenario]] (ARNss en la figura).'),
  B('**Nucleocápside icosaédrica** (proteína C) y **envoltura** con glucoproteínas **E1 y E2**.'),
  B('Periodo de incubación: **2–26 semanas**.'),
  ...FIG(ORI('13_VHC_estructura_viral.png'), 245, fig('Estructura del virus de la hepatitis C: glucoproteínas E1 y E2, envoltura, cápside, nucleocápside y ARN monocatenario (diap. 13).')),
  H3('Epidemiología (diap. 13)'),
  B('Se transmite principalmente a través de [[sangre infectada]] o por **vía sexual**.'),
  B('Casi el 90 % de los individuos con VIH y uso de drogas endovenosas están infectados con VHC (dato de la clase).'),
  B('La elevada incidencia de **infecciones crónicas asintomáticas** favorece su diseminación.'),
  B('La gráfica de la diapositiva (EE. UU., 2013–2020) muestra un aumento sostenido de las infecciones agudas **estimadas** (≈ 30 000 → ≈ 67 000), muy por encima de los casos **notificados** (< 5 000): la mayoría de las infecciones pasa inadvertida.'),
  H3('Cuadro clínico (diap. 14)'),
  P('{{Aguda}} frecuentemente **asintomática**; si hay síntomas, son inespecíficos, leves y desaparecen en pocas semanas: ictericia, fatiga, náuseas, anorexia y coluria.'),
  P('{{Crónica}} [[≈ 80 % de las hepatitis agudas por VHC evolucionan a la cronicidad]] → cirrosis, ascitis, descompensación hepática, várices esofágicas, hemorragias, encefalopatía hepática y **carcinoma hepatocelular**.'),
  BOX('peach', 'PRECISIÓN', ['La diapositiva 14 incluye «cirrosis» en la lista de la forma aguda; la cirrosis corresponde a la evolución crónica.'], CW),
  H3('Diagnóstico (diap. 15)'),
  B('Enzimas hepáticas elevadas; hiperbilirrubinemia; tiempo de protrombina prolongado.'),
  B('Detección de anticuerpos [[anti-VHC (ELISA)]].'),
  B('Detección del **ARN genómico**: la **PCR-TI** detecta el ARN del VHC incluso en personas **seronegativas**.'),
  H3('Tratamiento: antivirales de acción directa (diap. 15)'),
  P('Los antivirales de acción directa (AAD) actúan sobre las **proteínas no estructurales (NS)** del VHC, vitales para su replicación:'),
  B('**Inhibidores de proteasa**: bloquean la serina proteasa [[NS3/4A]].'),
  B('**Inhibidores nucleósidos y no nucleósidos**: bloquean la polimerasa [[NS5B]].'),
  B('**Inhibidores de NS5A**: NS5A participaría en la organización del complejo de replicación, en la regulación de la replicación y en el ensamblaje de la partícula viral que se libera de la célula huésped.'),
  BOX('key', 'CLAVE DE EXAMEN · VHC', [
    '• Flaviviridae, ARN monocatenario, E1/E2; transmisión sanguínea y sexual.',
    '• ≈ 80 % cronifica; la infección aguda suele ser asintomática.',
    '• Sufijos de los AAD: **-previr** (NS3/4A) · **-asvir** (NS5A) · **-buvir** (NS5B).',
    '• La PCR-TI detecta ARN en personas seronegativas.',
  ], CW),
]);

// ===== VHC ciclo + tabla AAD — ancho completo
sec(1, [
  ...FIG(ES('14_VHC_ciclo_y_dianas_farmacologicas_ES.png'), 600, fig('Ciclo del VHC y dianas de los AAD: unión al receptor y endocitosis → fusión y denudación → traducción y procesamiento de la poliproteína → replicación del ARN → ensamblaje → transporte y liberación (diap. 15). Se conservan los nombres de fármacos y de proteínas (NS3/4A, NS5A, NS5B, NNPI).' + tr)),
  TABLE([2500, 3000, 2172, 4000], ['Clase de AAD (sufijo)', 'Diana y función', 'Etapa que bloquea', 'Fármacos de la figura'], [
    ['**Inhibidores de proteasa NS3/4A** (-previr)', 'Serina proteasa **NS3/4A**', 'Procesamiento de la poliproteína', 'Glecaprevir, voxilaprevir, grazoprevir, simeprevir, paritaprevir'],
    ['**Inhibidores de NS5A** (-asvir)', '**NS5A**: organización del complejo de replicación, regulación de la replicación y ensamblaje', 'Replicación y ensamblaje', 'Velpatasvir, pibrentasvir, ledipasvir, elbasvir, daclatasvir, ombitasvir'],
    ['**Inhibidores nucleósidos de NS5B** (-buvir)', 'Polimerasa **NS5B**', 'Replicación del ARN', 'Sofosbuvir'],
    ['**Inhibidor no nucleósido de NS5B (NNPI)** (-buvir)', 'Polimerasa **NS5B**', 'Replicación del ARN', 'Dasabuvir'],
  ], { firstColFill: C.sub, zebra: true, keepTogether: true }),
  SP(),
  BOX('peach', 'ACTUALIZACIÓN · TRATAMIENTO DEL VHC', ['Varios fármacos de la figura (p. ej., simeprevir, paritaprevir/ombitasvir con dasabuvir y daclatasvir) se han retirado del mercado en muchos países. Los esquemas pangenotípicos actuales combinan clases (p. ej., sofosbuvir/velpatasvir o glecaprevir/pibrentasvir). Consultar la guía vigente; no es una indicación terapéutica.'], TW),
  SP(40),
]);

// ===== Hepatitis D — dos columnas
sec(2, [
  H2('5. Hepatitis D (VHD, virus delta)'),
  H3('Características (diap. 16)'),
  B('[[Parásito vírico]]: utiliza el **VHB** y proteínas de las células diana para replicarse y sintetizar sus propias proteínas.'),
  B('El [[HBsAg es esencial para el empaquetamiento]] del virus → solo se infecta quien también tiene VHB (coinfección o sobreinfección).'),
  B('Genoma: **ARN circular de cadena única y sentido negativo**, muy pequeño (grupo V de la clasificación de Baltimore).'),
  B('La molécula es monocatenaria, circular y en **forma de bastón** por su extenso apareamiento de bases.'),
  B('El genoma está rodeado por el **antígeno delta (HDAg)**, que a su vez se recubre de una **envoltura con HBsAg**.'),
  B('Familia **Deltaviridae**, género **Deltavirus** (según la clase).'),
  B('Incubación: **21–90 días**. Transmisión: **sangre y fluidos corporales**.'),
  ...FIG(ES('15_VHD_relacion_VHB_VHD_ES.png'), CWPX - 10, fig('Relación entre VHB y VHD: el VHD utiliza las proteínas de superficie del VHB (L-, M- y S-HBsAg) como envoltura (diap. 16).' + tr)),
  ...FIG(ES('16_VHD_genoma_y_estructura_ES.png'), 215, fig('Esquema del VHD: envoltura de HBsAg, antígeno delta (HDAg) y ARN genómico (diap. 16).' + tr)),
  H3('Patogenia (diap. 18)'),
  BOX('mint', 'TRES GRUPOS DE FACTORES', [
    'Los mecanismos detallados del daño hepático se desconocen; parece depender de:',
    '• **Factores del VHD**: genotipo y expresión de especies específicas del antígeno HDV (HDAg).',
    '• **Factores del huésped**: ~~respuesta inmune~~.',
    '• **Factores del virus auxiliar (VHB)**: genotipo del VHB y nivel de replicación.',
    '[[Aguda: daño citopático directo]] · [[Crónica: predomina el daño inmunomediado]]',
  ], CW),
  H3('Diagnóstico y tratamiento (diap. 18)'),
  B('Detección del **genoma de ARN**: la **PCR-TI** detecta el genoma del virión en muestras séricas.'),
  B('Detección del **antígeno delta** o de **anticuerpos frente al VHD** (ELISA).'),
  B('Según la clase, no existe tratamiento específico; el único fármaco aprobado es el [[interferón alfa]] estándar o pegilado (Peg-IFNα).'),
  B('[[La vacuna contra el VHB confiere protección frente al VHD.]]'),
  BOX('peach', 'ACTUALIZACIÓN · VHD', [
    '• **Taxonomía vigente (ICTV)**: reino Ribozyviria, familia **Kolmioviridae**, género Deltavirus; «Deltaviridae» es una denominación previa.',
    '• **Tratamiento**: desde 2020 la Agencia Europea de Medicamentos autoriza **bulevirtida**, un inhibidor de la entrada del virus (bloquea el receptor NTCP), para la hepatitis D crónica; su aprobación y disponibilidad varían según el país.',
  ], CW),
]);

// ===== VHD coinfección / sobreinfección — ancho completo
sec(1, [
  H3('Coinfección y sobreinfección VHB/VHD: marcadores séricos (diap. 17)'),
  ...FIGROW([
    { file: ES('17_VHB_VHD_coinfeccion_serologia_ES.png'), w: 205, sub: '**Coinfección aguda y autolimitada VHB/VHD**' },
    { file: ES('18_VHD_sobreinfeccion_serologia_ES.png'), w: 222, sub: '**Sobreinfección por VHD de un portador crónico de VHB**' },
  ], 7400, fig('Marcadores séricos de la coinfección (izq.) y de la sobreinfección (der.) (diap. 17).' + tr)),
  TABLE([2000, 4700, 4972], ['Aspecto', 'Coinfección aguda VHB/VHD', 'Sobreinfección por VHD en un portador crónico de VHB'], [
    ['Situación', 'Infección simultánea por VHB y VHD.', 'El VHD se adquiere sobre una infección crónica por VHB.'],
    ['**HBsAg**', 'Positivo.', 'Presente; puede caer transitoriamente a niveles muy bajos y rara vez indetectables, porque el VHD suprime transitoriamente la replicación del VHB.'],
    ['**IgM anti-HBc**', '[[Títulos elevados]].', '[[Debería ser negativa]].'],
    ['**HDAg / ARN-VHD**', 'Suelen ser positivos al momento de la presentación.', 'Suelen ser positivos al momento de la presentación; [[ARN-VHD persistente]].'],
    ['**Anti-VHD**', 'IgM anti-HDV seguida de IgG anti-HDV (Fig. 13, izq.).', 'Títulos de anti-HDV (totales e IgM) en **rápido aumento**.'],
    ['**ALT**', 'Elevada durante la fase aguda (Fig. 13).', 'Anormal/elevada respecto de la basal (Fig. 13).'],
    ['**Evolución**', 'Aguda y **autolimitada**.', 'Persistencia del VHD (detección persistente de su ARN).'],
  ], { firstColFill: C.sub, zebra: true, keepTogether: true }),
  SP(),
  BOX('key', 'CLAVE DE EXAMEN · VHD', ['HBsAg (+) con **IgM anti-HBc (+)** → coinfección · HBsAg (+) con **IgM anti-HBc (−)** y anti-VHD en ascenso → sobreinfección de un portador crónico. La vacuna contra el VHB previene también la hepatitis D.'], TW),
  SP(40),
]);

// ===== Hepatitis E — dos columnas
sec(2, [
  H2('6. Hepatitis E (VHE)'),
  H3('Características y epidemiología (diap. 19)'),
  B('Virus **ARN sin envoltura**; familia Calliciviridae (según la clase).'),
  B('Transmisión [[oral-fecal (agua)]]; produce infecciones esporádicas en **viajeros**.'),
  B('**Endémico** en India, Nepal, Pakistán, África y México.'),
  B('Según la OMS (dato de la clase): ≈ **20 millones** de nuevas infecciones al año, más de 3 millones de casos de hepatitis aguda y más de 55 000 muertes.'),
  B('Incubación **2–8 semanas**; enfermedad **autolimitada**, similar a la causada por el VHA; según la clase, solo provoca un cuadro agudo.'),
  B('Mortalidad del **1–2 %** (≈ 10 veces la del VHA) y [[hasta 20 % en embarazadas]]; la hepatitis fulminante es rara, salvo en el embarazo.'),
  H3('Cuadro clínico (diap. 19)'),
  TABLE([Math.floor(CW / 2), CW - Math.floor(CW / 2)], ['Fase preictérica (1–10 días)', 'Fase ictérica (10–15 días)'], [
    [['• Dolor epigástrico', '• Náuseas', '• Vómitos'], ['• Ictericia', '• Coluria', '• Hepatomegalia']],
  ]),
  P('Mortalidad baja, **excepto en embarazadas**.', { spacing: { before: 40, after: 40 } }),
  H3('Diagnóstico (diap. 20)'),
  B('Anticuerpos frente al VHE por **ELISA**: en la infección aguda, la [[IgM se eleva casi simultáneamente con la IgG]].'),
  B('ARN del VHE en **heces y suero** mediante **RT-PCR**: su detección indica [[infección activa]].'),
  ...FIG(ES('20_VHE_curso_serologico_ES.png'), 300, fig('Curso serológico típico de la infección por VHE: virus en heces, síntomas, pico de ALT e IgM e IgG anti-HEV (diap. 20).' + tr)),
  H3('Tratamiento (contenido de la clase, diap. 20)'),
  B('Generalmente **innecesario**, porque la infección es autolimitada.'),
  B('Receptores de trasplante: **ribavirina** 600–800 mg durante 12 semanas (en la diapositiva figura como «Rivabirina»).'),
  B('El **Peg-IFN** ha demostrado reducir la carga viral del VHE.'),
  BOX('peach', 'ACTUALIZACIÓN · VHE', [
    '• **Taxonomía vigente (ICTV)**: familia **Hepeviridae** (especie Paslahepevirus balayani), no Caliciviridae.',
    '• Además de la vía hídrica (genotipos 1 y 2), existe transmisión **zoonótica** (genotipos 3 y 4: carne de cerdo o de caza poco cocida), y la infección puede **cronificarse en inmunodeprimidos** (p. ej., trasplantados); de ahí el uso de ribavirina en ellos.',
    '• Las pautas de tratamiento de la diapositiva son históricas u orientativas: no constituyen una recomendación terapéutica vigente.',
  ], CW),
  BOX('key', 'CLAVE DE EXAMEN · VHE', [
    '• ARN sin envoltura, oral-fecal (agua), autolimitada; regiones endémicas y viajeros.',
    '• Gravedad especial en el **embarazo** (hasta 20 % de mortalidad).',
    '• IgM e IgG casi simultáneas; ARN en heces o suero = infección activa.',
  ], CW),
]);

// ===== Cuadro comparativo A–E — ancho completo
const NE = '__n. e.__';
sec(1, [
  H2('7. Cuadro comparativo de las hepatitis virales A–E'),
  TABLE([1452, 2044, 2044, 2044, 2044, 2044], ['Característica', 'Hepatitis A', 'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Hepatitis E'], [
    ['**Familia (clase)**', NE, 'Hepadnaviridae', 'Flaviviridae', 'Deltaviridae*', 'Calliciviridae*'],
    ['**Genoma**', 'ARN (PCR de ARN viral)', 'ADN circular bicatenario incompleto (3.200 pb); TI', 'ARN monocatenario', 'ARN circular monocatenario (−), muy pequeño', 'ARN'],
    ['**Envoltura / tamaño**', NE, 'Cubierto (HBsAg); partícula de Dane 42 nm', 'Cubierto (E1, E2); ≈ 60 nm', 'Envoltura de HBsAg (del VHB)', 'Sin envoltura'],
    ['**Transmisión**', 'Fecal-oral (persona a persona, agua, alimentos)', 'Sangre y líquidos corporales', 'Sangre infectada y vía sexual', 'Sangre y fluidos; requiere VHB', 'Oral-fecal (agua); viajeros'],
    ['**Incubación**', '28 días (15–50)', '30–180 días', '2–26 semanas', '21–90 días', '2–8 semanas'],
    ['**Evolución**', 'Recuperación completa a los 6 meses en casi todos', 'Aguda o crónica; cronicidad inversa a la edad', '≈ 80 % de las agudas cronifica', 'Coinfección autolimitada; sobreinfección persistente', 'Autolimitada; solo cuadro agudo (clase)'],
    ['**Formas graves**', 'Fulminante < 1 % (> 50 años, hepatopatía previa)', 'Fulminante; cirrosis, CHC; 15–25 % de crónicos muere prematuramente', 'Cirrosis, várices, encefalopatía, CHC', 'Daño citopático (aguda) e inmunomediado (crónica)', 'Mortalidad 1–2 %; hasta 20 % en embarazadas'],
    ['**Diagnóstico**', 'IgM (ELISA); PCR de ARN', 'HBsAg + IgM anti-HBc (aguda); HBsAg > 6 m (crónica)', 'Anti-VHC (ELISA); ARN por PCR-TI', 'ARN por PCR-TI; HDAg o anti-VHD (ELISA)', 'IgM e IgG anti-VHE (ELISA); ARN por RT-PCR'],
    ['**Tratamiento (clase)**', 'Apoyo', NE, 'AAD: NS3/4A, NS5A, NS5B', 'Sin tratamiento específico; IFN-α o Peg-IFNα', 'Innecesario; trasplante: ribavirina; Peg-IFN'],
    ['**Prevención**', 'Vacuna (2 dosis); higiene de manos; > 85 °C 1 min; cloro, yodo', 'Vacuna (3 dosis); precauciones universales', NE, 'Vacuna contra el VHB', NE],
  ], { firstColFill: C.topic, zebra: true, keepTogether: true }),
  P('__n. e.__: no especificado en las diapositivas (no se completa con datos externos). *Taxonomía vigente: Kolmioviridae (VHD) y Hepeviridae (VHE); ver notas de actualización. CHC: carcinoma hepatocelular; LSN: límite superior normal.', { style: 'Leyenda', alignment: AlignmentType.LEFT }),
  SP(40),
  H1('UNIDAD II · ALERGIAS ALIMENTARIAS'),
]);

// ===== UNIDAD II — dos columnas
sec(2, [
  H2('1. Definición y epidemiología'),
  H3('Definición (diap. 21)'),
  BOX('sub', null, [
    '{{AAAAI}} (American Academy of Allergy, Asthma & Immunology): [[reacción inmunológica reproducible]], resultado de la exposición o ingesta de un alimento o aditivo alimentario (**alérgeno**).',
    '{{EAACI}} (European Academy of Allergy and Clinical Immunology): las reacciones inmunológicas pueden ser **mediadas por IgE** o por **otros posibles mecanismos inmunes**.',
  ], CW),
  H3('Epidemiología (diap. 22)'),
  B('La alergia a los alimentos afecta al [[4–5 % de la población mundial]].'),
  B('El **90 %** de los casos se debe a: huevo, leche, soja, trigo, maní, nueces, pescado y crustáceos.'),
  B('Afecta la calidad de vida del paciente y de la familia y aumenta los gastos en salud.'),
  B('Pocas alternativas de tratamiento; los nuevos enfoques muestran resultados alentadores.'),

  H2('2. Alérgenos alimentarios principales (diap. 25)'),
  TABLE([Math.floor(CW / 2), CW - Math.floor(CW / 2)], ['Los pacientes adquieren tolerancia', 'Alergias que persisten toda la vida'], [
    [{ md: '**Leche · huevo · trigo**', align: AlignmentType.CENTER, fill: C.mint }, { md: '**Cacahuates (maní) · nueces · pescado**', align: AlignmentType.CENTER, fill: C.pink }],
    [{ md: new Paragraph({ children: [L.img(CR('23_Alimentos_tolerancia_RECORTE.png'), 165, 'Leche y huevos')], alignment: AlignmentType.CENTER }) },
     { md: new Paragraph({ children: [L.img(CR('23_Alimentos_persistentes_RECORTE.png'), 165, 'Cacahuates')], alignment: AlignmentType.CENTER }) }],
  ]),
  CAP(fig('Alimentos alergénicos según su evolución (fotografías recortadas de la diap. 25).')),
  H3('Factores de riesgo (diap. 26)'),
  TABLE([Math.floor(CW / 2), CW - Math.floor(CW / 2)], null, [
    [{ md: 'Alimentación rica en grasas no sanas', fill: C.peach }, { md: 'Obesidad', fill: C.peach }],
    [{ md: 'Higiene excesiva', fill: C.peach }, { md: 'Tiempo de exposición a alimentos', fill: C.peach }],
    [{ md: 'Genética', fill: C.peach }, { md: 'Estilos de vida no saludables', fill: C.peach }],
    [{ md: 'Deficiencia de vitamina D', fill: C.peach }, { md: 'Sexo masculino', fill: C.peach }],
  ]),

  H2('3. Barrera gastrointestinal e inmunidad de mucosas'),
  H3('Barrera intestinal (diap. 23)'),
  B('El tracto gastrointestinal es el [[mayor reservorio de células inmunes]] del cuerpo.'),
  B('El sistema inmune de la mucosa está separado del **lumen intestinal** por una **sola capa de células columnares epiteliales**, que secretan factores que contribuyen a la [[función de barrera]].'),
  ...FIG(CR('21_Barrera_intestinal_RECORTE.png'), 320, fig('Mucosa intestinal: lumen, vellosidades, microvellosidades, epitelio cilíndrico, tejido conectivo, quilífero central y capilares (diap. 23). Recorte sin el texto de la diapositiva.')),
  BOX('mint', 'CÉLULAS INMUNES RESIDENTES DE LA MUCOSA (diap. 24)', [
    '• Linfocitos ~~T CD4+~~ y ~~CD8+~~ efectores y **T reguladores**.',
    '• **Células B secretoras de anticuerpos**.',
    '• Fagocitos mononucleares: **macrófagos y células dendríticas**.',
    '• **Eosinófilos** residentes en la mucosa intestinal.',
  ], CW),

  H2('4. Fisiopatología'),
  H3('Dos mecanismos (diap. 27)'),
  B('Se conocen dos mecanismos que distinguen las reacciones [[mediadas por IgE]] (inicio **pronto** de los síntomas) de las [[no mediadas por IgE]] (manifestación **tardía**).'),
  BOX('mint', 'ENTRADA DEL ANTÍGENO', ['Diminutas cantidades de **antígenos alimentarios** atraviesan la **barrera intestinal** o son absorbidas selectivamente por las ~~células M~~ de las **placas de Peyer** → contacto con células **presentadoras de antígeno** y linfocitos locales.'], CW),
  SP(),
  TABLE([Math.floor(CW / 2), CW - Math.floor(CW / 2)], ['Individuo normal', 'Individuo con reacciones alérgicas'], [
    ['Genera anticuerpos **IgA, IgM e IgG** frente al antígeno alimentario.', ['• Produce **IgE específica** para el antígeno alimentario.', '• Respuestas **anormales de las células T**.']],
  ]),
  H3('Individuos atópicos y no atópicos (diap. 28)'),
  TABLE([Math.floor(CW / 2), CW - Math.floor(CW / 2)], ['Individuos atópicos', 'Individuos NO atópicos'], [
    [['• **Predisposición** al desarrollo de alergias asociadas a IgE.', '• Las células presentadoras de antígeno (**dendríticas o células B**) activan linfocitos ~~Th2~~, cuyas citocinas (**IL-4, IL-13**) inducen el cambio [[hacia IgE alérgeno-específica]].'],
     ['• Ante el contacto con un alérgeno alimentario de primera intención producen [[IgG alérgeno-específica e IgA]], que **no** inducen reacciones alérgicas.']],
  ], {}),
]);

// ===== Sensibilización / reexposición — ancho completo
sec(1, [
  H2('5. Sensibilización y reexposición: respuesta mediada por IgE'),
  ...FIG(ORI('22_Alergia_IgE_sensibilizacion_reexposicion.png'), 570, fig('Sensibilización y reexposición al alérgeno: macrófago, linfocito T cooperador, linfocito B productor de IgE, mastocito e histamina; órganos diana: rinitis alérgica, eczema/urticaria, asma y alergia alimentaria (diap. 24). Ilustración original en español.')),
  FLOW([
    '**1.ª EXPOSICIÓN**\nAlérgeno alimentario',
    'Célula presentadora (macrófago; dendrítica o B, diap. 28)',
    'Linfocito T cooperador ~~Th2~~: **IL-4, IL-13**',
    'Linfocito B: cambio a **IgE específica**',
    'IgE se fija al **mastocito** = sensibilización',
  ].map((s) => s.split('\n')), TW, { fills: [C.sub, C.sub, C.mint, C.mint, C.mint], acc: ACC.sub }),
  SP(40),
  FLOW([
    '**REEXPOSICIÓN**\nEl alérgeno se une a la IgE del mastocito',
    'Liberación de **histamina** (desgranulación)',
    'Síntomas pronto: **primeras 2 h**',
    'Piel · tubo digestivo · vías respiratorias',
    '[[Anafilaxia]] (multisistémica)',
  ].map((s) => s.split('\n')), TW, { fills: [C.pink, C.pink, C.key, C.key, C.key], acc: ACC.pink }),
  SP(),
  BOX('peach', 'COMPLEMENTO INMUNOLÓGICO', ['La IgE se une al receptor de alta afinidad **FcεRI** de mastocitos y basófilos; en la reexposición, el alérgeno **entrecruza** IgE adyacentes y desencadena la desgranulación (histamina, triptasa) y la síntesis de leucotrienos y prostaglandinas. La figura de la clase muestra un macrófago como célula presentadora; la diapositiva 28 precisa que la presentación la realizan células dendríticas o linfocitos B.'], TW),
  SP(40),
]);

// ===== Mediadas / no mediadas — dos columnas
sec(2, [
  H2('6. Reacciones mediadas por IgE (diap. 29–30)'),
  P('Ocurren típicamente [[en las primeras dos horas]] tras la ingesta del alimento e involucran la **piel**, el **tracto gastrointestinal** y el **tracto respiratorio**.'),
  TABLE([1000, 1550, CW - 2550], ['Sistema', 'Manifestación', 'Rasgos según la clase'], [
    [{ md: '**Cutáneo**', fill: C.pink }, '**Urticaria / angioedema**', 'Más frecuente en niños; por contacto o ingesta; casi siempre aguda.'],
    [{ md: '**Digestivo**', fill: C.pink }, '**Gastrointestinal**', 'Dolor, vómito, diarrea, sangrado intestinal micro o macroscópico.'],
    [{ md: '**Digestivo**', fill: C.pink }, '**Síndrome de alergia oral**', 'En alergia confirmada al polen: prurito y edema de la cavidad oral; rara vez progresa.'],
    [{ md: '**Digestivo**', fill: C.pink }, '**Hipersensibilidad GI inmediata**', 'Vómito aislado; más frecuentemente relacionada con anafilaxia.'],
    [{ md: '**Respiratorio**', fill: C.pink }, '**Asma y rinitis**', 'Pueden acompañar una reacción alérgica alimentaria; rara vez aisladas.'],
    [{ md: '**Ocular / nasal**', fill: C.pink }, '**Rinoconjuntivitis**', 'Prurito, epífora e inyección conjuntival secundarios a ingesta o inhalación de alimentos.'],
    [{ md: '**Sistémico**', fill: C.key }, { md: '[[Anafilaxia]]', fill: C.key }, { md: 'Multisistémica; puede llegar al **colapso cardiovascular**; puede ser **bifásica** o **inducida por ejercicio**.', fill: C.key }],
  ]),
  SP(),
  ...FIGROW([
    { file: CR('27_Molecula_IgE_RECORTE.png'), w: 100, cw: 1700, valign: VerticalAlign.CENTER },
    { cw: CW - 1700, valign: VerticalAlign.CENTER, children: [
      P('**Molécula de IgE** (diap. 30): 2 cadenas pesadas (dominios VH, CH1–CH4) y 2 cadenas ligeras (VL, CL). Es el anticuerpo que, fijado al mastocito, inicia la reacción inmediata al reconocer el alérgeno.', { style: 'TablaTexto' }),
    ] },
  ], CW, fig('Estructura de la IgE (recorte de la diap. 30).')),
  H3('Anafilaxia (diap. 30)'),
  P('Reacción **multisistémica** que puede llegar al [[colapso cardiovascular]]. Implicaciones importantes: **anafilaxia bifásica** (reaparición de los síntomas tras una mejoría inicial) y **anafilaxia inducida por ejercicio**.'),
  BOX('peach', 'NOTA CLÍNICA (COMPLEMENTO)', ['La clase no detalla el manejo. Según las guías internacionales de anafilaxia, el tratamiento de primera línea es la **adrenalina intramuscular**; antihistamínicos y corticoides son coadyuvantes.'], CW),

  H2('7. Reacciones no mediadas por IgE (diap. 31–32)'),
  P('Reacciones mediadas por el sistema inmune (**hay sensibilización**), pero [[no por IgE]]; de manifestación **tardía**.'),
  TABLE([1900, CW - 1900], ['Entidad', 'Rasgos según la clase'], [
    [{ md: 'Enteropatía inducida por proteínas de los alimentos', fill: C.pink }, 'Citada como entidad no mediada por IgE.'],
    [{ md: 'Exacerbaciones de desórdenes GI eosinofílicos', fill: C.pink }, 'Gastritis, enteritis, colitis y gastroenteritis **eosinofílicas**.'],
    [{ md: 'Dermatitis inducida por alimentos', fill: C.pink }, 'Citada como entidad no mediada por IgE.'],
    [{ md: '[[Enterocolitis inducida por alimentos]]', fill: C.pink }, 'Afecta principalmente a **niños**: letargo, emesis, diarrea prolongada y pobre crecimiento; **acidosis y metahemoglobinemia** transitorias.'],
    [{ md: '[[Proctocolitis alérgica]] inducida por proteínas alimentarias', fill: C.pink }, '**Heces con sangre y moco** en lactantes.'],
    [{ md: 'Enfermedad celíaca', fill: C.pink }, 'Desorden **autoinmune** que conduce a enteropatía y malabsorción; genética y activada por la **gliadina** (proteína del gluten).'],
    [{ md: 'Síndrome respiratorio de Heiner (hemosiderosis pulmonar)', fill: C.pink }, ['• Rinitis crónica', '• Infiltrados pulmonares y hemosiderosis', '• Pérdida de sangre por vía GI', '• Anemia por deficiencia de hierro', '• Declinación del crecimiento']],
  ]),
  SP(),
  BOX('peach', 'ACTUALIZACIÓN', [
    '• En clasificaciones actuales (p. ej., EAACI), los trastornos gastrointestinales eosinofílicos y la dermatitis atópica se consideran **mixtos** (IgE y no IgE).',
    '• La enterocolitis inducida por proteínas alimentarias se conoce por su sigla inglesa **FPIES**; el síndrome de Heiner se asocia clásicamente a la **proteína de la leche de vaca**.',
  ], CW),
]);

// ===== Cuadro comparativo IgE vs no IgE — ancho completo
sec(1, [
  H2('8. Cuadro comparativo: reacciones mediadas y no mediadas por IgE'),
  TABLE([2000, 4836, 4836], ['Criterio', 'Mediadas por IgE', 'No mediadas por IgE'], [
    ['**Mecanismo**', 'IgE alérgeno-específica (Th2 → IL-4/IL-13) fijada a mastocitos → histamina', 'Inmune, con sensibilización, pero **sin IgE**; participan otros mecanismos (p. ej., respuestas anormales de células T)'],
    ['**Inicio**', '[[Pronto]]: típicamente en las primeras 2 horas', '[[Tardío]]'],
    ['**Órganos**', 'Piel, tubo digestivo y vías respiratorias; compromiso sistémico', 'Predominio digestivo; también piel (dermatitis) y pulmón (síndrome de Heiner)'],
    ['**Entidades**', 'Urticaria/angioedema, síntomas GI, síndrome de alergia oral, hipersensibilidad GI inmediata, asma y rinitis, rinoconjuntivitis, **anafilaxia**', 'Enteropatía por proteínas, desórdenes GI eosinofílicos, dermatitis, **enterocolitis**, **proctocolitis**, **enfermedad celíaca**, **síndrome de Heiner**'],
    ['**Gravedad típica**', 'Puede ser inmediata y grave: anafilaxia, colapso cardiovascular', 'Cuadros subagudos o crónicos: diarrea prolongada, pobre crecimiento, malabsorción, anemia; en la enterocolitis, acidosis y metahemoglobinemia'],
    ['**Población destacada**', 'Urticaria/angioedema más frecuente en niños', 'Enterocolitis en niños; proctocolitis en lactantes'],
    ['**Pruebas citadas en clase**', 'Niveles de **IgE específica**; retos orales en algunos casos', '**Pruebas de parche**; retos orales en algunos casos (correspondencia orientativa)'],
  ], { firstColFill: C.topic, zebra: true, keepTogether: true }),
  SP(40),
]);

// ===== Diagnóstico, prevención, claves, bibliografía — dos columnas
sec(2, [
  H2('9. Diagnóstico (diap. 33)'),
  P('El primer paso siempre será una [[historia clínica detallada]] y una **exploración física exhaustiva**; además, se requieren pruebas específicas (pruebas de **parche** y/o niveles de **IgE específica**) y, en algunos casos, **retos orales**.'),
  FLOW([
    '**Historia clínica** detallada',
    '**Exploración física** exhaustiva',
    '**Pruebas específicas**: parche y/o IgE específica',
    '**Reto oral** (en algunos casos)',
  ].map((s) => [s]), CW, { vertical: true, fills: [C.sub, C.sub, C.mint, C.key], acc: ACC.sub }),
  SP(),
  TABLE([380, CW - 380], ['N.º', 'En la historia clínica se valorarán'], [
    ['1', 'Antecedentes **familiares y personales de atopia** para establecer el riesgo.'],
    ['2', 'Relación entre los síntomas y la **exposición al alimento**.'],
    ['3', '**Tiempo** transcurrido entre el contacto o la ingesta y la aparición de los síntomas.'],
    ['4', '**Cantidad** del alimento ingerido que provocó la reacción.'],
    ['5', 'Si el alimento se **tolera en otras presentaciones** (cocinado, calentado, fermentado).'],
    ['6', 'Características y **gravedad** de los síntomas (leve-moderado o grave).'],
    ['7', '**Edad** de comienzo.'],
    ['8', 'Factores asociados o **desencadenantes**.'],
    ['9', '**Respuesta** del paciente al tratamiento.'],
  ], { firstColFill: C.sub }),
  SP(),
  BOX('peach', 'COMPLEMENTO', ['Las pruebas cutáneas (prick) y la IgE específica demuestran **sensibilización**, no necesariamente alergia clínica; la **prueba de provocación oral doble ciego controlada con placebo** es el estándar de referencia.'], CW),

  H2('10. Prevención primaria (diap. 33, Tabla V)'),
  TABLE([2150, CW - 2150], ['Estrategia presentada en clase', 'Estado actual (nota de actualización)'], [
    ['Dietas hipoalergénicas durante el **embarazo**', { md: 'No se recomiendan: no previenen la alergia alimentaria.', fill: C.peach }],
    ['Dietas hipoalergénicas durante la **lactancia**', { md: 'No se recomiendan con fines preventivos.', fill: C.peach }],
    ['Dietas hipoalergénicas en el **período perinatal** (madre y niño)', { md: 'No se recomiendan.', fill: C.peach }],
    ['Promoción de la **lactancia materna**', { md: 'Se mantiene por sus beneficios generales; su efecto preventivo específico sobre la alergia alimentaria es limitado.', fill: C.peach }],
    ['Dietas basadas en **proteínas de la soja**', { md: 'No se recomiendan para prevenir la alergia.', fill: C.peach }],
    ['Fórmulas infantiles con **proteínas hidrolizadas**', { md: 'Evidencia insuficiente: las guías recientes no las recomiendan de rutina para prevenir la alergia.', fill: C.peach }],
    ['**Retrasar** la introducción de sólidos', { md: '[[Ya no se recomienda]]: introducir tempranamente (≈ 4–6 meses) alimentos alergénicos como **maní y huevo** reduce el riesgo en lactantes de alto riesgo (estudio LEAP; guías AAP 2019 y EAACI 2020).', fill: C.peach }],
  ], { firstColFill: C.sub }),
  P('La Tabla V refleja protocolos históricos; las notas resumen guías recientes y no sustituyen la indicación médica individual.', { style: 'Leyenda', alignment: AlignmentType.LEFT }),
  BOX('key', 'CLAVES DE EXAMEN · ALERGIAS ALIMENTARIAS', [
    '• Alergia alimentaria = reacción **inmunológica reproducible** a un alimento o aditivo (AAAAI); puede ser IgE o no IgE (EAACI).',
    '• 4–5 % de la población; 90 %: huevo, leche, soja, trigo, maní, nueces, pescado y crustáceos.',
    '• Tolerancia adquirida: **leche, huevo, trigo**; persistentes: **maní, nueces, pescado**.',
    '• Atópico: Th2 → **IL-4/IL-13** → IgE; no atópico: **IgG + IgA** sin reacción.',
    '• IgE: pronto (≤ 2 h), mastocito-histamina, anafilaxia; no IgE: tardías, predominio digestivo (enterocolitis, proctocolitis, celíaca, Heiner).',
    '• Diagnóstico: historia clínica → exploración → IgE específica / parche → reto oral.',
  ], CW),

  H2('Referencias bibliográficas (diap. 34)'),
  ...[
    'Abbas, A. K., Lichtman, A. H., & Pillai, S. (2022). __Inmunología celular y molecular__ (10.ª ed.). Elsevier.',
    'Carroll, K. C., Hobden, J. A., Miller, S., Morse, S., Mietzner, T. A., Detrick, B., Mitchell, T., & Schwartzman, J. (2019). __Jawetz, Melnick & Adelberg: Microbiología médica__ (28.ª ed.). McGraw-Hill Education.',
    'Coico, R., & Sunshine, G. (2015). __Inmunología: Curso básico__ (7.ª ed.). Wiley-Blackwell.',
    'Kindt, T. J., Goldsby, R. A., & Osborne, B. A. (2007). __Kuby inmunología__ (6.ª ed.). W. H. Freeman.',
    'Madigan, M. T., Bender, K. S., Buckley, D. H., Sattley, W. M., & Stahl, D. A. (2019). __Biología de los microorganismos de Brock__ (15.ª ed.). Pearson.',
    'Murray, P. R., Rosenthal, K. S., & Pfaller, M. A. (2021). __Microbiología médica__ (10.ª ed.). Elsevier.',
    'Ryan, K. J., & Ray, C. G. (Eds.). (2014). __Sherris: Microbiología médica__ (6.ª ed.). McGraw-Hill Education.',
  ].map((t) => P(t, { style: 'Referencia' })),
  H3('Fuentes de las notas de actualización'),
  ...[
    'International Committee on Taxonomy of Viruses (ICTV). __Virus Taxonomy: Master Species List__ (versión vigente): Kolmioviridae, Hepeviridae.',
    'European Medicines Agency. __Hepcludex (bulevirtida): informe público europeo de evaluación__ (2020).',
    'Greer, F. R., Sicherer, S. H., Burks, A. W., et al. (2019). The effects of early nutritional interventions on the development of atopic disease in infants and children. __Pediatrics__, 143(4), e20190281.',
    'Halken, S., Muraro, A., de Silva, D., et al. (2021). EAACI guideline: Preventing the development of food allergy in infants and young children (2020 update). __Pediatric Allergy and Immunology__, 32(5), 843–858.',
    'Du Toit, G., Roberts, G., Sayre, P. H., et al. (2015). Randomized trial of peanut consumption in infants at risk for peanut allergy (LEAP). __New England Journal of Medicine__, 372(9), 803–813.',
    'Muraro, A., Worm, M., Alviani, C., et al. (2022). EAACI guidelines: Anaphylaxis (2021 update). __Allergy__, 77(2), 357–377.',
    'Ministerio de Salud del Perú. __NTS N.° 196-MINSA/DGIESP-2022: Esquema Nacional de Vacunación__.',
  ].map((t) => P(t, { style: 'Referencia' })),
]);

// Sección final vacía (continua) para equilibrar las columnas de la última página
sec(1, [new Paragraph({ children: [], spacing: { before: 0, after: 0, line: 20, lineRule: 'exact' } })]);

// ---------------------------------------------------------------- DOCUMENTO
const FONT_C = 'Arial Nova Cond';
const FONT_N = 'Arial Nova';
const footer = new Footer({ children: [new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0, line: 150, lineRule: 'exact' },
  children: [new TextRun({ text: 'Sesión 14 · Hepatitis viral y alergias alimentarias · Mecanismos de Agresión y Defensa III · pág. ', size: 12, color: '7A8295', font: FONT_N }),
    new TextRun({ children: [PageNumber.CURRENT], size: 12, color: '7A8295', font: FONT_N })],
})] });

const doc = new Document({
  creator: 'Resumen académico', title: 'Sesión 14: Hepatitis viral y alergias alimentarias',
  subject: 'Resumen digital de Medicina Humana', description: 'Resumen de la Sesión 14 (34 diapositivas) con ilustraciones traducidas al español',
  hyphenation: { autoHyphenation: true },
  styles: {
    default: {
      heading1: { run: { font: FONT_N, size: 26, bold: true, color: 'FFFFFF' },
        paragraph: { alignment: AlignmentType.LEFT, shading: L.sh(C.navy), spacing: { before: 60, after: 80 }, keepNext: true, keepLines: true, outlineLevel: 0, indent: { left: 60 } } },
      heading2: { run: { font: FONT_N, size: 22, bold: true, color: C.navy },
        paragraph: { alignment: AlignmentType.LEFT, shading: L.sh(C.topic), spacing: { before: 110, after: 50 }, keepNext: true, keepLines: true, outlineLevel: 1,
          border: { left: { style: BorderStyle.SINGLE, size: 24, color: ACC.topic, space: 3 } } } },
      heading3: { run: { font: FONT_C, size: 20, bold: true, color: '1F3A60' },
        paragraph: { alignment: AlignmentType.LEFT, shading: L.sh(C.sub), spacing: { before: 70, after: 30 }, keepNext: true, keepLines: true, outlineLevel: 2 } },
      document: { run: { font: FONT_C, size: 18, language: { value: 'es-ES' } }, paragraph: { alignment: AlignmentType.JUSTIFIED, spacing: { before: 0, after: 30, line: 240, lineRule: 'auto' } } },
    },
    paragraphStyles: [
      { id: 'TituloPrincipal', name: 'Título principal (resumen)', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT_C, size: 32, bold: true, color: C.navy },
        paragraph: { alignment: AlignmentType.CENTER, shading: L.sh(C.title), spacing: { before: 0, after: 20 }, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '7CC3CF', space: 2 } } } },
      { id: 'Subtitulo', name: 'Subtítulo del resumen', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT_N, size: 15, color: '4A5468' }, paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 50 } } },
      { id: 'Leyenda', name: 'Leyenda de figura', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT_N, size: 15, color: '3A4256' }, paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 10, after: 80, line: 220, lineRule: 'auto' } } },
      { id: 'TablaTexto', name: 'Texto de tabla', basedOn: 'Normal', quickFormat: true,
        run: { font: FONT_C, size: 16 }, paragraph: { alignment: AlignmentType.LEFT, spacing: { before: 0, after: 0, line: 228, lineRule: 'auto' } } },
      { id: 'TablaEncabezado', name: 'Encabezado de tabla', basedOn: 'TablaTexto', quickFormat: true,
        run: { font: FONT_C, size: 17, bold: true, color: 'FFFFFF' }, paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 }, keepNext: true } },
      { id: 'CajaTexto', name: 'Texto de recuadro', basedOn: 'Normal', quickFormat: true,
        run: { font: FONT_C, size: 17 }, paragraph: { alignment: AlignmentType.LEFT, spacing: { before: 0, after: 10, line: 232, lineRule: 'auto' } } },
      { id: 'Referencia', name: 'Referencia bibliográfica', basedOn: 'Normal', quickFormat: true,
        run: { font: FONT_C, size: 16 }, paragraph: { alignment: AlignmentType.LEFT, spacing: { after: 30 }, indent: { left: 284, hanging: 284 } } },
    ],
  },
  numbering: { config: [
    { reference: 'vinetas', levels: [
      { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 200, hanging: 140 } }, run: { color: ACC.topic } } },
      { level: 1, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 140 } } } },
    ] },
    { reference: 'vinetasTabla', levels: [
      { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 150, hanging: 120 } } } },
    ] },
  ] },
  sections: S.map((s, i) => ({
    properties: {
      type: SectionType.CONTINUOUS,
      page: { size: { width: G.PW, height: G.PH }, margin: { top: G.M, bottom: G.M, left: G.M, right: G.M, header: 142, footer: 113 } },
      column: s.cols === 2 ? { count: 2, space: G.SPACE, equalWidth: true } : { count: 1, space: G.SPACE },
    },
    footers: i === 0 ? { default: footer } : undefined,
    children: s.children,
  })),
});

Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(OUT, buf); console.log('OK', OUT, (buf.length / 1024 / 1024).toFixed(2) + ' MB', 'figuras:', figN); });
