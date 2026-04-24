package com.G35.backend.tecnologias;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

import com.G35.backend.tecnologias.dto.CrearTecnologiaRequestDTO;
import com.G35.backend.tecnologias.dto.RelacionInputDTO;

@Service
public class TecnologiaService {

    private static final Set<String> RELACIONES_PERMITIDAS = Set.of(
            "SE_INTEGRA_CON",
            "COMPLEMENTA",
            "COMPITE_CON",
            "RELACIONADA_CON",
            "ES_ALTERNATIVA_A");

    @Autowired
    private TecnologiaRepository tecnologiaRepository;

    @Autowired
    private Neo4jClient neo4jClient;

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

    public Tecnologia crearConRelaciones(CrearTecnologiaRequestDTO request) {
        neo4jClient.query("""
                MERGE (tech:Tech {nombre: $nombre})
                SET tech.categoria = $categoria,
                    tech.descripcion = $descripcion,
                    tech.id = coalesce(tech.id, $nombre),
                    tech.label = coalesce(tech.label, $nombre)
                """)
                .bind(request.getNombre()).to("nombre")
                .bind(request.getCategoria()).to("categoria")
                .bind(request.getDescripcion()).to("descripcion")
                .run();

        if (request.getTemaId() != null && !request.getTemaId().isBlank()) {
            neo4jClient.query("""
                    MATCH (tech:Tech {nombre: $nombre})
                    MATCH (tema:Tema {id: $temaId})
                    MERGE (tech)-[:VISTO_EN]->(tema)
                    """)
                    .bind(request.getNombre()).to("nombre")
                    .bind(request.getTemaId()).to("temaId")
                    .run();
        }

        if (request.getRelaciones() != null) {
            for (RelacionInputDTO relacion : request.getRelaciones()) {
                if (relacion == null || relacion.getTipo() == null || relacion.getDestino() == null) {
                    continue;
                }

                String tipo = relacion.getTipo().trim().toUpperCase();
                String destino = relacion.getDestino().trim();

                if (!RELACIONES_PERMITIDAS.contains(tipo)) {
                    throw new IllegalArgumentException("Tipo de relación no permitido: " + tipo);
                }

                neo4jClient.query("""
                        MATCH (a:Tech {nombre: $origen})
                        MATCH (b:Tech {nombre: $destino})
                        MERGE (a)-[r:%s]->(b)
                        SET r.weight = coalesce(r.weight, 1.0),
                            r.type = coalesce(r.type, $tipo)
                        """.formatted(tipo))
                        .bind(request.getNombre()).to("origen")
                        .bind(destino).to("destino")
                        .bind(tipo).to("tipo")
                        .run();
            }
        }

        return tecnologiaRepository.findById(request.getNombre())
                .orElseThrow(() -> new RuntimeException("No se pudo crear la tecnología: " + request.getNombre()));
    }

    public Tecnologia actualizar(String nombre, Tecnologia tecnologia) {
        return tecnologiaRepository.findById(nombre)
                .map(tech -> {
                    tech.setCategoria(tecnologia.getCategoria());
                    tech.setDescripcion(tecnologia.getDescripcion());
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
