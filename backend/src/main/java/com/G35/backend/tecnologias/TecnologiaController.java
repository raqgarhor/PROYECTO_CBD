package com.G35.backend.tecnologias;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TecnologiaController {

    @Autowired
    private TecnologiaService tecnologiaService;

    @GetMapping("/tecnologias")
    public List<Tecnologia> getTodas() {
        return tecnologiaService.listarTodo();
    }

    @GetMapping("/tecnologias/{tema}")
    public List<Tecnologia> getPorTema(@PathVariable String tema) {
        return tecnologiaService.buscarPorTema(tema);
    }

}
