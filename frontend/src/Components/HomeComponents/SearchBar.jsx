import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

const SearchBar = ({ querys, setQuerys, handleSearch }) => {
  return (
    <div className="relative flex justify-center items-center bg-white py-4 px-3">
      <input
        className="border-none outline-none bg-slate-200 rounded-md w-[93%] pl-9 py-3"
        type="text"
        placeholder="Search or Start new chat"
        onChange={(e) => {
          setQuerys(e.target.value);
          handleSearch(e.target.value);
        }}
        value={querys}
      />
      <AiOutlineSearch className="left-10 top-8 absolute" />
    </div>
  );
};

export default SearchBar;
