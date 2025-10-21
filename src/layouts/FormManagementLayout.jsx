import React, { useState, useEffect } from "react";
import Toolbox from "../pages/FormManagement/Toolbox";
import FormCanvas from "../pages/FormManagement/FormCanvas";
import FormInfo from "../pages/FormManagement/FormInfo";

const FormManagementLayout = () => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [formElements, setFormElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  // Load formElements from localStorage on component mount
  useEffect(() => {
    const savedFormElements = localStorage.getItem("formElements");
    if (savedFormElements) {
      try {
        setFormElements(JSON.parse(savedFormElements));
      } catch (error) {
        console.error("Error loading form elements from localStorage:", error);
      }
    }
  }, []);

  // Save formElements to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("formElements", JSON.stringify(formElements));
  }, [formElements]);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedItem) {
      const newElement = {
        id: Date.now(),
        ...draggedItem,
        position: { x: e.clientX, y: e.clientY },
      };
      setFormElements([...formElements, newElement]);
      setDraggedItem(null);
    }
  };

  const handleDeleteElement = (elementId) => {
    setFormElements(formElements.filter((el) => el.id !== elementId));
  };

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả các thành phần?")) {
      setFormElements([]);
      setSelectedElement(null);
    }
  };

  const handleSelectElement = (element) => {
    setSelectedElement(element);
  };

  const handleUpdateElement = (updatedElement) => {
    setFormElements(
      formElements.map((el) =>
        el.id === updatedElement.id ? updatedElement : el
      )
    );
    setSelectedElement(updatedElement);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full bg-gray-50">
      <Toolbox onDragStart={handleDragStart} />
      <FormCanvas
        formElements={formElements}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDeleteElement={handleDeleteElement}
        onClearAll={handleClearAll}
        onSelectElement={handleSelectElement}
        selectedElement={selectedElement}
      />
      <FormInfo
        selectedElement={selectedElement}
        onUpdateElement={handleUpdateElement}
      />
    </div>
  );
};

export default FormManagementLayout;
