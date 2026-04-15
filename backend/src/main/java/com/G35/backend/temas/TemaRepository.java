package com.G35.backend.temas;

import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface TemaRepository extends Neo4jRepository<Tema, String> {
}
