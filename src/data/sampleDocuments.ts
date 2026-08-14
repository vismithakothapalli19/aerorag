import { DocumentItem, DocumentCategory } from '../types';

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-turbofan-2023',
    title: 'NASA-SP-2023 Turbofan Thermal Dynamics & Cooling Systems',
    filename: 'NASA-SP-2023-Turbofan-Thermal-Dynamics.pdf',
    fileType: 'PDF',
    size: '4.8 MB',
    tokenCount: 14250,
    chunkCount: 8,
    status: 'indexed',
    uploadDate: '2026-07-28',
    vectorDim: 768,
    category: 'Propulsion',
    description: 'High-bypass turbofan combustor thermodynamics, ceramic matrix composite (CMC) durability, and stator film cooling aerodynamics under extreme thermal gradients.',
    chunks: [
      {
        id: 'chunk-turbo-1',
        docId: 'doc-turbofan-2023',
        docTitle: 'NASA-SP-2023 Turbofan Thermal Dynamics',
        page: 4,
        section: '§2.1 Combustor Exit Temperature (CET) Mitigation',
        text: 'Modern high-bypass turbofan engines operate at Combustor Exit Temperatures (CET) exceeding 1,850 K (1,577 °C), which surpasses the melting threshold of nickel-based superalloys (typically 1,550 K to 1,620 K). To prevent catastrophic thermal fatigue, an active cooling boundary layer is maintained via serpentine internal convection channels and effusion hole arrays delivering bleed air at a blowing ratio (M) between 1.2 and 1.8.',
        tokenCount: 88,
        vector: [-0.68, 0.45],
        cluster: 'Propulsion'
      },
      {
        id: 'chunk-turbo-2',
        docId: 'doc-turbofan-2023',
        docTitle: 'NASA-SP-2023 Turbofan Thermal Dynamics',
        page: 7,
        section: '§3.4 Ceramic Matrix Composite (CMC) Shrouds',
        text: 'Silicon Carbide continuous fiber-reinforced Silicon Carbide (SiC/SiC) Ceramic Matrix Composites exhibit one-third the density of nickel superalloys while tolerating working gas temperatures up to 1,673 K (1,400 °C) without dedicated film cooling bleed. However, high water-vapor environments in combustion gas induce volatilization of the protective silica scale into gaseous Si(OH)4, necessitating multi-layer environmental barrier coatings (EBC) consisting of silicon bond coats, mullite, and ytterbium disilicate (Yb2Si2O7).',
        tokenCount: 96,
        vector: [-0.62, 0.58],
        cluster: 'Propulsion'
      },
      {
        id: 'chunk-turbo-3',
        docId: 'doc-turbofan-2023',
        docTitle: 'NASA-SP-2023 Turbofan Thermal Dynamics',
        page: 12,
        section: '§4.2 Stator Vane Film Cooling Slot Geometry',
        text: 'Fan-shaped diffusion cooling holes with lateral expansion angles of 10° to 15° reduce jet lift-off at high blowing ratios compared to cylindrical orifices. The adiabatic film effectiveness (η) is enhanced by 35% across the suction surface when using laidback fan-shaped holes oriented at a 30° surface inclination angle, significantly decreasing thermal strain along the leading-edge stagnation line.',
        tokenCount: 78,
        vector: [-0.75, 0.38],
        cluster: 'Propulsion'
      },
      {
        id: 'chunk-turbo-4',
        docId: 'doc-turbofan-2023',
        docTitle: 'NASA-SP-2023 Turbofan Thermal Dynamics',
        page: 18,
        section: '§5.8 Emergency High-Temperature Rollback Envelope',
        text: 'If high-pressure turbine interstage temperature (ITT) sensors detect an excursion beyond 980 °C for greater than 4.5 seconds during takeoff power application, the Full Authority Digital Engine Control (FADEC) initiates automatic fuel metering rollback. Fuel flow is modulated down by 8.5% while opening transient bleed valves (TBVs) to restore compressor surge margin and avoid thermal runaway.',
        tokenCount: 79,
        vector: [-0.54, 0.32],
        cluster: 'Propulsion'
      }
    ]
  },
  {
    id: 'doc-hypersonic-guidance',
    title: 'AeroSpace-Spec 780 Hypersonic Guidance & Plasma Reentry',
    filename: 'AeroSpace-Spec-780-Hypersonic-Guidance.pdf',
    fileType: 'SPEC',
    size: '6.2 MB',
    tokenCount: 18900,
    chunkCount: 6,
    status: 'indexed',
    uploadDate: '2026-08-01',
    vectorDim: 768,
    category: 'Guidance & Avionics',
    description: 'Autonomous reentry trajectory Kalman filtering, GPS-denied stellar-inertial drift mitigation, and plasma sheath electromagnetic attenuation protocols at Mach 7+.',
    chunks: [
      {
        id: 'chunk-hyper-1',
        docId: 'doc-hypersonic-guidance',
        docTitle: 'AeroSpace-Spec 780 Hypersonic Guidance',
        page: 3,
        section: '§1.2 Plasma Blackout S-Band Telemetry Mitigation',
        text: 'During atmospheric entry at velocities between Mach 8 and Mach 22, shock-layer ionization generates a dense plasma sheath with electron number densities exceeding 10^12 cm^-3. This layer reflects standard S-band RF carrier waves. To maintain telemetry and command links, the guidance subsystem dynamically switches to Ka-band (35 GHz) horn arrays positioned in aerodynamic expansion wake shadows, or injects electrophilic quenching compounds (water-glycol aerosol) to suppress local electron density.',
        tokenCount: 89,
        vector: [0.55, 0.62],
        cluster: 'Guidance & Avionics'
      },
      {
        id: 'chunk-hyper-2',
        docId: 'doc-hypersonic-guidance',
        docTitle: 'AeroSpace-Spec 780 Hypersonic Guidance',
        page: 8,
        section: '§3.5 GPS-Denied Stellar-Inertial Extended Kalman Filter',
        text: 'In high-jamming environments or blackout corridors where GNSS lock is severed, state estimation shifts to an 18-state Error-State Extended Kalman Filter (ES-EKF). The filter tightly couples tri-axial Ring Laser Gyroscopes (drift < 0.003 deg/hr) with autonomous celestial star trackers operating in short-wave infrared (SWIR, 1.4-1.7 μm) to penetrate daytime atmospheric sky glow.',
        tokenCount: 80,
        vector: [0.68, 0.50],
        cluster: 'Guidance & Avionics'
      },
      {
        id: 'chunk-hyper-3',
        docId: 'doc-hypersonic-guidance',
        docTitle: 'AeroSpace-Spec 780 Hypersonic Guidance',
        page: 14,
        section: '§5.1 Boundary Layer Transition Aerodynamic Control',
        text: 'Boundary Layer Transition (BLT) from laminar to turbulent flow induces sudden spikes in aerodynamic heating and center-of-pressure shifts up to 2.4% chord length. The flight control system utilizes electromechanical flight actuators (EMA) with dynamic bandwidth > 45 Hz and feedback linearizing control laws to counteract asymmetric rolling moments without depleting cold-gas Reaction Control System (RCS) propellant.',
        tokenCount: 77,
        vector: [0.48, 0.72],
        cluster: 'Guidance & Avionics'
      }
    ]
  },
  {
    id: 'doc-flight-sop',
    title: 'Flight Operations Manual: Emergency SOP & Depressurization',
    filename: 'Flight-Ops-Manual-Boeing-Aero-SOP.pdf',
    fileType: 'PDF',
    size: '3.4 MB',
    tokenCount: 11200,
    chunkCount: 7,
    status: 'indexed',
    uploadDate: '2026-08-05',
    vectorDim: 768,
    category: 'Flight Operations',
    description: 'Commercial and tactical transport aircraft standard operating procedures: dual engine flameout relight envelopes, high-altitude stall recovery, and rapid emergency descent.',
    chunks: [
      {
        id: 'chunk-ops-1',
        docId: 'doc-flight-sop',
        docTitle: 'Flight Operations Manual Emergency SOP',
        page: 15,
        section: '§4.2 Dual Engine Flameout & Relight Windmill Envelope',
        text: 'In the event of dual engine flameout at high altitude: 1) Immediately establish optimum glide airspeed (Vref + 80 kt / minimum 270 kt IAS) to maintain windmill rotor RPM above 12% N2; 2) Turn Engine Ignition switches to BOTH / CONTINUOUS; 3) Deploy Ram Air Turbine (RAT) to ensure primary flight control hydraulics and standby instruments; 4) If below FL250 and airspeed is below 250 kt, initiate APU start to provide auxiliary electrics and bleed air for cross-bleed starter assist.',
        tokenCount: 94,
        vector: [-0.35, -0.65],
        cluster: 'Flight Operations'
      },
      {
        id: 'chunk-ops-2',
        docId: 'doc-flight-sop',
        docTitle: 'Flight Operations Manual Emergency SOP',
        page: 22,
        section: '§6.8 Rapid Cabin Depressurization & Emergency Descent Profile',
        text: 'Upon CABIN ALTITUDE warning (>10,000 ft): 1) Flight crew don oxygen masks (100% emergency pressure mode); 2) Establish crew intercom; 3) Set MCP Target Altitude to 10,000 ft or Minimum Safe Altitude (MSA); 4) Select FLCH / LVL CHG mode, disconnect Autothrottle, and retard thrust levers to IDLE; 5) Extend SPEED BRAKES to FULL; 6) Maintain pitch attitude to accelerate to Maximum Operating Speed (Vmo/Mmo) unless structural damage is suspected.',
        tokenCount: 88,
        vector: [-0.22, -0.78],
        cluster: 'Flight Operations'
      },
      {
        id: 'chunk-ops-3',
        docId: 'doc-flight-sop',
        docTitle: 'Flight Operations Manual Emergency SOP',
        page: 29,
        section: '§5.1 High-Altitude Stall Recovery & Buffet Margin',
        text: 'At altitudes above FL300, the margin between low-speed buffet and high-speed Mach buffet narrows to as little as 15-20 knots ("Coffin Corner"). To recover from an impending stall: 1) Disconnect Autopilot; 2) Smoothly lower pitch attitude to reduce angle of attack (AoA) below critical alpha; 3) Roll wings level before applying power; 4) Advance thrust smoothly to avoid compressor stall due to thin ambient density; 5) Avoid abrupt pull-ups to prevent secondary high-speed buffet.',
        tokenCount: 92,
        vector: [-0.44, -0.52],
        cluster: 'Flight Operations'
      }
    ]
  },
  {
    id: 'doc-arinc-653',
    title: 'ARINC-653 RTOS Architecture & DO-178C Safety Spec',
    filename: 'Avionics-ARINC-653-RTOS-Architecture.md',
    fileType: 'MD',
    size: '1.9 MB',
    tokenCount: 8400,
    chunkCount: 5,
    status: 'indexed',
    uploadDate: '2026-08-08',
    vectorDim: 768,
    category: 'Safety & Compliance',
    description: 'Time and space partitioning in Integrated Modular Avionics (IMA), deterministic task scheduling, AFDX Ethernet determinism, and DO-178C Level A verification.',
    chunks: [
      {
        id: 'chunk-arinc-1',
        docId: 'doc-arinc-653',
        docTitle: 'ARINC-653 RTOS Architecture',
        page: 2,
        section: '§1.1 Robust Space and Time Partitioning',
        text: 'ARINC 653 Part 1 enforces strict spatial and temporal isolation between avionics software partitions hosted on shared Integrated Modular Avionics (IMA) computing modules. Spatial partitioning is maintained via hardware Memory Management Units (MMU) preventing out-of-partition memory writes. Temporal partitioning utilizes cyclic static major frames divided into deterministic time slots, guaranteeing that low-criticality tasks (Design Assurance Level DAL-D) cannot starve critical Flight Control software (DAL-A).',
        tokenCount: 89,
        vector: [0.15, -0.45],
        cluster: 'Safety & Compliance'
      },
      {
        id: 'chunk-arinc-2',
        docId: 'doc-arinc-653',
        docTitle: 'ARINC-653 RTOS Architecture',
        page: 6,
        section: '§2.4 AFDX Avionics Full-Duplex Switched Ethernet Routing',
        text: 'Deterministic data exchange between IMA partitions occurs across ARINC 664 Part 7 (AFDX) virtual links (VL). Each VL specifies a Bandwidth Allocation Gap (BAG) ranging from 1 ms to 128 ms and a Maximum Frame Size (Lmax) up to 1,518 bytes. Dual-redundant star topology network switches discard non-compliant burst frames using leaky-bucket policing, bounding jitter to under 50 microseconds across critical fly-by-wire buses.',
        tokenCount: 86,
        vector: [0.28, -0.38],
        cluster: 'Safety & Compliance'
      }
    ]
  },
  {
    id: 'doc-quantum-nav',
    title: 'Quantum Sensory Navigation: Subterranean & Cold-Atom Gravimetry',
    filename: 'Quantum-Sensory-Navigation-Avionics-Whitepaper.pdf',
    fileType: 'SPEC',
    size: '5.1 MB',
    tokenCount: 15600,
    chunkCount: 5,
    status: 'indexed',
    uploadDate: '2026-08-11',
    vectorDim: 768,
    category: 'Guidance & Avionics',
    description: 'Cold-atom Rubidium-87 BEC interferometers, quantum gravity gradiometry matching, and zero-drift positioning without GPS in contested electromagnetic airspace.',
    chunks: [
      {
        id: 'chunk-quant-1',
        docId: 'doc-quantum-nav',
        docTitle: 'Quantum Sensory Navigation Whitepaper',
        page: 5,
        section: '§2.2 Cold-Atom Rubidium-87 Gravimeter Interferometer',
        text: 'By laser-cooling Rubidium-87 (87Rb) atoms to micro-Kelvin temperatures inside an ultra-high vacuum chamber, atomic wave packets undergo stimulated Raman transitions that act as matter-wave beam splitters and mirrors. The phase shift accumulated during the atom interferometry pulse sequence (π/2 - π - π/2) directly measures local gravitational acceleration (g) with micro-Gal (10^-8 m/s^2) precision, enabling continuous real-time terrain gravity database cross-referencing without external RF beacons.',
        tokenCount: 93,
        vector: [0.72, 0.22],
        cluster: 'Guidance & Avionics'
      },
      {
        id: 'chunk-quant-2',
        docId: 'doc-quantum-nav',
        docTitle: 'Quantum Sensory Navigation Whitepaper',
        page: 9,
        section: '§4.1 Zero-Drift Subterranean / Deep-Space Inertial Positioning',
        text: 'Unlike mechanical or optical gyroscopes which suffer from random walk drift (0.01° to 0.1°/hour), quantum matter-wave interferometers exhibit zero long-term bias drift. Under high dynamic aircraft acceleration profiles, quantum sensors operate in hybrid mode with high-bandwidth MEMS accelerometers, where the quantum sensor continuously calibrates the MEMS bias at 10 Hz intervals.',
        tokenCount: 78,
        vector: [0.65, 0.35],
        cluster: 'Guidance & Avionics'
      }
    ]
  }
];

export const SAMPLE_PROMPT_SUGGESTIONS = [
  {
    category: 'Thermal & Propulsion',
    query: 'What is the emergency protocol if high-pressure turbine interstage temperature (ITT) exceeds 980 °C?',
    targetDoc: 'NASA-SP-2023 Turbofan'
  },
  {
    category: 'Flight SOP',
    query: 'Explain the 6-step flight crew procedure during rapid cabin depressurization above FL100.',
    targetDoc: 'Flight Ops Manual'
  },
  {
    category: 'Hypersonic Guidance',
    query: 'How does the guidance subsystem bypass S-band plasma blackout during Mach 8+ atmospheric reentry?',
    targetDoc: 'AeroSpace-Spec 780'
  },
  {
    category: 'Avionics Safety',
    query: 'How does ARINC 653 ensure DAL-D software cannot starve critical DAL-A flight control partitions?',
    targetDoc: 'ARINC-653 RTOS'
  }
];

export const SAMPLE_BENCHMARKS = [
  {
    id: 'bench-1',
    query: 'What cooling hole geometry maximizes adiabatic film effectiveness in high-pressure turbine vanes?',
    targetCategory: 'Propulsion' as DocumentCategory,
    groundTruthDoc: 'NASA-SP-2023 Turbofan (§4.2)',
    contextPrecision: 0.98,
    contextRecall: 0.96,
    faithfulness: 0.99,
    answerRelevance: 0.97,
    latencyMs: 384,
    status: 'passed' as const
  },
  {
    id: 'bench-2',
    query: 'Explain dual engine flameout recovery glide speed and windmill RPM requirements.',
    targetCategory: 'Flight Operations' as DocumentCategory,
    groundTruthDoc: 'Flight Ops Manual (§4.2)',
    contextPrecision: 0.95,
    contextRecall: 0.94,
    faithfulness: 1.00,
    answerRelevance: 0.98,
    latencyMs: 412,
    status: 'passed' as const
  },
  {
    id: 'bench-3',
    query: 'How are AFDX virtual links policied to guarantee bounded latency below 50 microseconds?',
    targetCategory: 'Safety & Compliance' as DocumentCategory,
    groundTruthDoc: 'ARINC-653 RTOS (§2.4)',
    contextPrecision: 0.97,
    contextRecall: 0.92,
    faithfulness: 0.99,
    answerRelevance: 0.95,
    latencyMs: 395,
    status: 'passed' as const
  },
  {
    id: 'bench-4',
    query: 'Describe how cold-atom Rubidium-87 interferometers eliminate gyroscope bias drift.',
    targetCategory: 'Guidance & Avionics' as DocumentCategory,
    groundTruthDoc: 'Quantum Sensory Navigation (§4.1)',
    contextPrecision: 0.99,
    contextRecall: 0.97,
    faithfulness: 0.98,
    answerRelevance: 0.99,
    latencyMs: 428,
    status: 'passed' as const
  }
];
