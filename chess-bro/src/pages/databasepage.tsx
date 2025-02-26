import React, { useEffect, useState } from "react";

interface User {
  username: string; // Primærnøkkel er en streng
  firstname: string | null; // Kan være null
  lastname: string | null; // Kan være null
  email: string | null; // Kan være null
  gender: string | null; // Kan være null
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/users")
      .then((response) => response.json())
      .then((data: User[]) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Feil ved henting av brukere:", error);
      });
  }, []);

  return (
    <div>
      <h1>Brukere fra databasen</h1>
      <ul>
        {users.map((user) => (
          <li key={user.username}>
            {user.username} -{user.firstname || "Ingen fornavn"}{" "}
            {user.lastname || "Ingen etternavn"} –{" "}
            {user.email || "Ingen e-post"} ({user.gender || "Ukjent"})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
