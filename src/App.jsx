import Dashboard from "./components/dashboard/dashboard";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <div className="main-container">
        <Dashboard />
      </div>
      <Footer />
    </>
  );
}

export default App;
