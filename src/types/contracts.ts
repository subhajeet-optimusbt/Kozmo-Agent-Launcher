/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/contracts.ts
export interface ContractMetrics {
  pendingSignature: any;
  inReview: any;
  totalContracts: number;
  activeContracts: number;
  highRiskContracts: number;
  mediumRiskContracts: number;
  lowRiskContracts: number;
  expireWithin30Days: number;
  expireWithin90Days: number;
  expired: number;
  totalContractValue: number;
  atRiskRevenue: number;
  activeContractValue: number;
}

export interface ContractDashboardResponse {
  totalContracts: any;
  activeContracts: any;
  highRiskContracts: any;
  contractsNeedingReview: any;
  expireWithin90Days: any;
  pendingSignature: any;
  agentType: string;
  lastUpdated: string;
  currentMetrics: ContractMetrics;
}
