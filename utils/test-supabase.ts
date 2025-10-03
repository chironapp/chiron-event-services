/**
 * Test file to verify Supabase configuration works correctly for anonymous access
 * Run with: npx tsx utils/test-supabase.ts
 */

import {
  checkDatabaseConnection,
  getDatabaseStats,
  supabase,
} from "../lib/supabase";

async function testSupabaseConnection() {
  console.log("🧪 Testing Supabase anonymous connection...");

  try {
    // Test database connection health
    console.log("🔍 Checking database connection...");
    const connectionCheck = await checkDatabaseConnection();

    if (!connectionCheck.connected) {
      console.error("❌ Database connection failed:", connectionCheck.error);
      return false;
    }

    console.log("✅ Database connection successful");
    console.log(`📊 Connection verified at: ${connectionCheck.timestamp}`);

    // Test database statistics
    console.log("📈 Fetching database statistics...");
    const stats = await getDatabaseStats();

    if (stats.error) {
      console.warn("⚠️  Stats fetch had issues:", stats.error);
    }

    console.log(`📊 Database Statistics:`);
    console.log(`   - Organisers: ${stats.organisers}`);
    console.log(`   - Events: ${stats.events}`);
    console.log(`   - Last Updated: ${stats.lastUpdated}`);

    // Test direct data access (anonymous)
    console.log("🔍 Testing direct data access...");
    const { data: sampleOrganisers, error: orgError } = await supabase
      .from("organisers")
      .select("id, name")
      .limit(3);

    if (orgError) {
      console.error("❌ Organisers query failed:", orgError.message);
      return false;
    }

    console.log(`✅ Anonymous data access working`);
    console.log(
      `� Sample organisers: ${sampleOrganisers?.length || 0} records`
    );

    if (sampleOrganisers && sampleOrganisers.length > 0) {
      sampleOrganisers.forEach((org, index) => {
        console.log(`   ${index + 1}. ${org.name} (${org.id.slice(-8)})`);
      });
    }

    console.log("🔓 Access Mode: Anonymous (no authentication required)");

    return true;
  } catch (error) {
    console.error("❌ Test failed:", error);
    return false;
  }
}

// Run the test
testSupabaseConnection()
  .then((success) => {
    if (success) {
      console.log("🎉 All tests passed!");
    } else {
      console.log("💥 Some tests failed");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("💥 Test runner failed:", error);
    process.exit(1);
  });
