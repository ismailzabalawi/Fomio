# /Visiona/AppStructure.md

## Fomio App Structure

The structure of Fomio is designed to offer users clarity, freedom, and deep engagement from the first interaction. It supports both casual browsing and focused community involvement, blending minimalist design with scalable architecture.

---

## 1. Hierarchy: Hubs → Terets → Bytes

The foundation of Fomio’s structure is a three-tiered system that replaces the outdated Category/Subcategory/Thread model with a more fluid, user-centric hierarchy:

### 🧭 Hubs  
**Definition:** Broad thematic spaces that group related communities.  
**Purpose:** Acts as the entry point for exploration and topical discovery.  
**Examples:** `Tech`, `Art & Design`, `Gaming`, `Global Affairs`, `Wellness`

### 🧩 Terets  
**Definition:** Sub-communities within Hubs, based on shared interest, goals, or focus.  
**Purpose:** Allows users to dive deep into niche topics or formats.  
**Behavior:** Can be application-based, curated, or open depending on moderation settings.  
**Examples:** Within the `Tech` Hub → `iOS Development`, `FOSS Projects`, `Tech Humor`

### 💬 Bytes  
**Definition:** The primary content unit – a post, thought, question, or media.  
**Purpose:** Sparks conversation, community interaction, and discovery.  
**Types:**  
- Text  
- Link  
- Image/Video  
- Poll  
- Carousel  
- Anonymized (optional)

---

## 2. Navigation Model

### 🔀 Hybrid Navigation
Inspired by modern social apps like Twitter/X, Fomio adopts a hybrid navigation approach:
- **Bottom Tab Bar** (core navigation):
  - Home Feed
  - Search & Discover
  - Create Byte
  - Notifications
  - Profile

- **Sidebar Drawer** (extended features):
  - My Hubs & Terets
  - Bookmarks
  - Settings
  - Mod/Admin tools (if applicable)
  - Theme toggle

This system ensures easy reachability for common actions, while the sidebar provides deeper access to personalization and management.

---

## 3. Feed System

### 🔥 Hot Topics Feed  
- Pulled from the backend (Discourse API).
- Showcases trending Bytes across public Terets.
- Prioritizes engagement and real-time activity.
- Ideal for discovery and staying up-to-date.

### 🌱 Personal Feed  
- Curated based on followed Terets.
- Sorted by latest activity or user preference (toggle view).
- Enables deep focus and consistent community experience.

---

## 4. Posting & Interaction

### Create Byte Flow  
- Quick action from the center tab.
- Simple form with post type picker (Text, Link, Image, etc.)
- Optional tags, Teret selector, and visibility settings.
- Minimal barriers to expression.

### Interaction Types  
- ❤️ Like  
- 🔖 Bookmark  
- 💬 Comment (threaded replies)  
- 🔄 Share (link or Byte repost to another Teret)

---

## 5. Personalization

### Themes  
- Light and Dark modes available from launch.
- Future: Support for user-generated themes (similar to Mihon/Tachiyomi).

### Feed Preferences  
- Choose sorting: Latest, Most Active, or Random Byte.
- Filter content by media type, tag, or length.

---

## 6. Offline Experience

- Locally cached Bytes, Terets, and Hubs.
- Smart preload of personal feed on launch.
- Allows read, write (queued post), and reply while offline.

---

## 7. Community Moderation Structure

- Each Teret has its own moderator(s).
- Hubs are administered by trusted users or creators.
- Tools for moderation include:
  - AI-assisted flagging
  - Transparent mod logs
  - Appeal/reputation systems

---

## 8. Scalability & Modularity

The hierarchy and feed logic support:
- Expansion to thousands of Terets without performance degradation.
- Introducing new formats (Live Threads, Audio Bytes) without breaking structure.
- Integration of monetization, moderation upgrades, and deeper personalization as optional modules.

---

## Summary

Fomio’s app structure is designed to feel simple yet powerful:
- Clean navigation
- Logical content hierarchy
- Personalization without clutter
- Empowered communities
- Privacy-first infrastructure

This structure empowers users to explore broadly, dive deeply, and return often.

> This structure acts as the blueprint for the UI/UX and frontend personas to begin visualizing the core user journey and interaction models.