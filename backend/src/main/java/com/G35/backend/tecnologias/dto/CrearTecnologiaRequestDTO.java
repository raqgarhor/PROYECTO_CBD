package com.G35.backend.tecnologias.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CrearTecnologiaRequestDTO {

    @NotBlank(message = "El nombre de la tecnología no puede estar vacío")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "La categoría no puede estar vacía")
    @Size(min = 2, max = 50, message = "La categoría debe tener entre 2 y 50 caracteres")
    private String categoria;

    @Size(max = 400, message = "La descripción no puede exceder 400 caracteres")
    private String descripcion;

    private String temaId;

    @Valid
    private List<RelacionInputDTO> relaciones;
}
