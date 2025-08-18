# Job Execution Workflow API Usage Examples

This document shows how to use the newly added job execution workflow endpoints.

## New Workflow Endpoints Added

### 1. Get Job Execution Details
Get detailed information about a specific job execution.

```typescript
import { AkeneoClient } from '@schally/node-akeneo-api-client';

const client = new AkeneoClient({
  baseUrl: 'https://your-akeneo-instance.com',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret', 
  username: 'your-username',
  password: 'your-password'
});

// Launch a job and get execution ID
const jobResponse = await client.jobs.launchExportJob('product_export');
const executionId = jobResponse.execution_id;

// Get execution details
const execution = await client.jobs.getJobExecution(executionId);
console.log('Job Status:', execution.status);
console.log('Progress:', execution.tracking);
console.log('Summary:', execution.summary);
```

### 2. List Job Executions
List and filter job executions with pagination support.

```typescript
// List all job executions
const allExecutions = await client.jobs.listJobExecutions();
console.log('Total executions:', allExecutions.items_count);

// Filter by status and type
const completedExports = await client.jobs.listJobExecutions({
  type: 'export',
  status: 'COMPLETED',
  page: 1,
  limit: 10
});

// Filter by user and date range
const userExecutions = await client.jobs.listJobExecutions({
  user: 'admin',
  started_after: '2024-01-01T00:00:00Z',
  started_before: '2024-01-31T23:59:59Z'
});
```

### 3. Get Job Execution Logs
Retrieve logs for debugging and monitoring job executions.

```typescript
// Get logs for a specific execution
const logs = await client.jobs.getJobExecutionLogs(executionId);
console.log('Job logs:', logs);

// Example usage for monitoring job progress
async function monitorJobExecution(executionId: string) {
  let execution = await client.jobs.getJobExecution(executionId);
  
  while (execution.status === 'STARTING' || execution.status === 'STARTED') {
    console.log(`Job ${execution.code} is ${execution.status}`);
    
    if (execution.tracking) {
      console.log(`Progress: ${execution.tracking.step_progress}%`);
    }
    
    // Wait 5 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 5000));
    execution = await client.jobs.getJobExecution(executionId);
  }
  
  console.log(`Job completed with status: ${execution.status}`);
  
  if (execution.status === 'FAILED') {
    const logs = await client.jobs.getJobExecutionLogs(executionId);
    console.log('Error logs:', logs);
  }
}
```

## Job Execution Status Values

- `STARTING` - Job execution is being initialized
- `STARTED` - Job execution is currently running
- `STOPPING` - Job execution is being stopped
- `STOPPED` - Job execution was stopped
- `FAILED` - Job execution failed with errors
- `ABANDONED` - Job execution was abandoned
- `UNKNOWN` - Job execution status is unknown
- `COMPLETED` - Job execution completed successfully

## Available Search/Filter Parameters

- `search` - General search term
- `type` - Filter by job type ('import' or 'export')
- `status` - Filter by execution status
- `user` - Filter by user who launched the job
- `code` - Filter by job code
- `started_after` - Filter jobs started after this date
- `started_before` - Filter jobs started before this date
- `page` - Page number for pagination
- `limit` - Number of results per page
- `with_count` - Include total count in response