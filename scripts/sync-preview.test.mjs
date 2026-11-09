import test from 'node:test';
import assert from 'node:assert/strict';
import {previewBranchAllowed,fileMayBeCommitted,containsCredential} from './sync-policy.mjs';

test('preview synchronization cannot push main, detached or malformed refs',()=>{
 assert.ok(previewBranchAllowed('release/karaoglu-final-2026-11-08'));
 for(const ref of ['main','master','','HEAD','release/../main','release//main','release/a/'])assert.equal(previewBranchAllowed(ref),false,ref);
});
test('sync policy excludes local artifacts, credentials and raw reports',()=>{
 for(const path of ['.env','.ENV.production','src/.env.local','.audit/private.js','dist/index.html','node_modules/a.js','.netlify/state.json','reports/a/data.json','reports/out.sarif','id_rsa','private.key','.npmrc'])assert.equal(fileMayBeCommitted(path),false,path);
 for(const path of ['.env.example','src/index.css','public/images/photo.webp','.github/workflows/ci.yml','reports/PRODUCTION_DEPLOYMENT_REPORT.md'])assert.equal(fileMayBeCommitted(path),true,path);
});
test('credential content is rejected without rejecting variable names or examples',()=>{
 assert.equal(containsCredential('ghp_'+'x'.repeat(25)),true);
 assert.equal(containsCredential('-----BEGIN '+'PRIVATE KEY-----'),true);
 assert.equal(containsCredential('nfp_'+'a'.repeat(24)),true);
 assert.equal(containsCredential('NETLIFY_AUTH_TOKEN=${{ secrets.NETLIFY_AUTH_TOKEN }}'),false);
 assert.equal(containsCredential('qa@example.invalid'),false);
});
