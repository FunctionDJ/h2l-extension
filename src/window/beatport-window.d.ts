export type BeatportWindow = Window & typeof globalThis & {
  ProductDetail: any
  Playables: {
    tracks: any[]
  }
}