import type { EarlyWarningAlert, Project, SectorType } from '../types';

export interface PageContext {
  projects: Project[];
  alerts: EarlyWarningAlert[];
  sectorFilter: SectorType | 'ALL';
  onSelectProject: (project: Project) => void;
  onSelectProjectById: (projectId: string) => void;
  onFilterSector: (sector: SectorType) => void;
}
