# Web

React SPA that allows you to play the game in a local browser with no back-end server.

This uses the domain code, memory based repository, a concrete `GameServiceImpl` and wires it all up in a React app.

This could easily be extended to talk to the API by creating an Adapter to convert calls on a `GameService` to HTTP requests aimed at the API instead of creating a `GameServiceImpl` on the page itself.

