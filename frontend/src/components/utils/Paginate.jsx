// frontend\src\components\utils\Paginate.jsx

import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <nav className="flex justify-center my-4">
        <ul className="pagination flex">
          {[...Array(pages).keys()].map((x) => (
            <li
              key={x + 1}
              className={`${x + 1 === page ? 'bg-blue-500' : 'bg-gray-200'
                }`}
            >
              <Link
                to={
                  !isAdmin
                    ? keyword
                      ? `/search/${keyword}/page/${x + 1}`
                      : `/page/${x + 1}`
                    : `/admin/product-list/${x + 1}`
                }
                className={`block py-2 px-4 text-center text-white ${x + 1 === page ? 'bg-blue-500' : 'bg-gray-200'
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

export default Paginate;
