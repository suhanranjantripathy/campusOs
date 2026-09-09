import { TrackFramework } from "@/types/milestones";

export const MILESTONE_TRACKS: TrackFramework[] = [
  {
    id: "fullstack",
    name: "Full-Stack Development",
    subtitle: "Ship end-to-end production applications & clear tech rounds",
    description:
      "A 5-stage progression from core web programming to production deployments, real users, and senior engineering interview gates.",
    icon: "Layers",
    badge: "Web & Systems",
    color: "#2563EB",
    gradient: "from-blue-600 via-indigo-600 to-sky-500",
    milestones: [
      {
        id: "fullstack-m1",
        code: "M1",
        title: "Foundation",
        canYouSayYes: "Can you code?",
        practice: {
          items: [
            "Finish the prep kit + assignments on Newton Portal",
            "Cover JS, React, HTTP/REST, Git, and SQL basics",
            "Small coding exercises and algorithmic problem solving",
            "Build a basic CRUD application with state and clean logic",
          ],
        },
        gate: {
          threshold: "70%+ Score",
          criteria: [
            "Proctored fundamentals exam — pass at 70%+",
            "AI mock interview on JS + React fundamentals",
            "Judged on correctness and foundational clarity, not project size",
          ],
        },
        evidence: [
          "Prep-kit + assignments completed on portal",
          "Proctored exam score report",
          "AI mock score & transcript",
          "GitHub profile with basic commit hygiene",
          "Basic CRUD app repository link",
        ],
      },
      {
        id: "fullstack-m2",
        code: "M2",
        title: "Core Proficiency",
        canYouSayYes: "Can you ship features?",
        practice: {
          items: [
            "Build 2 full-stack projects",
            "At least 1 project fully deployed to production",
            "Rebuild core features standalone in a Feature Practice Repo",
            "Goal: master isolated component architecture and clean state boundaries",
          ],
        },
        gate: {
          threshold: "Timed Machine Round",
          criteria: [
            "Timed machine round examination",
            "Implement + integrate multiple features into one working app",
            "Judged on shipping working functionality, not isolated exercises",
          ],
        },
        evidence: [
          "2 project repositories on GitHub",
          "1 live deployed URL (Vercel/Render/Railway)",
          "Feature Practice Repo with atomic branches",
          "Incremental commit history demonstrating real development",
          "Working frontend + backend + API + DB integration",
          "Machine-round score certification",
        ],
      },
      {
        id: "fullstack-m3",
        code: "M3",
        title: "Advanced / E2E",
        canYouSayYes: "Can you build a full product?",
        practice: {
          items: [
            "Take a real-world problem statement and scope product requirements",
            "Build 1 substantial full-stack application — completely unguided",
            "Must include secure auth + database + advanced domain features",
            "Debug and optimize the full request lifecycle (client to database)",
            "Maintain the repo professionally: commits, README, architecture, deployment",
          ],
        },
        gate: {
          threshold: "Faculty Project Defence",
          criteria: [
            "Faculty project mock & live defence",
            "Explain, modify and debug your own build live under questioning",
            "Show you understand every architectural and technical decision made",
          ],
        },
        evidence: [
          "Complete project repository with clear folder structure",
          "Auth + database integration with robust migrations",
          "Deployed live web application accessible publicly",
          "Comprehensive README + architecture diagram docs",
          "API / database documentation (OpenAPI / ERD)",
          "Project walkthrough video + mock rubric score",
        ],
      },
      {
        id: "fullstack-m4",
        code: "M4",
        title: "Placement Readiness",
        canYouSayYes: "Can you solve a real problem independently?",
        practice: {
          items: [
            "Bring real users / customers to one of your built projects",
            "Required user count varies by project type (traction focus)",
            "Handle live traffic, user feedback, and production edge cases",
            "Complete deadline-based assignments under tight time pressure",
          ],
        },
        gate: {
          threshold: "Full Faculty Mock & Defence",
          criteria: [
            "Full faculty mock covering: Product / assignment defence",
            "Live debugging + code modification under pressure",
            "Real user metrics review (traction + user feedback)",
            "Deep technical + design questions",
          ],
        },
        evidence: [
          "Hackathon-style product submission link",
          "Deployed app with verified user onboarding proof",
          "User analytics dashboard / feedback metrics",
          "Deadline-based assignment submissions",
          "Live modification + debugging proof recording",
          "Faculty mock & defence official score",
        ],
      },
      {
        id: "fullstack-m5",
        code: "M5",
        title: "Expert / Brand Gate",
        canYouSayYes: "Can you clear an industry hiring bar?",
        practice: {
          items: [
            "Advanced JavaScript / React runtime internals and rendering patterns",
            "Node / Express architecture, resilient API design + authentication protocols",
            "SQL / NoSQL performance optimization and production debugging",
            "Scalability + system design trade-offs in modern stacks",
            "Architecture case studies dissection",
            "Communication + project defence with senior engineers",
            "Polish 1 portfolio-ready flagship project",
          ],
        },
        gate: {
          threshold: "Product Company Hiring Bar",
          criteria: [
            "Industry-expert interview with a senior engineer from a top product company",
            "Demonstrate technical depth, code quality, architecture, and production reasoning",
            "Clearing this opens the product-company hiring pipeline",
          ],
        },
        evidence: [
          "Expert panel scorecard",
          "Portfolio-ready flagship project",
          "GitHub repository + verified deployed app",
          "Project defence assessment rubric",
          "Detailed interview feedback report",
          "Industry validation outcome certification",
        ],
      },
    ],
  },
  {
    id: "aiml",
    name: "AI / ML Framework",
    subtitle: "From classical ML to Agentic AI, VLMs, and SOTA research",
    description:
      "Progress from classical ML mathematical foundations to Kaggle mastery, specialized tracks (Data Science, DL, GenAI), and forward-deployed agent systems.",
    icon: "BrainCircuit",
    badge: "Intelligence",
    color: "#8B5CF6",
    gradient: "from-purple-600 via-violet-600 to-fuchsia-500",
    milestones: [
      {
        id: "aiml-m1",
        code: "M1",
        title: "ML Foundation",
        canYouSayYes: "Can you model tabular data mathematically?",
        practice: {
          items: [
            "Solve the Deep-ML Classical ML Fundamentals paths",
            "Part 1 and Part 2 — both completely solved",
            "Master NumPy array manipulation and vectorized computations",
            "Implement classical algorithms (Linear/Logistic, Decision Trees, KNN) from first principles",
          ],
        },
        gate: {
          threshold: "70%+ Exam Score",
          criteria: [
            "Proctored test — pass at 70%+",
            "Covers: Python for data, NumPy / Pandas, probability & statistics, classical ML, evaluation metrics",
          ],
        },
        evidence: [
          "Deep-ML public profile link showing Part 1 & Part 2 100% completion",
          "Proctored exam score certificate",
        ],
      },
      {
        id: "aiml-m2",
        code: "M2",
        title: "Applied Proficiency",
        canYouSayYes: "Can you build and validate real ML models?",
        practice: {
          items: [
            "Publish 1 clean dataset on Kaggle or Hugging Face",
            "Make at least 1 verified submission to a Kaggle competition",
            "Build and defend 1 end-to-end project — classical ML, DL, or Agentic AI",
            "Set up strict validation pipelines preventing data leakage",
          ],
        },
        gate: {
          threshold: "70%+ AI Mock & Assignment",
          criteria: [
            "AI mock interview — 70%+",
            "Applied ML assignment — 70%+",
            "Covers: feature engineering, validation strategy, metric choice, error analysis",
          ],
        },
        evidence: [
          "Kaggle / Hugging Face dataset link",
          "Kaggle competition leaderboard submission link",
          "GitHub project repository link with thorough exploratory data analysis",
          "AI mock interview evaluation report",
          "Applied ML assignment score",
        ],
      },
      {
        id: "aiml-m3",
        code: "M3",
        title: "Specialization Track",
        canYouSayYes: "Can you engineer domain-specific AI solutions?",
        practice: {
          overview: "COMMON — ALL TRACKS: 2 peer-to-peer mock interviews in your specialization track.",
          items: [
            "Complete 2 peer-to-peer technical mock interviews in your track",
            "Choose your specialized path: S1 Data Scientist, S2 ML/DL Engineer, or S3 Generative AI",
          ],
        },
        subTracks: {
          s1: {
            name: "Data Scientist",
            code: "S1",
            practice: [
              "50 SQL / Pandas complex analytical questions on LeetCode",
              "1 end-to-end A/B testing + statistical analysis project with executive-ready insights",
              "Formulate business hypotheses, design experiments, and calculate sample size & power",
            ],
            evidence: [
              "P2P mock interview recording",
              "LeetCode profile showing 50+ solved SQL/Pandas problems",
              "Kaggle / GitHub insights link with executive presentation deck",
            ],
          },
          s2: {
            name: "ML / DL Engineer",
            code: "S2",
            practice: [
              "Build, train and deploy 1 ensemble DL application on the NST-SDC cluster",
              "Case study on a real-time production system — clone it and deploy it",
              "Optimize inference latency using TensorRT / ONNX or quantization",
            ],
            evidence: [
              "P2P mock interview recording",
              "Deployed application URL with low latency inference endpoints",
              "GitHub repository with benchmarked ensemble models",
            ],
          },
          s3: {
            name: "Generative AI",
            code: "S3",
            practice: [
              "Implement word-level and sub-word (BPE/WordPiece) tokenizers from scratch → push to GitHub",
              "Fine-tune 1 open-source VLM (Vision-Language Model) using LoRA / QLoRA on curated image data",
              "Evaluate generation quality using automated benchmarks & human eval",
            ],
            evidence: [
              "P2P mock interview recording",
              "GitHub repo with custom from-scratch tokenizer",
              "Hugging Face model repository link with LoRA weights and demo",
            ],
          },
        },
        gate: {
          threshold: "70%+ Exam & 50%+ P2P Mocks",
          criteria: [
            "Proctored exam on your chosen specialization — 70%+",
            "P2P mock interviews — 50%+ (can be evaluated via AI pipeline)",
          ],
        },
        evidence: [
          "All tracks: P2P mock recording and score sheet",
          "S1: LeetCode profile + Kaggle / GitHub insights link",
          "S2: Deployed application URL on NST-SDC cluster",
          "S3: GitHub repo (tokenizer) + Hugging Face model link",
        ],
      },
      {
        id: "aiml-m4",
        code: "M4",
        title: "Forward Deployed Engineer",
        canYouSayYes: "Can you ship autonomous AI agents into the wild?",
        practice: {
          items: [
            "CHOOSE ONE: 1 merged PR to a top AI / coding agent project OR build your own coding AI agent",
            "YOUR AGENT MUST COVER: Evals suite, Environment sandboxing, Computer-use / Tool execution, Deployment, and Experimentation logging",
          ],
        },
        gate: {
          threshold: "Faculty Mock Interview",
          criteria: [
            "Faculty mock interview covering: Fundamentals grilling",
            "Project defence and architecture breakdown",
            "Applied case challenge: 'How would you build system X?'",
          ],
        },
        evidence: [
          "Merged PR link to upstream OSS repo OR custom agent repository",
          "Deployed agent URL with working sandbox / tool interaction",
          "Evaluation benchmark results and error analysis matrix",
          "Faculty mock interview scorecard",
        ],
      },
      {
        id: "aiml-m5",
        code: "M5",
        title: "Expert",
        canYouSayYes: "Can you reproduce cutting-edge SOTA research?",
        practice: {
          items: [
            "Pick a SOTA paper from NeurIPS, ICML, or ICLR",
            "Implement or reproduce its code from scratch or verify author claims",
            "Conduct ablation experiments verifying key claims of the paper",
          ],
        },
        gate: {
          threshold: "Public Working Reproduction",
          criteria: [
            "Working reproduction in a public GitHub repository",
            "Reproduces key tables/charts within acceptable variance",
          ],
        },
        evidence: [
          "Public GitHub repository with reproducible codebase and scripts",
          "Written comprehensive technical report on the paper methodology & results",
          "Optional: Submit report to MLRC (ML Reproducibility Challenge) 2026",
        ],
      },
    ],
  },
  {
    id: "dsa",
    name: "DSA Interview Readiness",
    subtitle: "Master algorithmic problem-solving & crack top-tier technical rounds",
    description:
      "A disciplined ramp from foundational data structures to 400+ medium/hard problems, timed contests (1700+ rating), and MAANG mock rounds.",
    icon: "Binary",
    badge: "Algorithms",
    color: "#10B981",
    gradient: "from-emerald-600 via-teal-600 to-cyan-500",
    milestones: [
      {
        id: "dsa-m1",
        code: "M1",
        title: "Online Assessment",
        canYouSayYes: "Can you solve fundamental data structure problems?",
        practice: {
          items: [
            "Solve 100 problems (cumulative)",
            "Difficulty: Easy to Moderate only",
            "Attempt 2 rated contests (no rating floor requirement yet)",
          ],
          coreTopics: [
            "Arrays & Strings",
            "Hashing — maps and sets",
            "Two Pointers & Basic Sliding Window",
            "Sorting & Binary Search basics",
            "Stacks & Queues",
            "Linked Lists",
            "Recursion and basic Math",
            "Time & space complexity basics",
          ],
        },
        gate: {
          threshold: "80%+ in Proctored OA",
          criteria: [
            "Online Assessment — 80%+",
            "Proctored, classroom-administered timed coding test",
          ],
        },
        evidence: [
          "OA scorecard certificate (>= 80%)",
          "LeetCode public profile link with 100+ verified solved problems",
        ],
      },
      {
        id: "dsa-m2",
        code: "M2",
        title: "Core Proficiency",
        canYouSayYes: "Can you tackle medium-hard graph & DP problems?",
        practice: {
          items: [
            "250 problems cumulative, medium-weighted",
            "LeetCode 150 / Interview 150 sheet substantially complete",
            "5 LeetCode rated contests attempted",
            "Attain 1600+ contest rating",
          ],
          coreTopics: [
            "Trees & Binary Search Trees",
            "Graphs (BFS, DFS, Topological Sort)",
            "Dynamic Programming (1D & 2D)",
            "Heaps / Priority Queues",
            "Binary Search on Answer",
            "Advanced Sliding Window",
          ],
        },
        gate: {
          threshold: "80%+ AI Mock Interview",
          criteria: [
            "AI Mock Interview — 80%+",
            "Moderate–Hard problem mix with strict time constraints",
          ],
        },
        evidence: [
          "AI Mock interview scorecard (>= 80%)",
          "Sheet-completion tracker link (LeetCode 150)",
          "Contest rating proof (>= 1600 on LeetCode/Codeforces)",
        ],
      },
      {
        id: "dsa-m3",
        code: "M3",
        title: "Advanced / Depth",
        canYouSayYes: "Can you solve hard problems under interview conditions?",
        practice: {
          items: [
            "400+ problems cumulative, including at least 50+ Hard problems",
            "Interview 150 + one curated advanced sheet completely solved",
            "Attain 1700+ contest rating",
          ],
          coreTopics: [
            "Advanced Dynamic Programming (Digit DP, Bitmask DP)",
            "Advanced Graphs (Dijkstra, Bellman-Ford, Tarjan's SCC)",
            "Advanced Data Structures (Segment Tree, Trie, Disjoint Set)",
            "Bit Manipulation & Advanced Math",
          ],
        },
        gate: {
          threshold: "Average >= 85%",
          criteria: [
            "Average of OA + AI Mock — 85%+",
            "Both scores tracked individually (depth is tested, not just aggregate strength)",
          ],
        },
        evidence: [
          "OA official scorecard",
          "AI Mock scorecard",
          "Combined-average calculation report (>= 85%)",
          "Proof of 50+ Hard problems solved",
        ],
      },
      {
        id: "dsa-m4",
        code: "M4",
        title: "Interview Bar",
        canYouSayYes: "Can you communicate and think aloud like a senior hire?",
        practice: {
          items: [
            "Think-aloud practice — state complexity and justify your approach before typing code",
            "Handle live follow-up probing on space-time trade-offs and edge conditions",
            "Participate in 10+ LeetCode contests",
          ],
        },
        gate: {
          threshold: "Faculty Mock Rubric Pass",
          criteria: [
            "Clear the faculty mock — rubric pass",
            "45–60 minutes duration",
            "Live coding + follow-up probing against the DSA interview rubric",
          ],
        },
        evidence: [
          "Faculty rubric score sheet",
          "Full 45-60 minute interview recording",
          "Contest participation history (10+ contests)",
        ],
      },
      {
        id: "dsa-m5",
        code: "M5",
        title: "Expert / Brand Gate",
        canYouSayYes: "Can you clear tier-1 product engineering bars?",
        practice: {
          items: [
            "Company-tagged problem sets for your target companies (last 6–12 months)",
            "5 recorded peer-to-peer mock interviews with senior candidates",
          ],
        },
        gate: {
          threshold: "Tier-1 Product Hiring Bar",
          criteria: [
            "Clear the industry-expert level interview",
            "Target format: MAANG / tier-1 product engineer bar",
          ],
        },
        evidence: [
          "Expert panel scorecard",
          "5 peer-to-peer recorded mock links",
          "Company-tagged problem solving log",
        ],
      },
    ],
  },
  {
    id: "system_design",
    name: "System Design · LLD + HLD",
    subtitle: "Architect scalable distributed systems and object-oriented frameworks",
    description:
      "Covering low-level design patterns, SOLID principles, machine coding, and high-level distributed systems from Kafka to sharding.",
    icon: "Network",
    badge: "Architecture",
    color: "#F59E0B",
    gradient: "from-amber-600 via-orange-600 to-yellow-500",
    milestones: [
      {
        id: "sd-m1",
        code: "M1",
        title: "Foundation",
        canYouSayYes: "Can you design clean object-oriented class hierarchies?",
        practice: {
          items: [
            "LLD FUNDAMENTALS: OOP pillars — encapsulation, abstraction, inheritance, polymorphism",
            "SOLID principles deep understanding and practical refactoring",
            "UML basics — class diagrams + sequence diagrams",
            "Practice classic LLD: Parking Lot, Vending Machine, Library Management, Tic-Tac-Toe, Logging System",
            "HLD VOCABULARY (INTRO): Client-server, latency vs throughput, Vertical vs horizontal scaling, statelessness",
          ],
        },
        gate: {
          threshold: "70%+ Foundation LLD Mock",
          criteria: [
            "Foundation LLD mock — 70%+",
            "Model a small system with correct class relationships, abstractions, and responsibilities",
          ],
        },
        evidence: [
          "Public GitHub repo — class diagrams + working runnable code",
          "Linked to the master tracking sheet",
          "Diagnostic score report",
        ],
      },
      {
        id: "sd-m2",
        code: "M2",
        title: "Core Proficiency",
        canYouSayYes: "Can you clear 90-minute machine coding rounds?",
        practice: {
          items: [
            "DESIGN PATTERNS (ALL FAMILIES): Factory, Singleton, Builder, Strategy, Observer, Decorator, Adapter, State",
            "PRINCIPLES: DRY / KISS / YAGNI in real-world codebases",
            "Concurrency basics — thread safety, mutexes, locks, race condition prevention",
            "PRACTICE 8+ LLD PROBLEMS: Splitwise, Elevator System, BookMyShow Seat Booking, LRU Cache, Rate Limiter, Notification Dispatcher",
            "HLD BUILDING BLOCKS: Load balancers, caching layers, DB indexing, SQL vs NoSQL trade-offs, REST API design",
          ],
        },
        gate: {
          threshold: "70%+ Machine-Coding Mock",
          criteria: [
            "Machine-coding mock — 70%+",
            "Build a working, extensible LLD in 90–120 minutes",
            "Must compile, run, and handle edge cases gracefully",
          ],
        },
        evidence: [
          "GitHub repo of machine-coding solutions",
          "Pattern-usage log — which pattern was used and why",
          "Machine-coding mock scorecard",
        ],
      },
      {
        id: "sd-m3",
        code: "M3",
        title: "Advanced / Depth",
        canYouSayYes: "Can you design mid-scale distributed systems?",
        practice: {
          items: [
            "DISTRIBUTED SYSTEMS: CAP theorem, PACELC, consistency models (strong vs eventual)",
            "Replication, sharding / partitioning strategies, consistent hashing rings",
            "Master-slave architecture (DB read-write split strategy)",
            "INFRASTRUCTURE: Message queues (Kafka, RabbitMQ), Caching strategies + eviction policies, CDN, DB trade-offs",
            "Back-of-envelope estimation (QPS, storage, bandwidth calculations)",
            "PRACTICE 4–6 HLD DESIGNS: URL Shortener, Pastebin, Twitter Feed, WhatsApp, Instagram, YouTube, Uber, Notification Service",
            "1 written HLD design document / architectural approach blog post",
          ],
        },
        gate: {
          threshold: "HLD Timed Mock 60 min",
          criteria: [
            "HLD design mock — timed 60 min, proctored",
            "Design one mid-scale system end-to-end",
            "Scored on structured flow: Requirements → Estimation → High-level → Deep-dive → Trade-offs",
          ],
        },
        evidence: [
          "Design-doc repository with comprehensive architecture specifications",
          "1 published design write-up / blog post",
          "Proctored mock interview evaluation",
        ],
      },
      {
        id: "sd-m4",
        code: "M4",
        title: "Interview Bar",
        canYouSayYes: "Can you defend architectural choices under pressure?",
        practice: {
          items: [
            "3 recorded peer / self mocks — combined LLD + HLD mix",
            "Think-aloud practice under time constraints",
            "Justify every technology and component choice and name the alternative considered",
            "STRUCTURED-APPROACH DISCIPLINE: Clarify → Constraints/Estimation → API + Data Model → High-level → Deep-dive → Trade-offs → Scaling bottlenecks",
          ],
        },
        gate: {
          threshold: "Faculty Mock Rubric Pass",
          criteria: [
            "Clear the faculty mock — rubric pass",
            "60–90 minutes, combined round (1 LLD/machine coding segment + 1 HLD segment)",
            "Handle follow-ups + trade-off / bottleneck probing",
          ],
        },
        evidence: [
          "Rubric score sheet",
          "Recording of the 60-90 min combined session",
          "Feedback notes and trade-off justification log",
        ],
      },
      {
        id: "sd-m5",
        code: "M5",
        title: "Expert / Brand Gate",
        canYouSayYes: "Can you design systems at MAANG scale?",
        practice: {
          items: [
            "Company-tagged design problem sets for target companies (last 6–12 months)",
            "1 mock interview in the exact target-company format",
            "Study real-world architectures from engineering blogs (Netflix, Uber, Meta, Discord) and case studies",
            "Refined design-doc portfolio showcasing high-throughput architectures",
          ],
        },
        gate: {
          threshold: "Tier-1 Senior System Design Bar",
          criteria: [
            "Clear the industry-expert system design interview",
            "MAANG / tier-1 product engineer hiring bar",
            "Evaluated across both LLD and HLD depth",
          ],
        },
        evidence: [
          "Expert panel scorecard",
          "Complete design portfolio repository",
          "Detailed engineering blog study notes",
        ],
      },
    ],
  },
  {
    id: "core_cs",
    name: "Core CS Milestone Framework",
    subtitle: "Master Operating Systems, Computer Networks, and Computer Architecture",
    description:
      "Rigorous CS fundamentals covering GATE subsets, NPTEL IIT certifications, hybrid systems projects with benchmark harnesses, and open source / research contributions.",
    icon: "Cpu",
    badge: "Foundations",
    color: "#EC4899",
    gradient: "from-pink-600 via-rose-600 to-red-500",
    milestones: [
      {
        id: "core-m1",
        code: "M1",
        title: "Foundation",
        canYouSayYes: "Can you solve GATE CS core subject papers?",
        practice: {
          items: [
            "Solve GATE CS papers (2015–2026) for MCA, OS, and CN",
            "Complete 3 timed subsets (45 minutes each)",
            "Self-evaluate on a standard PYQ (Previous Year Questions) platform",
            "Prioritize fixing weakest subjects through diagnostic analysis",
          ],
        },
        gate: {
          threshold: ">= 55% Avg (No Subject < 40%)",
          criteria: [
            "Score >= 55% average across 3 subsets",
            "No subject score below 40%",
            "Meet qualifying conditions simultaneously in a single attempt window",
          ],
        },
        evidence: [
          "3 timed scorecards with verified timestamps",
          "Subject-wise score split (MCA/OS/CN)",
          "Extracted weak-topic list with remediation notes",
        ],
      },
      {
        id: "core-m2",
        code: "M2",
        title: "Certified Basics",
        canYouSayYes: "Can you earn IIT-backed credentials in core systems?",
        practice: {
          items: [
            "Enroll in NPTEL basic courses for OS, CN, and MCA",
            "Complete all weekly assignments diligently",
            "Prepare for proctored examinations conducted by IITs",
          ],
        },
        gate: {
          threshold: "IIT Proctored Clearance + Elite Band",
          criteria: [
            "Clear proctored IIT exams for all three subjects",
            "Achieve Elite band (>=60) in at least one course",
            "Meet minimum thresholds for both assignments and final exam",
          ],
        },
        evidence: [
          "3 certificates with visible numeric scores",
          "Separate assignment and exam scores breakdown per course",
          "Minimum one Elite band certificate",
        ],
      },
      {
        id: "core-m3",
        code: "M3",
        title: "Hybrid Build",
        canYouSayYes: "Can you build and benchmark a dual-subject system?",
        practice: {
          items: [
            "Build one substantial systems project spanning >=2 core subjects (e.g., custom HTTP/TCP server with thread pools and memory caching)",
            "Implement a benchmark harness for throughput and latency metrics",
            "Handle deliberate failure paths (e.g., timeouts, OOM, socket drops)",
            "Write automated tests and maintain steady commits",
          ],
        },
        gate: {
          threshold: "Points Card >= 12/20 & Faculty Spot-Check",
          criteria: [
            "Score >= 12/20 on self-scored points card",
            "Include mandatory benchmark metrics in README",
            "Faculty verification of repo, benchmarks, and commit history",
            "Pass random spot-checks for live modifications",
          ],
        },
        evidence: [
          "GitHub repo with filled points card in README",
          "Benchmark comparisons across >=3 configurations",
          ">= 1,500 lines of original code with >=10 commits over >=21 days",
          "Automated tests suite and design documentation",
        ],
      },
      {
        id: "core-m4",
        code: "M4",
        title: "Scored Credential",
        canYouSayYes: "Can you achieve elite credentials & high GATE ranks?",
        practice: {
          items: [
            "Obtain two advanced credentials (NPTEL advanced or Vendor certification)",
            "Sit for the official GATE CS exam",
            "Ensure at least one credential is Elite+Silver (>=76) or a passed vendor certification (e.g., AWS/Linux/RedHat)",
          ],
        },
        gate: {
          threshold: "NPTEL >= 76 / GATE Score >= 650",
          criteria: [
            "NPTEL advanced: >= 76 (Elite+Silver)",
            "Vendor: Pass with reported numeric score",
            "GATE: Scorecard in hand (Target Score >= 650 / AIR <= 2,000)",
          ],
        },
        evidence: [
          "Two credentials with visible numeric scores",
          "GATE admit card and scorecard PDF",
          "Official vendor score reports (not just badges)",
        ],
      },
      {
        id: "core-m5",
        code: "M5",
        title: "External Validation",
        canYouSayYes: "Can you contribute to production kernels or top publications?",
        practice: {
          items: [
            "Fulfill ANY TWO of the following three options:",
            "1. Open Source: Merged patch in a major systems project (e.g., Linux Kernel, Redis, PostgreSQL) or fix an open syzbot bug",
            "2. Publication: Accepted paper/poster, arXiv preprint, or selection in GSoC / LFX / Outreachy",
            "3. Area Depth: Literature review (>=15 papers) and reproduce one published result with benchmark comparisons",
          ],
        },
        gate: {
          threshold: "External Acceptance / Peer Review",
          criteria: [
            "External acceptance by maintainer, reviewer, or mentoring organization",
            "Faculty verification of artefact and authorship (no subjective grading)",
            "No strict deadlines (external dependencies acknowledged)",
          ],
        },
        evidence: [
          "Merged commit URL with verified authorship",
          "OR: syzbot bug ID, patch link, and reproducer output",
          "OR: Acceptance email, arXiv ID, or program selection letter",
          "OR: Literature review document and reproduction repository with metrics",
        ],
      },
    ],
  },
];
