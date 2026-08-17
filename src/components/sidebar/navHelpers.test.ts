import { beforeEach, describe, expect, it } from "vitest";
import festivalCalendar from "@/data/living/festival-calendar.json";
import flowerCalendar from "@/data/living/flower-calendar.json";
import seasonalCalendar from "@/data/living/seasonal-calendar.json";
import { useMapStore } from "@/lib/store/useMapStore";
import { focusDestinationById } from "./navHelpers";

/**
 * Every card in the sidebar's living sections — Today's Highlights, Festivals, Flowers — hands
 * `focusDestinationById` an id from the living calendars, which are written in an id namespace
 * of their own with no automatic relationship to the authoring destinations.
 *
 * Nothing else checks that the join lands. A broken id does not throw and does not look broken
 * in a diff: the card silently downgrades to "move the camera and open nothing", or, for an id
 * with no coordinates either, to `reset()` — which zooms the map back out to the whole country.
 * Both shipped. This test is the referee.
 */
const byMonth = (cal: Record<string, { destinationId: string }[]>) =>
  Object.values(cal).flatMap((entries) => entries.map((e) => e.destinationId));

const LIVING_IDS = [
  ...new Set([
    ...byMonth(seasonalCalendar as Record<string, { destinationId: string }[]>),
    ...byMonth(flowerCalendar as Record<string, { destinationId: string }[]>),
    ...festivalCalendar.festivals.flatMap((f) => f.destinationIds),
  ]),
].sort();

/**
 * Ids allowed to move the camera without opening a panel, because no destination honestly
 * matches them. Chùa Hương (Mỹ Đức, Hà Nội) is the only one: the authoring data has Chùa Hương
 * Tích in Hà Tĩnh, a different pagoda 230km south, so the near-miss name must not be mapped.
 * Add a destination rather than an entry here.
 */
const CAMERA_ONLY = new Set(["perfume-pagoda"]);

describe("focusDestinationById", () => {
  beforeEach(() => {
    useMapStore.setState({ selectedProvince: null, selectedDestination: null });
  });

  it("has living-calendar ids to check", () => {
    expect(LIVING_IDS.length).toBeGreaterThan(15);
  });

  it.each(LIVING_IDS)("%s opens a panel and keeps the map framed", (id) => {
    focusDestinationById(id);
    const { selectedDestination, selectedProvince, focusRequest } = useMapStore.getState();

    // `reset()` is the silent failure: the card looks alive but throws the reader back out to
    // the whole-country view. No living-calendar id may land there.
    expect(focusRequest.target.kind).not.toBe("reset");

    if (CAMERA_ONLY.has(id)) {
      expect(selectedDestination).toBeNull();
      return;
    }
    expect(selectedDestination ?? selectedProvince).not.toBeNull();
  });
});
