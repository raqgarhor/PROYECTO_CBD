package com.G35.backend.graph.repository;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.G35.backend.graph.dto.AnalyticsDTO;
import com.G35.backend.graph.dto.CytoscapeEdgeDTO;
import com.G35.backend.graph.dto.CytoscapeNodeDTO;
import com.G35.backend.graph.dto.GraphResponseDTO;

@Repository
public class GraphRepository {

    @Autowired
    private Driver driver;

    public List<Map<String, Object>> getAllNodes() {
        try (Session session = driver.session()) {
            Result result = session.run("""
                    MATCH (n)
                    OPTIONAL MATCH (n)-[r]-()
                    WITH n, count(DISTINCT r) AS connections
                    RETURN {
                        id: CASE WHEN n.nombre IS NOT NULL THEN n.nombre ELSE n.id END,
                        label: CASE WHEN n.nombre IS NOT NULL THEN n.nombre ELSE n.id END,
                        category: CASE
                            WHEN 'Tema' IN labels(n) THEN 'Tema'
                            ELSE coalesce(n.categoria, 'Tech')
                        END,
                        connections: connections,
                        importance: CASE
                            WHEN connections >= 12 THEN 1.0
                            ELSE toFloat(connections) / 12.0
                        END,
                        isPuente: CASE WHEN connections >= 4 THEN true ELSE false END
                    } AS result
                    ORDER BY result.label
                    """);
            return result.list(record -> record.get("result").asMap());
        }
    }

    public List<Map<String, Object>> getAllEdges() {
        try (Session session = driver.session()) {
            Result result = session.run("""
                    MATCH (a)-[r]->(b)
                    RETURN {
                        id: elementId(r),
                        source: CASE WHEN a.nombre IS NOT NULL THEN a.nombre ELSE a.id END,
                        target: CASE WHEN b.nombre IS NOT NULL THEN b.nombre ELSE b.id END,
                        type: type(r),
                        weight: CASE
                            WHEN type(r) = 'SE_INTEGRA_CON' THEN 2.0
                            WHEN type(r) = 'VISTO_EN' THEN 1.0
                            ELSE 1.5
                        END
                    } AS result
                    """);
            return result.list(record -> record.get("result").asMap());
        }
    }

    public AnalyticsDTO.StatsDTO getStats() {
        try (Session session = driver.session()) {
            Result result = session.run("""
                    CALL {
                        MATCH (t:Tech)
                        RETURN count(t) AS technologies
                    }
                    CALL {
                        MATCH (t:Tema)
                        RETURN count(t) AS themes
                    }
                    CALL {
                        MATCH (:Tech)-[r:SE_INTEGRA_CON]->(:Tech)
                        RETURN count(r) AS integrations
                    }
                    CALL {
                        MATCH ()-[r]->()
                        RETURN count(r) AS relations
                    }
                    RETURN technologies, themes, integrations, relations
                    """);

            if (!result.hasNext()) {
                return new AnalyticsDTO.StatsDTO(0L, 0L, 0L, 0L);
            }

            var row = result.next();
            return new AnalyticsDTO.StatsDTO(
                    row.get("technologies").asLong(),
                    row.get("themes").asLong(),
                    row.get("integrations").asLong(),
                    row.get("relations").asLong());
        }
    }

    public Map<String, Object> getNodeDetails(String nodeId) {
        try (Session session = driver.session()) {
            Result result = session.run("""
                    MATCH (n)
                    WHERE (n.nombre = $nodeId OR n.id = $nodeId)
                    OPTIONAL MATCH (n)-[:VISTO_EN]->(tema:Tema)
                    WITH n, collect(DISTINCT tema.nombre) AS relatedThemes
                    OPTIONAL MATCH (n)-[:SE_INTEGRA_CON]-(tech:Tech)
                    WITH n, relatedThemes, collect(DISTINCT tech.nombre) AS integratedTechnologies
                    OPTIONAL MATCH (n)-[r]-()
                    WITH n, relatedThemes, integratedTechnologies, count(DISTINCT r) AS connections
                    RETURN {
                        id: CASE WHEN n.nombre IS NOT NULL THEN n.nombre ELSE n.id END,
                        label: CASE WHEN n.nombre IS NOT NULL THEN n.nombre ELSE n.id END,
                        category: CASE
                            WHEN 'Tema' IN labels(n) THEN 'Tema'
                            ELSE coalesce(n.categoria, 'Tech')
                        END,
                        type: labels(n)[0],
                        connections: connections,
                        importance: CASE
                            WHEN connections >= 12 THEN 1.0
                            ELSE toFloat(connections) / 12.0
                        END,
                        relatedThemes: relatedThemes,
                        integratedTechnologies: integratedTechnologies
                    } AS result
                    """, Map.of("nodeId", nodeId));

            if (!result.hasNext()) {
                return null;
            }
            return result.next().get("result").asMap();
        }
    }

    public Map<String, Object> findShortestPath(String from, String to) {
        try (Session session = driver.session()) {
            Result result = session.run(
                    """
                            MATCH path = shortestPath((a)-[*]-(b))
                            WHERE (a.nombre = $from OR a.id = $from)
                              AND (b.nombre = $to OR b.id = $to)
                            RETURN {
                                nodes: [node IN nodes(path) | {
                                    id: CASE WHEN node.nombre IS NOT NULL THEN node.nombre ELSE node.id END,
                                    label: CASE WHEN node.nombre IS NOT NULL THEN node.nombre ELSE node.id END,
                                    category: CASE
                                        WHEN 'Tema' IN labels(node) THEN 'Tema'
                                        ELSE coalesce(node.categoria, 'Tech')
                                    END,
                                    connections: size([(node)-[]-() | 1]),
                                    importance: CASE
                                        WHEN size([(node)-[]-() | 1]) >= 12 THEN 1.0
                                        ELSE toFloat(size([(node)-[]-() | 1])) / 12.0
                                    END,
                                    isPuente: CASE WHEN size([(node)-[]-() | 1]) >= 4 THEN true ELSE false END
                                }],
                                edges: [rel IN relationships(path) | {
                                    id: elementId(rel),
                                    source: CASE WHEN startNode(rel).nombre IS NOT NULL THEN startNode(rel).nombre ELSE startNode(rel).id END,
                                    target: CASE WHEN endNode(rel).nombre IS NOT NULL THEN endNode(rel).nombre ELSE endNode(rel).id END,
                                    type: type(rel),
                                    weight: 2.0
                                }],
                                pathLength: length(path)
                            } AS result
                            """,
                    Map.of("from", from, "to", to));

            if (!result.hasNext()) {
                return null;
            }
            return result.next().get("result").asMap();
        }
    }

    public List<Map<String, Object>> searchNodes(String searchTerm) {
        try (Session session = driver.session()) {
            Result result = session.run("""
                    MATCH (n)
                    WHERE (n.nombre IS NOT NULL AND toLower(n.nombre) CONTAINS toLower($searchTerm))
                       OR (n.id IS NOT NULL AND toLower(n.id) CONTAINS toLower($searchTerm))
                       OR (n.categoria IS NOT NULL AND toLower(n.categoria) CONTAINS toLower($searchTerm))
                    OPTIONAL MATCH (n)-[r]-()
                    WITH n, count(DISTINCT r) AS connections
                    RETURN {
                        id: CASE WHEN n.nombre IS NOT NULL THEN n.nombre ELSE n.id END,
                        label: CASE WHEN n.nombre IS NOT NULL THEN n.nombre ELSE n.id END,
                        category: CASE
                            WHEN 'Tema' IN labels(n) THEN 'Tema'
                            ELSE coalesce(n.categoria, 'Tech')
                        END,
                        connections: connections,
                        importance: CASE
                            WHEN connections >= 12 THEN 1.0
                            ELSE toFloat(connections) / 12.0
                        END,
                        isPuente: CASE WHEN connections >= 4 THEN true ELSE false END
                    } AS result
                    ORDER BY result.connections DESC
                    """, Map.of("searchTerm", searchTerm));

            return result.list(record -> record.get("result").asMap());
        }
    }

    public List<Map<String, Object>> getRankedRecommendationsByTema(String temaId) {
        try (Session session = driver.session()) {
            Result result = session.run(
                    """
                            MATCH (tema:Tema {id: $temaId})<-[:VISTO_EN]-(tech:Tech)
                            OPTIONAL MATCH (tech)-[:SE_INTEGRA_CON]-(integrated:Tech)
                            WITH tema, tech, count(DISTINCT integrated) AS integrationsCount
                            OPTIONAL MATCH (tech)-[:COMPLEMENTA]-(complementary:Tech)
                            WITH tema, tech, integrationsCount, count(DISTINCT complementary) AS complementaCount
                            OPTIONAL MATCH (tech)-[:VISTO_EN]->(otherTema:Tema)
                            WITH tema, tech, integrationsCount, complementaCount, count(DISTINCT otherTema) AS temasCount
                            WITH tech,
                                 integrationsCount,
                                 complementaCount,
                                 temasCount,
                                 (
                                     10.0 +
                                     (integrationsCount * 2.0) +
                                     (complementaCount * 1.5) +
                                     CASE WHEN temasCount > 1 THEN 1.0 ELSE 0.0 END
                                 ) AS score
                            RETURN {
                                id: CASE WHEN tech.nombre IS NOT NULL THEN tech.nombre ELSE tech.id END,
                                nombre: CASE WHEN tech.nombre IS NOT NULL THEN tech.nombre ELSE tech.id END,
                                categoria: coalesce(tech.categoria, 'Tech'),
                                score: score,
                                razones: [
                                    'Pertenece al tema seleccionado',
                                    'Se integra con ' + toString(integrationsCount) + ' tecnologías',
                                    'Tiene ' + toString(complementaCount) + ' relaciones COMPLEMENTA',
                                    'Aparece en ' + toString(temasCount) + ' tema(s)'
                                ]
                            } AS result
                            ORDER BY result.score DESC
                            LIMIT 10
                            """,
                    Map.of("temaId", temaId));

            return result.list(record -> record.get("result").asMap());
        }
    }

    public GraphResponseDTO getSubgraphByNodeIds(List<String> nodeIds) {
        if (nodeIds == null || nodeIds.isEmpty()) {
            return new GraphResponseDTO(Collections.emptyList(), Collections.emptyList());
        }

        try (Session session = driver.session()) {
            Result nodeResult = session.run("""
                    MATCH (n)
                    WHERE (n.nombre IS NOT NULL AND n.nombre IN $nodeIds)
                       OR (n.id IS NOT NULL AND n.id IN $nodeIds)
                    OPTIONAL MATCH (n)-[r]-()
                    WITH n, count(DISTINCT r) AS connections
                    RETURN {
                        id: CASE WHEN n.nombre IS NOT NULL THEN n.nombre ELSE n.id END,
                        label: CASE WHEN n.nombre IS NOT NULL THEN n.nombre ELSE n.id END,
                        category: CASE
                            WHEN 'Tema' IN labels(n) THEN 'Tema'
                            ELSE coalesce(n.categoria, 'Tech')
                        END,
                        connections: connections,
                        importance: CASE
                            WHEN connections >= 12 THEN 1.0
                            ELSE toFloat(connections) / 12.0
                        END,
                        isPuente: CASE WHEN connections >= 4 THEN true ELSE false END
                    } AS result
                    """, Map.of("nodeIds", nodeIds));

            List<CytoscapeNodeDTO> nodes = nodeResult.list(record -> {
                Map<String, Object> row = record.get("result").asMap();

                CytoscapeNodeDTO.NodeData data = new CytoscapeNodeDTO.NodeData();
                data.setId(String.valueOf(row.get("id")));
                data.setLabel(String.valueOf(row.get("label")));
                data.setCategory(String.valueOf(row.get("category")));
                data.setConnections(((Number) row.get("connections")).intValue());
                data.setImportance(((Number) row.get("importance")).doubleValue());
                data.setIsPuente(Boolean.parseBoolean(String.valueOf(row.get("isPuente"))));
                data.setMetadata(null);

                return new CytoscapeNodeDTO(data);
            });

            Result edgeResult = session.run("""
                    MATCH (a)-[r]-(b)
                    WHERE ((a.nombre IS NOT NULL AND a.nombre IN $nodeIds) OR (a.id IS NOT NULL AND a.id IN $nodeIds))
                      AND ((b.nombre IS NOT NULL AND b.nombre IN $nodeIds) OR (b.id IS NOT NULL AND b.id IN $nodeIds))
                    RETURN DISTINCT {
                        id: elementId(r),
                        source: CASE WHEN a.nombre IS NOT NULL THEN a.nombre ELSE a.id END,
                        target: CASE WHEN b.nombre IS NOT NULL THEN b.nombre ELSE b.id END,
                        type: type(r),
                        weight: CASE
                            WHEN type(r) = 'SE_INTEGRA_CON' THEN 2.0
                            WHEN type(r) = 'VISTO_EN' THEN 1.0
                            ELSE 1.5
                        END
                    } AS result
                    """, Map.of("nodeIds", nodeIds));

            List<CytoscapeEdgeDTO> edges = edgeResult.list(record -> {
                Map<String, Object> row = record.get("result").asMap();

                CytoscapeEdgeDTO.EdgeData data = new CytoscapeEdgeDTO.EdgeData();
                data.setId(String.valueOf(row.get("id")));
                data.setSource(String.valueOf(row.get("source")));
                data.setTarget(String.valueOf(row.get("target")));
                data.setType(String.valueOf(row.get("type")));
                data.setWeight(((Number) row.get("weight")).doubleValue());

                return new CytoscapeEdgeDTO(data);
            });

            return new GraphResponseDTO(nodes, edges);
        }
    }

    public GraphResponseDTO getComplementaSubgraph() {
        try (Session session = driver.session()) {
            Result nodeResult = session.run("""
                    MATCH (a:Tech)-[:COMPLEMENTA]-(b:Tech)
                    WITH collect(DISTINCT a) + collect(DISTINCT b) AS nodes
                    UNWIND nodes AS n
                    WITH DISTINCT n
                    OPTIONAL MATCH (n)-[r]-()
                    WITH n, count(DISTINCT r) AS connections
                    RETURN {
                        id: CASE WHEN n.nombre IS NOT NULL THEN n.nombre ELSE n.id END,
                        label: CASE WHEN n.nombre IS NOT NULL THEN n.nombre ELSE n.id END,
                        category: CASE
                            WHEN 'Tema' IN labels(n) THEN 'Tema'
                            ELSE coalesce(n.categoria, 'Tech')
                        END,
                        connections: connections,
                        importance: CASE
                            WHEN connections >= 12 THEN 1.0
                            ELSE toFloat(connections) / 12.0
                        END,
                        isPuente: CASE WHEN connections >= 4 THEN true ELSE false END
                    } AS result
                    ORDER BY result.label
                    """);

            List<CytoscapeNodeDTO> nodes = nodeResult.list(record -> {
                Map<String, Object> row = record.get("result").asMap();

                CytoscapeNodeDTO.NodeData data = new CytoscapeNodeDTO.NodeData();
                data.setId(String.valueOf(row.get("id")));
                data.setLabel(String.valueOf(row.get("label")));
                data.setCategory(String.valueOf(row.get("category")));
                data.setConnections(((Number) row.get("connections")).intValue());
                data.setImportance(((Number) row.get("importance")).doubleValue());
                data.setIsPuente(Boolean.parseBoolean(String.valueOf(row.get("isPuente"))));
                data.setMetadata(null);

                return new CytoscapeNodeDTO(data);
            });

            Result edgeResult = session.run("""
                    MATCH (a:Tech)-[r:COMPLEMENTA]-(b:Tech)
                    RETURN DISTINCT {
                        id: elementId(r),
                        source: CASE WHEN a.nombre IS NOT NULL THEN a.nombre ELSE a.id END,
                        target: CASE WHEN b.nombre IS NOT NULL THEN b.nombre ELSE b.id END,
                        type: type(r),
                        weight: 1.8
                    } AS result
                    """);

            List<CytoscapeEdgeDTO> edges = edgeResult.list(record -> {
                Map<String, Object> row = record.get("result").asMap();

                CytoscapeEdgeDTO.EdgeData data = new CytoscapeEdgeDTO.EdgeData();
                data.setId(String.valueOf(row.get("id")));
                data.setSource(String.valueOf(row.get("source")));
                data.setTarget(String.valueOf(row.get("target")));
                data.setType(String.valueOf(row.get("type")));
                data.setWeight(((Number) row.get("weight")).doubleValue());

                return new CytoscapeEdgeDTO(data);
            });

            return new GraphResponseDTO(nodes, edges);
        }
    }

    public List<Map<String, Object>> getNodeDegrees() {
        try (Session session = driver.session()) {
            Result result = session.run("""
                    MATCH (n)
                    OPTIONAL MATCH (n)-[r]-()
                    WITH n, count(DISTINCT r) AS degree
                    RETURN {
                        nodeName: CASE WHEN n.nombre IS NOT NULL THEN n.nombre ELSE n.id END,
                        degree: degree,
                        importance: CASE
                            WHEN degree >= 12 THEN 1.0
                            ELSE toFloat(degree) / 12.0
                        END,
                        category: CASE
                            WHEN 'Tema' IN labels(n) THEN 'Tema'
                            ELSE coalesce(n.categoria, 'Tech')
                        END
                    } AS result
                    ORDER BY result.degree DESC
                    LIMIT 15
                    """);
            return result.list(record -> record.get("result").asMap());
        }
    }

    public List<Map<String, Object>> findBridgeNodes() {
        try (Session session = driver.session()) {
            Result result = session.run("""
                    MATCH (n:Tech)-[:VISTO_EN]->(tema:Tema)
                    WITH n, collect(DISTINCT tema.nombre) AS temas, count(DISTINCT tema) AS totalTemas
                    WHERE totalTemas > 1
                    RETURN {
                        nodeName: n.nombre,
                        betweenness: toFloat(totalTemas) / 4.0,
                        connectedClusters: temas
                    } AS result
                    ORDER BY result.betweenness DESC
                    LIMIT 10
                    """);
            return result.list(record -> record.get("result").asMap());
        }
    }

    public List<Map<String, Object>> findClusters() {
        try (Session session = driver.session()) {
            Result result = session.run("""
                    MATCH (t:Tech)
                    WITH t.categoria AS category, collect(t.nombre) AS nodes
                    RETURN {
                        clusterId: toInteger(rand() * 100000),
                        nodes: nodes,
                        size: size(nodes)
                    } AS result
                    ORDER BY result.size DESC
                    LIMIT 8
                    """);
            return result.list(record -> record.get("result").asMap());
        }
    }
}