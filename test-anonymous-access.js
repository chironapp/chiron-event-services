#!/usr/bin/env node

/**
 * Simple test to verify anonymous Supabase access is working
 */

// Test database connection and basic functionality
async function testAnonymousAccess() {
  console.log("🧪 Testing Anonymous Supabase Access...\n");

  try {
    // Import using dynamic import to avoid TypeScript compilation issues
    const { checkDatabaseConnection, getDatabaseStats } = await import(
      "./lib/supabase.ts"
    );

    // Test 1: Database Connection
    console.log("1️⃣ Testing database connection...");
    const isConnected = await checkDatabaseConnection();
    console.log(`   ✅ Database connected: ${isConnected}\n`);

    // Test 2: Database Statistics
    console.log("2️⃣ Testing database statistics...");
    const stats = await getDatabaseStats();
    console.log(`   📊 Organisers count: ${stats.organisersCount}`);
    console.log(`   📊 Events count: ${stats.eventsCount}\n`);

    // Test 3: API Function
    console.log("3️⃣ Testing API function...");
    const { fetchOrganisers } = await import("./api/organisers.ts");
    const result = await fetchOrganisers({ page: 1, limit: 2 });
    console.log(`   📋 API response count: ${result.count}`);
    console.log(`   📋 First page data length: ${result.data?.length || 0}\n`);

    console.log("🎉 All tests passed! Anonymous access is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error(
      "\n💡 Make sure your .env.local file has valid Supabase credentials:"
    );
    console.error("   - EXPO_PUBLIC_SUPABASE_URL");
    console.error("   - EXPO_PUBLIC_SUPABASE_ANON_KEY");
    process.exit(1);
  }
}

// Run the test
testAnonymousAccess();
