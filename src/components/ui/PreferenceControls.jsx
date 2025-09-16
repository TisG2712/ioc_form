import React, { useState } from "react";
import { FaSun, FaGlobe } from "react-icons/fa";

const PreferenceControls = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("vi");

  const languages = [
    {
      code: "vi",
      name: "Tiếng Việt",
      flag: "/src/assets/images/VN_flag.png",
    },
    {
      code: "en",
      name: "English",
      flag: "/src/assets/images/UK_flag.png",
    },
  ];

  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
    setIsLanguageOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
      {/* Theme Toggle Button */}
      <button
        className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-yellow-50 group"
        title="Chuyển đổi chế độ sáng/tối"
      >
        <FaSun className="w-4 h-4 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
      </button>

      {/* Language Selector */}
      <div className="relative">
        <button
          onClick={() => setIsLanguageOpen(!isLanguageOpen)}
          className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50 group"
          title="Chọn ngôn ngữ"
        >
          <FaGlobe className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
        </button>

        {/* Language Dropdown */}
        {isLanguageOpen && (
          <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl border border-gray-300 overflow-hidden z-50">
            <div className="py-0">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedLanguage === lang.code
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  <img
                    src={lang.flag}
                    alt={`${lang.name} flag`}
                    className="w-6 h-4 object-cover rounded-sm border border-gray-200"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <span
                    className="font-medium text-sm"
                    style={{
                      fontFamily: "'Roboto Condensed', Arial, sans-serif",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {lang.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreferenceControls;
