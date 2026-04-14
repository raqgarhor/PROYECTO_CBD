package com.G35.backend.temas;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import lombok.Getter;
import lombok.Setter;

@Node("Tema")
@Getter
@Setter
public class Tema {

    @Id
    private String id;
    private String nombre;

    public Tema() {
    }

}
