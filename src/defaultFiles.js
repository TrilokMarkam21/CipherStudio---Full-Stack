// src/defaultFiles.js
// This is the default React template for Sandpack
export const defaultFiles = {
  "/App.js": `import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CipherStudio!</h1>
      <h2>Start editing to see magic happen!</h2>
    </div>
  );
}`,
  "/styles.css": `body {
  font-family: sans-serif;
}

.App {
  text-align: center;
}`,
  "/index.js": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  "/public/index.html": `<!DOCTYPE html>
<html>
<head>
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
  "/package.json": `{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}`
};