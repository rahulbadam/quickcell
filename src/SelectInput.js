import React from 'react';

function SelectInput({ options, value, onChange }) {

  return (
    <div>
      <select value={value} onChange={onChange} className='selectBox'>
        {options.map(option => (
          <option value={option} className='dropdownOptions'> {option}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;
