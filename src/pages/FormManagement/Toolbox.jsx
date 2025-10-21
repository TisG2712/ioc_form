import React from "react";

const Toolbox = ({ onDragStart }) => {
  const toolboxGroups = [
    {
      title: "Trường cơ bản",
      items: [
        {
          id: "text-field",
          name: "Văn bản ngắn",
          type: "text",
          icon: "📝",
        },
        { id: "number", name: "Số", type: "number", icon: "🔢" },
        { id: "date", name: "Ngày", type: "date", icon: "📅" },
        {
          id: "file-upload",
          name: "Tải tệp lên",
          type: "file",
          icon: "📁",
        },
      ],
    },
    {
      title: "Trường lựa chọn",
      items: [
        {
          id: "dropdown",
          name: "Danh sách chọn",
          type: "select",
          icon: "📋",
        },
        {
          id: "checkbox",
          name: "Hộp kiểm",
          type: "checkbox",
          icon: "☑️",
        },
        {
          id: "radio",
          name: "Nút chọn",
          type: "radio",
          icon: "🔘",
        },
      ],
    },
    {
      title: "Trường nâng cao",
      items: [
        {
          id: "lookup",
          name: "Trường tra cứu",
          type: "lookup",
          icon: "🔍",
        },
      ],
    },
  ];

  return (
    <div className="w-full lg:w-1/4 bg-gray-50 border-r border-gray-200 shadow-sm h-screen overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-blue-600 text-xl">🛠️</span>
          <h3 className="text-lg font-semibold text-gray-800">
            Trường thông tin biểu mẫu
          </h3>
        </div>

        {/* Grouped toolbox items */}
        {toolboxGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              {group.title}
            </h4>
            <div className="space-y-2">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, item)}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-lg cursor-move hover:border-blue-400 hover:bg-blue-50 transition-all duration-150 text-gray-700 font-medium select-none shadow-sm"
                >
                  <span className="text-blue-600 text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toolbox;
