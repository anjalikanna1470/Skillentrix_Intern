import Card from "./components/Card";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>React Like / Unlike Cards</h1>

      <div className="card-container">
        <Card title="Web Development" />
        <Card title="Machine Learning" />
        <Card title="Android Development" />
      </div>
    </div>
  );
}

export default App;