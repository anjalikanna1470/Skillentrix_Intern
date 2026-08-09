import UserCard from "./UserCard";

function UserList({ users }) {
  return (
    <div className="user-list">
      {users.length === 0 ? (
        <p className="empty-message">No contacts added yet.</p>
      ) : (
        users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))
      )}
    </div>
  );
}

export default UserList;