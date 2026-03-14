'use client';

import { useState, useMemo } from 'react';

const PURPLE = '#bf5af2';

const NPS_ORDERS = [
  { orderNo: "Circular No.94/2021/Fin Dated 22-10-2021", subject: "Deferred സാലറി തിരികെ നൽകുമ്പോൾ എൻ.പി.എസ് വിഹിതം കുറവ് ചെയ്യുന്നത് സംബന്ധിച്ച്", date: "22-10-2021", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=c7xb8yg3te5vj0q" },
  { orderNo: "Circular No.71/2021/Fin Dated 03-09-2021", subject: "Deferred സാലറി തിരികെ നൽകുമ്പോൾ എൻ.പി.എസ് വിഹിതം കുറവ് ചെയ്യുന്നത് - ഗസറ്റ് വിജ്ഞാപനത്തിന്റെ അടിസ്ഥാനത്തിലുള്ള തുടർ നടപടികൾ", date: "03-09-2021", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=c7xb8ye5vh2sa9z" },
  { orderNo: "Circular No.76/2021/Fin Dated 14-09-2021", subject: "പങ്കാളിത്ത പെൻഷൻ പദ്ധതി - ധനകാര്യ (പെൻഷൻ-എ) വകുപ്പിന്റെ അറിവോ അഭിപ്രായമോ ഇല്ലാതെ ഉത്തരവ് പുറപ്പെടുവിക്കുകയോ നടപടികൾ സ്വീകരിക്കുകയോ ചെയ്യുന്നത് വിലക്കിക്കൊണ്ട് നിർദ്ദേശം", date: "14-09-2021", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=c7xb8ye5vh2sb8y" },
  { orderNo: "GO(Rt) No. 2350/2020/Fin Dated 20-03-2020", subject: "ദേശീയ പെൻഷൻ പദ്ധതി - Error Rectification Module മുഖേന പിൻ‌വലിക്കൽ നടത്തുമ്പോൾ ട്രഷറി ഡയറക്ടറുടെ പേരിൽ അക്കൌണ്ട് തുടങ്ങുന്നതിന് അനുമതി", date: "20-03-2020", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=b8yj0qc7xh2sh2s" },
  { orderNo: "Notice-No-CPRC1/2020/Fin Dated 25-02-2020", subject: "പങ്കാളിത്ത പെൻഷൻ പുനഃപരിശോധന സമിതി - ജീവനക്കാരുടെ അംഗീകൃത സർവ്വീസ് സംഘടനകളുമായി നടത്താൻ ഉദ്ദേശിക്കുന്ന ചർച്ചകളുടെ സമയക്രമം", date: "25-02-2020", type: "Notice", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=b8yj0qb8ye5vf4u" },
  { orderNo: "G.O.(P)No.41/2019/Fin Dated 31-03-2019", subject: "പങ്കാളിത്ത പെൻഷൻ പദ്ധതി - ആശ്വാസ ധനസഹായം അനുവദിക്കുന്നത് കൂടുതൽ വ്യക്തത വരുത്തി ഉത്തരവ്", date: "31-03-2019", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=b8yh2se5vc7xj0q" },
  { orderNo: "G.O.(P)No.25/2019/Fin Dated 07-03-2019", subject: "പങ്കാളിത്ത പെൻഷൻ പദ്ധതി - അന്തർ വകുപ്പ് സ്ഥലം മാറ്റം / ബൈ-ട്രാൻസ്ഫർ / ബൈ-പ്രൊമോഷൻ - KSR Part III പെൻഷനിൽ തുടരാൻ ഓപ്ഷൻ ഫോം ഇല്ലാതെ അനുമതി", date: "07-03-2019", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=b8yh2sc7xj0qa9z" },
  { orderNo: "G.O.(P)No.97/2018/Fin Dated 23-06-2018", subject: "പങ്കാളിത്ത പെൻഷൻ പദ്ധതി - സർവ്വീസിലിരിക്കെ മരണപ്പെടുന്ന ജീവനക്കാരുടെ ആശ്രിതർക്ക് ആശ്വാസ ധനസഹായം - അപേക്ഷകർ സമർപ്പിക്കേണ്ട രേഖകളും നടപടിക്രമങ്ങളും", date: "23-06-2018", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=b8yf4ua9zj0qe5v" },
  { orderNo: "G.O.(P)No.7/2018/Fin Dated 12-01-2018", subject: "NPS - Statutory Pension-ൽ തുടരാനുള്ള Mobility ആനുകൂല്യത്തിന് അർഹതയുള്ളവർ Option Form സമർപ്പിക്കുന്നതിലെ കാലതാമസം ഒഴിവാക്കുന്നതിന് നിർദ്ദേശം", date: "12-01-2018", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=b8yd6wc7xi1ra9z" },
  { orderNo: "Circular No.94/2017/Fin Dated 20-12-2017", subject: "പങ്കാളിത്ത പെൻഷൻ പദ്ധതിയിൽ ഉൾപ്പെട്ട Aided School അധ്യാപകരുടെ പെൻഷൻ വിഹിതം അടവാക്കുന്നതിൽ വ്യക്തത", date: "20-12-2017", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=b8yd6wb8ya9zf4u" },
  { orderNo: "G.O.(P)No.149/2017/Fin Dated 18-11-2017", subject: "ദേശീയ പെൻഷൻ പദ്ധതിയിൽ അംഗമായിരിക്കുന്ന Aided School അദ്ധ്യാപകരുടെ പെൻഷൻ വിഹിതം അടവാക്കുന്നത് - വ്യക്തത ഉത്തരവ്", date: "18-11-2017", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=b8yc7xg3tj0qj0q" },
  { orderNo: "G.O.(P)No.141/2017/Fin Dated 08-11-2017", subject: "ദേശീയ പെൻഷൻ പദ്ധതിയിൽ അംഗമായിരിക്കെ മരണമടയുന്ന ജീവനക്കാരുടെ ആശ്രിതർക്ക് ആശ്വാസ ധനസഹായം - നടപടിക്രമങ്ങൾ", date: "08-11-2017", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=b8yc7xf4ud6wh2s" },
  { orderNo: "Circular No.76/2017/Fin Dated 12-10-2017", subject: "ദേശീയ പെൻഷൻ പദ്ധതി അംഗങ്ങളുടെ വ്യക്തിഗത വിവരങ്ങൾ Update ചെയ്യുന്നത് സംബന്ധിച്ച്", date: "12-10-2017", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=b8yc7xd6wi1ri1r" },
  { orderNo: "Circular No.49/2017/Fin Dated 19-06-2017", subject: "NPS - Service Fortnight - Various activities to be undertaken by HODs", date: "19-06-2017", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=b8yb8ye5vd6wi1r" },
  { orderNo: "Circular No.34/2017/Fin Dated 10-05-2017", subject: "FATCA - Declaration Statement", date: "10-05-2017", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=b8ya9zj0qg3th2s" },
  { orderNo: "G.O.(P)No.43/2017/Fin Dated 03-04-2017", subject: "NPS - Employee contribution from Pay revision arrear", date: "03-04-2017", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=b8ya9zg3te5vb8y" },
  { orderNo: "G.O.(Rt)No.8348/2016/Fin Dated 21-10-2016", subject: "National Pension System - Realization of Backlog Contribution of KSEB Ltd. Employees - Enhancement of EMIs", date: "21-10-2016", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=j0qc7xb8ya9z" },
  { orderNo: "G.O.(Ms)No.353/2016/Fin Dated 01-09-2016", subject: "National Pension System - Judgement in WP(C) No 12341 of 15 - Complied - Orders issued", date: "01-09-2016", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=j0qa9zb8yb8y" },
  { orderNo: "G.O.(P)No.126/2016/Fin Dated 31-08-2016", subject: "Compassionate Financial Assistance to dependents of NPS members who expired while in service - Orders issued", date: "31-08-2016", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=j0qa9za9ze5v" },
  { orderNo: "G.O.(P)No.67/2016/Fin Dated 10-05-2016", subject: "Absorbing SLR employees to regular establishment - Sanction for continuing under KSR Part III pension scheme", date: "10-05-2016", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=i1rg3tf4uf4u" },
  { orderNo: "G.O.(P)No.72/2016/Fin Dated 16-05-2016", subject: "National Pension System in PSUs / Autonomous Bodies / Boards / Universities - Realization of Backlog contributions - Guidelines", date: "16-05-2016", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=i1rg3te5vf4u" },
  { orderNo: "G.O.(P)No.75/2016/Fin Dated 20-05-2016", subject: "National Pension System - Realization of backlog contributions in respect of All India Service Officers recruited to Kerala Cadre", date: "20-05-2016", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=i1rg3td6wc7x" },
  { orderNo: "G.O.(P)No.56/2016/Fin Dated 29-04-2016", subject: "National Pension System - Maintenance and upkeeping of Service Book in respect of State Government Employees under NPS", date: "29-04-2016", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=i1rg3tb8ya9z" },
  { orderNo: "G.O.(P)No.55/2016/Fin Dated 25-04-2016", subject: "National Pension System (NPS) - Realization of backlog contributions for employees covered under NPS deputed to State Government Departments from Autonomous Bodies", date: "25-04-2016", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=i1rf4uh2sg3t" },
  { orderNo: "G.O.(Rt)No.2621/2016/Fin Dated 14-03-2016", subject: "Issue of duplicate PRAN Card - Orders issued", date: "14-03-2016", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=i1rf4ue5ve5v" },
  { orderNo: "Notice - Recovery of NPS Charges", subject: "Notice - Recovery of NPST charge", date: "2015-10-29", type: "Notice", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=i1ra9zh2sb8y" },
  { orderNo: "PFRDA Letter - Portability of PRAN", subject: "PFRDA Letter - Portability of PRAN on change of location or job", date: "2015-09-26", type: "Letter", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sj0qj0qh2s" },
  { orderNo: "NPS - Tax Savings", subject: "Tax Savings through National Pension System", date: "2015-07-28", type: "Notice", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2si1ra9zj0q" },
  { orderNo: "G.O.(P)No.226/2015/Fin Dated 12-06-2015", subject: "National Pension System for State Government Employees and All India Service (Kerala Cadre) Officers - Realization of Regular contribution in respect of deputation", date: "12-06-2015", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sh2sf4uf4u" },
  { orderNo: "PFRDA Letter - Scheme Preference Allocation", subject: "PFRDA Letter to change Scheme Preference Allocation", date: "2015-06-30", type: "Letter", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sh2sf4ud6w" },
  { orderNo: "NPS - Voluntary Contribution Facility", subject: "Facility to Voluntary Contribution in NPS", date: "2015-06-25", type: "Notice", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sh2sf4ua9z" },
  { orderNo: "PFRDA Gazette - Exit & Withdrawal Regulations 2015", subject: "PFRDA (Exits and Withdrawals under NPS) Regulations, 2015 - Gazette", date: "2015-06-24", type: "Gazette", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sh2se5vh2s" },
  { orderNo: "PFRDA - Covering Circular on Exit Regulations", subject: "Covering Circular on Exit Regulations by PFRDA (approved)", date: "2015-06-24", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sh2se5vi1r" },
  { orderNo: "Trustee Bank Contact Details", subject: "Trustee Bank Contact Details - NPS", date: "2015-06-05", type: "Notice", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sg3tj0qa9z" },
  { orderNo: "Circular - NPS Subscriber Registration Form Revision", subject: "Circular - NPS Revision of Subscriber Registration Form", date: "2015-04-08", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sf4ud6wj0q" },
  { orderNo: "Common Subscriber Registration Form and Annexures", subject: "Common Subscriber Registration Form and Annexures", date: "2015-04-08", type: "Notice", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sf4ue5va9z" },
  { orderNo: "G.O.(P)No.96/2015/Fin Dated 24-02-2015", subject: "National Pension System - Realization of regular contribution in respect of deputation cases - All India Service (Kerala Cadre) Officers and State employees", date: "24-02-2015", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2se5vc7xi1r" },
  { orderNo: "SNPSL - Lodging Grievance by Nodal Office", subject: "SNPSL - Lodging Grievance by Nodal Office Against Itself - Procedure", date: "2015-02-25", type: "Notice", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2se5vb8yg3t" },
  { orderNo: "NPS Arrears in SPARK 2015", subject: "NPS Arrears processing in SPARK 2015", date: "2015-02-24", type: "Notice", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2se5vb8yf4u" },
  { orderNo: "G.O.(P)No.25/2015/Fin Dated 14-01-2015", subject: "National Pension System - Realization of backlog contributions - Guidelines and accounting procedures - All India Service (Kerala Cadre) Officers and State employees", date: "14-01-2015", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sc7xj0qj0q" },
  { orderNo: "Important Notice - NPS Email & Mobile Update", subject: "NPS Notice - Updating email id and mobile number of NPS Subscribers", date: "2015-01-17", type: "Notice", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sc7xj0qe5v" },
  { orderNo: "Circular No.106/2014/Fin Dated 16-12-2014", subject: "Implementation of National Pension System - Applicability of the Scheme - Clarifications Issued", date: "16-12-2014", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sc7xc7xj0q" },
  { orderNo: "G.O.(P)No.516/2014/Fin Dated 24-11-2014", subject: "National Pension System - Mobility from Central Government Service to State Government Service - Applicability of KSR Part III pension scheme", date: "24-11-2014", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sb8yh2sf4u" },
  { orderNo: "G.O.(P)No.488/2014/Fin Dated 11-11-2014", subject: "National Pension System - Employees covered under NPS deputed to State Government Departments from Autonomous Bodies, Central Government and other State Governments", date: "11-11-2014", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sb8ya9zi1r" },
  { orderNo: "G.O.(Ms)No.465/2014/Fin Dated 27-10-2014", subject: "National Pension System - Deployment of Personnel from Treasury Department to Finance NPS Cell - Extension - Sanction accorded", date: "27-10-2014", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sa9zj0qc7x" },
  { orderNo: "G.O.(P)No.458/2014/Fin Dated 20-10-2014", subject: "Designating Additional/Joint Secretary in charge of NPSC as State Nodal Officer (SNO)", date: "20-10-2014", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sa9zh2sf4u" },
  { orderNo: "G.O.(P)No.440/2014/Fin Dated 13-10-2014", subject: "National Pension System - Crediting of arrears of Pay and Dearness Allowances to General Provident Fund - Clarification", date: "13-10-2014", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sa9zg3te5v" },
  { orderNo: "Circular No.91/2014/Fin Dated 13-10-2014", subject: "National Pension System - Delay in registration of employees coming under NPS - Instructions", date: "13-10-2014", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sa9zg3th2s" },
  { orderNo: "G.O.(P)No.398/2014/Fin Dated 19-09-2014", subject: "National Pension System - Extension of Mobility to Kerala High Court employees - Orders issued", date: "19-09-2014", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=h2sa9zb8yh2s" },
  { orderNo: "G.O.(P)No.279/2014/Fin Dated 14-07-2014", subject: "National Pension System - Mobility to State employees appointed on or before 31/03/2013 and reappointed in various institutions", date: "14-07-2014", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3ti1re5vg3t" },
  { orderNo: "G.O.(P)No.210/2014/Fin Dated 05-06-2014", subject: "National Pension System - Personnel appointed on or before 31-03-2013 granted extension of joining time - Retained in Kerala pension scheme", date: "05-06-2014", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3th2sf4ud6w" },
  { orderNo: "Circular No.51/2014/Fin Dated 29-05-2014", subject: "National Pension System - Submission of PRAN applications to NSDL - Revised procedure", date: "29-05-2014", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3th2sc7xf4u" },
  { orderNo: "Circular No.49/2014/Fin Dated 27-05-2014", subject: "National Pension System - Delay in registration of employees coming under NPS - Instructions issued", date: "27-05-2014", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3th2sc7xb8y" },
  { orderNo: "G.O.(P)No.152/2014/Fin Dated 29-04-2014", subject: "Implementation of National Pension System in Local Self Government Institutions - Orders", date: "29-04-2014", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3tg3tb8yh2s" },
  { orderNo: "G.O.(Ms)No.135/2014/Fin Dated 08-04-2014", subject: "National Pension System - Creation of Finance NPS Cell - Deployment of Personnel from Treasury - Orders issued", date: "08-04-2014", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3tg3ta9zd6w" },
  { orderNo: "Circular No.24/2014/Fin Dated 14-03-2014", subject: "National Pension System - Various circulars and clarifications", date: "14-03-2014", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3tf4ue5vc7x" },
  { orderNo: "Guidelines - National Pension System", subject: "Guidelines - National Pension System for Kerala Government Employees", date: "2014", type: "Guidelines", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3tf4ud6we5v" },
  { orderNo: "Circular No.19/2014/Fin Dated 25-02-2014", subject: "National Pension System - Various instructions and procedures", date: "25-02-2014", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3te5vj0qa9z" },
  { orderNo: "G.O.(P)No.81/2014/Fin Dated 24-02-2014", subject: "National Pension System - Revised accounting procedure for NPS contributions", date: "24-02-2014", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3te5vi1rb8y" },
  { orderNo: "Circular No.07/2014/Fin Dated 06-02-2014", subject: "National Pension System - Clarifications and instructions for implementation", date: "06-02-2014", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3te5va9zj0q" },
  { orderNo: "G.O.(P)No.408/2013/Fin Dated 27-08-2013", subject: "National Pension System - Provisions and accounting procedures for NPS contributions", date: "27-08-2013", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3tc7xi1rh2s" },
  { orderNo: "G.O.(P)No.622/2013/Fin Dated 19-12-2013", subject: "National Pension System - Further provisions and orders for State Government Employees", date: "19-12-2013", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3tc7xi1rf4u" },
  { orderNo: "G.O.(Ms)No.496/2013/Fin Dated 28-09-2013", subject: "National Pension System - Administrative and operational orders", date: "28-09-2013", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3ta9za9zj0q" },
  { orderNo: "G.O.(P)No.495/2013/Fin Dated 28-09-2013", subject: "National Pension System - Provisions for State Government Employees and All India Service Officers", date: "28-09-2013", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=g3ta9zb8ya9z" },
  { orderNo: "G.O.(P)No.208/2013/Fin Dated 07-05-2013", subject: "National Pension System - Implementation for Kerala State employees - Initial provisions and orders", date: "07-05-2013", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=f4ue5vb8yi1r" },
  { orderNo: "G.O.(P)No.209/2013/Fin Dated 07-05-2013", subject: "National Pension System - Accounting procedures and financial provisions for NPS implementation", date: "07-05-2013", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=f4ue5vb8yj0q" },
  { orderNo: "G.O.(P)No.149/2013/Fin Dated 03-04-2013", subject: "National Pension System - Provisions and implementation orders for State employees", date: "03-04-2013", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=f4ud6wa9zg3t" },
  { orderNo: "G.O.(P)No.20/2013/Fin Dated 07-01-2013", subject: "National Pension System - Introductory orders and provisions for new appointments", date: "07-01-2013", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=e5vi1rg3td6w" },
  { orderNo: "G.O.(P)No.441/2012/Fin Dated 08-08-2012", subject: "National Pension System - Implementation framework and initial orders for Kerala State", date: "08-08-2012", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=e5vd6we5vi1r" },
  { orderNo: "Circular No.68/2011/Fin Dated 12-10-2011", subject: "National Pension System - Initial circular and implementation guidelines for Kerala State Employees", date: "12-10-2011", type: "Circular", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=d6wc7xh2se5v" },
  { orderNo: "G.O.(P)No.298/2010/Fin Dated 24-05-2010", subject: "National Pension System - Foundational orders for implementation in Kerala - Initial framework", date: "24-05-2010", type: "GO", url: "https://finance.kerala.gov.in/includeWeb/fileViewer.jsp?dId=c7xc7xg3td6w" },
];

const TYPE_COLORS = {
  GO: { bg: 'rgba(48,209,88,0.12)', color: '#30d158', label: 'GO' },
  Circular: { bg: 'rgba(100,210,255,0.12)', color: '#64d2ff', label: 'Circular' },
  Notice: { bg: 'rgba(255,159,10,0.12)', color: '#ff9f0a', label: 'Notice' },
  Letter: { bg: 'rgba(255,69,58,0.12)', color: '#ff453a', label: 'Letter' },
  Gazette: { bg: 'rgba(191,90,242,0.12)', color: '#bf5af2', label: 'Gazette' },
  Guidelines: { bg: 'rgba(191,90,242,0.12)', color: '#bf5af2', label: 'Guidelines' },
};

const ALL_TYPES = ['All', 'GO', 'Circular', 'Notice', 'Letter', 'Gazette', 'Guidelines'];

function OrderRow({ order }) {
  const typeStyle = TYPE_COLORS[order.type] || TYPE_COLORS.GO;
  // Only direct Supabase-hosted PDFs get the download button
  const isDirectPdf = order.pdf_url && !order.pdf_url.includes('finance.kerala.gov.in');

  const cardContent = (
    <div className="flex items-start gap-4 p-4 rounded-xl transition-all"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base mt-0.5"
        style={{ background: typeStyle.bg }}>
        📄
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
            style={{ background: typeStyle.bg, color: typeStyle.color }}>
            {typeStyle.label}
          </span>
          {order.date && <span className="text-[10px] text-white/30">{order.date}</span>}
        </div>
        <div className="text-xs font-bold text-white/80 mb-0.5 leading-snug">{order.orderNo}</div>
        <div className="text-[11px] text-white/50 leading-relaxed line-clamp-2"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}>
          {order.subject}
        </div>
        <div className="mt-2 flex items-center gap-3">
          {isDirectPdf && (
            <a href={order.pdf_url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[10px] font-bold no-underline px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(48,209,88,0.15)', color: '#30d158' }}>
              ⬇ Download PDF
            </a>
          )}
          {order.url && (
            <a href={order.url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-[10px] text-white/30 no-underline hover:text-white/60 transition-colors">
              Source ↗
            </a>
          )}
          {!isDirectPdf && !order.url && (
            <span className="text-[10px] text-white/20">PDF not available</span>
          )}
        </div>
      </div>
    </div>
  );

  return cardContent;
}

/* previewMode: shows first `previewLimit` items + "Show More" link, no search/filter */
export default function NpsGovOrders({ previewMode = false, previewLimit = 5 }) {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NPS_ORDERS.filter(o => {
      const matchType = activeType === 'All' || o.type === activeType;
      const matchQuery = !q ||
        o.orderNo.toLowerCase().includes(q) ||
        o.subject.toLowerCase().includes(q) ||
        o.date.toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [query, activeType]);

  if (previewMode) {
    const preview = NPS_ORDERS.slice(0, previewLimit);
    return (
      <div>
        <div className="flex flex-col gap-2">
          {preview.map((order, i) => <OrderRow key={i} order={order} />)}
        </div>
        <a
          href="/nps/orders"
          className="mt-5 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold no-underline transition-all hover:-translate-y-0.5"
          style={{ background: `${PURPLE}10`, color: PURPLE, border: `1px solid ${PURPLE}25` }}
        >
          എല്ലാ ഉത്തരവുകളും കാണൂ — {NPS_ORDERS.length} Orders
          <span className="text-base">→</span>
        </a>
        <p className="mt-4 text-[10px] text-white/25 text-center">
          Source: Kerala Finance Department · finance.kerala.gov.in
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-4">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by order number or subject..."
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white/20 transition-colors"
          style={{ fontFamily: 'var(--font-noto-malayalam), sans-serif' }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-lg leading-none transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Type filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_TYPES.map(t => {
          const isActive = activeType === t;
          const style = t !== 'All' ? TYPE_COLORS[t] : null;
          return (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all"
              style={isActive
                ? { background: style ? style.bg : `${PURPLE}15`, color: style ? style.color : PURPLE, border: `1px solid ${style ? style.color : PURPLE}40` }
                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p className="text-xs text-white/35 mb-4">
        {filtered.length} of {NPS_ORDERS.length} orders
        {query ? ` matching "${query}"` : ''}
      </p>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-white/35">
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm">No orders found. Try a different search.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((order, i) => <OrderRow key={i} order={order} />)}
        </div>
      )}

      <p className="mt-6 text-[10px] text-white/25 text-center">
        Source: Kerala Finance Department · finance.kerala.gov.in
      </p>
    </div>
  );
}
