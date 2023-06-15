import React, { FormEvent, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox: React.FC = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams<{ keyword?: string }>();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword("");
    } else {
      navigate("/");
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
        className="ml-5 mr-2 h-10 flex-grow rounded bg-white px-2 py-1 text-black shadow-sm"
      />
      <button
        type="submit"
        className="mx-2 h-10 rounded bg-green-500 p-2 text-white hover:bg-green-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBox;
