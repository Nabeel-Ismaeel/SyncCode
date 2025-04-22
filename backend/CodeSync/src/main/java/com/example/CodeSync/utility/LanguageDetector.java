package com.example.CodeSync.utility;

import com.example.CodeSync.enums.Language;
import org.springframework.stereotype.Service;

@Service
public class LanguageDetector {

    public Language detectLanguage(String fileName) {
        System.out.println(fileName);
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            throw new IllegalArgumentException("not valid extension file");
        }
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1);
        System.out.println(extension);
        switch (extension) {
            case "java":
                return Language.JAVA;
            case "py":
                return Language.PYTHON;
            case "cpp":
                return Language.CPP;
            default:
                throw new IllegalArgumentException("not valid extension file");
        }
    }
}
