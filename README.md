# JEEVANMITRA

## TEAM MEMBERS

1. SRINATH S
2. SHANMUGARAJA D
3. CHRISTINA DAMARIS E
4. HIRUTHI S
5. RAHUL M
6. SANJAY A

---

## TEAM: VALYRIANS

## Project Overview

**MastiCattle** is an AI-enabled multimodal bovine mastitis monitoring and early-risk prediction system designed for continuous dairy-cow health monitoring.

The system combines **milk parameters, udder thermal imaging, neckband-based behaviour monitoring, environmental data, animal history, and feeding behaviour** to identify abnormal patterns and generate cow-wise mastitis risk alerts.

The system also supports **milk segregation and an isolation/recovery ward** for flagged animals, enabling continuous monitoring against the cow's individual healthy baseline.

---

## Project Structure

```text
masticattle/
│
├── frontend/                        ← React + Vite + Tailwind CSS
│   └── src/
│       ├── components/              ← Reusable UI components
│       ├── pages/                   ← Farmer, Vet and Admin dashboards
│       ├── services/                ← API and backend services
│       ├── hooks/                   ← Custom React hooks
│       └── utils/                   ← Helper functions
│
├── ai-model/                        ← Multimodal mastitis prediction
│   ├── preprocessing/               ← Sensor data preprocessing
│   ├── features/                    ← Feature extraction
│   ├── training/                    ← Model training
│   └── inference/                   ← Risk prediction
│
├── pi-agent/                        ← Raspberry Pi edge processing
│   ├── sensors/                     ← Sensor interfaces
│   ├── thermal/                     ← Udder thermal processing
│   ├── milk/                        ← Milk parameter acquisition
│   └── agent.py                     ← Main processing loop
│
├── neckband/                        ← Smart cattle neckband
│   ├── firmware/
│   └── sensors/
│
├── database/                        ← Database schema and seed data
│   ├── migrations/
│   └── seeds/
│
├── docs/                            ← Project documentation
│   ├── architecture.md
│   ├── hardware.md
│   └── deployment.md
│
├── tests/                           ← Testing and validation
│
├── .gitignore
├── .env.example
└── README.md
```

---

## System Architecture

```text
CATTLE
  |
  +-- Smart Neckband
  |     ├── LSM6DS3TR-C
  |     ├── TMP117
  |     ├── nRF52840
  |     └── SX1262 E22-900T22D LoRa
  |
  +-- Udder Screening
  |     ├── 2 × MLX90640 Thermal Cameras
  |     ├── RGB Camera
  |     └── RFID
  |
  +-- Milk Screening
  |     ├── Milk Yield
  |     ├── Flow Rate
  |     ├── EC
  |     ├── pH
  |     └── Milk Temperature
  |
  +-- Environmental Data
  |
  +-- Historical Animal Data
          |
          v
   Raspberry Pi 4
          |
          v
   Multimodal Data Fusion
          |
          v
   Custom AI/ML Model
          |
          v
   Mastitis Risk Score
          |
     +----+----+
     |         |
   Normal    Moderate/High
     |         |
     v         v
 Main Milk   Milk Segregation
 Tank        + Alert
               |
               v
        Isolation & Recovery
```

---

## Hardware Stack

| Component                | Purpose                                   |
| ------------------------ | ----------------------------------------- |
| **LSM6DS3TR-C**          | Activity, posture and movement monitoring |
| **TMP117**               | Neck/skin temperature                     |
| **nRF52840**             | Neckband processing and sensor control    |
| **SX1262 E22-900T22D**   | Long-range LoRa communication             |
| **3.7 V 3000 mAh Li-Po** | Neckband power                            |
| **MLX90640 × 2**         | Four-quarter udder thermal monitoring     |
| **RGB Camera**           | Cow head alignment                        |
| **RFID Reader**          | Individual cow identification             |
| **Load Cell + HX711**    | Milk yield measurement                    |
| **EC Probe**             | Milk electrical conductivity              |
| **pH Probe**             | Milk pH                                   |
| **PT100 + MAX31865**     | Milk temperature                          |
| **Raspberry Pi 4**       | Edge processing and AI inference          |
| **LoRa Gateway**         | Neckband data reception                   |

---

## Multimodal Parameters

### Neckband

* Activity
* Walking
* Standing
* Lying
* Feeding behaviour
* Rumination-related motion
* Skin temperature
* Behavioural deviations

### Udder

Two thermal cameras monitor:

```text
Left Camera  → Left Front + Left Rear
Right Camera → Right Front + Right Rear
```

The RGB camera verifies that the cow's head is correctly positioned before thermal measurement.

### Milk

* Milk yield
* Milk flow
* Electrical conductivity
* pH
* Milk temperature

### Additional Data

* Cow ID
* Breed
* Age
* Lactation number
* Lactation stage
* Previous disease history
* Historical healthy baseline
* Environmental conditions
* Feeding quantity and intake

---

## AI Risk Assessment

MastiCattle does not rely on a single parameter such as EC.

```text
Milk Data
    +
Udder Thermal Data
    +
Neckband Behaviour
    +
Environmental Data
    +
Animal History
    +
Individual Baseline
        |
        v
Multimodal Fusion
        |
        v
Custom AI/ML Model
        |
        v
Mastitis Risk
```

Risk categories:

```text
NO RISK
LOW RISK
MODERATE RISK
HIGH RISK
```

---

## Milk Segregation

When the multimodal model identifies a significant mastitis risk:

```text
Milk Screening
      |
      v
AI Risk Assessment
      |
      +---- Normal/Low ----> Main Milk Tank
      |
      +---- Moderate/High -> Segregated Milk Tank
                                  |
                                  v
                            Farmer/Vet Alert
```

Milk diversion is based on the **combined risk assessment**, not EC alone.

---

## Isolation and Recovery

Flagged cattle are moved to an isolation/recovery cell.

The system establishes an **individual baseline when the cow enters isolation** and continuously compares new measurements against that baseline.

Additional recovery monitoring includes:

* Feed quantity
* Feed intake
* Feeding behaviour
* Activity
* Rumination
* Temperature
* Udder temperature
* Other available health parameters

```text
Isolation Entry
      |
      v
Individual Baseline
      |
      v
Continuous Monitoring
      |
      v
Trend Analysis
      |
   +--+--+
   |     |
Improving  Worsening
   |     |
   v     v
Continue  Vet Alert
Monitoring
   |
   v
Veterinary Review
   |
   v
Release Approval
```

---

## Tech Stack

| Layer           | Technology                |
| --------------- | ------------------------- |
| Edge Computing  | Raspberry Pi 4            |
| AI/ML           | Python, Machine Learning  |
| Neckband MCU    | nRF52840                  |
| Wireless        | SX1262 E22-900T22D LoRa   |
| Thermal Imaging | MLX90640                  |
| Identification  | RFID                      |
| Frontend        | React, Vite, Tailwind CSS |
| Database        | PostgreSQL / Supabase     |
| Communication   | LoRa, Wi-Fi               |
| Dashboard       | Web-based dashboard       |

---

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### AI Model

```bash
cd ai-model
pip install -r requirements.txt
python training/train.py
```

### Raspberry Pi Agent

```bash
cd pi-agent
pip install -r requirements.txt
python agent.py
```

---

## Key Features

* Individual-cow mastitis risk prediction
* Multimodal sensor fusion
* Continuous behavioural monitoring
* Four-quarter udder thermal monitoring
* Milk quality and yield monitoring
* Individual baseline comparison
* AI-based milk segregation
* Real-time farmer/veterinary alerts
* Isolation and recovery monitoring
* Historical health tracking
* Edge AI processing
* Scalable dairy-farm architecture

---

## Project Goal

MastiCattle aims to shift bovine mastitis management from **late detection to early prediction**, combining multiple physiological, behavioural and milk-quality signals into a single actionable health assessment.

---

## Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "feat: add my feature"
```

4. Push the branch

```bash
git push origin feature/my-feature
```

5. Open a Pull Request.
