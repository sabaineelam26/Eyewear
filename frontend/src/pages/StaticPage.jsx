import React from 'react';

const StaticPage = ({ title }) => {
  return (
    <div className="container" style={{ padding: '8rem 0', textAlign: 'center', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 300 }}>{title}</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
        This page is currently being updated. Please check back soon.
      </p>
    </div>
  );
};

export default StaticPage;
