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

export interface RecommendedTransport {
  name: string;
  ratePerAu: number;
  capacity: number;
}

export interface TransportResponse {
  recommendedTransport: RecommendedTransport;
  journeyCost: number;
  parkingFee: number;
  currency: string;
}

export interface ApiError {
  error: string;
  originalException?: string;
}
