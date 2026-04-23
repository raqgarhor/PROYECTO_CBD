import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    onSearch(nextValue);
  };

  return (
    <div className="search-bar">
      <input
        className="search-input"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Buscar tecnología, tema o categoría..."
      />
    </div>
  );
};

export default SearchBar;