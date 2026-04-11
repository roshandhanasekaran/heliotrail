# Benchmark: Battery Passport vs PV Passport Maturity

## Short answer
Battery passports are currently more mature than PV passports.

## Why batteries are ahead
- batteries already have a **sector-specific EU passport mandate**
- battery passport access tiers are clearer
- BatteryPass provides a concrete reference data model
- the ecosystem has converged further on modular data domains

## Comparative maturity table

| Area | Battery Passport | PV Passport |
|---|---|---|
| EU sector-specific mandate | Stronger | Emerging through ESPR framework |
| Ready reference model | Yes | Not yet equivalent |
| Product-specific field maturity | Higher | Medium to low |
| Use-phase data precedent | Strong | Emerging / optional |
| Circularity field maturity | Higher | Growing but fragmented |
| Industry convergence | Higher | Still forming |
| Recommended architecture pattern | Mature hybrid pattern | Best to borrow from battery model |

## BatteryPass modules worth reusing conceptually
- General product information
- Material composition
- Circularity
- Performance and durability
- Supply chain due diligence
- Carbon footprint

## What PV should reuse
Reuse the **structure**, not the battery-specific physics:
- identity model
- access tier thinking
- modular schema design
- evidence hashing
- verifiable credentials for trusted documentation
- lifecycle status model
- EoL / recycler data emphasis

## What PV must change
Replace battery-centric fields with PV-native ones:
- chemistry -> module technology
- energy throughput -> cumulative energy generation
- capacity fade -> power retention / degradation
- cell-specific battery events -> PV failure / hotspot / PID / delamination events

## Product strategy recommendation
Treat the battery-passport ecosystem as:
- **architectural benchmark**
- **data-modelling benchmark**
- **governance benchmark**

But present the PV schema as:
- **PV-specific**
- **delegated-act ready**
- **extensible until regulation hardens**
