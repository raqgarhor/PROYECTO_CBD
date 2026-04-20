package com.G35.backend.tecnologias;

import java.util.List;
import java.util.Optional;

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

    public Optional<Tecnologia> obtenerPorNombre(String nombre) {
        return tecnologiaRepository.findById(nombre);
    }

    public Tecnologia crear(Tecnologia tecnologia) {
        return tecnologiaRepository.save(tecnologia);
    }

    public Tecnologia actualizar(String nombre, Tecnologia tecnologia) {
        return tecnologiaRepository.findById(nombre)
                .map(tech -> {
                    tech.setCategoria(tecnologia.getCategoria());
                    return tecnologiaRepository.save(tech);
                })
                .orElseThrow(() -> new RuntimeException("Tecnología no encontrada: " + nombre));
    }

    public void eliminar(String nombre) {
        if (!tecnologiaRepository.existsById(nombre)) {
            throw new RuntimeException("Tecnología no encontrada: " + nombre);
        }
        tecnologiaRepository.deleteById(nombre);
    }

}
