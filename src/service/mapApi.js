import axios from "axios";

const MAP_API_BASE_URL = "https://maps.ots.vn/api/v1";
const API_KEY = import.meta.env.VITE_API_KEY;

// Danh sách categories được hỗ trợ
const SUPPORTED_CATEGORIES = [
  "health",
  "security", 
  "education",
  "traffic",
  "airport",
  "bank",
  "cafe",
  "church",
  "fire_station",
  "government_office",
  "museum",
  "park",
  "police",
  "post_office",
  "traffic_police",
  "fire"
];

// Hàm validation category
const validateCategory = (category) => {
  if (!SUPPORTED_CATEGORIES.includes(category)) {
    throw new Error(`Invalid category: ${category}. Supported categories: ${SUPPORTED_CATEGORIES.join(', ')}`);
  }
  return true;
};

export const searchPlaces = async (
  category,
  regionCodes = "75",
  size = 10,
  nextPageTokens = null
) => {
  // Validate category trước khi xử lý
  validateCategory(category);
  
  let text, types;
  switch (category) {
    case "health":
      text = "Việt Nam";
      types = "hospital,clinic,medical_station,medical_center";
      break;
    case "security":
      text = "Việt Nam";
      types = "police,traffic_police";
      break;
    case "education":
      text = "Đồng Nai";
      types = "college,university";
      break;
    case "traffic":
      text = "Việt Nam";
      types = "traffic_police";
      break;
    case "airport":
      text = "Việt Nam";
      types = "airport";
      break;
    case "bank":
      text = "Việt Nam";
      types = "bank";
      break;
    case "cafe":
      text = "Việt Nam";
      types = "cafe";
      break;
    case "church":
      text = "Việt Nam";
      types = "church";
      break;
    case "fire_station":
      text = "Việt Nam";
      types = "fire_station";
      break;
    case "government_office":
      text = "Việt Nam";
      types = "government_office";
      break;
    case "museum":
      text = "Việt Nam";
      types = "museum";
      break;
    case "park":
      text = "Việt Nam";
      types = "park";
      break;
    case "police":
      text = "Việt Nam";
      types = "police";
      break;
    case "post_office":
      text = "Việt Nam";
      types = "post_office";
      break;
    case "traffic_police":
      text = "Việt Nam";
      types = "traffic_police";
      break;
    case "fire":
      // Alias for fire_station for backward compatibility
      text = "Việt Nam";
      types = "fire_station";
      break;
    default:
      throw new Error(`Invalid category: ${category}. Supported categories: health, security, education, traffic, airport, bank, cafe, church, fire_station, government_office, museum, park, police, post_office, traffic_police, fire`);
  }

  try {
    const promises = regionCodes.map(async (regionCode, index) => {
      const params = {
        text,
        types,
        size,
        apikey: API_KEY,
        region_code: regionCode,
        "focus.point.lat": 11.499669,
        "focus.point.lon": 106.913091,
      };

      if (nextPageTokens && nextPageTokens[index]) {
        params.next_page_token = nextPageTokens[index];
      }

      console.log(`Making API request to: ${MAP_API_BASE_URL}/search`);
      console.log(`Request params:`, params);

      const response = await axios.get(`${MAP_API_BASE_URL}/search`, {
        params,
        headers: {
          "app-version": "1.1",
        },
      });

      console.log(
        `API response for ${category} - region ${regionCode}:`,
        response.data
      );
      console.log(`Response status: ${response.status}`);
      console.log(`Features count: ${response.data.features?.length || 0}`);

      const nextToken = response.data.meta?.pagination?.next_page_token || null;
      console.log(
        `Next page token from meta.pagination for region ${regionCode}: ${nextToken}`
      );

      return {
        regionCode,
        features: response.data.features || [],
        nextPageToken: nextToken,
      };
    });

    const results = await Promise.all(promises);

    // Gộp tất cả features từ các region codes
    const allFeatures = results.flatMap((result) => result.features);

    // Tạo map các tokens theo region code
    const tokensByRegion = {};
    results.forEach((result) => {
      if (result.nextPageToken) {
        tokensByRegion[result.regionCode] = result.nextPageToken;
      }
    });

    console.log(`Total features from all regions: ${allFeatures.length}`);
    console.log(`Tokens by region:`, tokensByRegion);

    return {
      features: allFeatures,
      tokensByRegion,
      hasMoreData: Object.keys(tokensByRegion).length > 0,
    };
  } catch (error) {
    console.error(`Lỗi khi tìm kiếm địa điểm (${category}):`, error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error(
        "Request was made but no response received:",
        error.request
      );
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

// Export supported categories
export const getSupportedCategories = () => {
  return [...SUPPORTED_CATEGORIES];
};

// Export validation function
export { validateCategory };
