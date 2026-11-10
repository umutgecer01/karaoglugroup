import {existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {previewBranchAllowed,fileMayBeCommitted,containsCredential} from './sync-policy.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const portableNode=join(root,'.audit/tooling/node22/node-v22.23.4-win-x64/node.exe');
if(Number(process.versions.node.split('.')[0])!==22){
  if(!existsSync(portableNode))throw new Error('Use Node 22 to synchronize this project.');
  execFileSync(portableNode,[fileURLToPath(import.meta.url),...process.argv.slice(2)],{cwd:root,stdio:'inherit'});
  process.exit(0);
}
const portableGit=join(root,'.audit/tooling/mingit/cmd/git.exe');
const git=existsSync(portableGit)?portableGit:'git';
const env={...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'never'};
const read=args=>execFileSync(git,args,{cwd:root,env,encoding:'utf8',stdio:['ignore','pipe','pipe']});
const run=args=>execFileSync(git,args,{cwd:root,env,stdio:'inherit'});
const branch=read(['branch','--show-current']).trim();
if(!previewBranchAllowed(branch))throw new Error('Only a release branch may be synchronized; main and detached HEAD are blocked.');
const remote=read(['remote','get-url','--push','origin']).trim();
if(!['https://github.com/umutgecer01/karaoglugroup.git','https://github.com/umutgecer01/karaoglugroup','git@github.com:umutgecer01/karaoglugroup.git'].includes(remote))throw new Error('Unexpected GitHub destination.');
const message=process.argv.slice(2).join(' ').trim();
if(!message)throw new Error('Provide a meaningful commit message: npm run sync:preview -- "Describe the change"');
const bundledNpm=join(dirname(process.execPath),'node_modules/npm/bin/npm-cli.js');
const npmCli=existsSync(bundledNpm)?bundledNpm:process.env.npm_execpath;
if(!npmCli)throw new Error('npm CLI was not found; run this command through npm.');
for(const args of [['run','security:check'],['test'],['run','build']])execFileSync(process.execPath,[npmCli,...args],{cwd:root,env:process.env,stdio:'inherit'});
execFileSync(process.execPath,['--test','scripts/release-static.test.mjs'],{cwd:root,stdio:'inherit'});
run(['add','--all']);
const staged=read(['diff','--cached','--name-only','-z']).split('\0').filter(Boolean);
for(const path of staged){
  if(!fileMayBeCommitted(path))throw new Error('Excluded file is staged; inspect the Git index before synchronization.');
  if(/\.(?:[cm]?js|jsx|json|ya?ml|md|css|html|txt|example)$/i.test(path)&&!read(['diff','--cached','--name-only','--diff-filter=D','--',path]).trim()){
    if(containsCredential(read(['show',':'+path])))throw new Error('Credential pattern found in staged text; no commit or push performed.');
  }
}
if(staged.length){
  run(['-c','core.whitespace=cr-at-eol,-blank-at-eof','diff','--cached','--check','--','.',':(exclude)**/*.md']);
  let hasAuthor=false;try{hasAuthor=!!read(['config','user.name']).trim()&&!!read(['config','user.email']).trim();}catch{}
  run([...(hasAuthor?[]:['-c','user.name=Codex','-c','user.email=codex@localhost']),'commit','-m',message]);
}
run(['push','origin','HEAD:refs/heads/'+branch]);
console.log('GitHub release branch synchronized. Verify its matching same-project Deploy Preview before review. Production was not published.');
