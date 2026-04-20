package com.G35.backend.temas;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TemaService {

    @Autowired
    private TemaRepository temaRepository;

    public List<Tema> listarTodos() {
        return temaRepository.findAll();
    }

    public Optional<Tema> obtenerPorId(String id) {
        return temaRepository.findById(id);
    }

    public Tema crear(Tema tema) {
        return temaRepository.save(tema);
    }

    public Tema actualizar(String id, Tema tema) {
        return temaRepository.findById(id)
                .map(t -> {
                    t.setNombre(tema.getNombre());
                    return temaRepository.save(t);
                })
                .orElseThrow(() -> new RuntimeException("Tema no encontrado: " + id));
    }

    public void eliminar(String id) {
        if (!temaRepository.existsById(id)) {
            throw new RuntimeException("Tema no encontrado: " + id);
        }
        temaRepository.deleteById(id);
    }

}
