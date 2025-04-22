package com.example.CodeSync.utility;

import com.example.CodeSync.enums.CodeTemplate;
import com.example.CodeSync.enums.Language;
import org.springframework.stereotype.Service;

@Service
public class CodeTemplateFactory {

    public CodeTemplate getCodeTemplate(Language language) {
        switch (language) {
            case JAVA:
                return CodeTemplate.JavaTemplate;
            case CPP:
                return CodeTemplate.CppTemplate;
            case PYTHON:
                return CodeTemplate.PythonTemplate;
            default:
                throw new IllegalArgumentException("Unsupported language");
        }
    }
}
