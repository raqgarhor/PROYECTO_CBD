package com.G35.backend.graph.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.G35.backend.graph.dto.AnalyticsDTO;
import com.G35.backend.graph.dto.CytoscapeEdgeDTO;
import com.G35.backend.graph.dto.CytoscapeNodeDTO;
import com.G35.backend.graph.dto.GraphResponseDTO;
import com.G35.backend.graph.dto.PathResultDTO;
import com.G35.backend.graph.repository.GraphRepository;

@Service
public class GraphService {

    @Autowired
    private GraphRepository graphRepository;

    public GraphResponseDTO getFullGraph() {
        List<Map<String, Object>> nodesRaw = graphRepository.getAllNodes();
        List<Map<String, Object>> edgesRaw = graphRepository.getAllEdges();

        List<CytoscapeNodeDTO> nodes = nodesRaw.stream()
                .map(this::mapNode)
                .collect(Collectors.toList());

        List<CytoscapeEdgeDTO> edges = edgesRaw.stream()
                .map(this::mapEdge)
                .collect(Collectors.toList());

        return new GraphResponseDTO(nodes, edges);
    }

    public AnalyticsDTO.StatsDTO getStats() {
        return graphRepository.getStats();
    }

    public AnalyticsDTO.NodeDetailsDTO getNodeDetails(String nodeId) {
        Map<String, Object> raw = graphRepository.getNodeDetails(nodeId);

        if (raw == null || raw.isEmpty()) {
            throw new RuntimeException("Nodo no encontrado: " + nodeId);
        }

        return new AnalyticsDTO.NodeDetailsDTO(
                asString(raw.get("id")),
                asString(raw.get("label")),
                asString(raw.get("category")),
                asString(raw.get("type")),
                toInt(raw.get("connections")),
                toDouble(raw.get("importance")),
                safeStringList(raw.get("relatedThemes")),
                safeStringList(raw.get("integratedTechnologies")));
    }

    public PathResultDTO findPath(String from, String to) {
        Map<String, Object> result = graphRepository.findShortestPath(from, to);

        if (result == null || result.isEmpty()) {
            throw new RuntimeException("No hay camino entre " + from + " y " + to);
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> nodesRaw = (List<Map<String, Object>>) result.get("nodes");

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> edgesRaw = (List<Map<String, Object>>) result.get("edges");

        List<CytoscapeNodeDTO> nodes = nodesRaw.stream()
                .map(this::mapNode)
                .collect(Collectors.toList());

        List<CytoscapeEdgeDTO> edges = edgesRaw.stream()
                .map(this::mapEdge)
                .collect(Collectors.toList());

        return new PathResultDTO(
                from,
                to,
                toInt(result.get("pathLength")),
                new GraphResponseDTO(nodes, edges),
                "Camino encontrado entre " + from + " y " + to);
    }

    public GraphResponseDTO searchGraph(String searchTerm) {
        List<Map<String, Object>> matches = graphRepository.searchNodes(searchTerm);

        if (matches.isEmpty()) {
            return new GraphResponseDTO(Collections.emptyList(), Collections.emptyList());
        }

        List<String> ids = matches.stream()
                .map(m -> asString(m.get("id")))
                .distinct()
                .toList();

        return graphRepository.getSubgraphByNodeIds(ids);
    }

    public GraphResponseDTO getRecommendations(String temaId) {
        List<String> ids = graphRepository.getRecommendationsByTema(temaId);

        if (ids.isEmpty()) {
            return new GraphResponseDTO(Collections.emptyList(), Collections.emptyList());
        }

        return graphRepository.getSubgraphByNodeIds(ids);
    }

    public AnalyticsDTO getAnalytics() {
        List<Map<String, Object>> importanceRaw = graphRepository.getNodeDegrees();

        List<AnalyticsDTO.NodeImportanceDTO> nodeImportance = importanceRaw.stream()
                .map(row -> new AnalyticsDTO.NodeImportanceDTO(
                        asString(row.get("nodeName")),
                        toDouble(row.get("importance")),
                        toInt(row.get("degree")),
                        asString(row.get("category"))))
                .collect(Collectors.toList());

        List<Map<String, Object>> bridgesRaw = graphRepository.findBridgeNodes();

        List<AnalyticsDTO.BridgeNodeDTO> bridgeNodes = bridgesRaw.stream()
                .map(row -> new AnalyticsDTO.BridgeNodeDTO(
                        asString(row.get("nodeName")),
                        toDouble(row.get("betweenness")),
                        safeStringList(row.get("connectedClusters"))))
                .collect(Collectors.toList());

        List<AnalyticsDTO.ClusterDTO> clusters = graphRepository.findClusters().stream()
                .map(row -> new AnalyticsDTO.ClusterDTO(
                        toInt(row.get("clusterId")),
                        safeStringList(row.get("nodes")),
                        toInt(row.get("size"))))
                .collect(Collectors.toList());

        return new AnalyticsDTO(nodeImportance, clusters, bridgeNodes);
    }

    private CytoscapeNodeDTO mapNode(Map<String, Object> row) {
        CytoscapeNodeDTO.NodeData data = new CytoscapeNodeDTO.NodeData();
        data.setId(asString(row.get("id")));
        data.setLabel(asString(row.get("label")));
        data.setCategory(asString(row.get("category")));
        data.setImportance(toDouble(row.get("importance")));
        data.setConnections(toInt(row.get("connections")));
        data.setIsPuente(toBoolean(row.get("isPuente")));
        data.setMetadata(null);
        return new CytoscapeNodeDTO(data);
    }

    private CytoscapeEdgeDTO mapEdge(Map<String, Object> row) {
        CytoscapeEdgeDTO.EdgeData data = new CytoscapeEdgeDTO.EdgeData();
        data.setId(asString(row.get("id")));
        data.setSource(asString(row.get("source")));
        data.setTarget(asString(row.get("target")));
        data.setType(asString(row.get("type")));
        data.setWeight(toDouble(row.get("weight")));
        return new CytoscapeEdgeDTO(data);
    }

    private String asString(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private int toInt(Object value) {
        if (value == null)
            return 0;
        if (value instanceof Number n)
            return n.intValue();
        return Integer.parseInt(String.valueOf(value));
    }

    private double toDouble(Object value) {
        if (value == null)
            return 0.0;
        if (value instanceof Number n)
            return n.doubleValue();
        return Double.parseDouble(String.valueOf(value));
    }

    private boolean toBoolean(Object value) {
        if (value == null)
            return false;
        if (value instanceof Boolean b)
            return b;
        return Boolean.parseBoolean(String.valueOf(value));
    }

    private List<String> safeStringList(Object value) {
        if (!(value instanceof List<?> list)) {
            return Collections.emptyList();
        }

        List<String> result = new ArrayList<>();
        for (Object item : list) {
            if (item != null) {
                String text = String.valueOf(item).trim();
                if (!text.isBlank() && !"null".equalsIgnoreCase(text)) {
                    result.add(text);
                }
            }
        }
        return result.stream().distinct().toList();
    }
}