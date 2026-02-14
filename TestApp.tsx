import React from 'react';

export default function TestApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0b1221', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1 style={{ fontSize: '48px' }}>🎮 Mastering Words</h1>
      <p style={{ fontSize: '24px', color: '#00c2a0' }}>React is working!</p>
      <p style={{ fontSize: '16px', color: '#666' }}>If you see this, the basic setup is correct.</p>
    </div>
  );
}
