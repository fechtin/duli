import type { Destination, Dish, ProvinceContent, Restaurant } from "@/lib/types";
import { krNorthDishes } from "./food/dishes-north.ts";
import { krSouthDishes } from "./food/dishes-south.ts";
import { krRestaurants } from "./food/restaurants.ts";

// One module per first-level unit (17 시도), grouped below into the 7 conventional travel
// regions of data/registry/kr.mjs. Per-province files keep every module under the 500-LOC
// rule as the atlas grows.
import { seoulDestinations, seoulProvince } from "./regions/seoul.ts";
import { seoulModernDestinations } from "./regions/seoul-modern.ts";
import { incheonDestinations, incheonProvince } from "./regions/incheon.ts";
import { gyeonggiDestinations, gyeonggiProvince } from "./regions/gyeonggi.ts";
import { gyeonggiNorthDestinations } from "./regions/gyeonggi-north.ts";
import { gangwonDestinations, gangwonProvince } from "./regions/gangwon.ts";
import { chungbukDestinations, chungbukProvince } from "./regions/chungbuk.ts";
import { chungnamDestinations, chungnamProvince } from "./regions/chungnam.ts";
import { daejeonDestinations, daejeonProvince } from "./regions/daejeon.ts";
import { sejongDestinations, sejongProvince } from "./regions/sejong.ts";
import { jeonbukDestinations, jeonbukProvince } from "./regions/jeonbuk.ts";
import { jeonnamDestinations, jeonnamProvince } from "./regions/jeonnam.ts";
import { gwangjuDestinations, gwangjuProvince } from "./regions/gwangju.ts";
import { gyeongbukDestinations, gyeongbukProvince } from "./regions/gyeongbuk.ts";
import { gyeongjuDestinations } from "./regions/gyeongju.ts";
import { daeguDestinations, daeguProvince } from "./regions/daegu.ts";
import { gyeongnamDestinations, gyeongnamProvince } from "./regions/gyeongnam.ts";
import { busanDestinations, busanProvince } from "./regions/busan.ts";
import { ulsanDestinations, ulsanProvince } from "./regions/ulsan.ts";
import { jejuDestinations, jejuProvince } from "./regions/jeju.ts";

type ProvinceEditorial = Omit<ProvinceContent, "destinationIds">;

/**
 * Korea atlas authoring seed (Vietnamese source language, like the Vietnam one).
 * This is the AUTHORING source for D1 — scripts/build-d1-seed.mjs reads it; the client
 * always goes through the Worker API.
 */
export const destinationsKr: Destination[] = [
  // Sudogwon 수도권
  ...seoulDestinations,
  ...seoulModernDestinations,
  ...incheonDestinations,
  ...gyeonggiDestinations,
  ...gyeonggiNorthDestinations,
  // Gangwon 강원권
  ...gangwonDestinations,
  // Chungcheong 충청권
  ...chungbukDestinations,
  ...chungnamDestinations,
  ...daejeonDestinations,
  ...sejongDestinations,
  // Honam 호남권
  ...jeonbukDestinations,
  ...jeonnamDestinations,
  ...gwangjuDestinations,
  // Gyeongbuk 대구·경북권
  ...gyeongbukDestinations,
  ...gyeongjuDestinations,
  ...daeguDestinations,
  // Gyeongnam 부산·경남권
  ...gyeongnamDestinations,
  ...busanDestinations,
  ...ulsanDestinations,
  // Jeju 제주권
  ...jejuDestinations,
];

export const dishesKr: Dish[] = [...krNorthDishes, ...krSouthDishes];
export const restaurantsKr: Restaurant[] = krRestaurants;

export const provinceContentKr: Record<string, ProvinceEditorial> = {
  seoul: seoulProvince,
  incheon: incheonProvince,
  gyeonggi: gyeonggiProvince,
  gangwon: gangwonProvince,
  chungbuk: chungbukProvince,
  chungnam: chungnamProvince,
  daejeon: daejeonProvince,
  sejong: sejongProvince,
  jeonbuk: jeonbukProvince,
  jeonnam: jeonnamProvince,
  gwangju: gwangjuProvince,
  gyeongbuk: gyeongbukProvince,
  daegu: daeguProvince,
  gyeongnam: gyeongnamProvince,
  busan: busanProvince,
  ulsan: ulsanProvince,
  jeju: jejuProvince,
};
