// Warning: This file has been synced from chironapp. Do not modify or it will be overwritten.

// api/startListEntriesPublic.ts
import { supabase } from "../lib/supabase";

/**
 * Fetch a single public start list entry
 * Only returns public data from race_start_list_results table
 * @param participantId - The ID of the participant
 * @returns Promise with public start list entry data
 */
export async function fetchStartListEntryPublic(participantId: string) {
  try {
    const { data, error } = await supabase
      .from("race_start_list_results")
      .select("*")
      .eq("id", participantId)
      .single();

    if (error) {
      console.error("Error fetching start list entry:", error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error fetching start list entry:", error);
    throw error;
  }
}
