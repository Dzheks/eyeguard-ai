# VELVET & SOUL — Channel Clone Package

Cloned style reference: Lady of Soul (@LadyOfSoul263) — faceless AI-generated vintage blues & soul lounge music channel.
Niche: Faceless AI music — vintage blues & soul, female vocal, lounge atmosphere.

---

## 1. BRANDING BRIEF

### Name variants (5 — original, not copies of source)
1. Velvet & Soul ← **SELECTED**
2. Midnight Velvet Vocals
3. Smoke & Honey Sessions
4. The Soulful Hour
5. Velvet Ember Blues

### Channel descriptions (2 variants, in source channel's voice)

**A.**
🎙️ Velvet & Soul — Where Every Note Carries a Memory 🎶
Step into a smoky little room where the lights are low and the voice on the mic sounds like it's lived a thousand heartbreaks. This channel is a tribute to the golden age of blues and soul — built for listeners who crave warmth, grain, and feeling over polish.
We craft original vocal blues & soul pieces inspired by the legends of the genre, recorded with a vintage heart:
🥃 Rich, smoky female vocals full of ache and warmth
🎷 Mellow sax, slow guitar, brushed drums
🕯️ A late-night, candlelit lounge atmosphere
This is music for the quiet hours — for missing someone, for healing, for simply feeling something honest.

**B.**
🎙️ Smoke & Honey Sessions — Classic Soul for Modern Hearts 🎶
Welcome to a sound built on a love letter to old blues bars and soul records that crackle with feeling. Every track here is composed in-house, channeling the spirit of the greats without ever copying them.
What you'll find on this channel:
🎵 Original blues & soul compositions with vintage warmth
🎤 Deep, emotional female vocals
🌙 Slow-burning instrumentation — guitar, sax, soft percussion
✨ An intimate, nostalgic mood made for unwinding
Come sit with us a while. The room is warm, the mic is hot, and the night is long.

### Logo prompt
Vintage pin-up style illustrated portrait of a soulful female singer leaning into a retro ribbon microphone, painterly oil-texture rendering, warm sepia and deep amber tones with subtle gold highlights, soft moody studio lighting, elegant retro hairstyle and minimal jewelry, circular art-deco frame border, 1950s soul-club aesthetic, no text, no logo watermark.

### Banner prompt
Wide YouTube banner, deep crimson-red background with a warm radial gold glow, centered circular portrait illustration of a vintage female blues/soul singer performing into a retro microphone, painterly hand-illustrated style, gold ring border around the portrait, elegant cursive and serif typography "Velvet & Soul" placed left and right of the portrait with generous safe-zone margin, cinematic warm lighting, nostalgic 1950s-60s soul-bar mood, rich red/gold/black/cream palette.

---

## 2. VISUAL STYLE PROFILE

| Field | Spec |
|---|---|
| Art style | Cinematic photoreal AI-generated film look, vintage 1950s-60s jazz/blues lounge aesthetic, sepia-leaning grade, film grain, chromatic-aberration/RGB-split artifacts |
| Color palette | #2a1810, #6b4226, #c9a06b, #8a1f1f, #0a0806, #d9c9a3, #4a3826, #1c2b3a, #f2e3c6, #5e1414 |
| Lighting style | Low-key single-source lighting, spotlight beams through haze, deep shadow falloff, candle-glow warmth |
| Camera style | Medium/medium-wide shots, slightly soft focus, shallow DOF, static or slow drift, 3/4 angles |
| Composition | Singer foreground/midground near mic stand, blurred band silhouettes behind, layered depth |
| Detail level | Photoreal rendering, period wardrobe (slip/halter dresses, pin-curled hair), moderate set dressing |
| Line quality | Photographic/cinematic, soft focus, grain, light chromatic fringing |
| Mood | Nostalgic, intimate, smoky, melancholic, romantic |

**Character anatomy lock:**
Realistic photoreal female vocalist, 1950s-60s styling, soft wavy or pin-curled hair (brunette or platinum blonde), fair skin with warm cinematic tone, fitted vintage slip/halter evening dress, minimal jewelry, always performing at a vintage ribbon or chrome microphone on a stand, natural realistic proportions, no cartoon/anime/illustrated stylization.

**Environment locks:**
- ENV_jazz_lounge: dim vintage jazz/blues club interior — wooden bar lined with bottles, string/pendant lighting, leather booths, neon/marquee signage with brand name, warm amber-brown haze (#3a2418, #6b4226, #c9a06b)
- ENV_stage_spotlight: dark stage, single overhead spotlight beam (#f2e3c6) through smoky air, blurred band silhouettes, near-black backdrop (#0a0806)
- ENV_period_street: sepia-toned vintage city street at night, wet reflective pavement, period cars/pedestrians, neon marquee signage — used for intro/title-card beats (#2a1810, #1c2b3a)

**Negative prompt base:**
modern clothing, smartphones/modern technology, cartoon/anime/flat-vector style, oversaturated colors, bright flat daylight, sterile/even lighting, garbled or illegible signage text, extra/distorted limbs or hands, plastic-looking skin, obvious 3D-render look, watermarks, low-resolution artifacts

---

## 3. VIDEO FORMAT (simplified — single hero image + equalizer, no per-beat prompts)

| Field | Spec |
|---|---|
| Format type | Single static/looping hero image + audio-reactive equalizer overlay |
| Video duration | 60–120 min continuous mix |
| Visual layer 1 | Hero background image (Visual Style Profile) |
| Visual layer 2 | Equalizer/waveform overlay baked into image, animated via Veo3 |

### Variation 1 — Lounge spotlight (hero/main)
**Image prompt:**
Cinematic photoreal vintage jazz/blues lounge interior, dim warm tungsten lighting with a single spotlight beam cutting through smoky haze, blurred silhouettes of a small band (upright bass, drums, piano) in the background, empty vintage ribbon microphone stand center-stage softly lit, leather booths and string lights, warm amber-brown palette (#3a2418, #6b4226, #c9a06b, #0a0806), film grain, slight chromatic aberration, no people in sharp focus, no readable text, no logo. Integrated into the bottom third of the frame: a row of slim vertical equalizer bars in warm gold-cream tone (#c9a06b) with soft glow, semi-transparent, varying bar heights, rendered as part of the same photographic scene (not a flat UI overlay) — looks like light bars reflecting off a glass surface or bar counter. Composition designed as a single static hero frame for a looping ambient music video.

**Veo3 animation prompt:**
Animate this still frame as a seamless ambient loop. Keep camera locked/static — no pans, no zooms. Motion to add: equalizer bars at the bottom pulse and bounce subtly and rhythmically, varying height, soft gold glow breathing in intensity; smoke/haze drifts slowly upward and sideways through the spotlight beam; spotlight beam has a faint flicker/shimmer; background band silhouettes stay still or sway almost imperceptibly; practical lights have a very subtle warm flicker. Mood: slow, hypnotic, late-night lounge ambience. Output should loop cleanly (last frame matches first). Duration: 8 sec, loop-extended to fill 60–120 min.

### Variation 2 — Close vocalist silhouette
**Image prompt:**
Cinematic photoreal close-medium shot of a female blues/soul vocalist in silhouette and warm rim light, head tilted back slightly, singing into a vintage chrome microphone on a stand, soft hair backlit by a single overhead spotlight, deep haze in the background with faint string lights, warm amber-black palette (#0a0806, #3a2418, #c9a06b), shallow depth of field, film grain, slight chromatic aberration, no readable text, no logo. Bottom third of frame: slim vertical equalizer bars in warm gold-cream (#c9a06b) with soft glow, semi-transparent, bar heights varied, rendered as part of the photographic scene (e.g. reflecting off a glass tabletop in foreground).

**Veo3 animation prompt:**
Animate as a seamless ambient loop, camera locked/static. Equalizer bars pulse and bounce rhythmically with varying height, gentle glow breathing; singer's hair and the spotlight beam have subtle drifting haze/smoke passing through; very slight, slow sway in posture — nothing reading as a clear gesture or lip movement; background string lights flicker faintly. Mood: intimate, smoky, melancholic. Loop must match first/last frame. Duration: 8 sec, loop-extended.

### Variation 3 — Wide club room with brand signage
**Image prompt:**
Cinematic photoreal wide shot of a dim vintage blues/soul lounge interior, wooden bar lined with bottles, leather booths, pendant lights, a neon-script marquee sign reading "Velvet & Soul" glowing warm red-gold on the back wall, empty room mood (no sharp-focus people, only soft ambient figures far in the blur), warm haze, palette (#3a2418, #6b4226, #8a1f1f, #c9a06b, #0a0806), film grain, slight chromatic aberration, no other readable text, no logo. Bottom third of frame: slim vertical equalizer bars in warm gold-cream (#c9a06b) with soft glow, semi-transparent, varied bar heights, integrated as a light-reflection element on the bar countertop.

**Veo3 animation prompt:**
Animate as a seamless ambient loop, camera locked/static. Equalizer bars pulse and bounce rhythmically, soft glow breathing; neon sign has a faint warm flicker/buzz; haze drifts slowly across the room; pendant lights have a subtle warm shimmer. Mood: nostalgic, hushed, late-night. Loop must match first/last frame. Duration: 8 sec, loop-extended.

---

## 4. MUSIC & TITLE FORMULA DNA

| Field | Spec |
|---|---|
| Genre | Vintage blues & soul, female vocal, slow-tempo lounge |
| BPM range | 60-80 bpm |
| Instrumentation | Mellow electric/upright guitar, warm tenor sax, brushed/soft drums, upright bass, occasional piano |
| Vocal style | Original AI-composed female vocals, smoky/rich timbre, restrained delivery |
| Track/mix length | 90-120 min continuous mix |
| Generation stack | AI music composition tool + Veo3/Kling for looping visual, AI/manual mastering for vintage warmth (tape hiss, vinyl crackle) |

**Title formula:**
`[Mood/Time hook] + Blues & Soul [Subgenre tag] | [Reference-era descriptor] Classics for [Emotional benefit]`

**Title batch:**
1. Velvet Blues & Soul | Smoky Vintage Classics for a Heavy Heart
2. Late Night Soul Ballads | Timeless Blues for Quiet Moments Alone
3. Smooth & Soulful | 1960s-Style Blues Classics for Deep Relaxation
4. Heartbreak Blues Sessions | Velvet Vocals for Healing & Letting Go
5. Midnight Lounge Blues | Soulful Female Vocals for Stress Relief
6. Golden Era Soul & Blues | Vintage Classics for a Slow Rainy Evening
7. Velvet & Soul Love Songs | Timeless Ballads for Missing Someone
8. Smoky Jazz Bar Blues | Soulful Vocals for Late Night Unwind
9. Classic Soul Heartache | Velvet Blues Ballads for Emotional Healing
10. Soulful Sunday Blues | Vintage Lounge Classics for Inner Peace

---

## 5. THUMBNAIL DNA

| Field | Spec |
|---|---|
| Text style | Bold heavy condensed sans-serif keyword (all caps, white-to-ice-blue gradient glow) + thin cursive script connector words |
| Composition | Close-up moody portrait (averted gaze), text lockup center-right, ornamental crest above text, music-note + runtime badge bottom-left |
| Color contrast | Near-black background (#0a0806), desaturated moody skin tones, white-to-ice-blue gradient text (#ffffff → #6ec6e8), crimson/gold accents (#8a1f1f, #c9a06b) |
| Emotion triggers | Nostalgia, heartbreak/melancholy, familiarity-by-association, intimacy via averted gaze |
| Style variants | A: color portrait + cursive lockup (primary) / B: monochrome moonlit portrait + bold gradient word |
| Recurring devices | Crest/flourish above title, vintage mic + runtime badge bottom-left, "Blues"/"Soul" as largest word |

### Thumbnail concepts

**THUMBNAIL 1**
Visual concept: Close-up moody color portrait, singer looking down, single spotlight, smoky lounge blur behind
Text overlay: "VELVET BLUES"
Emotion trigger: Nostalgia + intimacy
Prompt: Cinematic photoreal close-up of a 1950s-styled female soul singer, eyes downcast, warm spotlight from above, smoky jazz lounge blurred behind her, vintage chrome microphone at chin height, warm amber-black palette (#0a0806, #6b4226, #c9a06b), bold gradient text "VELVET BLUES" top-right in white-to-ice-blue condensed caps with thin cursive "and Soul" beneath, small ornamental crest above text, music-note runtime badge bottom-left, film grain.

**THUMBNAIL 2**
Visual concept: Black-and-white moonlit portrait, dramatic/melancholic
Text overlay: "HEARTBREAK SOUL"
Emotion trigger: Heartbreak/melancholy
Prompt: Cinematic monochrome close-up of a female soul singer under cold moonlight, dramatic shadow across half her face, vintage ribbon microphone, faint moon softly blurred in background, deep blacks and silver-grays, bold gradient text "HEARTBREAK SOUL" stacked center-right in white-to-ice-blue condensed caps, thin cursive "Velvet Ballads" beneath, ornamental crest above, runtime badge bottom-left.

**THUMBNAIL 3**
Visual concept: Wide silhouette shot, singer at mic, band blurred behind, warm color
Text overlay: "TIMELESS BLUES"
Emotion trigger: Familiarity/comfort
Prompt: Cinematic photoreal wide-medium shot of a female soul singer in silhouette at a vintage microphone stand, warm spotlight beam through haze, blurred band silhouettes in background, amber-brown palette (#3a2418, #6b4226, #c9a06b), bold gradient text "TIMELESS BLUES" center in white-to-ice-blue condensed caps, cursive "and Soul" beneath, crest above, runtime badge bottom-left.

**THUMBNAIL 4**
Visual concept: Tight emotional close-up, hand near face, candle-lit warmth
Text overlay: "SOULFUL HEALING"
Emotion trigger: Comfort/healing
Prompt: Cinematic photoreal extreme close-up of a female soul singer's face lit by warm candle-like glow, hand resting near her collarbone, eyes closed, soft smoky background blur, warm amber palette (#6b4226, #c9a06b, #0a0806), bold gradient text "SOULFUL HEALING" top-center in white-to-ice-blue condensed caps, thin cursive "Velvet Sessions" beneath, ornamental crest above, runtime badge bottom-left.

**THUMBNAIL 5**
Visual concept: Rainy vintage street establishing shot, silhouette walking away
Text overlay: "LATE NIGHT BLUES"
Emotion trigger: Loneliness/atmosphere
Prompt: Cinematic sepia-toned vintage city street at night, wet reflective pavement, a female silhouette in a coat walking beneath a streetlamp, neon marquee glow in the distance, period cars parked along the curb, bold gradient text "LATE NIGHT BLUES" lower-center in white-to-ice-blue condensed caps, thin cursive "Velvet & Soul" beneath, ornamental crest above, runtime badge bottom-left.

---

## Source rule (always)
Never copy wording/visuals from the source channel verbatim — match style only, keep all content original.
