import type { AiTrapPayload } from './types';

export const aiTrapData: Record<number, AiTrapPayload> = {
  3: {
    id: 'ai-trap-10s',
    title: 'AI Assistant Suggestion',
    description:
      'Detected 3 similar tickets. Would you like to resolve them automatically?',
    severity: 'moderate',
    blastRadius: {
      target: 'Tickets #10421, #10426, #10440',
      action: 'Auto-route to HelpDesk & close ticket',
      impact: '3 active customer requests closed without manual review',
    },
    correctDecision: 'rejected',
  },
  20: {
    id: 'ai-trap-20s',
    title: 'AI Automation Alert',
    description:
      'System suggests archiving all open billing requests to clear queue congestion.',
    severity: 'critical',
    blastRadius: {
      target: 'All open Billing queue tickets',
      action: 'Permanent archive & suppress notifications',
      impact: 'Unresolved invoice disputes will be permanently dropped',
    },
    expectedInput: 'ARCHIVE BILLING',
    correctDecision: 'rejected',
  },
};