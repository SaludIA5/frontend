export interface Model   {
    id: number
    version: string,
    stage: string,
    metric: string,
    metric_value: number,
    trained_at: Date | string,
    active: boolean,
  }