'use client';
import { useState, useMemo } from 'react';

const DEPTS = [
  { id: 'all',          label: 'എല്ലാം',         en: 'All',             icon: '🗂️', color: '#ffffff' },
  { id: 'common',       label: 'പൊതു',            en: 'Common',          icon: '📋', color: '#2997ff' },
  { id: 'revenue',      label: 'റവന്യൂ',          en: 'Revenue',         icon: '🏛️', color: '#ff9f0a' },
  { id: 'forest',       label: 'വനം',             en: 'Forest',          icon: '🌿', color: '#30d158' },
  { id: 'panchayat',    label: 'പഞ്ചായത്ത്',      en: 'Panchayat',       icon: '🏘️', color: '#bf5af2' },
  { id: 'registration', label: 'രജിസ്ട്രേഷൻ',    en: 'Registration',    icon: '📝', color: '#64d2ff' },
  { id: 'prisons',      label: 'ജയിൽ',           en: 'Prisons',         icon: '🔒', color: '#ff453a' },
  { id: 'judiciary',    label: 'ജുഡീഷ്യറി',      en: 'Judiciary',       icon: '⚖️', color: '#ffd60a' },
  { id: 'police',       label: 'പോലീസ്',         en: 'Police',          icon: '👮', color: '#0071e3' },
  { id: 'education',    label: 'വിദ്യാഭ്യാസം',   en: 'Education',       icon: '🎓', color: '#34c759' },
  { id: 'kseb',         label: 'KSEB',            en: 'KSEB',            icon: '⚡', color: '#ffd60a' },
  { id: 'pwdmuni',      label: 'PWD / നഗരം',     en: 'PWD / Municipal', icon: '🏗️', color: '#ff9f0a' },
  { id: 'other',        label: 'മറ്റുള്ളവ',       en: 'Other Depts',     icon: '🏢', color: '#86868b' },
];

const TESTS = [
  // COMMON
  { id: 1,  dept: 'common',       name_en: 'Manual of Office Procedure (MOP)',                        name_ml: 'ഓഫീസ് നടപടി ക്രമ മാനുവൽ',                  papers: 1, popular: true,  for_ml: 'എല്ലാ ക്ലാസ് II, III, IV ജീവനക്കാർക്കും നിർബന്ധം',      topics: ['ഫയൽ നടപടിക്രമം', 'കത്തിടപാടുകൾ', 'ഔദ്യോഗിക കത്തുകൾ', 'ഓഫീസ് ചട്ടങ്ങൾ'],             note: 'Promotion-ന് ആദ്യം പാസ്സ് ആകേണ്ട ടെസ്റ്റ്' },
  { id: 2,  dept: 'common',       name_en: 'Kerala Service Rules (KSR)',                              name_ml: 'കേരള സർവ്വീസ് ചട്ടങ്ങൾ',                    papers: 1, popular: true,  for_ml: 'ഗസറ്റഡ് ഓഫീസർ / ക്ലാസ് I & II',                          topics: ['KSR Part I — നിയമനം', 'KSR Part II — അവധി', 'KSR Part III — ശമ്പളം', 'പെൻഷൻ', 'CCA'], note: 'ഗസറ്റഡ് promotion-ന് അനിവാര്യം' },
  { id: 3,  dept: 'common',       name_en: 'Kerala Treasury Code (KTC)',                              name_ml: 'കേരള ട്രഷറി കോഡ്',                           papers: 1, popular: false, for_ml: 'Drawing & Disbursing Officers, Finance Staff',             topics: ['ട്രഷറി ഇടപാടുകൾ', 'ബില്ലുകൾ', 'ഫണ്ട് ട്രാൻസ്ഫർ', 'കോണ്ടിജൻസ്', 'ഓഡിറ്റ്'],         note: null },
  { id: 4,  dept: 'common',       name_en: 'Kerala Financial Code (KFC)',                             name_ml: 'കേരള ഫിനാൻഷ്യൽ കോഡ്',                        papers: 1, popular: false, for_ml: 'Finance, Accounts ജീവനക്കാർ',                             topics: ['ഫിനാൻഷ്യൽ ചട്ടങ്ങൾ', 'ഓഡിറ്റ്', 'ടെൻഡർ നടപടിക്രമം', 'ബജറ്റ്'],                     note: null },
  { id: 5,  dept: 'common',       name_en: 'Introduction to Indian Accounts & Audit',                 name_ml: 'ഇന്ത്യൻ അക്കൗണ്ട്സ് & ഓഡിറ്റ് പരിചയം',    papers: 1, popular: false, for_ml: 'Accounts, Finance വിഭാഗം ജീവനക്കാർ',                      topics: ['ഇന്ത്യൻ ഓഡിറ്റ് ചട്ടങ്ങൾ', 'ഗവ. അക്കൗണ്ടിംഗ്', 'ബജറ്റ് സംവിധാനം', 'CAG'],          note: null },
  { id: 6,  dept: 'common',       name_en: 'Account Test for Executive Officers — Paper I',           name_ml: 'എക്സിക്യൂട്ടീവ് ഓഫീസർ അക്കൗണ്ട് ടെസ്റ്റ് — Paper I',  papers: 2, popular: false, for_ml: 'Non-Finance Executive Officers (Class I & II)', topics: ['KFC Vol I & II', 'ബജറ്റ്', 'കോണ്ടിജൻസ്', 'ട്രഷറി ചട്ടങ്ങൾ'],                        note: 'Paper I & II രണ്ടും പാസ്സ് ആകണം' },
  { id: 7,  dept: 'common',       name_en: 'Account Test for Executive Officers — Paper II',          name_ml: 'എക്സിക്യൂട്ടീവ് ഓഫീസർ അക്കൗണ്ട് ടെസ്റ്റ് — Paper II', papers: 2, popular: false, for_ml: 'Non-Finance Executive Officers (Class I & II)', topics: ['KSR Part III', 'ശമ്പളം', 'TA ചട്ടങ്ങൾ', 'മെഡിക്കൽ ആനുകൂല്യം'],                        note: null },
  // REVENUE
  { id: 8,  dept: 'revenue',      name_en: 'Revenue Test — Paper I',                                 name_ml: 'റവന്യൂ ടെസ്റ്റ് — പേപ്പർ I',                papers: 4, popular: true,  for_ml: 'Revenue ജീവനക്കാർ (Tahsildar, RI, VEO)',                  topics: ['Kerala Land Reforms Act', 'Land Survey', 'Patta & Title Deed', 'Revenue Recovery'],   note: '4 papers പാസ്സ് ആകണം promotion-ന്' },
  { id: 9,  dept: 'revenue',      name_en: 'Revenue Test — Paper II',                                name_ml: 'റവന്യൂ ടെസ്റ്റ് — പേപ്പർ II',               papers: 4, popular: false, for_ml: 'Revenue ജീവനക്കാർ',                                       topics: ['Kerala Land Tax Act', 'Registration Act', 'Stamp Duty', 'Property Tax'],               note: null },
  { id: 10, dept: 'revenue',      name_en: 'Revenue Test — Paper III',                               name_ml: 'റവന്യൂ ടെസ്റ്റ് — പേപ്പർ III',              papers: 4, popular: false, for_ml: 'Revenue ജീവനക്കാർ',                                       topics: ['Tenancy Laws', 'Ceiling on Land Holdings', 'Land Acquisition'],                        note: null },
  { id: 11, dept: 'revenue',      name_en: 'Revenue Test — Paper IV',                                name_ml: 'റവന്യൂ ടെസ്റ്റ് — പേപ്പർ IV',               papers: 4, popular: false, for_ml: 'Revenue ജീവനക്കാർ',                                       topics: ['CrPC', 'Evidence Act', 'Police Act', 'Criminal Procedure'],                           note: null },
  { id: 12, dept: 'revenue',      name_en: 'District Offices Manual Test',                           name_ml: 'ജില്ലാ ഓഫീസ് മാനുവൽ ടെസ്റ്റ്',             papers: 1, popular: false, for_ml: 'Collectorate, Taluk Office ജീവനക്കാർ',                    topics: ['District Office Manual', 'ഓഫീസ് നടപടി', 'ഫയൽ ക്രമം', 'ഡ്രാഫ്റ്റിംഗ്'],              note: null },
  // FOREST
  { id: 13, dept: 'forest',       name_en: 'Forest Test — Clerical & Protective — Paper I',          name_ml: 'വനം ടെസ്റ്റ് — ഗുമസ്തൻ/സംരക്ഷണം — Paper I',  papers: 2, popular: false, for_ml: 'Forest Clerk, Forest Guard, Watcher',                    topics: ['Kerala Forest Act', 'Forest Laws', 'Wild Life Protection', 'Forest Manual'],          note: null },
  { id: 14, dept: 'forest',       name_en: 'Forest Test — Clerical & Protective — Paper II',         name_ml: 'വനം ടെസ്റ്റ് — ഗുമസ്തൻ/സംരക്ഷണം — Paper II', papers: 2, popular: false, for_ml: 'Forest Clerk, Forest Guard',                             topics: ['KFC', 'KSR', 'Forest Revenue', 'Accounts'],                                          note: null },
  { id: 15, dept: 'forest',       name_en: 'Forest Test — Executive — Paper I',                      name_ml: 'വനം ടെസ്റ്റ് — എക്സിക്യൂട്ടീവ് — Paper I',  papers: 3, popular: false, for_ml: 'Forest Range Officer, Deputy Ranger',                     topics: ['Kerala Forest Act', 'Wild Life Act', 'Forest Conservation Act'],                      note: null },
  { id: 16, dept: 'forest',       name_en: 'Forest Test — Executive — Paper II',                     name_ml: 'വനം ടെസ്റ്റ് — എക്സിക്യൂട്ടീവ് — Paper II', papers: 3, popular: false, for_ml: 'Range Officer, Deputy Ranger',                             topics: ['Silviculture', 'Working Plans', 'Forest Management', 'Timber'],                       note: null },
  { id: 17, dept: 'forest',       name_en: 'Forest Test — Executive — Paper III',                    name_ml: 'വനം ടെസ്റ്റ് — എക്സിക്യൂട്ടീവ് — Paper III', papers: 3, popular: false, for_ml: 'Range Officer',                                           topics: ['Forest Accounts', 'KSR', 'KFC', 'Financial Management'],                             note: null },
  // PANCHAYAT
  { id: 18, dept: 'panchayat',    name_en: 'Panchayat Test — Paper I',                               name_ml: 'പഞ്ചായത്ത് ടെസ്റ്റ് — പേപ്പർ I',            papers: 4, popular: true,  for_ml: 'Panchayat Secretary, Panchayat Extension Officer',         topics: ['Kerala Panchayati Raj Act 1994', 'Gram Panchayat', 'Grama Sabha', 'Decentralisation'], note: 'Local Govt promotion-ന് 4 papers' },
  { id: 19, dept: 'panchayat',    name_en: 'Panchayat Test — Paper II',                              name_ml: 'പഞ്ചായത്ത് ടെസ്റ്റ് — പേപ്പർ II',           papers: 4, popular: false, for_ml: 'Panchayat ജീവനക്കാർ',                                     topics: ['Panchayat Accounts', 'Budget', 'Tax Collection', 'Audit'],                            note: null },
  { id: 20, dept: 'panchayat',    name_en: 'Panchayat Test — Paper III',                             name_ml: 'പഞ്ചായത്ത് ടെസ്റ്റ് — പേപ്പർ III',          papers: 4, popular: false, for_ml: 'Panchayat ജീവനക്കാർ',                                     topics: ['Building Rules', 'Land Use', 'Environmental Laws', 'Kerala Municipality Act'],         note: null },
  { id: 21, dept: 'panchayat',    name_en: 'Panchayat Test — Paper IV',                              name_ml: 'പഞ്ചായത്ത് ടെസ്റ്റ് — പേപ്പർ IV',           papers: 4, popular: false, for_ml: 'Panchayat ജീവനക്കാർ',                                     topics: ['KSR', 'KFC', 'Service Matters', 'Office Procedure'],                                  note: null },
  // REGISTRATION
  { id: 22, dept: 'registration', name_en: 'Kerala Registration Test — Part I, Paper I',             name_ml: 'രജിസ്ട്രേഷൻ ടെസ്റ്റ് — Part I, Paper I',    papers: 4, popular: true,  for_ml: 'Sub Registrar, Senior Superintendent, Clerk',              topics: ['Registration Act 1908', 'Document Registration', 'SRO Procedure', 'Stamp Duty'],      note: null },
  { id: 23, dept: 'registration', name_en: 'Kerala Registration Test — Part I, Paper II',            name_ml: 'രജിസ്ട്രേഷൻ ടെസ്റ്റ് — Part I, Paper II',   papers: 4, popular: false, for_ml: 'Sub Registrar, Clerk',                                     topics: ['Kerala Stamp Act', 'Transfer of Property Act', 'Land Laws'],                          note: null },
  { id: 24, dept: 'registration', name_en: 'Kerala Registration Test — Part II',                     name_ml: 'രജിസ്ട്രേഷൻ ടെസ്റ്റ് — Part II',             papers: 4, popular: false, for_ml: 'Senior Grade ജീവനക്കാർ',                                   topics: ['Power of Attorney', 'Will Registration', 'Company Documents'],                        note: null },
  { id: 25, dept: 'registration', name_en: 'Kerala Registration Test — Part III',                    name_ml: 'രജിസ്ട്രേഷൻ ടെസ്റ്റ് — Part III',            papers: 4, popular: false, for_ml: 'District Registrar Office ജീവനക്കാർ',                      topics: ['Revenue Laws', 'Survey & Settlement', 'Land Acquisition', 'Property Laws'],           note: null },
  // PRISONS
  { id: 26, dept: 'prisons',      name_en: 'Kerala Jail Officers Test — Paper I',                    name_ml: 'ജയിൽ ഓഫീസർ ടെസ്റ്റ് — Paper I',             papers: 3, popular: false, for_ml: 'Jail Warden, Head Warden',                                 topics: ['Kerala Prisons Act', 'Prison Rules', 'Prisoner Management', 'Security'],              note: null },
  { id: 27, dept: 'prisons',      name_en: 'Kerala Jail Officers Test — Paper II',                   name_ml: 'ജയിൽ ഓഫീസർ ടെസ്റ്റ് — Paper II',            papers: 3, popular: false, for_ml: 'Jail Warden',                                              topics: ['IPC', 'CrPC', 'Evidence Act', 'Police Act'],                                          note: null },
  { id: 28, dept: 'prisons',      name_en: 'Kerala Jail Officers Test — Paper IV',                   name_ml: 'ജയിൽ ഓഫീസർ ടെസ്റ്റ് — Paper IV',            papers: 3, popular: false, for_ml: 'Jail Officers',                                            topics: ['Rehabilitation', 'Welfare Activities', 'Prison Management'],                          note: null },
  { id: 29, dept: 'prisons',      name_en: 'Kerala Jail Subordinate Officers Test — Paper I',        name_ml: 'ജയിൽ കീഴ് ഓഫീസർ ടെസ്റ്റ് — Paper I',        papers: 1, popular: false, for_ml: 'Sub Jail Officer',                                         topics: ['Prison Manual', 'Rules & Regulations', 'Security Procedures'],                        note: null },
  // JUDICIARY
  { id: 30, dept: 'judiciary',    name_en: 'Civil Judicial Test — Paper I',                          name_ml: 'സിവിൽ ജ്യൂഡീഷ്യൽ ടെസ്റ്റ് — Paper I',      papers: 2, popular: true,  for_ml: 'Court Clerk, Process Server, Copyist',                     topics: ['CPC — Civil Procedure Code', 'Kerala Civil Courts Act', 'CJ Manual'],                 note: null },
  { id: 31, dept: 'judiciary',    name_en: 'Civil Judicial Test — Paper II',                         name_ml: 'സിവിൽ ജ്യൂഡീഷ്യൽ ടെസ്റ്റ് — Paper II',     papers: 2, popular: false, for_ml: 'Court ജീവനക്കാർ',                                          topics: ['KFC', 'KSR', 'MOP', 'Accounts'],                                                      note: null },
  { id: 32, dept: 'judiciary',    name_en: 'Criminal Judicial Test — Paper I',                       name_ml: 'ക്രിമിനൽ ജ്യൂഡീഷ്യൽ ടെസ്റ്റ് — Paper I',   papers: 2, popular: false, for_ml: 'Criminal Court ജീവനക്കാർ',                                 topics: ['CrPC', 'IPC', 'Evidence Act', 'Criminal Manual'],                                     note: null },
  { id: 33, dept: 'judiciary',    name_en: 'Criminal Judicial Test — Paper II',                      name_ml: 'ക്രിമിനൽ ജ്യൂഡീഷ്യൽ ടെസ്റ്റ് — Paper II',  papers: 2, popular: false, for_ml: 'Criminal Court ജീവനക്കാർ',                                 topics: ['KSR', 'KFC', 'MOP', 'Office Procedure'],                                              note: null },
  // POLICE
  { id: 34, dept: 'police',       name_en: 'Test on Kerala Police Manual',                           name_ml: 'കേരള പോലീസ് മാനുവൽ ടെസ്റ്റ്',               papers: 2, popular: true,  for_ml: 'Civil Police Officer, ASI, SI',                            topics: ['Kerala Police Act 2011', 'Police Manual Vol I & II', 'IPC', 'CrPC', 'Evidence Act'],  note: null },
  { id: 35, dept: 'police',       name_en: 'Test on Manual of Office Procedure (Police)',             name_ml: 'ഓഫീസ് നടപടി ക്രമ ടെസ്റ്റ് (പോലീസ്)',        papers: 1, popular: false, for_ml: 'Police Office/Min Staff',                                  topics: ['Police MOP', 'Office Procedure', 'Correspondence', 'File Management'],                note: null },
  // EDUCATION
  { id: 36, dept: 'education',    name_en: 'Kerala Education Rules (KER)',                           name_ml: 'കേരള വിദ്യാഭ്യാസ ചട്ടങ്ങൾ (KER)',             papers: 1, popular: true,  for_ml: 'School Teachers, Education Dept ജീവനക്കാർ',               topics: ['KER Part I & II', 'School Regulation', 'Service Conditions', 'Leave Rules'],          note: 'Education Dept promotion-ന് KER pass നിർബന്ധം' },
  // KSEB
  { id: 37, dept: 'kseb',         name_en: 'Test for Asst. Electrical Inspectors — Paper I',         name_ml: 'ഇലക്ട്രിക്കൽ ഇൻസ്പെക്ടർ ടെസ്റ്റ് — Paper I', papers: 2, popular: false, for_ml: 'Electrical Inspectorate Staff',                             topics: ['Electricity Act 2003', 'IE Rules 1956', 'Electrical Safety', 'Wiring Standards'],     note: null },
  { id: 38, dept: 'kseb',         name_en: 'Test for Asst. Electrical Inspectors — Paper II',        name_ml: 'ഇലക്ട്രിക്കൽ ഇൻസ്പെക്ടർ ടെസ്റ്റ് — Paper II', papers: 2, popular: false, for_ml: 'Electrical Inspectorate Staff',                            topics: ['KFC', 'KSR', 'MOP', 'Service Rules'],                                                 note: null },
  { id: 39, dept: 'kseb',         name_en: 'Test for Executive Staff of KSEB — Paper III',           name_ml: 'KSEB എക്സിക്യൂട്ടീവ് ടെസ്റ്റ് — Paper III',  papers: 1, popular: false, for_ml: 'KSEB Executive (Technical) Staff',                         topics: ['KSEB Regulations', 'Power Systems', 'Electrical Laws', 'Safety Rules'],               note: null },
  { id: 40, dept: 'kseb',         name_en: 'Test for Ministerial Staff of KSEB — Paper III',         name_ml: 'KSEB മിനിസ്റ്റീരിയൽ ടെസ്റ്റ് — Paper III',   papers: 1, popular: false, for_ml: 'KSEB Office/Ministerial Staff',                             topics: ['KSEB Rules', 'MOP', 'Office Procedure', 'Accounts'],                                  note: null },
  // PWD / MUNICIPAL
  { id: 41, dept: 'pwdmuni',      name_en: 'PWD Manual Test',                                        name_ml: 'PWD മാനുവൽ ടെസ്റ്റ്',                         papers: 1, popular: false, for_ml: 'PWD Overseer, Draftsman, Office Staff',                     topics: ['PWD Manual', 'Building Specification', 'Tender Process', 'Works Accounts'],           note: null },
  { id: 42, dept: 'pwdmuni',      name_en: 'Kerala PWD Test — Paper I',                              name_ml: 'കേരള PWD ടെസ്റ്റ് — Paper I',                 papers: 2, popular: false, for_ml: 'PWD Technical Staff',                                      topics: ['PWD Code', 'Contracts', 'Estimates', 'Schedule of Rates'],                            note: null },
  { id: 43, dept: 'pwdmuni',      name_en: 'Kerala PWD Test — Paper II',                             name_ml: 'കേരള PWD ടെസ്റ്റ് — Paper II',                papers: 2, popular: false, for_ml: 'PWD Technical Staff',                                      topics: ['KFC', 'KSR', 'Accounts', 'Service Rules'],                                            note: null },
  { id: 44, dept: 'pwdmuni',      name_en: 'Kerala Municipal Test — Paper II',                       name_ml: 'കേരള മുൻസിപ്പൽ ടെസ്റ്റ് — Paper II',          papers: 2, popular: false, for_ml: 'Municipality Staff',                                       topics: ['Kerala Municipality Act 1994', 'Local Self Govt', 'Tax & Finance', 'Building Rules'],  note: null },
  { id: 45, dept: 'pwdmuni',      name_en: 'Kerala Municipal Test — Paper III',                      name_ml: 'കേരള മുൻസിപ്പൽ ടെസ്റ്റ് — Paper III',         papers: 2, popular: false, for_ml: 'Municipality Staff',                                       topics: ['KSR', 'KFC', 'MOP', 'Accounts'],                                                      note: null },
  // OTHER DEPTS
  { id: 46, dept: 'other',        name_en: 'Local Fund Audit Test (Lower) — Paper I & II',           name_ml: 'ലോക്കൽ ഫണ്ട് ഓഡിറ്റ് ടെസ്റ്റ് (Lower)',      papers: 2, popular: false, for_ml: 'Local Fund Audit Dept Staff',                               topics: ['Local Fund Audit Act', 'Audit Procedure', 'Panchayat/Municipality Accounts'],         note: null },
  { id: 47, dept: 'other',        name_en: 'Local Fund Audit Test (Higher) — Paper I & II',          name_ml: 'ലോക്കൽ ഫണ്ട് ഓഡിറ്റ് ടെസ്റ്റ് (Higher)',     papers: 2, popular: false, for_ml: 'LFA Senior Staff',                                         topics: ['Advanced Audit', 'Surcharge', 'Recovery', 'Legal Proceedings'],                       note: null },
  { id: 48, dept: 'other',        name_en: 'Labour Department Test (3 Papers)',                      name_ml: 'ലേബർ ഡിപ്പാർട്ട്‌മെന്റ് ടെസ്റ്റ്',            papers: 3, popular: false, for_ml: 'Labour Officer, Inspector of Labour',                       topics: ['Factories Act', 'Payment of Wages Act', 'Workmen Compensation', 'ESI Act'],           note: null },
  { id: 49, dept: 'other',        name_en: 'Excise Test (Part A & B)',                               name_ml: 'എക്‌സൈസ് ടെസ്റ്റ്',                            papers: 3, popular: false, for_ml: 'Excise Inspector, Preventive Officer',                       topics: ['Kerala Abkari Act', 'NDPS Act', 'Excise Manual', 'Criminal Laws'],                     note: null },
  { id: 50, dept: 'other',        name_en: 'GST / Sales Tax Test (3 Papers)',                        name_ml: 'GST / സേൽസ് ടാക്സ് ടെസ്റ്റ്',                papers: 3, popular: false, for_ml: 'Commercial Tax Dept, GST Inspector',                         topics: ['GST Act 2017', 'KGST Act', 'Tax Assessment', 'Audit & Recovery'],                     note: null },
  { id: 51, dept: 'other',        name_en: 'Test on Laws Relating to Motor Vehicles',                name_ml: 'മോട്ടോർ വെഹിക്കിൾ നിയമ ടെസ്റ്റ്',             papers: 2, popular: false, for_ml: 'Motor Vehicles Dept ജീവനക്കാർ',                            topics: ['Motor Vehicles Act 1988', 'MV Rules', 'Driving Licence', 'Permit System'],            note: null },
  { id: 52, dept: 'other',        name_en: 'Co-operative Test (2 Papers)',                           name_ml: 'സഹകരണ ടെസ്റ്റ്',                               papers: 2, popular: false, for_ml: 'Co-operative Dept Registrar Staff',                          topics: ['Kerala Co-operative Societies Act', 'Audit', 'By-laws', 'Recovery'],                  note: null },
  { id: 53, dept: 'other',        name_en: 'Secretariat Manual Test',                                name_ml: 'സെക്രട്ടേറിയറ്റ് മാനുവൽ ടെസ്റ്റ്',            papers: 1, popular: false, for_ml: 'Secretariat Staff, Section Clerk',                           topics: ['Secretariat Manual', 'File Management', 'Drafting', 'Office Procedure'],              note: null },
  { id: 54, dept: 'other',        name_en: 'KSRTC Manual Test',                                      name_ml: 'KSRTC മാനുവൽ ടെസ്റ്റ്',                        papers: 1, popular: false, for_ml: 'KSRTC Staff',                                              topics: ['KSRTC Regulations', 'Service Rules', 'Conduct Rules'],                                note: null },
  { id: 55, dept: 'other',        name_en: 'Test for PSC Staff',                                     name_ml: 'PSC ജീവനക്കാർ ടെസ്റ്റ്',                       papers: 1, popular: false, for_ml: 'Kerala PSC Staff',                                          topics: ['PSC Rules', 'Recruitment Procedure', 'Exam Conduct', 'KSR'],                          note: null },
  { id: 56, dept: 'other',        name_en: 'Weights & Measures Test',                                name_ml: 'തൂക്കവും അളവും ടെസ്റ്റ്',                      papers: 1, popular: false, for_ml: 'Legal Metrology Staff',                                     topics: ['Legal Metrology Act 2009', 'Weights & Measures Rules', 'Inspector Duties'],           note: null },
  { id: 57, dept: 'other',        name_en: 'Kerala Probation Test — Social Justice (4 Papers)',      name_ml: 'കേരള പ്രൊബേഷൻ ടെസ്റ്റ്',                       papers: 4, popular: false, for_ml: 'Probation Officer, Social Justice Dept',                     topics: ['Probation of Offenders Act', 'Juvenile Justice Act', 'Social Welfare Laws'],          note: null },
  { id: 58, dept: 'other',        name_en: 'Employment Exchange Test (2 Papers)',                    name_ml: 'എംപ്ലോയ്‌മെന്റ് എക്സ്ചേഞ്ച് ടെസ്റ്റ്',        papers: 2, popular: false, for_ml: 'Employment Exchange Staff',                                 topics: ['Employment Exchange Act', 'Registration Procedure', 'Placement Rules'],               note: null },
  { id: 59, dept: 'other',        name_en: 'Animal Husbandry Department Manual Test',                name_ml: 'മൃഗസംരക്ഷണ വകുപ്പ് മാനുവൽ',                    papers: 1, popular: false, for_ml: 'Animal Husbandry Dept Staff',                               topics: ['AH Dept Manual', 'Livestock Laws', 'Prevention of Cruelty to Animals Act'],          note: null },
  { id: 60, dept: 'other',        name_en: 'Kerala Port Departmental Test',                          name_ml: 'കേരള പോർട്ട് ടെസ്റ്റ്',                         papers: 1, popular: false, for_ml: 'Kerala Port Dept Staff',                                   topics: ['Port Rules', 'Maritime Laws', 'Custom Regulations'],                                  note: null },
  { id: 61, dept: 'other',        name_en: 'Canal Rules Test',                                       name_ml: 'കനാൽ ചട്ടങ്ങൾ ടെസ്റ്റ്',                       papers: 1, popular: false, for_ml: 'Water Transport Dept Staff',                                topics: ['Kerala Canal Rules', 'Inland Water Transport', 'Navigation Rules'],                   note: null },
  { id: 62, dept: 'other',        name_en: 'Head Load Workers Rules Test',                           name_ml: 'ഹെഡ് ലോഡ് വർക്കേഴ്‌സ് ടെസ്റ്റ്',              papers: 1, popular: false, for_ml: 'Head Load Workers Board Staff',                              topics: ['Kerala Head Load Workers Act', 'Board Rules', 'Welfare Schemes'],                     note: null },
  { id: 63, dept: 'other',        name_en: 'Housing Board Test',                                     name_ml: 'ഹൗസിംഗ് ബോർഡ് ടെസ്റ്റ്',                       papers: 1, popular: false, for_ml: 'Kerala State Housing Board Staff',                           topics: ['KSHB Act & Rules', 'Housing Schemes', 'Construction Rules'],                          note: null },
  { id: 64, dept: 'other',        name_en: 'SC Development Department Test',                         name_ml: 'SC ഡെവലപ്‌മെന്റ് ടെസ്റ്റ്',                    papers: 1, popular: false, for_ml: 'SC Development Dept Staff',                                 topics: ['SC/ST Acts', 'Protection of Civil Rights Act', 'Welfare Schemes', 'Atrocities Act'],  note: null },
];

export default function DepartmentalTestsSection() {
  const [activeDept, setActiveDept] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    let list = TESTS;
    if (activeDept !== 'all') list = list.filter(t => t.dept === activeDept);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.name_en.toLowerCase().includes(q) ||
        t.name_ml.includes(q) ||
        t.dept.includes(q) ||
        t.topics.some(tp => tp.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeDept, search]);

  const totalByDept = useMemo(() => {
    const map = {};
    TESTS.forEach(t => { map[t.dept] = (map[t.dept] || 0) + 1; });
    return map;
  }, []);

  return (
    <section id="departmental-tests" className="relative py-24 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="section-label mb-3">Exam Prep</div>
          <h2 className="text-[clamp(28px,4.5vw,50px)] font-[900] tracking-[-0.03em] text-white leading-tight mb-3" style={{ fontFamily: "'Meera', sans-serif" }}>
            ഡിപ്പാർട്ട്‌മെന്റൽ{' '}
            <span className="text-white/40">ടെസ്റ്റുകൾ</span>
          </h2>
          <p className="text-[15px] text-white/50 max-w-[600px]">
            Kerala PSC Departmental Tests — 30 വകുപ്പുകളിലെ 64+ ടെസ്റ്റുകൾ. സിലബസ്, ആർക്ക് ആവശ്യം, പ്രധാന വിഷയങ്ങൾ സഹിതം.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg pointer-events-none">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveDept('all'); setExpanded(null); }}
            placeholder="ടെസ്റ്റ് നാമം, വകുപ്പ്, വിഷയം... (e.g. KSR, Revenue, MOP)"
            className="w-full pl-11 pr-10 py-4 bg-white/[0.05] border border-white/10 rounded-2xl text-[14px] text-white placeholder-white/25 outline-none focus:border-white/25 transition-colors"
          />
          {search && (
            <button onClick={() => { setSearch(''); setExpanded(null); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white border-none bg-transparent cursor-pointer text-lg">✕</button>
          )}
        </div>

        {/* Department Tabs */}
        {!search && (
          <div className="flex gap-2 flex-wrap mb-8">
            {DEPTS.map(d => {
              const count = d.id === 'all' ? TESTS.length : (totalByDept[d.id] || 0);
              const active = activeDept === d.id;
              const color = d.id === 'all' ? '#ffffff' : d.color;
              return (
                <button
                  key={d.id}
                  onClick={() => { setActiveDept(d.id); setExpanded(null); }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all"
                  style={{
                    background: active ? color + '20' : 'rgba(255,255,255,0.04)',
                    color: active ? color : 'rgba(255,255,255,0.4)',
                    outline: active ? `1px solid ${color}40` : 'none',
                  }}
                >
                  <span>{d.icon}</span>
                  <span style={{ fontFamily: "'Meera', sans-serif" }}>{d.label}</span>
                  <span className="opacity-50">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Results count */}
        <div className="text-[11px] text-white/25 mb-5 font-sans">
          {filtered.length} ടെസ്റ്റുകൾ {search ? `"${search}"-ന്` : ''} കണ്ടെത്തി
        </div>

        {/* Test Cards */}
        <div className="flex flex-col gap-2">
          {filtered.map(test => {
            const color = DEPTS.find(d => d.id === test.dept)?.color || '#86868b';
            const deptInfo = DEPTS.find(d => d.id === test.dept);
            const isOpen = expanded === test.id;

            return (
              <div
                key={test.id}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-200"
                style={isOpen ? { outline: `1px solid ${color}30` } : {}}
              >
                {/* Row — click to expand */}
                <button
                  onClick={() => setExpanded(isOpen ? null : test.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left border-none bg-transparent cursor-pointer group"
                >
                  {/* Dept icon */}
                  <div
                    className="w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: color + '18', border: `1px solid ${color}28`, color }}
                  >
                    {deptInfo?.icon || '📋'}
                  </div>

                  {/* Names */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-semibold text-white/85 group-hover:text-white transition-colors leading-snug" style={{ fontFamily: "'Meera', sans-serif" }}>
                        {test.name_ml}
                      </span>
                      {test.popular && (
                        <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded hidden sm:inline" style={{ background: color + '22', color }}>
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-white/30 font-sans mt-0.5 truncate">{test.name_en}</div>
                  </div>

                  {/* Papers */}
                  <div className="text-[10px] font-bold whitespace-nowrap hidden sm:block flex-shrink-0" style={{ color }}>
                    {test.papers} Paper{test.papers > 1 ? 's' : ''}
                  </div>

                  {/* Dept badge */}
                  <div className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg flex-shrink-0 hidden md:block"
                    style={{ background: color + '15', color }}>
                    {deptInfo?.en}
                  </div>

                  {/* Arrow */}
                  <div className="text-white/20 group-hover:text-white/50 transition-all flex-shrink-0"
                    style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}>
                    →
                  </div>
                </button>

                {/* Expanded panel */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-white/[0.06]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      <div className="bg-white/[0.03] rounded-xl p-4">
                        <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color }}>
                          ആർക്ക് ആവശ്യം
                        </div>
                        <div className="text-[13px] text-white/70 leading-relaxed" style={{ fontFamily: "'Meera', sans-serif" }}>
                          {test.for_ml}
                        </div>
                      </div>
                      <div className="bg-white/[0.03] rounded-xl p-4">
                        <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color }}>
                          പ്രധാന വിഷയങ്ങൾ
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {test.topics.map((topic, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded-lg text-white/55 bg-white/[0.05]">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {test.note && (
                      <div className="mt-3 flex items-start gap-2 text-[12px] text-white/50 bg-white/[0.03] rounded-xl px-4 py-3">
                        <span className="flex-shrink-0">💡</span>
                        <span style={{ fontFamily: "'Meera', sans-serif" }}>{test.note}</span>
                      </div>
                    )}
                    <div className="mt-3">
                      <a
                        href="https://www.keralapsc.gov.in/departmental-tests"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold no-underline hover:opacity-80 transition-opacity"
                        style={{ color }}
                      >
                        Kerala PSC ഔദ്യോഗിക വിജ്ഞാപനം →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <div className="text-4xl mb-3">🔍</div>
            <div style={{ fontFamily: "'Meera', sans-serif" }}>"{search}"-ന് ഒരു ടെസ്റ്റും കണ്ടെത്തിയില്ല</div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center mt-12">
          <a
            href="https://www.keralapsc.gov.in/departmental-tests"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 glass-pill rounded-full text-[13px] font-bold text-white/80 no-underline hover:text-white hover:border-white/30 transition-all"
          >
            Kerala PSC ഔദ്യോഗിക സൈറ്റ് — keralapsc.gov.in →
          </a>
        </div>

      </div>
    </section>
  );
}
