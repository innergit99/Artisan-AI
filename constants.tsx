
import { ToolType, ToolConfig, PODStyle, KDPGenrePreset } from './types';

export const KDP_GENRES: KDPGenrePreset[] = [
  {
    id: 'romance', label: 'Romance Novel', category: 'FICTION', defaultTrim: '6" x 9"', defaultInterior: 'B&W',
    promptBase: 'Professional romance novel cover art, elegant characters, emotional lighting, bestseller style',
    minWords: 50000, maxWords: 90000, minChapters: 18, maxChapters: 30
  },
  {
    id: 'mystery', label: 'Mystery Thriller', category: 'FICTION', defaultTrim: '6" x 9"', defaultInterior: 'B&W',
    promptBase: 'Noir mystery book cover, dramatic shadows, silhouetted figure, cinematic',
    minWords: 60000, maxWords: 100000, minChapters: 25, maxChapters: 40
  },
  {
    id: 'fantasy', label: 'Fantasy Epic', category: 'FICTION', defaultTrim: '6" x 9"', defaultInterior: 'B&W',
    promptBase: 'Epic high-fantasy landscape, dragon soaring, magical artifacts, golden ratio',
    minWords: 80000, maxWords: 150000, minChapters: 30, maxChapters: 60
  },
  {
    id: 'sci-fi', label: 'Sci-Fi Space Opera', category: 'FICTION', defaultTrim: '6" x 9"', defaultInterior: 'B&W',
    promptBase: 'Space opera book cover, distant starships, vibrant nebula, high-tech aesthetic',
    minWords: 70000, maxWords: 120000, minChapters: 25, maxChapters: 45
  },
  {
    id: 'horror', label: 'Horror', category: 'FICTION', defaultTrim: '6" x 9"', defaultInterior: 'B&W',
    promptBase: 'Creepy horror book cover, psychological dread, dark atmosphere, minimal light, terrifying silhouette',
    minWords: 60000, maxWords: 90000, minChapters: 12, maxChapters: 25
  },
  {
    id: 'cozy-mystery', label: 'Cozy Mystery', category: 'FICTION', defaultTrim: '5" x 8" (Pocket)', defaultInterior: 'B&W',
    promptBase: 'Charming cozy mystery cover, small town setting, warm colors, cute cat or bakery element, non-threatening',
    minWords: 40000, maxWords: 65000, minChapters: 15, maxChapters: 25
  },
  {
    id: 'urban-fantasy', label: 'Urban Fantasy', category: 'FICTION', defaultTrim: '6" x 9"', defaultInterior: 'B&W',
    promptBase: 'Urban fantasy cover, city skyline at night, magical neon runes, leather jacket protagonist, glowing effects',
    minWords: 70000, maxWords: 100000, minChapters: 25, maxChapters: 40
  },
  {
    id: 'dark-romance', label: 'Dark Romance', category: 'FICTION', defaultTrim: '6" x 9"', defaultInterior: 'B&W',
    promptBase: 'Dark romance cover, gothic aesthetic, moody rose, broken glass, intense emotional shadow',
    minWords: 60000, maxWords: 100000, minChapters: 20, maxChapters: 35
  },
  {
    id: 'ya', label: 'Young Adult (YA)', category: 'FICTION', defaultTrim: '5.5" x 8.5" (Trade)', defaultInterior: 'B&W',
    promptBase: 'YA novel cover, symbolic object, bold typography, vibrant abstract background, relatable emotion',
    minWords: 50000, maxWords: 80000, minChapters: 20, maxChapters: 35
  },
  {
    id: 'historical', label: 'Historical Fiction', category: 'FICTION', defaultTrim: '6" x 9"', defaultInterior: 'B&W',
    promptBase: 'Historical fiction cover, period costume details, sweeping landscape, oil painting style, sepia tones',
    minWords: 80000, maxWords: 120000, minChapters: 20, maxChapters: 40
  },
  {
    id: 'psych-thriller', label: 'Psychological Thriller', category: 'FICTION', defaultTrim: '6" x 9"', defaultInterior: 'B&W',
    promptBase: 'Psychological thriller cover, shattered mirror or distorted face, cold blue tones, mental labyrinth',
    minWords: 65000, maxWords: 95000, minChapters: 25, maxChapters: 45
  },
  {
    id: 'manga', label: 'Manga (Shonen)', category: 'VISUAL_KIDS', defaultTrim: '5" x 7.5"', defaultInterior: 'B&W',
    promptBase: 'Dynamic shonen manga line art, sharp ink lines, dramatic perspective, screen tones',
    isFixedLayout: true, minChapters: 5, maxChapters: 10
  },
  {
    id: 'comic', label: 'Comic Book', category: 'VISUAL_KIDS', defaultTrim: '7" x 10"', defaultInterior: 'Color',
    promptBase: 'Golden age comic book style, bold outlines, vibrant halftone dots, action dynamic',
    isFixedLayout: true, minChapters: 1, maxChapters: 5
  },
  {
    id: 'picture-book', label: 'Children\'s Picture Book', category: 'VISUAL_KIDS', defaultTrim: '8.5" x 8.5"', defaultInterior: 'Color',
    promptBase: 'Whimsical watercolor illustration, friendly animals, soft textures',
    isFixedLayout: true, minWords: 300, maxWords: 1000, requiresAgeRange: true
  },
  {
    id: 'biography', label: 'Biography', category: 'NON_FICTION', defaultTrim: '6" x 9"', defaultInterior: 'B&W',
    promptBase: 'Modern minimalist biography cover, professional portrait silhouette, clean lines',
    minWords: 60000, maxWords: 120000, minChapters: 20, maxChapters: 40
  },
  {
    id: 'business', label: 'Business & Money', category: 'NON_FICTION', defaultTrim: '6" x 9"', defaultInterior: 'B&W',
    promptBase: 'High-end finance book cover, abstract geometric corporate patterns, expensive feel',
    minWords: 30000, maxWords: 70000, minChapters: 8, maxChapters: 20
  },
  {
    id: 'self-help', label: 'Self-Help', category: 'NON_FICTION', defaultTrim: '5.5" x 8.5"', defaultInterior: 'B&W',
    promptBase: 'Peaceful zen cover art, morning sunrise, calming minimalist colors',
    minWords: 25000, maxWords: 60000, minChapters: 7, maxChapters: 15
  },
  {
    id: 'coloring-adult', label: 'Coloring Book (Adult)', category: 'ACTIVITY_JOURNALS', defaultTrim: '8.5" x 11"', defaultInterior: 'B&W',
    promptBase: 'Highly intricate stress-relief mandala patterns, pure thin black lines, white background, no shading',
    isFixedLayout: true, minChapters: 30, maxChapters: 100 // Mapping pages to chapters
  },
  {
    id: 'coloring-kids', label: 'Kids Coloring Book', category: 'ACTIVITY_JOURNALS', defaultTrim: '8.5" x 11"', defaultInterior: 'B&W',
    promptBase: 'Simple bold outline coloring page for children, thick lines, playful characters, zero shading',
    isFixedLayout: true, minChapters: 20, maxChapters: 50
  },
  {
    id: 'coloring-kdp', label: 'KDP Coloring Page', category: 'ACTIVITY_JOURNALS', defaultTrim: '8.5" x 11"', defaultInterior: 'B&W',
    promptBase: 'Commercial grade KDP coloring book page, professional crisp black ink lines, white background, high-end thematic illustration, zero grey shading, zero gradients, vector clean',
    isFixedLayout: true
  },
  {
    id: 'journal', label: 'Daily Journal', category: 'ACTIVITY_JOURNALS', defaultTrim: '6" x 9"', defaultInterior: 'B&W',
    promptBase: 'Minimalist floral pattern for journal cover, textile texture, high quality',
    isFixedLayout: true
  },
  {
    id: 'planner', label: 'Planner', category: 'ACTIVITY_JOURNALS', defaultTrim: '8.5" x 11"', defaultInterior: 'B&W',
    promptBase: 'Modern organizational planner cover design, geometric elements, productivity aesthetic',
    isFixedLayout: true
  },
];

export const KDP_TRIM_SIZES = [
  '5" x 7.5" (Manga)',
  '5" x 8"',
  '5.25" x 8"',
  '5.5" x 8.5"',
  '6" x 9" (Standard)',
  '6.14" x 9.21"',
  '7" x 10"',
  '8" x 10"',
  '8.25" x 6" (Landscape)',
  '8.25" x 8.25" (Square)',
  '8.5" x 8.5" (Square)',
  '8" x 8" (Square)',
  '8.5" x 11" (Letter)'
];

export const KDP_TONES = ['Neutral', 'Emotional', 'Romantic', 'Suspenseful', 'Mysterious', 'Adventurous', 'Humorous / Lighthearted', 'Dark / Gritty', 'Inspirational / Uplifting', 'Dramatic', 'Whimsical', 'Professional', 'Educational'];

export const POD_STYLES: PODStyle[] = [
  { id: '3d-text', label: '3D Text', category: 'Typography', gradient: 'from-blue-600 to-cyan-500', promptSuffix: 'massive 3D rendered text, huge depth, glossy finish, isolated on a solid uniform PURE background, high contrast, macro scale' },
  { id: 'retro-70s', label: 'Retro 70s', category: 'Retro', gradient: 'from-amber-500 to-orange-600', promptSuffix: '1970s vintage groovy typography, bold center-aligned text, touching edges, isolated on a solid uniform PURE background' },
  { id: 'neon-sign', label: 'Neon Sign', category: 'Modern', gradient: 'from-pink-500 to-purple-600', promptSuffix: 'glowing electric neon sign style, vibrant tubes, isolated on a solid uniform PURE background' },
  { id: 'y2k-chrome', label: 'Y2K Chrome', category: 'Modern', gradient: 'from-slate-300 to-slate-500', promptSuffix: 'liquid chrome metallic futuristic text, massive size, isolated on a solid uniform PURE background' },
  { id: 'graffiti', label: 'Graffiti Tag', category: 'Urban', gradient: 'from-red-500 to-rose-600', promptSuffix: 'street art graffiti tag, drip paint effects, bold aggressive lettering, high contrast, isolated on black background' },
  { id: 'heavy-metal', label: 'Heavy Metal', category: 'Gothic', gradient: 'from-slate-700 to-slate-900', promptSuffix: 'sharp aggressive metallic font, symmetrical death metal logo style, high contrast, isolated on solid background' },
  { id: 'sharp-vector', label: 'Flat Vector', category: 'Modern', gradient: 'from-emerald-500 to-teal-600', promptSuffix: 'clean minimalist flat vector illustration, thick outlines, isolated on a solid uniform PURE background' },
  { id: 'anime-manga', label: 'Anime 90s', category: 'Artistic', gradient: 'from-pink-400 to-rose-500', promptSuffix: 'classic 90s anime cel-shaded style, sharp linework, isolated on a solid uniform PURE background' },
  { id: 'watercolor', label: 'Watercolor', category: 'Artistic', gradient: 'from-sky-400 to-blue-500', promptSuffix: 'bleeding watercolor paint textures, artistic splashes, soft edge paper, isolated on white background' },
  { id: 'line-art', label: 'Line Art', category: 'Minimalist', gradient: 'from-slate-400 to-slate-600', promptSuffix: 'continuous single line drawing, black on white, elegant simplicity, isolated on white background' },
  { id: 'cyberpunk', label: 'Cyberpunk', category: 'Modern', gradient: 'from-fuchsia-600 to-purple-700', promptSuffix: 'cyberpunk aesthetic, high-tech neon details, futuristic chrome elements, vibrant pink and teal, isolated on black' },
  { id: 'synthwave', label: 'Synthwave', category: 'Retro', gradient: 'from-purple-600 to-pink-600', promptSuffix: '1980s synthwave retro-futurism, grid patterns, chrome sun, saturated purples, isolated on dark background' },
  { id: 'bauhaus', label: 'Bauhaus', category: 'Minimalist', gradient: 'from-red-500 to-amber-500', promptSuffix: 'Bauhaus industrial design, geometric abstraction, primary colors, clean stark lines, isolated on off-white' },
  { id: 'oil-painting', label: 'Oil Painting', category: 'Artistic', gradient: 'from-amber-700 to-yellow-600', promptSuffix: 'thick impasto oil painting, visible brushstrokes, rich textures, professional art gallery quality, isolated' },
  { id: 'pop-art', label: 'Pop Art', category: 'Artistic', gradient: 'from-cyan-500 to-pink-500', promptSuffix: 'Warhol style pop art, high contrast, vibrant CMYK color palette, halftone patterns, bold outlines, isolated' },
  { id: 'sketch', label: 'Charcoal Sketch', category: 'Artistic', gradient: 'from-gray-600 to-gray-800', promptSuffix: 'hand-drawn charcoal sketch, rough textures, artistic smudge details, high contrast black and white, isolated' },
  { id: 'gothic', label: 'Gothic Horror', category: 'Gothic', gradient: 'from-violet-900 to-purple-950', promptSuffix: 'dark gothic Victorian aesthetic, intricate ironwork details, moody atmospheric shadows, isolated' },
  { id: 'cartoon-modern', label: 'Cartoon Modern', category: 'Modern', gradient: 'from-yellow-400 to-orange-500', promptSuffix: 'Modern vector cartoon style, thick clean lines, flat colors, high-end commercial mascot aesthetic, isolated on white' },
  { id: 'shonen-manga', label: 'Shonen Manga', category: 'Artistic', gradient: 'from-gray-800 to-slate-900', promptSuffix: 'Dynamic shonen manga ink illustration, speed lines, high-impact black and white contrast, professional comic ink, isolated' },
  { id: 'die-cut-sticker', label: 'Die-Cut Sticker', category: 'Product', gradient: 'from-indigo-500 to-purple-600', promptSuffix: 'Professional die-cut sticker design, 5mm white border, subtle drop shadow, glossy vinyl finish, isolated on neutral' },
  { id: 'kawaii', label: 'Kawaii Aesthetic', category: 'Artistic', gradient: 'from-pink-300 to-rose-400', promptSuffix: 'Super cute Japanese Kawaii aesthetic, pastel colors, simple cheerful faces, rounded shapes, isolated on white' },
  { id: 'vaporwave-glitch', label: 'Vaporwave Glitch', category: 'Retro', gradient: 'from-pink-600 to-cyan-500', promptSuffix: '1990s vaporwave glitch art, lo-fi aesthetic, neon pink and blue palette, digital distortion, isolated' }
];

export const TOOLS: ToolConfig[] = [
  // CORE (Core Publishing Factory)
  {
    id: ToolType.COLORING_PAGES,
    name: 'KDP Book Lab',
    description: 'Generate fully structured, KDP-compliant books for print and ebook from a single workflow.',
    icon: 'book-open',
    gradient: 'from-green-500 to-emerald-600',
    image: '/assets/dashboard/kdp_lab_monumental.png',
    category: 'CORE'
  },
  {
    id: ToolType.POD_MERCH,
    name: 'POD Designer',
    description: 'Design covers, interiors, and full-wrap assets for 30+ print-ready product types.',
    icon: 'shirt',
    gradient: 'from-pink-500 to-rose-600',
    image: '/assets/dashboard/pod_designer.png',
    category: 'CORE'
  },
  {
    id: ToolType.NICHE_RADAR,
    name: 'Niche Radar',
    description: 'Scan real-time market velocity to find viral entry points and high-profit gaps.',
    icon: 'target',
    gradient: 'from-red-500 to-orange-600',
    image: '/assets/dashboard/niche_radar_monumental.png',
    category: 'CORE'
  },
  {
    id: ToolType.TREND_INTELLIGENCE,
    name: 'Trend Intelligence',
    description: 'Discover profitable niches, demand signals, and saturation risk before you publish.',
    icon: 'trending-up',
    gradient: 'from-amber-400 to-orange-600',
    image: '/assets/dashboard/trend_monumental.png',
    category: 'CORE'
  },
  {
    id: ToolType.AMAZON_SEO,
    name: 'Amazon SEO Engine',
    description: 'Architect high-conversion listing metadata and optimized HTML sales copy.',
    icon: 'rocket',
    gradient: 'from-blue-600 to-indigo-700',
    image: '/assets/dashboard/amazon_seo.png',
    category: 'CORE'
  },

  // CREATIVE (Content & Aesthetic DNA)
  {
    id: ToolType.BRAND_INTELLIGENCE,
    name: 'Brand Analyzer',
    description: 'Reverse-engineer top-performing shops to extract successful design DNA.',
    icon: 'search',
    gradient: 'from-cyan-500 to-blue-600',
    image: '/assets/dashboard/brand_dna_stunning.png',
    category: 'CREATIVE'
  },
  {
    id: ToolType.LOGO_CREATOR,
    name: 'Logo Creator',
    description: 'Build a full brand identity system with vector-ready logos and style guides.',
    icon: 'box',
    gradient: 'from-blue-500 to-cyan-600',
    image: '/assets/dashboard/logo_creator.png',
    category: 'CREATIVE'
  },
  {
    id: ToolType.TEXT_TO_IMAGE,
    name: 'Text to Image',
    description: 'Render industrial-grade commercial visuals and assets for POD manufacturing.',
    icon: 'palette',
    gradient: 'from-purple-500 to-indigo-600',
    image: '/assets/dashboard/text_to_image.png',
    category: 'CREATIVE'
  },
  {
    id: ToolType.MANUSCRIPT_DOCTOR,
    name: 'Manuscript Doctor',
    description: 'Upload your manuscript to fix flow, repetition, formatting, and KDP compliance issues.',
    icon: 'file-edit',
    gradient: 'from-purple-500 to-pink-600',
    image: '/assets/dashboard/manuscript_doctor.png',
    category: 'CREATIVE'
  },

  // UTILITY (Industrial Utilities)
  {
    id: ToolType.BAN_SHIELD,
    name: 'KDP Ban Shield',
    description: 'Pre-publication policy audit to protect your account from rejections and bans.',
    icon: 'shield-check',
    gradient: 'from-slate-700 to-slate-900',
    image: '/assets/dashboard/kdp_ban_shield.png',
    category: 'UTILITY'
  },
  {
    id: ToolType.PROFIT_ESTIMATOR,
    name: 'Profit Estimator',
    description: 'Model your royalties, ROI, and suggested market pricing before you launch.',
    icon: 'bar-chart-3',
    gradient: 'from-emerald-400 to-teal-600',
    image: '/assets/dashboard/profit_estimator.png',
    category: 'UTILITY'
  },
  {
    id: ToolType.HD_UPSCALER,
    name: 'HD Upscaler',
    description: 'Restore assets to industrial 300DPI resolution for large-scale physical print.',
    icon: 'maximize',
    gradient: 'from-blue-400 to-indigo-600',
    image: '/assets/dashboard/hd_upscaler.png',
    category: 'UTILITY'
  },
  {
    id: ToolType.OBJECT_ISOLATOR,
    name: 'Object Isolator',
    description: 'Isolate subjects with precision anti-aliased edges for clean POD compositions.',
    icon: 'scissors',
    gradient: 'from-violet-500 to-purple-700',
    image: '/assets/dashboard/object_isolator_precision.png',
    category: 'UTILITY'
  }
];
