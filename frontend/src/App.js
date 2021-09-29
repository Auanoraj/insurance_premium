import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "./components/Landing";

import "./App.css";

function App() {
  const routes = (
    <Switch>
      <Route component={Landing} path="/" exact />
    </Switch>
  );

  return (
    <div className="App">
      <Router>
        <main>{routes}</main>
      </Router>
    </div>
  );
}

export default App;
