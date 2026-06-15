// Minimal ambient declaration for the Kakao Maps JS SDK, which is loaded at
// runtime via <script> (see src/lib/kakao.ts). The full SDK surface is large;
// we type the global loosely and keep typed wrappers in src/lib/kakao.ts.
export {};

declare global {
  const kakao: any;
  interface Window {
    kakao: any;
  }
}
