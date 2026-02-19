import React, { useState, ChangeEvent } from 'react';

interface SearchProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ searchTerm, onSearch }) => {
  const [localTerm, setLocalTerm] = useState<string>(searchTerm);
  let timer: NodeJS.Timeout;

  const handleDebounce = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalTerm(e.target.value);
    clearTimeout(timer);
    timer = setTimeout(() => {
      onSearch(e.target.value);
    }, 800);
  };

  return (
    <input
      type="text"
      value={localTerm}
      onChange={handleDebounce}
      placeholder="Search products..."
      aria-label="Search products"
      className="
        w‑full max-w-125 px-5 py-2 border rounded-lg border-primary
      "
    />
  );
};

export default Search;
