/**
 * Smooth Builder Auto Style Engine
 * Deterministic, dependency-free rule engine for deriving style settings.
 */

const INDUSTRY_POLICIES = {
  anwalt: {
    preset: 'editorial',
    fontStack: 'serif',
    darkMode: false,
    densityDefault: 'airy',
    fx: { orbs: false, glass: false, grain: true, intensity: 'subtle' }
  },
  kanzlei: {
    preset: 'editorial',
    fontStack: 'serif',
    darkMode: false,
    densityDefault: 'airy',
    fx: { orbs: false, glass: false, grain: true, intensity: 'subtle' }
  },
  treuhand: {
    preset: 'swiss',
    fontStack: 'instrument',
    darkMode: false,
    densityDefault: 'balanced',
    fx: { orbs: false, glass: false, grain: false, intensity: 'subtle' }
  },
  finanzberatung: {
    preset: 'swiss',
    fontStack: 'instrument',
    darkMode: false,
    densityDefault: 'balanced',
    fx: { orbs: false, glass: false, grain: false, intensity: 'subtle' }
  },
  it: {
    preset: 'glass',
    fontStack: 'inter',
    darkMode: true,
    densityDefault: 'balanced',
    fx: { orbs: true, glass: true, grain: true, intensity: 'medium' }
  },
  saas: {
    preset: 'glass',
    fontStack: 'inter',
    darkMode: true,
    densityDefault: 'balanced',
    fx: { orbs: true, glass: true, grain: true, intensity: 'medium' }
  },
  fitness: {
    preset: 'signature',
    fontStack: 'dmsans',
    darkMode: false,
    densityDefault: 'balanced',
    fx: { orbs: true, glass: false, grain: false, intensity: 'medium' }
  },
  gastro: {
    preset: 'editorial',
    fontStack: 'serif',
    darkMode: false,
    densityDefault: 'airy',
    fx: { orbs: false, glass: false, grain: true, intensity: 'subtle' }
  },
  restaurant: {
    preset: 'editorial',
    fontStack: 'serif',
    darkMode: false,
    densityDefault: 'airy',
    fx: { orbs: false, glass: false, grain: true, intensity: 'subtle' }
  }
};

const DEFAULT_POLICY = {
  preset: 'swiss',
  fontStack: 'instrument',
  darkMode: false,
  densityDefault: 'balanced',
  fx: { orbs: false, glass: false, grain: false, intensity: 'subtle' }
};

const FALLBACK_PALETTE = [
  { primary: '#1e3a5f', accent: '#ca8a04' },
  { primary: '#0f766e', accent: '#f59e0b' },
  { primary: '#1d4ed8', accent: '#14b8a6' }
];

function normalizeHex(hex) {
  if (typeof hex !== 'string') return null;
  const raw = hex.trim().replace('#', '');
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    return `#${raw.split('').map((ch) => ch + ch).join('').toLowerCase()}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw.toLowerCase()}`;
  return null;
}

function hexToRgb(hex) {
  const n = normalizeHex(hex);
  if (!n) return null;
  const v = n.slice(1);
  return {
    r: Number.parseInt(v.slice(0, 2), 16),
    g: Number.parseInt(v.slice(2, 4), 16),
    b: Number.parseInt(v.slice(4, 6), 16)
  };
}

function luminance(rgb) {
  if (!rgb) return Number.NaN;
  return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
}

function isNearBlack(y) { return y < 20; }
function isNearWhite(y) { return y > 235; }

function estimateAverageTextLength(components) {
  const values = [];

  function visit(node) {
    if (typeof node === 'string') {
      const trimmed = node.trim();
      if (trimmed) values.push(trimmed.length);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (node && typeof node === 'object') {
      Object.values(node).forEach(visit);
    }
  }

  visit(components);
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function computeContentStats(components = {}) {
  return {
    servicesCount: components?.services?.items?.length ?? 0,
    benefitsCount: components?.benefits?.items?.length ?? 0,
    faqCount: components?.faq?.items?.length ?? 0,
    testimonialsCount: components?.testimonials?.items?.length ?? 0,
    hasProofTable: Boolean(components?.proofTable?.enabled),
    hasProcess: Boolean(components?.process?.enabled),
    hasGallery: Boolean(components?.gallery?.enabled),
    heroSubtitleLength: (components?.hero?.subtitle ?? '').length,
    avgTextLength: estimateAverageTextLength(components)
  };
}

function decideDensity(stats, industryKey, fallback = 'balanced') {
  const totalCards = (stats?.servicesCount ?? 0) + (stats?.benefitsCount ?? 0) + (stats?.faqCount ?? 0);
  const key = String(industryKey || '').toLowerCase();

  if (stats?.hasProofTable && stats?.hasProcess && totalCards >= 12) return 'compact';
  if (['anwalt', 'treuhand', 'finanzberatung', 'kanzlei'].includes(key) && (stats?.avgTextLength ?? 0) > 220) return 'airy';
  if ((stats?.heroSubtitleLength ?? 0) > 180 && totalCards < 8) return 'airy';

  return fallback;
}

function applyAggressiveness(policy, mode) {
  if (mode === 'conservative') {
    return {
      ...policy,
      preset: policy.preset === 'glass' ? 'swiss' : policy.preset,
      fx: { ...policy.fx, orbs: false, glass: false, intensity: 'subtle' }
    };
  }
  if (mode === 'bold') {
    return {
      ...policy,
      preset: policy.preset === 'swiss' ? 'glass' : policy.preset,
      fx: { ...policy.fx, orbs: true, grain: true, intensity: policy.fx?.intensity ?? 'medium' }
    };
  }
  return policy;
}

function buildIndustryPolicy(industryKey, aggressiveness = 'balanced') {
  const key = String(industryKey || '').toLowerCase();
  const base = INDUSTRY_POLICIES[key] || DEFAULT_POLICY;
  return applyAggressiveness(base, aggressiveness);
}

function isAmberGold(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  // Warm highlight bucket
  return rgb.r > 160 && rgb.g > 100 && rgb.b < 90;
}

function pickPrimaryAccent(logoColors = [], industryKey = '') {
  const candidates = logoColors
    .map((hex) => ({ hex: normalizeHex(hex), y: luminance(hexToRgb(hex)) }))
    .filter((c) => c.hex && Number.isFinite(c.y));

  if (!candidates.length) return { primary: null, accent: null };

  const usableDark = candidates
    .filter((c) => !isNearBlack(c.y))
    .sort((a, b) => a.y - b.y);

  const usableLight = candidates
    .filter((c) => !isNearWhite(c.y))
    .sort((a, b) => b.y - a.y);

  const primary = (usableDark[0] || candidates.sort((a, b) => a.y - b.y)[0]).hex;

  const key = String(industryKey || '').toLowerCase();
  const wantsWarmAccent = ['anwalt', 'kanzlei', 'gastro', 'restaurant'].includes(key);

  let accentCandidate = null;
  if (wantsWarmAccent) {
    accentCandidate = usableLight.find((c) => isAmberGold(c.hex)) || null;
  }

  const accent = (accentCandidate || usableLight[0] || candidates.sort((a, b) => b.y - a.y)[0]).hex;

  if (accent === primary) {
    const different = candidates.find((c) => c.hex !== primary);
    return { primary, accent: different ? different.hex : primary };
  }

  return { primary, accent };
}

function getIndustryColorFallback(industryKey) {
  const key = String(industryKey || '').toLowerCase();

  if (['anwalt', 'kanzlei', 'treuhand', 'finanzberatung'].includes(key)) return FALLBACK_PALETTE[0];
  if (['it', 'saas'].includes(key)) return FALLBACK_PALETTE[2];
  if (['gastro', 'restaurant'].includes(key)) return FALLBACK_PALETTE[1];
  return FALLBACK_PALETTE[0];
}

function autoStyleEngine(settings = {}, context = {}) {
  const next = JSON.parse(JSON.stringify(settings || {}));
  const locks = context.locks || {};
  const industryKey = context.industryKey || next.industry || '';
  const policy = buildIndustryPolicy(industryKey, context.aggressiveness || 'balanced');
  const stats = context.contentStats || computeContentStats(context.components || {});

  if (!locks.preset) next.stylePreset = policy.preset;
  if (!locks.typography) next.fontStack = policy.fontStack;
  if (!locks.density) next.designDensity = decideDensity(stats, industryKey, policy.densityDefault);

  if (!locks.fx) {
    next.darkMode = policy.darkMode;
    next.fxOrbs = policy.fx.orbs;
    next.fxGlass = policy.fx.glass;
    next.fxGrain = policy.fx.grain;
    next.fxIntensity = policy.fx.intensity;
  }

  if (!locks.colors) {
    if (next.useColorStack && next.colorStack) {
      // keep user-decided stack
    } else if (context.colorStack && context.acceptColorStack !== false) {
      next.colorStack = context.colorStack;
      next.useColorStack = true;
    } else {
      const { primary, accent } = pickPrimaryAccent(context.logoColors || [], industryKey);
      if (primary && accent) {
        next.primaryColor = primary;
        next.accentColor = accent;
      } else {
        const fallback = getIndustryColorFallback(industryKey);
        next.primaryColor = fallback.primary;
        next.accentColor = fallback.accent;
      }
    }
  }

  return next;
}

const api = {
  INDUSTRY_POLICIES,
  autoStyleEngine,
  computeContentStats,
  pickPrimaryAccent,
  buildIndustryPolicy,
  decideDensity,
  getIndustryColorFallback,
  normalizeHex,
  hexToRgb,
  luminance
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}

if (typeof window !== 'undefined') {
  window.AutoStyleEngine = api;
}
