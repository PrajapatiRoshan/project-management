import { v4 as uuid4 } from 'uuid';

export function generateInviteCode() {
  return uuid4().replace(/-/g, '').substring(0, 8);
}

export function generateTaskCode() {
  return `task-${uuid4().replace(/-/g, '').substring(0, 3)}`;
}
