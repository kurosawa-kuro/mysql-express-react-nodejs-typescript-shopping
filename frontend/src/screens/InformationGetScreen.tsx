import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
}

export const InformationGetScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data: User[] = response.data;
      setUsers(data);
    };
    getUsers();
  }, []);

  return (
    <div className="mt-4 bg-custom-blue-lightest p-6 text-custom-blue-extra-dark">
      <h1 className="mb-4 text-xl font-bold text-custom-blue-darkest">
        ユーザ一覧
      </h1>
      <ul className="divide-y divide-custom-blue-dark">
        {users.map((user: User) => (
          <li key={user.id} className="py-2">
            {user.id}.{user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
