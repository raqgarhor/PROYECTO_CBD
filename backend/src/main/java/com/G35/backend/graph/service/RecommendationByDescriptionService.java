package com.G35.backend.graph.service;

import com.G35.backend.graph.dto.GraphResponseDTO;
import com.G35.backend.graph.dto.RecommendationResponseDTO;
import com.G35.backend.graph.repository.GraphRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationByDescriptionService {

    private static final int MAX_RECOMMENDATIONS = 10;

    private final GraphRepository graphRepository;

    private static final Map<String, List<String>> KEYWORDS_BY_AREA = Map.ofEntries(
            Map.entry("Grafos", List.of(
                    "grafo", "grafos", "graph", "relacion", "relaciones",
                    "conexion", "conexiones", "nodo", "nodos", "arista",
                    "aristas", "neo4j", "cypher", "camino", "camino mas corto")),
            Map.entry("Visualización", List.of(
                    "visualizar", "visualizacion", "grafico", "graficos",
                    "dashboard", "panel", "cytoscape", "interactivo",
                    "interactiva", "explorar", "exploracion", "analizar",
                    "analisis")),
            Map.entry("Backend", List.of(
                    "backend", "servidor", "api", "rest", "endpoint",
                    "servicio", "servicios", "spring", "spring boot",
                    "java", "python", "node", "nodejs", "express",
                    "django", "microservicios")),
            Map.entry("Búsqueda", List.of(
                    "busqueda", "buscar", "search", "elasticsearch",
                    "elastic", "fulltext", "texto completo", "indexar",
                    "indice", "indices")),
            Map.entry("Mensajería", List.of(
                    "mensajeria", "cola", "colas", "queue", "asincronico",
                    "asincrona", "eventos", "evento", "streaming", "kafka",
                    "rabbitmq", "pubsub", "publish", "subscribe")),
            Map.entry("Bases de datos", List.of(
                    "base de datos", "database", "db", "bbdd", "nosql",
                    "sql", "mongodb", "postgresql", "mysql", "redis",
                    "cassandra", "persistencia", "almacenamiento", "datos",
                    "consulta", "consultas")),
            Map.entry("DevOps", List.of(
                    "devops", "docker", "kubernetes", "ci/cd", "pipeline",
                    "deploy", "deployment", "despliegue", "contenedor",
                    "contenedores", "cloud", "nube")),
            Map.entry("Seguridad", List.of(
                    "seguridad", "autenticacion", "autorizacion",
                    "encriptacion", "cifrado", "ssl", "jwt", "oauth",
                    "contrasena", "token")),
            Map.entry("Cache", List.of(
                    "cache", "caché", "rendimiento", "velocidad",
                    "memoria", "rapido", "rapida", "latencia")),
            Map.entry("Escalabilidad", List.of(
                    "escalable", "escalabilidad", "alto rendimiento",
                    "rendimiento", "distribuido", "distribuida",
                    "replicacion", "cluster", "clusters")));

    public RecommendationResponseDTO getRecommendationsByDescription(String description) {
        if (description == null || description.isBlank()) {
            return new RecommendationResponseDTO(
                    "by-description",
                    new GraphResponseDTO(Collections.emptyList(), Collections.emptyList()),
                    Collections.emptyList());
        }

        log.info("Buscando recomendaciones para descripción: {}", description);

        String normalizedDescription = normalize(description);
        Set<String> keywords = extractKeywords(normalizedDescription);

        log.info("Keywords detectadas: {}", keywords);

        List<Map<String, Object>> technologies = graphRepository.getAllTechnologiesWithContext();

        List<RecommendationResponseDTO.RecommendationItemDTO> recommendations = technologies.stream()
                .map(tech -> rankTechnology(tech, keywords, normalizedDescription))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .sorted(Comparator.comparingDouble(
                        RecommendationResponseDTO.RecommendationItemDTO::getScore).reversed())
                .limit(MAX_RECOMMENDATIONS)
                .collect(Collectors.toList());

        List<String> ids = recommendations.stream()
                .map(RecommendationResponseDTO.RecommendationItemDTO::getId)
                .collect(Collectors.toList());

        GraphResponseDTO graph = ids.isEmpty()
                ? new GraphResponseDTO(Collections.emptyList(), Collections.emptyList())
                : graphRepository.getSubgraphByNodeIds(ids);

        return new RecommendationResponseDTO("by-description", graph, recommendations);
    }

    private Optional<RecommendationResponseDTO.RecommendationItemDTO> rankTechnology(
            Map<String, Object> tech,
            Set<String> keywords,
            String normalizedDescription) {
        String id = asString(tech.get("id"));
        String nombreOriginal = asString(tech.get("nombre"));
        String categoriaOriginal = asString(tech.get("categoria"));
        String descripcionOriginal = asString(tech.get("descripcion"));

        String nombre = normalize(nombreOriginal);
        String categoria = normalize(categoriaOriginal);
        String descripcion = normalize(descripcionOriginal);

        List<String> temas = normalizeList(tech.get("temas"));
        List<String> relaciones = normalizeList(tech.get("relaciones"));
        List<String> tecnologiasRelacionadas = normalizeList(tech.get("tecnologiasRelacionadas"));

        boolean wantsGraphs = containsAny(
                normalizedDescription,
                "grafo", "grafos", "graph", "nodo", "nodos",
                "relacion", "relaciones", "conexion", "conexiones", "arista", "aristas");

        boolean wantsVisualization = containsAny(
                normalizedDescription,
                "visualizar", "visualizacion", "grafico", "graficos",
                "interactivo", "interactiva", "explorar", "exploracion",
                "dashboard", "panel");

        boolean wantsAnalysis = containsAny(
                normalizedDescription,
                "analizar", "analisis", "detectar", "descubrir", "consultar");

        boolean wantsBackend = containsAny(
                normalizedDescription,
                "backend", "api", "rest", "servidor", "servicio",
                "servicios", "endpoint", "microservicio", "microservicios");

        boolean wantsSearch = containsAny(
                normalizedDescription,
                "busqueda", "buscar", "search", "texto completo",
                "fulltext", "indexar", "indice", "indices");

        boolean wantsMessaging = containsAny(
                normalizedDescription,
                "mensajeria", "cola", "colas", "queue", "eventos",
                "evento", "asincronico", "asincrona", "streaming",
                "pubsub", "publish", "subscribe");

        double score = 0.0;
        List<String> razones = new ArrayList<>();

        if (wantsGraphs) {
            if (nombre.contains("neo4j")) {
                score += 35.0;
                razones.add("Especializada en bases de datos de grafos");
            }

            if (categoria.contains("grafo") || temas.stream().anyMatch(t -> t.contains("grafo"))) {
                score += 25.0;
                razones.add("Pertenece al área de grafos");
            }

            if (descripcion.contains("grafo") || descripcion.contains("nodo")
                    || descripcion.contains("relacion") || descripcion.contains("conexion")) {
                score += 15.0;
                razones.add("Su descripción está relacionada con nodos y relaciones");
            }

        }
        if (wantsGraphs && wantsBackend) {
            if (nombre.contains("neo4j")) {
                score += 25.0;
                razones.add("Adecuada para backend con datos altamente relacionados");
            }

            if (categoria.contains("grafo") || temas.stream().anyMatch(t -> t.contains("grafo"))) {
                score += 15.0;
                razones.add("Útil para gestionar relaciones complejas desde backend");
            }
        }

        if (wantsVisualization) {
            if (nombre.contains("cytoscape")) {
                score += 35.0;
                razones.add("Herramienta específica para visualización de grafos");
            }

            if (categoria.contains("visual") || temas.stream().anyMatch(t -> t.contains("visual"))) {
                score += 20.0;
                razones.add("Está relacionada con visualización");
            }

            if (descripcion.contains("visual") || descripcion.contains("interactiv")
                    || descripcion.contains("grafico")) {
                score += 12.0;
                razones.add("Permite representar información de forma visual");
            }
        }

        if (wantsAnalysis) {
            if (descripcion.contains("analisis") || descripcion.contains("analizar")
                    || descripcion.contains("explorar")) {
                score += 8.0;
                razones.add("Ayuda al análisis y exploración de datos");
            }
        }

        if (wantsBackend) {
            if (categoria.contains("backend") || nombre.contains("spring boot")
                    || nombre.equals("spring")) {
                score += 25.0;
                razones.add("Tecnología backend adecuada para construir APIs");
            }

            if (descripcion.contains("api") || descripcion.contains("rest")
                    || descripcion.contains("backend") || descripcion.contains("servidor")) {
                score += 15.0;
                razones.add("Su descripción coincide con desarrollo backend");
            }
        }

        if (wantsSearch) {
            if (nombre.contains("elastic") || nombre.contains("elasticsearch")) {
                score += 40.0;
                razones.add("Motor especializado en búsqueda e indexación");
            }

            if (categoria.contains("busqueda") || categoria.contains("search")) {
                score += 25.0;
                razones.add("Pertenece al área de búsqueda");
            }

            if (descripcion.contains("busqueda") || descripcion.contains("index")
                    || descripcion.contains("texto completo") || descripcion.contains("search")) {
                score += 15.0;
                razones.add("Su descripción coincide con búsqueda de texto");
            }
        }

        if (wantsMessaging) {
            if (nombre.contains("kafka") || nombre.contains("rabbitmq")) {
                score += 40.0;
                razones.add("Tecnología especializada en mensajería y eventos");
            }

            if (categoria.contains("mensajeria") || categoria.contains("streaming")) {
                score += 25.0;
                razones.add("Pertenece al área de mensajería o streaming");
            }

            if (descripcion.contains("evento") || descripcion.contains("cola")
                    || descripcion.contains("asincron") || descripcion.contains("streaming")) {
                score += 15.0;
                razones.add("Su descripción coincide con comunicación asíncrona");
            }
        }

        for (String keyword : keywords) {
            if (nombre.contains(keyword)) {
                score += 8.0;
                razones.add("Coincide con el nombre de la tecnología");
            }

            if (descripcion.contains(keyword)) {
                score += 6.0;
                razones.add("Su descripción coincide con la necesidad indicada");
            }

            if (categoria.contains(keyword)) {
                score += 4.0;
                razones.add("Pertenece a una categoría relacionada");
            }

            if (temas.stream().anyMatch(tema -> tema.contains(keyword))) {
                score += 7.0;
                razones.add("Está asociada a un tema relacionado");
            }

            if (tecnologiasRelacionadas.stream().anyMatch(relTech -> relTech.contains(keyword))) {
                score += 4.0;
                razones.add("Está conectada con tecnologías relacionadas");
            }
        }

        score += scoreByRelations(relaciones, normalizedDescription, razones);

        int degree = toInt(tech.get("degree"));
        if (degree > 0) {
            score += Math.min(degree, 10) * 0.15;
            razones.add("Tiene " + degree + " conexiones en el grafo");
        }

        score = applyPenalties(
                score,
                nombre,
                categoria,
                descripcion,
                temas,
                tecnologiasRelacionadas,
                wantsGraphs,
                wantsVisualization,
                wantsBackend,
                wantsSearch,
                wantsMessaging);

        double minScore = calculateMinScore(
                wantsGraphs,
                wantsVisualization,
                wantsBackend,
                wantsSearch,
                wantsMessaging);

        if (score < minScore) {
            return Optional.empty();
        }

        List<String> finalReasons = razones.stream()
                .distinct()
                .limit(3)
                .collect(Collectors.toList());

        return Optional.of(new RecommendationResponseDTO.RecommendationItemDTO(
                id,
                nombreOriginal,
                categoriaOriginal,
                score,
                finalReasons));
    }

    private double applyPenalties(
            double score,
            String nombre,
            String categoria,
            String descripcion,
            List<String> temas,
            List<String> tecnologiasRelacionadas,
            boolean wantsGraphs,
            boolean wantsVisualization,
            boolean wantsBackend,
            boolean wantsSearch,
            boolean wantsMessaging) {
        boolean graphRelated = nombre.contains("neo4j")
                || nombre.contains("cytoscape")
                || categoria.contains("grafo")
                || descripcion.contains("grafo")
                || descripcion.contains("nodo")
                || descripcion.contains("relacion")
                || descripcion.contains("conexion")
                || temas.stream().anyMatch(t -> t.contains("grafo"))
                || tecnologiasRelacionadas.stream().anyMatch(t -> t.contains("neo4j") || t.contains("cytoscape"));

        boolean visualRelated = nombre.contains("cytoscape")
                || categoria.contains("visual")
                || descripcion.contains("visual")
                || descripcion.contains("interactiv")
                || temas.stream().anyMatch(t -> t.contains("visual"));

        boolean backendRelated = categoria.contains("backend")
                || nombre.contains("spring")
                || nombre.contains("django")
                || nombre.contains("express")
                || nombre.contains("node")
                || descripcion.contains("api")
                || descripcion.contains("rest")
                || descripcion.contains("backend")
                || descripcion.contains("servidor");

        boolean searchRelated = nombre.contains("elastic")
                || nombre.contains("elasticsearch")
                || categoria.contains("busqueda")
                || categoria.contains("search")
                || descripcion.contains("busqueda")
                || descripcion.contains("index")
                || descripcion.contains("texto completo");

        boolean messagingRelated = nombre.contains("kafka")
                || nombre.contains("rabbitmq")
                || categoria.contains("mensajeria")
                || categoria.contains("streaming")
                || descripcion.contains("evento")
                || descripcion.contains("cola")
                || descripcion.contains("asincron")
                || descripcion.contains("streaming");

        boolean genericTech = categoria.contains("backend")
                || categoria.contains("procesamiento")
                || categoria.contains("framework")
                || categoria.contains("documental")
                || categoria.contains("clave-valor")
                || categoria.contains("sgbd")
                || categoria.contains("nosql");

        if ((wantsGraphs || wantsVisualization) && !graphRelated && !visualRelated) {
            score *= 0.25;
        }

        if ((wantsGraphs || wantsVisualization) && genericTech && !graphRelated && !visualRelated) {
            score *= 0.5;
        }

        if (wantsBackend && !wantsGraphs && !backendRelated) {
            score *= 0.35;
        }
        if (wantsGraphs && backendRelated) {
            score *= 0.6;
        }

        if (wantsSearch && !searchRelated) {
            score *= 0.2;
        }

        if (wantsMessaging && !messagingRelated) {
            score *= 0.2;
        }

        if (wantsSearch && categoria.contains("backend")) {
            score *= 0.5;
        }

        if (wantsBackend && (categoria.contains("documental")
                || categoria.contains("clave-valor")
                || categoria.contains("sgbd")
                || categoria.contains("nosql"))) {
            score *= 0.6;
        }

        return score;
    }

    private double calculateMinScore(
            boolean wantsGraphs,
            boolean wantsVisualization,
            boolean wantsBackend,
            boolean wantsSearch,
            boolean wantsMessaging) {
        if (wantsGraphs && wantsBackend) {
            return 8.0;
        }

        if (wantsGraphs && wantsVisualization) {
            return 15.0;
        }

        if (wantsGraphs || wantsVisualization) {
            return 12.0;
        }

        if (wantsSearch || wantsMessaging) {
            return 10.0;
        }

        if (wantsBackend) {
            return 8.0;
        }

        return 5.0;
    }

    private double scoreByRelations(
            List<String> relaciones,
            String description,
            List<String> razones) {
        double score = 0.0;

        if (containsAny(description, "integrar", "integracion", "api", "backend", "servicio")
                && relaciones.contains("se_integra_con")) {
            score += 4.0;
            razones.add("Se integra con otras tecnologías del grafo");
        }

        if (containsAny(description, "complementar", "stack", "usar juntas", "ecosistema")
                && relaciones.contains("complementa")) {
            score += 4.0;
            razones.add("Complementa a otras tecnologías");
        }

        if (containsAny(description, "alternativa", "sustituir", "reemplazar")
                && relaciones.contains("es_alternativa_a")) {
            score += 3.0;
            razones.add("Aparece como alternativa a otras tecnologías");
        }

        if (containsAny(description, "comparar", "competencia", "similar")
                && relaciones.contains("compite_con")) {
            score += 3.0;
            razones.add("Compite con tecnologías similares");
        }

        return score;
    }

    private Set<String> extractKeywords(String normalizedDescription) {
        Set<String> foundKeywords = new LinkedHashSet<>();

        KEYWORDS_BY_AREA.values().stream()
                .flatMap(Collection::stream)
                .map(this::normalize)
                .filter(normalizedDescription::contains)
                .forEach(foundKeywords::add);

        return foundKeywords;
    }

    private boolean containsAny(String text, String... words) {
        for (String word : words) {
            if (text.contains(normalize(word))) {
                return true;
            }
        }
        return false;
    }

    private List<String> normalizeList(Object obj) {
        return asStringList(obj).stream()
                .map(this::normalize)
                .collect(Collectors.toList());
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }

        String lower = value.toLowerCase(Locale.ROOT).trim();

        return Normalizer.normalize(lower, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
    }

    private String asString(Object obj) {
        return obj == null ? "" : obj.toString();
    }

    private int toInt(Object obj) {
        if (obj instanceof Number number) {
            return number.intValue();
        }
        return 0;
    }

    private List<String> asStringList(Object obj) {
        if (obj == null) {
            return Collections.emptyList();
        }

        if (obj instanceof List<?> list) {
            return list.stream()
                    .filter(Objects::nonNull)
                    .map(Object::toString)
                    .collect(Collectors.toList());
        }

        return List.of(obj.toString());
    }
}