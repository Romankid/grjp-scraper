export interface Match {
  match: string;
  foundStrings: string[];
}

export type MatchKeys = Record<string, string[]>;

export const defaultChatbotKeys: MatchKeys = {
  Mainstay: ['mainstay.com', 'admithub'],
  Ocelot: ['ocelot_ai', 'ai.ocelotbot', 'ocelotbot'],
  Gecko: ['GeckoChatWidget', 'geckochat.io'],
  Element451: ['messenger.451.io'],
  'Ivy.ai': ['ivy.ai', 'ivy-bot'],
  'Oracle Digital Assistant': ['oda-chat'],
  BlackBeltHelp: ['blackbelthelp'],
  Ada: ['ada.support'],
  Olark: ['olark.com'],
  Chaport: ['chaport-launcher', 'chaport.com'],
};

export const defaultCrmKeys: MatchKeys = {
  Slate: ['slate-technolutions'],
  'Target X': ['TargetX'],
  'Ellucian CRM Recruit': ['Ellucian.Recruit', 'elluciancrmrecruit.com'],
  'Enrollment Rx': ['enrollmentrx.com', 'erx_dxp'],
  Salesforce: ['salesforce-sites.com', 'service.force.com'],
  BlackBaud: ['blackbaud', 'blackbaud.com', 'blackbaudhosting.com'],
};

export function findMatches(html: string, matchKeys: MatchKeys, caseSensitive = false): Match[] {
  const htmlToMatch = caseSensitive ? html : html.toLowerCase();

  return Object.entries(matchKeys)
    .filter(([_, aliases]) => 
      aliases.some(alias => 
        htmlToMatch.includes(caseSensitive ? alias : alias.toLowerCase())
      )
    )
    .map(([match, aliases]) => ({
      match,
      foundStrings: aliases.filter(alias => 
        htmlToMatch.includes(caseSensitive ? alias : alias.toLowerCase())
      )
    }));
}

export function detectClues(html: string, options?: {
  chatbots?: boolean;
  crm?: boolean;
  customKeys?: MatchKeys;
}): Record<string, Match[]> {
  const results: Record<string, Match[]> = {};

  if (options?.chatbots !== false) {
    results.chatbots = findMatches(html, defaultChatbotKeys);
  }

  if (options?.crm !== false) {
    results.crm = findMatches(html, defaultCrmKeys);
  }

  if (options?.customKeys) {
    results.custom = findMatches(html, options.customKeys);
  }

  return results;
}
