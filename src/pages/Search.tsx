import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  clearError,
  getBreeds,
  getDogMatch,
  getDogs,
  setDogs,
  setSelectedBreed,
} from "../store/slices/dogSlice";
import { fetchDogDetails } from "../api/dogApi";
import { Dog, Location } from "../types";
import { fetchLocationsByZipCode } from "../api/locationsApi";
import Header from "../components/Header";
import DogCard from "../components/DogCard";
import Footer from "../components/Footer";
import { US_STATES } from "../utils/us-states";

const Search = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { breeds, selectedBreed, dogs, loading, error } = useSelector(
    (state: RootState) => state.dog
  );

  const [zipCode, setZipCode] = useState<string>("");
  const [ageMin, setAgeMin] = useState<number | undefined>();
  const [ageMax, setAgeMax] = useState<number | undefined>();
  const [sort, setSort] = useState<"breed:asc" | "breed:desc">("breed:asc");
  const [size, setSize] = useState(25);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [offset, setOffset] = useState(0);
  const [city, setCity] = useState<string>("");
  const [states, setStates] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [total, setTotal] = useState(0);


  useEffect(() => {
    dispatch(getBreeds());
  }, [dispatch]);

  useEffect(() => {
    setErrorMessage(null);
    dispatch(clearError());
  }, [city, zipCode, states, ageMin, ageMax, sort, size, dispatch]);

  // Run an initial search when the component mounts
  useEffect(() => {
    handleSearch();
  }, []);

  // Fetch dogs using our own computed offset rather than the API's next/prev URL
  const fetchDogs = async (from?: number) => {
    try {
      const currentOffset = from !== undefined ? from : 0;
      const response = await dispatch(
        getDogs({
          breeds: selectedBreed ? [selectedBreed] : undefined,
          zipCodes: zipCode ? [zipCode] : undefined,
          city: city || undefined,
          states: states.length > 0 ? states : undefined,
          ageMin,
          ageMax,
          sort,
          size,
          from: currentOffset,
        })
      ).unwrap();

      setTotal(response.total);

      if (response.dogs.length === 0) {
        setErrorMessage("No dogs found near this location.");
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
    }
  };

  const handleSearch = async () => {
    setMatchedDog(null);
    setOffset(0); // Reset offset when doing a new search
    setErrorMessage(null);
    setHasSearched(true);
    dispatch(clearError());
    dispatch(setDogs([]));
    if (zipCode && !/^\d{5}$/.test(zipCode)) {
      setErrorMessage("Please enter a valid 5-digit zip code.");
      dispatch(setDogs([]));
      return;
    }

    await fetchDogs(0);
  };

  const handleNextPage = async () => {
    // Only paginate if there are enough results to fill the current page
    if (offset + size >= total) return;

    const newOffset = offset + size;
    setOffset(newOffset);
    await fetchDogs(newOffset);
  };

  const handlePrevPage = async () => {
    if (offset === 0) return;
    const newOffset = Math.max(offset - size, 0);
    setOffset(newOffset);
    await fetchDogs(newOffset);
  };

  const handleFindMatch = async () => {
    if (dogs.length === 0) return;

    setMatchError(null);

    try {
      const dogIds = dogs.map((dog) => dog.id);
      const matchedDogId = await dispatch(getDogMatch(dogIds)).unwrap();
      const matchedDogDetails = await fetchDogDetails([matchedDogId]);
      if (matchedDogDetails.length > 0) {
        const matchedDog = matchedDogDetails[0];

        const locationData: Location[] = await fetchLocationsByZipCode([
          matchedDog.zip_code,
        ]);

        setMatchedDog({
          ...matchedDog,
          location: locationData.length > 0 ? locationData[0] : undefined,
        });
      }
    } catch (error) {
      setMatchError("Failed to find a match. Please try again.");
      console.error("Error finding match:", error);
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Search Filters */}
        <section className="p-4 sm:p-8 max-w-5xl mx-auto bg-white shadow-md rounded-md mt-6">
          <h2 className="text-2xl font-bold text-center mb-4">Search Dogs</h2>
          <div className="flex flex-wrap gap-4 items-center justify-center mb-4">
            <select
              className="p-2 border rounded w-full sm:w-auto"
              value={selectedBreed || ""}
              onChange={(e) => dispatch(setSelectedBreed(e.target.value))}
            >
              <option value="">All Breeds</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>

            <select
              className="p-2 border rounded w-full sm:w-auto"
              value={states.length > 0 ? states[0] : ""}
              onChange={(e) =>
                setStates(
                  [...e.target.selectedOptions]
                    .map((opt) => opt.value)
                    .filter((value) => value !== "")
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            >
              <option value="">Select a state</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name} ({state.code})
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min Age"
              className="p-2 border rounded w-full sm:w-auto"
              value={ageMin || ""}
              onChange={(e) => setAgeMin(Number(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />

            <input
              type="number"
              placeholder="Max Age"
              className="p-2 border rounded w-full sm:w-auto"
              value={ageMax || ""}
              onChange={(e) => setAgeMax(Number(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />

            <input
              type="text"
              placeholder="Zip Code"
              className="p-2 border rounded w-full sm:w-auto"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />

            <input
              type="text"
              placeholder="City"
              className="p-2 border rounded w-full sm:w-auto"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />


            <select
              className="p-2 border rounded w-full sm:w-auto"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            >
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>

            <select
              className="p-2 border rounded w-full sm:w-auto"
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as "breed:asc" | "breed:desc")
              }
            >
              <option value="breed:asc">Breed (A-Z)</option>
              <option value="breed:desc">Breed (Z-A)</option>
            </select>
          </div>

          {(errorMessage || error) && (
            <p className="text-red-500 text-center mt-2 mb-2">
              {errorMessage || error}
            </p>
          )}

          {matchError && (
            <p className="text-red-500 text-center mt-2 mb-2">{matchError}</p>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Search
            </button>

            <button
              onClick={handleFindMatch}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Find My Match
            </button>
          </div>
        </section>

        {matchedDog && (
          <section className="max-w-lg mx-auto p-4 mt-6 border rounded bg-yellow-100 shadow-md">
            <h3 className="text-lg font-bold text-center">Your Matched Dog</h3>
            <img
              src={matchedDog.img}
              alt={matchedDog.name}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <p>
              <strong>Name:</strong> {matchedDog.name}
            </p>
            <p>
              <strong>Breed:</strong> {matchedDog.breed}
            </p>
            <p>
              <strong>Age:</strong> {matchedDog.age}
            </p>
            <p>
              <strong>ZIP Code:</strong> {matchedDog.zip_code}
            </p>
            {matchedDog.location && (
              <>
                <p>
                  <strong>City:</strong> {matchedDog.location.city}
                </p>
                <p>
                  <strong>State:</strong> {matchedDog.location.state}
                </p>
              </>
            )}
          </section>
        )}

        {/* Results */}
        <section className="max-w-5xl mx-auto p-4 mt-6 bg-white shadow-md rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {loading ? (
              <div className="w-full col-span-3 flex justify-center mt-4">
                <p className="text-center text-gray-600 ">Loading results...</p>
              </div>
            ) : dogs.length > 0 ? (
              dogs.map((dog) => <DogCard key={dog.id} dog={dog} />)
            ) : (
              hasSearched && (
                <div className="w-full col-span-3 flex justify-center mt-4">
                  <p className="text-red-500 text-lg">No search results</p>
                </div>
              )
            )}
          </div>

          {/* Updated Pagination: using our computed offset and total */}
          <div className="mt-6 flex justify-center gap-4">
            {offset > 0 && (
              <button
                onClick={handlePrevPage}
                disabled={loading}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded min-w-[100px] text-center"
              >
                Previous
              </button>
            )}

            {offset + size < total && (
              <button
                onClick={handleNextPage}
                disabled={loading}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded min-w-[100px] text-center"
              >
                Next
              </button>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
