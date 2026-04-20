package com.G35.backend.graph.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.G35.backend.graph.dto.AnalyticsDTO;
import com.G35.backend.graph.dto.GraphResponseDTO;
import com.G35.backend.graph.dto.PathResultDTO;
import com.G35.backend.graph.service.GraphService;

@RestController
@RequestMapping("/api/graph")
public class GraphController {

    @Autowired
    private GraphService graphService;

    @GetMapping
    public ResponseEntity<GraphResponseDTO> getFullGraph() {
        return ResponseEntity.ok(graphService.getFullGraph());
    }

    @GetMapping("/stats")
    public ResponseEntity<AnalyticsDTO.StatsDTO> getStats() {
        return ResponseEntity.ok(graphService.getStats());
    }

    @GetMapping("/node/{nodeId}")
    public ResponseEntity<AnalyticsDTO.NodeDetailsDTO> getNodeDetails(@PathVariable String nodeId) {
        return ResponseEntity.ok(graphService.getNodeDetails(nodeId));
    }

    @GetMapping("/path")
    public ResponseEntity<PathResultDTO> findPath(
            @RequestParam String from,
            @RequestParam String to) {
        return ResponseEntity.ok(graphService.findPath(from, to));
    }

    @GetMapping("/search")
    public ResponseEntity<GraphResponseDTO> searchGraph(@RequestParam(name = "q") String searchTerm) {
        return ResponseEntity.ok(graphService.searchGraph(searchTerm));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<GraphResponseDTO> getRecommendations(@RequestParam String temaId) {
        return ResponseEntity.ok(graphService.getRecommendations(temaId));
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsDTO> getAnalytics() {
        return ResponseEntity.ok(graphService.getAnalytics());
    }
}