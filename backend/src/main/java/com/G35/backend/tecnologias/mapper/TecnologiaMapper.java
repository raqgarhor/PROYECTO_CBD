package com.G35.backend.tecnologias.mapper;

import org.springframework.stereotype.Component;

import com.G35.backend.tecnologias.Tecnologia;
import com.G35.backend.tecnologias.dto.TecnologiaDTO;

@Component
public class TecnologiaMapper {

    public TecnologiaDTO toDTO(Tecnologia tecnologia) {
        if (tecnologia == null) {
            return null;
        }
        return new TecnologiaDTO(
                tecnologia.getNombre(),
                tecnologia.getCategoria());
    }

    public Tecnologia toEntity(TecnologiaDTO dto) {
        if (dto == null) {
            return null;
        }
        Tecnologia tecnologia = new Tecnologia();
        tecnologia.setNombre(dto.getNombre());
        tecnologia.setCategoria(dto.getCategoria());
        return tecnologia;
    }

}
