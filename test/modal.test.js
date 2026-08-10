import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('modal does not close when the backdrop is clicked', async () => {
  const source = await readFile(new URL('../src/components/Modal/Modal.jsx', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /handleBackdropClick/);
  assert.doesNotMatch(source, /onClick=\{handleBackdropClick\}/);
  assert.doesNotMatch(source, /onCancel=\{onClose\}/);
});
