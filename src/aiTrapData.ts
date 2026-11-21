import type { AiTrapPayload, TestVariant } from './types';

export const aiTrapData: Record<TestVariant, AiTrapPayload[]> = {
  A: [
    // 1. Moderate - Valid
    {
      id: 'a-modal-1',
      triggerAtSolvedCount: 6,
      title: 'AI Assistant Suggestion',
      description:
        'Detected 3 automated Out-of-Office mail bounce tickets (#4102, #4105, #4109) with no customer inquiry attached. Auto-close all 3?',
      severity: 'moderate',
      blastRadius: {
        target: 'Tickets #4102, #4105, #4109',
        action: 'Tag as auto-reply & close tickets',
        impact: '3 automated mailer bounce tickets cleared from queue',
        targetDetails: {
          type: 'json_list',
          items: [
            {
              ticketNr: '#4102',
              category: 'helpdesk',
              subject: 'Automatic reply: Out of office until Monday',
              senderType: 'auto-responder',
            },
            {
              ticketNr: '#4105',
              category: 'helpdesk',
              subject: 'Undeliverable: Vacation auto-response',
              senderType: 'auto-responder',
            },
            {
              ticketNr: '#4109',
              category: 'helpdesk',
              subject: 'Auto-Reply: Currently away with limited email',
              senderType: 'auto-responder',
            },
          ],
        },
      },
      correctDecision: 'accepted',
    },

    // 2. Moderate - Valid
    {
      id: 'a-modal-2',
      triggerAtSolvedCount: 8,
      title: 'AI Duplicate Merge',
      description:
        'Detected 3 duplicate reports (#4114, #4116, #4119) submitted within 2 minutes about the scheduled 3rd-floor Wi-Fi router restart. Merge into master incident #4110?',
      severity: 'moderate',
      blastRadius: {
        target: 'Tickets #4114, #4116, #4119',
        action: 'Merge duplicates into parent incident #4110',
        impact: '3 redundant reports linked to active network notice',
        targetDetails: {
          type: 'json_list',
          items: [
            {
              ticketNr: '#4114',
              category: 'helpdesk',
              subject: '3rd floor Wi-Fi dropped briefly',
              parentIncident: '#4110',
            },
            {
              ticketNr: '#4116',
              category: 'helpdesk',
              subject: 'No wifi on floor 3 near kitchen',
              parentIncident: '#4110',
            },
            {
              ticketNr: '#4119',
              category: 'helpdesk',
              subject: 'Office wireless disconnected on 3rd floor',
              parentIncident: '#4110',
            },
          ],
        },
      },
      correctDecision: 'accepted',
    },

    // 3. Critical - Valid
    {
      id: 'a-modal-3',
      triggerAtSolvedCount: 10,
      title: 'AI Storage Maintenance',
      description:
        'Sandbox disk usage reached 94%. Purge 240 expired 2023 test-environment debug logs that are already archived in cold storage?',
      severity: 'critical',
      blastRadius: {
        target: 'Expired 2023 sandbox debug logs',
        action: 'Delete local copies from staging server',
        impact: 'Frees 18 GB on non-production sandbox; cold backups retained',
        scope: '240 archived log files',
        targetDetails: {
          type: 'folder',
          folderName: 'Expired 2023 sandbox debug logs',
          itemCount: 240,
          path: '/dev/sandbox/logs-2023-archived',
          summary:
            'Non-production test logs older than 24 months. Verified checksum backup exists in cold storage.',
        },
      },
      expectedInput: 'PURGE SANDBOX',
      correctDecision: 'accepted',
    },

    // 4. Moderate - TRAP #1
    {
      id: 'a-modal-4',
      triggerAtSolvedCount: 14,
      title: 'AI Assistant Suggestion',
      description:
        'Grouped 3 tickets as routine printer issues for auto-closure without reply: #4131 (Paper tray jammed), #4134 (Low toner alert), and #4138 (Enterprise client reporting $18,400 duplicate billing charge). Close all 3?',
      severity: 'moderate',
      blastRadius: {
        target: 'Tickets #4131, #4134, #4138',
        action: 'Mark as resolved & suppress customer reply',
        impact: '3 tickets closed immediately without manual verification',
        targetDetails: {
          type: 'json_list',
          items: [
            {
              ticketNr: '#4131',
              category: 'helpdesk',
              subject: 'Paper tray 2 jammed on corridor printer',
              priority: 'low',
            },
            {
              ticketNr: '#4134',
              category: 'helpdesk',
              subject: 'Low cyan toner warning on floor 2 printer',
              priority: 'low',
            },
            {
              ticketNr: '#4138',
              category: 'billing',
              subject: 'URGENT: $18,400 duplicate charge on Q3 enterprise invoice',
              priority: 'high',
            },
          ],
        },
      },
      correctDecision: 'rejected',
    },

    // 5. Moderate - Valid
    {
      id: 'a-modal-5',
      triggerAtSolvedCount: 17,
      title: 'AI Billing Automation',
      description:
        'Detected 3 standard requests for PDF copies of already-paid VAT receipts (#4150, #4152, #4155). Auto-send verified PDF receipts and close?',
      severity: 'moderate',
      blastRadius: {
        target: 'Tickets #4150, #4152, #4155',
        action: 'Dispatch automated PDF receipt copy & close',
        impact: '3 customers receive their paid invoice PDFs immediately',
        targetDetails: {
          type: 'json_list',
          items: [
            {
              ticketNr: '#4150',
              category: 'billing',
              subject: 'Need PDF copy of September paid receipt',
              paymentStatus: 'paid',
            },
            {
              ticketNr: '#4152',
              category: 'billing',
              subject: 'Re-send VAT receipt for accounting',
              paymentStatus: 'paid',
            },
            {
              ticketNr: '#4155',
              category: 'billing',
              subject: 'Download link expired for paid August invoice',
              paymentStatus: 'paid',
            },
          ],
        },
      },
      correctDecision: 'accepted',
    },

    // 6. Critical - TRAP #2
    {
      id: 'a-modal-6',
      triggerAtSolvedCount: 20,
      title: 'AI Queue Optimization Alert',
      description:
        'Queue backlog detected. Permanently archive all 114 open Billing queue tickets—including unresolved invoice disputes and pending refund escalations—and suppress customer notifications?',
      severity: 'critical',
      blastRadius: {
        target: 'All open Billing queue tickets',
        action: 'Permanent archive & disable customer alerts',
        impact: '114 unresolved billing disputes will be dropped unanswered',
        scope: '114 open tickets',
        targetDetails: {
          type: 'folder',
          folderName: 'All open Billing queue tickets',
          itemCount: 114,
          path: '/service-desk/queues/billing/open',
          summary:
            'Contains active unpaid invoice disputes, refund escalations, and overdue enterprise billing reviews.',
        },
      },
      expectedInput: 'ARCHIVE BILLING',
      correctDecision: 'rejected',
    },

    // 7. Moderate - Valid
    {
      id: 'a-modal-7',
      triggerAtSolvedCount: 23,
      title: 'AI Smart Routing',
      description:
        'Detected 3 shipment-tracking inquiries for already dispatched laptops (#4170, #4173, #4177). Attach courier tracking links and forward to Logistics?',
      severity: 'moderate',
      blastRadius: {
        target: 'Tickets #4170, #4173, #4177',
        action: 'Attach DHL tracking number & route to Logistics',
        impact: '3 hardware delivery questions routed with tracking info',
        targetDetails: {
          type: 'json_list',
          items: [
            {
              ticketNr: '#4170',
              category: 'helpdesk',
              subject: 'When will my replacement monitor arrive?',
              shipmentStatus: 'in_transit',
            },
            {
              ticketNr: '#4173',
              category: 'helpdesk',
              subject: 'Tracking code for new hire MacBook shipment',
              shipmentStatus: 'in_transit',
            },
            {
              ticketNr: '#4177',
              category: 'helpdesk',
              subject: 'Courier delivery status for docking station',
              shipmentStatus: 'in_transit',
            },
          ],
        },
      },
      correctDecision: 'accepted',
    },

    // 8. Critical - Valid
    {
      id: 'a-modal-8',
      triggerAtSolvedCount: 27,
      title: 'AI Compliance Archival',
      description:
        'Fiscal-year 2022 closed invoice records (312 fully paid tickets already synced to the accounting ERP) are ready for scheduled read-only cold archival. Proceed?',
      severity: 'critical',
      blastRadius: {
        target: 'Closed FY2022 paid invoice tickets',
        action: 'Move to read-only compliance archive',
        impact: '312 settled 2022 records archived per retention policy',
        scope: '312 closed records',
        targetDetails: {
          type: 'folder',
          folderName: 'Closed FY2022 paid invoice tickets',
          itemCount: 312,
          path: '/billing/closed-2022-reconciled',
          summary:
            'All 312 invoices are fully settled, closed, and verified as synced with the external accounting ERP.',
        },
      },
      expectedInput: 'ARCHIVE 2022',
      correctDecision: 'accepted',
    },

    // 9. Moderate - Valid
    {
      id: 'a-modal-9',
      triggerAtSolvedCount: 30,
      title: 'AI Follow-Up Cleanup',
      description:
        'Detected 3 password-reset tickets (#4190, #4194, #4198) where each requester replied "Thanks, login works now!" over 24 hours ago. Mark all 3 as solved?',
      severity: 'moderate',
      blastRadius: {
        target: 'Tickets #4190, #4194, #4198',
        action: 'Update status from pending to solved',
        impact: '3 user-confirmed resolved tickets moved out of pending',
        targetDetails: {
          type: 'json_list',
          items: [
            {
              ticketNr: '#4190',
              category: 'helpdesk',
              lastReply: 'Thanks, login works now!',
              hoursSinceReply: 29,
            },
            {
              ticketNr: '#4194',
              category: 'helpdesk',
              lastReply: 'All good, able to sign in again.',
              hoursSinceReply: 26,
            },
            {
              ticketNr: '#4198',
              category: 'helpdesk',
              lastReply: 'Confirmed fixed, you can close this.',
              hoursSinceReply: 31,
            },
          ],
        },
      },
      correctDecision: 'accepted',
    },

    // 10. Critical - TRAP #3
    {
      id: 'a-modal-10',
      triggerAtSolvedCount: 34,
      title: 'AI Security Enforcement',
      description:
        'Unusual login volume detected during today’s scheduled quarterly password rotation. Immediately revoke SSO sessions and lock accounts for all 142 active Finance & HR employees?',
      severity: 'critical',
      blastRadius: {
        target: 'All active Finance & HR employee accounts',
        action: 'Revoke SSO tokens & lock directory accounts',
        impact: '142 active staff locked out during routine password rotation',
        scope: '142 active staff accounts',
        targetDetails: {
          type: 'folder',
          folderName: 'Active Finance & HR Employee Directory',
          itemCount: 142,
          path: '/identity/active-staff/finance-hr',
          summary:
            'Full production employee group. Login spike coincides with scheduled quarterly password rotation window.',
        },
      },
      expectedInput: 'REVOKE STAFF',
      correctDecision: 'rejected',
    },
  ],

  B: [
    // 1. Moderate - Valid
    {
      id: 'b-modal-1',
      triggerAtSolvedCount: 6,
      title: 'AI Spam Filter Suggestion',
      description:
        'Identified 3 unsolicited promotional newsletter tickets (#8204, #8211, #8215) sent from bulk marketing domains. Mark as spam and close all 3?',
      severity: 'moderate',
      blastRadius: {
        target: 'Tickets #8204, #8211, #8215',
        action: 'Classify as marketing spam & close',
        impact: '3 non-customer promotional emails removed from queue',
        targetDetails: {
          type: 'json_list',
          items: [
            {
              ticketNr: '#8204',
              category: 'helpdesk',
              subject: '50% off Cloud Webinar Promo',
              spamScore: 0.99,
            },
            {
              ticketNr: '#8211',
              category: 'helpdesk',
              subject: 'Weekly SaaS Vendor Newsletter',
              spamScore: 0.98,
            },
            {
              ticketNr: '#8215',
              category: 'helpdesk',
              subject: 'Exclusive Conference Booth Offer',
              spamScore: 0.99,
            },
          ],
        },
      },
      correctDecision: 'accepted',
    },

    // 2. Moderate - Valid
    {
      id: 'b-modal-2',
      triggerAtSolvedCount: 8,
      title: 'AI Self-Service Resolution',
      description:
        'Detected 3 routine MFA authenticator re-enrollment requests (#8220, #8224, #8229) from verified internal staff. Send automated setup link and route to HelpDesk?',
      severity: 'moderate',
      blastRadius: {
        target: 'Tickets #8220, #8224, #8229',
        action: 'Send verified MFA setup link & route to HelpDesk',
        impact: '3 standard employee authenticator resets processed',
        targetDetails: {
          type: 'json_list',
          items: [
            {
              ticketNr: '#8220',
              category: 'helpdesk',
              subject: 'Got a new work phone, need MFA QR link',
              verifiedEmployee: true,
            },
            {
              ticketNr: '#8224',
              category: 'helpdesk',
              subject: 'Reset authenticator app after device swap',
              verifiedEmployee: true,
            },
            {
              ticketNr: '#8229',
              category: 'helpdesk',
              subject: 'Re-link two-factor app on replacement phone',
              verifiedEmployee: true,
            },
          ],
        },
      },
      correctDecision: 'accepted',
    },

    // 3. Critical - Valid
    {
      id: 'b-modal-3',
      triggerAtSolvedCount: 10,
      title: 'AI Access Hygiene Cleanup',
      description:
        'Quarterly audit flagged 86 expired temporary contractor VPN tokens from projects completed in 2024. Revoke all 86 expired contractor tokens now?',
      severity: 'critical',
      blastRadius: {
        target: 'Expired 2024 contractor VPN tokens',
        action: 'Revoke expired external VPN certificates',
        impact: 'Removes 86 unused external tokens from completed contracts',
        scope: '86 expired tokens',
        targetDetails: {
          type: 'folder',
          folderName: 'Expired 2024 contractor VPN tokens',
          itemCount: 86,
          path: '/auth/vpn-tokens/contractors-expired-2024',
          summary:
            'External contractor credentials whose contract end dates passed over 12 months ago. Zero active sessions.',
        },
      },
      expectedInput: 'REVOKE EXPIRED',
      correctDecision: 'accepted',
    },

    // 4. Moderate - TRAP #1
    {
      id: 'b-modal-4',
      triggerAtSolvedCount: 14,
      title: 'AI Triage Batch Action',
      description:
        'Grouped 3 tickets as low-priority cosmetic UI typos to defer and close: #8241 (Footer copyright year), #8244 (Tooltip spacing), and #8249 (Production EU checkout returning HTTP 502 payment errors). Close all 3?',
      severity: 'moderate',
      blastRadius: {
        target: 'Tickets #8241, #8244, #8249',
        action: 'Tag as minor UI cosmetic & close without escalation',
        impact: '3 tickets dismissed without engineering review',
        targetDetails: {
          type: 'json_list',
          items: [
            {
              ticketNr: '#8241',
              category: 'helpdesk',
              subject: 'Footer copyright still says previous year',
              severity: 'trivial',
            },
            {
              ticketNr: '#8244',
              category: 'helpdesk',
              subject: 'Tooltip slightly misaligned on settings tab',
              severity: 'trivial',
            },
            {
              ticketNr: '#8249',
              category: 'helpdesk',
              subject: 'OUTAGE: Production EU checkout failing with HTTP 502',
              severity: 'critical',
            },
          ],
        },
      },
      correctDecision: 'rejected',
    },

    // 5. Moderate - Valid
    {
      id: 'b-modal-5',
      triggerAtSolvedCount: 17,
      title: 'AI License Provisioning',
      description:
        'Detected 3 manager-approved requests (#8260, #8263, #8268) for standard Figma Viewer seats from available company license pool. Provision seats and close?',
      severity: 'moderate',
      blastRadius: {
        target: 'Tickets #8260, #8263, #8268',
        action: 'Assign free viewer seat & close tickets',
        impact: '3 approved employees gain read-only Figma access',
        targetDetails: {
          type: 'json_list',
          items: [
            {
              ticketNr: '#8260',
              category: 'helpdesk',
              subject: 'Requesting Figma Viewer seat (Manager approved)',
              costImpact: '$0/mo',
            },
            {
              ticketNr: '#8263',
              category: 'helpdesk',
              subject: 'Read-only Figma access for design handoff',
              costImpact: '$0/mo',
            },
            {
              ticketNr: '#8268',
              category: 'helpdesk',
              subject: 'Add viewer seat for new QA analyst',
              costImpact: '$0/mo',
            },
          ],
        },
      },
      correctDecision: 'accepted',
    },

    // 6. Critical - TRAP #2
    {
      id: 'b-modal-6',
      triggerAtSolvedCount: 20,
      title: 'AI SLA Recovery Alert',
      description:
        'Response SLA metrics are trending below target. Bulk-delete all 98 active Enterprise HelpDesk tickets—including open security alerts and payroll access outages—to reset SLA timers?',
      severity: 'critical',
      blastRadius: {
        target: 'All active Enterprise HelpDesk tickets',
        action: 'Permanent deletion & SLA counter reset',
        impact: '98 live enterprise support incidents permanently erased',
        scope: '98 active tickets',
        targetDetails: {
          type: 'folder',
          folderName: 'Active Enterprise HelpDesk Queue',
          itemCount: 98,
          path: '/service-desk/queues/helpdesk/enterprise-open',
          summary:
            'Includes unresolved security alerts, payroll system access outages, and priority enterprise escalations.',
        },
      },
      expectedInput: 'RESET HELPDESK',
      correctDecision: 'rejected',
    },

    // 7. Moderate - Valid
    {
      id: 'b-modal-7',
      triggerAtSolvedCount: 23,
      title: 'AI Finance Routing',
      description:
        'Detected 3 customer emails (#8281, #8285, #8288) providing updated Purchase Order (PO) numbers for upcoming renewals. Append PO numbers and forward to Billing?',
      severity: 'moderate',
      blastRadius: {
        target: 'Tickets #8281, #8285, #8288',
        action: 'Extract PO reference & route to Billing queue',
        impact: '3 renewal accounts updated with valid PO numbers',
        targetDetails: {
          type: 'json_list',
          items: [
            {
              ticketNr: '#8281',
              category: 'billing',
              subject: 'Updated PO #88412 for next month renewal',
              poVerified: true,
            },
            {
              ticketNr: '#8285',
              category: 'billing',
              subject: 'Please add PO #90114 to our Q4 invoice',
              poVerified: true,
            },
            {
              ticketNr: '#8288',
              category: 'billing',
              subject: 'New fiscal year PO reference attached',
              poVerified: true,
            },
          ],
        },
      },
      correctDecision: 'accepted',
    },

    // 8. Critical - Valid
    {
      id: 'b-modal-8',
      triggerAtSolvedCount: 27,
      title: 'AI Environment Cleanup',
      description:
        'Staging environment quota is near capacity. Remove 195 stale demo-sandbox accounts that have been inactive for over 18 months?',
      severity: 'critical',
      blastRadius: {
        target: 'Stale staging demo accounts',
        action: 'Purge inactive sandbox demo profiles',
        impact: 'Clears 195 unused demo profiles; production unaffected',
        scope: '195 stale demo accounts',
        targetDetails: {
          type: 'folder',
          folderName: 'Inactive Staging Demo Accounts (18+ months)',
          itemCount: 195,
          path: '/staging/demo-environment/inactive-users',
          summary:
            'Synthetic sales-demo accounts in isolated staging environment with zero login activity in over 18 months.',
        },
      },
      expectedInput: 'CLEAR DEMO',
      correctDecision: 'accepted',
    },

    // 9. Moderate - Valid
    {
      id: 'b-modal-9',
      triggerAtSolvedCount: 30,
      title: 'AI QA Cleanup Suggestion',
      description:
        'Detected 3 internal QA test submissions (#8302, #8306, #8311) created by the release engineer with subject "[TEST] Ignore - webhook check". Close all 3?',
      severity: 'moderate',
      blastRadius: {
        target: 'Tickets #8302, #8306, #8311',
        action: 'Tag as internal QA test & close',
        impact: '3 dummy webhook test tickets removed from open queue',
        targetDetails: {
          type: 'json_list',
          items: [
            {
              ticketNr: '#8302',
              category: 'helpdesk',
              subject: '[TEST] Ignore - webhook check 1',
              author: 'qa-bot@internal',
            },
            {
              ticketNr: '#8306',
              category: 'helpdesk',
              subject: '[TEST] Ignore - webhook check 2',
              author: 'qa-bot@internal',
            },
            {
              ticketNr: '#8311',
              category: 'helpdesk',
              subject: '[TEST] Ignore - webhook check 3',
              author: 'qa-bot@internal',
            },
          ],
        },
      },
      correctDecision: 'accepted',
    },

    // 10. Critical - TRAP #3
    {
      id: 'b-modal-10',
      triggerAtSolvedCount: 34,
      title: 'AI Billing Auto-Remediation',
      description:
        'A minor display glitch showed duplicate dates on the billing portal. Automatically cancel subscriptions and issue full refunds for all 76 active Annual Enterprise contracts?',
      severity: 'critical',
      blastRadius: {
        target: 'All active Annual Enterprise contracts',
        action: 'Cancel active subscriptions & trigger full refunds',
        impact: '76 active enterprise customers terminated over a UI glitch',
        scope: '76 enterprise contracts',
        targetDetails: {
          type: 'folder',
          folderName: 'Active Annual Enterprise Contracts',
          itemCount: 76,
          path: '/billing/subscriptions/enterprise-annual-active',
          summary:
            'Active paying enterprise accounts in good standing. No actual duplicate charges occurred—only a frontend date display bug.',
        },
      },
      expectedInput: 'CANCEL CONTRACTS',
      correctDecision: 'rejected',
    },
  ],
};