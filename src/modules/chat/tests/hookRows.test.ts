import { describe, expect, it } from 'vitest';

import { normalizedToChatMessages } from '@/modules/chat/hooks/useChatMessages';
import type { NormalizedMessage } from '@/shared/types';

const hookRow = (fields: Partial<NormalizedMessage>): NormalizedMessage => ({
  id: Math.random().toString(36).slice(2),
  sessionId: 's1',
  timestamp: '2026-01-01T00:00:00.000Z',
  provider: 'claude',
  kind: 'text',
  role: 'assistant',
  ...fields,
} as NormalizedMessage);

describe('hook rows', () => {
  it('keeps the hook on the chat message so the transcript can draw it as one', () => {
    const hook = {
      name: 'PreToolUse:Read',
      event: 'PreToolUse',
      outcome: 'success' as const,
      exitCode: 0,
      decision: 'deny' as const,
      reason: "Étape 0 : lire d'abord le digest",
    };

    const converted = normalizedToChatMessages([
      hookRow({ content: "Hook PreToolUse:Read · denied: Étape 0 : lire d'abord le digest", hook }),
    ]);

    expect(converted).toHaveLength(1);
    expect(converted[0].type).toBe('assistant');
    expect(converted[0].hook).toEqual(hook);
    expect(converted[0].content).toBe("Hook PreToolUse:Read · denied: Étape 0 : lire d'abord le digest");
  });

  it('leaves an ordinary assistant row without a hook', () => {
    const converted = normalizedToChatMessages([hookRow({ content: 'hello' })]);

    expect(converted).toHaveLength(1);
    expect(converted[0].hook).toBeUndefined();
  });
});
