export const formatLocation = (locationString) => {
    try {
      const location = JSON.parse(locationString); // Parse the string into an object
      const { lat, lon } = location;
  
      // Convert lat and lon to numbers and limit to 2 decimal places
      const formattedLat = parseFloat(lat).toFixed(2);
      const formattedLon = parseFloat(lon).toFixed(2);
  
      return `${formattedLon}`+` ; `+`${formattedLat}`; // Return formatted string
    } catch (error) {
      return 'Invalid location'; // Handle error if parsing fails
    }
  };
  