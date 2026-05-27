export interface PageFunnelItem {
  pageName: string;
  pageTag: string;
  pv: number;
  uv: number;
  conversionRate: number;
}

export interface PVSourceItem {
  sourceName: string;
  pv: number;
  ratio: number;
}

export interface PageAnalytics {
  activityPagePV: number;
  activityPageUV: number;
  targetUserCount: number;
  participateUserCount: number;
  targetCompletionRate: number;
  activityProgress: number;
  pageFunnel: PageFunnelItem[];
  pvSourceDistribution: PVSourceItem[];
}

export interface ChannelDistributionItem {
  channelName: string;
  customerCount: number;
  ratio: number;
  hasReceipt: boolean;
}

export interface PushFunnelItem {
  stage: string;
  count: number;
  conversionRate: number;
  noReceipt?: boolean;
}

export interface ClickLinkItem {
  channelName: string;
  clickCount: number;
  ratio: number;
}

export interface UserBehaviorItem {
  behaviorName: string;
  count: number;
  ratio: number;
  trend?: number;
}

export interface UserBehaviorAnalysis {
  timeWindow: string;
  totalUsers: number;
  behaviors: UserBehaviorItem[];
}

export interface PathNode {
  nodeName: string;
  count: number;
  ratio: number;
}

export interface UserPathAnalysis {
  timeWindow: string;
  reachCustomerPath: PathNode[];
  intentionCustomerPath: PathNode[];
  activatedCustomerPath: PathNode[];
}

export interface TaskItem {
  taskId: string;
  taskName: string;
  taskStatus: 'running' | 'pending' | 'ended';
}

export interface TaskAnalyticsData {
  taskId: string | null;
  reachCustomerCount: number;
  clickLinkCount: number;
  pushSuccessCount: number;
  pushFailCount: number;
  channelDistribution: ChannelDistributionItem[];
  pushFunnel: PushFunnelItem[];
  activatedCustomerCount: number;
  activationCondition: string;
  activatedThousandHouseholds: number;
  netNewAssetAmount: number;
  netRevenue: number;
  newProductSalesAmount: number;
  conversionFunnel: ConversionFunnelItem[];
  userBehaviorAnalysis?: UserBehaviorAnalysis;
  userPathAnalysis?: UserPathAnalysis;
}

export interface ConversionFunnelItem {
  stage: string;
  count: number;
  conversionRate: number;
}

export interface UserKeyBehaviorIndicator {
  indicatorId: string;
  indicatorName: string;
  value: number;
  unit: string;
  change?: number;
  config: {
    editable: boolean;
    deletable: boolean;
  };
}

export interface TaskAnalytics {
  taskList: TaskItem[];
  currentData: TaskAnalyticsData;
  userKeyBehaviorIndicators?: UserKeyBehaviorIndicator[];
}

export interface HourlyDetail {
  hour: string;
  activityPagePV: number;
  activityPageUV: number;
  reachCustomerCount: number;
  intentionCustomerCount: number;
  pushSuccessCount: number;
  pushFailCount: number;
  activatedCustomerCount: number;
  activatedThousandHouseholds: number;
  netNewAssetAmount: number;
  netRevenue: number;
  newProductSalesAmount: number;
}

export interface DailyDetail {
  date: string;
  activityPagePV: number;
  activityPageUV: number;
  targetUserCount: number;
  participateUserCount: number;
  reachCustomerCount: number;
  intentionCustomerCount: number;
  pushSuccessCount: number;
  pushFailCount: number;
  activatedCustomerCount: number;
  activatedThousandHouseholds: number;
  netNewAssetAmount: number;
  netRevenue: number;
  newProductSalesAmount: number;
  hourlyDetails?: HourlyDetail[];
}

export interface ActivityAnalyticsResponse {
  activityId: string;
  activityName: string;
  activityStartDate: string;
  activityEndDate: string;
  dataUpdateTime: string;
  pageAnalytics: PageAnalytics;
  taskAnalytics: TaskAnalytics;
  dailyDetails: DailyDetail[];
}

export type ViewMode = 'activity' | 'task';

// Activity Management types
export type ActivityStatus = 'pending' | 'running' | 'ended';
export type IndicatorType = 'behavior' | 'business' | 'activation';

export interface IndicatorField {
  fieldName: string;
  description: string;
  threshold?: {
    tag: string;
    operator: string;
    value: number;
  };
}

export interface ActivityIndicator {
  templateId: string;
  indicatorTypes: IndicatorType[];
  indicatorName: string;
  fields: IndicatorField[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  name: string;
  landingPageCode: string;
  pageCode: string;
  aggregationStartDate: string;
  startDate: string;
  endDate: string;
  status: ActivityStatus;
  creator: string;
  indicators: ActivityIndicator[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  name: string;
  activityId: string;
  activityName: string;
  status: 'running' | 'pending' | 'ended';
  createdAt: string;
  userGroup?: string;
}

export interface UnifiedListItem {
  id: string;
  type: 'activity' | 'task';
  name: string;
  status: ActivityStatus | 'pending';
  startDate: string;
  endDate: string;
  creator?: string;
  relatedActivityName?: string;
  createdAt: string;
  updatedAt?: string;
  // Activity specific fields
  landingPageCode?: string;
  pageCode?: string;
  aggregationStartDate?: string;
  indicators?: ActivityIndicator[];
  // Task specific fields
  activityId?: string;
  userGroup?: string;
}

export interface ActivityEffectData {
  exposureCount: number;
  clickCount: number;
  conversionCount: number;
  conversionRate: number;
  dailyData: {
    date: string;
    exposureCount: number;
    clickCount: number;
    conversionCount: number;
  }[];
}