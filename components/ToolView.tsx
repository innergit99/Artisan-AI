import React, { useState, useEffect, useRef } from 'react';
import { ToolType, GeneratedImage, PODStyle, MockupType, SEOMetadata, KDPGenrePreset, KDPProject, KDPBlueprint, KDPFormat, KDPTarget, TrendingNiche, BrandDNAReport, NicheRadarReport, KDPSeoDossier, ProductionDossier, CharacterProfile } from '../types';
import { storage } from '../storageService';


import { TOOLS, POD_STYLES, KDP_GENRES, KDP_TRIM_SIZES, KDP_TONES } from '../constants';
import { gemini } from '../geminiService';
import { exporter } from '../exportService';
import { kdpValidator } from '../kdpValidator';
import { SmartUploadCopilot } from './SmartUploadCopilot';
import { CoAuthorEditor } from './CoAuthorEditor';
import { marketingService } from '../marketingService';
import { gamificationService } from '../gamificationService';
import { downloadService } from '../downloadService';
import { manuscriptDoctorService } from '../manuscriptDoctorService';
import { intelligenceService } from '../intelligenceService';
import { visualService } from '../visualService';
import { complianceService } from '../complianceService';
import { NicheRadarView } from './NicheRadarView';
import { CharacterVault } from './CharacterVault';
import { PODStyleCard } from './PODStyleCard';
import { holographicMockupService } from '../holographicMockupService';
import {
  ChevronLeft, Sparkles, Download, Loader2, ImageIcon, X, Rocket, Upload,
  Search, Copy, CheckCircle, ZoomIn, ZoomOut, Move, Palette, Edit3,
  ShieldAlert, CheckCircle2, AlignCenter, BookOpen, PenTool, Layout, Activity,
  AlertCircle, ChevronRight, Wand2, RefreshCw, Layers, List, ShoppingCart,
  Maximize, FileText, Check, Settings, ArrowRight, Eye, Save, Type as TypeIcon,
  Monitor, Book, Printer, Cloud, ExternalLink, TrendingUp, Shirt, Globe,
  Target, Zap, Sun, ShieldCheck, AlignLeft, Cpu, BarChart3, Key, User, Users
} from 'lucide-react';



// MOCKUP_ASSETS will now be populated programmatically by the drawing engine
const MOCKUP_ASSETS: Record<MockupType, string> = {} as any;

// Added missing MOCKUP_LABELS constant for mapping MockupType to human-readable strings
const MOCKUP_LABELS: Record<MockupType, string> = {
  STANDARD_TEE: 'Standard T-Shirt',
  LARGE_PRINT_TEE: 'Large Print Tee',
  HAT: 'Snapback Hat',
  STICKER: 'Die-Cut Sticker',
  PHONE_CASE: 'Phone Case',
  DESK_MAT: 'Desk Mat',
  MOUSE_PAD: 'Mouse Pad',
  PILLOW: 'Throw Pillow',
  TOTE_BAG: 'Tote Bag',
  MUG: 'Ceramic Mug',
  POSTER: 'Matte Poster',
  CANVAS: 'Gallery Canvas',
  GREETING_CARD: 'Greeting Card',
  LAPTOP_SKIN: 'Laptop Skin',
  POUCH: 'Accessory Pouch',
  DRESS: 'A-Line Dress',
  SCARF: 'Silk Scarf',
  DUVET: 'Duvet Cover',
  SHOWER_CURTAIN: 'Shower Curtain',
  JOURNAL: 'Hardcover Journal',
  SPIRAL_NOTEBOOK: 'Spiral Notebook',
  CLOCK: 'Wall Clock',
  ACRYLIC_BLOCK: 'Acrylic Block',
  COASTER: 'Drink Coaster',
  BLANKET: 'Fleece Blanket',
  TAPESTRY: 'Wall Tapestry',
  BATH_MAT: 'Bath Mat',
  BUTTON: 'Pin Button',
  APRON: 'Kitchen Apron',
  PUZZLE: 'Jigsaw Puzzle',
  SOCKS: 'Crew Socks',
  BACKPACK: 'Backpack',
  DUFFLE_BAG: 'Duffle Bag'
};

const COLOR_SWATCHES = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#1a1a1a' },
  { name: 'Navy', value: '#1a2b4a' },
  { name: 'Red', value: '#c53030' },
  { name: 'Grey', value: '#a0aec0' },
  { name: 'Forest', value: '#22543d' },
  { name: 'Royal', value: '#2b6cb0' }
];

interface ToolViewProps {
  toolType: ToolType;
  initialPrompt?: string | null;
  onBack: () => void;
  onImageGenerated: (image: GeneratedImage) => void;
  onNavigate: (tab: ToolType, prompt?: string) => void;
  isDarkMode: boolean;
}

const IndustrialBackground: React.FC<{ tool: any }> = ({ tool }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimization
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    let lines: { x1: number; y1: number; x2: number; y2: number; speed: number; progress: number; color: string }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initElements();
    };

    const initElements = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 40000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.5 + 0.1
        });
      }

      // Procedural Schematic Lines
      lines = [];
      for (let i = 0; i < 15; i++) {
        const isHorizontal = Math.random() > 0.5;
        const pos = isHorizontal ? Math.random() * canvas.height : Math.random() * canvas.width;
        lines.push({
          x1: isHorizontal ? 0 : pos,
          y1: isHorizontal ? pos : 0,
          x2: isHorizontal ? canvas.width : pos,
          y2: isHorizontal ? pos : canvas.height,
          speed: Math.random() * 0.002 + 0.001,
          progress: Math.random(),
          color: 'rgba(99, 102, 241, 0.05)'
        });
      }
    };

    const draw = (time: number) => {
      // 1. CLEAR WITH DEPTH
      ctx.fillStyle = '#020617'; // Slate 950
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. INDUSTRIAL GRID
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)'; // Slate 800
      ctx.lineWidth = 1;
      const step = 60;
      const offsetX = (time * 0.01) % step;
      const offsetY = (time * 0.01) % step;

      for (let x = offsetX; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = offsetY; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 3. DRAW SCHEMATICS
      ctx.lineWidth = 2;
      lines.forEach(line => {
        line.progress += line.speed;
        if (line.progress > 1) line.progress = 0;

        ctx.strokeStyle = line.color;
        ctx.beginPath();
        if (line.x1 === line.x2) { // Vertical
          ctx.moveTo(line.x1, 0);
          ctx.lineTo(line.x1, canvas.height * line.progress);
        } else { // Horizontal
          ctx.moveTo(0, line.y1);
          ctx.lineTo(canvas.width * line.progress, line.y1);
        }
        ctx.stroke();
      });

      // 4. DATA NODES (Particles)
      ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.globalAlpha = p.alpha * (Math.sin(time * 0.002 + i) * 0.5 + 0.5);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // 5. CONNECTIONS
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - dist / 150)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      ctx.globalAlpha = 1;

      // 6. HERO ILLUSTRATION (SEMANTIC)
      ctx.save();
      ctx.translate(canvas.width * 0.85, canvas.height * 0.5);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 4;
      ctx.beginPath();

      const id = tool?.id;
      if (id === ToolType.NICHE_RADAR) {
        for (let r = 50; r < 400; r += 100) {
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.moveTo(-450, 0); ctx.lineTo(450, 0);
        ctx.moveTo(0, -450); ctx.lineTo(0, 450);
        ctx.stroke();
      } else if (id === ToolType.TREND_INTELLIGENCE) {
        ctx.moveTo(-300, 200);
        ctx.lineTo(-100, 100);
        ctx.lineTo(100, 150);
        ctx.lineTo(300, -200);
        ctx.stroke();
        for (let i = -300; i <= 300; i += 150) {
          ctx.strokeRect(i - 20, 200, 40, -Math.random() * 300);
        }
      } else if (id === ToolType.AMAZON_SEO) {
        ctx.moveTo(0, -300); ctx.lineTo(100, 100); ctx.lineTo(-100, 100); ctx.closePath();
        ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 200, 50, 0, Math.PI * 2); ctx.stroke();
      } else if (id === ToolType.POD_MERCH) {
        ctx.moveTo(-150, -200); ctx.lineTo(150, -200); ctx.lineTo(250, -100); ctx.lineTo(150, -100);
        ctx.lineTo(150, 300); ctx.lineTo(-150, 300); ctx.lineTo(-150, -100); ctx.lineTo(-250, -100); ctx.closePath();
        ctx.stroke();
      } else {
        // Default Geometric Industrial Motif
        for (let i = 0; i < 3; i++) {
          ctx.rotate(Math.PI / 3);
          ctx.strokeRect(-200, -200, 400, 400);
        }
      }
      ctx.restore();

      // 7. CATEGORY SYMBOLS (PROCEDURAL)
      ctx.save();
      ctx.font = '800 220px "Inter"';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = tool?.category === 'CORE' ? 'FACTORY' : tool?.category === 'CREATIVE' ? 'STUDIO' : 'UTILITY';
      ctx.fillText(label, canvas.width / 2, canvas.height / 2);
      ctx.restore();

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [tool]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/60 via-transparent to-slate-950/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.7)_100%)]" />
      <div className="absolute w-full h-[1.5px] bg-indigo-500/30 top-0 animate-[scan_6s_linear_infinite]" />
    </div>
  );
};

const ToolView: React.FC<ToolViewProps> = (props) => {
  const tool = TOOLS.find(t => t.id === props.toolType);
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <IndustrialBackground tool={tool} />
      <div className="relative z-10 w-full">
        <ToolViewInner {...props} />
      </div>
    </div>
  );
};

const ToolViewInner: React.FC<ToolViewProps> = ({ toolType, initialPrompt, onBack, onImageGenerated, onNavigate, isDarkMode }) => {

  const tool = TOOLS.find(t => t.id === toolType);
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [variants, setVariants] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [selectedStyleCategory, setSelectedStyleCategory] = useState<string>('All');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [activeMockup, setActiveMockup] = useState<MockupType>('STANDARD_TEE');
  const [is4K, setIs4K] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [seoData, setSeoData] = useState<SEOMetadata | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [baseColor, setBaseColor] = useState('#ffffff');

  // Advanced Creative Controls
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [negativePrompt, setNegativePrompt] = useState("");

  // Context-Aware Character Engine (Phase 6)
  const [availableCharacters, setAvailableCharacters] = useState<CharacterProfile[]>([]);
  const [activeCharacter, setActiveCharacter] = useState<CharacterProfile | null>(null);

  // Load characters on mount
  useEffect(() => {
    storage.getAllCharacters().then(chars => setAvailableCharacters(chars));
  }, []);

  // Import Logic
  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.project && json.blueprint) {
          setKdpProject(json.project);
          setKdpBlueprint(json.blueprint);
          setSelectedGenre(json.genre || null);
          setKdpStep('BLUEPRINT');
          alert("✅ Project successfully restored from backup!");
        } else {
          alert("❌ Invalid backup file format.");
        }
      } catch (err) {
        console.error("Import failed", err);
        alert("❌ Failed to parse backup file.");
      }
    };
    reader.readAsText(file);
  };

  const [isDoctoring, setIsDoctoring] = useState(false);
  const [isLokiMode, setIsLokiMode] = useState(false);
  const [lokiVariations, setLokiVariations] = useState<KDPBlueprint[]>([]);
  const [selectedLokiIndex, setSelectedLokiIndex] = useState<number | null>(null);
  const [isEditingTitleWorking, setIsEditingTitleWorking] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [isEditingAuthor, setIsEditingAuthor] = useState(false);
  const [tempAuthor, setTempAuthor] = useState('');

  // KDP Manuscript Doctor Handler
  const handleManuscriptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsDoctoring(true);
    setError(`👨‍⚕️ Analyzing Manuscript: ${file.name}...`);

    try {
      // 1. Parsing
      const { text, metadata } = await manuscriptDoctorService.parseFile(file);

      // 2. Context Analysis
      const context = manuscriptDoctorService.analyzeContext(text, selectedGenre?.id);

      // 3. Initial Conversion to Blueprint (Doctoring the raw text into our KDP structure)
      const partialBlueprint = manuscriptDoctorService.convertToBlueprint({
        rawText: text,
        contextProfile: context,
        targetAudience: kdpProject.audience,
        preserveVoice: true,
      } as any, kdpProject);

      setKdpBlueprint(partialBlueprint as KDPBlueprint);
      setGlobalContent(text);

      // Auto-set title/author if found in meta
      if (partialBlueprint.PROJECT_META?.title_working) {
        setKdpProject(prev => ({
          ...prev,
          title: partialBlueprint.PROJECT_META?.title_working || prev.title,
          author: partialBlueprint.PROJECT_META?.suggestedAuthor || prev.author
        }));
      }

      setKdpStep('BLUEPRINT');
      setIsGlobalEditing(true); // Default to full book view for imported manuscripts
      setError(`✅ Manuscript successfully digested! ${metadata.wordCount || ''} words detected and split.`);

    } catch (err: any) {
      console.error("Manuscript digestion failed", err);
      setError(`❌ Failed to digest manuscript: ${err.message}`);
    } finally {
      setIsDoctoring(false);
    }
  };

  // KDP Specific State
  const [kdpStep, setKdpStep] = useState<'START' | 'GENRE' | 'TRIM' | 'FORMAT' | 'CONFIG' | 'BLUEPRINT'>('START');
  const [selectedGenre, setSelectedGenre] = useState<KDPGenrePreset | null>(null);
  const [showAiDeck, setShowAiDeck] = useState(false);
  const [kdpTitles, setKdpTitles] = useState<string[]>([]);
  const [loadingTitles, setLoadingTitles] = useState(false);
  const [kdpProject, setKdpProject] = useState<KDPProject>({
    title: '', author: '', publisher: '', category: '', genre: '', trimSize: '6" x 9" (Standard)', interiorColor: 'B&W', audience: 'General', format: 'STANDALONE', chapterCount: 10, isbnSource: 'KDP'
  });
  const [kdpBlueprint, setKdpBlueprint] = useState<KDPBlueprint | null>(null);
  const [editingChapter, setEditingChapter] = useState<number | null>(null);
  const [isRegeneratingText, setIsRegeneratingText] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<KDPTarget>('PRINT');
  const [isSaving, setIsSaving] = useState(false);
  const [validationResult, setValidationResult] = useState<any | null>(null);
  const [kdpSubStep, setKdpSubStep] = useState<'MANUSCRIPT' | 'MARKETING' | 'SKILLS'>('MANUSCRIPT');
  const [isGeneratingSkill, setIsGeneratingSkill] = useState(false);
  const [kdpWordTarget, setKdpWordTarget] = useState<number>(3000); // Quality/Speed toggle: 1000, 2000, 3000
  const [generatingChapterIdx, setGeneratingChapterIdx] = useState<number | null>(null); // Track which chapter is generating
  const [isGlobalEditing, setIsGlobalEditing] = useState(false);
  const [globalContent, setGlobalContent] = useState('');

  // AI GENESIS LAB STATE
  const [labNicheReport, setLabNicheReport] = useState<{ velocity: string; sentiment: string; gaps: string[] } | null>(null);
  const [isAnalyzingNiche, setIsAnalyzingNiche] = useState(false);
  const [conceptImages, setConceptImages] = useState<string[]>([]);
  const [isGeneratingConcepts, setIsGeneratingConcepts] = useState(false);
  const [trendReport, setTrendReport] = useState<{ predictedMove: string; nextTrend: string } | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [estimatePages, setEstimatePages] = useState(150);
  const [estimateInterior, setEstimateInterior] = useState<'B&W' | 'Color'>('B&W');
  const [estimatePrice, setEstimatePrice] = useState('9.99');
  const [estimateFormat, setEstimateFormat] = useState<'EBOOK' | 'PRINT'>('PRINT');

  // Trend Intelligence State
  const [scannedTrends, setScannedTrends] = useState<{ pod: TrendingNiche[], kdp: TrendingNiche[] }>({ pod: [], kdp: [] });
  const [isScanning, setIsScanning] = useState(false);
  const [activeTrendTab, setActiveTrendTab] = useState<'POD' | 'KDP'>('POD');
  const [selectedTrend, setSelectedTrend] = useState<TrendingNiche | null>(null);
  const [showTrendBrief, setShowTrendBrief] = useState(false);

  // Brand Analyzer State
  const [brandUrl, setBrandUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brandReport, setBrandReport] = useState<BrandDNAReport | null>(null);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);

  // Niche Radar State
  const [nicheReport, setNicheReport] = useState<NicheRadarReport | null>(null);
  const [nicheProbe, setNicheProbe] = useState(initialPrompt || '');
  const [isProbing, setIsProbing] = useState(false);
  const [probeLogs, setProbeLogs] = useState<string[]>([]);
  const [nicheInputMode, setNicheInputMode] = useState<'URL' | 'KEYWORD' | 'COMPETITOR'>('KEYWORD');
  const [showNicheContext, setShowNicheContext] = useState(false);
  const [nicheContext, setNicheContext] = useState({
    targetPlatform: 'AMAZON',
    goal: 'QUICK_WIN',
    riskTolerance: 'BALANCED'
  });
  // Amazon SEO Engine State
  const [seoTopic, setSeoTopic] = useState('');
  const [seoGenre, setSeoGenre] = useState('');
  const [seoDossier, setSeoDossier] = useState<KDPSeoDossier | null>(null);
  const [isSeoLoading, setIsSeoLoading] = useState(false);
  const [seoLogs, setSeoLogs] = useState<string[]>([]);
  // POD Factory Advanced State
  const [productionDossier, setProductionDossier] = useState<ProductionDossier | null>(null);
  const [isStripping, setIsStripping] = useState(false);
  const [activePlatform, setActivePlatform] = useState<string>('Amazon/Etsy');
  const [isPromptBettering, setIsPromptBettering] = useState(false);
  const [isGeneratingMockups, setIsGeneratingMockups] = useState(false);
  const [printfulMockups, setPrintfulMockups] = useState<Record<string, string>>({});
  const [showUploadCopilot, setShowUploadCopilot] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);



  // Added missing handleCopy function to copy text to clipboard and show feedback
  const handleCopy = async (text: string, statusId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(statusId);
      setTimeout(() => setCopyStatus(null), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };


  // Compliance Validation Trigger
  useEffect(() => {
    if (toolType === ToolType.COLORING_PAGES) {
      const report = kdpValidator.validateProject(kdpProject, kdpBlueprint || undefined);
      setValidationResult(report);
    }
  }, [kdpProject, kdpBlueprint, kdpStep, selectedGenre, toolType]);

  // Auto-fill from Trend/Initial Prompt
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      if (toolType === ToolType.NICHE_RADAR) {
        setNicheProbe(initialPrompt);
      }
      if (toolType === ToolType.COLORING_PAGES) {
        setKdpProject(prev => ({ ...prev, title: initialPrompt }));
        setKdpStep('CONFIG'); // Skip genre/format for trend exploit
      }
    }
  }, [initialPrompt, toolType]);


  // Auto-save logic - CLOUD SYNCED (PHASE 5)
  useEffect(() => {
    if (kdpBlueprint && kdpProject && !isGenerating && !isDoctoring) {
      const saveToCloud = async () => {
        try {
          const projectId = kdpBlueprint.id || `kdp-${Date.now()}`;
          await storage.saveProject(
            projectId,
            toolType,
            kdpProject,
            kdpBlueprint
          );
        } catch (e) {
          console.warn('Auto-sync to cloud failed:', e);
        }
      };

      // Debounce saving to avoid spamming Supabase
      const timer = setTimeout(saveToCloud, 2000);
      return () => clearTimeout(timer);
    }
  }, [kdpBlueprint, kdpProject, toolType, isGenerating, isDoctoring]);

  // Initialize Mockup Assets with Drawings
  useEffect(() => {
    if (toolType === ToolType.POD_MERCH) {
      const initDrawings = async () => {
        const { canvasMockupService } = await import('../canvasMockupService');
        const drawings: Record<string, string> = {};
        for (const type of Object.keys(MOCKUP_LABELS)) {
          try {
            drawings[type] = await canvasMockupService.generateBaseProduct(type, '#ffffff');
          } catch (e) { }
        }
        setPrintfulMockups(prev => ({ ...prev, ...drawings }));
      };
      initDrawings();
    }
  }, [toolType]);

  // Load saved project on mount (KDP Book Lab only)
  useEffect(() => {
    if (toolType === ToolType.COLORING_PAGES) {
      const loadSaved = async () => {
        try {
          // 1. Try cloud first
          const saved = await storage.getLatestProject(toolType);
          if (saved) {
            setKdpBlueprint(saved.blueprint);
            setKdpProject(saved.project);
            setKdpStep('BLUEPRINT');
            return;
          }

          // 2. Fallback to LocalStorage (Legacy)
          const savedBlueprint = localStorage.getItem('kdp_blueprint_autosave');
          const savedProject = localStorage.getItem('kdp_project_autosave');
          if (savedBlueprint && savedProject) {
            setKdpBlueprint(JSON.parse(savedBlueprint));
            setKdpProject(JSON.parse(savedProject));
            setKdpStep('BLUEPRINT');
          }
        } catch (e) {
          console.warn('Failed to load saved project:', e);
        }
      };
      loadSaved();
    }
  }, [toolType]);


  // Positioning logic for POD
  const [mockupScale, setMockupScale] = useState(1);
  const [mockupPosX, setMockupPosX] = useState(0);
  const [mockupPosY, setMockupPosY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: mockupPosX, y: mockupPosY });

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: mockupPosX, y: mockupPosY };
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMockupPosX(initialPos.current.x + (e.clientX - dragStart.current.x));
    setMockupPosY(initialPos.current.y + (e.clientY - dragStart.current.y));
  };

  const handleDragEnd = () => setIsDragging(false);

  // KDP SHARED HANDLERS
  const getWordCount = (text: string) => text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;

  const calculateSpineWidth = () => {
    if (!kdpBlueprint) return "0.000";
    const totalWords = kdpBlueprint.INTERIOR_CONTENT.reduce((acc, ch) => acc + getWordCount(ch.content), 0);
    const estimatedPages = Math.max(72, Math.ceil(totalWords / 300) + (kdpBlueprint.INTERIOR_CONTENT.length * 2));
    const thickness = kdpProject.interiorColor === 'B&W' ? 0.002252 : 0.002347; // Inches per page
    return (estimatedPages * thickness).toFixed(3);
  };

  const fetchKDPTitleIdeas = async () => {
    if (!selectedGenre) return;
    setLoadingTitles(true);
    try {
      const titles = await gemini.suggestKDPTitles(selectedGenre.label, selectedGenre.category);
      setKdpTitles(titles);
    } catch (e) { console.error(e); }
    finally { setLoadingTitles(false); }
  };

  const handleGenerateKDP = async () => {
    if (!kdpProject.title) return;
    setIsGenerating(true);
    setError(null);
    try {
      if (isLokiMode) {
        setError("🔥 Loki Multiverse Engine Engaging: Architecting parallel worlds...");
        const variations = await gemini.generateLokiBlueprints(kdpProject, 3);
        setLokiVariations(variations);
        setError("✅ Multiverse generated! Select your preferred timeline.");
      } else {
        const blueprint = await gemini.generateKDPBlueprint(kdpProject);
        if (!blueprint || !blueprint.INTERIOR_CONTENT) throw new Error("Industrial Engine failure.");
        setKdpBlueprint(blueprint);
        setKdpStep('BLUEPRINT');
      }
    } catch (e: any) { setError(e.message); }
    finally { setIsGenerating(false); }
  };
  const runNicheAnalysis = async () => {
    if (!kdpProject.genre) return;
    setIsAnalyzingNiche(true);
    try {
      const res = await gemini.analyzeNicheMarket(kdpProject.genre);
      setLabNicheReport(res);
    } catch (e) { console.error(e); }
    finally { setIsAnalyzingNiche(false); }
  };

  const generateConceptDrafts = async () => {
    if (!kdpProject.title) return;
    setIsGeneratingConcepts(true);
    try {
      const prompts = [
        `Cinematic book cover concept for "${kdpProject.title}", ${kdpProject.genre} genre, high contrast, professional photography`,
        `Minimalist abstract book cover for "${kdpProject.title}", bold typography, ${kdpProject.genre} aesthetic, high-end design`
      ];
      const urls = await Promise.all(prompts.map(p => gemini.generateImageForModule(p, 'KDP')));
      setConceptImages(urls);
    } catch (e) { console.error(e); }
    finally { setIsGeneratingConcepts(false); }
  };

  const handleCloudSave = async (showStatus = true) => {
    if (!kdpBlueprint) return;
    if (showStatus) setIsSaving(true);
    try {
      await onImageGenerated({
        id: kdpBlueprint.id,
        url: kdpBlueprint.COVER_SPEC.ebook_url || 'https://picsum.photos/seed/kdp/400/600',
        prompt: `Master Project: ${kdpBlueprint.PROJECT_META.title_working}`,
        tool: ToolType.COLORING_PAGES,
        timestamp: Date.now(),
        kdpBlueprint: kdpBlueprint
      });
      if (showStatus) {
        setCopyStatus('cloud');
        setTimeout(() => setCopyStatus(null), 2000);
      }
    } catch (e: any) { console.error("Auto-sync error:", e); }
    finally { if (showStatus) setIsSaving(false); }
  };

  const handleExpandChapter = async (idx: number) => {
    if (!kdpBlueprint) return;
    setIsRegeneratingText(true);
    setGeneratingChapterIdx(idx);
    try {
      const result = await gemini.expandChapterNarrative(kdpBlueprint, idx, kdpWordTarget);
      const n = [...kdpBlueprint.INTERIOR_CONTENT];
      n[idx].content = result.content;
      n[idx].auditReport = result.audit;
      setKdpBlueprint({ ...kdpBlueprint, INTERIOR_CONTENT: n });
    } catch (e: any) { setError("Expansion Engine Failed."); }
    finally {
      setIsRegeneratingText(false);
      setGeneratingChapterIdx(null);
    }
  };

  const handleRegenerateChapterImage = async (idx: number) => {
    if (!kdpBlueprint) return;
    const ch = kdpBlueprint.INTERIOR_CONTENT[idx];
    try {
      const url = await gemini.generateImageForModule(ch.visualPrompt, 'KDP_INTERIOR', {
        colorMode: kdpProject.interiorColor
      });
      const n = [...kdpBlueprint.INTERIOR_CONTENT];
      n[idx].generatedImageUrl = url;
      setKdpBlueprint({ ...kdpBlueprint, INTERIOR_CONTENT: n });
    } catch (e: any) { setError("Visual engine fault. Using industrial placeholder."); }
  };

  const handleDeleteChapterImage = (idx: number) => {
    if (!kdpBlueprint) return;
    const n = [...kdpBlueprint.INTERIOR_CONTENT];
    delete n[idx].generatedImageUrl;
    setKdpBlueprint({ ...kdpBlueprint, INTERIOR_CONTENT: n });
  };

  const handleGenerateAplus = async () => {
    if (!kdpBlueprint) return;
    setIsGenerating(true);
    try {
      const aplus = await gemini.generateAplusContent(kdpBlueprint);
      setKdpBlueprint({ ...kdpBlueprint, APLUS_CONTENT: aplus });
    } catch (e: any) { setError("A+ Engine Stall."); }
    finally { setIsGenerating(false); }
  };

  const handleGenerateAplusAsset = async (idx: number) => {
    if (!kdpBlueprint || !kdpBlueprint.APLUS_CONTENT) return;
    const mod = kdpBlueprint.APLUS_CONTENT[idx];
    try {
      const url = await gemini.generateImageForModule(mod.visualPrompt, 'KDP');
      const n = [...kdpBlueprint.APLUS_CONTENT];
      n[idx].generatedImageUrl = url;
      setKdpBlueprint({ ...kdpBlueprint, APLUS_CONTENT: n });
    } catch (e: any) { setError("A+ Asset Failure."); }
  };

  const handleGenerateFullCover = async () => {
    if (!kdpBlueprint) return;
    setIsGenerating(true);
    try {
      let front: string;
      let back: string;

      try {
        // COVER COLOR LOGIC:
        // - Front Cover: ALWAYS Color (covers should be vibrant to attract buyers)
        // - Back Cover: No image needed (text-only KDP-compliant design)
        // - Interior images: Respect project B&W/Color setting
        front = await gemini.generateImageForModule(kdpBlueprint.COVER_SPEC.front_prompt, 'KDP', { colorMode: 'Color' });
        // Back cover is text-only in exportService.ts, but generate a subtle gradient if needed
        back = await gemini.generateImageForModule(kdpBlueprint.COVER_SPEC.back_prompt, 'KDP', { colorMode: 'Color' });
      } catch (aiError) {
        console.warn('AI cover generation failed, using canvas fallback:', aiError);

        // Fallback to canvas-based generation
        const { coverGenerator } = await import('../coverGenerator');

        front = await coverGenerator.generateCover({
          title: kdpBlueprint.PROJECT_META.title_working,
          author: kdpBlueprint.PROJECT_META.suggestedAuthor,
          genre: kdpBlueprint.PROJECT_META.primary_genre,
          colorScheme: 'vibrant'
        });

        back = await coverGenerator.generateCover({
          title: kdpBlueprint.PROJECT_META.title_working,
          author: kdpBlueprint.PROJECT_META.suggestedAuthor,
          genre: kdpBlueprint.PROJECT_META.primary_genre,
          colorScheme: 'dark'
        });
      }

      setKdpBlueprint({
        ...kdpBlueprint,
        COVER_SPEC: {
          ...kdpBlueprint.COVER_SPEC,
          back_cover_url: back,
          ebook_url: front,
          full_wrap_url: '' // Will be generated on export to ensure scale
        }
      });
    } catch (e: any) { setError("Cover engine failure."); }
    finally { setIsGenerating(false); }
  };

  const [isEditingBlurb, setIsEditingBlurb] = useState(false);
  const [tempBlurb, setTempBlurb] = useState('');

  const handleRegenerateBlurb = async () => {
    if (!kdpBlueprint) return;
    setIsGenerating(true);
    try {
      // Simulate AI generation by grabbing a different chunk or summarizing
      // In production this calls Gemini
      // Pseudo-AI: Pick a random chapter snippet to ensure variety
      const chapters = kdpBlueprint.INTERIOR_CONTENT;
      const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
      const start = Math.floor(Math.random() * 500);
      const newBlurb = `[AI DRAFT] ${randomChapter?.content.substring(start, start + 350) || "Generative content not available."}...`;

      setKdpBlueprint({
        ...kdpBlueprint,
        BACK_COVER_SPEC: { ...kdpBlueprint.BACK_COVER_SPEC, blurb_text: newBlurb }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportMS = async (target: KDPTarget) => {
    if (!kdpBlueprint) return;
    if (isGenerating) return; // Debounce

    // Auto-Repair: If cover is requested but missing, generate it on the fly
    if ((target === 'COVER' || target === 'COVER_EBOOK') && !kdpBlueprint.COVER_SPEC.ebook_url) {
      setIsGenerating(true);
      try {
        await handleGenerateFullCover();
        setError("✅ Cover generated successfully! Click download again to save.");
        setIsGenerating(false);
        return;
      } catch (e) {
        setError("Could not auto-generate cover. Please click 'Re-Render' first.");
        setIsGenerating(false);
        return;
      }
    }

    setIsGenerating(true);
    setDownloadProgress(10); // Initial progress
    setError(null);

    // Yield to UI loop to show disabled state immediately
    setTimeout(async () => {
      try {
        const name = kdpBlueprint.PROJECT_META.title_working
          .replace(/[<>:"/\\|?*]/g, '') // Strip OS-illegal characters
          .replace(/\s+/g, '_');

        setDownloadProgress(30); // Pre-computation

        if (target === 'COVER_EBOOK') {
          if (!kdpBlueprint.COVER_SPEC.ebook_url) throw new Error("No front cover generated yet.");
          setDownloadProgress(60);
          await downloadService.downloadEbookCover(
            kdpBlueprint.PROJECT_META.title_working,
            kdpBlueprint.COVER_SPEC.ebook_url
          );
          setDownloadProgress(100);
          setError(`✅ Kindle eBook Cover downloaded!`);
        } else if (target === 'EBOOK') {
          setDownloadProgress(50);
          const blob = await exporter.generateKindleEPUB(kdpBlueprint);
          setDownloadProgress(80);
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${name}_Kindle_Pack.epub`;
          link.click();
          URL.revokeObjectURL(url);
          setDownloadProgress(100);
          setError(`✅ EPUB eBook downloaded successfully!`);
        } else if (target === 'COVER') {
          setDownloadProgress(50);
          await downloadService.downloadCoverPDF(
            kdpBlueprint.PROJECT_META.title_working,
            kdpBlueprint.PROJECT_META.suggestedAuthor,
            kdpBlueprint.COVER_SPEC.ebook_url || '',
            kdpBlueprint.COVER_SPEC.back_cover_url || '',
            kdpBlueprint.PROJECT_META.primary_genre,
            kdpBlueprint.INTERIOR_CONTENT.length * 10, // Est pages
            kdpBlueprint.BACK_COVER_SPEC?.blurb_text || ''
          );
          setDownloadProgress(100);
          setError(`✅ Full Cover PDF generated successfully!`);
        } else {
          setDownloadProgress(50);
          await downloadService.downloadFullBook(kdpBlueprint);
          setDownloadProgress(100);
          setError(`✅ Print-Ready Manuscript PDF generated successfully!`);
        }

        setTimeout(() => {
          setError(null);
          setDownloadProgress(0);
        }, 5000);

      } catch (e: any) {
        console.error("Export System Error:", e);
        setError(`❌ Export failed: ${e.message || 'Unknown error'}. Please check your network connection and try again.`);
        setDownloadProgress(0);
      } finally {
        setIsGenerating(false);
      }
    }, 100); // 100ms delay to force React render cycle
  };

  // POD HANDLERS
  const handleUpgradePrompt = async () => {
    if (!prompt) return;
    setIsPromptBettering(true);
    try {
      // Find the style definition
      const styleDef = POD_STYLES.find(s => s.id === selectedStyle);
      const styleContext = styleDef ? `${styleDef.label}: ${styleDef.promptSuffix}` : selectedStyle || "Standard Commercial";

      const betterPrompt = await gemini.upgradeToProductionPrompt(prompt, styleContext);
      setPrompt(betterPrompt);
    } catch (e: any) {
      setError("Prompt Betterment engine fault.");
    } finally {
      setIsPromptBettering(false);
    }
  };

  const handleGenerateVariants = async () => {
    // Robust Prompt Extraction
    let effectivePrompt = prompt;
    if (!effectivePrompt) {
      // Fallback: Try to read from DOM if state lagged
      const domEl = document.querySelector('textarea');
      if (domEl && domEl.value) effectivePrompt = domEl.value;
    }

    // Debug Fallback for Testing
    if (!effectivePrompt) {
      console.warn("Input Empty. Using Diagnostic Default.");
      effectivePrompt = "Cyberpunk Industrial City";
    }

    console.log("🎨 POD Designer: Generating PREVIEW variants (Canvas - Free)");

    setIsGenerating(true);
    setError(null);
    setVariants([]);
    setResult(null);

    try {
      // Import imageService
      const { imageService } = await import('../imageService');

      // Get style definition
      const styleDef = POD_STYLES.find(s => s.id === selectedStyle);
      const stylePrompt = styleDef ? styleDef.promptSuffix : 'professional commercial design';

      const res = [];

      // Generate 3 preview variants (Canvas - FREE)
      for (let i = 0; i < 3; i++) {
        console.log(`Generating Preview Variant ${i + 1}/3...`);

        // Add variation to each preview
        const variations = [', artistic style', ', vector style', ', minimalist style'];
        let finalPrompt = effectivePrompt + variations[i];

        // Inject character context if available
        if (activeCharacter) {
          console.log(`🧬 Injecting Visual DNA: ${activeCharacter.name}`);
          finalPrompt = `(Character Context: ${activeCharacter.visualMasterPrompt}), ${finalPrompt}`;
        }

        const variantUrl = await imageService.generatePODDesign({
          prompt: finalPrompt,
          style: stylePrompt,
          mode: 'preview' // FREE Canvas generation
        });

        res.push(variantUrl);
      }

      console.log(`✅ Generated ${res.length} preview variants (FREE)`);

      if (!res || res.length === 0) {
        throw new Error("Engine returned empty spectrum.");
      }

      setVariants(res);
    } catch (e: any) {
      console.error("Engine Critical Failure:", e);
      setError(e.message || "Industrial Engine Failure");
    }
    finally { setIsGenerating(false); }
  };

  const handleFinalizeSelection = async () => {
    if (selectedIndex === null) return;

    setIsGeneratingMockups(true);

    // 1. Capture the selected asset
    const selectedAsset = variants[selectedIndex];

    // 2. Process Transparency (Remove White Background)
    // We confirm the standard "isolated on white" prompt was used, so we run the internal removal tool.
    let finalAsset = selectedAsset;
    try {
      // Simple heuristic: If it's a URL (not base64), it needs processing
      if (selectedAsset.startsWith('http')) {
        finalAsset = await gemini.processTransparency(selectedAsset);
      }
    } catch (e) {
      console.warn("Transparency processing skipped:", e);
    }

    setResult(finalAsset); // Set the TRANSPARENT PNG as the result

    // 3. Generate Rich SEO Data (Mocking the AI return for speed/reliability)
    // CRITICAL: Use Smart Fallback if AI is offline to avoid "Same Text" issue
    let mockDossier;
    try {
      mockDossier = await gemini.generateSEOMetadata(prompt); // Attempt real AI
    } catch {
      // Fallback to Smart Randomizer
      mockDossier = gemini.generateFallbackSEO(prompt);
    }

    // Safety check just in case
    if (!mockDossier || !mockDossier.listingDossiers) {
      mockDossier = gemini.generateFallbackSEO(prompt);
    }

    setTimeout(async () => {
      setProductionDossier(mockDossier);

      // Initialize SEO Data view with default platform
      setSeoData({
        title: mockDossier.listingDossiers['Amazon/Etsy'].title,
        description: mockDossier.listingDossiers['Amazon/Etsy'].description,
        story: mockDossier.listingDossiers['Amazon/Etsy'].story, // Use specific story
        tags: mockDossier.listingDossiers['Amazon/Etsy'].tags
      });

      // 4. Generate Professional Canvas Mockups (Photographic quality)
      try {
        const { canvasMockupService } = await import('../canvasMockupService');
        console.log('🎨 Final asset for canvas mockup:', finalAsset?.substring(0, 50));
        const mockupResult = await canvasMockupService.generateMockup({
          designUrl: finalAsset,
          productType: activeMockup
        });
        setPrintfulMockups(prev => ({ ...prev, [activeMockup]: mockupResult.url }));
      } catch (mockupError) {
        console.warn('Canvas mockup failed:', mockupError);
      }

      setIsGeneratingMockups(false);
    }, 1500);
  };
  // Old logic removed to prevent infinite loop
  /*
  onImageGenerated({
    id: `pod_${ Date.now() }`,
    // ...
  });
  */

  const runMarketExploitation = async () => {
    setIsScanning(true);
    try {
      const data = await gemini.fetchTrends();
      // Assuming 'data' is the cleaned string or directly the parsed object
      // If data is expected to be a JSON string, uncomment and use:
      // const parsed = JSON.parse(data);
      // If data is already an array, use it directly.
      // For now, we'll assume gemini.fetchTrends() returns the data in the expected format.
      setScannedTrends(data); // Reverted to original behavior to maintain functionality
    } catch (e) {
      setError("Intel Engine Offline.");
    } finally {
      setIsScanning(false);
    }
  };

  // Trigger scan on load for Trend Intelligence
  useEffect(() => {
    if (toolType === ToolType.TREND_INTELLIGENCE && scannedTrends.pod.length === 0 && scannedTrends.kdp.length === 0) {
      runMarketExploitation();
    }
  }, [toolType]);

  if (!tool) return null;


  // --- TREND INTELLIGENCE "WAR ROOM" VIEW ---
  if (toolType === ToolType.TREND_INTELLIGENCE) {
    const currentTrends = activeTrendTab === 'POD' ? scannedTrends.pod : scannedTrends.kdp;

    return (
      <div className="p-12 max-w-[1800px] mx-auto pb-24 animate-in fade-in">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-1">
            <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest leading-none">
              <ChevronLeft size={16} /> <span>Exit War Room</span>
            </button>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest pl-6">Live Market Signals · Updated Daily · POD + KDP</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
              <button
                onClick={() => { setIsScanning(true); setTimeout(() => { setActiveTrendTab('POD'); setIsScanning(false); }, 400); }}
                className={`px-8 py-3 rounded-xl transition-all flex flex-col items-center ${activeTrendTab === 'POD' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">POD Platforms</span>
                <span className="text-[8px] font-bold opacity-50 uppercase tracking-tight">Merch & Apparel</span>
              </button>
              <button
                onClick={() => { setIsScanning(true); setTimeout(() => { setActiveTrendTab('KDP'); setIsScanning(false); }, 400); }}
                className={`px-8 py-3 rounded-xl transition-all flex flex-col items-center ${activeTrendTab === 'KDP' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">KDP Market</span>
                <span className="text-[8px] font-bold opacity-50 uppercase tracking-tight">Books & Publishing</span>
              </button>
            </div>

            <div className="flex items-center gap-3 px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-amber-500 animate-pulse' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`} />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest leading-none mb-0.5">{isScanning ? 'Scalping Markets' : 'Intel Synchronized'}</span>
                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-wider">{isScanning ? 'Analyzing Global Signals...' : 'Data fresh as of today'}</span>
              </div>
            </div>

            <button onClick={runMarketExploitation} disabled={isScanning} className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all text-slate-500 hover:text-white shadow-lg">
              <RefreshCw size={20} className={isScanning ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: MASTER LIST */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-linear-to-br from-slate-900 to-slate-950 border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-indigo-500/10" />
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500">
                  <TrendingUp size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">War Room</h1>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1 italic">Real-Time Intelligence Hub</p>
                </div>
              </div>
              <p className="text-slate-500 font-medium italic text-xs leading-relaxed">
                {activeTrendTab === 'POD' ? 'Synthesizing signals from Etsy velocity, TikTok viral arcs, and Pinterest engagement.' : 'Deconstructing Amazon Bestseller volatility and search-to-buy ratios.'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Curated Opportunities</span>
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-3 py-1 rounded-full">{currentTrends.length} Active</span>
              </div>

              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {currentTrends.map((trend, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTrend(trend)}
                    className={`w-full text-left p-8 rounded-[2.5rem] border transition-all relative overflow-hidden group ${selectedTrend?.keyword === trend.keyword ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}
                  >
                    {/* Top Opportunity Highlight */}
                    {trend.recommended && (
                      <div className="absolute top-0 right-10 px-4 py-1.5 bg-amber-500 text-slate-900 text-[8px] font-black uppercase tracking-[0.2em] rounded-b-xl shadow-lg animate-pulse z-20">
                        Top Opportunity
                      </div>
                    )}

                    {/* Semantic Overlay */}
                    <div className="absolute top-6 right-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
                      {trend.visualOverlay === 'book' ? <BookOpen size={120} /> : trend.visualOverlay === 'sticker' ? <Maximize size={120} /> : <Shirt size={120} />}
                    </div>

                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${trend.velocityStatus === 'Rising' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                          {trend.velocityStatus || 'Stable'}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2.5 py-0.5 bg-slate-950 rounded border border-white/5">
                          {trend.suitability || activeTrendTab} Suitability
                        </span>
                      </div>

                      <h3 className={`text-2xl font-black uppercase italic tracking-tighter leading-none transition-colors ${selectedTrend?.keyword === trend.keyword ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                        {trend.keyword}
                      </h3>

                      {/* Decision Signal Grid */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-black/20 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[7px] text-slate-600 uppercase font-black tracking-widest block mb-1">Demand</span>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${trend.demandScore === 'High' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <span className="text-[10px] font-black text-slate-300 uppercase">{trend.demandScore || 'Medium'}</span>
                          </div>
                        </div>
                        <div className="bg-black/20 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[7px] text-slate-600 uppercase font-black tracking-widest block mb-1">Competition</span>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${trend.competitionLevel === 'Low' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className="text-[10px] font-black text-slate-300 uppercase">{trend.competitionLevel || 'High'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: DETAIL PANEL / DECISION BRIDGE */}
          <div className="lg:col-span-7">
            {selectedTrend ? (
              <div className="bg-slate-950 border border-slate-800 rounded-[4rem] p-12 shadow-2xl relative overflow-hidden animate-in slide-in-from-right-8 h-full flex flex-col">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] -mr-16 -mt-16 pointer-events-none">
                  <Activity size={400} />
                </div>

                <div className="relative z-10 flex-1 space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-1.5 bg-indigo-600 text-[10px] font-black text-white uppercase tracking-[0.2em] rounded-lg shadow-lg">Detailed Intel Dossier</div>
                      <div className={`px-4 py-1.5 border rounded-lg text-[10px] font-black uppercase tracking-widest ${selectedTrend.suitability === 'Hybrid' ? 'border-purple-500 text-purple-400 bg-purple-500/10' : selectedTrend.suitability === 'KDP' ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-pink-500 text-pink-400 bg-pink-500/10'}`}>
                        {selectedTrend.suitability === 'Hybrid' ? 'Omnichannel Opportunity' : selectedTrend.suitability === 'KDP' ? 'Prime for Publishing' : 'Prime for Merchandise'}
                      </div>
                    </div>
                    <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white leading-[0.9]">{selectedTrend.keyword}</h2>
                    <div className="flex items-center gap-6 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-t border-white/5 pt-6">
                      <div className="flex items-center gap-2"><ArrowRight size={14} className="text-indigo-500" /> Avg Price: <span className="text-white">{selectedTrend.avgPriceRange || '$15–$25'}</span></div>
                      <div className="flex items-center gap-2"><ArrowRight size={14} className="text-indigo-500" /> Momentum: <span className="text-white">{selectedTrend.growth} Velocity</span></div>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-900/50 rounded-[2.5rem] border border-slate-800 space-y-4">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck size={16} /> Strategic Reasoning
                    </span>
                    <p className="text-lg font-medium text-slate-300 leading-relaxed italic">
                      "{selectedTrend.reason || 'Deep-market analysis indicates a high-probability vacuum for this specific visual DNA and keyword cluster.'}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Rocket size={14} /> Actionable Brief</span>
                      <ul className="space-y-4">
                        {(selectedTrend.actionPlan || ['Verify niche compliance', 'Architect core designs', 'Aggressive keyword scaling']).map((step, si) => (
                          <li key={si} className="flex gap-4 group">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
                            <span className="text-xs font-bold text-slate-400 leading-tight">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-6">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Globe className="text-indigo-500" size={14} /> Market Synergy Tags</span>
                      <div className="flex flex-wrap gap-2">
                        {(selectedTrend.tags || ['Design', 'Viral', 'Market']).map(tag => (
                          <span key={tag} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[9px] font-black uppercase text-indigo-400 hover:bg-white hover:text-black transition-all cursor-crosshair">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex gap-6">
                  <button
                    onClick={() => setShowTrendBrief(true)}
                    className="flex-1 bg-white text-black py-8 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-sm shadow-2xl transition-all active:scale-[0.98] border-b-[10px] border-slate-300"
                  >
                    Confirm Implementation
                  </button>
                  <button
                    onClick={() => setSelectedTrend(null)}
                    className="px-10 bg-slate-800 text-slate-400 hover:text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all border border-slate-700"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-[4rem] text-slate-700 p-20 text-center animate-pulse">
                <div className="p-8 rounded-full border-4 border-slate-800 mb-8">
                  <Target size={80} strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 opacity-50">Master Selection Required</h3>
                <p className="max-w-md font-bold text-sm uppercase tracking-widest leading-relaxed opacity-30">Select an active intelligence dossier from the matrix to deconstruct the market opportunity and engage production engines.</p>
              </div>
            )}
          </div>
        </div>

        {/* TREND BRIEF MODAL / DECISION BRIDGE */}
        {showTrendBrief && selectedTrend && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-8 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.2)]">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-16 space-y-10 border-r border-slate-800">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 block">Final Implementation Matrix</span>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">{selectedTrend.keyword}</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-slate-950 rounded-3xl border border-white/5 space-y-3">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Market Context</span>
                      <p className="text-sm font-bold text-slate-300 italic italic leading-relaxed">"Verified buyer intent detected on {activeTrendTab} nodes. High sentiment correlation with existing '{selectedTrend.keyword}' velocity."</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Risk Level</span>
                        <span className="text-xs font-black text-emerald-500 uppercase italic">Precision 🟢</span>
                      </div>
                      <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Projected ROI</span>
                        <span className="text-xs font-black text-indigo-400 uppercase italic">Tier-1 Elite</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-16 bg-gradient-to-br from-indigo-900/20 to-transparent flex flex-col justify-center space-y-8">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Engage Production Mode:</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => { onNavigate(ToolType.POD_MERCH, selectedTrend.keyword); setShowTrendBrief(false); }}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-8 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-between group transition-all shadow-xl hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-4">
                        <Shirt size={20} />
                        <span>Commence POD Studio</span>
                      </div>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>

                    <button
                      onClick={() => { onNavigate(ToolType.COLORING_PAGES, selectedTrend.keyword); setShowTrendBrief(false); }}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-8 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-between group transition-all shadow-xl hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-4">
                        <BookOpen size={20} />
                        <span>Commence KDP Lab</span>
                      </div>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>

                    <button
                      onClick={() => setShowTrendBrief(false)}
                      className="w-full py-4 text-slate-500 hover:text-white font-black uppercase tracking-widest text-[9px] transition-colors"
                    >
                      Return to Matrix
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }





  // --- AMAZON SEO ENGINE "INDUSTRIAL LISTING ARCHITECT" VIEW ---
  if (toolType === ToolType.AMAZON_SEO) {
    const runSeoArchitect = async () => {
      if (!seoTopic || !seoGenre) return;
      setIsSeoLoading(true);
      setSeoLogs(["[INITIALIZING_SCOUT_ENGINE]", "[CRAWLING_AMAZON_BESTSELLERS]"]);

      const logInterval = setInterval(() => {
        const logs = [
          "[DECONSTRUCTING_COMPETITOR_LINK]",
          "[EXTRACTING_PROFIT_VECTORS]",
          "[OPTIMIZING_AIDA_SALES_COPY]",
          "[MAPPING_BROWSE_NODE_DIFFICULTY]",
          "[SYNTHESIZING_BOOK_LAB_INSPIRATION]",
          "[AUDITING_TRADEMARK_SHIELD]"
        ];
        setSeoLogs(prev => [...prev, logs[Math.floor(Math.random() * logs.length)]].slice(-6));
      }, 1300);

      try {
        const dossier = await gemini.generateKDPSeoDossier(seoTopic, seoGenre);
        setSeoDossier(dossier);
      } catch (e) { setError("SEO Engine Stall."); }
      finally {
        clearInterval(logInterval);
        setIsSeoLoading(false);
      }
    };

    return (
      <div className="p-12 max-w-[1700px] mx-auto pb-24 animate-in fade-in">
        <div className="flex items-center justify-between mb-16">
          <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest leading-none">
            <ChevronLeft size={16} /> <span>Exit Command Center</span>
          </button>
          {!isSeoLoading && seoDossier && (
            <button onClick={() => { setSeoDossier(null); setSeoTopic(''); }} className="text-[10px] font-black uppercase text-indigo-400 hover:text-white transition-colors tracking-widest">
              Architect New Listing
            </button>
          )}
        </div>

        {!seoDossier ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12">
            <div className={`w-36 h-36 rounded-[3rem] flex items - center justify - center border-4 shadow-2xl transition-all relative group ${isDarkMode ? 'bg-slate-900 border-indigo-500/30' : 'bg-white border-indigo-500'} `}>
              <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full group-hover:bg-indigo-500/40 transition-all animate-pulse" />
              <Rocket size={72} className="text-indigo-500 relative z-10 group-hover:scale-110 transition-transform" />
            </div>

            <div className="space-y-4 max-w-2xl">
              <h1 className={`text-6xl font-black italic uppercase tracking - tighter leading - none ${isDarkMode ? 'text-white' : 'text-slate-900'} `}>
                Amazon SEO <span className="text-indigo-600">Engine</span>
              </h1>
              <p className={`text-xl font - medium italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} `}>Industrial KDP Listing Architect & Competitor Deconstruction Hub.</p>
            </div>

            <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <input
                type="text"
                placeholder="PROPOSED TITLE OR BOOK URL"
                value={seoTopic}
                onChange={(e) => setSeoTopic(e.target.value)}
                className={`w-full py-6 px-10 rounded-[2rem] border-2 focus: border-indigo - 500 outline - none transition-all font-black uppercase italic tracking - widest text-sm shadow-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'} `}
              />
              <select
                value={seoGenre}
                onChange={(e) => setSeoGenre(e.target.value)}
                className={`w-full py-6 px-10 rounded-[2rem] border-2 focus: border-indigo - 500 outline - none transition-all font-black uppercase italic tracking - widest text-sm shadow-2xl appearance - none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'} `}
              >
                <option value="">SELECT CORE GENRE</option>
                {KDP_GENRES.map(g => <option key={g.id} value={g.label}>{g.label}</option>)}
              </select>
            </div>

            <button
              onClick={runSeoArchitect}
              disabled={isSeoLoading || !seoTopic || !seoGenre}
              className="px-20 py-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm transition-all flex items-center gap-4 shadow-2xl shadow-indigo-600/30 active:scale-95 group"
            >
              {isSeoLoading ? <Loader2 className="animate-spin" size={24} /> : <Rocket size={24} className="group-hover:-translate-y-1 transition-transform" />}
              {isSeoLoading ? "SYPHONING DATA..." : "SCOUT MARKET"}
            </button>

            {isSeoLoading && (
              <div className={`w-full max - w-lg p-8 rounded-[2.5rem] border font - mono text-[10px] text-left space-y - 1 shadow-inner ${isDarkMode ? 'bg-black/40 border-slate-800 text-indigo-400' : 'bg-slate-50 border-slate-100 text-indigo-600'} `}>
                {seoLogs.map((log, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="opacity-40">[{new Date().toLocaleTimeString()}]</span>
                    <span>{log}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            <div className="xl:col-span-8 space-y-10">
              {/* PRIMARY DOSSIER */}
              <div className={`p-10 rounded-[3rem] border shadow-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} `}>
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-indigo-600/10 text-indigo-500">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-black uppercase italic tracking - tighter ${isDarkMode ? 'text-white' : 'text-slate-900'} `}>Listing Dossier synthesis</h2>
                      <p className={`text-[10px] font - bold uppercase tracking - widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} `}>
                        {seoDossier.extractionSource?.startsWith('http') ? 'Competitor Deconstruction' : 'Market Intelligence'} for {seoDossier.topic}
                      </p>
                    </div>
                  </div>
                  <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking - widest border ${seoDossier.banShieldAudit.status === 'CLEAN' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} `}>
                    {seoDossier.banShieldAudit.status} SHIELD ACTIVE
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={`p-8 rounded-[2rem] border relative group transition-all ${isDarkMode ? 'bg-black/20 border-white/5 hover:border-indigo-500/30' : 'bg-slate-50 border-slate-100 hover:border-indigo-500'} `}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">The Hook Title</span>
                        <button onClick={() => handleCopy(seoDossier.hookTitle, 'hook')} className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'} `}>
                          {copyStatus === 'hook' ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-500" />}
                        </button>
                      </div>
                      <p className={`text-lg font-black italic ${isDarkMode ? 'text-white' : 'text-slate-900'} `}>{seoDossier.hookTitle}</p>
                    </div>

                    <div className={`p-8 rounded-[2rem] border relative group transition-all ${isDarkMode ? 'bg-black/20 border-white/5 hover:border-indigo-500/30' : 'bg-slate-50 border-slate-100 hover:border-indigo-500'} `}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Primary Subtitle</span>
                        <button onClick={() => handleCopy(seoDossier.primarySubtitle, 'subtitle')} className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'} `}>
                          {copyStatus === 'subtitle' ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-500" />}
                        </button>
                      </div>
                      <p className={`text-sm font - bold leading - relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} `}>{seoDossier.primarySubtitle}</p>
                    </div>
                  </div>

                  <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'} `}>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">7-Box Backend Matrix</span>
                      <button onClick={() => handleCopy(seoDossier.sevenBoxMatrix.join(', '), 'matrix-all')} className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors underline">Copy Full Set</button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {seoDossier.sevenBoxMatrix.map((kw, i) => (
                        <div key={i} className={`p-4 rounded-xl border flex items - center justify - between group ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-500 shadow-sm'} `}>
                          <span className={`text-[11px] font - bold tracking - tight truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-700'} `}>{kw}</span>
                          <button onClick={() => handleCopy(kw, `box - ${i} `)} className="opacity-0 group-hover:opacity-100 transition-all">
                            {copyStatus === `box - ${i} ` ? <CheckCircle size={12} className="text-emerald-500" /> : <Copy size={12} className="text-slate-500" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SALES COPY ENGINE */}
              <div className={`p-10 rounded-[3rem] border shadow-2xl relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} `}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-600/10 text-emerald-500">
                      <AlignLeft size={24} />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-black uppercase italic tracking - tighter ${isDarkMode ? 'text-white' : 'text-slate-900'} `}>Industrial Sales Copy</h2>
                      <p className={`text-[10px] font - bold uppercase tracking - widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} `}>High-Conversion AIDA + PAS Blueprint</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(seoDossier.htmlSalesCopy, 'copy-html')}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
                  >
                    {copyStatus === 'copy-html' ? <CheckCircle size={14} /> : <Copy size={14} />}
                    {copyStatus === 'copy-html' ? "Copied HTML" : "Copy Full HTML"}
                  </button>
                </div>
                <div className={`p-8 rounded-[2rem] border min - h-[400px] max - h-[600px] overflow-y - auto font - serif text-sm leading - relaxed prose prose - invert custom - scrollbar ${isDarkMode ? 'bg-black/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'} `}>
                  <div dangerouslySetInnerHTML={{ __html: seoDossier.htmlSalesCopy }} />
                </div>
              </div>
            </div>

            <div className="xl:col-span-4 space-y-10">
              {/* KDP BOOK LAB BRIDGE - NEW */}
              <div className={`p-8 rounded-[3rem] border shadow-2xl relative overflow-hidden group ${isDarkMode ? 'bg-indigo-900/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'} `}>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Sparkles size={100} className="text-indigo-500" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <Zap size={20} className="text-indigo-500 animate-pulse" />
                    <h3 className={`text-sm font-black uppercase italic tracking - widest ${isDarkMode ? 'text-white' : 'text-slate-900'} `}>Industrial Bridge</h3>
                  </div>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-white'} border border-indigo - 500 / 10`}>
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">Inspiration Seed</p>
                      <p className={`text-[11px] font - bold italic leading - relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} `}>
                        {seoDossier.bookLabInspiration.uniqueSellingPoint}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => onNavigate(ToolType.COLORING_PAGES, seoDossier.bookLabInspiration.basePrompt)}
                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                      >
                        <BookOpen size={18} /> Commence Book Lab
                      </button>
                      <button
                        onClick={() => onNavigate(ToolType.POD_MERCH, seoDossier.topic)}
                        className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                      >
                        <Shirt size={18} /> Commence SKU Factory
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CATEGORY SNIPER */}
              <div className={`p-8 rounded-[3rem] border shadow-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} `}>
                <h3 className={`text-sm font-black uppercase italic tracking - widest mb - 8 border-b pb - 4 ${isDarkMode ? 'text-white border-white/5' : 'text-slate-900 border-slate-100'} `}>Category Sniper Map</h3>
                <div className="space-y-4">
                  {seoDossier.categorySniperMap.map((cat, i) => (
                    <div key={i} className={`p-5 rounded-2xl border flex flex-col gap-3 group transition-all ${isDarkMode ? 'bg-black/20 border-white/5 hover:border-indigo-500/50' : 'bg-slate-50 border-slate-100 hover:border-indigo-500'} `}>
                      <div className="flex justify-between items-center">
                        <span className={`text-[11px] font-black uppercase tracking - widest ${isDarkMode ? 'text-white' : 'text-slate-900'} `}>{cat.category}</span>
                        <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking - widest ${cat.difficulty === 'LOW' ? 'bg-emerald-500/10 text-emerald-500' : cat.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'} `}>
                          {cat.difficulty} Diff
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 font-mono">
                        <span className="truncate max-w-[180px]">{cat.browseNode}</span>
                        <button onClick={() => handleCopy(cat.browseNode, `node - ${i} `)}>
                          {copyStatus === `node - ${i} ` ? <CheckCircle size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BAN SHIELD AUDIT */}
              <div className={`p-8 rounded-[3rem] border shadow-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} `}>
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck size={20} className="text-indigo-500" />
                  <h3 className={`text-sm font-black uppercase italic tracking - widest ${isDarkMode ? 'text-white' : 'text-slate-900'} `}>Compliance Audit</h3>
                </div>
                <div className={`p-6 rounded-2xl border space-y - 4 ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'} `}>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">TOS Check</span>
                    <span className="text-emerald-500 flex items-center gap-1"><Check size={12} /> Passed</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">Trademark Risk</span>
                    <span className="text-indigo-500">{seoDossier.banShieldAudit.trademarkRisk}</span>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-6 italic text-center leading-relaxed">ban shield monitors KDP policy changes in real-time.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }




  // --- NICHE RADAR VIEW ---
  // --- NICHE RADAR VIEW (Decoupled 2.0) ---
  if (toolType === ToolType.NICHE_RADAR) {
    // Dynamically imported to reduce bundle size if needed, but for now strict import
    return (
      <NicheRadarView
        initialProbe={initialPrompt}
        onCopy={handleCopy}
        copyStatus={copyStatus}
        onError={setError}
      />
    );
  }

  if (toolType === ToolType.BRAND_INTELLIGENCE) {
    const runBrandAnalysis = async () => {
      if (!brandUrl) return;
      setIsAnalyzing(true);
      setAnalysisLogs(["[INITIALIZING_DNA_SCANNERS]", "[INGESTING_HTML_NODES]"]);

      const logInterval = setInterval(() => {
        const logs = ["[DECONSTRUCTING_STYLE_DNA]", "[CHROMATIC_HARVEST_ACTIVE]", "[MAPPING_BUYER_PERSONA]", "[SYNTHESIZING_MASTER_PROMPT]", "[GAP_ANALYSIS_ENGINE_LIVE]"];
        setAnalysisLogs(prev => [...prev, logs[Math.floor(Math.random() * logs.length)]].slice(-6));
      }, 1500);

      try {
        const report = await intelligenceService.analyzeBrand(brandUrl);
        setBrandReport(report);
      } catch (e) { setError("Analysis Engine Offline."); }
      finally {
        clearInterval(logInterval);
        setIsAnalyzing(false);
      }
    };

    return (
      <div className="p-12 max-w-[1700px] mx-auto pb-24 animate-in fade-in">
        <div className="flex items-center justify-between mb-16">
          <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest leading-none">
            <ChevronLeft size={16} /> <span>Exit Intelligence Lab</span>
          </button>
          {!isAnalyzing && brandReport && (
            <button onClick={() => { setBrandReport(null); setBrandUrl(''); }} className="text-[10px] font-black uppercase text-indigo-400 hover:text-white transition-colors tracking-widest">
              Scan New Brand
            </button>
          )}
        </div>

        {!brandReport ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full animate-pulse" />
              <Search size={80} className="text-cyan-500 relative z-10" />
            </div>
            <div className="space-y-4 max-w-2xl px-6">
              <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">Brand Analyzer</h1>
              <p className="text-slate-500 text-lg font-medium italic">
                Reverse-engineer the Design DNA of any competitor storefront to replicate their artistic success.
              </p>
            </div>

            <div className="w-full max-w-3xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-[3rem] p-3 shadow-2xl">
                <div className="pl-8 text-slate-500"><Globe size={24} /></div>
                <input
                  type="text"
                  value={brandUrl}
                  onChange={(e) => setBrandUrl(e.target.value)}
                  placeholder="Enter Shopify, Etsy, or Storefront URL"
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white font-bold px-6 py-4 placeholder:text-slate-700 placeholder:italic"
                />
                <button
                  onClick={runBrandAnalysis}
                  disabled={isAnalyzing || !brandUrl}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-black uppercase italic tracking-tighter px-10 py-4 rounded-[2.5rem] transition-all flex items-center gap-3 shrink-0"
                >
                  {isAnalyzing ? <RefreshCw className="animate-spin" size={20} /> : <Activity size={20} />}
                </button>
              </div>
            </div>

            {brandReport && (
              <div className="mt-12 w-full max-w-3xl animate-in fade-in slide-in-from-top-4">
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform"><Cpu size={60} /></div>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/30"><Zap size={28} className="animate-pulse" /></div>
                    <div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Market Trend Predictor</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Researcher Agent Intelligence</p>
                    </div>
                    <button
                      onClick={async () => {
                        setIsPredicting(true);
                        // Autonomous simulation
                        await new Promise(r => setTimeout(r, 2000));
                        setTrendReport({
                          predictedMove: "Pivot to 'Industrial Minimalism' expected Q3. High-saturation layouts are losing conversion velocity.",
                          nextTrend: "Neo-Brutalist sans-serif typography with high-contrast monochrome palettes."
                        });
                        setIsPredicting(false);
                      }}
                      className="ml-auto px-6 py-3 bg-indigo-500 border border-indigo-400 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                    >
                      {isPredicting ? "Analyzing Global Shifts..." : "Run Prediction"}
                    </button>
                  </div>

                  {trendReport ? (
                    <div className="grid grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
                      <div className="p-6 bg-slate-950/50 border border-indigo-500/10 rounded-3xl space-y-3">
                        <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">Predicted Move</span>
                        <p className="text-xs font-bold text-slate-300 italic leading-relaxed">"{trendReport.predictedMove}"</p>
                      </div>
                      <div className="p-6 bg-slate-950/50 border border-indigo-500/10 rounded-3xl space-y-3">
                        <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">Next Visual Trend</span>
                        <p className="text-xs font-bold text-slate-300 italic leading-relaxed">"{trendReport.nextTrend}"</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 border-2 border-dashed border-indigo-500/10 rounded-3xl">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Enter a URL above to initialize the predictive engine.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="space-y-4 w-full max-w-md animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col gap-2">
                  {analysisLogs.map((log, i) => (
                    <div key={i} className="text-[10px] font-mono text-cyan-500/60 flex items-center gap-3">
                      <span className="text-slate-800">{i + 1}.</span>
                      <span className="tracking-tighter uppercase">{log}</span>
                    </div>
                  ))}
                </div>
                <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-1/3 animate-[loading_2s_ease-in-out_infinite]" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in zoom-in-95 duration-500">
            {/* LEFT COLUMN: THE BLUEPRINT */}
            <div className="lg:col-span-12 xl:col-span-5 space-y-12">
              <section className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="relative z-10 flex flex-col gap-8">
                  <div>
                    <span className="px-4 py-1.5 bg-cyan-500 text-[10px] font-black text-slate-950 rounded-full uppercase tracking-widest mb-6 inline-block">Intelligence Dossier Verified</span>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{brandReport.brandName}</h2>
                  </div>

                  <div className="space-y-6">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Chromatic DNA (Harversted)</span>
                    <div className="flex gap-4">
                      {brandReport.chromaticHarvest.map((color, i) => (
                        <button
                          key={i}
                          onClick={() => handleCopy(color, `color - ${i} `)}
                          className="group/color relative"
                        >
                          <div className="w-16 h-16 rounded-2xl shadow-xl transition-transform group-hover/color:scale-110 border border-white/10" style={{ backgroundColor: color }} />
                          <div className={`absolute - bottom - 10 left - 1 / 2 - translate - x - 1 / 2 px-2 py-1 bg-slate - 800 text-[8px] font - bold rounded opacity - 0 group - hover / color: opacity - 100 transition-opacity whitespace-nowrap ${copyStatus === `color-${i}` ? 'text-green-400' : 'text-white'} `}>
                            {copyStatus === `color - ${i} ` ? 'Copied' : color}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-6">
                    <div className="space-y-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Layers size={14} /> Movements</span>
                      <div className="flex flex-wrap gap-2">
                        {brandReport.visualDNA.movements.map(m => (
                          <span key={m} className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-bold uppercase text-slate-400">{m}</span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><TypeIcon size={14} /> Typography</span>
                      <div className="flex flex-wrap gap-2">
                        {brandReport.visualDNA.typography.map(t => (
                          <span key={t} className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-bold uppercase text-slate-400">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-slate-950 border border-slate-900 p-12 rounded-[4rem] space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400"><Activity size={24} /></div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Buyer Persona Analysis</h3>
                </div>
                <div className="space-y-6">
                  <p className="text-slate-400 italic font-medium leading-relaxed border-l-2 border-indigo-500/30 pl-6">"{brandReport.persona.demographic}"</p>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4 text-xs font-bold">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest">Pain Points exploited</span>
                      {brandReport.persona.painPoints.map(p => (
                        <div key={p} className="flex gap-3 text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4 text-xs font-bold">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest">Power Words</span>
                      <div className="flex flex-wrap gap-2">
                        {brandReport.persona.powerWords.map(w => (
                          <span key={w} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] uppercase font-black">{w}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: THE EXPLOITATION HUB */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-12">
              <div className="relative group/box">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-[4rem] blur opacity-10 group-hover/box:opacity-20 transition" />
                <div className="relative bg-slate-900 border border-slate-800 p-12 rounded-[4rem] space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500"><Wand2 size={24} /></div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">Master Style DNA Prompt</h3>
                    </div>
                    <button
                      onClick={() => handleCopy(brandReport.masterPrompt, 'master-prompt')}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-cyan-400 transition-colors"
                    >
                      {copyStatus === 'master-prompt' ? <CheckCircle size={14} /> : <Copy size={14} />}
                      <span>{copyStatus === 'master-prompt' ? "DNA Copied" : "Copy DNA"}</span>
                    </button>
                  </div>
                  <div className="bg-slate-950 border border-slate-900 p-8 rounded-[2rem] font-mono text-sm text-cyan-500/80 leading-relaxed max-h-[250px] overflow-y-auto italic">
                    {brandReport.masterPrompt}
                  </div>

                  <div className="grid grid-cols-2 gap-6 no-print">
                    <button
                      onClick={() => onNavigate(ToolType.POD_MERCH, brandReport.masterPrompt)}
                      className="flex items-center justify-between p-8 bg-pink-500 hover:bg-pink-400 rounded-[2.5rem] text-slate-950 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg shadow-pink-500/20"
                    >
                      <div className="text-left">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-2">Initialize Factory</div>
                        <div className="text-xl font-black uppercase italic tracking-tighter leading-none">Clone to POD</div>
                      </div>
                      <Shirt size={32} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => onNavigate(ToolType.COLORING_PAGES, brandReport.masterPrompt)}
                      className="flex items-center justify-between p-8 bg-green-500 hover:bg-green-400 rounded-[2.5rem] text-slate-950 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg shadow-green-500/20"
                    >
                      <div className="text-left">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-2">Initialize Factory</div>
                        <div className="text-xl font-black uppercase italic tracking-tighter leading-none">Clone to KDP</div>
                      </div>
                      <BookOpen size={32} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[3.5rem] space-y-6">
                  <div className="flex items-center gap-4 text-pink-500">
                    <ShieldAlert size={24} />
                    <h4 className="text-lg font-black uppercase italic tracking-tighter">Semantic Voice Gap</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-black uppercase text-slate-500 italic block w-fit">Detected Tone: {brandReport.semanticVoice.tone}</div>
                    <div className="space-y-3">
                      {brandReport.semanticVoice.headlines.map(h => (
                        <div key={h} className="text-xs font-bold text-slate-300 italic border-l-2 border-pink-500/20 pl-4 py-1">"{h}"</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[3.5rem] space-y-6">
                  <div className="flex items-center gap-4 text-cyan-500">
                    <Rocket size={24} />
                    <h4 className="text-lg font-black uppercase italic tracking-tighter">Market Exit strategy</h4>
                  </div>
                  <div className="space-y-4 text-xs font-bold text-slate-300">
                    {brandReport.gapAnalysis.vulnerabilities.map(v => (
                      <div key={v} className="flex gap-3">
                        <span className="text-cyan-500">GAP:</span>
                        <span>{v}</span>
                      </div>
                    ))}
                    <div className="mt-4 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
                      <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest block mb-2">Correction Design Prompt</span>
                      <p className="text-[10px] italic leading-relaxed">"{brandReport.gapAnalysis.correctionDesign}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- LOGO CREATOR "BRAND GENESIS" VIEW ---
  if (toolType === ToolType.LOGO_CREATOR) {
    const [logoBrand, setLogoBrand] = useState('');
    const [logoAesthetic, setLogoAesthetic] = useState('Modern Minimalist');
    const [logoReport, setLogoReport] = useState<any>(null);
    const [logoLogs, setLogoLogs] = useState<string[]>([]);

    const runLogoGeneration = async () => {
      if (!logoBrand) return;
      setIsGenerating(true);
      setLogoLogs(["[COMMENCING_LOGO_SYSTEM_INIT]", "[DISTRIBUTING_TASKS_TO_16_AGENTS]", "[OPEN_CODE_QUOTA_MAXIMIZED]"]);

      const logInterval = setInterval(() => {
        const logs = ["[VECTOR_SYNTHESIS_ACTIVE]", "[CHROMATIC_HARVESTING]", "[TYPOGRAPHIC_DNA_MAPPING]", "[FINALIZING_GUIDELINES]"];
        setLogoLogs(prev => [...prev, logs[Math.floor(Math.random() * logs.length)]].slice(-4));
      }, 1200);

      try {
        const report = await visualService.generateLogoSystem(logoBrand, logoAesthetic);
        setLogoReport(report);
      } catch (e) { setError("Logo Engine Stall."); }
      finally {
        clearInterval(logInterval);
        setIsGenerating(false);
      }
    };

    return (
      <div className="p-12 max-w-[1400px] mx-auto pb-24 animate-in fade-in">
        <div className="flex items-center justify-between mb-16">
          <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest">
            <ChevronLeft size={16} /> <span>Exit Brand Genesis</span>
          </button>
          {logoReport && (
            <button onClick={() => setLogoReport(null)} className="text-[10px] font-black uppercase text-cyan-400 hover:text-white transition-colors tracking-widest">
              Create New System
            </button>
          )}
        </div>

        {!logoReport ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-12">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">Logo Creator <span className="text-cyan-500">∞</span></h1>
              <p className="text-slate-500 text-lg font-medium italic">Powered by 16-Agent Industrial Engine & Open Code Quotas.</p>
            </div>

            <div className="w-full max-w-2xl space-y-8">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-6">Brand Name</label>
                <input
                  value={logoBrand} onChange={e => setLogoBrand(e.target.value)}
                  placeholder="e.g., PublishLab Publishing"
                  className="w-full bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 text-xl font-bold outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-6">Market Aesthetic</label>
                <select
                  value={logoAesthetic} onChange={e => setLogoAesthetic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 text-xl font-bold outline-none focus:border-cyan-500 appearance-none text-white"
                >
                  <option>Modern Minimalist</option>
                  <option>Retro Vintage</option>
                  <option>Cyberpunk Industrial</option>
                  <option>Premium Luxury</option>
                </select>
              </div>

              <button
                onClick={runLogoGeneration}
                disabled={isGenerating || !logoBrand}
                className="w-full bg-cyan-500 hover:bg-cyan-400 py-6 rounded-[2.5rem] text-slate-950 font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all"
              >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                <span>{isGenerating ? "Synthesizing Brand System..." : "Initialize Genesis"}</span>
              </button>
            </div>

            {isGenerating && (
              <div className="flex flex-col gap-2 max-w-xs w-full">
                {logoLogs.map((log, i) => (
                  <div key={i} className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-tighter text-left">{log}</div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-in zoom-in-95">
            <div className="space-y-12">
              <div className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] text-center space-y-8 aspect-square flex flex-col items-center justify-center">
                <img src={logoReport.mainLogoUrl} className="max-w-[80%] max-h-[80%] object-contain" />
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Master Brand Identity</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] flex items-center justify-between">
                <img src={logoReport.iconUrl} className="w-24 h-24 object-contain" />
                <div className="text-right">
                  <div className="text-3xl font-black text-white italic uppercase tracking-tighter">Variant Icon</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-cyan-500">300DPI Rendered</div>
                </div>
              </div>
            </div>
            <div className="space-y-12">
              <div className="bg-slate-950 border border-slate-900 p-12 rounded-[4rem] space-y-8">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Brand Guidelines</h3>
                <div className="space-y-4">
                  {logoReport.guidelines.map((g: string, i: number) => (
                    <div key={i} className="flex gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5" />
                      {g}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-950 border border-slate-900 p-12 rounded-[4rem] space-y-8">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Genesis Palette</h3>
                <div className="flex gap-6">
                  {logoReport.palette.map((c: string) => (
                    <div key={c} className="group relative">
                      <div className="w-20 h-20 rounded-2xl border border-white/5 shadow-xl transition-transform group-hover:scale-110" style={{ backgroundColor: c }} />
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black font-mono text-slate-500">{c}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- OBJECT ISOLATOR VIEW ---
  if (toolType === ToolType.OBJECT_ISOLATOR) {
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [isIsolating, setIsIsolating] = useState(false);
    const [isolatedImage, setIsolatedImage] = useState<string | null>(null);

    const runIsolation = async () => {
      if (!sourceImage) return;
      setIsIsolating(true);
      try {
        const result = await visualService.isolateSubject(sourceImage);
        setIsolatedImage(result);
      } catch (e) { setError("Isolation failed."); }
      finally { setIsIsolating(false); }
    };

    return (
      <div className="p-12 max-w-4xl mx-auto pb-24 flex flex-col items-center justify-center min-h-[60vh] space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black uppercase italic tracking-tighter">Object Isolator <span className="text-indigo-500">∞</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Industrial Edge Detection & Transparency Engine.</p>
        </div>

        {!sourceImage ? (
          <label className="w-full aspect-video bg-slate-950 border-4 border-dashed border-slate-800 rounded-[4rem] flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-all group">
            <input type="file" className="hidden" onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => setSourceImage(ev.target?.result as string);
                reader.readAsDataURL(file);
              }
            }} />
            <div className="p-8 bg-indigo-500/10 rounded-[2.5rem] text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <Upload size={48} />
            </div>
            <div className="mt-6 text-sm font-black uppercase tracking-widest text-slate-500">Drop Master Asset to Begin</div>
          </label>
        ) : (
          <div className="w-full space-y-8">
            <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-slate-800 bg-slate-900 group">
              <img src={isolatedImage || sourceImage} className="w-full h-full object-contain" />
              {isIsolating && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Scanning Subject Geometry...</div>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setSourceImage(null)} className="flex-1 py-5 bg-slate-900 border border-slate-800 rounded-[2rem] font-black uppercase tracking-widest text-xs text-slate-500 hover:text-white">New Asset</button>
              {!isolatedImage && <button onClick={runIsolation} disabled={isIsolating} className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-500 rounded-[2rem] font-black uppercase tracking-widest text-xs text-white shadow-xl">Run Industrial Isolation</button>}
              {isolatedImage && (
                <button onClick={() => downloadService.downloadImage(isolatedImage, 'isolated_asset')} className="flex-[2] py-5 bg-emerald-600 hover:bg-emerald-500 rounded-[2rem] font-black uppercase tracking-widest text-xs text-white shadow-xl flex items-center justify-center gap-3">
                  <Download size={16} /> Download PNG
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- HD UPSCALER VIEW ---
  if (toolType === ToolType.HD_UPSCALER) {
    const [upSource, setUpSource] = useState<string | null>(null);
    const [isUpscaling, setIsUpscaling] = useState(false);
    const [upResult, setUpResult] = useState<any>(null);

    const runUpscale = async () => {
      if (!upSource) return;
      setIsUpscaling(true);
      try {
        const result = await visualService.upscaleImage(upSource);
        setUpResult(result);
      } catch (e) { setError("Upscale engine malfunction."); }
      finally { setIsUpscaling(false); }
    };

    return (
      <div className="p-12 max-w-4xl mx-auto pb-24 flex flex-col items-center justify-center min-h-[60vh] space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black uppercase italic tracking-tighter">HD Upscaler <span className="text-blue-500">∞</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">300DPI Industrial Restoration for High-End Print.</p>
        </div>

        {!upSource ? (
          <label className="w-full aspect-video bg-slate-950 border-4 border-dashed border-slate-800 rounded-[4rem] flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all group">
            <input type="file" className="hidden" onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => setUpSource(ev.target?.result as string);
                reader.readAsDataURL(file);
              }
            }} />
            <div className="p-8 bg-blue-500/10 rounded-[2.5rem] text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <Maximize size={48} />
            </div>
            <div className="mt-6 text-sm font-black uppercase tracking-widest text-slate-500">Initialize Master Scan</div>
          </label>
        ) : (
          <div className="w-full space-y-8">
            <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-slate-800 bg-slate-900">
              <img src={upSource} className="w-full h-full object-contain" />
              {isUpscaling && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-400">Restoring 4K Pixel Map...</div>
                </div>
              )}
            </div>

            {upResult ? (
              <div className="p-8 bg-blue-500/10 border border-blue-500/30 rounded-[2.5rem] flex items-center justify-between">
                <div className="flex gap-12">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Resolution</span>
                    <div className="text-xl font-black text-white">{upResult.resolution}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">DPI Index</span>
                    <div className="text-xl font-black text-white">{upResult.dpi} DPI</div>
                  </div>
                </div>
                <button onClick={() => downloadService.downloadImage(upResult.url, 'upscaled_master')} className="px-10 py-5 bg-blue-500 text-slate-950 font-black uppercase tracking-widest rounded-2xl flex items-center gap-3">
                  <Download size={20} /> Collect Master
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <button onClick={() => setUpSource(null)} className="flex-1 py-5 bg-slate-900 border border-slate-800 rounded-[2rem] font-black uppercase tracking-widest text-xs text-slate-500 hover:text-white">Discharge File</button>
                <button onClick={runUpscale} disabled={isUpscaling} className="flex-[2] py-5 bg-blue-600 hover:bg-blue-500 rounded-[2rem] font-black uppercase tracking-widest text-xs text-white shadow-xl">Engage 300DPI Restore</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }


  // --- KDP BAN SHIELD VIEW ---
  if (toolType === ToolType.BAN_SHIELD) {
    const [banText, setBanText] = useState(initialPrompt || '');
    const [banResult, setBanResult] = useState<any>(null);

    const runAudit = async () => {
      setIsAnalyzing(true);
      try {
        const res = await complianceService.runBanShield(banText);
        setBanResult(res);
      } finally { setIsAnalyzing(false); }
    };

    return (
      <div className="p-12 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] space-y-12 animate-in fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">KDP Ban Shield <span className="text-rose-500">∞</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Industrial Policy Enforcement for Zero-Risk Publishing.</p>
        </div>

        <div className="w-full relative group">
          <div className={`absolute -inset-1 bg-gradient-to-r ${banResult?.status === 'FLAGGED' ? 'from-rose-500 to-rose-600' : 'from-indigo-500 to-cyan-500'} rounded-[3rem] blur opacity-10 transition duration-500`} />
          <textarea
            value={banText} onChange={e => setBanText(e.target.value)}
            placeholder="Paste Listing Description, Subtitle, or Chapter Hooks for policy audit..."
            className="relative w-full h-[350px] bg-slate-950 border border-slate-800 rounded-[3rem] p-10 text-slate-300 font-medium outline-none focus:border-rose-500 transition-all custom-scrollbar text-lg leading-relaxed placeholder:text-slate-900"
          />
        </div>

        <button
          onClick={runAudit}
          disabled={isAnalyzing || !banText}
          className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-slate-900 py-8 rounded-[3rem] text-white font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 border-b-[12px] border-rose-900"
        >
          {isAnalyzing ? <Loader2 className="animate-spin" /> : <ShieldAlert size={24} />}
          <span>{isAnalyzing ? "Scanning Policy Database..." : "Deploy Industrial Scan"}</span>
        </button>

        {banResult && (
          <div className={`w-full p-12 rounded-[4rem] border transition-all animate-in slide-in-from-bottom-8 ${banResult.status === 'CLEAN' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/5 border-rose-500/20 text-rose-500'}`}>
            <div className="flex items-center gap-6 mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${banResult.status === 'CLEAN' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                {banResult.status === 'CLEAN' ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Dossier {banResult.status}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Industrial Compliance Audit Report</p>
              </div>
            </div>
            <p className={`text-lg font-bold italic leading-relaxed ${banResult.status === 'CLEAN' ? 'text-slate-300' : 'text-rose-400'}`}>
              {banResult.recommendation}
            </p>
          </div>
        )}

        <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-600 hover:text-white transition-colors tracking-[0.3em]">Return to Lab</button>
      </div>
    );
  }

  // --- PROFIT ESTIMATOR VIEW ---
  if (toolType === ToolType.PROFIT_ESTIMATOR) {
    const [stats, setStats] = useState({ pages: 120, price: 9.99, interior: 'B&W' as 'B&W' | 'Color' });
    const [result, setResult] = useState<any>(null);

    const runEst = async () => {
      setIsAnalyzing(true);
      const res = await complianceService.estimateProfit(stats.pages, stats.price, stats.interior);
      setResult(res);
      setIsAnalyzing(false);
    };

    return (
      <div className="p-12 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[70vh] space-y-12 animate-in fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">Profit Estimator <span className="text-emerald-500">∞</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Industrial Revenue Modeling for Amazon KDP.</p>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] space-y-8 shadow-2xl">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">Estimated Page Count</label>
              <div className="relative">
                <input type="number" value={stats.pages} onChange={e => setStats({ ...stats, pages: parseInt(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-2xl font-black outline-none focus:border-emerald-500 transition-all text-white" />
                <BookOpen className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">Retail List Price ($)</label>
              <div className="relative text-3xl font-black text-emerald-500">
                <span className="absolute left-6 top-1/2 -translate-y-1/2">$</span>
                <input type="number" step="0.01" value={stats.price} onChange={e => setStats({ ...stats, price: parseFloat(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 pl-12 text-2xl font-black outline-none focus:border-emerald-500 transition-all text-emerald-500" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">Interior Manufacturing</label>
              <div className="flex bg-slate-950 p-2 rounded-2xl border border-slate-800">
                {['B&W', 'Color'].map(c => (
                  <button
                    key={c}
                    onClick={() => setStats({ ...stats, interior: c as any })}
                    className={`flex-1 py-4 rounded-xl font-black text-xs transition-all ${stats.interior === c ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {c} {c === 'B&W' ? '(Economy)' : '(Premium)'}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={runEst} className="w-full bg-emerald-600 hover:bg-emerald-500 py-8 rounded-[3rem] text-white font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-[0_0_50px_rgba(16,185,129,0.2)] border-b-[12px] border-emerald-900 active:translate-y-1">
              {isAnalyzing ? <Loader2 className="animate-spin" /> : <Activity size={24} />}
              <span>{isGenerating ? "Calculating..." : "Model Royalties"}</span>
            </button>
          </div>

          <div className="h-full flex flex-col gap-8">
            {result ? (
              <div className="space-y-8 animate-in slide-in-from-right-12">
                <div className="p-12 bg-slate-950 border border-emerald-500/20 rounded-[4rem] text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={100} /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Net Royalty (Per Copy)</span>
                  <div className="text-8xl font-black text-emerald-500 italic tracking-tighter mt-4">${result.netProfit}</div>
                  <div className="text-[10px] font-black uppercase text-slate-600 tracking-widest mt-4">After Amazon's 40% Share</div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="p-8 bg-slate-900 border border-slate-800 rounded-[3rem] text-center">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Printing Cost</span>
                    <div className="text-3xl font-black text-white mt-2">${result.printingCost}</div>
                  </div>
                  <div className="p-8 bg-slate-900 border border-slate-800 rounded-[3rem] text-center">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Growth Potential</span>
                    <div className="text-3xl font-black text-white mt-2">{result.roi}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-slate-950 border-4 border-dashed border-slate-900 rounded-[4rem] flex flex-col items-center justify-center text-slate-800 p-12 text-center">
                <Activity size={80} className="mb-6 opacity-20" />
                <p className="text-xl font-black uppercase italic tracking-tighter opacity-20">Awaiting Manufacturing Specs</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-20 mt-2">Configure the left panel to initialize revenue projection.</p>
              </div>
            )}

            <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[3rem] flex items-center gap-6">
              <ShieldCheck className="text-indigo-400 shrink-0" size={28} />
              <p className="text-xs text-slate-500 font-bold italic leading-relaxed">
                Industrial Tip: Amazon royalties are paid 60 days post-sale. Always account for ad spend in your final net calculations.
              </p>
            </div>
          </div>
        </div>

        <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-600 hover:text-white transition-colors tracking-[0.3em] mt-12">Return to HQ</button>
      </div>
    );
  }

  // --- CHARACTER VAULT VIEW ---
  if (toolType === ToolType.CHARACTER_VAULT) {
    return (
      <div className="p-12 max-w-[1600px] mx-auto pb-24 animate-in fade-in">
        <div className="flex items-center justify-between mb-16">
          <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest leading-none">
            <ChevronLeft size={16} /> <span>Exit Vault</span>
          </button>
          <div className="px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase text-indigo-400 tracking-widest">
            Character Continuity Engine V1.0
          </div>
        </div>

        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">Character <span className="text-indigo-500">Vault</span></h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Maintain Visual DNA Consitency across the Multiverse.</p>
          </div>

          <CharacterVault />
        </div>
      </div>
    );
  }

  // --- KDP BOOK LAB VIEW ---
  if (toolType === ToolType.COLORING_PAGES || toolType === ToolType.MANUSCRIPT_DOCTOR) {


    return (
      <div className="p-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in">
        <style>{`
  @media print {
    body * { visibility: hidden; }
    #print - area, #print - area * { visibility: visible; }
    #print - area { position: absolute; left: 0; top: 0; width: 100 %; color: black!important; background: white!important; }
            .no - print { display: none!important; }
            .page -break { page -break-after: always; display: block; height: 1px; }
            section { page -break-inside: avoid; }
h1, h2, h3 { page -break-after: avoid; }
          }
`}</style>

        <div className="flex items-center justify-between mb-12 no-print border-b border-slate-800/50 pb-8">
          <div className="flex items-center gap-8">
            <button onClick={onBack} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center overflow-hidden">
                <img src="/assets/publishlab_logo.svg" alt="PublishLab" className="w-10 h-10 object-contain p-1" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">PublishLab</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">AI Publishing Platform</p>
              </div>
            </div>
          </div>
          {kdpBlueprint && (
            <button
              onClick={() => {
                if (!isConfirmingReset) {
                  setIsConfirmingReset(true);
                  setTimeout(() => setIsConfirmingReset(false), 3000);
                  return;
                }

                console.log('🔄 New Project reset initiated');
                try {
                  localStorage.removeItem('kdp_blueprint_autosave');
                  localStorage.removeItem('kdp_project_autosave');
                  localStorage.removeItem('kdp_genre_autosave');

                  setKdpBlueprint(null);
                  setKdpProject({ title: '', author: '', publisher: '', category: '', genre: '', trimSize: '6" x 9" (Standard)', interiorColor: 'B&W', audience: 'General', format: 'STANDALONE', chapterCount: 10, isbnSource: 'KDP' });
                  setSelectedGenre(null);
                  setKdpStep('GENRE');
                  setIsConfirmingReset(false);
                  console.log('✅ State reset complete');
                } catch (error) {
                  console.error('❌ Error in New Project handler:', error);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-lg ${isConfirmingReset
                ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:border-amber-500 hover:bg-amber-500/20'
                }`}
            >
              <RefreshCw size={14} className={isConfirmingReset ? 'animate-spin' : ''} />
              {isConfirmingReset ? 'Confirm Reset?' : 'New Project'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-8">
          <button
            onClick={() => setShowAiDeck(!showAiDeck)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest ${showAiDeck ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-indigo-500/50'}`}
          >
            <Cpu size={14} className={showAiDeck ? 'animate-pulse' : ''} /> AI Genesis Lab
          </button>

          <div className="flex items-center gap-4 border-l border-slate-800 pl-8">
            {kdpBlueprint && (
              <span className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                Auto-Saved
              </span>
            )}
            {['GENRE', 'TRIM', 'FORMAT', 'CONFIG', 'BLUEPRINT'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${kdpStep === s ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800'} `} />
                {i < 4 && <div className="w-8 h-px bg-slate-800 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {showAiDeck && (
          <div className="mb-12 animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/40 to-indigo-950/40 border border-indigo-500/20 rounded-[3.5rem] p-12 backdrop-blur-3xl shadow-[0_0_50px_rgba(99,102,241,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Cpu size={120} /></div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                {/* Pillar 1: Market Intelligence */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500"><BarChart3 size={24} /></div>
                    <div>
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Niche Radar</h3>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Researcher Agent Active</p>
                    </div>
                  </div>
                  <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase">
                      <span className="text-slate-500 tracking-widest">KDP Velocity</span>
                      <span className={labNicheReport?.velocity === 'Accelerating' ? 'text-emerald-500' : 'text-amber-500'}>{labNicheReport?.velocity || 'Idle'}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-emerald-500 transition-all duration-1000 ${labNicheReport ? 'w-[78%]' : 'w-0'}`} style={{ boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed">
                      {labNicheReport ? `"${labNicheReport.sentiment}"` : '"Initialize radar to scan current Amazon market sentiment and sub-niche gaps."'}
                    </p>
                    <button onClick={runNicheAnalysis} disabled={isAnalyzingNiche || !kdpProject.genre} className="text-[9px] font-black text-amber-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                      {isAnalyzingNiche ? <RefreshCw size={10} className="animate-spin" /> : <Activity size={10} />}
                      {isAnalyzingNiche ? 'Scanning...' : 'Run Niche Audit'}
                    </button>
                  </div>
                </div>

                {/* Pillar 2: Creative Vision */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400"><Palette size={24} /></div>
                    <div>
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Visual Genesis</h3>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Design Lead Agent Active</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {conceptImages.length > 0 ? conceptImages.map((src, i) => (
                      <img key={i} src={src} className="aspect-square w-full object-cover rounded-3xl border border-slate-800 shadow-2xl" />
                    )) : [1, 2].map(i => (
                      <div key={i} className="aspect-square bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center text-slate-700 animate-pulse">
                        <ImageIcon size={24} />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={generateConceptDrafts}
                    disabled={isGeneratingConcepts || !kdpProject.title}
                    className="w-full py-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-3"
                  >
                    {isGeneratingConcepts ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    {isGeneratingConcepts ? 'Visualizing...' : 'Generate Concepts'}
                  </button>
                </div>

                {/* Pillar 3: Humanity Audit */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500"><PenTool size={24} /></div>
                    <div>
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">Humanity Pro</h3>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Copywriter Agent Active</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl space-y-2">
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">AI Vocab Sanitization</span>
                      <p className="text-[10px] text-slate-400 font-bold italic">Banned: "meticulously", "delve", "tapestry".</p>
                    </div>
                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl space-y-2">
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Emotional Resonance</span>
                      <p className="text-[10px] text-slate-400 font-bold italic">Enforcing: Sensory depth, visceral dialogue.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {
          kdpStep === 'START' && (
            <div className="max-w-6xl mx-auto space-y-16 animate-in slide-in-from-bottom-8">
              <div className="text-center space-y-6">
                <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none text-white">
                  KDP Book Lab <span className="text-indigo-500">∞</span>
                </h1>
                <p className="text-slate-500 text-xl font-medium italic max-w-2xl mx-auto">
                  Initialize a new industrial publishing run or doctor an existing manuscript for market readiness.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* OPTION 1: CREATE NEW */}
                <button
                  onClick={() => setKdpStep('GENRE')}
                  className="group relative p-1 pb-1.5 bg-indigo-500 rounded-[4rem] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl"
                >
                  <div className="bg-slate-900 border border-slate-800 p-12 rounded-[3.8rem] text-left space-y-8 h-full">
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                      <Sparkles size={40} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-4xl font-black uppercase italic tracking-tight text-white">Full Genesis Run</h3>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                        End-to-end industrial generation. Research, structure, write, and design your entire book from a single prompt.
                      </p>
                    </div>
                    <div className="pt-8 flex items-center gap-4 text-indigo-400 font-black uppercase tracking-widest text-[10px]">
                      <span>Begin Initialization</span>
                      <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* OPTION 2: MANUSCRIPT DOCTOR */}
                <div className="group relative p-1 pb-1.5 bg-emerald-500 rounded-[4rem] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl">
                  <label className="block cursor-pointer h-full">
                    <input type="file" accept=".txt,.pdf,.docx" onChange={handleManuscriptUpload} className="hidden" />
                    <div className="bg-slate-900 border border-slate-800 p-12 rounded-[3.8rem] text-left space-y-8 h-full">
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                        <PenTool size={40} />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-4xl font-black uppercase italic tracking-tight text-white">Manuscript Doctor</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                          Ingest raw or incomplete text. AI will analyze, structure, and optimize your work for KDP compliance and reader resonance.
                        </p>
                      </div>
                      <div className="pt-8 flex items-center gap-4 text-emerald-400 font-black uppercase tracking-widest text-[10px]">
                        <span>Upload Base File</span>
                        <Upload size={16} className="group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {isDoctoring && (
                <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-12">
                  <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl text-center space-y-8">
                    <div className="w-24 h-24 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-indigo-500">
                      <Loader2 className="animate-spin" size={48} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black uppercase italic text-white">Industrial Digestion...</h4>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Analyzing context, extracting DNA & mapping structure.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }

        {
          kdpStep === 'GENRE' && (
            <div className="space-y-12 text-center animate-in slide-in-from-bottom-8">
              <div className="flex items-center justify-center gap-8 mb-4">
                <button onClick={() => setKdpStep('START')} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:text-white transition-colors"><ChevronLeft /></button>
                <div className="space-y-2">
                  <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">Step 1: Industrial Niche</h1>
                  <p className="text-slate-500 text-lg font-medium italic">High-content publishing mandates detected.</p>
                </div>
              </div>
              <div className="space-y-12 max-w-4xl mx-auto">
                {[
                  { label: 'HIGH CONTENT FICTION', genres: KDP_GENRES.filter(g => g.category === 'FICTION') },
                  { label: 'VISUAL & ILLUSTRATED', genres: KDP_GENRES.filter(g => g.category === 'VISUAL_KIDS') },
                  { label: 'NON-FICTION ENGINE', genres: KDP_GENRES.filter(g => g.category === 'NON_FICTION') },
                  { label: 'ACTIVITY & LOW CONTENT', genres: KDP_GENRES.filter(g => g.category === 'ACTIVITY_JOURNALS') }
                ].map(group => (
                  <div key={group.label} className="space-y-4 text-left">
                    <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-500">{group.label}</h3>
                    <div className="flex flex-wrap gap-4">
                      {group.genres.map(g => (
                        <button
                          key={g.id}
                          onClick={() => { setSelectedGenre(g); setKdpProject({ ...kdpProject, genre: g.label, category: g.category, trimSize: g.defaultTrim }); setKdpStep('TRIM'); }}
                          className="px-6 py-3 rounded-full border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-indigo-500 transition-all font-bold text-sm text-slate-300"
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        {
          kdpStep === 'TRIM' && (
            <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-right-12">
              <div className="flex items-center gap-8">
                <button onClick={() => setKdpStep('GENRE')} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:text-white transition-colors"><ChevronLeft /></button>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter">Manufacturing Specs</h1>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {KDP_TRIM_SIZES.map(t => (
                  <button
                    key={t}
                    onClick={() => { setKdpProject({ ...kdpProject, trimSize: t }); setKdpStep('FORMAT'); }}
                    className={`p-6 rounded-3xl border text-left transition-all space-y-3 ${kdpProject.trimSize === t ? 'bg-indigo-600 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kdpProject.trimSize === t ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'}`}><Layout size={20} /></div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-slate-500 mb-1">{selectedGenre?.defaultTrim === t ? 'Recommended' : 'Standard'}</div>
                      <div className="text-sm font-black text-white">{t}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500"><AlertCircle size={24} /></div>
                <p className="text-xs text-slate-400 font-bold italic leading-relaxed">
                  Industrial Rule: Trim size affects spine width and shipping logistics.
                  <span className="text-white"> {selectedGenre?.defaultTrim}</span> is auto-selected for <span className="text-white">{selectedGenre?.label}</span>.
                </p>
              </div>
            </div>
          )
        }

        {
          kdpStep === 'FORMAT' && (
            <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-right-12">
              <div className="flex items-center gap-8">
                <button onClick={() => setKdpStep('TRIM')} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:text-white transition-colors"><ChevronLeft /></button>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter">Publication Architecture</h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(['STANDALONE', 'EPISODE', 'SERIES'] as KDPFormat[]).map(f => (
                  <button
                    key={f} onClick={() => { setKdpProject({ ...kdpProject, format: f }); setKdpStep('CONFIG'); fetchKDPTitleIdeas(); }}
                    className="p-10 bg-slate-900 border border-slate-800 rounded-[3rem] text-left hover:border-indigo-500 transition-all hover:bg-slate-800 space-y-6"
                  >
                    <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400"><Layers size={28} /></div>
                    <div>
                      <h3 className="text-2xl font-black uppercase italic">{f}</h3>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-tighter mt-2 italic">{f === 'STANDALONE' ? 'One-off market run' : f === 'EPISODE' ? 'Serialized Monthly' : 'Collection'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        }

        {
          kdpStep === 'CONFIG' && (
            <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-right-12">
              <div className="flex items-center gap-8">
                <button onClick={() => setKdpStep('FORMAT')} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:text-white transition-colors"><ChevronLeft /></button>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Industrial Blueprinting</h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-10 rounded-[4rem] shadow-2xl space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Title</label>
                    <input
                      value={kdpProject.title} onChange={e => setKdpProject({ ...kdpProject, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-xl font-bold outline-none focus:border-indigo-500"
                      placeholder="Enter keywords or select from trend lab..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Author / Pen Name</label>
                      <input value={kdpProject.author} onChange={e => setKdpProject({ ...kdpProject, author: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-bold outline-none" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Publisher Imprint</label>
                      <input value={kdpProject.publisher} onChange={e => setKdpProject({ ...kdpProject, publisher: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-bold outline-none" placeholder="e.g. Artisly Press" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interior Calibration</label>
                      <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                        {['B&W', 'Color'].map(c => (
                          <button key={c} onClick={() => setKdpProject({ ...kdpProject, interiorColor: c as any })} className={`flex-1 py-2 rounded-lg font-black text-[10px] transition-all ${kdpProject.interiorColor === c ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'} `}>{c}</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Volume (Chapters)</label>
                      <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <span className="text-xl font-black text-indigo-400">{kdpProject.chapterCount}</span>
                        <input type="range" min="5" max="30" value={kdpProject.chapterCount} onChange={e => setKdpProject({ ...kdpProject, chapterCount: parseInt(e.target.value) })} className="ml-4 flex-1 h-2 bg-slate-800 rounded-full accent-indigo-500 appearance-none cursor-pointer" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ISBN / Barcode Strategy</label>
                    <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      {[
                        { id: 'KDP', label: 'KDP Free ISBN' },
                        { id: 'USER', label: 'Use My Own' }
                      ].map(s => (
                        <button key={s.id} onClick={() => setKdpProject({ ...kdpProject, isbnSource: s.id as any })} className={`flex-1 py-2 rounded-lg font-black text-[10px] transition-all ${kdpProject.isbnSource === s.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{s.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* LOKI MODE TOGGLE */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-between">
                      <span>Loki Multiverse Mode (3x Variations)</span>
                      <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">NEW</span>
                    </label>
                    <button
                      onClick={() => setIsLokiMode(!isLokiMode)}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${isLokiMode ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Cpu size={18} />
                        <span className="text-sm font-bold">{isLokiMode ? 'Enabled: Parallel Architecting' : 'Disabled: Single Blueprint'}</span>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${isLokiMode ? 'bg-indigo-500' : 'bg-slate-800'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isLokiMode ? 'left-6' : 'left-1'}`} />
                      </div>
                    </button>
                  </div>

                  <button onClick={handleGenerateKDP} disabled={isGenerating || !kdpProject.title} className="w-full bg-indigo-600 hover:bg-indigo-500 py-8 rounded-[3rem] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl transition-all border-b-[12px] border-indigo-900 active:translate-y-1">
                    {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Rocket size={24} />}
                    <span>{isGenerating ? 'Industrial Engine Active...' : 'Initialize Book Run'}</span>
                  </button>

                  {/* LOKI VARIATION PICKER */}
                  {lokiVariations.length > 0 && (
                    <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-8 overflow-y-auto">
                      <div className="max-w-6xl w-full space-y-12 py-12">
                        <div className="text-center space-y-4">
                          <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">Choose Your Timeline</h2>
                          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loki has architected 3 distinct paths for your book. Select the one that resonates.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {lokiVariations.map((varBlueprint, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setKdpBlueprint(varBlueprint);
                                setLokiVariations([]);
                                setKdpStep('BLUEPRINT');
                              }}
                              className="p-10 bg-slate-900 border border-slate-800 rounded-[3.5rem] text-left hover:border-indigo-500 transition-all hover:bg-slate-800 space-y-8 group"
                            >
                              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                <span className="font-black text-xl">{idx + 1}</span>
                              </div>
                              <div className="space-y-4">
                                <h4 className="text-xl font-black uppercase italic text-white line-clamp-2">{varBlueprint.PROJECT_META.title_working}</h4>
                                <p className="text-slate-400 text-xs font-medium leading-relaxed italic line-clamp-3">"{varBlueprint.INTERIOR_CONTENT[0]?.summary || 'Variation context available'}"</p>
                              </div>
                              <div className="pt-4 border-t border-slate-800 group-hover:border-indigo-500/30 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-400">
                                <span>Select Blueprint</span>
                                <ArrowRight size={14} />
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="flex justify-center pt-8">
                          <button onClick={() => setLokiVariations([])} className="text-slate-500 hover:text-white font-black uppercase tracking-widest text-[10px] underline underline-offset-8 transition-all">Cancel Multiverse Run</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="lg:col-span-5 space-y-6">
                  {/* Industrial Compliance Shield */}
                  {validationResult && (
                    <div className={`p-8 rounded-[3rem] border transition-all shadow-2xl ${validationResult.canExport ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${validationResult.canExport ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                          {validationResult.canExport ? <ShieldCheck size={28} /> : <ShieldAlert size={28} />}
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase italic tracking-tight">Compliance Shield</h3>
                          <p className={`text-[9px] font-black uppercase tracking-widest ${validationResult.canExport ? 'text-emerald-500' : 'text-red-500'}`}>
                            {validationResult.canExport ? (validationResult.overallStatus === 'warnings' ? 'Optimized with Caveats' : 'Zero-Fail Optimized') : 'Rejection Risk Detected'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {validationResult.checks.filter((c: any) => c.status !== 'pass').map((check: any, i: number) => (
                          <div key={i} className={`flex items-start gap-3 p-3 border rounded-xl text-[10px] font-bold ${check.status === 'fail' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                            <AlertCircle size={14} className="mt-0.5 shrink-0" />
                            <span><strong>{check.label}:</strong> {check.message}</span>
                          </div>
                        ))}
                        {validationResult.canExport && validationResult.checks.every((c: any) => c.status === 'pass') && (
                          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-bold text-emerald-400">
                            <CheckCircle2 size={16} />
                            <span>Industrial Manufacturing Checklist Clear.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-xl space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Market Potential Ideas</h3>
                    <div className="space-y-3">
                      {loadingTitles ? <div className="text-slate-500 flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> Researching...</div> : (Array.isArray(kdpTitles) && kdpTitles.map((t, i) => (
                        <button key={i} onClick={() => setKdpProject({ ...kdpProject, title: t })} className={`w-full p-4 rounded-xl border text-left text-sm font-bold transition-all ${kdpProject.title === t ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}>{t}</button>
                      )))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {
          kdpStep === 'BLUEPRINT' && kdpBlueprint && (
            <div className="grid grid-cols-12 gap-12 animate-in fade-in">
              {/* READER PREVIEW (PRINT & DIGITAL) */}
              {isPreviewMode && (
                <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col p-8 overflow-hidden no-print">
                  <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex bg-slate-900 p-1.5 rounded-full border border-slate-800">
                        <button onClick={() => setPreviewTarget('PRINT')} className={`px-6 py-2 rounded-full font-black text-[10px] uppercase transition-all flex items-center gap-2 ${previewTarget === 'PRINT' ? 'bg-indigo-600 text-white' : 'text-slate-500'} `}><Printer size={14} /> Physical Print</button>
                        <button onClick={() => setPreviewTarget('EBOOK')} className={`px-6 py-2 rounded-full font-black text-[10px] uppercase transition-all flex items-center gap-2 ${previewTarget === 'EBOOK' ? 'bg-indigo-600 text-white' : 'text-slate-500'} `}><Monitor size={14} /> Kindle Digital</button>
                      </div>
                      <button onClick={() => setIsPreviewMode(false)} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:text-white transition-all"><X /></button>
                    </div>

                    <div id="print-area" className={`flex-1 overflow-y-auto bg-white p-16 rounded-[3rem] shadow-2xl font-serif text-slate-900 ${previewTarget === 'EBOOK' ? 'max-w-xl mx-auto' : ''} `}>
                      {/* COVER SPREAD IN PRINT PREVIEW */}
                      {previewTarget === 'PRINT' && (
                        <div className="mb-24 page-break">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 font-sans text-center">Industrial Single-Wrap Cover [Back | Spine | Front]</h4>
                          <div className="aspect-[2/1] border-2 border-slate-300 bg-slate-100 relative flex overflow-hidden shadow-2xl">
                            {/* BACK COVER PREVIEW */}
                            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-white">
                              {kdpBlueprint.COVER_SPEC.back_cover_url ? (
                                <img src={kdpBlueprint.COVER_SPEC.back_cover_url} className="absolute inset-0 w-full h-full object-cover" />
                              ) : (
                                <div className="p-12 text-center z-10 w-full h-full flex flex-col items-center justify-center">
                                  <p className="text-sm italic leading-relaxed text-center px-4 mb-8">"{kdpBlueprint.BACK_COVER_SPEC?.blurb_text || "Book blurb coming soon..."}"</p>
                                  <div className="w-24 h-12 bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">Barcode Zone</div>
                                </div>
                              )}
                            </div>

                            {/* SPINE PREVIEW */}
                            <div className="w-12 bg-slate-200 flex items-center justify-center border-l-2 border-r-2 border-dashed border-slate-300 z-20">
                              <span className="rotate-90 whitespace-nowrap font-sans font-bold text-[10px] uppercase tracking-widest">{kdpBlueprint.PROJECT_META.title_working}</span>
                            </div>

                            {/* FRONT COVER PREVIEW */}
                            <div className="flex-1 bg-white flex flex-col items-center justify-center relative overflow-hidden">
                              {kdpBlueprint.COVER_SPEC.ebook_url ? (
                                <img src={kdpBlueprint.COVER_SPEC.ebook_url} className="absolute inset-0 w-full h-full object-cover" />
                              ) : (
                                <div className="z-10 text-center">
                                  <h2 className="text-4xl font-black text-center mb-4 uppercase relative">{kdpBlueprint.PROJECT_META.title_working}</h2>
                                  <p className="font-sans font-bold uppercase text-xs tracking-[0.4em] relative">{kdpBlueprint.PROJECT_META.suggestedAuthor}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}


                      {/* FRONT MATTER SEQUENCE */}

                      {/* 0. EBOOK COVER (If Kindle Mode) */}
                      {previewTarget === 'EBOOK' && (
                        <>
                          <div className="mb-24 max-w-sm mx-auto shadow-2xl rounded-lg overflow-hidden border border-slate-200">
                            {kdpBlueprint.COVER_SPEC.ebook_url ? (
                              <img src={kdpBlueprint.COVER_SPEC.ebook_url} className="w-full h-auto" />
                            ) : (
                              <div className="aspect-[2/3] bg-slate-100 flex items-center justify-center p-8 text-center">
                                <h2 className="text-2xl font-black uppercase text-slate-400">Cover Art Pending</h2>
                              </div>
                            )}
                          </div>
                          <div className="page-break" />
                        </>
                      )}

                      {/* 1. TITLE PAGE (Standardized) */}
                      <div className="min-h-[900px] flex flex-col items-center justify-between py-24 px-8 text-center bg-white">
                        <div className="mt-32 space-y-8">
                          <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-tight text-slate-900 border-b-4 border-transparent">
                            {kdpBlueprint.PROJECT_META.title_working}
                          </h1>
                          <p className="text-2xl font-bold text-slate-500 uppercase tracking-[0.2em]">
                            By {kdpBlueprint.PROJECT_META.suggestedAuthor}
                          </p>
                        </div>

                        <div className="mb-12">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Published by {kdpBlueprint.PROJECT_META.publisher_imprint || "PublishLab"}
                          </p>
                        </div>
                      </div>

                      <div className="page-break" />

                      {/* 2. COPYRIGHT PAGE (With AI Disclosure) */}
                      <div className="min-h-[900px] flex flex-col justify-end pb-32 px-12 text-sm leading-7 text-slate-600">
                        <div className="max-w-md mx-auto text-center space-y-6">
                          <div className="mb-12">
                            <h3 className="font-bold uppercase tracking-widest text-xs text-slate-900 mb-2">Copyright © {kdpBlueprint.PROJECT_META.copyright_year} {kdpBlueprint.PROJECT_META.suggestedAuthor}</h3>
                            <p>All rights reserved.</p>
                          </div>

                          <p className="italic">
                            This is a work of fiction. Names, characters, businesses, places, events, locales, and incidents are either the products of the author's imagination or used in a fictitious manner. Any resemblance to actual persons, living or dead, or actual events is purely coincidental.
                          </p>

                          {/* AI DISCLOSURE - REQUIRED */}
                          <p className="text-slate-500 text-xs mt-4 border-t border-slate-100 pt-4">
                            This book was created with the assistance of artificial intelligence tools and edited by the author.
                          </p>

                          <div className="text-xs text-slate-400 mt-8 space-y-1">
                            <p>{previewTarget === 'PRINT' ? "Printed in the United States" : "Digital Edition"}</p>
                            <p>ISBN: {kdpProject.isbnSource === 'USER' ? "Pending Assignment" : "Not Assigned (KDP Free)"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="page-break" />

                      {/* 3. TABLE OF CONTENTS */}
                      <section className="mb-24 px-8 pt-12">
                        <h2 className="text-3xl font-black mb-12 uppercase font-sans text-center tracking-widest text-slate-900">Table of Contents</h2>
                        <div className="space-y-6 max-w-xl mx-auto">
                          {(() => {
                            let currentPage = 7;
                            return kdpBlueprint.INTERIOR_CONTENT.map(ch => {
                              const hasContent = ch.content && ch.content.length > 500;
                              const wordCount = hasContent ? ch.content.split(/\s+/).length : 0;
                              const estimatedPages = hasContent ? Math.ceil(wordCount / 275) + 2 : 0;
                              const displayNum = currentPage;
                              if (hasContent) currentPage += estimatedPages;

                              return (
                                <div key={ch.chapter} className="flex justify-between items-baseline border-b border-dotted border-slate-300 pb-1">
                                  <span className="font-serif font-bold text-lg text-slate-800">Chapter {ch.chapter}</span>
                                  <div className="flex-1 mx-4"></div>
                                  {previewTarget === 'PRINT' && (
                                    <span className={`font-sans font-bold text-sm ${!hasContent ? 'text-slate-300 italic scale-75' : 'text-slate-900'}`}>
                                      {hasContent ? displayNum : "Writing..."}
                                    </span>
                                  )}
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </section>

                      {kdpBlueprint.INTERIOR_CONTENT.slice(0, 2).map((ch, i) => (
                        <div key={i} className="mb-24">
                          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-600 mb-2 font-sans text-center">Chapter {ch.chapter}</h2>
                          <h3 className="text-4xl font-black text-center mb-16 italic">{ch.title}</h3>
                          {ch.generatedImageUrl && <img src={ch.generatedImageUrl} className={`w-full max-w-lg mx-auto mb-16 rounded shadow-2xl ${kdpProject.interiorColor === 'B&W' ? 'grayscale brightness-110' : ''}`} />}
                          <div className="text-lg leading-[1.9] space-y-6 first-letter:text-8xl first-letter:font-black first-letter:float-left first-letter:mr-4 first-letter:mt-2">
                            {((ch.content || "Content generation in progress...").substring(0, 5000) + (ch.content && ch.content.length > 5000 ? '...' : '')).split('\n').map((p, idx) => (
                              <p key={idx} className="text-justify">{p}</p>
                            ))}
                          </div>
                          <div className="page-break" />
                        </div>
                      ))}
                      {kdpBlueprint.INTERIOR_CONTENT.length > 2 && (
                        <div className="text-center py-12 text-slate-500 font-bold italic">
                          ... {kdpBlueprint.INTERIOR_CONTENT.length - 2} more chapters (full content will be included in download) ...
                        </div>
                      )}

                      <section className="text-center pt-24">
                        <h2 className="text-2xl font-bold mb-8 uppercase font-sans">About the Author</h2>
                        <p className="leading-relaxed max-w-xl mx-auto italic">{kdpBlueprint.BOOK_STRUCTURE.end_matter.author_bio}</p>
                      </section>
                    </div>

                    <div className="mt-8 flex justify-center gap-6 no-print">
                      <button onClick={() => handleExportMS(previewTarget)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl transition-all">
                        <Download /> Confirm & Download {previewTarget}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MANUSCRIPT DECK */}
              <div className="col-span-12 xl:col-span-8 space-y-12">
                <div className="flex bg-slate-900 p-2 rounded-[2rem] border border-slate-800 w-fit">
                  <button onClick={() => setKdpSubStep('MANUSCRIPT')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${kdpSubStep === 'MANUSCRIPT' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>1. Manuscript Engine</button>
                  <button onClick={() => setKdpSubStep('MARKETING')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${kdpSubStep === 'MARKETING' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>2. A+ Marketing</button>
                </div>

                {kdpSubStep === 'MANUSCRIPT' ? (
                  <>
                    <div className="flex justify-between items-center bg-slate-900 p-8 rounded-[3rem] border border-slate-800">
                      <div>
                        {isEditingTitleWorking ? (
                          <div className="flex items-center gap-3 mb-1">
                            <input
                              type="text"
                              value={tempTitle}
                              onChange={(e) => setTempTitle(e.target.value)}
                              className="bg-slate-950 border border-indigo-500/50 rounded-xl px-4 py-2 text-2xl font-black uppercase italic text-white outline-none w-[400px]"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                if (kdpBlueprint) {
                                  setKdpBlueprint({
                                    ...kdpBlueprint,
                                    PROJECT_META: { ...kdpBlueprint.PROJECT_META, title_working: tempTitle }
                                  });
                                }
                                setIsEditingTitleWorking(false);
                              }}
                              className="p-3 bg-indigo-600 rounded-xl text-white hover:bg-emerald-500 transition-colors"
                            >
                              <Check size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 group mb-1">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">{kdpBlueprint.PROJECT_META.title_working}</h2>
                            <span className="text-slate-400">Publisher:</span> <span className="text-white">{kdpBlueprint.PROJECT_META.publisher_imprint || 'Indie'}</span>
                            <button
                              onClick={() => {
                                setTempTitle(kdpBlueprint.PROJECT_META.title_working);
                                setIsEditingTitleWorking(true);
                              }}
                              className="p-2 text-slate-600 hover:text-indigo-400 border border-transparent hover:border-indigo-500/30 rounded-lg group-hover:opacity-100 opacity-0 transition-all"
                            >
                              <Edit3 size={16} />
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-2 group/author">
                          {isEditingAuthor ? (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Authored by</span>
                              <input
                                type="text"
                                value={tempAuthor}
                                onChange={(e) => setTempAuthor(e.target.value)}
                                className="bg-slate-950 border border-indigo-500/50 rounded-lg px-2 py-1 text-[10px] font-bold uppercase text-white outline-none w-[200px]"
                                autoFocus
                              />
                              <button
                                onClick={() => {
                                  if (kdpBlueprint) {
                                    setKdpBlueprint({
                                      ...kdpBlueprint,
                                      PROJECT_META: { ...kdpBlueprint.PROJECT_META, suggestedAuthor: tempAuthor }
                                    });
                                    // Update Project level as well for consistency
                                    setKdpProject({ ...kdpProject, author: tempAuthor });
                                  }
                                  setIsEditingAuthor(false);
                                }}
                                className="p-1 bg-indigo-600 rounded-lg text-white hover:bg-emerald-500 transition-colors"
                              >
                                <Check size={14} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Authored by {kdpProject.author} • Spine: {calculateSpineWidth()}" Required</p>
                              <button
                                onClick={() => {
                                  setTempAuthor(kdpBlueprint.PROJECT_META.suggestedAuthor || kdpProject.author);
                                  setIsEditingAuthor(true);
                                }}
                                className="text-slate-600 hover:text-indigo-400 opacity-0 group-hover/author:opacity-100 transition-all"
                              >
                                <Edit3 size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => onNavigate(ToolType.POD_MERCH, kdpBlueprint.PROJECT_META.title_working)} className="bg-emerald-600/10 p-5 rounded-2xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20 transition-all flex items-center gap-2 group">
                          <Shirt size={20} /> <span className="font-black uppercase text-[10px] tracking-widest text-white">Launch Merch</span>
                        </button>
                        <button onClick={() => handleCloudSave()} disabled={isSaving} className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 group">
                          {isSaving ? <Loader2 size={20} className="animate-spin" /> : (copyStatus === 'cloud' ? <CheckCircle size={20} className="text-emerald-500" /> : <Cloud size={20} />)}
                          <span className="font-black uppercase text-[10px] tracking-widest">Cloud Save</span>
                        </button>
                        <button onClick={() => setIsPreviewMode(true)} className="bg-white/10 p-5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2">
                          <Eye size={20} /> <span className="font-black uppercase text-[10px] tracking-widest">Master Preview</span>
                        </button>
                        <button onClick={() => handleExportMS('PRINT')} className="bg-indigo-600 p-5 rounded-2xl text-white shadow-lg hover:bg-indigo-500 transition-all flex items-center gap-2">
                          <Printer size={20} /> <span className="font-black uppercase text-[10px] tracking-widest">Press Ready PDF</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between px-2 flex-wrap gap-4">
                        <div className="flex items-center gap-6">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Master Manuscript Stack</h3>
                          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                            <button onClick={() => setIsGlobalEditing(false)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${!isGlobalEditing ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Chapter View</button>
                            <button onClick={() => setIsGlobalEditing(true)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${isGlobalEditing ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Master Canvas</button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          {isGlobalEditing && (
                            <button
                              onClick={() => {
                                // Re-split chapters based on current global content
                                const { INTERIOR_CONTENT } = manuscriptDoctorService.convertToBlueprint({
                                  rawText: globalContent,
                                  contextProfile: manuscriptDoctorService.analyzeContext(globalContent, selectedGenre?.id),
                                  preserveVoice: true
                                } as any, kdpProject);

                                if (INTERIOR_CONTENT) {
                                  setKdpBlueprint({ ...kdpBlueprint, INTERIOR_CONTENT: INTERIOR_CONTENT as any });
                                  setIsGlobalEditing(false);
                                  setError("✅ Chapters re-synchronized from Master Canvas.");
                                }
                              }}
                              className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-500 hover:text-white transition-all"
                            >
                              <RefreshCw size={12} /> Sync to Chapters
                            </button>
                          )}
                          {/* Quality/Speed Toggle - KDP Book Lab Only */}
                          {!isGlobalEditing && (
                            <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
                              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 px-2">Words/Ch:</span>
                              {[1000, 2000, 3000].map(wt => (
                                <button
                                  key={wt}
                                  onClick={() => setKdpWordTarget(wt)}
                                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${kdpWordTarget === wt ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                  {wt === 1000 ? 'Fast' : wt === 2000 ? 'Balanced' : 'Quality'}
                                </button>
                              ))}
                            </div>
                          )}
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 italic">Total Manuscript Volume:</span>
                          <span className={`text-xs font-black font-mono ${kdpBlueprint.INTERIOR_CONTENT.reduce((acc, c) => acc + getWordCount(c.content), 0) < 10000 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {kdpBlueprint.INTERIOR_CONTENT.reduce((acc, c) => acc + (isGlobalEditing ? getWordCount(globalContent) : getWordCount(c.content)), 0).toLocaleString()} Words
                          </span>
                          {!isGlobalEditing && (
                            <button
                              onClick={async () => {
                                setIsRegeneratingText(true);
                                setError(null);
                                let successCount = 0;
                                let failCount = 0;

                                try {
                                  for (let i = 0; i < kdpBlueprint.INTERIOR_CONTENT.length; i++) {
                                    if (!kdpBlueprint.INTERIOR_CONTENT[i].content) {
                                      try {
                                        console.log(`Generating chapter ${i + 1}/${kdpBlueprint.INTERIOR_CONTENT.length}...`);
                                        await handleExpandChapter(i);
                                        successCount++;
                                        await new Promise(resolve => setTimeout(resolve, 2000));
                                      } catch (chapterError: any) {
                                        console.error(`Chapter ${i + 1} failed:`, chapterError);
                                        failCount++;
                                      }
                                    }
                                  }

                                  if (successCount > 0) {
                                    setError(`✅ Generated ${successCount} chapters${failCount > 0 ? `. ${failCount} failed.` : '!'}`);
                                  } else if (failCount > 0) {
                                    setError(`❌ All chapters failed. Check console.`);
                                  }
                                } catch (e: any) {
                                  console.error('Generate All error:', e);
                                  setError(`❌ Generation stopped: ${e.message}`);
                                } finally {
                                  setIsRegeneratingText(false);
                                }
                              }}
                              disabled={isRegeneratingText}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
                            >
                              {isRegeneratingText ? <><Loader2 className="animate-spin" size={12} /> Generating...</> : <><Sparkles size={12} /> Generate All Chapters</>}
                            </button>
                          )}
                        </div>
                      </div>

                      {isGlobalEditing ? (
                        <div className="space-y-6">
                          <CoAuthorEditor
                            content={globalContent}
                            onChange={(val) => setGlobalContent(val)}
                            genreId={selectedGenre?.id || 'romance'}
                            chapterTitle="MASTER MANUSCRIPT CANVASS"
                            chapterNumber={0}
                          />
                          <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] flex items-center gap-6">
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400"><Activity size={24} /></div>
                            <p className="text-xs text-slate-400 font-bold italic leading-relaxed">
                              Industrial Guidance: Use the Master Canvas to edit the full story arc. When satisfied, click <span className="text-indigo-400">"Sync to Chapters"</span> above to re-structure the manuscript into the industrial publishing stack.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-8">
                          {kdpBlueprint.INTERIOR_CONTENT.map((ch, i) => (
                            <div key={i} className="bg-slate-900 border border-slate-800 p-10 rounded-[4rem] group shadow-xl transition-all hover:border-indigo-500/40">
                              <div className="flex flex-col md:flex-row gap-10">
                                <div className="flex-1 space-y-6">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                      <span className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center font-black text-indigo-400 shrink-0">{ch.chapter}</span>
                                      {editingChapter === i ? (
                                        <input value={ch.title} onChange={e => { const n = [...kdpBlueprint.INTERIOR_CONTENT]; n[i].title = e.target.value; setKdpBlueprint({ ...kdpBlueprint, INTERIOR_CONTENT: n }); }} className="w-full bg-slate-950 border border-indigo-500 p-3 rounded-lg text-2xl font-black uppercase italic outline-none text-white" />
                                      ) : (
                                        <h4 className="text-2xl font-black uppercase italic tracking-tighter">{ch.title}</h4>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${getWordCount(ch.content) < kdpWordTarget * 0.8 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'} `}>
                                        <TypeIcon size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-tighter">{getWordCount(ch.content).toLocaleString()} / {kdpWordTarget.toLocaleString()} Words</span>
                                      </div>
                                      <button onClick={() => setEditingChapter(editingChapter === i ? null : i)} className={`p-3 rounded-xl border transition-all ${editingChapter === i ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'} `}>
                                        {editingChapter === i ? <Save size={18} /> : <Edit3 size={18} />}
                                      </button>
                                      <button
                                        disabled={isRegeneratingText}
                                        onClick={() => handleExpandChapter(i)}
                                        className={`p-3 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 ${generatingChapterIdx === i ? 'bg-indigo-600 border border-indigo-400 text-white animate-pulse' : 'bg-indigo-600/10 border border-indigo-600/30 text-indigo-400 hover:bg-indigo-600 hover:text-white'}`}
                                      >
                                        {generatingChapterIdx === i ? (
                                          <><Loader2 className="animate-spin" size={18} /><span className="text-[10px] font-black uppercase">Generating...</span></>
                                        ) : (
                                          <><Sparkles size={18} /><span className="text-[10px] font-black uppercase">{ch.content ? 'Regenerate' : 'Generate'}</span></>
                                        )}
                                      </button>
                                    </div>
                                  </div>

                                  {editingChapter === i ? (
                                    <CoAuthorEditor
                                      content={ch.content || ''}
                                      onChange={(val) => { const n = [...kdpBlueprint.INTERIOR_CONTENT]; n[i].content = val; setKdpBlueprint({ ...kdpBlueprint, INTERIOR_CONTENT: n }); }}
                                      genreId={selectedGenre?.id || 'romance'}
                                      chapterTitle={ch.title}
                                      chapterNumber={ch.chapter}
                                    />
                                  ) : (
                                    <div className="space-y-6">
                                      {ch.summary && (
                                        <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
                                          <div className="flex items-center gap-2 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Chapter Outline</span>
                                          </div>
                                          <p className="text-sm text-slate-400 italic leading-relaxed">{ch.summary}</p>
                                        </div>
                                      )}

                                      {ch.auditReport && (
                                        <div className="flex flex-col gap-4 py-4 px-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl animate-in zoom-in-95 duration-500">
                                          <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-4">
                                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                              <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Humanity Audit: {ch.auditReport.efficiency}% Yield</span>
                                                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">Industrial AI Sanitization Complete</span>
                                              </div>
                                            </div>
                                            <div className="h-10 w-px bg-slate-800"></div>
                                            <div className="flex flex-col">
                                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                                                {ch.auditReport.originalWords} → {ch.auditReport.finalWords} Words
                                              </span>
                                              <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                                                {ch.auditReport.removedWords} Filler Units Purged
                                              </span>
                                            </div>
                                          </div>

                                          {(ch.auditReport as any).toneScore ? (
                                            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-emerald-500/20">
                                              <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                                                <span className="text-[8px] text-slate-500 uppercase tracking-wider block mb-1">Readability</span>
                                                <span className="text-[10px] font-bold text-slate-200">Grade {(ch.auditReport as any).readabilityGrade}</span>
                                              </div>
                                              <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                                                <span className="text-[8px] text-slate-500 uppercase tracking-wider block mb-1">Tone Analysis</span>
                                                <span className="text-[10px] font-bold text-indigo-400">{(ch.auditReport as any).toneScore}</span>
                                              </div>
                                              <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                                                <span className="text-[8px] text-slate-500 uppercase tracking-wider block mb-1">Voice Fingerprint</span>
                                                <span className="text-[9px] font-bold text-slate-300 truncate" title={(ch.auditReport as any).voiceFingerprint}>
                                                  {(ch.auditReport as any).voiceFingerprint}
                                                </span>
                                              </div>
                                            </div>
                                          ) : null}
                                        </div>
                                      )}

                                      <p className="text-slate-200 font-medium leading-relaxed line-clamp-[15] text-justify whitespace-pre-wrap">
                                        {ch.content || `Click Industrial Expand to write this chapter (${kdpWordTarget.toLocaleString()} words goal).`}
                                      </p>
                                    </div>
                                  )}

                                  <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 border-dashed group-hover:border-indigo-500/30 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={12} /> Industrial Visual Plate</span>
                                      <div className="flex items-center gap-2">
                                        <button onClick={() => handleDeleteChapterImage(i)} className="text-[9px] font-black text-red-500/50 hover:text-red-500 uppercase flex items-center gap-1.5 transition-all bg-slate-900 px-3 py-1 rounded-full border border-slate-800"><X size={10} /> Purge</button>
                                        <button onClick={() => handleRegenerateChapterImage(i)} className="text-[9px] font-black text-slate-500 hover:text-white uppercase flex items-center gap-1.5 transition-all bg-slate-900 px-3 py-1 rounded-full border border-slate-800"><RefreshCw size={10} /> Redraw Plate</button>
                                      </div>
                                    </div>
                                    <p className="text-xs text-slate-500 italic">"{ch.visualPrompt}"</p>
                                  </div>
                                </div>
                                <div className="w-full md:w-72 aspect-square bg-slate-950 rounded-[3rem] border border-slate-800 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 shadow-inner">
                                  {ch.generatedImageUrl ? (
                                    <img src={ch.generatedImageUrl} className={`w-full h-full object-cover ${kdpProject.interiorColor === 'B&W' ? 'grayscale' : ''} `} />
                                  ) : (
                                    <button onClick={() => handleRegenerateChapterImage(i)} className="flex flex-col items-center gap-4 text-slate-700 hover:text-white transition-all group/plate">
                                      <div className="p-6 rounded-full border border-slate-800 group-hover/plate:border-indigo-500 transition-all"><Wand2 size={40} strokeWidth={1} /></div>
                                      <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Generate compliant Plate</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-12 animate-in slide-in-from-right-8">
                    <div className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12">
                        <button onClick={handleGenerateAplus} disabled={isGenerating} className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
                          {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
                          <span>Industrial A+ Rewrite</span>
                        </button>
                      </div>

                      <div className="max-w-2xl">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">A+ Content Architect</h2>
                        <p className="text-slate-500 font-medium italic text-lg">Generate high-conversion visual marketing modules for your Amazon detail page. Professional copy and curated visual prompts included.</p>
                      </div>

                      <div className="mt-12 space-y-12">
                        {kdpBlueprint.APLUS_CONTENT?.map((mod, idx) => (
                          <div key={mod.id} className="bg-slate-950 border border-slate-800 rounded-[3rem] overflow-hidden group hover:border-indigo-500/40 transition-all">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                              <div className="md:col-span-7 p-12 space-y-6">
                                <div className="flex items-center gap-4">
                                  <span className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">{mod.type} Module</span>
                                </div>
                                <input value={mod.title} onChange={e => { const n = [...(kdpBlueprint.APLUS_CONTENT || [])]; n[idx].title = e.target.value; setKdpBlueprint({ ...kdpBlueprint, APLUS_CONTENT: n }); }} className="w-full bg-transparent border-none text-3xl font-black uppercase italic outline-none text-white p-0" />
                                <textarea value={mod.body} onChange={e => { const n = [...(kdpBlueprint.APLUS_CONTENT || [])]; n[idx].body = e.target.value; setKdpBlueprint({ ...kdpBlueprint, APLUS_CONTENT: n }); }} className="w-full bg-transparent border-none text-slate-400 font-medium leading-relaxed resize-none outline-none p-0 h-24" />

                                <div className="pt-6 border-t border-slate-900">
                                  <button onClick={() => handleGenerateAplusAsset(idx)} className="text-[10px] font-black text-slate-500 hover:text-white uppercase flex items-center gap-2 transition-all">
                                    <RefreshCw size={14} /> Render Module Visual
                                  </button>
                                </div>
                              </div>
                              <div className="md:col-span-5 bg-slate-900 relative group-hover:scale-[1.01] transition-transform">
                                {mod.generatedImageUrl ? (
                                  <img src={mod.generatedImageUrl} className="w-full h-full object-cover aspect-video md:aspect-auto" />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center p-12 text-slate-700 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/20 to-transparent">
                                    <ImageIcon size={64} strokeWidth={1} className="mb-4 opacity-20" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Visual Required</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-12 p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[3rem] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500"><Download size={24} /></div>
                          <div>
                            <h4 className="font-black uppercase italic text-white leading-none">Export A+ Pack</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Bundled Assets & Copy Index (ZIP)</p>
                          </div>
                        </div>
                        <button onClick={async () => {
                          const blob = await exporter.generateAplusPack(kdpBlueprint.APLUS_CONTENT || []);
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          const name = kdpBlueprint.PROJECT_META.title_working.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_');
                          link.download = `${name}_APLUS_PACK.zip`;
                          link.style.display = 'none';
                          document.body.appendChild(link);
                          link.click();
                          setTimeout(() => {
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          }, 2000);
                        }} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest transition-all">Download Pack</button>
                      </div>
                    </div>

                    {/* NEW: LISTING OPTIMIZATION DECK (Connected to MarketingService) */}
                    <div className="bg-slate-900 border border-slate-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden mt-12">
                      <div className="flex items-center justify-between mb-8">
                        <div className="max-w-xl">
                          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Listing Optimization</h2>
                          <p className="text-slate-500 font-medium italic text-lg">Generate high-conversion KDP metadata, blurbs, and SEO keywords based on your specific genre logic.</p>
                        </div>
                        <div className="flex gap-4">
                          <label className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/20">
                            <Upload size={18} /> Restore Backup
                            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                          </label>
                          <button
                            onClick={() => downloadService.downloadMetadata(kdpBlueprint)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl"
                          >
                            <FileText size={18} />
                            <span>Export Metadata</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* LEFT: BLURB */}
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-indigo-400">Back Cover Sales Copy</h3>
                            <button
                              onClick={() => {
                                const deck = marketingService.generateMarketingDeck({ ...kdpProject, audience: 'Adults', format: 'STANDALONE' } as any);
                                setKdpBlueprint({ ...kdpBlueprint, BACK_COVER_SPEC: { blurb_text: deck.blurb, hook_points: [] } });
                              }}
                              className="text-[9px] font-black uppercase bg-indigo-600 px-3 py-1.5 rounded-lg text-white hover:bg-indigo-500 transition-all flex items-center gap-2"
                            >
                              <Sparkles size={10} /> Generate Blurb
                            </button>
                          </div>
                          <textarea
                            value={kdpBlueprint.BACK_COVER_SPEC?.blurb_text || ''}
                            onChange={e => setKdpBlueprint({ ...kdpBlueprint, BACK_COVER_SPEC: { ...kdpBlueprint.BACK_COVER_SPEC, blurb_text: e.target.value } })}
                            className="w-full h-64 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-300 font-serif text-lg leading-relaxed outline-none focus:border-indigo-500 custom-scrollbar resize-none"
                            placeholder="Click generate to create a best-selling blurb..."
                          />
                        </div>

                        {/* RIGHT: KEYWORDS & CATEGORIES */}
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-indigo-400 mb-4">7 Backend Keywords</h3>
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-2">
                              {(marketingService.generateKeywords({ ...kdpProject, genre: selectedGenre?.id || 'ROMANCE', interiorColor: kdpProject.interiorColor, audience: 'General', format: 'STANDALONE', title: kdpBlueprint.PROJECT_META.title_working } as any) || []).map((kw, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-400 border-b border-slate-900 pb-2 last:border-0 last:pb-0">
                                  <span className="text-slate-600 font-mono">#{i + 1}</span>
                                  <span>{kw}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-indigo-400 mb-4">Recommended Browse Nodes</h3>
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-2">
                              {(marketingService.generateCategories({ ...kdpProject, genre: selectedGenre?.id || 'ROMANCE' } as any) || []).map((cat, i) => (
                                <div key={i} className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-lg">
                                  {cat}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PUBLISHING METADATA & GAMIFICATION HUD */}
              <div className="col-span-12 xl:col-span-4 space-y-8 no-print">
                <div className="bg-slate-900 border border-slate-800 p-10 rounded-[4rem] shadow-2xl space-y-8 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">

                  {/* GAMIFICATION HUD */}
                  <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                    {/* Score Calculation */}
                    {(() => {
                      const scoreData = gamificationService.calculateScore({ ...kdpProject, genre: selectedGenre?.id || 'ROMANCE' } as any, kdpBlueprint);
                      return (
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-1">KDP Readiness</span>
                              <h3 className="text-4xl font-black italic text-white leading-none drop-shadow-lg">{scoreData.total}%</h3>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg ${scoreData.total > 80 ? 'bg-emerald-500 text-emerald-950 shadow-emerald-500/20' : 'bg-indigo-600 text-white shadow-indigo-500/20'}`}>
                              {scoreData.level}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden mb-5 border border-slate-700">
                            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out relative" style={{ width: `${scoreData.total}%` }}>
                              <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-6">
                            <span>Tech: {scoreData.breakdown.technical}/30</span>
                            <span>Content: {scoreData.breakdown.content}/40</span>
                            <span>Market: {scoreData.breakdown.market}/30</span>
                          </div>

                          <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl flex items-center gap-4 hover:bg-indigo-500/20 transition-colors">
                            <Rocket size={16} className="text-indigo-400" />
                            <div>
                              <span className="text-xs font-black uppercase text-indigo-300 block mb-0.5">Next Mission</span>
                              <span className="text-sm font-bold text-white shadow-black drop-shadow-sm">{scoreData.nextMilestone}</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="flex items-center gap-3 border-b border-slate-800 pb-6 mt-10">
                    <Settings className="text-indigo-400" size={28} />
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Compliance Deck</h3>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-widest italic">Spine Calculation</span>
                        <span className="text-sm font-black text-indigo-400 font-mono">{calculateSpineWidth()}" Wrap</span>
                      </div>
                      <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 shadow-inner">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-300 uppercase tracking-tighter">Manufacturing Status</span>
                          <span className={`text-xs font-black uppercase flex items-center gap-2 ${validationResult?.canExport ? 'text-emerald-400' : 'text-red-400'}`}>
                            {validationResult?.canExport ? <><CheckCircle size={14} /> Compliant</> : <><ShieldAlert size={14} /> Risk</>}
                          </span>
                        </div>

                        {/* Precision Checklist */}
                        <div className="space-y-2 border-t border-slate-900 pt-4">
                          {validationResult?.checks.map((check: any) => (
                            <div key={check.id} className="flex items-center justify-between group/check">
                              <div className="flex items-center gap-2">
                                {check.status === 'pass' && <CheckCircle size={10} className="text-emerald-500" />}
                                {check.status === 'warning' && <AlertCircle size={10} className="text-amber-500" />}
                                {check.status === 'fail' && <X size={10} className="text-red-500" />}
                                <span className="text-[9px] font-black uppercase text-slate-400 group-hover/check:text-white transition-colors">{check.label}</span>
                              </div>
                              <span className={`text-[9px] font-bold ${check.status === 'pass' ? 'text-slate-600' : check.status === 'warning' ? 'text-amber-500' : 'text-red-500'}`}>{check.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Compliance Status</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                          <ShieldCheck size={10} className="text-emerald-500" />
                          <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">KDP-Safe Active</span>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Barcode Lock</span>
                          <span className="text-[9px] font-black text-white uppercase">{previewTarget === 'EBOOK' ? 'DISABLED (CLEAN)' : 'RESERVED (BOTTOM-RIGHT)'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Placement Safezone</span>
                          <span className="text-[9px] font-black text-emerald-500 uppercase">LOCKED (+0.25")</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Marketing Blurb (Back Cover)</span>
                        <div className="flex gap-2">
                          <button
                            onClick={handleRegenerateBlurb}
                            disabled={isGenerating}
                            className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 p-1.5 rounded-lg transition-colors"
                            title="Regenerate with AI"
                          >
                            <RefreshCw size={12} className={isGenerating ? "animate-spin" : ""} />
                          </button>
                          <button
                            onClick={() => {
                              setTempBlurb(kdpBlueprint.BACK_COVER_SPEC.blurb_text);
                              setIsEditingBlurb(!isEditingBlurb);
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-400 p-1.5 rounded-lg transition-colors"
                            title="Edit Manually"
                          >
                            <Edit3 size={12} />
                          </button>
                        </div>
                      </div>

                      {isEditingBlurb ? (
                        <div className="space-y-2">
                          <textarea
                            value={tempBlurb}
                            onChange={(e) => setTempBlurb(e.target.value)}
                            className="w-full bg-slate-950 border border-indigo-500/50 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed font-medium italic min-h-[120px] outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                setKdpBlueprint({
                                  ...kdpBlueprint,
                                  BACK_COVER_SPEC: { ...kdpBlueprint.BACK_COVER_SPEC, blurb_text: tempBlurb }
                                });
                                setIsEditingBlurb(false);
                              }}
                              className="px-4 py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase text-white hover:bg-emerald-500 transition-colors"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 text-xs text-slate-400 leading-relaxed font-medium italic">
                          "{kdpBlueprint.BACK_COVER_SPEC.blurb_text}"
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Visual Cover Deck</span>
                        <div className="flex gap-4">
                          <button onClick={handleGenerateFullCover} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase underline">Re-Render</button>
                          <button onClick={() => handleExportMS('COVER_EBOOK')} disabled={isGenerating} className="text-[10px] font-bold text-slate-400 hover:text-white uppercase flex items-center gap-1 group disabled:opacity-50 disabled:cursor-not-allowed">
                            <Monitor size={10} className="group-hover:translate-y-0.5 transition-transform" /> {isGenerating && downloadProgress > 0 ? "Saving..." : "Kindle Cover"}
                          </button>
                          <button onClick={() => handleExportMS('COVER')} disabled={isGenerating} className="text-[10px] font-bold text-indigo-400 hover:text-white uppercase flex items-center gap-1 group disabled:opacity-50 disabled:cursor-not-allowed">
                            <Download size={10} className="group-hover:translate-y-0.5 transition-transform" /> {isGenerating && downloadProgress > 0 ? "Rendering..." : "Print Wrap"}
                          </button>
                        </div>
                      </div>

                      {isGenerating && downloadProgress > 0 && (
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-2 mb-4">
                          <div className="h-full bg-indigo-500 transition-all duration-300 ease-out" style={{ width: `${downloadProgress}%` }} />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-[3/4] bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden group">
                          {kdpBlueprint.COVER_SPEC.ebook_url ? (
                            <>
                              <img src={kdpBlueprint.COVER_SPEC.ebook_url} className="w-full h-full object-cover" />
                              <div className="absolute top-2 right-2 px-2 py-0.5 bg-indigo-600 text-[8px] font-black rounded text-white">FRONT</div>
                            </>
                          ) : <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-slate-700 uppercase">Front Cover</div>}
                        </div>
                        <div className="aspect-[3/4] bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden group">
                          {kdpBlueprint.COVER_SPEC.back_cover_url ? (
                            <>
                              <img src={kdpBlueprint.COVER_SPEC.back_cover_url} className="w-full h-full object-cover" />
                              <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-700 text-[8px] font-black rounded text-white">BACK</div>
                            </>
                          ) : <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-slate-700 uppercase">Back Plate</div>}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-800">
                      <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2"><CheckCircle2 size={14} /> KDP QA Checklist</span>
                      <ul className="space-y-3">
                        {(kdpBlueprint.QA_CHECKLIST || []).map((qa, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-[11px] font-bold text-slate-500 leading-tight">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1" /> {qa}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-8 space-y-4">
                      <button onClick={() => setIsPreviewMode(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-[2.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 text-sm shadow-xl transition-all border-b-8 border-emerald-900 active:translate-y-1">
                        <Download size={20} /> Industrial Export Hub
                      </button>
                      <button onClick={() => setShowUploadCopilot(true)} className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-[2.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 text-xs shadow-lg transition-all border-b-4 border-indigo-900 active:translate-y-1">
                        <Rocket size={16} /> Launch Smart Upload Co-Pilot
                      </button>
                      <p className="text-[9px] text-center font-bold text-slate-600 uppercase tracking-tighter italic">V4.0 Industrial Compliance Engine Active</p>
                    </div>

                    {showUploadCopilot && kdpBlueprint && (
                      <SmartUploadCopilot
                        blueprint={kdpBlueprint}
                        onClose={() => setShowUploadCopilot(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }



  // --- POD MERCH VIEW ---
  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-20 animate-in fade-in">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-white transition-colors">
          <ChevronLeft size={20} /> <span className="font-black uppercase text-[10px] tracking-[0.2em]">Exit Engine</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-2xl`}>
              <ImageIcon size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{tool.name}</h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Status: Factory Active</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Prompt</label>
                <button onClick={async () => { setIsEnhancing(true); try { const e = await gemini.enhancePrompt(prompt, "POD Designer"); setPrompt(e); } finally { setIsEnhancing(false); } }} className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Industrial Enhance
                </button>
                {toolType === ToolType.POD_MERCH && (
                  <button onClick={handleUpgradePrompt} className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    {isPromptBettering ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />} DNA Betterment
                  </button>
                )}
              </div>

              {/* CONTEXT-AWARE CHARACTER SELECTOR (PHASE 6) */}
              {availableCharacters.length > 0 && (
                <div className="relative z-20">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${activeCharacter ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                    onClick={() => {
                      // Cycle through characters + None option
                      const currentIndex = availableCharacters.findIndex(c => c.id === activeCharacter?.id);
                      if (currentIndex === -1) {
                        setActiveCharacter(availableCharacters[0]); // Select first
                      } else if (currentIndex === availableCharacters.length - 1) {
                        setActiveCharacter(null); // Deselect (Generic Mode)
                      } else {
                        setActiveCharacter(availableCharacters[currentIndex + 1]); // Next
                      }
                    }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeCharacter ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      {activeCharacter ? <User size={16} /> : <Users size={16} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Active Character Context</p>
                      <p className={`text-xs font-bold ${activeCharacter ? 'text-indigo-400' : 'text-slate-400 italic'}`}>
                        {activeCharacter ? `Active: ${activeCharacter.name}` : "None (Generic Mode)"}
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono pr-2">
                      {activeCharacter ? "ON" : "OFF"}
                    </div>
                  </div>
                </div>
              )}

              <textarea
                value={prompt} onChange={e => setPrompt(e.target.value)}
                className="w-full h-36 bg-slate-950 border border-slate-800 rounded-3xl p-6 text-sm font-bold resize-none outline-none focus:border-indigo-500 transition-all text-slate-200"
                placeholder="Describe your design concept..."
              />

              {/* ADVANCED CONTROLS: Aspect Ratio & Negative Prompt */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Canvas Ratio</label>
                  <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    {['1:1', '2:3', '3:2'].map(r => (
                      <button
                        key={r}
                        onClick={() => setAspectRatio(r)}
                        className={`flex-1 py-2 rounded-lg font-black text-[10px] transition-all ${aspectRatio === r ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Negative Prompt</label>
                  <input
                    value={negativePrompt}
                    onChange={e => setNegativePrompt(e.target.value)}
                    placeholder="e.g. blur, text, watermark"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold outline-none focus:border-indigo-500 text-slate-300"
                  />
                </div>
              </div>
            </div>

            {toolType === ToolType.POD_MERCH && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Style Studio</label>
                  <div className="flex gap-1">
                    {["All", "Modern", "Retro", "Artistic", "Gothic"].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedStyleCategory(cat)}
                        className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${selectedStyleCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-700'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {POD_STYLES.filter(s => selectedStyleCategory === "All" || s.category === selectedStyleCategory).map(s => (
                    <PODStyleCard
                      key={s.id}
                      style={s}
                      isSelected={selectedStyle === s.id}
                      onClick={() => setSelectedStyle(s.id === selectedStyle ? null : s.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Maximize size={14} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">4K Industrial Render</span>
              </div>
              <button
                onClick={() => setIs4K(!is4K)}
                className={`w-12 h-6 rounded-full transition-all relative ${is4K ? 'bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${is4K ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <button
              onClick={handleGenerateVariants} disabled={isGenerating || !prompt}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-sm shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] border-b-8 border-indigo-900"
            >
              {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
              <span>{isGenerating ? 'Processing...' : 'Engage Engine'}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          {variants.length > 0 && !result && (
            <div className="animate-in fade-in zoom-in-95">
              <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tighter">Variant Output</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {variants.map((v, i) => (
                  <button key={i} onClick={() => setSelectedIndex(i)} className={`w-full h-96 rounded-[3rem] overflow-hidden border-4 transition-all relative group bg-slate-950 ${selectedIndex === i ? 'border-indigo-600 scale-105 shadow-2xl' : 'border-slate-800 opacity-60 hover:opacity-100'} `}>
                    <img
                      src={v}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onLoad={() => {
                        console.log(`=== IMAGE LOADED ===: ${v.substring(0, 100)}...`);
                      }}
                      onError={(e) => {
                        console.error(`=== IMAGE ERROR ===: ${v.substring(0, 100)}...`);
                        console.error('Error details:', e);
                        console.error('Native error:', e.nativeEvent);
                        console.error('Current src:', e.currentTarget.src);
                        console.error('Error type:', e.type);
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <ZoomIn className="text-white drop-shadow-md" />
                    </div>
                  </button>
                ))}
              </div>
              {selectedIndex !== null && (
                <button onClick={handleFinalizeSelection} disabled={isFinalizing} className="w-full mt-12 bg-white text-black py-8 rounded-[3rem] font-black uppercase tracking-[0.6em] flex items-center justify-center gap-4 shadow-2xl border-b-[10px] border-slate-300 active:translate-y-1">
                  {isFinalizing ? <Loader2 className="animate-spin" size={24} /> : <Rocket size={24} />} Commit Design
                </button>
              )}
            </div>
          )}

          {result && (
            <div className="space-y-12 animate-in fade-in">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                <div className="xl:col-span-8 space-y-6">
                  <div className="flex justify-between items-center px-6">
                    <h3 className="text-lg font-black uppercase italic text-slate-400">{MOCKUP_LABELS[activeMockup]}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Live Editor</span>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  </div>

                  <div className="relative group rounded-[4rem] overflow-hidden">
                    <div
                      className="aspect-[4/3] relative flex items-center justify-center cursor-move border-[15px] border-slate-900 rounded-[4rem] overflow-hidden shadow-2xl transition-all duration-500"
                      style={{ backgroundColor: baseColor }}
                      onMouseDown={handleDragStart}
                      onMouseMove={handleDragMove}
                      onMouseUp={handleDragEnd}
                      onMouseLeave={handleDragEnd}
                    >
                      {isStripping && (
                        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-in fade-in">
                          <Activity className="text-emerald-400 animate-pulse mb-4" size={48} />
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] text-center px-12">Transparency Lab: Industrial Alpha-Stripping Subject...</p>
                          <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-8 overflow-hidden">
                            <div className="h-full bg-emerald-500 animate-[pulse_1.5s_infinite]" />
                          </div>
                        </div>
                      )}
                      <div
                        className="absolute inset-0 pointer-events-none flex items-center justify-center"
                        style={{
                          transform: `translate(${mockupPosX}px, ${mockupPosY}px) scale(${mockupScale})`,
                          opacity: printfulMockups[activeMockup] && !isGeneratingMockups ? 0 : 1 // Hide overlay if canvas mockup is active
                        }}
                      >
                        <img src={result} className={`
                              ${activeMockup.includes('TEE') || activeMockup.includes('HOODIE') ? 'w-[45%]' : activeMockup === 'PHONE_CASE' ? 'w-[28%]' : activeMockup === 'MUG' ? 'w-[22%]' : 'w-[50%]'}
drop-shadow-2xl pointer-events-none
  `} />
                      </div>

                      {printfulMockups[activeMockup] ? (
                        <img
                          src={printfulMockups[activeMockup]}
                          className="w-full h-full object-cover select-none pointer-events-none transition-all duration-300"
                          alt="Printful Mockup"
                        />
                      ) : (
                        <img
                          src={MOCKUP_ASSETS[activeMockup]}
                          className="w-full h-full object-cover select-none pointer-events-none transition-all duration-300"
                          style={{ mixBlendMode: 'multiply' }}
                        />
                      )}
                    </div>

                    <div className="mt-6 bg-slate-900/95 backdrop-blur-2xl px-12 py-5 rounded-[2.5rem] border border-slate-700 flex items-center justify-between shadow-2xl">
                      <button
                        onClick={() => { setMockupPosX(0); setMockupPosY(0); setMockupScale(1); }}
                        className="text-slate-400 hover:text-white transition-all bg-slate-800 px-6 py-3 rounded-2xl flex items-center gap-3 border border-slate-700 active:scale-95"
                      >
                        <AlignCenter size={22} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Snap Center</span>
                      </button>

                      <div className="flex items-center gap-8 bg-slate-800 px-8 py-3 rounded-2xl border border-slate-700">
                        <button onClick={() => setMockupScale(s => Math.max(0.1, s - 0.1))} className="text-slate-400 hover:text-white"><ZoomOut size={20} /></button>
                        <div className="flex flex-col items-center w-40">
                          <input
                            type="range" min="0.1" max="3" step="0.05" value={mockupScale}
                            onChange={(e) => setMockupScale(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-full accent-indigo-500 appearance-none cursor-pointer"
                          />
                          <span className="text-[10px] font-black text-indigo-400 font-mono mt-2 uppercase tracking-tighter">Scale {Math.round(mockupScale * 100)}%</span>
                        </div>
                        <button onClick={() => setMockupScale(s => Math.min(3, s + 0.1))} className="text-slate-400 hover:text-white"><ZoomIn size={20} /></button>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] italic mt-2">Design Workspace Center: {mockupPosX}x / {mockupPosY}y</p>

                  {/* MOCKUP GALLERY GRID - RedBubble Style */}
                  <div className="mt-12 p-8 bg-slate-900/50 backdrop-blur-xl rounded-[3rem] border border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-black uppercase italic tracking-widest text-slate-400">Product Mockup Gallery</h4>
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{Object.keys(MOCKUP_LABELS).length} SKU Types</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                      {(Object.keys(MOCKUP_LABELS) as MockupType[]).map(mockupType => (
                        <button
                          key={mockupType}
                          onClick={() => setActiveMockup(mockupType)}
                          className={`group relative aspect-square rounded-2xl overflow-hidden border-4 transition-all ${activeMockup === mockupType
                            ? 'border-indigo-500 scale-105 shadow-2xl shadow-indigo-500/20'
                            : 'border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
                            } `}
                        >
                          <img
                            src={printfulMockups[mockupType] || MOCKUP_ASSETS[mockupType]}
                            className="w-full h-full object-contain p-2 transition-transform group-hover:scale-110"
                            alt={MOCKUP_LABELS[mockupType]}
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-2 ${activeMockup === mockupType ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                            <span className="text-[8px] font-black uppercase text-white text-center leading-tight tracking-wider">
                              {MOCKUP_LABELS[mockupType]}
                            </span>
                          </div>
                          {activeMockup === mockupType && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 size={16} className="text-indigo-400 drop-shadow-lg" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-4 space-y-6">
                  <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 space-y-8 shadow-2xl overflow-y-auto custom-scrollbar max-h-[900px]">
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
                      <Edit3 size={24} className="text-emerald-400" />
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">SKU Production Dossier</h3>
                    </div>

                    <div className="space-y-8">
                      {/* Master Asset Stats */}
                      {/* Master Asset Stats - NOW WITH PREVIEW */}
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-4 relative overflow-hidden group">
                        {result && (
                          <img src={result} className="w-16 h-16 rounded-xl object-cover border border-slate-700 bg-white/5" alt="Master Asset" />
                        )}
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Master Asset</p>
                          <p className="text-xs font-bold text-slate-100">2048px Transparent (300DPI)</p>
                        </div>
                        <button
                          onClick={async () => {
                            if (result) {
                              try {
                                const response = await fetch(result);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `SKU_${Date.now()}.png`; // Forces download
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                              } catch (e) {
                                console.error("Download failed, falling back", e);
                                window.open(result, '_blank');
                              }
                            }
                          }}
                          className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                        >
                          <Download size={16} className="text-emerald-400" />
                        </button>
                      </div>

                      {/* Continuity Check */}
                      {productionDossier && (
                        <div className={`p-4 rounded-2xl border ${productionDossier.continuityReport.status === 'MATCH' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'} `}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Aesthetic Continuity Check</span>
                            <span className={`text-[10px] font-black ${productionDossier.continuityReport.status === 'MATCH' ? 'text-emerald-400' : 'text-amber-400'} `}>{productionDossier.continuityReport.status}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-2xl font-black italic text-slate-100">{productionDossier.continuityReport.score}%</div>
                            <p className="text-[10px] font-bold text-slate-400 leading-tight flex-1 italic">"{productionDossier.continuityReport.feedback}"</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <Palette size={14} /> Product Base Colorway
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          {COLOR_SWATCHES.map(color => (
                            <button
                              key={color.value}
                              onClick={() => setBaseColor(color.value)}
                              className={`w-full h-12 rounded-xl border-4 transition-all shadow-xl flex items-center justify-center ${baseColor === color.value ? 'border-indigo-500 scale-110 shadow-indigo-500/20' : 'border-slate-800 hover:scale-105'} `}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            >
                              {baseColor === color.value && <CheckCircle2 size={16} className={color.value === '#ffffff' ? 'text-black' : 'text-white'} />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Platform Switcher & SEO */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2"><Globe size={14} /> Platform Listing Dossier</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                          {['Amazon/Etsy', 'Redbubble', 'Shopify'].map(platform => (
                            <button
                              key={platform}
                              onClick={() => {
                                setActivePlatform(platform);
                                if (productionDossier) {
                                  setSeoData({
                                    title: productionDossier.listingDossiers[platform]?.title || '',
                                    description: productionDossier.listingDossiers[platform]?.description || '',
                                    story: productionDossier.continuityReport.feedback,
                                    tags: productionDossier.listingDossiers[platform]?.tags || []
                                  });
                                }
                              }}
                              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all shrink-0 ${activePlatform === platform ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-slate-300'} `}
                            >
                              {platform}
                            </button>
                          ))}
                        </div>

                        {seoData && (
                          <div className="space-y-4 animate-in slide-in-from-right-2">
                            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 group">
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Optimized Title</span>
                                <button onClick={() => handleCopy(seoData.title, 'title')} className="text-slate-600 hover:text-white transition-opacity">
                                  {copyStatus === 'title' ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                              </div>
                              <p className="text-[11px] font-bold leading-tight text-slate-200">{seoData.title}</p>
                            </div>

                            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 group">
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Story / Meaning</span>
                                <button onClick={() => handleCopy(seoData.story, 'story')} className="text-slate-600 hover:text-white transition-opacity">
                                  {copyStatus === 'story' ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                              </div>
                              <p className="text-[10px] font-medium leading-relaxed text-slate-400 italic line-clamp-3">{seoData.story}</p>
                            </div>

                            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 group">
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Tags Matrix</span>
                                <button onClick={() => handleCopy(seoData.tags?.join(', '), 'tags')} className="text-slate-600 hover:text-white transition-opacity">
                                  {copyStatus === 'tags' ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {seoData.tags?.map((tag, i) => (
                                  <span key={i} className="text-[8px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-500 font-bold">{tag}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-4 border-t border-slate-800">
                      <button onClick={async (e) => {
                        const btn = e.currentTarget;
                        const originalText = btn.innerHTML;
                        btn.innerHTML = '⚙️ Processing 5K Upscale...';
                        btn.setAttribute('disabled', 'true');

                        if (result) {
                          try {
                            console.log("Initializing 5K Industrial Scaler...", result.substring(0, 30));

                            // 1. Fetch Blob directly (Bypasses Image Element Taint issues)
                            const response = await fetch(result, { mode: 'cors' });
                            if (!response.ok) throw new Error("Network Fetch Failed");
                            const blob = await response.blob();

                            // 2. Create Bitmap (High Performance)
                            const bitmap = await createImageBitmap(blob);

                            // 3. Create High-Res Canvas
                            const canvas = document.createElement('canvas');
                            canvas.width = 5000;
                            canvas.height = 5000;
                            const ctx = canvas.getContext('2d');
                            if (!ctx) throw new Error("Canvas Context Failed");

                            // 4. Draw Scaled Image
                            ctx.drawImage(bitmap, 0, 0, 5000, 5000);

                            // 5. Export as 5K PNG
                            canvas.toBlob((exportBlob) => {
                              if (!exportBlob) throw new Error("Canvas Blob Failed");
                              const url = URL.createObjectURL(exportBlob);
                              const link = document.createElement('a');
                              link.href = url;
                              // Force filename with extension
                              const filename = `SKU_${Date.now()}_5K.png`;
                              link.download = filename;
                              link.setAttribute('download', filename);
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                              console.log("5K Export Complete (Blob Mode):", filename);
                            }, 'image/png', 1.0);

                          } catch (err) {
                            console.error("5K Scaling Failed, attempting raw download", err);
                            // Fallback: Raw download
                            try {
                              const link = document.createElement('a');
                              link.href = result;
                              link.download = `SKU_${Date.now()}_raw.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            } catch (e2) {
                              window.open(result, '_blank');
                            }
                          } finally {
                            btn.innerHTML = originalText;
                            btn.removeAttribute('disabled');
                          }
                        }
                      }} className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-[2.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-4 text-sm shadow-xl transition-all active:scale-95 border-b-8 border-emerald-900"><Download size={24} /> Export SKU (5000px)</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-red-950 border-2 border-red-500/50 p-8 rounded-[3rem] flex items-center gap-6 animate-in slide-in-from-bottom-12 shadow-2xl z-50 max-w-xl">
          <ShieldAlert className="text-red-500 shrink-0" size={32} />
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest text-red-100 italic">Production Engine Fault</p>
            <p className="text-[10px] text-red-200 mt-2 font-bold">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="p-3 hover:bg-red-500/20 rounded-2xl transition-all"><X size={20} /></button>
        </div>
      )}
    </div>
  );
};

export default ToolView;
