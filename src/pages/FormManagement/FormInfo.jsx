import React from "react";

const FormInfo = ({ selectedElement, onUpdateElement }) => {
  if (!selectedElement) {
    return (
      <div className="w-full lg:w-1/4 bg-white border-l border-gray-200 shadow-sm">
        <div className="p-6 text-center text-gray-500">
          <i className="ri-settings-4-line text-6xl text-gray-400 mb-3"></i>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Cấu hình trường thông tin
          </h3>
          <p className="text-gray-500 text-sm">
            Chọn một trường trong biểu mẫu để xem và chỉnh sửa chi tiết tại đây.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/4 bg-white border-l border-gray-200 shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
          <i className="ri-settings-4-line text-blue-600 text-2xl"></i>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Cấu hình trường
            </h3>
            <p className="text-sm text-gray-500">
              #{selectedElement.id} – {selectedElement.name}
            </p>
          </div>
        </div>

        {/* Form config */}
        <div className="space-y-5">
          {/* Tên trường */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhãn hiển thị
            </label>
            <input
              type="text"
              value={selectedElement.name || ""}
              onChange={(e) =>
                onUpdateElement({ ...selectedElement, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập nhãn hiển thị..."
            />
          </div>

          {/* Tên biến / ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã định danh (Field ID)
            </label>
            <input
              type="text"
              value={selectedElement.id || ""}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Loại trường */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại trường
            </label>
            <div className="flex items-center gap-2">
              <i className="ri-drag-drop-line text-blue-600"></i>
              <span className="text-gray-700 capitalize">
                {selectedElement.type}
              </span>
            </div>
          </div>

          {/* Mô tả trường */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              rows="3"
              value={selectedElement.description || ""}
              onChange={(e) =>
                onUpdateElement({
                  ...selectedElement,
                  description: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mô tả hoặc hướng dẫn cho người dùng..."
            ></textarea>
          </div>

          {/* Bắt buộc nhập */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <label className="text-sm font-medium text-gray-700">
              Trường bắt buộc
            </label>
            <input
              type="checkbox"
              checked={selectedElement.required || false}
              onChange={(e) =>
                onUpdateElement({
                  ...selectedElement,
                  required: e.target.checked,
                })
              }
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Giá trị mặc định */}
          {["text", "number", "date", "select"].includes(
            selectedElement.type
          ) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá trị mặc định
              </label>
              <input
                type={selectedElement.type === "number" ? "number" : "text"}
                value={selectedElement.defaultValue || ""}
                onChange={(e) =>
                  onUpdateElement({
                    ...selectedElement,
                    defaultValue: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập giá trị mặc định..."
              />
            </div>
          )}

          {/* Điều kiện hiển thị */}
          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Điều kiện hiển thị
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedElement.visibility || "always"}
              onChange={(e) =>
                onUpdateElement({
                  ...selectedElement,
                  visibility: e.target.value,
                })
              }
            >
              <option value="always">Luôn hiển thị</option>
              <option value="conditional">Theo điều kiện</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormInfo;
