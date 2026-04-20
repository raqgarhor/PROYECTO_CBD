package com.G35.backend.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Component;

@Component
public class Neo4jSeedRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(Neo4jSeedRunner.class);

    private final Neo4jClient neo4jClient;
    private final ResourceLoader resourceLoader;

    @Value("${app.seed.enabled:false}")
    private boolean seedEnabled;

    public Neo4jSeedRunner(Neo4jClient neo4jClient, ResourceLoader resourceLoader) {
        this.neo4jClient = neo4jClient;
        this.resourceLoader = resourceLoader;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!seedEnabled) {
            logger.info("Neo4j seed is disabled (app.seed.enabled=false)");
            return;
        }

        try {
            executeSeedFile("classpath:data.cypher");
        } catch (Exception e) {
            logger.warn("⚠️ Error al cargar datos en Neo4j: {}",
                    e.getMessage());
            throw new RuntimeException("No se pudo conectar a Neo4j en " + System.getProperty("spring.neo4j.uri"), e);
        }
    }

    private void executeSeedFile(String location) throws IOException {
        Resource resource = resourceLoader.getResource(location);

        if (!resource.exists()) {
            logger.warn("Seed file not found at {}", location);
            return;
        }

        String cypher = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

        int executedStatements = 0;
        for (String statement : Arrays.stream(cypher.split(";"))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList()) {
            neo4jClient.query(statement).run();
            executedStatements++;
        }

        logger.info("Neo4j seed executed successfully. Statements run: {}", executedStatements);
    }
}
