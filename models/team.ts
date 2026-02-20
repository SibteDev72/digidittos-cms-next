export interface TeamSocial {
  platform: string;
  url: string;
}

export interface Team {
  _id: string;
  name: string;
  slug: string;
  role: string;
  photo?: string;
  bio?: string;
  socials: TeamSocial[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamData {
  name: string;
  role: string;
  photo?: string;
  bio?: string;
  socials?: TeamSocial[];
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateTeamData {
  name?: string;
  role?: string;
  photo?: string;
  bio?: string;
  socials?: TeamSocial[];
  displayOrder?: number;
  isActive?: boolean;
}
