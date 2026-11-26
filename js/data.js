/* All content used by js/app.js lives here – edit text, fees, links etc. in this file.
 *
 * Comparison source: "4U comparision Broucher A! Upgrade.pdf".
 * Row arrays are kept in the PDF's column order  [Amrita, Amity, VIT, SMU]  so they can be checked
 * line-by-line against the document; app.js re-orders them to the site's order (see `cols`).
 */
(function () {
  var Y = 'Yes';
  var N = '—';

  window.APP_DATA = {
    /* ---------- universities (form chips, links section) ---------- */
    universities: [
      { id: 'vit', short: 'VIT', name: 'VIT University', logo: 'logos/vit.webp', prospectusUrl: 'prospectus/VIT-MBA-Brochure.pdf',
        courses: [
        'MBA – Marketing',
        'MBA – Business Analytics',
        'MBA – Human Resource',
        'MBA – Operations and Supply Chain',
        'MBA – Finance',
        'MBA – General Management',
      ]
      },
      { id: 'amrita', short: 'Amrita', name: 'Amrita Vishwa Vidyapeetham', logo: 'logos/amrita-white.svg', prospectusUrl: 'prospectus/Amrita-MBA-Brochure.pdf',
        courses: [
        'MBA – Artificial Intelligence',
        'MBA – Business Analytics',
        'MBA – FinTech',
        'MBA – Environmental, Social and Governance (ESG)',
        'MBA – International Finance and Accounting (ACCA)',
        'MBA – General Management',
        'MBA – Marketing',
        'MBA – Finance',
        'MBA – Operations',
        'MBA – Human Resources',
      ]
      },
      { id: 'amity', short: 'Amity', name: 'Amity University Online', logo: 'logos/amity-color.svg', prospectusUrl: 'prospectus/Amity-MBA-Prospectus.pdf',
        courses: [
        'MBA – Finance & Accounting Management',
        'MBA – Information Technology Management',
        'MBA – Global Finance Market',
        'MBA – Digital Marketing Management',
        'MBA – Insurance Management',
        'MBA – Business Analytics',
        'MBA – International Finance (ACCA)',
        'MBA – Digital Entrepreneurship',
        'MBA – Marketing & Sales Management',
        'MBA – Human Resource Management',
        'MBA – International Business Management',
        'MBA – Human Resources Analytics',
        'MBA – Retail Management',
        'MBA – Hospitality Management',
        'MBA – Entrepreneurship & Leadership Management',
        'MBA – Production & Operations Management',
        'MBA – Data Science',
        'MBA – General Management',
      ]
      },
      { id: 'manipal', short: 'Manipal', name: 'Manipal Academy of Higher Education', logo: 'logos/manipal.png', prospectusUrl: 'https://onlinemanipal.mba/',
        courses: [
        'MBA – Marketing',
        'MBA – Finance',
        'MBA – Human Resources',
        'MBA – Business Analytics',
        'MBA – Operations Management',
        'MBA – Digital Marketing',
        'MBA – Healthcare Management',
        'MBA – Information Technology',
        'MBA – Supply Chain Management',
        'MBA – Banking & Insurance',
      ]
      }
    ],


    /* ---------- comparison page ---------- */
    cmp: {
      SOURCE_ORDER: ['amrita', 'amity', 'vit', 'manipal'],

      /* columns in the order the site shows them */
      cols: [
        { id: 'vit', label: 'VIT', theme: 'vit' },
        { id: 'amrita', label: 'Amrita', theme: 'amrita' },
        { id: 'amity', label: 'Amity', theme: 'amity' },
        { id: 'manipal', label: 'SMU', theme: 'manipal' }
      ],

      /* the jump-chips under the heading (ids match the sections in app.js) */
      sections: [
        { id: 'status', short: 'Status' },
        { id: 'specialisations', short: 'Specialisations' },
        { id: 'curriculum', short: 'Curriculum' },
        { id: 'eligibility', short: 'Eligibility' },
        { id: 'exams', short: 'Exams' },
        { id: 'placement', short: 'Placement' },
        { id: 'fees', short: 'Fees' },
        { id: 'regulatory', short: 'Checks' },
        { id: 'choose', short: 'How to choose' },
        { id: 'links', short: 'Official links' }
      ],

      /* 1. status – keyed by university id */
      status: {
        vit: { name: 'VIT', type: 'Deemed-to-be University', claim: 'UGC recognised; NAAC A++; ranked among top universities in India' },
        amrita: { name: 'Amrita', type: 'Deemed-to-be University', claim: 'UGC recognised; NAAC A++; ranked among top universities in India' },
        amity: { name: 'Amity', type: 'Private University', claim: 'UGC recognised; NAAC accredited; global education' },
        manipal: { name: 'Sikkim Manipal (SMU)', type: 'Private University', claim: 'UGC recognised; NAAC accredited; globally ranked' }
      },

      /* 2. specialisations  [label, Amrita, Amity, VIT, SMU] */
      specialisations: [
        ['Marketing', Y, Y, Y, Y],
        ['Finance', Y, Y, Y, Y],
        ['Human Resources', Y, Y, Y, Y],
        ['Business Analytics', Y, Y, Y, Y],
        ['Operations Management', Y, Y, Y, Y],
        ['Digital Marketing', N, Y, Y, Y],
        ['International Business', N, Y, N, N],
        ['Data Science', N, Y, 'Analytics electives', N],
        ['Healthcare Management', N, Y, N, Y],
        ['Information Technology', N, Y, N, Y],
        ['Supply Chain Management', N, Y, Y, Y],
        ['Entrepreneurship', N, Y, N, N],
        ['Banking & Insurance', N, N, N, Y],
        ['International Finance', Y, Y, N, N],
        ['AI / FinTech / ESG', Y, 'Selected pathways', 'Analytics electives', N]
      ],
      specialisationsNote: 'Note: “Yes”, dashes and pathway descriptions reflect the original comparison. Confirm the current specialisation list and availability for the 2027 intake.',

      /* 3. curriculum  [semester, Amrita, Amity, VIT, SMU] */
      curriculum: [
        ['I', 'Management, HR, Marketing, Organisational Behaviour', 'Managerial Economics, Statistics, Accounting, Marketing', 'Principles of Management, Economics, Accounting, Data Analytics', 'Management, Economics, Accounting, Business Communication'],
        ['II', 'Business Finance, Operations, Data-driven Decisions', 'Business Law, Research Methods, Finance, HR', 'HR, Marketing, Operations, Strategic Management, Finance', 'Marketing, Finance, HR, Operations'],
        ['III', 'International Business, Business Analytics, Electives', 'Specialisation papers, electives', 'Six elective courses', 'Specialisation papers'],
        ['IV', 'ESG, Project, Research Methods, Electives', 'Major Project, AI Tools, Digital Marketing, Electives', 'Electives and Project', 'Advanced specialisation papers and project']
      ],
      curriculumNote: 'Representative subjects shown in the source comparison. This is a summary, not the complete 2027 syllabus.',

      /* 4. eligibility  [requirement, Amrita, Amity, VIT, SMU] */
      eligibility: [
        ['Basic qualification', "Bachelor's degree", "Bachelor's degree", "Bachelor's degree", "Recognised bachelor's degree"],
        ['Minimum marks', '50%', 'Check category-specific criteria', '50%; 45% for SC/ST', 'Check current admission rules'],
        ['Work experience', 'Not compulsory', 'Not compulsory', 'Not compulsory', 'Not compulsory'],
        ['Entrance exam', 'Not mandatory', 'Generally not mandatory', 'Not specified as mandatory on online programme page', 'Not specified as mandatory on online programme page'],
        ['Final-year students', 'May apply', 'Subject to rules', 'Confirm', 'Confirm']
      ],
      eligibilityAdvice: 'Ask for the latest eligibility circular and intake-specific rules before counselling or accepting applications.',

      /* 5. exams  [particular, Amrita, Amity, VIT, SMU] */
      exams: [
        ['Continuous assessment', Y, Y, Y, Y],
        ['Assignments', Y, Y, Y, Y],
        ['Online classes', Y, Y, 'Live + recorded', Y],
        ['End-semester exams', 'Online', 'Online', 'Offline examination centres', 'Online'],
        ['Remote proctoring', Y, 'Yes, subject to exam rules', 'Published FAT is centre-based', 'Online examination system'],
        ['Four semester examinations', Y, Y, Y, Y],
        ['2027 timetable', 'Awaited', 'Awaited', 'Awaited', 'Awaited']
      ],

      /* 6. placement  [support area, Amrita, Amity, VIT, SMU] */
      placement: [
        ['Career guidance', Y, Y, 'Programme support', Y],
        ['Placement assistance', Y, Y, 'Verify online MBA-specific service', Y],
        ['Industry interaction', 'Grant Thornton partnerships', 'Industry partners', 'VIT faculty & industry-oriented electives', 'Industry-oriented curriculum'],
        ['Alumni network', Y, Y, Y, Y],
        ['International exposure', 'Study-abroad opportunities', 'International learning options', 'Academic network', 'Manipal network']
      ],
      placementWarning: 'Placement assistance is not a job guarantee. Request the placement report specifically for the Online MBA programme; do not rely solely on regular campus MBA placement figures.',

      /* 7. fees */
      fees: {
        intro: 'Fee amounts below are taken from the uploaded comparison and may not include every fee, tax, scholarship or revised 2027 charge.',
        rows: {
          amrita: { registration: ['Registration: ₹700'], semester: '₹44,000', total: '₹1,76,000', other: 'Exam fee: ₹2,750 per semester', totalNumber: 176000, lakh: '₹1.76 lakh' },
          vit: { registration: ['Registration: ₹10,000', 'Application: ₹1,200'], semester: '₹40,000', total: '₹1,60,000', other: 'Confirm additional exam / other charges', totalNumber: 160000, lakh: '₹1.60 lakh' },
          amity: { registration: ['Not listed separately'], semester: '₹56,300', total: '₹2,25,200', other: 'One-time payment offer in source: ₹2,07,000', totalNumber: 225200, lakh: '₹2.25 lakh', offer: 'One-time offer: ₹2.07 lakh' },
          manipal: { registration: ['Not listed separately'], semester: '₹27,000', total: '₹1,10,000', other: 'Confirm other charges and payment schedule', totalNumber: 110000, lakh: '₹1.10 lakh' }
        }
      },

      /* 8. checks / 9. how to choose */
      regulatoryIntro: 'Use the university’s official website to obtain the current Online MBA prospectus and admission details for 2027. Verify programme recognition and approval against the latest official records before enrolment.',
      verificationChecklist: [
        'UGC-DEB approved programme list',
        'University Grants Commission (UGC)',
        'AICTE, where applicable',
        'Current university prospectus, fee schedule, eligibility rules and examination policy'
      ],
      howToChoose: 'Compare your preferred specialisation, total payable fee, exam mode and centre requirements, flexibility for working learners, career support, and the latest programme-specific recognition. A lower fee or a broader specialisation list alone should not determine your decision.',
      disclaimer: 'This page is an edited presentation of a comparison document. It is not an official publication of any university. Details are indicative and should be independently verified with the universities for the 2027 admission cycle.',

      /* 10. official links (from the PDF) */
      officialLinks: {
        amrita: { name: 'Amrita Vishwa Vidyapeetham', programme: 'MBA programme & prospectus', admission: 'Amrita Online portal', url: 'https://onlineamrita.com/' },
        amity: { name: 'Amity University Online', programme: 'Online MBA programme page', admission: 'Amity Online', url: 'https://amityonline.com/master-of-business-administration-online' },
        vit: { name: 'Vellore Institute of Technology – VIT Online', programme: 'Online MBA programme', admission: 'MBA admission / application', url: 'https://vitonline.in/mba/' },
        manipal: { name: 'Sikkim Manipal University – Online Manipal', programme: 'Online MBA programme page', admission: 'Online Manipal portal', url: 'https://onlinemanipal.mba/' }
      }
    }
  };
})();
