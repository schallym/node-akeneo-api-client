export type Workflow = {
  uuid: string;
  code: string;
  labels: { [localCode: string]: string };
  enabled: boolean;
  steps: WorkflowStep[];
};

export type StepAssignee = {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type WorkflowTask = {
  uuid: string;
  status: string;
  created_at: string;
  due_date: string;
  rejected: boolean;
  product?: {
    uuid: string;
  };
  product_model?: {
    code: string;
  };
};

export type WorkflowStep = {
  uuid: string;
  code: string;
  type: string;
  labels: { [localCode: string]: string };
  descriptions: Record<string, string>;
  allotted_time?: { value: number; unit: string } | null;
  channels_and_locales?: Record<string, string[]>;
};
