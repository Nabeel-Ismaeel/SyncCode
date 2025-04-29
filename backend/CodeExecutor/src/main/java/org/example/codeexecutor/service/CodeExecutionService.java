package org.example.codeexecutor.service;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class CodeExecutionService {

    public String executeCode(String code, String language) {
        return switch (language.toUpperCase()) {
            case "CPP" -> executeCppCode(code);
            case "JAVA" -> executeJavaCode(code);
            case "PYTHON" -> executePythonCode(code);
            default -> "Invalid language";
        };
    }

    private String executeJavaCode(String code) {
        code = normalizeCode(code);
        Path tempDirectory = null;

        try {
            String className = extractClassName(code);
            tempDirectory = createTempDirectory();
            Path javaFilePath = tempDirectory.resolve(className + ".java");
            Files.writeString(javaFilePath, code);

            String hostPath = toHostPath(tempDirectory);

            ProcessBuilder processBuilder = new ProcessBuilder(
                    "docker", "run", "--rm", "-v", hostPath + ":/app",
                    "openjdk:17-jdk-slim", "sh", "-c",
                    "javac /app/" + className + ".java && java -cp /app " + className
            );

            return executeProcess(processBuilder);
        } catch (Exception e) {
            return "Java code execution error: " + e.getMessage();
        } finally {
            cleanupDirectory(tempDirectory);
        }
    }

    private String executeCppCode(String code) {
        code = normalizeCode(code);
        Path tempDirectory = null;

        try {
            tempDirectory = createTempDirectory();
            Path cppFilePath = tempDirectory.resolve("CppCode.cpp");
            Files.writeString(cppFilePath, code);

            String hostPath = toHostPath(tempDirectory);
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "docker", "run", "--rm", "-v", hostPath + ":/app",
                    "gcc:latest", "sh", "-c",
                    "g++ /app/CppCode.cpp -o /app/CppCode && /app/CppCode"
            );

            return executeProcess(processBuilder);
        } catch (Exception e) {
            return "C++ code execution error: " + e.getMessage();
        } finally {
            cleanupDirectory(tempDirectory);
        }
    }

    private String executePythonCode(String code) {
        code = normalizeCode(code);
        Path tempDirectory = null;

        try {
            tempDirectory = createTempDirectory();
            Path pythonFilePath = tempDirectory.resolve("TempCode.py");
            Files.writeString(pythonFilePath, code);

            String hostPath = toHostPath(tempDirectory);
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "docker", "run", "--rm", "-v", hostPath + ":/app",
                    "python:3", "python", "/app/TempCode.py"
            );

            return executeProcess(processBuilder);
        } catch (Exception e) {
            return "Python code execution error: " + e.getMessage();
        } finally {
            cleanupDirectory(tempDirectory);
        }
    }

    private String executeProcess(ProcessBuilder processBuilder) throws IOException, InterruptedException {
        Process process = processBuilder.start();
        boolean finished = process.waitFor(30, TimeUnit.SECONDS);

        String output = new String(process.getInputStream().readAllBytes());
        String errorOutput = new String(process.getErrorStream().readAllBytes());

        if (!finished) {
            process.destroy();
            return "Execution timed out.";
        }

        return errorOutput.isEmpty() ? output : "Execution failed: " + errorOutput;
    }

    private Path createTempDirectory() throws IOException {
        Path baseDir = Paths.get("/shared_code");
        Files.createDirectories(baseDir);
        Path tempDir = baseDir.resolve("code_" + UUID.randomUUID());
        Files.createDirectories(tempDir);
        return tempDir;
    }

    private String toHostPath(Path containerPath) {
        String containerPathStr = containerPath.toString();
        String hostCodeDir = System.getenv("HOST_CODE_DIR");
        if (hostCodeDir != null && containerPathStr.startsWith("/shared_code")) {
            return containerPathStr.replace("/shared_code", hostCodeDir);
        }
        return containerPathStr;
    }

    private void cleanupDirectory(Path directory) {
        if (directory != null && Files.exists(directory)) {
            try (DirectoryStream<Path> stream = Files.newDirectoryStream(directory)) {
                for (Path entry : stream) {
                    if (Files.isDirectory(entry)) {
                        cleanupDirectory(entry);
                    } else {
                        Files.deleteIfExists(entry);
                    }
                }
            } catch (IOException ignored) {
            }
            try {
                Files.deleteIfExists(directory);
            } catch (IOException ignored) {
            }
        }
    }

    private String extractClassName(String code) {
        String[] words = code.split("\\s+");
        for (int i = 0; i < words.length - 2; i++) {
            if (words[i].equals("public") && words[i + 1].equals("class")) {
                return words[i + 2].replaceAll("[^a-zA-Z0-9_]", "");
            }
        }
        throw new RuntimeException("Class name not found in Java code.");
    }

    private String normalizeCode(String code) {
        return code.replace("\\n", "\n")
                .replace("\\r", "\r")
                .replace("\\\"", "\"");
    }

}
