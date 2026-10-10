import com.sun.net.httpserver.HttpServer;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class GameServer {
    public static void main(String[] args) throws Exception {
        int port = 8080;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/api/status", exchange -> {
            String json = "{\"game\":\"Neon Defender\",\"status\":\"online\",\"backend\":\"Java\"}";
            byte[] data = json.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, data.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(data);
            }
        });

        server.createContext("/", exchange -> {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/")) path = "/index.html";
            File file = new File(".", path.substring(1));

            if (!file.exists() || file.isDirectory()) {
                exchange.sendResponseHeaders(404, -1);
                return;
            }

            String type = path.endsWith(".html") ? "text/html" :
                          path.endsWith(".css") ? "text/css" :
                          "application/javascript";
            exchange.getResponseHeaders().set("Content-Type", type);
            exchange.sendResponseHeaders(200, file.length());

            try (OutputStream os = exchange.getResponseBody();
                 FileInputStream in = new FileInputStream(file)) {
                in.transferTo(os);
            }
        });

        server.start();
        System.out.println("Neon Defender running at http://localhost:" + port);
        System.out.println("Java API: http://localhost:" + port + "/api/status");
    }
}
