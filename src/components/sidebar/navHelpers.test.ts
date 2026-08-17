import { beforeEach, describe, expect, it } from "vitest";
import festivalCalendar from "@/data/living/festival-calendar.json";
import flowerCalendar from "@/data/living/flower-calendar.json";
import seasonalCalendar from "@/data/living/seasonal-calendar.json";
import { useMapStore } from "@/lib/store/useMapStore";
import { hasPhoto } from "@/components/ui/IllustratedImage";
import { calendarSeed, focusDestinationById } from "./navHelpers";

/**
 * Ids whose card is honestly blank, mirrored from `scripts/check-photos.mjs`. `ho-chi-minh-city`
 * opens a province and has no destination to borrow a cover from.
 *
 * `perfume-pagoda` sat here until chua-huong got a photo, and this assertion is what demanded the
 * line be deleted rather than left to rot — an exemption that cannot expire is a hiding place.
 */
const NO_PHOTO_YET = new Set(["ho-chi-minh-city"]);

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

    // No exemptions. An id with nothing to open needs a destination authored for it — which is
    // what perfume-pagoda (Chùa Hương) got — not a coordinate that only moves the camera.
    expect(selectedDestination ?? selectedProvince).not.toBeNull();
  });

  /**
   * The second half of the same join. `ha-giang-loop` passed the test above for months — it opened
   * Đèo Mã Pì Lèng correctly — while its card sat under a blank gradient, because the photo lookup
   * was a *separate* hand-kept table with a hole in it. A card that navigates somewhere real must
   * also look like somewhere real.
   *
   * `calendarSeed` derives the seed from the same table the assertion above exercises, so this now
   * reads as a tautology. It is kept because a future "just this once" override table would break
   * it, which is exactly the mistake worth catching twice.
   */
  it.each(LIVING_IDS.filter((id) => !NO_PHOTO_YET.has(id)))("%s draws a real photo", (id) => {
    expect(hasPhoto(calendarSeed(id))).toBe(true);
  });

  it.each([...NO_PHOTO_YET])("%s is still waiting for a photo", (id) => {
    // Fails once the photo lands — the exemption has to be deleted, not left to hide a gap.
    expect(hasPhoto(calendarSeed(id))).toBe(false);
  });
});
