package com.G35.backend.graph.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponseDTO {
    private String temaId;
    private GraphResponseDTO graph;
    private List<RecommendationItemDTO> recommendations;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecommendationItemDTO {
        private String id;
        private String nombre;
        private String categoria;
        private Double score;
        private List<String> razones;
    }
}
