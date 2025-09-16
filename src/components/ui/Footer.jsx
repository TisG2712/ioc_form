import React, { memo } from "react";

const Footer = memo(() => {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-[30px] bg-red-700 flex items-center justify-center z-1">
      <span className="text-white font-semi text-xs">
        © Bản quyền thuộc về IOC Đồng Nai - Hệ thống chỉ đạo điều hành
      </span>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
