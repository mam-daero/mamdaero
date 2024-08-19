import React from 'react';

interface GenderDropdownProps {
  gender: string;
  onGenderChange: (gender: string) => void;
}

const GenderDropdown: React.FC<GenderDropdownProps> = ({ gender, onGenderChange }) => {
  const handleGenderSelect = (selectedGender: string) => {
    onGenderChange(selectedGender);
  };

  return (
    <div className="dropdown dropdown-right right-5">
      <div
        tabIndex={0}
        role="button"
        className="btn min-w-20"
        // style={{ minWidth: '100px', textAlign: 'center' }}
      >
        {gender ? gender : '선택'}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-30 p-2 shadow"
      >
        <li>
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              handleGenderSelect('남');
            }}
          >
            남
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              handleGenderSelect('여');
            }}
          >
            여
          </a>
        </li>
      </ul>
    </div>
  );
};

export default GenderDropdown;
