// frontend\src\components\features\SearchBox.jsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex items-center">
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Products..."
        className="mr-2 ml-5 py-1 px-2 rounded shadow-sm flex-grow h-10 bg-white text-black"
      />
      <button type="submit" className="p-2 mx-2 text-white bg-green-500 hover:bg-green-600 rounded h-10">
        Search
      </button>
    </form>
  );
};

export default SearchBox;
