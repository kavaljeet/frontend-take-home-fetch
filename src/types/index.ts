export interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
    location?: Location; 
}

export interface Location {
  zip_code: string; 
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}


export interface DogSearchResponse {
    resultIds: string[];
    total: number;
    next?: string;
    prev?: string;
}


export interface Coordinates {
    lat: number;
    lon: number;
  }
  
  export interface LocationSearchResponse {
    results: Location[];
    total: number;
  }

 export  interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }

  export interface DogsState {
    breeds: string[];
    selectedBreed: string | null;
    dogs: Dog[];
    loading: boolean;
    error: string | null;
    total: number;         
    next: string | null;   
    prev: string | null;  
    matchedDogId: string| null;
}


export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GeoBoundingBox {
  top: Coordinates;
  left: Coordinates;
  bottom: Coordinates;
  right: Coordinates;
}

export interface DogSearchFilters {
  breeds?: string[];
  zipCodes?: string[];
  city?: string;
  states?: string[];
  geoBoundingBox?: GeoBoundingBox;
  ageMin?: number;
  ageMax?: number;
  sort?: "breed:asc" | "breed:desc";
  size?: number;
  from?: number;
}
