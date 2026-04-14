package com.G35.backend.tecnologias;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

public interface TecnologiaRepository extends Neo4jRepository<Tecnologia, String> {

    @Query("MATCH (t:Tema {nombre: $nombreTema})<-[:VISTO_EN]-(tech) RETURN tech")
    List<Tecnologia> findByTema(String nombreTema);

}
