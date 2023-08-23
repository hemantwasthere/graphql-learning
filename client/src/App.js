// Import everything needed to use the `useQuery` hook
import { gql, useQuery } from "@apollo/client";

const GET_TODOS = gql`
  query GetAllTodos {
    getTodos {
      id
      title
      completed
      user {
        name
        email
      }
    }
  }
`;

export default function App() {
  const { loading, error, data } = useQuery(GET_TODOS);
  console.log(data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <h2>My first Apollo app 🚀</h2>
      {data.getTodos.map(({ id, title, completed, user }) => (
        <div key={id}>
          <h3>{title}</h3>
          {completed ? <p>Completed</p> : <p>Not Completed</p>}
          <p>{user?.name}</p>
          <p>{user?.email}</p>
        </div>
      ))}
    </div>
  );
}
