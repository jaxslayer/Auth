import connectDb from "./db/index.js";
import { app } from "./app.js";

connectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server succesfully connected on", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Mongodb connection failed", err);
  });
