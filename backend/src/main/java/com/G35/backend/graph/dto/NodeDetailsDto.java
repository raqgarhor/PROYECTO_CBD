package com.G35.backend.graph.dto;

import java.util.List;

public record NodeDetailsDto(
        String id,
        String label,
        String category,
        String type,
        int connections,
        double importance,
        List<String> relatedThemes,
        List<String> integratedTechnologies) {
}