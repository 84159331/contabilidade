// Tipos para funÃ§Ãµes/cargos da igreja

export type ChurchRole = 
  | 'Pastor(a)'
  | 'LÃ­der'
  | 'LÃ­der de CÃ©lula'
  | 'Obreiro(a)'
  | 'Membro'
  | 'DiÃ¡cono(a)'
  | 'PresbÃ­tero(a)'
  | 'Evangelista'
  | 'MissionÃ¡rio(a)'
  | 'Coordenador(a)'
  | 'Auxiliar'
  | 'VoluntÃ¡rio(a)';

export const CHURCH_ROLES: { value: ChurchRole; label: string }[] = [
  { value: 'Pastor(a)', label: 'Pastor(a)' },
  { value: 'LÃ­der', label: 'LÃ­der' },
  { value: 'LÃ­der de CÃ©lula', label: 'LÃ­der de CÃ©lula' },
  { value: 'Obreiro(a)', label: 'Obreiro(a)' },
  { value: 'Membro', label: 'Membro' },
  { value: 'DiÃ¡cono(a)', label: 'DiÃ¡cono(a)' },
  { value: 'PresbÃ­tero(a)', label: 'PresbÃ­tero(a)' },
  { value: 'Evangelista', label: 'Evangelista' },
  { value: 'MissionÃ¡rio(a)', label: 'MissionÃ¡rio(a)' },
  { value: 'Coordenador(a)', label: 'Coordenador(a)' },
  { value: 'Auxiliar', label: 'Auxiliar' },
  { value: 'VoluntÃ¡rio(a)', label: 'VoluntÃ¡rio(a)' },
];
