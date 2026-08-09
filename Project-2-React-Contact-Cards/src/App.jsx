import { useState } from "react";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);

  const addUser = (newUser) => {
    setUsers((previousUsers) => [...previousUsers, newUser]);
  };

  return (
    <div className="app">
      <h1>React Contact Cards</h1>

      <UserForm onAddUser={addUser} />

      <UserList users={users} />
    </div>
  );
}

export default App;