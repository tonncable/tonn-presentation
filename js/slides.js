/* ============================================================
   slides.js — all 62 slides as data (uses window.T templates)
   ============================================================ */
(function () {
  const T = window.T;
  const S = [];
  const add = (theme, navTitle, fn) => S.push({ theme, navTitle, render: fn });

  /* ===== PART 1 · COMPANY (1–16) ===== */

  add('dark', 'Get Wired', () => T.title({
    bg: 'image1.png', tag: 'Factory Visit · University Talk',
    sub: "Inside Tonn Cable — one of Malaysia's fastest-growing power cable manufacturers.",
    foot: 'Tonn Cable Sdn Bhd · Market leadership since 2002'
  }));

  add('light', 'Who We Are', () => T.photoSplit({
    img: 'image3.jpeg', badge: 'Beranang, Selangor',
    kicker: 'Cable Manufacturer · Malaysia',
    title: 'Quality power cables,<br>trusted across Asia.',
    body: 'Tonn Cable delivers high-quality power cables with excellent service and reliable after-sales support — supplying the local market and exporting across Asia and the Middle East.',
    points: ['Certified by SIRIM Malaysia & TÜV SÜD PSB Singapore', 'Listed with JKR & the Energy Commission of Malaysia', 'Serving commercial, industrial & residential projects']
  }));

  add('light', 'By the Numbers', () => T.stats({
    kicker: 'Market leadership since 2002', title: 'The scale behind the cable.',
    stats: [
      { count: 6000, label: 'Tonnes of annual production' },
      { count: 15089300, label: 'Metres of cable produced in 2025' },
      { count: 470, plus: true, label: 'Projects delivered' },
      { count: 24, label: 'Years of experience' }
    ],
    note: 'From homes to hospitals, data centres to transit lines — Tonn Cable powers Malaysia’s landmark projects.'
  }));

  add('light', 'Project References', () => T.photoCards({
    kicker: 'Project references', title: 'Powering Malaysia’s landmarks.', cols: 4,
    cards: [
      { img: 'image14.png', head: 'Merdeka 118', desc: 'Commercial building' },
      { img: 'image13.png', head: 'Pavilion Bukit Jalil', desc: 'Commercial building' },
      { img: 'image10.png', head: 'YTL Kulai Data Center', desc: 'Data centre' },
      { img: 'image16.png', head: 'Hospital UKM', desc: 'Government building' },
      { img: 'image15.png', head: 'MRT Sungai Buloh Station', desc: 'Infrastructure' },
      { img: 'image12.png', head: 'Sg Sireh Water Treatment Plant', desc: 'Water treatment' },
      { img: 'image11.png', head: 'Ministry of Home Affairs', desc: 'Government building' }
    ]
  }));

  add('light', 'Our Advantages', () => T.iconRows({
    kicker: 'Tonn Cable Sdn Bhd', title: 'Our advantages.',
    rows: [
      { icon: 'pin', head: 'Strategic location', desc: 'Our factory sits just 40 km from KL city centre in central Malaysia, with a warehouse in East Malaysia (Kuching, Sarawak).' },
      { icon: 'shield', head: 'Quality assurance', desc: 'ISO 9001 accredited Quality Management System by SIRIM — affirming our commitment to rigorous quality standards.' },
      { icon: 'leaf', head: 'Sustainable', desc: 'Member of the SIRIM Eco-Labelling Scheme, certifying our dedication to producing environmentally friendly products.' }
    ]
  }));

  add('light', 'Milestones 2002–06', () => T.timeline({
    kicker: 'Tonn Cable Sdn Bhd', title: 'Our key milestones.',
    events: [
      { year: '2002', text: 'Incorporated with a 15,000 sq.ft land area.' },
      { year: '2003', text: 'PVC insulated cable production begins; certified by SIRIM & Suruhanjaya Tenaga.' },
      { year: '2005', text: 'Expanded to a new 50,000 sq.ft factory.' },
      { year: '2006', text: 'Expanded product range to PVC & XLPE armoured cables.' }
    ]
  }));

  add('light', 'Milestones 2007–10', () => T.timeline({
    kicker: 'Tonn Cable Sdn Bhd', title: 'Our key milestones.',
    events: [
      { year: '2007', text: 'Awarded Malaysia Top 50 Enterprise by the Ministry of Trade.' },
      { year: '2008', text: 'Began producing data & communication cable.' },
      { year: '2009', text: 'Expanded into the Middle East market.' },
      { year: '2010', text: 'TÜV SÜD PSB certified; entered the Singapore market.' }
    ]
  }));

  add('light', 'Milestones 2013–17', () => T.timeline({
    kicker: 'Tonn Cable Sdn Bhd', title: 'Our key milestones.',
    events: [
      { year: '2013', text: 'Approved by Brunei DES.' },
      { year: '2014', text: 'Awarded SNI certification (Indonesia).' },
      { year: '2015', text: 'Moved to a new 250,000 sq.ft factory; began producing aluminium cable.' },
      { year: '2017', text: 'New copper upcasting plant; Top 50 Enterprise, Sin Chew Excellence & ISO 9001:2015.' }
    ]
  }));

  add('light', 'Milestones 2019–25', () => T.timeline({
    kicker: 'Tonn Cable Sdn Bhd', title: 'Our key milestones.',
    events: [
      { year: '2019', text: 'Obtained TNB Sijil Guna Pakai (SGP).' },
      { year: '2023', text: 'Sarawak Energy certification; established a warehouse in Kuching.' },
      { year: '2024', text: 'Began medium voltage cable; SIRIM Eco-Label & SESB certification.' },
      { year: '2025', text: 'Approved for the SESCO system.' }
    ]
  }));

  add('light', 'Vision & Mission', () => T.twoBig({
    kicker: 'Tonn Cable Sdn Bhd', title: 'Vision & mission.',
    items: [
      { label: 'Vision', text: 'To be the leading power cable manufacturer in Asia.' },
      { label: 'Mission', text: 'To produce world-class quality power cable at a competitive selling price.' }
    ]
  }));

  add('light', 'Sustainability', () => T.quote({
    kicker: 'Sustainability', title: 'Lowering our footprint.',
    body: 'At Tonn Cable we are committed to reducing our environmental impact. Our factory runs on solar panels that cut energy use and carbon footprint, and we participate in the SIRIM Eco-Labelling Scheme — certifying that our materials are environmentally responsible and compliant with green standards.',
    quote: '“Our goal is to produce cables that are safe, reliable, and environmentally responsible.”',
    img: 'image3.jpeg'
  }));

  add('light', 'Location', () => T.locations({
    kicker: 'Tonn Cable Sdn Bhd', title: 'Where to find us.',
    places: [
      { tag: 'Factory & HQ', name: 'Beranang, Selangor', address: 'Lot 1, Jalan Perusahaan 5, Kawasan Perusahaan Beranang, 43700 Beranang, Selangor, Malaysia.' },
      { tag: 'Sarawak Warehouse', name: 'Kuching, Sarawak', address: 'Lot 3039 & 3040, Block 12, Lorong 6G, Mutiara Tabuan Light Industrial Park, Jalan Setia Raja, 93350 Kuching.' },
      { tag: 'Singapore Sales Office', name: 'Raffles Place', address: '1 Philip Street, Royal One Phillip, #09-00, 048692 Singapore.' }
    ]
  }));

  add('light', 'Product Range', () => T.grid({
    kicker: 'What we make', title: 'Our product range.',
    items: ['Low Voltage Power Cables (CU/AL)', 'Medium Voltage Power Cables', 'Aerial Bundled Cables (ABC)', 'Fire Resistant (FR) Cables', 'Flame Retardant (FRT) Cables', 'Solar & DC Cables', 'Instrumentation & Network', 'Copper & Aluminium Tape', 'Bare Conductors']
  }));

  add('light', 'Quality Control', () => T.photoCards({
    kicker: 'Quality control', title: 'Testing of cables.', cols: 4,
    cards: [
      { img: 'image45.jpeg', head: 'Conductor Resistance Test' },
      { img: 'image46.jpeg', head: 'Tensile Strength & Elongation' },
      { img: 'image47.jpeg', head: 'Insulation Resistance Test' },
      { img: 'image48.jpeg', head: 'Flame Test' }
    ]
  }));

  add('light', 'Certificates I', () => T.logos({
    kicker: 'Recognitions & certificates', title: 'Certified & approved.', cols: 5,
    items: [
      { img: 'image49.jpeg', name: 'ISO 9001:2015 QMS' },
      { img: 'image50.jpeg', name: 'SIRIM Malaysia' },
      { img: 'image51.png', name: 'BOMBA Malaysia' },
      { img: 'image52.jpeg', name: 'Jabatan Kerja Raya (JKR)' },
      { img: 'image53.jpeg', name: 'SIRIM Eco-Label' }
    ]
  }));

  add('light', 'Certificates II', () => T.logos({
    kicker: 'Recognitions & certificates', title: 'Trusted by the grid.', cols: 5,
    items: [
      { img: 'image54.png', name: 'Tenaga Nasional Berhad (TNB)' },
      { img: 'image55.jpeg', name: 'Suruhanjaya Tenaga' },
      { img: 'image56.jpeg', name: 'Sabah Electricity (SESB)' },
      { img: 'image57.png', name: 'Sarawak Energy' },
      { img: 'image58.png', name: 'TÜV SÜD PSB Singapore' }
    ]
  }));

  /* ===== PART 2 · CABLE BASICS (17–31) ===== */

  add('dark', 'Cable 101', () => T.divider({
    bg: 'image60.png', eyebrow: 'Part Two', title: 'Cable, explained.',
    sub: 'From what a cable is, to what’s inside, to how to choose the right one.'
  }));

  add('dark', 'A Quick Question', () => T.divider({
    bg: 'image74.png', eyebrow: 'Let’s test you', title: 'How much do you<br>know about cable?'
  }));

  add('light', 'Voltage Classes', () => T.voltage({
    kicker: 'Voltage classification in electricity', title: 'Four levels of voltage.',
    tiers: [
      { abbr: 'ELV', name: 'Extra Low Voltage', range: 'AC ≤ 50V / DC ≤ 120V', note: 'Safe to touch.', examples: 'Phone charger, LED' },
      { abbr: 'LV', name: 'Low Voltage', range: '50V – 1,000V', note: 'Shock risk.', examples: 'Home mains (230V MY)' },
      { abbr: 'MV', name: 'Medium Voltage', range: '1kV – 33kV', note: 'Trained personnel only.', examples: 'Factories, substations' },
      { abbr: 'HV', name: 'High Voltage', range: '> 33kV', note: 'Extremely dangerous.', examples: 'Transmission lines' }
    ]
  }));

  add('dark', 'What is a Cable?', () => T.divider({
    bg: 'image60.png', eyebrow: 'The basics', title: 'What is a cable?'
  }));

  add('light', 'Definition', () => T.bigText({
    kicker: 'In one sentence',
    text: 'A cable is a group of wires that <em>carry electricity safely</em> from one place to another.'
  }));

  add('light', 'Inside a Cable', () => T.cable3d({
    kicker: 'Anatomy', title: 'What’s inside a power cable?',
    layers: [
      { kind: 'sheath', name: 'Sheath', material: 'PVC — weather, UV & chemical protection' },
      { kind: 'armour', name: 'Armour', material: 'Steel / aluminium wire — physical protection' },
      { kind: 'insulation', name: 'Insulation', material: 'PVC / XLPE — prevents shock & short circuit' },
      { kind: 'conductor', name: 'Conductor', material: 'Copper / aluminium — carries the current' }
    ]
  }));

  add('light', 'FR Cable & Mica', () => T.photoSplit({
    img: 'image74.png', side: 'right', badge: 'Fire Resistant (FR) Cable',
    kicker: 'Fire resistant cable', title: 'What does the mica tape do?',
    body: 'FR cables have a mica tape layer wrapped around the conductor. When fire strikes, normal insulation melts — but mica holds.',
    points: ['Mica tape resists ~750–1000°C', 'Forms a protective barrier around the conductor', 'Circuit keeps working for 30 / 60 / 120 minutes']
  }));

  add('light', '5 Golden Rules', () => T.points({
    kicker: 'Cable selection', title: '5 golden rules of cable selection.', cols: 3,
    items: [
      { no: '01', head: 'Voltage & Load', desc: ['Operating voltage', 'Current / load capacity'] },
      { no: '02', head: 'Environment', desc: ['Temperature, moisture, chemicals', 'Must match site conditions'] },
      { no: '03', head: 'Installation Method', desc: ['Tray, wall, or conduit', 'Affects heat dissipation'] },
      { no: '04', head: 'Fire Safety', desc: ['Use LSZH for public areas', 'Low smoke & non-toxic'] },
      { no: '05', head: 'Budget vs Lifespan', desc: ['Initial cost vs durability', 'Long-term cost efficiency'] }
    ]
  }));

  add('light', 'PVC vs SWA', () => T.comparison({
    kicker: 'Choosing the right cable', title: 'PVC indoor vs. steel wire armoured.',
    a: { head: 'Indoor PVC Cable', sub: 'CU/PVC', points: ['Office, ceiling, wall', 'Lightweight & flexible', 'Easy to install', 'Cheap — clean indoor use'] },
    b: { head: 'Steel Wire Armoured', sub: 'CU/PVC/SWA/PVC', points: ['Underground / outdoor', 'Withstands soil pressure', 'Survives accidental impact', 'Steel mechanical protection'] }
  }));

  add('dark', 'Risk Management', () => T.statement({
    bg: 'image60.png',
    l1: 'Cable selection is <s>not buying parts.</s>',
    l2: 'Cable selection is <em>risk&nbsp;management.</em>'
  }));

  add('dark', 'Undersized Cable?', () => T.divider({
    bg: 'image86.jpeg', eyebrow: 'A hidden danger', title: 'What is undersized cable?'
  }));

  add('light', 'Undersized Cable', () => T.photoSplit({
    img: 'image84.png', side: 'right', badge: 'Spot the difference',
    kicker: 'Undersized cable', title: 'Same outside.<br>Less inside.',
    body: 'An undersized cable has less copper than the standard requires — yet looks identical from the outside.',
    points: ['Less copper inside than the standard requires', 'Outside diameter looks the same as a proper cable', 'You can’t tell the difference by eye']
  }));

  add('light', 'Why It Happens', () => T.points({
    kicker: 'The Malaysian market', title: 'Why does it happen here?', cols: 2,
    items: [
      { head: 'Cost-cutting by suppliers', desc: 'Copper is expensive, so some reduce copper to save cost — and the diameter still looks the same.' },
      { head: 'Lack of education on sizing', desc: 'Many users don’t check current rating, standards, or insulation type, or know how sizing affects performance.' },
      { head: 'Market pressure & competition', desc: 'Quality is sometimes compromised to stay price-competitive.' },
      { head: 'Weak enforcement & awareness', desc: 'Standards exist but aren’t strictly checked, so non-compliant cable still circulates.' }
    ]
  }));

  add('light', 'Risks', () => T.points({
    kicker: 'The consequences', title: 'Risks of undersized cable.', cols: 2,
    items: [
      { head: 'Overheating', desc: 'Too small to carry full current → higher resistance → more heat → melted insulation.' },
      { head: 'Voltage drop', desc: 'Resistance drops voltage at the equipment — machines run slow, lights dim, sensitive gear malfunctions.' },
      { head: 'Shorter lifespan', desc: 'Constant overheating ages insulation faster, so the cable fails earlier than expected.' },
      { head: 'Fire hazard', desc: 'Worst case: insulation burns, the conductor is exposed, and a fire can start.' }
    ]
  }));

  add('light', 'Quality Matters', () => T.photoSplit({
    img: 'image86.jpeg', side: 'right', badge: 'Conductor quality',
    kicker: 'Beyond size', title: 'Size isn’t the only thing that matters.',
    body: 'Even at the same conductor size, quality still matters. Low-grade copper with impurities or mixed metals performs worse.',
    points: ['Impure copper raises electrical resistance', 'Current can’t flow efficiently', 'The cable generates more heat']
  }));

  /* ===== PART 3 · MANUFACTURING (32–54) ===== */

  add('light', 'The Journey', () => T.points({
    kicker: 'Single PVC cable', title: 'The manufacturing journey.', cols: 3,
    items: [
      { no: '01', head: 'Drawing', desc: '8mm copper rod is reduced through a series of dies.' },
      { no: '02', head: 'Bunching', desc: 'Multiple wires are twisted together into a conductor.' },
      { no: '03', head: 'Insulation', desc: 'PVC is extruded over the conductor.' }
    ]
  }));

  add('dark', 'Manufacturing', () => T.divider({
    bg: 'image60.png', eyebrow: 'Part Three', title: 'The manufacturing journey.'
  }));

  add('dark', 'Cable Construction', () => T.divider({
    bg: 'image60.png', eyebrow: 'Layer by layer', title: 'Cable construction.'
  }));

  add('light', 'Single Core CU', () => T.crossSection({
    kicker: 'Cable construction', title: 'Single core power cable.',
    img: 'image88.png', code: 'SINGLE CORE — CU/XLPE/AWA/PVC',
    layers: [
      { name: 'Conductor', material: 'Copper' }, { name: 'Insulation', material: 'XLPE' },
      { name: 'Armour', material: 'Aluminium wire' }, { name: 'Sheath', material: 'PVC' }
    ]
  }));

  add('light', '4 Core AL', () => T.crossSection({
    kicker: 'Cable construction', title: 'Four core power cable.',
    img: 'image89.png', code: '4 CORES — AL/XLPE/SCT/MDPE',
    layers: [
      { name: 'Conductor', material: 'Aluminium' }, { name: 'Insulation', material: 'XLPE' },
      { name: 'Screen', material: 'Copper tape' }, { name: 'Bedding & sheath', material: 'MDPE' }
    ]
  }));

  add('light', 'Multicore CU', () => T.crossSection({
    kicker: 'Cable construction', title: 'Multicore / multipair cable.',
    img: 'image90.png', code: 'MULTICORE — CU/XLPE/OSCR/SWA/PVC',
    layers: [
      { name: 'Conductor', material: 'Copper / tinned copper' }, { name: 'Screen', material: 'Aluminium tape' },
      { name: 'Bedding', material: 'PVC' }, { name: 'Armour', material: 'Galvanized steel wire' }, { name: 'Sheath', material: 'PVC' }
    ]
  }));

  add('light', 'FR Single Core', () => T.crossSection({
    kicker: 'Cable construction', title: 'Fire resistant single core.',
    img: 'image91.png', code: 'SINGLE CORE — CU/MICA/XLPE/SWA/PVC-FR',
    layers: [
      { name: 'Conductor', material: 'Copper' }, { name: 'Fire barrier', material: 'Mica tape' },
      { name: 'Insulation', material: 'XLPE or XLEVA' }, { name: 'Armour', material: 'Galvanized steel wire' }, { name: 'Sheath', material: 'PVC-FR or LSHF' }
    ]
  }));

  add('dark', 'Cable Distribution', () => T.divider({
    bg: 'image60.png', eyebrow: 'Material build-up', title: 'Cable distribution.'
  }));

  add('light', 'Distribution I', () => T.crossSection({
    kicker: 'Cable distribution', title: 'Single core — CU/XLPE/AWA/PVC.',
    img: 'image92.png', code: 'SINGLE CORE — CU/XLPE/AWA/PVC',
    layers: [
      { name: 'Conductor', material: 'Stranded plain annealed copper' }, { name: 'Insulation', material: 'XLPE compound' },
      { name: 'Bedding', material: 'PVC compound' }, { name: 'Armour', material: 'Aluminium wire' }, { name: 'Sheath', material: 'PVC compound' }
    ]
  }));

  add('light', 'Distribution II', () => T.crossSection({
    kicker: 'Cable distribution', title: 'Four core — AL/XLPE/SCT/MDPE.',
    img: 'image93.png', code: '4 CORES — AL/XLPE/SCT/MDPE',
    layers: [
      { name: 'Conductor', material: 'Stranded plain annealed aluminium' }, { name: 'Insulation', material: 'XLPE compound' },
      { name: 'Screen', material: 'Copper tape' }, { name: 'Bedding & sheath', material: 'MDPE compound' }
    ]
  }));

  add('light', 'Distribution III', () => T.crossSection({
    kicker: 'Cable distribution', title: 'Multicore — CU/XLPE/OSCR/SWA/PVC.',
    img: 'image94.png', code: 'MULTICORE — CU/XLPE/OSCR/SWA/PVC',
    layers: [
      { name: 'Conductor', material: 'Stranded plain annealed aluminium' }, { name: 'Insulation', material: 'PVC or XLPE compound' },
      { name: 'Drain wire & screen', material: 'Tinned copper / aluminium wire' }, { name: 'Bedding', material: 'PVC compound' },
      { name: 'Armour', material: 'Galvanized steel wire' }, { name: 'Sheath', material: 'PVC compound' }
    ]
  }));

  add('light', 'Distribution IV', () => T.crossSection({
    kicker: 'Cable distribution', title: 'FR single core — CU/MICA/XLPE/SWA/PVC-FR.',
    img: 'image95.png', code: 'SINGLE CORE — CU/MICA/XLPE/SWA/PVC-FR',
    layers: [
      { name: 'Conductor', material: 'Stranded plain annealed aluminium' }, { name: 'Fire barrier', material: 'Mica tape' },
      { name: 'Insulation', material: 'XLPE or XL-LSHF compound' }, { name: 'Bedding', material: 'PVC-FR or LSHF' },
      { name: 'Armour', material: 'Galvanized steel wire' }, { name: 'Sheath', material: 'PVC-FR or LSHF compound' }
    ]
  }));

  add('dark', 'Process', () => T.divider({
    bg: 'image60.png', eyebrow: 'On the factory floor', title: 'The manufacturing process.'
  }));

  add('light', 'Stranding', () => T.processSteps({
    kicker: 'Stranding — copper', title: 'From rod to conductor.',
    steps: [
      { img: 'image96.jpeg', name: 'Wire drawing', desc: 'Copper rod drawn through dies to reduce diameter to spec.' },
      { img: 'image97.jpeg', name: 'Wire stranding', desc: 'Multiple wires stranded together to form conductors.' },
      { img: 'image98.jpeg', name: 'Closing die', desc: 'Conductors compacted for density and roundness.' },
      { img: 'image99.jpeg', name: 'Final take-up', desc: 'Stranded conductor rewound onto drums for storage.' }
    ]
  }));

  add('light', 'Drawing — AL', () => T.processSteps({
    kicker: 'Drawing — aluminium', title: 'Reducing the wire.',
    steps: [
      { img: 'image100.jpeg', name: 'Pay-off', desc: 'Aluminium wire fed into the drawing machine.' },
      { img: 'image101.jpeg', name: 'Drawing machine', desc: 'Wire diameter reduced continuously.' },
      { img: 'image102.jpeg', name: 'Drawing dies', desc: 'Wire passes through multiple drawing dies.' },
      { img: 'image103.jpeg', name: 'Finishing', desc: 'Final pass to the target diameter.' },
      { img: 'image104.jpeg', name: 'Drawn wires', desc: 'Finished wires ready for processing.' }
    ]
  }));

  add('light', 'Bunching', () => T.processSteps({
    kicker: 'Bunching', title: 'Twisting wires into a conductor.',
    steps: [
      { img: 'image105.jpeg', name: 'Wire supply', desc: 'Copper wire supplied into the bunching machine.' },
      { img: 'image106.jpeg', name: 'Size reduction', desc: 'Wire diameter reduced through drawing.' },
      { img: 'image107.jpeg', name: 'Bunching machine', desc: 'Multiple wires twisted together.' },
      { img: 'image108.jpeg', name: 'Take-up', desc: 'Finished conductor rewound onto a spool.' }
    ]
  }));

  add('light', 'Insulation', () => T.processSteps({
    kicker: 'Insulation', title: 'Coating the conductor.',
    steps: [
      { img: 'image109.jpeg', name: 'Wire feeding', desc: 'Conductor fed into the insulation machine.' },
      { img: 'image110.jpeg', name: 'Extrusion', desc: 'Insulation material extruded onto the wire.' },
      { img: 'image111.jpeg', name: 'Water cooling', desc: 'Insulated wire cooled in a water trough.' },
      { img: 'image112.jpeg', name: 'Spark tester', desc: 'Insulation checked for defects.' },
      { img: 'image113.jpeg', name: 'Take-up', desc: 'Finished wire rewound onto a spool.' }
    ]
  }));

  add('light', 'Cabling', () => T.processSteps({
    kicker: 'Cabling / assembly', title: 'Assembling the cores.',
    steps: [
      { img: 'image114.jpeg', name: 'Pay-off stand', desc: 'Cores supplied through the pay-off stand.' },
      { img: 'image115.jpeg', name: 'Cabling machine', desc: 'Cores twisted by the cabling system.' },
      { img: 'image116.jpeg', name: 'Core assembly', desc: 'Cores assembled into the cable formation.' },
      { img: 'image112.jpeg', name: 'Closing die', desc: 'Cable passes through the closing die.' },
      { img: 'image101.jpeg', name: 'Take-up', desc: 'Finished cable collected by the take-up unit.' }
    ]
  }));

  add('light', 'Braiding', () => T.processSteps({
    kicker: 'Braiding', title: 'Interwoven protection.',
    steps: [
      { img: 'image117.jpeg', name: 'Wire pay-off', desc: 'Braiding wires supplied through the pay-off.' },
      { img: 'image118.jpeg', name: 'Tension control', desc: 'Tension managed by an accumulator system.' },
      { img: 'image119.jpeg', name: 'Braiding machine', desc: 'Wires interwoven by braiding carriers.' },
      { img: 'image120.jpeg', name: 'Braiding point', desc: 'Braid formed uniformly around the cable.' }
    ]
  }));

  add('light', 'Armouring', () => T.processSteps({
    kicker: 'Armouring', title: 'Mechanical protection.',
    steps: [
      { img: 'image121.jpeg', name: 'Unwinding drum', desc: 'Cable unwound smoothly from the supply drum.' },
      { img: 'image122.jpeg', name: 'Armouring machine', desc: 'Cable enters the rotating armouring system.' },
      { img: 'image123.jpeg', name: 'Guiding', desc: 'Armour wires guided uniformly around the cable.' },
      { img: 'image124.jpeg', name: 'Rewinding', desc: 'Armoured cable aligned and rewound.' }
    ]
  }));

  add('light', 'Inner Sheath', () => T.processSteps({
    kicker: 'Inner sheath', title: 'Bedding the cable.',
    steps: [
      { img: 'image125.jpeg', name: 'Pay-off stand', desc: 'Cable supplied through the pay-off stand.' },
      { img: 'image126.jpeg', name: 'Extruder', desc: 'Inner sheath extruded around the cable.' },
      { img: 'image127.jpeg', name: 'Cooling', desc: 'Sheathed cable cooled in a water trough.' },
      { img: 'image128.jpeg', name: 'Capstan', desc: 'Cable pulled steadily by the capstan unit.' },
      { img: 'image129.jpeg', name: 'Take-up', desc: 'Finished cable collected onto a drum.' }
    ]
  }));

  add('light', 'Sheathing', () => T.processSteps({
    kicker: 'Sheathing', title: 'The outer layer.',
    steps: [
      { img: 'image130.jpeg', name: 'Unwinding drum', desc: 'Cable unwound from the supply drum.' },
      { img: 'image131.jpeg', name: 'Sheathing', desc: 'Sheath material extruded onto the cable core.' },
      { img: 'image132.jpeg', name: 'Cooling', desc: 'Sheathed cable cooled through a water trough.' },
      { img: 'image133.jpeg', name: 'Take-up', desc: 'Finished cable rewound onto a drum.' }
    ]
  }));

  add('light', 'Drum Packing', () => T.processSteps({
    kicker: 'Drum packing', title: 'Ready for delivery.',
    steps: [
      { img: 'image134.jpeg', name: 'Cable on drum', desc: 'Finished cable wound onto wooden drums.' },
      { img: 'image135.jpeg', name: 'Wooden battens', desc: 'Protective battens fitted to prevent damage.' },
      { img: 'image136.jpeg', name: 'Drum sealing', desc: 'Drum covers secured tightly for safe handling.' },
      { img: 'image137.jpeg', name: 'Packed drum', desc: 'Completed drum ready for storage or delivery.' }
    ]
  }));

  /* ===== PART 4 · TESTING → CLOSE (55–62) ===== */

  add('dark', 'Test & Inspect', () => T.divider({
    bg: 'image60.png', eyebrow: 'Part Four', title: 'Test & inspection.'
  }));

  add('light', 'Measurement', () => T.photoCards({
    kicker: 'Quality control & testing', title: 'Measuring every dimension.', cols: 4,
    cards: [
      { img: 'image138.jpeg', head: 'Digital / Vernier Caliper', desc: 'Conductor & cable diameter.' },
      { img: 'image139.jpeg', head: 'Diameter Tape', desc: 'Overall cable diameter.' },
      { img: 'image140.jpeg', head: 'Profile Projector', desc: 'Insulation & sheath thickness.' },
      { img: 'image141.jpeg', head: 'Micrometer', desc: 'Wire diameter.' }
    ]
  }));

  add('light', 'Heat Tests', () => T.photoCards({
    kicker: 'Quality control & testing', title: 'Standing up to heat.', cols: 3,
    cards: [
      { img: 'image142.jpeg', head: 'Heat Shock Test', desc: 'Resistance to cracking when heated to 150°C.' },
      { img: 'image143.jpeg', head: 'Hot Set Test', desc: 'Permanent elongation of insulation under load & heat.' },
      { img: 'image144.jpeg', head: 'Visual Inspection', desc: 'Cable construction checked and data recorded.' }
    ]
  }));

  add('light', 'Aging Tests', () => T.photoCards({
    kicker: 'Quality control & testing', title: 'Ageing & high-voltage checks.', cols: 4,
    cards: [
      { img: 'image146.jpeg', head: 'Pressure at High Temp', desc: 'Indentation when conditioned at 90°C.' },
      { img: 'image147.jpeg', head: 'Heat Shrinkage', desc: 'Shrinkage when conditioned at 130°C.' },
      { img: 'image148.jpeg', head: 'Loss of Mass', desc: 'Mass difference after 168h at 80–100°C.' },
      { img: 'image145.jpeg', head: 'High Voltage & PD', desc: 'Dielectric and partial-discharge testing.' }
    ]
  }));

  add('light', 'Final Tests', () => T.photoCards({
    kicker: 'Quality control & testing', title: 'The final word.', cols: 4,
    cards: [
      { img: 'image45.jpeg', head: 'Conductor Resistance', desc: 'Each cable meets the maximum resistance limit.' },
      { img: 'image46.jpeg', head: 'Tensile & Elongation', desc: 'Withstands pulling forces without breaking.' },
      { img: 'image47.jpeg', head: 'Insulation Resistance', desc: 'Insulation prevents leakage current.' },
      { img: 'image48.jpeg', head: 'Flame Test', desc: 'Resists ignition and flame propagation.' }
    ]
  }));

  add('dark', 'Why It Matters', () => T.photoCards({
    theme: 'dark', bg: 'image60.png',
    kicker: 'Why this matters to you', title: 'Engineering that protects lives.', cols: 3,
    cards: [
      { img: 'image150.jpeg', head: 'Hospitals stay powered', desc: 'Reliable cable keeps critical care running.' },
      { img: 'image149.png', head: 'MRT keeps moving', desc: 'Transit systems depend on safe power.' },
      { img: 'image151.jpeg', head: 'Homes stay bright', desc: 'Everyday life runs on dependable cable.' }
    ]
  }));

  add('light', 'Career Path', () => T.photoCards({
    kicker: 'Where this can take you', title: 'The career path.', cols: 3,
    cards: [
      { img: 'image9.jpeg', head: 'Factory & Manufacturing', desc: 'Production, process & quality engineering.' },
      { img: 'image153.png', head: 'Contracting & Construction', desc: 'Installing the systems that power projects.' },
      { img: 'image154.png', head: 'Consulting & Design', desc: 'Specifying the right cable for the job.' }
    ]
  }));

  add('dark', 'Thank You', () => T.closing({
    tagline: 'Engineering that protects lives — keeping hospitals powered, trains moving and homes bright.',
    contacts: [
      { k: 'Email', v: 'enquiry@tonncable.com', href: 'mailto:enquiry@tonncable.com' },
      { k: 'Phone', v: '(603) 8766 9888' },
      { k: 'Web', v: 'www.tonncable.com', href: 'https://www.tonncable.com' }
    ]
  }));

  window.SLIDES = S;
})();
