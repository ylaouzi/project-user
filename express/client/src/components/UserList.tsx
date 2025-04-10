import React, { useEffect, useState } from 'react';
import { getUsers, createUser } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser({ name, email });
    setName('');
    setEmail('');
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <button type="submit">Ajouter</button>
      </form>

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
