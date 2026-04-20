package com.G35.backend.graph.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CytoscapeEdgeDTO {
    private EdgeData data;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EdgeData {
        private String id;
        private String source;
        private String target;
        private String type;
        private Double weight; // fuerza de relación
    }
}
