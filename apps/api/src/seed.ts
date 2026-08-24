import { getDb } from "./db";
import { seedEvents } from "./data/seedEvents";

async function main() {
  const db = getDb();
  const events = seedEvents();
  let created = 0;
  let skipped = 0;
  for (const event of events) {
    const existing = await db.getEventBySlug(event.slug);
    if (existing) {
      // eslint-disable-next-line no-console
      console.log(`Already seeded, skipping: ${event.title} (${event.slug})`);
      skipped++;
      continue;
    }
    await db.upsertEvent(event);
    // eslint-disable-next-line no-console
    console.log(`Seeded event: ${event.title} (${event.slug})`);
    created++;
  }
  // eslint-disable-next-line no-console
  console.log(`\nDone. Created ${created}, skipped ${skipped} (already present).`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
