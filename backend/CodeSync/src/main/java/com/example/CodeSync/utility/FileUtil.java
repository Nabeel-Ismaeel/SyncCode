package com.example.CodeSync.utility;

import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileUtil {
    public void createFolder(String folderFullPath) {
        File folder = new File(folderFullPath);
        if (folder.exists()) {
            throw new IllegalStateException("The Folder is Already Exists");
        }
        if (!folder.mkdir()) {
            throw new IllegalStateException("Something Went Wrong While Creating The Folder");
        }
    }

    public void createFile(String fileFullPath, String content) throws Exception {
        Path jsonFilePath = Paths.get(fileFullPath);
        try {
            Files.createFile(jsonFilePath);
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not create the file " + fileFullPath);
        }

        try {
            Files.write(jsonFilePath, content.getBytes());
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not write on the file " + fileFullPath);
        }
    }

    public void deleteFolder(String folderFullPath) {
        File folder = new File(folderFullPath);

        if (folder.exists() && folder.isDirectory()) {
            File[] files = folder.listFiles();

            if (files != null) {
                for (File file : files) {
                    if (file.isDirectory()) {
                        deleteFolder(file.getAbsolutePath());
                    } else {
                        if (!file.delete()) {
                            throw new IllegalStateException("Something Went Wrong While Deleting The File: " + file.getAbsolutePath());
                        }
                    }
                }
            }

            if (!folder.delete()) {
                throw new IllegalStateException("Something Went Wrong While Deleting The Folder: " + folderFullPath);
            }
        } else {
            throw new IllegalArgumentException("The specified folder does not exist or is not a directory.");
        }
    }

    public void deleteFile(String fileFullPath) throws Exception {
        Path file = Paths.get(fileFullPath);
        if (!Files.exists(file)) {
            throw new IllegalStateException("No Such File: " + fileFullPath);
        }
        try {
            Files.delete(file);
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not delete the file " + fileFullPath);
        }
    }

    public boolean checkExistence(String fullPath) {
        File folder = new File(fullPath);
        return folder.exists();
    }

    public String readFileContents(String fullPath) throws IOException {
        Path fileName = Path.of(fullPath);
        return Files.readString(fileName);
    }

    public void copyFolder(String source, String target) throws IOException {
        Path sourceDir = Paths.get(source);
        Path targetDir = Paths.get(target);

        Files.walkFileTree(sourceDir, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                Path targetPath = targetDir.resolve(sourceDir.relativize(dir));
                if (!Files.exists(targetPath)) {
                    Files.createDirectories(targetPath);
                }
                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                Path targetPath = targetDir.resolve(sourceDir.relativize(file));
                Files.copy(file, targetPath, StandardCopyOption.REPLACE_EXISTING);
                return FileVisitResult.CONTINUE;
            }
        });
    }
    public List<String> getFilesInDirectory(String path) {
        List<String> filesPaths = new ArrayList<>();
        File directory = new File(path);

        if (directory.isDirectory()) {
            File[] files = directory.listFiles();
            for (File file : files) {
                filesPaths.add(file.getName());
            }
        }
        return filesPaths;
    }

    public void writeObjectOnFile(Object object, String filePath) {
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            try {
                Files.createFile(path);
            } catch (IOException e) {
                throw new IllegalArgumentException("Could not create the file " + filePath);
            }
        }
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(filePath))) {
            oos.writeObject(object);
        } catch (IOException e) {
            throw new IllegalArgumentException("Failed to write the object on the path " + filePath);
        }
    }

    public Object readObjectFromFile(String filePath) {
        if (!Files.exists(Paths.get(filePath))){
            throw new IllegalArgumentException("The specified file does not exist or is not a directory.");
        }
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(filePath))) {
            return ois.readObject();
        } catch (IOException | ClassNotFoundException e) {
            throw new IllegalArgumentException("Error deserializing the Object from path " + filePath);
        }
    }
}