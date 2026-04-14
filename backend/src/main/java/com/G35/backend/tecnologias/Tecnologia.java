package com.G35.backend.tecnologias;

import java.util.Set;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import com.G35.backend.temas.Tema;

import lombok.Getter;
import lombok.Setter;

@Node("Tech")
@Getter
@Setter
public class Tecnologia {

    @Id
    private String nombre;
    private String categoria;

    @Relationship(type = "VISTO_EN", direction = Relationship.Direction.OUTGOING)
    private Set<Tema> temas;

    @Relationship(type = "SE_INTEGRA_CON", direction = Relationship.Direction.OUTGOING)
    private Set<Tecnologia> compatibles;

    public Tecnologia() {
    }

}
