import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './index.css';

import ReactQueryWithTable from './ReactQueryWithTable.jsx';
import ReactTableExpanding from './ReactTableExpanding.jsx';

const Section = ({ title, desc, children }) => {
  return (
    <React.Fragment>
      <div className="section-title">{title}</div>
      <div className="section-desc">{desc}</div>
      <div className="section-content">
        {children}
      </div>
    </React.Fragment>
  );
}

const App = () => {
  return (
    <div className="app">
      <div className="app-container">
        <nav>
          <ul>
            <li>
              <Link to="/">React Query with React Table</Link>
            </li>
            <li>
              <Link to="/expanding">React Table with Expanding Rows</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/">
            <Section
              title={'React Query with React Table'}
              desc={'Using React Query with React Table'}
            >
              <ReactQueryWithTable />
            </Section>
          </Route>
          <Route path="/expanding">
            <Section
              title={'React Table with Expanded Rows'}
              desc={'Using and API request to lazy-load expanded rows'}
            >
              <ReactTableExpanding />
            </Section>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
