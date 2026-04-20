package com.G35.backend.tecnologias;

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

import com.G35.backend.tecnologias.dto.TecnologiaDTO;
import com.G35.backend.tecnologias.mapper.TecnologiaMapper;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tecnologias")
public class TecnologiaController {

    @Autowired
    private TecnologiaService tecnologiaService;

    @Autowired
    private TecnologiaMapper tecnologiaMapper;

    @GetMapping
    public ResponseEntity<List<TecnologiaDTO>> listarTodas() {
        List<TecnologiaDTO> tecnologias = tecnologiaService.listarTodo()
                .stream()
                .map(tecnologiaMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tecnologias);
    }

    @GetMapping("/{nombre}")
    public ResponseEntity<TecnologiaDTO> obtenerPorNombre(@PathVariable String nombre) {
        return tecnologiaService.obtenerPorNombre(nombre)
                .map(tech -> ResponseEntity.ok(tecnologiaMapper.toDTO(tech)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar/tema/{tema}")
    public ResponseEntity<List<TecnologiaDTO>> getPorTema(@PathVariable String tema) {
        List<TecnologiaDTO> tecnologias = tecnologiaService.buscarPorTema(tema)
                .stream()
                .map(tecnologiaMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tecnologias);
    }

    @PostMapping
    public ResponseEntity<TecnologiaDTO> crear(@Valid @RequestBody TecnologiaDTO dto) {
        Tecnologia tecnologia = tecnologiaMapper.toEntity(dto);
        Tecnologia creada = tecnologiaService.crear(tecnologia);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tecnologiaMapper.toDTO(creada));
    }

    @PutMapping("/{nombre}")
    public ResponseEntity<TecnologiaDTO> actualizar(
            @PathVariable String nombre,
            @Valid @RequestBody TecnologiaDTO dto) {
        Tecnologia tecnologia = tecnologiaMapper.toEntity(dto);
        Tecnologia actualizada = tecnologiaService.actualizar(nombre, tecnologia);
        return ResponseEntity.ok(tecnologiaMapper.toDTO(actualizada));
    }

    @DeleteMapping("/{nombre}")
    public ResponseEntity<Void> eliminar(@PathVariable String nombre) {
        tecnologiaService.eliminar(nombre);
        return ResponseEntity.noContent().build();
    }

}
