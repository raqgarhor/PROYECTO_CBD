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

  const { temas, tecnologias } = useMemo(() => {
    const data = (nodes || []).map((node) => node?.data ?? node);
    const temasList = data
      .filter((item) => item?.category === 'Tema')
      .map((item) => ({ id: item.id, label: item.label }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const techList = data
      .filter((item) => item?.category !== 'Tema')
      .map((item) => ({ id: item.id, label: item.label }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return { temas: temasList, tecnologias: techList };
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
    setRelationType('SE_INTEGRA_CON');
    setRelationTarget('');
    setRelaciones([]);
  };

  const handleSubmit = async () => {
    if (!nombre.trim() || !categoria.trim()) {
      alert('Nombre y categoría son obligatorios.');
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      descripcion: descripcion.trim(),
      temaId: temaId || null,
      relaciones
    };

    const ok = await onCreateTechnology(payload);
    if (ok) {
      resetForm();
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
      <input
        className="filter-select"
        type="text"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        placeholder="Ej: Search / NoSQL"
      />

      <label className="filter-label">Descripción</label>
      <input
        className="filter-select"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Breve descripción"
      />

      <label className="filter-label">Tema</label>
      <select
        className="filter-select"
        value={temaId}
        onChange={(e) => setTemaId(e.target.value)}
      >
        <option value="">Sin tema</option>
        {temas.map((tema) => (
          <option key={tema.id} value={tema.id}>
            {tema.label}
          </option>
        ))}
      </select>

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
            <div key={`${rel.tipo}-${rel.destino}-${idx}`} className="overview-item" style={{ padding: '0.55rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <span>{rel.tipo} → {rel.destino}</span>
                <button type="button" className="secondary-btn" onClick={() => removeRelation(idx)}>
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
