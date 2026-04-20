package com.G35.backend.temas.dto;

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
public class TemaDTO {

    @NotBlank(message = "El id del tema no puede estar vacío")
    @Size(min = 1, max = 50, message = "El id debe tener entre 1 y 50 caracteres")
    private String id;

    @NotBlank(message = "El nombre del tema no puede estar vacío")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

}
