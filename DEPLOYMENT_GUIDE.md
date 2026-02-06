# PublishLab Deployment Guide

## 🚀 Quick Start

### Local Development (Zero Cost)
```bash
# 1. Install dependencies
npm install

# 2. Start Ollama (for text generation)
ollama serve

# 3. Pull the model
ollama pull llama3.2:3b

# 4. Start dev server
npm run dev
```

**Local Mode Features:**
- ✅ Text: Ollama (Llama 3.2:3b)
- ✅ Images: Canvas (client-side)
- ✅ Cost: $0/month

---

## 🏭 Production Deployment

### 1. Get API Keys

#### Gemini 1.5 Flash (Text - Primary)
1. Visit: https://aistudio.google.com/app/apikey
2. Create API key
3. Add to Vercel: `VITE_GEMINI_API_KEY`

**Cost**: $0.00001875/1k tokens (~$0.019/month per Artisan user)

#### Groq (Text - Fallback)
1. Visit: https://console.groq.com/keys
2. Create API key
3. Add to Vercel: `VITE_GROQ_API_KEY`

**Cost**: $0.00059/1k tokens (only if Gemini fails)

#### Fal.ai (Images - Primary)
1. Visit: https://fal.ai/dashboard/keys
2. Create API key
3. Add to Vercel: `VITE_FAL_API_KEY`

**Cost**: $0.003/image (Flux Schnell) or $0.025/image (Flux Dev)

---

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Environment Variables (Vercel Dashboard)
```
VITE_GEMINI_API_KEY=your_key_here
VITE_GROQ_API_KEY=your_key_here
VITE_FAL_API_KEY=your_key_here
VITE_PADDLE_VENDOR_ID=your_vendor_id
VITE_PADDLE_CLIENT_TOKEN=your_token
VITE_PADDLE_ENVIRONMENT=production
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

### 3. Verify Deployment

#### Check Environment Detection
Open browser console on deployed site:
```
🚀 PRODUCTION MODE: Using premium APIs
   Text: gemini
   Images: fal
```

#### Test Manuscript Generation
1. Navigate to Manuscript Foundry
2. Generate a test manuscript
3. Check console for: `✅ Gemini 1.5 Flash generation successful`

#### Test Cover Generation
1. Navigate to Cover Foundry
2. Generate a test cover
3. Check console for: `✅ Fal.ai generation successful`

---

## 📊 Cost Monitoring

### Expected Monthly Costs (1000 Active Users)

| Tier | Users | Text Cost | Image Cost | Total CPUPM |
|:-----|:------|:----------|:-----------|:------------|
| Novice | 500 | $0.47 | $7.50 | $0.016 |
| Solo | 300 | $1.41 | $18.00 | $0.075 |
| Artisan | 150 | $2.85 | $187.50 | $2.60 |
| Master | 50 | $15.63 | $275.00 | $20.54 |

**Total Infrastructure Cost**: ~$1,447/month  
**Total Revenue**: ~$8,595/month  
**Gross Margin**: 83.2%

---

## 🔧 Troubleshooting

### "Gemini API Key missing"
- Verify `VITE_GEMINI_API_KEY` is set in Vercel
- Redeploy after adding environment variables

### "Fal.ai generation failed"
- Check API key is valid
- Verify quota hasn't been exceeded
- System will auto-fallback to Canvas

### "LOCAL MODE in production"
- Check `VITE_FORCE_LOCAL_MODE` is NOT set
- Verify deployment is on Vercel (not localhost)

---

## 🎯 Performance Targets

| Metric | Target | Current |
|:-------|:-------|:--------|
| Manuscript Generation | < 30s | ~25s (Gemini) |
| Cover Generation | < 10s | ~8s (Fal.ai) |
| Uptime SLA | 99.5% | TBD |
| API Error Rate | < 1% | TBD |

---

## 📞 Support

For deployment issues:
- Email: support@publishlab.ink
- Documentation: https://publishlab.ink/docs
