import React, { useRef, useEffect, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

interface DropdownProps {
  selectedOption: string;
  options: string[];
  onOptionClick: (option: string) => void;
}

const AlignDropdown: React.FC<DropdownProps> = ({ selectedOption, options, onOptionClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setIsOpen(prev => !prev);

  const handleOptionClick = (option: string) => {
    onOptionClick(option);
    setIsOpen(false);
  };

  return (
    <div className="relative text-left mx-1 w-32">
      <button
        type="button"
        className="inline-flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-md font-semibold text-gray-900 hover:bg-gray-100"
        id="menu-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggleMenu}
        ref={buttonRef}
      >
        {selectedOption}
        <IoIosArrowDown className="ml-1 mt-0.5 flex-shrink-0" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          ref={menuRef}
        >
          <div className="py-1" role="none">
            {options.map(option => (
              <a
                key={option}
                href="#"
                onClick={e => {
                  e.preventDefault();
                  handleOptionClick(option);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                tabIndex={-1}
              >
                {option}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlignDropdown;