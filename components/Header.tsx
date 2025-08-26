import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#A7D8F2] p-4 shadow-md sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1E90FF] flex items-center justify-center">
          {/* Logo placeholder */}
        </div>
        <h1 className="flex-1 text-center text-2xl md:text-3xl font-extrabold text-[#1E90FF] mx-4">
          챗GPT강사 정옥선
        </h1>
        <div className="w-12 h-12"></div> {/* Right spacer */}
      </div>
    </header>
  );
};

export default Header;
