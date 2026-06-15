// Seoul 27-neighborhood preset — PRD §17. Coordinates are approximate centroids
// of each 상권 (commercial district), used for map markers and for auto-suggesting
// the nearest neighborhood on registration (§17.2).

export interface Neighborhood {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
}

export const NEIGHBORHOODS: readonly Neighborhood[] = [
  // 서북 (홍대 벨트)
  { id: 'yeonnam', name: '연남동', region: '서북', lat: 37.5631, lng: 126.9255 },
  { id: 'yeonhui', name: '연희동', region: '서북', lat: 37.5689, lng: 126.929 },
  { id: 'hongdae', name: '홍대', region: '서북', lat: 37.5571, lng: 126.9237 },
  { id: 'hapjeong', name: '합정', region: '서북', lat: 37.5495, lng: 126.9137 },
  { id: 'mangwon', name: '망원', region: '서북', lat: 37.5556, lng: 126.9019 },
  { id: 'sangsu', name: '상수', region: '서북', lat: 37.5478, lng: 126.9226 },
  { id: 'sinchon', name: '신촌', region: '서북', lat: 37.5585, lng: 126.9369 },
  { id: 'ewha', name: '이대', region: '서북', lat: 37.5568, lng: 126.9462 },

  // 도심 (고궁·한옥)
  { id: 'ikseon', name: '익선동', region: '도심', lat: 37.5743, lng: 126.9905 },
  { id: 'seochon', name: '서촌', region: '도심', lat: 37.579, lng: 126.97 },
  { id: 'bukchon', name: '북촌', region: '도심', lat: 37.5826, lng: 126.985 },
  { id: 'samcheong', name: '삼청동', region: '도심', lat: 37.584, lng: 126.981 },
  { id: 'euljiro', name: '을지로', region: '도심', lat: 37.5664, lng: 126.992 },
  { id: 'gwangjang', name: '광장시장', region: '도심', lat: 37.5701, lng: 126.9997 },

  // 성수 벨트
  { id: 'seongsu', name: '성수동', region: '성수', lat: 37.5447, lng: 127.0558 },
  { id: 'seoulforest', name: '서울숲', region: '성수', lat: 37.5443, lng: 127.0374 },
  { id: 'ttukseom', name: '뚝섬', region: '성수', lat: 37.5471, lng: 127.0475 },
  { id: 'konkuk', name: '건대', region: '성수', lat: 37.5404, lng: 127.0703 },

  // 강남
  { id: 'garosugil', name: '가로수길', region: '강남', lat: 37.5205, lng: 127.0228 },
  { id: 'apgujeong', name: '압구정', region: '강남', lat: 37.5274, lng: 127.0286 },
  { id: 'cheongdam', name: '청담', region: '강남', lat: 37.5193, lng: 127.0533 },
  { id: 'gangnam', name: '강남역', region: '강남', lat: 37.4979, lng: 127.0276 },
  { id: 'dosan', name: '도산공원', region: '강남', lat: 37.5237, lng: 127.036 },

  // 한남·이태원
  { id: 'hannam', name: '한남동', region: '한남·이태원', lat: 37.534, lng: 127.0 },
  { id: 'itaewon', name: '이태원', region: '한남·이태원', lat: 37.5345, lng: 126.9946 },
  { id: 'haebangchon', name: '해방촌', region: '한남·이태원', lat: 37.5421, lng: 126.9869 },
  { id: 'gyeongnidan', name: '경리단길', region: '한남·이태원', lat: 37.5388, lng: 126.9886 },
] as const;

export const NEIGHBORHOODS_BY_ID: Record<string, Neighborhood> = Object.fromEntries(
  NEIGHBORHOODS.map((n) => [n.id, n]),
);

/**
 * Nearest preset neighborhood to a coordinate (§17.2 auto-suggest).
 * Uses an equirectangular approximation — accurate enough at city scale.
 */
export function nearestNeighborhood(lat: number, lng: number): Neighborhood {
  let best = NEIGHBORHOODS[0];
  let bestDist = Infinity;
  const latRad = (lat * Math.PI) / 180;
  for (const n of NEIGHBORHOODS) {
    const dLat = lat - n.lat;
    const dLng = (lng - n.lng) * Math.cos(latRad);
    const dist = dLat * dLat + dLng * dLng;
    if (dist < bestDist) {
      bestDist = dist;
      best = n;
    }
  }
  return best;
}
