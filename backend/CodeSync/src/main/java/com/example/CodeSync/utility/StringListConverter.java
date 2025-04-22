package com.example.CodeSync.utility;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

@Converter(autoApply = true)
public class StringListConverter implements AttributeConverter<List<String>, String> {
    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<String> stringList) {
        if (stringList == null || stringList.isEmpty()) {
            return "[]";
        }
        try {
            return mapper.writeValueAsString(stringList);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize string list", e);
        }
    }

    @Override
    public List<String> convertToEntityAttribute(String s) {
        if (s == null || s.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return mapper.readValue(s, new TypeReference<List<String>>(){});
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize string list", e);
        }
    }
}
