export type JobExecution = {
  code: string;
  label?: string;
  status: JobExecutionStatus;
  type: JobExecutionType;
  start_time?: string;
  end_time?: string;
  create_time: string;
  updated_time: string;
  user: string;
  pid?: number;
  log_level?: string;
  failures?: JobExecutionFailure[];
  warnings?: JobExecutionWarning[];
  summary?: {
    read?: number;
    written?: number;
    error?: number;
    skip?: number;
  };
  tracking?: {
    current_step?: number;
    total_steps?: number;
    step_progress?: number;
  };
};

export type JobExecutionStatus =
  | 'STARTING'
  | 'STARTED'
  | 'STOPPING'
  | 'STOPPED'
  | 'FAILED'
  | 'ABANDONED'
  | 'UNKNOWN'
  | 'COMPLETED';

export type JobExecutionType = 'import' | 'export';

export type JobExecutionFailure = {
  message: string;
  message_parameters?: Record<string, string>;
  reason?: string;
};

export type JobExecutionWarning = {
  message: string;
  message_parameters?: Record<string, string>;
  item?: Record<string, any>;
};

export type JobExecutionSearchParams = {
  search?: string;
  type?: JobExecutionType;
  status?: JobExecutionStatus;
  user?: string;
  code?: string;
  started_after?: string;
  started_before?: string;
  page?: number;
  limit?: number;
  with_count?: boolean;
};
