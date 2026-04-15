package com.G35.backend.temas;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TemaService {

    @Autowired
    private TemaRepository temaRepository;

    public List<Tema> listarTodos() {
        return temaRepository.findAll();
    }
}
