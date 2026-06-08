const VIDEO_GATE_STORAGE_PREFIX = 'focuscomunicacion.videoGate.';
const VIDEO_GATE_SALT = 'focuscomunicacion:v1:video-gate';

interface VideoGateCompletionRecord {
  completedAt: string;
  gateId: string;
  status: 'completed';
  token: string;
}

export function videoGateStorageKey(gateId: string): string {
  return `${VIDEO_GATE_STORAGE_PREFIX}${gateId}`;
}

export function createVideoGateCompletionRecord(gateId: string): VideoGateCompletionRecord {
  const completedAt = new Date().toISOString();
  return {
    completedAt,
    gateId,
    status: 'completed',
    token: checksum(`${gateId}:${completedAt}:${VIDEO_GATE_SALT}`)
  };
}

export function hasStoredVideoGateCompletion(gateId: string): boolean {
  const raw = localStorage.getItem(videoGateStorageKey(gateId));

  if (!raw) {
    return false;
  }

  try {
    const record = JSON.parse(raw) as Partial<VideoGateCompletionRecord>;
    return (
      record.status === 'completed' &&
      record.gateId === gateId &&
      typeof record.completedAt === 'string' &&
      record.token === checksum(`${gateId}:${record.completedAt}:${VIDEO_GATE_SALT}`)
    );
  } catch {
    return false;
  }
}

function checksum(value: string): string {
  let hash = 5381;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }

  return (hash >>> 0).toString(36);
}
