package com.G35.backend.graph.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CytoscapeNodeDTO {
    private NodeData data;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NodeData {
        private String id;
        private String label;
        private String category;
        private Double importance; // PageRank, etc.
        private Integer connections;
        private Boolean isPuente;
        private Map<String, Object> metadata;
    }
}
