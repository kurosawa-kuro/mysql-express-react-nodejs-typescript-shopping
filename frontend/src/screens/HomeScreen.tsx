import React from "react";
import { Link } from "react-router-dom";

export const HomeScreen: React.FC = () => {
  return (
    <div className="bg-custom-blue-lightest p-4 text-custom-blue-darkest">
      {/* テーブル */}
      <table className="mb-4 w-full border-collapse border-custom-blue-dark">
        <thead>
          <tr className="bg-custom-blue-dark text-custom-blue-lightest">
            <th className="p-2">Header 1</th>
            <th className="p-2">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-custom-blue-dark">
            <td className="p-2 text-center">Content 1</td>
            <td className="p-2 text-center">Content 2</td>
          </tr>
          <tr className="border-t border-custom-blue-dark">
            <td className="p-2 text-center">Content 1</td>
            <td className="p-2 text-center">Content 2</td>
          </tr>
          <tr className="border-t border-custom-blue-dark">
            <td className="p-2 text-center">Content 1</td>
            <td className="p-2 text-center">Content 2</td>
          </tr>
        </tbody>
      </table>

      {/* ページャー */}
      <div className="mb-4 flex items-center justify-center">
        <Link
          to="#"
          className="mx-1 rounded-md bg-custom-blue-dark p-2 text-custom-blue-lightest hover:bg-custom-blue-darkest"
        >
          Prev
        </Link>
        <Link
          to="#"
          className="mx-1 rounded-md bg-custom-blue-dark p-2 text-custom-blue-lightest hover:bg-custom-blue-darkest"
        >
          Next
        </Link>
      </div>

      {/* フォーム */}
      <form className="mb-4">
        <label htmlFor="name" className="mb-2 block">
          Name:
        </label>
        <input
          type="text"
          id="name"
          className="mb-2 w-full rounded-md border border-custom-blue-dark p-2 hover:border-custom-blue-darkest"
        />
        <button
          type="submit"
          className="rounded-md bg-custom-blue-dark p-2 text-custom-blue-lightest hover:bg-custom-blue-darkest"
        >
          Submit
        </button>
      </form>

      {/* リスト */}
      <ul className="mb-4">
        <li className="mb-1 rounded-md bg-custom-blue-dark p-2 text-custom-blue-lightest">
          Item 1
        </li>
        <li className="mb-1 rounded-md bg-custom-blue-dark p-2 text-custom-blue-lightest">
          Item 2
        </li>
      </ul>

      {/* リンク */}
      <Link
        to="#"
        className="block rounded-md bg-custom-blue-dark p-2 text-center text-custom-blue-lightest hover:bg-custom-blue-darkest"
      >
        This is a link
      </Link>
    </div>
  );
};
