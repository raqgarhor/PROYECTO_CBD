package com.G35.backend.temas;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.G35.backend.temas.dto.TemaDTO;
import com.G35.backend.temas.mapper.TemaMapper;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/temas")
public class TemaController {

    @Autowired
    private TemaService temaService;

    @Autowired
    private TemaMapper temaMapper;

    @GetMapping
    public ResponseEntity<List<TemaDTO>> listarTodos() {
        List<TemaDTO> temas = temaService.listarTodos()
                .stream()
                .map(temaMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(temas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TemaDTO> obtenerPorId(@PathVariable String id) {
        return temaService.obtenerPorId(id)
                .map(tema -> ResponseEntity.ok(temaMapper.toDTO(tema)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TemaDTO> crear(@Valid @RequestBody TemaDTO dto) {
        Tema tema = temaMapper.toEntity(dto);
        Tema creado = temaService.crear(tema);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(temaMapper.toDTO(creado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TemaDTO> actualizar(
            @PathVariable String id,
            @Valid @RequestBody TemaDTO dto) {
        Tema tema = temaMapper.toEntity(dto);
        Tema actualizado = temaService.actualizar(id, tema);
        return ResponseEntity.ok(temaMapper.toDTO(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        temaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

}
