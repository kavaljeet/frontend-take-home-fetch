import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Dog, DogsState } from "../../types";
import { fetchBreeds, fetchDogDetails, matchDog, searchDogs } from "../../api/dogApi";
import { fetchLocationsByCityOrState, fetchLocationsByZipCode } from "../../api/locationsApi";
import { isValidGeoBoundingBox } from "../../utils/geo-state";

const initialState: DogsState = {
  breeds: [],
  selectedBreed: null,
  dogs: [],
  loading: false,
  error: null,
  total: 0,
  next: null,
  prev: null,
  matchedDogId: null
}

// fetch all available dog breeds
export const getBreeds = createAsyncThunk<string[], void>("dogs/getBreeds", async (_, { rejectWithValue }) => {
  try {
    return await fetchBreeds();
  } catch (error) {
    return rejectWithValue("Failed to fetch breeds.") as any;
  }
});

//  fetch dogs based on filters
export const getDogs = createAsyncThunk(
  "dogs/getDogs",
  async (
    filters: {
      breeds?: string[];
      zipCodes?: string[];
      city?: string;
      states?: string[];
      geoBoundingBox?: {
        top?: { lat: number; lon: number };
        left?: { lat: number; lon: number };
        bottom?: { lat: number; lon: number };
        right?: { lat: number; lon: number };
      };
      ageMin?: number;
      ageMax?: number;
      sort?: "breed:asc" | "breed:desc";
      size?: number;
      from?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      let finalZipCodes: string[] | undefined = filters.zipCodes;

      if (filters.geoBoundingBox) {
        if (!isValidGeoBoundingBox(filters.geoBoundingBox)) {
          return rejectWithValue("Invalid geoBoundingBox format.");
        }

      }

      if (filters.city || filters.states || filters.geoBoundingBox) {
        const locationResponse = await fetchLocationsByCityOrState({
          city: filters.city,
          states: filters.states,
          geoBoundingBox: filters.geoBoundingBox,
        });

        finalZipCodes = locationResponse.map((loc) => loc.zip_code);
        if (finalZipCodes.length === 0) {
          return rejectWithValue("Please enter a valid US city.");
        }
      }

      const searchResult = await searchDogs({
        breeds: filters.breeds,
        zipCodes: finalZipCodes,
        ageMin: filters.ageMin,
        ageMax: filters.ageMax,
        sort: filters.sort,
        size: filters.size,
        from: filters.from,
      });
      
      // Fetch detailed dog data
      let dogs = await fetchDogDetails(searchResult.resultIds);
      dogs = dogs.filter((dog) => dog && dog?.zip_code);
      const uniqueZipCodes = [...new Set(dogs.map((dog) => dog?.zip_code))];
      const locations = await fetchLocationsByZipCode(uniqueZipCodes);
      const validLocations = locations.filter((loc) => loc && loc.zip_code);
      const locationMap = Object.fromEntries(
        validLocations.map((loc) => [loc.zip_code, loc])
    );

  
      const dogsWithLocation = dogs.map((dog) => ({
        ...dog,
        location: locationMap[dog.zip_code] || null,
      }));

      return {
        dogs: dogsWithLocation,
        total: searchResult.total,
        next: searchResult.next,
        prev: searchResult.prev,
      };
    } catch (error) {
      console.error("error is : ", error)
      return rejectWithValue("Failed to fetch dogs.");
    }
  }
);

// find a matching dog from a list of dog IDs
export const getDogMatch = createAsyncThunk(
  "dogs/getDogMatch",
  async (dogIds: string[], { rejectWithValue }) => {
    try {
      const matchResult = await matchDog(dogIds);
      return matchResult.match;
    } catch (error) {
      return rejectWithValue("Failed to find a match.");
    }
  }
);

// Redux slice for managing dog-related state
const dogsSlice = createSlice({
  name: "dogs",
  initialState,
  reducers: {
    setSelectedBreed: (state, action: PayloadAction<string | null>) => {
      state.selectedBreed = action.payload;
    },
    setDogs: (state, action: PayloadAction<Dog[]>) => {
      state.dogs = action.payload; 
    },
    clearDogs: (state) => {
      state.dogs = [];
    },
    clearError: (state) => {
      state.error = null; 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBreeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBreeds.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.breeds = action.payload;
        state.loading = false;
      })
      .addCase(getDogs.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(getDogs.fulfilled, (state, action: PayloadAction<{ dogs: Dog[]; total: number; next: string | null; prev: string | null }>) => {
        state.dogs = action.payload.dogs;
        state.total = action.payload.total;
        state.next = action.payload.next;
        state.prev = action.payload.prev;
        state.loading = false;
      })
      .addCase(getDogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; 
        state.dogs = [];
      })
      .addCase(getDogMatch.fulfilled, (state, action: PayloadAction<string>) => {
        state.matchedDogId = action.payload;
      });

  },
});

export const { setSelectedBreed , clearError , setDogs } = dogsSlice.actions;
export default dogsSlice.reducer;
