import React from 'react';
import ReactDOM from 'react-dom';
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
        <Section
          title={'React Query with React Table'}
          desc={'Using React Query with React Table'}
        >
          <ReactQueryWithTable />
        </Section>
        <Section
          title={'React Table with Expanded Rows'}
          desc={'Using and API request to lazy-load expanded rows'}
        >
          <ReactTableExpanding />
        </Section>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
