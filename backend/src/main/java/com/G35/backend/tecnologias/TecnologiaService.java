package com.G35.backend.tecnologias;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TecnologiaService {

    @Autowired
    private TecnologiaRepository tecnologiaRepository;

    public List<Tecnologia> listarTodo() {
        return tecnologiaRepository.findAllWithCompatibles();
    }

    public List<Tecnologia> buscarPorTema(String tema) {
        return tecnologiaRepository.findByTema(tema);
    }
}
