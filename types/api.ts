export interface GateLink {
  hu: string;
  code: string;
}

export interface Gate {
  uuid: string;
  code: string;
  createdAt: number;
  updatedAt: number | null;
  links: GateLink[];
  name: string;
}

export interface Route {
  from: string;
  to: string;
  route: string[];
  totalCost: number;
}

export interface ApiError {
  error: string;
  originalException?: string;
}
