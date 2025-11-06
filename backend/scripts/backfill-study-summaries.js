const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function toMd(summary) {
  if (!summary) return '';
  if (Array.isArray(summary)) {
    return summary.map((s) => `- ${s}`).join('\n');
  }
  try {
    // Try parse JSON
    const parsed = typeof summary === 'string' ? JSON.parse(summary) : summary;
    if (Array.isArray(parsed)) {
      return parsed.map((s) => `- ${s}`).join('\n');
    }
  } catch (e) {
    // not JSON
  }
  return String(summary);
}

async function main() {
  const sheets = await prisma.studySheet.findMany();
  console.log(`Found ${sheets.length} study sheets`);
  for (const s of sheets) {
    const md = await toMd(s.summary);
    await prisma.studySheet.update({ where: { id: s.id }, data: { summaryMd: md } });
    console.log(`Backfilled ${s.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
