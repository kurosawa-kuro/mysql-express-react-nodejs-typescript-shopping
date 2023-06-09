import app from "./index";

const port = process.env.PORT || 5000;

app.listen(port, () =>
  // Use the imported 'app' here
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
