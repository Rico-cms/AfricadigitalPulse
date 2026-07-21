const test=require('node:test');const assert=require('node:assert/strict');
function slugify(s){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function canPublish({checks,approved,valid,sourceLevel}){return checks.every(Boolean)&&approved&&valid&&sourceLevel==='A'}
test('génère un slug stable en français',()=>assert.equal(slugify("L'innovation en Côte d’Ivoire"),'l-innovation-en-cote-d-ivoire'));
test('bloque une publication incomplète',()=>assert.equal(canPublish({checks:[true,true,false,true],approved:true,valid:true,sourceLevel:'A'}),false));
test('exige une approbation humaine',()=>assert.equal(canPublish({checks:[true,true,true,true],approved:false,valid:true,sourceLevel:'A'}),false));
test('autorise une publication entièrement contrôlée',()=>assert.equal(canPublish({checks:[true,true,true,true],approved:true,valid:true,sourceLevel:'A'}),true));
