package com.G35.backend.tecnologias.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RelacionInputDTO {

    @NotBlank(message = "El tipo de relación no puede estar vacío")
    private String tipo;

    @NotBlank(message = "El destino de la relación no puede estar vacío")
    private String destino;
}
