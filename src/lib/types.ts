export type CategoryStatus = "strong" | "weak" | "missing";

export interface Category {
  name: string;
  score: number;
  status: CategoryStatus;
  diagnosis: string;
  fix: string;
  faq_suggestions: string[];
}

export interface SimulatorItem {
  query: string;
  current_response: string;
  optimized_response: string;
}

export interface ActionPlan {
  this_week: string[];
  this_month: string[];
}

export interface AuditResult {
  company?: string;
  url?: string;
  overall_score: number;
  verdict: string;
  categories: Category[];
  simulator: SimulatorItem[];
  action_plan: ActionPlan;
}
