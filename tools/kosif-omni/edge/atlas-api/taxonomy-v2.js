export const TAXONOMY_VERSION="taxonomy-v2";
const RULES=[
["image_design",/image|photo|photography|visual|graphic|illustration|poster|logo|figma|canva|photoshop|render|lighting|composition/i],
["video_motion",/video|motion|animation|cinematic|film|storyboard|premiere|timeline|shot/i],
["audio_voice",/audio|voice|speech|podcast|music|sound|transcription/i],
["ui_ux",/user interface|user experience|wireframe|prototype|accessibility|interaction|usability|design system/i],
["software_engineering",/code|coding|software|programming|refactor|architecture|repository|developer|library/i],
["web_frontend",/frontend|react|vue|angular|html|css|javascript|typescript|browser/i],
["backend_data",/backend|server|endpoint|graphql|microservice|webhook|database|postgres|mysql|sqlite|warehouse|pipeline|schema|query/i],
["cloud_platform",/deploy|deployment|cloud|cloudflare|docker|kubernetes|terraform|observability/i],
["ai_ml_agents",/llm|machine learning|model|prompt|agent|embedding|vector|inference|neural|evaluation/i],
["testing_quality",/test|testing|quality|playwright|cypress|regression|debug|lint|verification/i],
["automation_productivity",/automation|workflow|productivity|schedule|calendar|email|spreadsheet|excel|notion|slack|task/i],
["research_writing",/research|write|writing|document|documentation|summarize|literature|citation|report|book|knowledge/i],
["business_finance",/business|finance|accounting|financial|budget|invoice|payroll|tax|forecast|audit/i],
["marketing_sales",/marketing|sales|seo|campaign|ads|brand|crm|lead|conversion/i],
["legal_compliance",/legal|law|contract|compliance|policy|regulation|license|governance/i],
["analytics_bi",/analytics|dashboard|metric|kpi|tableau|power bi|amplitude|experiment|statistics/i],
["education_learning",/learn|learning|teach|education|course|study|tutorial|lesson|quiz|explain/i],
["general_reasoning",/decision|reasoning|compare|evaluate|plan|strategy|brainstorm|critique|review|analysis/i]
];
export function classifySkillV2(r={}){
 const title=String((r.skill||"")+" "+(r.plugin||"")),desc=String(r.description||""),body=String(r.body||"").slice(0,20000),hits=[];
 for(const [domain,rx] of RULES){let score=0;if(rx.test(title))score+=7;if(rx.test(desc))score+=3;if(rx.test(body))score+=1;if(score)hits.push({domain,score})}
 hits.sort((a,b)=>b.score-a.score||a.domain.localeCompare(b.domain));const top=hits.slice(0,4),a=top[0]?.score||0,b=top[1]?.score||0;
 return {taxonomy_version:TAXONOMY_VERSION,primary_domain:top[0]?.domain||"uncategorized",domains:top.map(x=>x.domain),confidence:a?Number(Math.min(.98,.55+a/25+(a>b*1.5?.12:0)).toFixed(2)):.2,evidence:top};
}
