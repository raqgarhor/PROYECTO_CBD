package com.G35.backend.tecnologias;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

public interface TecnologiaRepository extends Neo4jRepository<Tecnologia, String> {

    @Query("""
            MATCH (tech:Tech)
            OPTIONAL MATCH (tech)-[s:SE_INTEGRA_CON]->(compatible:Tech)
            RETURN tech,
                   collect(DISTINCT s),
                   collect(DISTINCT compatible)
            """)
    List<Tecnologia> findAllWithCompatibles();

    @Query("""
            MATCH (t:Tema {nombre: $nombreTema})<-[v:VISTO_EN]-(tech:Tech)
            OPTIONAL MATCH (tech)-[s:SE_INTEGRA_CON]->(compatible:Tech)
            RETURN tech,
                   collect(DISTINCT v),
                   collect(DISTINCT t),
                   collect(DISTINCT s),
                   collect(DISTINCT compatible)
            """)
    List<Tecnologia> findByTema(String nombreTema);

}
