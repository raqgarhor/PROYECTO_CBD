package com.G35.backend.tecnologias;

import java.util.Set;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import com.G35.backend.temas.Tema;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Node("Tech")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tecnologia {

    @Id
    @NotBlank(message = "El nombre de la tecnología no puede estar vacío")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "La categoría no puede estar vacía")
    @Size(min = 2, max = 50, message = "La categoría debe tener entre 2 y 50 caracteres")
    private String categoria;

    @Size(max = 400, message = "La descripción no puede exceder 400 caracteres")
    private String descripcion;

    @Relationship(type = "VISTO_EN", direction = Relationship.Direction.OUTGOING)
    private Set<Tema> temas;

    @Relationship(type = "SE_INTEGRA_CON", direction = Relationship.Direction.OUTGOING)
    private Set<Tecnologia> compatibles;

}
