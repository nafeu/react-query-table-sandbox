import React from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
import './index.css';

import ReactQueryWithTable from './ReactQueryWithTable.jsx';

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
    <div class="app">
      <div class="app-container">
        <Section
          title={'React Query with React Table'}
          desc={'Using React Query with React Table'}
        >
          <ReactQueryWithTable />
        </Section>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
