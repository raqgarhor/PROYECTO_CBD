package com.G35.backend.graph.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PathResultDTO {
    private String from;
    private String to;
    private Integer length;
    private GraphResponseDTO graph;
    private String description;
}
