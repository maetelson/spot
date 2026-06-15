// Kakao integration — PRD §18.4.
//
// Search note: the REST Local API needs a *secret* REST key and is meant to run
// server-side. In the browser we use the Maps JS SDK `services` library, which
// is built for client use with the JavaScript key + domain whitelist — no
// secret leaks into the bundle. If you later need richer server search, proxy
// the REST API behind a Supabase Edge Function with KAKAO_REST_KEY.

const SDK_URL =
  `https://dapi.kakao.com/v2/maps/sdk.js` +
  `?appkey=${import.meta.env.VITE_KAKAO_JS_KEY}&autoload=false&libraries=services`;

let loadPromise: Promise<void> | null = null;

/** Lazily inject + initialise the Kakao Maps SDK. Safe to call repeatedly. */
export function loadKakaoMaps(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.kakao?.maps) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SDK_URL;
    script.async = true;
    script.onerror = () => reject(new Error('Kakao Maps SDK 로드 실패'));
    script.onload = () => window.kakao.maps.load(() => resolve());
    document.head.appendChild(script);
  });
  return loadPromise;
}

export interface KakaoSearchResult {
  id: string;
  name: string;
  address: string;
  roadAddress: string;
  category: string;
  lat: number;
  lng: number;
  placeUrl: string;
}

/** Keyword search via the JS SDK services library (client-safe). PRD SCR-004. */
export async function searchPlaces(keyword: string): Promise<KakaoSearchResult[]> {
  if (!keyword.trim()) return [];
  await loadKakaoMaps();

  return new Promise<KakaoSearchResult[]>((resolve, reject) => {
    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(keyword, (data: any[], status: string) => {
      const S = window.kakao.maps.services.Status;
      if (status === S.OK) {
        resolve(
          data.map((d) => ({
            id: String(d.id),
            name: d.place_name,
            address: d.address_name,
            roadAddress: d.road_address_name ?? '',
            category: d.category_name ?? '',
            lat: Number(d.y),
            lng: Number(d.x),
            placeUrl: d.place_url,
          })),
        );
      } else if (status === S.ZERO_RESULT) {
        resolve([]);
      } else {
        reject(new Error(`Kakao 검색 실패: ${status}`));
      }
    });
  });
}

/** Directions deep link (app scheme + web fallback) — PRD §12.5. */
export function kakaoRouteLinks(name: string, lat: number, lng: number) {
  return {
    app: `kakaomap://route?ep=${lat},${lng}&by=FOOT`,
    web: `https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`,
  };
}
