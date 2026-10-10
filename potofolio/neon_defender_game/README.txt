# NEON DEFENDER

A polished arcade space-shooter prototype using:
- HTML5 Canvas
- CSS3
- JavaScript
- Java HTTP server

## Run without Java
Open `index.html` in a browser.

## Run with Java
Requirements: Java 11+

1. Put all files in the same folder.
2. Open Terminal in that folder.
3. Run:
   javac GameServer.java
4. Then:
   java GameServer
5. Open:
   http://localhost:8080

The Java backend exposes `/api/status` as a simple starting point for adding accounts, leaderboards, saved games, etc.

## Controls
WASD / Arrow keys = move
Space = shoot
Shift = dash
