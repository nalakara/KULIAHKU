# KULIAHKU — Architecture & Design Guide

> **Core Philosophy**:
> - **Modular Yet Integrated**: Modules have explicit boundaries and responsibilities, yet compose seamlessly into one cohesive student application.
> - **Simple Enough but Fully Functional**: We prefer the simplest architecture that genuinely works. Zero external AI dependencies, zero unnecessary state management libraries, zero premature backend servers.

---

## 1. System Overview

KULIAHKU is a client-side, offline-first Progressive Web Application (PWA) designed specifically for Visual Communication Design (DKV) students. It manages course schedules, visual task boards with moodboards & color palettes, focus timers, design portfolios, and semester learning plans (RPS).

```text
src/
├── app/
│   └── App.tsx                 # Top-level composition & tab coordination
├── components/                 # Presentation views and modals
├── domain/                     # Pure, deterministic business logic
│   ├── academic.ts             # Course schedule calculations, SKS, RPS tracking
│   ├── tasks.ts                # Urgency, stage transitions, RPS-to-task generator
│   ├── portfolio.ts            # Portfolio filters, tags, showcase metrics
│   ├── focus.ts                # Timer presets, study session aggregation
│   └── notifications.ts        # Upcoming class & deadline alert checks
├── infrastructure/             # Persistence, hardware APIs & audio
│   ├── storage/
│   │   ├── idb.ts              # Lightweight native IndexedDB promise wrapper
│   │   ├── appStorage.ts       # Structured collection storage & JSON backup
│   │   ├── assetStore.ts       # Binary Blob asset store with ObjectURL cache
│   │   └── migration.ts        # Safe idempotent legacy localStorage migration
│   └── audio/
│       └── audioAlert.ts       # Web Audio API synthesizer for focus bells
├── data/
│   └── initialData.ts          # Seed data
└── types.ts                    # Core TypeScript domain models
```

---

## 2. Module Responsibilities & Boundaries

| Module | Primary Responsibility | Dependency Rules |
| :--- | :--- | :--- |
| **`src/domain/*`** | Pure deterministic calculations (e.g. deadline urgency, study stats, course filtering). | **Zero framework dependency.** Never import React, DOM, or storage. Must remain 100% unit-testable. |
| **`src/infrastructure/storage/*`** | Asynchronous IndexedDB persistence, binary Blob management, data migration, and offline JSON backup/restore. | Encapsulates IndexedDB. UI components interact via high-level storage APIs or `<AssetImage />`. |
| **`src/infrastructure/audio/*`** | Synthesizes zen focus bells (528Hz) and celebratory arpeggios directly via Web Audio API oscillators. | Zero network requests or audio file downloads. |
| **`src/components/*`** | UI presentation, user interactions, local form state. | Calls domain functions for business calculations; delegates persistence to storage infrastructure. |
| **`src/App.tsx`** | Top-level application composition, active tab routing, and modal coordination. | No heavy business logic algorithms. |

---

## 3. Storage & Asset Architecture

Previous versions stored all application data and uploaded images as Base64 Data URLs inside `localStorage`, which easily exceeded the browser's ~5MB quota limit.

The refactored storage separates structured data from binary assets:

```text
Application Data                    Image & Media Assets
       ↓                                     ↓
IndexedDB 'app_data'                IndexedDB 'asset_store'
(courses, tasks, settings, etc.)    (Blobs keyed by asset:id)
       │                                     │
       └─────────────────┬───────────────────┘
                         ↓
            Hydrated into UI Components
             via <AssetImage src={...} />
```

### Key Principles:
1. **Asset Store (`assetStore.ts` & `src/components/AssetImage.tsx`)**:
   - Uploaded files are converted to native `Blob` objects and stored in the `asset_store` object store.
   - Tasks, portfolio items, and user profile store a lightweight key (`asset:asset_<timestamp>_<hash>`) or external URL.
   - The `<AssetImage />` component ([src/components/AssetImage.tsx](file:///Users/yudhan/Documents/FRAMEWORKS/KULIAHKU/src/components/AssetImage.tsx)) and `useAssetUrl()` hook automatically resolve asset keys into temporary, memory-safe `blob:` Object URLs.
   - **Asset Garbage Collection**: `collectReferencedAssetIds()` scans active tasks, portfolio, and profile. `pruneOrphanedAssets()` safely purges unreferenced blobs from IndexedDB. Data safety is strictly preserved: no asset is ever deleted if it is referenced by any active record.
2. **Instant Hydration**:
   - Structured data is cached for instant first-frame render, while IndexedDB acts as the true source of persistence.
3. **Migration Strategy (`migration.ts`)**:
   - Automatically detects legacy `localStorage` keys (`dkv_*_v1`).
   - Extracts existing Base64 strings, converts them into Blobs in `asset_store`, and replaces them with `asset:` keys.
   - Sets `kuliahku_migrated_v1 = 'true'` and safely purges legacy Base64 from `localStorage`.
4. **Portable Offline Backup**:
   - `exportBackupData()` bundles all structured records and serializes currently referenced Blobs into a single, complete JSON file.
   - The backup can be restored on any other device/browser completely offline without bloating historical orphaned images.

---

## 4. Deterministic Intelligence (Zero AI)

KULIAHKU relies entirely on deterministic algorithms rather than AI models:
- **Deadline Urgency**: Dynamically evaluates hours and days remaining until deadline. Highlights overdue items and pulses when `< 24` hours remain.
- **RPS → Task Mapping**: Intelligently analyzes RPS meeting deliverables, topics, and course names using pattern matching to assign appropriate categories (e.g. `UI/UX & Prototype`, `Branding & Identitas`, `Tipografi & Editorial`).
- **Proactive Notifications**: A lightweight 60-second periodic interval checks if any of today's classes start within `courseAlertMinutes` or if any task is due within `taskAlertHours`, dispatching browser notifications safely.

---

## 5. What Remains Intentionally Deferred

To maintain simplicity and prevent over-engineering:
1. **Third-Party State Stores**: React's built-in state, custom hooks, and domain modules are fully sufficient. No Redux or Zustand.
2. **URL / History Routing**: Tab navigation meets all current user needs. No complex URL router is needed.
3. **Backend / Cloud Databases**: The app is strictly Local-First. Cloud synchronization is labeled as a future milestone rather than simulated.

---

## 6. How to Add a New Feature

When adding a new feature six months from now:
1. **Define Types**: Add any new interfaces to `src/types.ts`.
2. **Add Domain Logic**: Place pure calculations or transformation rules in `src/domain/<feature>.ts`.
3. **Write Unit Tests**: Add test assertions in `tests/domain.test.ts` and run `npm test`.
4. **Build Presentation**: Create a focused UI component in `src/components/`. If images are used, utilize `<AssetImage src={...} />`.
5. **Wire in Composition Layer**: Import the component and hook into `src/App.tsx`.
