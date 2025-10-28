// utils/defaultFiles.js
exports.defaultFiles = {
  "/App.js": { code: `import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CipherStudio!</h1>
      <h2>Your full-stack IDE is running!</h2>
    </div>
  );
}`},
  "/styles.css": { code: `body { font-family: sans-serif; } .App { text-align: center; }`},
  // ... add index.js, package.json, public/index.html
};