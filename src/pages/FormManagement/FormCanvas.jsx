import React from "react";

const FormCanvas = ({
  formElements,
  onDragOver,
  onDrop,
  onDeleteElement,
  onClearAll,
  onSelectElement,
  selectedElement,
}) => {
  // --- Xử lý hiệu ứng drag vào canvas
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    e.currentTarget.classList.add("border-blue-400", "bg-blue-50");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-50");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-50");
    onDrop(e);
  };

  return (
    <div className="flex-1 bg-white mx-2 lg:mx-4 my-4 rounded-xl shadow-md border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="ri-layout-grid-line text-blue-600 text-2xl"></i>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Trình tạo biểu mẫu
              </h2>
              <p className="text-sm text-gray-500">
                Kéo thả các trường từ cột bên trái để tạo biểu mẫu của bạn
              </p>
            </div>
          </div>

          {formElements.length > 0 && (
            <button
              onClick={() => {
                if (
                  window.confirm("Bạn có chắc chắn muốn xóa tất cả các trường?")
                ) {
                  onClearAll();
                }
              }}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm"
            >
              <i className="ri-delete-bin-6-line text-lg"></i>
              <span className="text-sm font-medium">
                Xóa tất cả ({formElements.length})
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Form Canvas */}
      <div className="p-6">
        <div
          className="bg-gray-50 rounded-lg p-8 min-h-[400px] max-h-[600px] border-2 border-dashed border-gray-300 overflow-y-auto custom-scroll transition-all duration-200"
          onDragOver={(e) => {
            handleDragOver(e);
            onDragOver(e);
          }}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Khi chưa có trường nào */}
          {formElements.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              <i className="ri-file-list-3-line text-6xl text-gray-400 mb-3"></i>
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                Khu vực tạo biểu mẫu
              </h3>
              <p className="text-gray-500 text-sm">
                Kéo các trường từ hộp công cụ (Cột 1) vào đây để bắt đầu.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-blue-700 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                <i className="ri-information-line text-blue-600 text-lg"></i>
                <span>
                  Nhấn vào trường để xem chi tiết hoặc nhấn{" "}
                  <i className="ri-close-circle-line text-red-500"></i> để xóa.
                </span>
              </div>

              {formElements.map((element, index) => (
                <div
                  key={element.id}
                  className={`bg-white border rounded-lg p-4 shadow-sm cursor-pointer transition-all duration-200 ${
                    selectedElement?.id === element.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                  onClick={() => onSelectElement(element)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                          #{index + 1}
                        </span>
                        <label className="text-sm font-medium text-gray-800">
                          {element.name}
                          <span className="ml-1 text-xs text-gray-400">
                            ({element.type})
                          </span>
                        </label>
                      </div>

                      {/* Trường nhập */}
                      {element.type === "text" && (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập văn bản..."
                        />
                      )}
                      {element.type === "number" && (
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nhập số..."
                        />
                      )}
                      {element.type === "date" && (
                        <div className="relative">
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <i className="ri-calendar-line absolute right-3 top-2.5 text-gray-400"></i>
                        </div>
                      )}
                      {element.type === "select" && (
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                            <option>Chọn tùy chọn...</option>
                          </select>
                          <i className="ri-arrow-down-s-line absolute right-3 top-2.5 text-gray-400"></i>
                        </div>
                      )}
                      {element.type === "checkbox" && (
                        <div className="flex items-center mt-1">
                          <input
                            type="checkbox"
                            className="mr-2 accent-blue-600"
                          />
                          <span className="text-gray-700">Tùy chọn</span>
                        </div>
                      )}
                      {element.type === "radio" && (
                        <div className="flex gap-4 mt-1">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`radio-${element.id}`}
                              className="mr-2 accent-blue-600"
                            />
                            <span className="text-gray-700">Tùy chọn 1</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`radio-${element.id}`}
                              className="mr-2 accent-blue-600"
                            />
                            <span className="text-gray-700">Tùy chọn 2</span>
                          </label>
                        </div>
                      )}
                      {element.type === "file" && (
                        <div className="relative">
                          <input
                            type="file"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-3 file:border-0 file:bg-blue-600 file:text-white file:rounded-md hover:file:bg-blue-700"
                          />
                        </div>
                      )}
                      {element.type === "lookup" && (
                        <div className="flex mt-1">
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tìm kiếm..."
                          />
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 flex items-center gap-1">
                            <i className="ri-search-line"></i>
                            Tìm
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Nút xóa */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDeleteElement(element.id);
                      }}
                      className="ml-4 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-all"
                      title="Xóa trường này"
                    >
                      <i className="ri-close-circle-line text-lg"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormCanvas;
