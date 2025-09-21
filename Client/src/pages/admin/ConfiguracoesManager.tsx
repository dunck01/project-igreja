import { Routes, Route } from 'react-router-dom';
import ConfiguracoesGerais from './ConfiguracoesGerais';

const ConfiguracoesManager = () => {
  return (
    <Routes>
      <Route path="/" element={<ConfiguracoesGerais />} />
      <Route path="/quem-somos" element={<ConfiguracoesGerais />} />
    </Routes>
  );
};

export default ConfiguracoesManager;