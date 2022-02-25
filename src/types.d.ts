interface Shared {
  id: number
  name: string
  slug: string
}

export interface Artist extends Shared {}
export interface Label extends Shared {}

interface WithArtists {
  artists: Artist[]
  remixers: Artist[]
  label: Label
}

export interface Release extends Shared, WithArtists {
  type: "release"
  /** modified in service worker, is usually empty */
  tracks: Track[]
}

export interface ReleaseIdentifier extends Shared {}

export interface Track extends Shared, WithArtists {
  type: "track"
  mix: string
  release: ReleaseIdentifier
}

export type BeatportWindow = Window & typeof globalThis & {
  ProductDetail: Release
  Playables: {
    tracks: Track[]
  }
}

export interface Rules {
  patches: {
    replace: string,
    with: string
  }[]
  capitalizations: string[]
}