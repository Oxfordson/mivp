export type EventStatus = 'draft' | 'upcoming' | 'active' | 'paused' | 'completed' | 'cancelled';
export type EventCategory = 'election' | 'poll' | 'referendum' | 'department_initiative';
export type BallotTargetType = 'staff' | 'department' | 'topic' | 'option';

export interface Staff {
  id: string;
  staff_id: string;
  email: string;
  full_name: string;
  department: string;
  designation: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VotingEvent {
  id: string;
  title: string;
  description: string | null;
  category: EventCategory;
  is_anonymous: boolean;
  target_department: string | null;
  start_time: string;
  end_time: string;
  status: EventStatus;
  allow_multiple_selections: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface BallotItem {
  id: string;
  event_id: string;
  target_type: BallotTargetType;
  title: string;
  subtitle: string | null;
  metadata: Record<string, any>;
  is_disqualified: boolean;
  display_order: number;
  created_at: string;
}

export interface EventAccreditation {
  id: string;
  event_id: string;
  staff_id: string;
  is_eligible: boolean;
  is_accredited: boolean;
  has_voted: boolean;
  accredited_at: string | null;
  voted_at: string | null;
  revoked_at: string | null;
  revocation_reason: string | null;
  created_at: string;
}

export interface VoteTallyView {
  event_id: string;
  event_title: string;
  category: EventCategory;
  is_anonymous: boolean;
  ballot_item_id: string;
  item_name: string;
  target_type: BallotTargetType;
  valid_vote_count: number;
}

export interface DepartmentTurnoutView {
  event_id: string;
  event_title: string;
  department: string;
  total_department_pool: number;
  accredited_count: number;
  actual_voters_count: number;
  participation_rate: number;
}

export interface VotingTimeSeriesView {
  event_id: string;
  department: string;
  vote_hour: string;
  total_votes: number;
}