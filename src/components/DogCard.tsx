import { Dog } from "../types";

const DogCard = ({ dog }: { dog: Dog }) => {
  return (
    <div className="border p-4 rounded shadow-md bg-white">
      <img
        src={dog.img}
        alt={dog.name}
        className="w-full h-48 object-cover rounded mb-2"
      />
      <h3 className="text-lg font-bold">{dog.name}</h3>
      <p>Breed: {dog.breed}</p>
      <p>Age: {dog.age}</p>
      <p>ZIP Code: {dog.zip_code}</p>
      {dog.location && (
        <>
          <p>
            <strong>City:</strong> {dog.location.city}
          </p>
          <p>
            <strong>State:</strong> {dog.location.state}
          </p>
        </>
      )}
    </div>
  );
};

export default DogCard;
