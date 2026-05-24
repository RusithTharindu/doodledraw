# DoodleDraw

<p align="center">
  <img src="./app/icon.svg" alt="DoodleDraw icon" width="96" height="96" />
</p>

DoodleDraw is a local-first drawing app built with Next.js and the embedded
Excalidraw editor. It runs in the browser, stores drawings in IndexedDB, and
does not require a backend, account, or cloud service.

## Features

- Embedded Excalidraw canvas for shapes, text, free draw, images, pan, zoom,
  undo, redo, selection, resizing, and moving.
- Local IndexedDB persistence using the `doodledraw-db` database and `designs`
  object store.
- Autosave with visible save status.
- Manual save for empty or in-progress drawings.
- Gallery view for saved drawings.
- Open and continue editing saved drawings.
- Rename, duplicate, and delete designs.
- Import `.excalidraw` and `.json` scene files.
- Export `.excalidraw`, `.json`, `.png`, and `.svg`.
- PNG thumbnail generation for gallery previews.
- Offline-friendly local storage architecture with no API routes, auth, or
  remote database.

## Routes

- `/` - Home page
- `/editor` - New drawing editor
- `/designs` - Saved drawing gallery
- `/design/[id]` - Edit an existing drawing

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- `@excalidraw/excalidraw`
- IndexedDB through `idb`
- `uuid`
- `date-fns`
- `lucide-react`

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start the production build:

```bash
npm run start
```

Run lint:

```bash
npm run lint
```

## Storage Model

Saved drawings use this shape:

```ts
type SavedDesign = {
  id: string;
  name: string;
  elements: ExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
};
```

The current storage implementation is `IndexedDBStorage`, wrapped behind a
storage abstraction so future sync or filesystem providers can be added without
rewriting the editor UI.

## Offline Behavior

DoodleDraw is designed to work locally. Once the app is loaded, drawings are
saved in the browser's IndexedDB. There is no authentication, no backend API,
and no server-side drawing persistence.
