import { prisma } from "../lib/prisma";

const truncate = !process.argv.includes("--no-truncate");

async function seedRoles() {
  const roles = [
    {
      id: 1,
      role_name: "Chief Information Security Officer",
    },
    { id: 2, role_name: "Risk Manager" },
    { id: 3, role_name: "IT Asset Manager" },
    { id: 4, role_name: "Data Protection Officer" },
    { id: 5, role_name: "Infrastructure Lead" },
    { id: 6, role_name: "Compliance Analyst" },
  ];

  await Promise.all(
    roles.map((record) =>
      prisma.role.upsert({
        where: { id: record.id },
        update: {},
        create: {
          id: record.id,
          role_name: record.role_name,
        },
      }),
    ),
  );
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('role', 'id'), COALESCE((SELECT MAX(id) FROM role), 1))`;
  const recordsTotal = roles.length;
  console.log(`Seeded ${recordsTotal} roles.`);
}

async function seedAssetTypes() {
  const assetTypes = [
    { id: 1, asset_type_name: "Hardware" },
    { id: 2, asset_type_name: "Software" },
    { id: 3, asset_type_name: "Cloud Product" },
    { id: 4, asset_type_name: "Client Database" },
    { id: 5, asset_type_name: "Network Equipment" },
    { id: 6, asset_type_name: "PII" },
  ];

  await Promise.all(
    assetTypes.map((record) =>
      prisma.asset_type.upsert({
        where: { id: record.id },
        update: {},
        create: { id: record.id, asset_type_name: record.asset_type_name },
      }),
    ),
  );
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('asset_type', 'id'), COALESCE((SELECT MAX(id) FROM asset_type), 1))`;
  const recordsTotal = assetTypes.length;
  console.log(`Seeded ${recordsTotal} asset types.`);
}

async function seedAssets() {
  const assets = [
    {
      id: 1,
      asset_name: "Executive Laptop",
      asset_type_id: 1,
      role_id: 3,
    },
    {
      id: 2,
      asset_name: "Developer Desktop",
      asset_type_id: 1,
      role_id: 5,
    },
    {
      id: 3,
      asset_name: "CISO Laptop",
      asset_type_id: 1,
      role_id: 1,
    },
    {
      id: 4,
      asset_name: "External Hard Drive",
      asset_type_id: 1,
      role_id: 3,
    },
    { id: 5, asset_name: "Microsoft Office 365", asset_type_id: 2, role_id: 3 },
    { id: 6, asset_name: "Adobe Creative Cloud", asset_type_id: 2, role_id: 6 },
    { id: 7, asset_name: "Slack Desktop Client", asset_type_id: 2, role_id: 2 },
    { id: 8, asset_name: "1Password Business", asset_type_id: 2, role_id: 1 },
    { id: 9, asset_name: "Jira", asset_type_id: 3, role_id: 2 },
    { id: 10, asset_name: "Confluence", asset_type_id: 3, role_id: 6 },
    { id: 11, asset_name: "Google Drive", asset_type_id: 3, role_id: 5 },
    {
      id: 12,
      asset_name: "Microsoft Azure Active Directory",
      asset_type_id: 3,
      role_id: 1,
    },
    {
      id: 13,
      asset_name: "Salesforce CRM Database",
      asset_type_id: 4,
      role_id: 4,
    },
    {
      id: 14,
      asset_name: "Oracle Customer Records DB",
      asset_type_id: 4,
      role_id: 2,
    },
    {
      id: 15,
      asset_name: "MongoDB Atlas Analytics Store",
      asset_type_id: 4,
      role_id: 3,
    },
    {
      id: 16,
      asset_name: "Cisco Catalyst 9300 Switch",
      asset_type_id: 5,
      role_id: 5,
    },
    {
      id: 17,
      asset_name: "Palo Alto PA-220 Firewall",
      asset_type_id: 5,
      role_id: 1,
    },
    {
      id: 18,
      asset_name: "Ubiquiti UniFi Access Point",
      asset_type_id: 5,
      role_id: 5,
    },
    { id: 19, asset_name: "Payroll Records", asset_type_id: 6, role_id: 4 },
    {
      id: 20,
      asset_name: "Customer Identity Documents",
      asset_type_id: 6,
      role_id: 4,
    },
    { id: 21, asset_name: "Server Rack Unit", asset_type_id: 1, role_id: 5 },
    { id: 22, asset_name: "USB Security Key", asset_type_id: 1, role_id: 1 },
    { id: 23, asset_name: "Splunk SIEM", asset_type_id: 2, role_id: 1 },
    { id: 24, asset_name: "Microsoft Defender for Endpoint", asset_type_id: 2, role_id: 3 },
    { id: 25, asset_name: "AWS S3", asset_type_id: 3, role_id: 5 },
    { id: 26, asset_name: "Cloudflare WAF", asset_type_id: 3, role_id: 1 },
    { id: 27, asset_name: "PostgreSQL Production Database", asset_type_id: 4, role_id: 5 },
    { id: 28, asset_name: "Employee HR Database", asset_type_id: 4, role_id: 4 },
    { id: 29, asset_name: "Fortinet FortiGate Firewall", asset_type_id: 5, role_id: 5 },
    { id: 30, asset_name: "Employee Medical Records", asset_type_id: 6, role_id: 4 },
  ];

  await Promise.all(
    assets.map((record) =>
      prisma.asset.upsert({
        where: { id: record.id },
        update: {},
        create: {
          id: record.id,
          asset_name: record.asset_name,
          asset_type_id: record.asset_type_id,
          role_id: record.role_id,
        },
      }),
    ),
  );
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('asset', 'id'), COALESCE((SELECT MAX(id) FROM asset), 1))`;
  const recordsTotal = assets.length;
  console.log(`Seeded ${recordsTotal} assets.`);
}

async function main() {
  if (truncate) {
    await prisma.$executeRaw`TRUNCATE TABLE asset, asset_type, role RESTART IDENTITY CASCADE`;
    console.log("Tables truncated.");
  }

  await seedRoles();
  await seedAssetTypes();
  await seedAssets();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
