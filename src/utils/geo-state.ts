export const isValidGeoBoundingBox = (
    geoBoundingBox: {
      top?: { lat: number; lon: number };
      left?: { lat: number; lon: number };
      bottom?: { lat: number; lon: number };
      right?: { lat: number; lon: number };
      bottom_left?: { lat: number; lon: number };
      top_right?: { lat: number; lon: number };
      bottom_right?: { lat: number; lon: number };
      top_left?: { lat: number; lon: number };
    }
  ): boolean => {
    const isValidCoordinate = (coord: { lat: number; lon: number } | undefined) => {
      return (
        coord &&
        typeof coord.lat === 'number' &&
        typeof coord.lon === 'number' &&
        coord.lat >= -90 && coord.lat <= 90 &&
        coord.lon >= -180 && coord.lon <= 180
      );
    };
  
    // Check for the first combination: top, left, bottom, right
    if (
      isValidCoordinate(geoBoundingBox.top) &&
      isValidCoordinate(geoBoundingBox.left) &&
      isValidCoordinate(geoBoundingBox.bottom) &&
      isValidCoordinate(geoBoundingBox.right)
    ) {
      return true;
    }
  
    // Check for the second combination: bottom_left, top_right
    if (
      isValidCoordinate(geoBoundingBox.bottom_left) &&
      isValidCoordinate(geoBoundingBox.top_right)
    ) {
      return true;
    }
  
    // Check for the third combination: bottom_right, top_left
    if (
      isValidCoordinate(geoBoundingBox.bottom_right) &&
      isValidCoordinate(geoBoundingBox.top_left)
    ) {
      return true;
    }
  
    // If none of the combinations are valid, return false
    return false;
  };