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
public class AnalyticsDTO {
    private List<NodeImportanceDTO> nodeImportance;
    private List<ClusterDTO> clusters;
    private List<BridgeNodeDTO> bridgeNodes;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NodeImportanceDTO {
        private String nodeName;
        private Double pageRank;
        private Integer degree;
        private String category;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClusterDTO {
        private Integer clusterId;
        private List<String> nodes;
        private Integer size;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BridgeNodeDTO {
        private String nodeName;
        private Double betweenness;
        private List<String> connectedClusters;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatsDTO {
        private Long technologies;
        private Long themes;
        private Long integrations;
        private Long relations;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NodeDetailsDTO {
        private String id;
        private String label;
        private String category;
        private String type;
        private Integer connections;
        private Double importance;
        private List<String> relatedThemes;
        private List<String> integratedTechnologies;
    }
}