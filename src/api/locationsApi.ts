import { Location, LocationSearchResponse } from "../types";
import apiClient from "./apiClient";

//fetch location details based on ZIP codes
export const fetchLocationsByZipCode = async (zipCodes: string[]): Promise<Location[]> => {
  const response = await apiClient.post<Location[]>("/locations", zipCodes);
  return response.data
}


export const fetchLocationsByCityOrState = async (filters: {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: { lat: number; lon: number };
    left?: { lat: number; lon: number };
    bottom?: { lat: number; lon: number };
    right?: { lat: number; lon: number };
  };
}): Promise<Location[]> => {
  const response = await apiClient.post<LocationSearchResponse>("/locations/search", filters);
  return response.data.results;
};