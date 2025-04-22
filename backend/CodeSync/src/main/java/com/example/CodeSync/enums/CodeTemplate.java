package com.example.CodeSync.enums;

public enum CodeTemplate {
    PythonTemplate("#Start Coding\nprint(\"Hello World!\")"),
    CppTemplate("#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\t//Start Coding\n\tcout << \"Hello World!\";\n}"),
    JavaTemplate("public class HelloWorld {\n\n\tpublic static void main(String[] args) {\n\t\t//Start Coding\n\t\tSystem.out.println(\"Hello World!\");\n\t}\n}");

    private final String template;

    CodeTemplate(String template) {
        this.template = template;
    }

    public String getTemplate() {
        return template;
    }
}
