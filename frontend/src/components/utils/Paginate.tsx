// frontend\src\components\utils\Paginate.tsx

import { FC } from "react";
import { Link } from "react-router-dom";

interface PaginateProps {
  pages: number;
  page: number;
  isAdmin?: boolean;
  keyword?: string;
}

export const Paginate: FC<PaginateProps> = ({
  pages,
  page,
  isAdmin = false,
  keyword = "",
}) => {
  return (
    pages > 1 && (
      <nav className="my-4 flex justify-center">
        <ul className="pagination flex">
          {[...Array(pages).keys()].map((x) => (
            <li
              key={x + 1}
              className={`${x + 1 === page ? "bg-blue-500" : "bg-gray-200"}`}
            >
              <Link
                to={
                  !isAdmin
                    ? keyword
                      ? `/search/${keyword}/page/${x + 1}`
                      : `/page/${x + 1}`
                    : `/admin/products/${x + 1}`
                }
                className={`block px-4 py-2 text-center text-white ${
                  x + 1 === page ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                {x + 1}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    )
  );
};
