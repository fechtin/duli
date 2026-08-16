/**
 * Runs the itinerary engine across the ENTIRE input space and reports what comes out.
 *
 *   node --experimental-strip-types scripts/sweep-itineraries.mjs
 *   npm run sweep:trips
 *
 * Every province of both atlases × {3,5,7} days × three style/pace pairs — 720 itineraries. Unit
 * tests pin the rules; this pins the *behaviour in aggregate*, which is where this engine keeps
 * going wrong: four separate constants were tuned on Đà Nẵng and silently broke elsewhere (a
 * cross-province leg limit destroyed the Red River Delta; a province-centroid anchor put every
 * morning's drive in the middle of a field; a literal reading of "1 ngày" made three national parks
 * unschedulable in every trip the atlas can produce). None of those failed a test. All of them
 * showed up here in seconds.
 *
 * Exits non-zero if any HARD invariant breaks. The quality counters below it are judgement calls,
 * printed to be read rather than enforced.
 */
import { destinations } from "../src/data/destinations.ts";
import { destinationsKr } from "../src/data/kr/index.ts";
import { restaurants } from "../src/data/food/restaurants.ts";
import { itineraryPatterns } from "../src/data/itinerary-patterns.ts";
import geoVn from "../src/data/generated/geo-meta.vn.json" with { type: "json" };
import geoKr from "../src/data/generated/geo-meta.kr.json" with { type: "json" };
import { generateTrip } from "../src/lib/itinerary/plan.ts";
import { parseOpeningHours } from "../src/lib/itinerary/hours.ts";
import { DAY_END_MIN, DAY_START_MIN, MAX_TRAVEL_TO_VISIT_RATIO, PACE } from "../src/lib/itinerary/config.ts";

const mk = d => ({ id:d.id, slug:d.slug, provinceSlug:d.provinceSlug, name:d.name, type:d.type, lng:d.lng, lat:d.lat,
  badges:d.badges, tags:d.tags, featured:!!d.featured, visitDuration:d.visitDuration, openingHours:d.openingHours, nearby:d.nearby });

const ATLAS = {
  vn: { places: destinations.map(mk), provinces: geoVn.provinces.map(p=>({slug:p.slug,lng:p.centroid[0],lat:p.centroid[1]})),
        meals: restaurants.map(r=>({id:r.id,name:r.name,provinceSlug:r.provinceSlug,lng:r.lng,lat:r.lat,openHours:r.openHours,atlasScore:r.atlasScore})),
        patterns: itineraryPatterns },
  kr: { places: destinationsKr.map(mk), provinces: geoKr.provinces.map(p=>({slug:p.slug,lng:p.centroid[0],lat:p.centroid[1]})), meals: [] },
};

const approxKm=(a,b)=>Math.hypot((a.lng-b.lng)*108,(a.lat-b.lat)*111);
const legMin=(a,b)=>approxKm(a,b)*1.25/45*60;

const issues = new Map();
const stats = { runs:0, shortened:0, daysAsked:0, daysGot:0, stops:0 };
const add = (kind, detail) => { if(!issues.has(kind)) issues.set(kind,[]); issues.get(kind).push(detail); };

let runs = 0;
for (const [cc, data] of Object.entries(ATLAS)) {
  const byId = new Map(data.places.map(p=>[p.id,p]));
  const provinces = [...new Set(data.places.map(p=>p.provinceSlug))];
  for (const origin of provinces) {
    for (const days of [3,5,7]) {
      for (const [style,pace] of [["mixed","balanced"],["heritage","relaxed"],["nature","packed"]]) {
        runs++;
        const input={originProvince:origin,days,style,pace,interests:[],country:cc};
        let plan; try { plan = generateTrip(input, data); } catch(e){ add("THROWS", `${cc}/${origin} ${days}d ${style}/${pace}: ${e.message}`); continue; }
        const tag=`${cc}/${origin} ${days}d ${style}/${pace}`;
        stats.runs++; stats.daysAsked+=days; stats.daysGot+=plan.totalDays; stats.stops+=plan.totalStops;
        if (plan.notices.includes("shortened")) stats.shortened++;

        // --- hard invariants ---
        const ids = plan.days.flatMap(d=>d.stops.map(s=>s.destinationId));
        if (ids.length !== new Set(ids).size) add("duplicate-stop", tag);
        if (plan.totalDays > days) add("too-many-days", tag);
        if (plan.days.some(d=>!d.stops.length)) add("empty-day", tag);
        if (plan.totalDays < days && !plan.notices.includes("shortened")) add("silent-shorten", tag);
        if (plan.totalDays > 0 && plan.provinces[0] !== origin) add("origin-not-first", `${tag} -> ${plan.provinces[0]}`);
        if (plan.totalDays > 0 && plan.days[0].nightProvince !== origin) add("night1-not-origin", `${tag} -> ${plan.days[0].nightProvince}`);
        for (const d of plan.days) {
          if (!plan.provinces.includes(d.nightProvince)) add("night-outside-trip", `${tag} d${d.day}`);
          for (const s of d.stops) {
            const spec = parseOpeningHours(byId.get(s.destinationId).openingHours);
            if (spec.kind==="interval" && (s.arrivalMinutes < spec.openMin || s.departureMinutes > spec.closeMin)) add("outside-hours", `${tag} d${d.day} ${s.destinationId}`);
            if (s.arrivalMinutes < DAY_START_MIN || s.departureMinutes > DAY_END_MIN) add("outside-day", `${tag} d${d.day} ${s.destinationId}`);
            if (s.departureMinutes <= s.arrivalMinutes) add("zero-visit", `${tag} ${s.destinationId}`);
            if (s.travelFromPreviousMinutes % 5 !== 0) add("unrounded-travel", tag);
          }
          for (let i=1;i<d.stops.length;i++){
            const A=byId.get(d.stops[i-1].destinationId), B=byId.get(d.stops[i].destinationId);
            if (legMin(A,B) > d.stops[i].visitMinutes*MAX_TRAVEL_TO_VISIT_RATIO + 1) add("leg-not-worth-it", `${tag} d${d.day} ${A.id}->${B.id} ${Math.round(legMin(A,B))}p/${d.stops[i].visitMinutes}p`);
            if (d.stops[i].arrivalMinutes < d.stops[i-1].departureMinutes) add("overlapping-stops", `${tag} d${d.day}`);
          }
          // --- quality signals ---
          const budget = PACE[pace].activeMinutes;
          if (d.estimatedTravelMinutes > budget) add("day-mostly-driving", `${tag} d${d.day} ${d.estimatedTravelMinutes}p drive vs ${budget}p budget`);
          // A transfer day legitimately starts late — you spent the morning relocating.
          if (d.themeKey !== "transfer" && d.stops[0].arrivalMinutes > 11*60) add("late-start-no-transfer", `${tag} d${d.day} ${Math.floor(d.stops[0].arrivalMinutes/60)}:${String(d.stops[0].arrivalMinutes%60).padStart(2,"0")} drive ${d.estimatedTravelMinutes}p`);
          // A day is only "wasted" if it barely used its budget AND barely visited anything.
          if (d.stops.length === 1 && d.estimatedVisitMinutes < budget * 0.35) add("thin-day", `${tag} d${d.day} visit ${d.estimatedVisitMinutes}p of ${budget}p`);
        }
        // night thrash: A -> B -> A
        const nights = plan.days.map(d=>d.nightProvince);
        for (let i=2;i<nights.length;i++) if (nights[i]===nights[i-2] && nights[i]!==nights[i-1]) add("night-thrash", `${tag} ${nights.join(">")}`);

      }
    }
  }
}
console.log(`runs: ${runs} | shortened: ${stats.shortened} (${Math.round(100*stats.shortened/stats.runs)}%) | days delivered: ${stats.daysGot}/${stats.daysAsked} (${Math.round(100*stats.daysGot/stats.daysAsked)}%) | avg stops/day: ${(stats.stops/stats.daysGot).toFixed(2)}\n`);
const order=[...issues.entries()].sort((a,b)=>b[1].length-a[1].length);
for(const [k,v] of order) console.log(String(v.length).padStart(5), k, "  e.g. " + v.slice(0,2).join(" | "));
if(!order.length) console.log("no issues");

// Hard invariants must never fire; the rest are quality signals for a human to weigh.
const HARD = new Set([
  "THROWS", "duplicate-stop", "too-many-days", "empty-day", "silent-shorten", "origin-not-first",
  "night1-not-origin", "night-outside-trip", "outside-hours", "outside-day", "zero-visit",
  "unrounded-travel", "leg-not-worth-it", "overlapping-stops", "day-mostly-driving",
]);
const broken = order.filter(([k]) => HARD.has(k));
if (broken.length) {
  console.log(`\n✗ ${broken.length} hard invariant(s) broken`);
  process.exit(1);
}
console.log("\n✓ every hard invariant holds across all " + runs + " itineraries");
