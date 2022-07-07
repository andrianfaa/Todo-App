import { server, PORT } from "./app";

// eslint-disable-next-line no-console
server.listen(PORT, () => console.info("Server is running on port", PORT));
