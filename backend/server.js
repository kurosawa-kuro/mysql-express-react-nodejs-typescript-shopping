import app from "./index.js"

app.listen(5000, () => // Use the imported 'app' here
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${5000}`)
);
