# Traducción de las ilustraciones · Sesión 14

Se tradujo **solo el texto que estaba en inglés** dentro de las ilustraciones del ZIP. Formas, colores, flechas, curvas, escalas, valores numéricos y proporciones se conservaron.

## Método

1. Se localizó cada rótulo en inglés y se borró solo ese texto, reconstruyendo el fondo a partir de los píxeles vecinos. En fondos con degradado o con curvas cercanas solo se reemplazaron los píxeles del texto.
2. La imagen completa se amplió ×3 (remuestreo LANCZOS) para que se imprima nítida.
3. La traducción se escribió en la misma posición, con un tipo de letra semejante y con el tamaño, la línea base, la alineación y el color medidos del texto original.
4. Cada figura se comparó con su original (carpeta `ilustraciones/control_calidad/`).
5. Los originales se conservan sin cambios en `ilustraciones/originales/` (suma SHA-256 verificada idéntica a la del ZIP).

**Se mantuvieron sin traducir** (nomenclatura científica): HBsAg, HBeAg, anti-HBe, anti-HBs, IgM/IgG anti-HBc, HDAg, anti-HDV, anti-HEV, L-/M-/S-HBsAg, ALT, IgM, IgG, NS3/4A, NS5A, NS5B, NNPI, nombres de fármacos y las siglas de virus HAV, HBV, HDV y HEV (equivalen a VHA, VHB, VHD y VHE). En las frases con ácidos nucleicos solo se tradujo la palabra inglesa: «HBV DNA» → «ADN-HBV» y «HDV RNA» → «ARN-HDV».

## Rótulos traducidos por figura

### 04_VHA_curso_serologico.png → `04_VHA_curso_serologico_ES.png`

| Original (inglés) | Traducción (español) | Fuente |
|---|---|---|
| Clinical illness | Enfermedad clínica | DejaVu Sans |
| Infection | Infección | DejaVu Sans |
| Response | Respuesta | DejaVu Sans Bold |
| HAV in stool | HAV en heces | DejaVu Sans |
| Week | Semana | DejaVu Sans Bold |

### 11_VHB_serologia_aguda.png → `11_VHB_serologia_aguda_ES.png`

| Original (inglés) | Traducción (español) | Fuente |
|---|---|---|
| Acute / infection | Infección / aguda | DejaVu Sans Bold |
| HBV DNA | ADN-HBV | DejaVu Sans |
| Months | Meses | DejaVu Sans Bold |
| HBV exposure | Exposición al HBV | DejaVu Sans Bold |

### 12_VHB_serologia_cronica.png → `12_VHB_serologia_cronica_ES.png`

| Original (inglés) | Traducción (español) | Fuente |
|---|---|---|
| Chronic / infection | Infección / crónica | DejaVu Sans Bold |
| HBV DNA | ADN-HBV | DejaVu Sans |
| Years | Años | DejaVu Sans Bold |

### 14_VHC_ciclo_y_dianas_farmacologicas.png → `14_VHC_ciclo_y_dianas_farmacologicas_ES.png`

| Original (inglés) | Traducción (español) | Fuente |
|---|---|---|
| Nucleocapsid | Nucleocápside | Carlito |
| Envelope | Envoltura | Carlito |
| RNA | ARN | Carlito |
| Receptor binding / and endocytosis | Unión al receptor / y endocitosis | Carlito |
| Protease / inhibitors | Inhibidores / de proteasa | Carlito Bold |
| Fusion and / uncoating | Fusión y / denudación | Carlito |
| (+) RNA | (+) ARN | Carlito |
| Translation and polyprotein processing | Traducción y procesamiento de la poliproteína | Carlito |
| NS5A / inhibitors | Inhibidores / de NS5A | Carlito Bold |
| Transport / and release | Transporte / y liberación | Carlito |
| Viral / assembly | Ensamblaje / viral | Carlito |
| NS5B polymerase / inhibitors | Inhibidores de la / polimerasa NS5B | Carlito Bold |
| RNA / replication | Replicación / del ARN | Carlito |

### 15_VHD_relacion_VHB_VHD.png → `15_VHD_relacion_VHB_VHD_ES.png`

| Original (inglés) | Traducción (español) | Fuente |
|---|---|---|
| capsid | cápside | Carlito |
| rcDNA / genome | ADNrc / genómico | Carlito |
| RNA / genome | ARN / genómico | Carlito |
| polymerase | polimerasa | Carlito |

### 16_VHD_genoma_y_estructura.png → `16_VHD_genoma_y_estructura_ES.png`

| Original (inglés) | Traducción (español) | Fuente |
|---|---|---|
| HDV RNA | ARN-HDV | DejaVu Sans Bold |

### 17_VHB_VHD_coinfeccion_serologia.png → `17_VHB_VHD_coinfeccion_serologia_ES.png`

| Original (inglés) | Traducción (español) | Fuente |
|---|---|---|
| Time | Tiempo | DejaVu Sans Bold |
| Time | Tiempo | DejaVu Sans Bold |
| Increased ALT | ALT elevada | DejaVu Sans |
| HDV RNA | ARN-HDV | DejaVu Sans |

### 18_VHD_sobreinfeccion_serologia.png → `18_VHD_sobreinfeccion_serologia_ES.png`

| Original (inglés) | Traducción (español) | Fuente |
|---|---|---|
| Time | Tiempo | DejaVu Sans Bold |
| Time | Tiempo | DejaVu Sans Bold |
| ALT baseline | ALT basal | DejaVu Sans Bold |
| Abnormal/increased | Anormal/elevada | DejaVu Sans Bold |
| ALT baseline | ALT basal | DejaVu Sans Bold |
| HDV RNA | ARN-HDV | DejaVu Sans Bold |

### 20_VHE_curso_serologico.png → `20_VHE_curso_serologico_ES.png`

| Original (inglés) | Traducción (español) | Fuente |
|---|---|---|
| Symptoms | Síntomas | DejaVu Sans Bold |
| Titer | Título | DejaVu Sans Bold |
| Virus in stool | Virus en heces | DejaVu Sans Bold |
| Weeks after exposure | Semanas después de la exposición | DejaVu Sans Bold |

## Ilustraciones sin texto en inglés (se usan intactas)

01 (solo siglas internacionales), 02, 03, 05, 06, 07, 08 (las casillas BIL/UBG… son abreviaturas impresas en la tira reactiva), 09, 10, 13, 21 y 22 ya estaban en español o no tienen texto.

## Ilustraciones no insertadas o insertadas como recorte

- **19** (ilustración 3D de la hepatitis E): es decorativa y no aporta información académica, por eso no se insertó.
- **21**: se insertó solo el esquema de la mucosa, sin el texto de la diapositiva (`recortes/21_Barrera_intestinal_RECORTE.png`).
- **23**: se recortaron las fotografías de alimentos para la tabla de alérgenos.
- **27**: se recortó la molécula de IgE.
- **24, 25, 26, 28, 29 y 30**: son diapositivas de texto o tablas; su contenido se reconstruyó como **tablas editables de Word**, tal como indica el catálogo.

## Nota sobre la vista previa en PDF

El Word usa **Arial Nova Cond** y **Arial Nova** (fuentes en la nube de Microsoft 365). El PDF de vista previa se generó con LibreOffice y una fuente sustituta condensada de métricas parecidas, porque Arial Nova no estaba disponible en el equipo de conversión. En Word la paginación puede variar ligeramente.

## Herramientas

`herramientas/translate_figs.py` + `config.json` reproducen la traducción de las figuras; `build_docx.js` + `lib.js` generan el Word (docx-js) y `fix_settings.py` corrige el orden de un elemento de `settings.xml` para que cumpla el esquema OOXML.
