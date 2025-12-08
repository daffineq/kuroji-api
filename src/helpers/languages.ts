const ISO_639_1_MAP: Record<string, string> = {
  // Afar
  aa: 'aa',
  aar: 'aa',

  // Abkhazian
  ab: 'ab',
  abk: 'ab',

  // Afrikaans
  af: 'af',
  afr: 'af',

  // Akan
  ak: 'ak',
  aka: 'ak',

  // Albanian
  sq: 'sq',
  sqi: 'sq',
  alb: 'sq',

  // Amharic
  am: 'am',
  amh: 'am',

  // Arabic
  ar: 'ar',
  ara: 'ar',

  // Aragonese
  an: 'an',
  arg: 'an',

  // Armenian
  hy: 'hy',
  hye: 'hy',
  arm: 'hy',

  // Assamese
  as: 'as',
  asm: 'as',

  // Avaric
  av: 'av',
  ava: 'av',

  // Avestan
  ae: 'ae',
  ave: 'ae',

  // Aymara
  ay: 'ay',
  aym: 'ay',

  // Azerbaijani
  az: 'az',
  aze: 'az',

  // Bashkir
  ba: 'ba',
  bak: 'ba',

  // Bambara
  bm: 'bm',
  bam: 'bm',

  // Basque
  eu: 'eu',
  eus: 'eu',
  baq: 'eu',

  // Belarusian
  be: 'be',
  bel: 'be',

  // Bengali
  bn: 'bn',
  ben: 'bn',

  // Bislama
  bi: 'bi',
  bis: 'bi',

  // Bosnian
  bs: 'bs',
  bos: 'bs',

  // Breton
  br: 'br',
  bre: 'br',

  // Bulgarian
  bg: 'bg',
  bul: 'bg',

  // Burmese
  my: 'my',
  mya: 'my',
  bur: 'my',

  // Catalan
  ca: 'ca',
  cat: 'ca',

  // Chamorro
  ch: 'ch',
  cha: 'ch',

  // Chechen
  ce: 'ce',
  che: 'ce',

  // Chichewa
  ny: 'ny',
  nya: 'ny',

  // Chinese
  zh: 'zh',
  zho: 'zh',
  chi: 'zh',

  // Church Slavic
  cu: 'cu',
  chu: 'cu',

  // Chuvash
  cv: 'cv',
  chv: 'cv',

  // Cornish
  kw: 'kw',
  cor: 'kw',

  // Corsican
  co: 'co',
  cos: 'co',

  // Cree
  cr: 'cr',
  cre: 'cr',

  // Czech
  cs: 'cs',
  ces: 'cs',
  cze: 'cs',

  // Danish
  da: 'da',
  dan: 'da',

  // Divehi
  dv: 'dv',
  div: 'dv',

  // Dutch
  nl: 'nl',
  nld: 'nl',
  dut: 'nl',

  // Dzongkha
  dz: 'dz',
  dzo: 'dz',

  // English
  en: 'en',
  eng: 'en',
  english: 'en',

  // Esperanto
  eo: 'eo',
  epo: 'eo',

  // Estonian
  et: 'et',
  est: 'et',

  // Ewe
  ee: 'ee',
  ewe: 'ee',

  // Faroese
  fo: 'fo',
  fao: 'fo',

  // Fijian
  fj: 'fj',
  fij: 'fj',

  // Finnish
  fi: 'fi',
  fin: 'fi',

  // French
  fr: 'fr',
  fra: 'fr',
  fre: 'fr',

  // Western Frisian
  fy: 'fy',
  fry: 'fy',

  // Fulah
  ff: 'ff',
  ful: 'ff',

  // Gaelic / Scots Gaelic
  gd: 'gd',
  gla: 'gd',

  // Galician
  gl: 'gl',
  glg: 'gl',

  // Georgian
  ka: 'ka',
  kat: 'ka',
  geo: 'ka',

  // German
  de: 'de',
  deu: 'de',
  ger: 'de',

  // Greek
  el: 'el',
  ell: 'el',
  gre: 'el',

  // Guarani
  gn: 'gn',
  grn: 'gn',

  // Gujarati
  gu: 'gu',
  guj: 'gu',

  // Haitian Creole
  ht: 'ht',
  hat: 'ht',

  // Hausa
  ha: 'ha',
  hau: 'ha',

  // Hebrew
  he: 'he',
  heb: 'he',

  // Herero
  hz: 'hz',
  her: 'hz',

  // Hindi
  hi: 'hi',
  hin: 'hi',

  // Hiri Motu
  ho: 'ho',
  hmo: 'ho',

  // Hungarian
  hu: 'hu',
  hun: 'hu',

  // Icelandic
  is: 'is',
  isl: 'is',
  ice: 'is',

  // Ido
  io: 'io',
  ido: 'io',

  // Igbo
  ig: 'ig',
  ibo: 'ig',

  // Indonesian
  id: 'id',
  ind: 'id',

  // Interlingua
  ia: 'ia',
  ina: 'ia',

  // Interlingue
  ie: 'ie',
  ile: 'ie',

  // Inuktitut
  iu: 'iu',
  iku: 'iu',

  // Inupiaq
  ik: 'ik',
  ipk: 'ik',

  // Irish
  ga: 'ga',
  gle: 'ga',

  // Italian
  it: 'it',
  ita: 'it',

  // Japanese
  ja: 'ja',
  jpn: 'ja',

  // Javanese
  jv: 'jv',
  jav: 'jv',

  // Kannada
  kn: 'kn',
  kan: 'kn',

  // Kanuri
  kr: 'kr',
  kau: 'kr',

  // Kashmiri
  ks: 'ks',
  kas: 'ks',

  // Kazakh
  kk: 'kk',
  kaz: 'kk',

  // Khmer
  km: 'km',
  khm: 'km',

  // Kikuyu
  ki: 'ki',
  kik: 'ki',

  // Kinyarwanda
  rw: 'rw',
  kin: 'rw',

  // Kyrgyz
  ky: 'ky',
  kir: 'ky',

  // Komi
  kv: 'kv',
  kom: 'kv',

  // Kongo
  kg: 'kg',
  kon: 'kg',

  // Korean
  ko: 'ko',
  kor: 'ko',

  // Kurdish
  ku: 'ku',
  kur: 'ku',

  // Kwanyama
  kj: 'kj',
  kua: 'kj',

  // Latin
  la: 'la',
  lat: 'la',

  // Luxembourgish
  lb: 'lb',
  ltz: 'lb',

  // Ganda
  lg: 'lg',
  lug: 'lg',

  // Limburgish
  li: 'li',
  lim: 'li',

  // Lingala
  ln: 'ln',
  lin: 'ln',

  // Lao
  lo: 'lo',
  lao: 'lo',

  // Lithuanian
  lt: 'lt',
  lit: 'lt',

  // Luba-Katanga
  lu: 'lu',
  lub: 'lu',

  // Latvian
  lv: 'lv',
  lav: 'lv',

  // Manx
  gv: 'gv',
  glv: 'gv',

  // Macedonian
  mk: 'mk',
  mkd: 'mk',
  mac: 'mk',

  // Malagasy
  mg: 'mg',
  mlg: 'mg',

  // Malay
  ms: 'ms',
  msa: 'ms',
  may: 'ms',

  // Malayalam
  ml: 'ml',
  mal: 'ml',

  // Maltese
  mt: 'mt',
  mlt: 'mt',

  // Maori
  mi: 'mi',
  mri: 'mi',
  mao: 'mi',

  // Marathi
  mr: 'mr',
  mar: 'mr',

  // Marshallese
  mh: 'mh',
  mah: 'mh',

  // Mongolian
  mn: 'mn',
  mon: 'mn',

  // Nauru
  na: 'na',
  nau: 'na',

  // Navajo
  nv: 'nv',
  nav: 'nv',

  // North Ndebele
  nd: 'nd',
  nde: 'nd',

  // Nepali
  ne: 'ne',
  nep: 'ne',

  // Ndonga
  ng: 'ng',
  ndo: 'ng',

  // Norwegian Bokmål
  nb: 'nb',
  nob: 'nb',

  // Norwegian Nynorsk
  nn: 'nn',
  nno: 'nn',

  // Norwegian
  no: 'no',
  nor: 'no',

  // Sichuan Yi
  ii: 'ii',
  iii: 'ii',

  // Occitan
  oc: 'oc',
  oci: 'oc',

  // Ojibwa
  oj: 'oj',
  oji: 'oj',

  // Oriya
  or: 'or',
  ori: 'or',

  // Oromo
  om: 'om',
  orm: 'om',

  // Ossetian
  os: 'os',
  oss: 'os',

  // Punjabi
  pa: 'pa',
  pan: 'pa',

  // Pali
  pi: 'pi',
  pli: 'pi',

  // Persian
  fa: 'fa',
  fas: 'fa',
  per: 'fa',

  // Polish
  pl: 'pl',
  pol: 'pl',

  // Portuguese
  pt: 'pt',
  por: 'pt',

  // Quechua
  qu: 'qu',
  que: 'qu',

  // Romansh
  rm: 'rm',
  roh: 'rm',

  // Romanian
  ro: 'ro',
  ron: 'ro',
  rum: 'ro',

  // Rundi
  rn: 'rn',
  run: 'rn',

  // Russian
  ru: 'ru',
  rus: 'ru',

  // Samoan
  sm: 'sm',
  smo: 'sm',

  // Sango
  sg: 'sg',
  sag: 'sg',

  // Sanskrit
  sa: 'sa',
  san: 'sa',

  // Sardinian
  sc: 'sc',
  srd: 'sc',

  // Serbian
  sr: 'sr',
  srp: 'sr',

  // Shona
  sn: 'sn',
  sna: 'sn',

  // Sindhi
  sd: 'sd',
  snd: 'sd',

  // Sinhala
  si: 'si',
  sin: 'si',

  // Slovak
  sk: 'sk',
  slk: 'sk',
  slo: 'sk',

  // Slovene
  sl: 'sl',
  slv: 'sl',

  // Somali
  so: 'so',
  som: 'so',

  // Southern Sotho
  st: 'st',
  sot: 'st',

  // Spanish
  es: 'es',
  spa: 'es',

  // Sundanese
  su: 'su',
  sun: 'su',

  // Swahili
  sw: 'sw',
  swa: 'sw',

  // Swati
  ss: 'ss',
  ssw: 'ss',

  // Swedish
  sv: 'sv',
  swe: 'sv',

  // Tagalog
  tl: 'tl',
  tgl: 'tl',

  // Tahitian
  ty: 'ty',
  tah: 'ty',

  // Tajik
  tg: 'tg',
  tgk: 'tg',

  // Tamil
  ta: 'ta',
  tam: 'ta',

  // Tatar
  tt: 'tt',
  tat: 'tt',

  // Telugu
  te: 'te',
  tel: 'te',

  // Thai
  th: 'th',
  tha: 'th',

  // Tibetan
  bo: 'bo',
  bod: 'bo',
  tib: 'bo',

  // Tigrinya
  ti: 'ti',
  tir: 'ti',

  // Tonga
  to: 'to',
  ton: 'to',

  // Tsonga
  ts: 'ts',
  tso: 'ts',

  // Tswana
  tn: 'tn',
  tsn: 'tn',

  // Turkish
  tr: 'tr',
  tur: 'tr',

  // Turkmen
  tk: 'tk',
  tuk: 'tk',

  // Twi
  tw: 'tw',
  twi: 'tw',

  // Uyghur
  ug: 'ug',
  uig: 'ug',

  // Ukrainian
  uk: 'uk',
  ukr: 'uk',

  // Urdu
  ur: 'ur',
  urd: 'ur',

  // Uzbek
  uz: 'uz',
  uzb: 'uz',

  // Venda
  ve: 've',
  ven: 've',

  // Vietnamese
  vi: 'vi',
  vie: 'vi',

  // Volapük
  vo: 'vo',
  vol: 'vo',

  // Walloon
  wa: 'wa',
  wln: 'wa',

  // Welsh
  cy: 'cy',
  cym: 'cy',
  wel: 'cy',

  // Wolof
  wo: 'wo',
  wol: 'wo',

  // Xhosa
  xh: 'xh',
  xho: 'xh',

  // Yiddish
  yi: 'yi',
  yid: 'yi',

  // Yoruba
  yo: 'yo',
  yor: 'yo',

  // Zhuang
  za: 'za',
  zha: 'za',

  // Zulu
  zu: 'zu',
  zul: 'zu',

  // Portuguese variants
  'pt-br': 'pt',
  'pt-pt': 'pt',

  // English chaos
  'en-us': 'en',
  'en-gb': 'en',
  'en-ca': 'en',
  'en-au': 'en',
  'en-nz': 'en',
  'en-ie': 'en',
  'en-in': 'en',

  // Spanish absolute madness (LATAM etc.)
  'es-es': 'es',
  'es-mx': 'es',
  'es-ar': 'es',
  'es-cl': 'es',
  'es-co': 'es',
  'es-419': 'es', // Latin America generic

  // French
  'fr-fr': 'fr',
  'fr-ca': 'fr',
  'fr-be': 'fr',
  'fr-ch': 'fr',

  // Chinese hellzone
  'zh-cn': 'zh', // Simplified
  'zh-sg': 'zh',
  'zh-hans': 'zh', // simplified script tag
  'zh-tw': 'zh', // Traditional
  'zh-hk': 'zh',
  'zh-hant': 'zh', // traditional script tag

  // German
  'de-de': 'de',
  'de-at': 'de',
  'de-ch': 'de',

  // Arabic variants
  'ar-sa': 'ar',
  'ar-eg': 'ar',
  'ar-tn': 'ar',
  'ar-ma': 'ar',
  'ar-ae': 'ar',

  // Italian
  'it-it': 'it',
  'it-ch': 'it',

  // Russian, Ukrainian, etc.
  'ru-ru': 'ru',
  'uk-ua': 'uk',

  // Japanese, Korean always same
  'ja-jp': 'ja',
  'ko-kr': 'ko',

  // Hindi
  'hi-in': 'hi',

  // Dutch
  'nl-nl': 'nl',
  'nl-be': 'nl'
};

const normalize_iso_639_1 = (lang?: string): string | null => {
  if (!lang) return null;
  const l = lang.toLowerCase().trim();
  return ISO_639_1_MAP[l] ?? null;
};

export { normalize_iso_639_1 };
