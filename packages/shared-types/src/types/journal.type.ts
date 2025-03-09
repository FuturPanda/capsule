export class JournalType {
  'version': number;
  'entries': JournalEntryType[];
}

export class JournalEntryType {
  'idx': number;
  'version': number;
  'when': number;
  'tag': string;
}
