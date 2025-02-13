import apiClient from "./apiClient";
import { Dog, DogSearchFilters } from "../types";

//fetch all dogs breed
export const fetchBreeds = async (): Promise<String[]> => {
  const response = await apiClient.get<string[]>("/dogs/breeds")
  return response.data
}


// Search for dogs based on filters
export const searchDogs = async (filters: DogSearchFilters) => {
  const queryParams = new URLSearchParams();
  if (filters.breeds) queryParams.append("breeds", filters.breeds.join(","));
  if (filters.zipCodes) {
    filters.zipCodes.forEach(zip => queryParams.append("zipCodes", zip));
  } if (filters.geoBoundingBox) queryParams.append("geoBoundingBox", JSON.stringify(filters.geoBoundingBox));
  if (filters.ageMin !== undefined) queryParams.append("ageMin", filters.ageMin.toString());
  if (filters.ageMax !== undefined) queryParams.append("ageMax", filters.ageMax.toString());
  if (filters.sort) queryParams.append("sort", filters.sort);
  if (filters.size) queryParams.append("size", filters.size.toString());
  if (filters.from) queryParams.append("from", filters.from.toString());

  const response = await apiClient.get(`/dogs/search?${queryParams.toString()}`);
  return response.data;
};


// Fetch detailed information about specific dogs
export const fetchDogDetails = async (ids: string[]): Promise<Dog[]> => {
  const response = await apiClient.post("/dogs", ids);
  return response.data;
};

// Match a user with a dog
export const matchDog = async (dogIds: string[]): Promise<{ match: string }> => {
  const response = await apiClient.post("/dogs/match", dogIds);
  return response.data;
};
