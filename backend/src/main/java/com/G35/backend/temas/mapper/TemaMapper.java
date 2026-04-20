package com.G35.backend.temas.mapper;

import org.springframework.stereotype.Component;

import com.G35.backend.temas.Tema;
import com.G35.backend.temas.dto.TemaDTO;

@Component
public class TemaMapper {

    public TemaDTO toDTO(Tema tema) {
        if (tema == null) {
            return null;
        }
        return new TemaDTO(
                tema.getId(),
                tema.getNombre());
    }

    public Tema toEntity(TemaDTO dto) {
        if (dto == null) {
            return null;
        }
        Tema tema = new Tema();
        tema.setId(dto.getId());
        tema.setNombre(dto.getNombre());
        return tema;
    }

}
