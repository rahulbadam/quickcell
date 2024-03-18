import React from 'react';

function SelectInput({ options, value, onChange }) {

  return (
    <div>
      <select value={value} onChange={onChange}>
        {options.map(option => (
          < option value={option} > {option}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;
