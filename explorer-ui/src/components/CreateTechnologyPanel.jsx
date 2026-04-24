/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from 'react';
import '../styles/ToolPanel.css';

const RELATION_TYPES = [
  'SE_INTEGRA_CON',
  'COMPLEMENTA',
  'RELACIONADA_CON',
  'COMPITE_CON',
  'ES_ALTERNATIVA_A'
];

const CreateTechnologyPanel = ({ nodes = [], onCreateTechnology }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [temaId, setTemaId] = useState('');

  const [relationType, setRelationType] = useState('SE_INTEGRA_CON');
  const [relationTarget, setRelationTarget] = useState('');
  const [relaciones, setRelaciones] = useState([]);

  const [mostrarCrearTema, setMostrarCrearTema] = useState(false);
  const [nuevoTemaNombre, setNuevoTemaNombre] = useState('');
  const [nuevoTemaDescripcion, setNuevoTemaDescripcion] = useState('');
  const [nuevoTemaPendiente, setNuevoTemaPendiente] = useState('');

  const [mostrarCrearCategoria, setMostrarCrearCategoria] = useState(false);
  const [nuevaCategoriaNombre, setNuevaCategoriaNombre] = useState('');

  const { temas, tecnologias, categorias } = useMemo(() => {
    const data = (nodes || []).map((node) => node?.data ?? node);

    const temasList = data
      .filter((item) => item?.category === 'Tema')
      .map((item) => ({ id: item.id, label: item.label }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const techList = data
      .filter((item) => item?.category !== 'Tema')
      .map((item) => ({ id: item.id, label: item.label }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const categoriasList = [
      ...new Set(
        data
          .filter((item) => item?.category !== 'Tema' && item?.category)
          .map((item) => item.category)
      )
    ].sort();

    return {
      temas: temasList,
      tecnologias: techList,
      categorias: categoriasList
    };
  }, [nodes]);

  const addRelation = () => {
    if (!relationTarget) return;

    const next = {
      tipo: relationType,
      destino: relationTarget
    };

    const duplicated = relaciones.some(
      (r) => r.tipo === next.tipo && r.destino === next.destino
    );

    if (!duplicated) {
      setRelaciones([...relaciones, next]);
    }
  };

  const removeRelation = (index) => {
    setRelaciones(relaciones.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setNombre('');
    setCategoria('');
    setDescripcion('');
    setTemaId('');
    setNuevoTemaPendiente('');
    setNuevoTemaNombre('');
    setNuevoTemaDescripcion('');
    setMostrarCrearTema(false);
    setRelationType('SE_INTEGRA_CON');
    setRelationTarget('');
    setRelaciones([]);
  };

const handleSubmit = async () => {
  if (!nombre.trim() || !categoria.trim()) {
    alert('Nombre y categoría son obligatorios.');
    return;
  }

  let finalTemaId = temaId || null;

  try {
    if (nuevoTemaPendiente) {
      finalTemaId = nuevoTemaPendiente.trim();

      const temaResponse = await fetch('http://localhost:8080/api/graph/temas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nuevoTemaPendiente.trim(),
          descripcion: nuevoTemaDescripcion.trim()
        })
      });

      if (!temaResponse.ok) {
        alert('Error al crear el tema');
        return;
      }
    }

    const payload = {
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      descripcion: descripcion.trim(),
      temaId: finalTemaId,
      relaciones
    };

    const ok = await onCreateTechnology(payload);

    if (ok) {
      resetForm();
    }
  } catch (error) {
    console.error(error);
    alert('Error al crear la tecnología');
  }
};

  return (
    <div className="tool-panel">
      <div className="panel-header">
        <h3>Nueva tecnología</h3>
        <span>Crea y conecta nodos del grafo</span>
      </div>

      <label className="filter-label">Nombre</label>
      <input
        className="filter-select"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ej: Elasticsearch"
      />

      <label className="filter-label">Categoría</label>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <select
          className="filter-select tema-select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={{ flex: 1 }}
        >
          <option value="">Selecciona categoría</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          className="secondary-btn"
          type="button"
          onClick={() => setMostrarCrearCategoria(!mostrarCrearCategoria)}
          style={{ padding: '0.5rem 1rem' }}
        >
          {mostrarCrearCategoria ? '✕' : '➕'}
        </button>
      </div>

      {categoria && !categorias.includes(categoria) && (
        <small
          style={{
            color: '#ff9800',
            marginTop: '-0.25rem',
            display: 'block',
            marginBottom: '0.5rem'
          }}
        >
          ➕ Nueva categoría: "{categoria}"
        </small>
      )}

      {mostrarCrearCategoria && (
        <div className="crear-tema-form">
          <label className="filter-label">Nombre de la nueva categoría</label>
          <input
            className="filter-select"
            type="text"
            value={nuevaCategoriaNombre}
            onChange={(e) => setNuevaCategoriaNombre(e.target.value)}
            placeholder="Ej: Machine Learning"
          />

          <button
            className="primary-btn"
            type="button"
            onClick={() => {
              if (nuevaCategoriaNombre.trim()) {
                setCategoria(nuevaCategoriaNombre.trim());
                setNuevaCategoriaNombre('');
                setMostrarCrearCategoria(false);
              }
            }}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Usar categoría
          </button>
        </div>
      )}

      <label className="filter-label">Descripción</label>
      <input
        className="filter-select"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Breve descripción"
      />

      <label className="filter-label">Tema</label>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <select
          className="filter-select tema-select"
          value={temaId}
          onChange={(e) => {
            setTemaId(e.target.value);
            setNuevoTemaPendiente('');
          }}
          style={{ flex: 1 }}
        >
          <option value="">Sin tema</option>
          {temas.map((tema) => (
            <option key={tema.id} value={tema.id}>
              {tema.label}
            </option>
          ))}
        </select>

        <button
          className="secondary-btn"
          type="button"
          onClick={() => setMostrarCrearTema(!mostrarCrearTema)}
          style={{ padding: '0.5rem 1rem' }}
        >
          {mostrarCrearTema ? '✕' : '➕'}
        </button>
      </div>

      {nuevoTemaPendiente && (
        <small
          style={{
            color: '#ff9800',
            marginTop: '-0.25rem',
            display: 'block',
            marginBottom: '0.5rem'
          }}
        >
          ➕ Nuevo tema: "{nuevoTemaPendiente}"
        </small>
      )}

      {mostrarCrearTema && (
        <div className="crear-tema-form">
          <label className="filter-label">Nombre del nuevo tema</label>
          <input
            className="filter-select"
            type="text"
            value={nuevoTemaNombre}
            onChange={(e) => setNuevoTemaNombre(e.target.value)}
            placeholder="Ej: Arquitectura"
          />

          <label className="filter-label">Descripción (opcional)</label>
          <input
            className="filter-select"
            type="text"
            value={nuevoTemaDescripcion}
            onChange={(e) => setNuevoTemaDescripcion(e.target.value)}
            placeholder="Breve descripción del tema"
          />

          <button
            className="primary-btn"
            type="button"
            onClick={() => {
              if (nuevoTemaNombre.trim()) {
                setNuevoTemaPendiente(nuevoTemaNombre.trim());
                setTemaId('');
                setMostrarCrearTema(false);
              }
            }}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Usar tema
          </button>
        </div>
      )}

      <label className="filter-label">Relación</label>
      <select
        className="filter-select"
        value={relationType}
        onChange={(e) => setRelationType(e.target.value)}
      >
        {RELATION_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <label className="filter-label">Conectar con</label>
      <select
        className="filter-select"
        value={relationTarget}
        onChange={(e) => setRelationTarget(e.target.value)}
      >
        <option value="">Selecciona tecnología</option>
        {tecnologias
          .filter((tech) => tech.label !== nombre.trim())
          .map((tech) => (
            <option key={tech.id} value={tech.label}>
              {tech.label}
            </option>
          ))}
      </select>

      <div className="tool-actions">
        <button className="secondary-btn" type="button" onClick={addRelation}>
          Añadir relación
        </button>
      </div>

      {relaciones.length > 0 && (
        <div className="overview-list" style={{ maxHeight: '140px' }}>
          {relaciones.map((rel, idx) => (
            <div
              key={`${rel.tipo}-${rel.destino}-${idx}`}
              className="overview-item"
              style={{ padding: '0.55rem' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '0.5rem'
                }}
              >
                <span>
                  {rel.tipo} → {rel.destino}
                </span>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => removeRelation(idx)}
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="tool-actions">
        <button className="primary-btn" type="button" onClick={handleSubmit}>
          Crear tecnología
        </button>
        <button className="secondary-btn" type="button" onClick={resetForm}>
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default CreateTechnologyPanel;