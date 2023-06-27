import { app } from "./index";

const port = process.env.PORT || 8080;

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
