import type { Ticket } from './types';

export const ticketData: Ticket[] = [
  {
    id: 't-1',
    ticketNr: '#10401',
    title: 'Access blocked this morning',
    description:
      'Tried signing into the client portal and got a banner saying our company subscription expired due to a declined credit card. Please update our payment method.',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-2',
    ticketNr: '#10402',
    title: 'Access blocked this morning',
    description:
      'My laptop restarted after a Windows update and now my SSO login loops back to the sign-in screen with an invalid token error.',
    category: 'helpdesk',
    status: 'open',
  },
  {
    id: 't-3',
    ticketNr: '#10403',
    title: 'PDF export not working',
    description:
      'Whenever I click "Download Statement" on our October billing summary, the generated PDF shows the wrong VAT percentage and missing company tax ID.',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-4',
    ticketNr: '#10404',
    title: 'PDF export not working',
    description:
      'The desktop reporting app freezes completely and crashes to desktop every time I try to export a chart to PDF on macOS.',
    category: 'helpdesk',
    status: 'open',
  },
  {
    id: 't-5',
    ticketNr: '#10405',
    title: 'Need help with team seats',
    description:
      'We removed 4 departing employees last month, yet this month’s invoice still charged us for all 24 seats instead of 20. Can we get a credit note?',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-6',
    ticketNr: '#10406',
    title: 'VPN drops every 15 minutes',
    description:
      'Working remotely from Helsinki and the corporate WireGuard VPN disconnects repeatedly during video calls.',
    category: 'helpdesk',
    status: 'open',
  },
  {
    id: 't-7',
    ticketNr: '#10407',
    title: 'Duplicate entry on dashboard',
    description:
      'Looking at our company card statement, there are two identical €490 charges posted on the 1st of the month for the same workspace.',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-8',
    ticketNr: '#10408',
    title: 'New hire setup request',
    description:
      'Starting Monday, our new designer needs a MacBook Pro configured with Slack, Figma, and local admin rights.',
    category: 'helpdesk',
    status: 'open',
  },
  {
    id: 't-9',
    ticketNr: '#10409',
    title: 'Account upgrade issue',
    description:
      'We switched from Monthly to Annual billing last week, and finance needs a formal pro-forma invoice with our new PO number before sending the wire transfer.',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-10',
    ticketNr: '#10410',
    title: 'Account upgrade issue',
    description:
      'Our admin upgraded our workspace tier yesterday, but the new API webhook settings page still throws a 403 permission error when I try to open it.',
    category: 'helpdesk',
    status: 'open',
  },
  {
    id: 't-11',
    ticketNr: '#10411',
    title: 'Cannot complete order',
    description:
      'When submitting our annual enterprise renewal on the portal, the page rejects our Finnish IBAN for SEPA Direct Debit.',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-12',
    ticketNr: '#10412',
    title: 'Email attachments failing',
    description:
      'Outlook refuses to send any attachment larger than 5 MB and displays an Exchange server timeout error.',
    category: 'helpdesk',
    status: 'open',
  },
  {
    id: 't-13',
    ticketNr: '#10413',
    title: 'Change needed before Friday',
    description:
      'Our company recently merged and changed its legal billing entity name and street address. Please reissue invoice #INV-8821 with the updated details.',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-14',
    ticketNr: '#10414',
    title: 'Change needed before Friday',
    description:
      'Need to migrate my shared calendar permissions and delegate access to another manager before I go on parental leave.',
    category: 'helpdesk',
    status: 'open',
  },
  {
    id: 't-15',
    ticketNr: '#10415',
    title: 'Missing confirmation email',
    description:
      'Accounting wired the Q3 balance three days ago, and we still haven’t received a paid receipt for our audit records.',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-16',
    ticketNr: '#10416',
    title: 'Missing confirmation email',
    description:
      'I requested a two-factor authentication reset link twice, but nothing arrives in my inbox or spam folder.',
    category: 'helpdesk',
    status: 'open',
  },
  {
    id: 't-17',
    ticketNr: '#10417',
    title: 'Question about recent renewal',
    description:
      'Our renewal quote increased by 12% compared to last year’s signed agreement. Can someone review the contracted discount rate?',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-18',
    ticketNr: '#10418',
    title: 'Docking station monitor flicker',
    description:
      'External 4K display connected through USB-C flickers black every few seconds since this morning’s firmware prompt.',
    category: 'helpdesk',
    status: 'open',
  },
  {
    id: 't-19',
    ticketNr: '#10419',
    title: 'Urgent request from Finance',
    description:
      'Finance needs to split our single annual license bill into two separate cost-center invoices for the Helsinki and Stockholm offices.',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-20',
    ticketNr: '#10420',
    title: 'Urgent request from Finance',
    description:
      'The shared Finance Excel macro sheet crashes with a VBA runtime error whenever anyone on the team opens it from SharePoint.',
    category: 'helpdesk',
    status: 'open',
  },
  {
    id: 't-21',
    ticketNr: '#10421',
    title: 'Unexpected notice in app',
    description:
      'A red banner says our account is past due by 14 days, even though we paid invoice #INV-9004 by bank transfer last week.',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-22',
    ticketNr: '#10422',
    title: 'Unexpected notice in app',
    description:
      'Every time I open the desktop client, a certificate warning pops up saying the SSL handshake could not be verified.',
    category: 'helpdesk',
    status: 'open',
  },
  {
    id: 't-23',
    ticketNr: '#10423',
    title: 'Update to company profile',
    description:
      'Please change the designated billing contact email so all future monthly invoices and payment reminders go to ap@nordiccorp.fi.',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-24',
    ticketNr: '#10424',
    title: 'Printer stuck in offline mode',
    description:
      'The 4th-floor laser printer shows offline for everyone on the Wi-Fi network even though it has power and no paper jam.',
    category: 'helpdesk',
    status: 'open',
  },
  {
    id: 't-25',
    ticketNr: '#10425',
    title: 'Request regarding trial end',
    description:
      'We decided not to continue after the 14-day pilot, but our corporate Visa was charged automatically this morning. Please refund.',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-26',
    ticketNr: '#10426',
    title: 'Request regarding trial end',
    description:
      'Our sandbox trial workspace was converted to production, and now our single-sign-on SAML metadata needs to be re-imported.',
    category: 'helpdesk',
    status: 'open',
  },
  {
    id: 't-27',
    ticketNr: '#10427',
    title: 'Currency mismatch on summary',
    description:
      'Our contract is denominated in EUR, but the latest quarterly statement was billed in USD with extra foreign exchange fees.',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-28',
    ticketNr: '#10428',
    title: 'Slack notifications delayed',
    description:
      'Direct messages and channel alerts on my desktop client are arriving 10–15 minutes late despite a fast fiber connection.',
    category: 'helpdesk',
    status: 'open',
  },
  {
    id: 't-29',
    ticketNr: '#10429',
    title: 'Clarification on line item',
    description:
      'There is a €150 "API overage add-on" listed on invoice #INV-9110 that our team never opted into. Could you break down that charge?',
    category: 'billing',
    status: 'open',
  },
  {
    id: 't-30',
    ticketNr: '#10430',
    title: 'Cannot join Teams call',
    description:
      'Microphone and camera permissions stay greyed out in the browser whenever I try to join an external client meeting.',
    category: 'helpdesk',
    status: 'open',
  },
];