// Warning: This file has been synced from chironapp. Do not modify or it will be overwritten.

import { supabase } from "../lib/supabase";
import { Tables } from "../types/supabase";

export type Organiser = Tables<"organisers">;

/**
 * Fetch all organisers (public access)
 * @returns Promise<Organiser[] | null>
 */
export const fetchAllOrganisers = async (): Promise<Organiser[] | null> => {
  try {
    const { data, error } = await supabase
      .from("organisers")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching all organisers:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching all organisers:", error);
    return null;
  }
};

/**
 * Fetch a single organiser by ID
 * @param id - The organiser ID
 * @returns Promise<Organiser | null>
 */
export const fetchOrganiserById = async (
  id: string
): Promise<Organiser | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No authenticated user found");
      return null;
    }

    // First check if user is an admin of this organiser
    const { data: adminData, error: adminError } = await supabase
      .from("organiser_admins")
      .select("organiser_id")
      .eq("admin_id", user.id)
      .eq("organiser_id", id)
      .single();

    if (adminError || !adminData) {
      console.error("User is not an admin of this organiser");
      return null;
    }

    // Then fetch the organiser details
    const { data, error } = await supabase
      .from("organisers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching organiser by ID:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching organiser by ID:", error);
    return null;
  }
};
